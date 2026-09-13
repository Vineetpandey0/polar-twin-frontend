"use client";

import { useEffect, useState } from "react";
import { BHARATI_ASSET_REGISTRY, MAITRI_ASSET_REGISTRY, DigitalTwinAsset } from "@/lib/3d/assetRegistry";
import { fetchStations, fetchStationDetail, fetchTelemetryStatus } from "@/lib/api";
import { StationWebSocket } from "@/lib/websocket";

export interface TelemetryState {
  isConnected: boolean; // True ONLY when simulator is actively transmitting live ticks
  isBackendAlive: boolean; // True when backend REST API is responsive
  isWsConnected: boolean; // True when WebSocket link is open
  isSimulatorConnected: boolean; // True when live telemetry ticks arrived within watchdog window
  lastUpdated: string | null; // Time of last live simulator tick
  secondsSinceLastTick: number | null;
  error: string | null;
  metricsCount: number; // Count of genuine live ticks ingested
  isChecking: boolean;
}

let lastTickTimestamp: number | null = null;
let wsStationStatuses: { maitri: boolean; bharati: boolean } = { maitri: false, bharati: false };

let globalState: TelemetryState = {
  isConnected: false,
  isBackendAlive: false,
  isWsConnected: false,
  isSimulatorConnected: false,
  lastUpdated: null,
  secondsSinceLastTick: null,
  error: null,
  metricsCount: 0,
  isChecking: false,
};

const listeners = new Set<(state: TelemetryState) => void>();

function notifyListeners() {
  const snapshot = { ...globalState };
  listeners.forEach((listener) => listener(snapshot));
}

const METRIC_KEY_MAP: Record<string, string> = {
  ambient_temperature: "ambientTemp",
  cabin_temp: "cabinTemp",
  temperature: "temp",
  fuel_consumption: "fuelConsumption",
  power_demand_kw: "powerDemand",
  totalBaseLoad: "totalBaseLoad",
  total_base_load: "totalBaseLoad",
  electricalPower: "electricalPower",
  thermalOutput: "thermalOutput",
  intake_flow: "intakeFlow",
  seawater_flow: "seawaterFlow",
  seawaterFlow: "seawaterFlow",
  seawaterTemp: "seawaterTemp",
  signal_strength: "signalStrength",
  downlinkRate: "downlinkRate",
  downlink_rate: "downlinkRate",
  soc: "soc",
  voltage: "voltage",
  busVoltage: "busVoltage",
  wind_speed: "windSpeed",
  rpm: "rpm",
  vibration: "vibration",
  wind_chill: "windChill",
};

function applyReadingToAsset(
  targetAsset: DigitalTwinAsset,
  metric: string,
  value: number | string,
  unit?: string
) {
  if (!targetAsset.readings) targetAsset.readings = {};
  const targetKey = METRIC_KEY_MAP[metric] || metric;
  const numVal = typeof value === "number" ? Math.round(value * 10) / 10 : value;

  const readingsMap = targetAsset.readings as Record<string, any>;
  if (readingsMap[targetKey] && typeof readingsMap[targetKey] === "object") {
    readingsMap[targetKey].value = numVal;
    if (unit) readingsMap[targetKey].unit = unit;
  } else {
    readingsMap[targetKey] = {
      value: numVal,
      unit: unit || "",
      label: metric.replace(/_/g, " ").toUpperCase(),
    };
  }
}

function resolveAssetInRegistry(stationId: string, assetId: string): DigitalTwinAsset | null {
  const st = stationId.toLowerCase();
  const registry = st === "bharati" ? BHARATI_ASSET_REGISTRY : MAITRI_ASSET_REGISTRY;
  let targetAsset: DigitalTwinAsset | null = registry[assetId] || null;

  if (!targetAsset) {
    if (assetId.includes("MAITRI") || assetId.includes("MAI")) {
      targetAsset = registry["BLD-MAI-MAIN"] || null;
    } else if (assetId.includes("BHARATI") || assetId.includes("BHA")) {
      targetAsset = registry["BLD-BHA-MAIN"] || null;
    }
  }
  return targetAsset;
}

// 1. Static hydration from DB (does NOT mark simulator as connected or increment live ticks)
export function seedAssetRegistry(
  stationId: string,
  assetId: string,
  metric: string,
  value: number | string,
  unit?: string
) {
  const asset = resolveAssetInRegistry(stationId, assetId);
  if (asset) {
    applyReadingToAsset(asset, metric, value, unit);
  }
}

// 2. Genuine Live Telemetry Ticks received via WebSocket / MQTT Ingestion
export function handleLiveTelemetryTick(
  stationId: string,
  assetId: string,
  metric: string,
  value: number | string,
  unit?: string
) {
  const asset = resolveAssetInRegistry(stationId, assetId);
  if (asset) {
    applyReadingToAsset(asset, metric, value, unit);
  }

  const now = Date.now();
  lastTickTimestamp = now;

  globalState.metricsCount += 1;
  globalState.lastUpdated = new Date().toLocaleTimeString();
  globalState.secondsSinceLastTick = 0;
  globalState.isSimulatorConnected = true;
  globalState.isConnected = true;
  globalState.isBackendAlive = true;
  globalState.error = null;
  notifyListeners();
}

// Backward compatibility alias for legacy callers
export const updateAssetRegistryWithReading = handleLiveTelemetryTick;

let wsMaitriInstance: StationWebSocket | null = null;
let wsBharatiInstance: StationWebSocket | null = null;
let connectionPollingTimer: any = null;
let watchdogTimer: any = null;
let isTelemetryServiceInitialized = false;

// Staleness watchdog: checks if telemetry ticks stopped (allows 10-min cadence + 5-min margin = 900s)
const STALENESS_THRESHOLD_SECONDS = 900;

function startStalenessWatchdog() {
  if (watchdogTimer) return;
  watchdogTimer = setInterval(() => {
    if (lastTickTimestamp) {
      const elapsedSeconds = Math.round((Date.now() - lastTickTimestamp) / 1000);
      globalState.secondsSinceLastTick = elapsedSeconds;

      // If no ticks in >15m, simulator is paused, stopped, or disconnected
      if (elapsedSeconds > STALENESS_THRESHOLD_SECONDS) {
        if (globalState.isSimulatorConnected) {
          globalState.isSimulatorConnected = false;
          globalState.isConnected = false;
          notifyListeners();
        }
      }
    }
  }, 2000);
}

let isCheckInProgress = false;
let lastSuccessfulHandshakeTimestamp = 0;
let consecutiveFailures = 0;

export async function checkBackendAndConnect(force = false) {
  const now = Date.now();

  // If already checking, prevent overlapping requests
  if (isCheckInProgress) return;

  // If backend was successfully verified in the last 12 seconds, do not re-run full handshake
  if (!force && globalState.isBackendAlive && now - lastSuccessfulHandshakeTimestamp < 12000) {
    return;
  }

  isCheckInProgress = true;
  globalState.isChecking = true;
  notifyListeners();

  try {
    // 1. Handshake with backend REST API
    const stations = await fetchStations();
    if (!stations || !Array.isArray(stations) || stations.length === 0) {
      throw new Error("Invalid response from stations backend API.");
    }

    lastSuccessfulHandshakeTimestamp = Date.now();
    consecutiveFailures = 0;
    globalState.isBackendAlive = true;
    globalState.error = null;
    globalState.isChecking = false;
    notifyListeners();

    // 2. Check telemetry status endpoint for simulator health
    try {
      const statusData = await fetchTelemetryStatus();
      if (statusData && typeof statusData.simulator_connected === "boolean") {
        if (statusData.simulator_connected) {
          globalState.isSimulatorConnected = true;
          globalState.isConnected = true;
          if (statusData.last_telemetry_time) {
            globalState.lastUpdated = new Date(statusData.last_telemetry_time).toLocaleTimeString();
          }
          if (typeof statusData.seconds_since_last_tick === "number") {
            globalState.secondsSinceLastTick = statusData.seconds_since_last_tick;
          }
        }
      }
    } catch {
      // Non-critical: status endpoint may still be warming up
    }

    // 3. Hydrate initial DB assets (without faking live ticks)
    for (const stId of ["maitri", "bharati"]) {
      try {
        const detail = await fetchStationDetail(stId);
        if (detail && detail.assets) {
          for (const [aid, assetData] of Object.entries<any>(detail.assets)) {
            if (assetData.sensor_readings) {
              for (const [metric, val] of Object.entries<any>(assetData.sensor_readings)) {
                seedAssetRegistry(stId, aid, metric, val);
              }
            }
          }
        }
      } catch (e) {
        console.warn(`Could not load DB detail for station ${stId}:`, e);
      }
    }

    // 4. Connect WebSockets for genuine live telemetry streaming
    const handleWsStatus = (station: "maitri" | "bharati", status: string) => {
      wsStationStatuses[station] = status === "OPEN";
      const anyWsOpen = wsStationStatuses.maitri || wsStationStatuses.bharati;
      globalState.isWsConnected = anyWsOpen;

      if (anyWsOpen) {
        globalState.isBackendAlive = true;
        globalState.error = null;
        consecutiveFailures = 0;
      }
      notifyListeners();
    };

    if (!wsMaitriInstance) {
      wsMaitriInstance = new StationWebSocket(
        "maitri",
        (data) => {
          if (data.type === "telemetry_update" || data.metric) {
            handleLiveTelemetryTick("maitri", data.asset_id, data.metric, data.value, data.unit);
          }
        },
        (status) => handleWsStatus("maitri", status)
      );
      wsMaitriInstance.connect();
    }

    if (!wsBharatiInstance) {
      wsBharatiInstance = new StationWebSocket(
        "bharati",
        (data) => {
          if (data.type === "telemetry_update" || data.metric) {
            handleLiveTelemetryTick("bharati", data.asset_id, data.metric, data.value, data.unit);
          }
        },
        (status) => handleWsStatus("bharati", status)
      );
      wsBharatiInstance.connect();
    }

  } catch (err: any) {
    consecutiveFailures += 1;
    globalState.isChecking = false;

    // Only declare backend offline if we have failed multiple consecutive checks OR were never connected
    if (consecutiveFailures >= 3 || !globalState.isBackendAlive) {
      globalState.isBackendAlive = false;
      globalState.isWsConnected = false;
      globalState.isSimulatorConnected = false;
      globalState.isConnected = false;

      const targetApi =
        process.env.NEXT_PUBLIC_API_URL || "https://polar-twin-backend.up.railway.app";
      globalState.error = `Backend API & Telemetry Simulator unreachable at ${targetApi}. Verify that the backend server is reachable.`;
      notifyListeners();
    }
  } finally {
    isCheckInProgress = false;
  }
}

export function retryConnection() {
  checkBackendAndConnect(true);
}

export function initializeTelemetryService() {
  if (isTelemetryServiceInitialized) return;
  isTelemetryServiceInitialized = true;

  startStalenessWatchdog();
  checkBackendAndConnect(true);

  if (!connectionPollingTimer) {
    connectionPollingTimer = setInterval(() => {
      // If backend is offline, probe every 4 seconds to reconnect
      if (!globalState.isBackendAlive) {
        checkBackendAndConnect(true);
        return;
      }

      // If backend is online, do NOT interrupt active streaming or standby.
      // Simply check /telemetry/status every 12 seconds to keep stats synchronized.
      fetchTelemetryStatus()
        .then((statusData) => {
          consecutiveFailures = 0;
          if (statusData && typeof statusData.simulator_connected === "boolean") {
            if (statusData.simulator_connected && !globalState.isSimulatorConnected) {
              globalState.isSimulatorConnected = true;
              globalState.isConnected = true;
              if (statusData.last_telemetry_time) {
                globalState.lastUpdated = new Date(statusData.last_telemetry_time).toLocaleTimeString();
              }
              notifyListeners();
            }
          }
        })
        .catch(() => {
          consecutiveFailures += 1;
          // Only declare offline after multiple confirmed consecutive failures
          if (consecutiveFailures >= 3 && !globalState.isWsConnected) {
            globalState.isBackendAlive = false;
            globalState.isWsConnected = false;
            globalState.isSimulatorConnected = false;
            globalState.isConnected = false;
            globalState.error = "Backend telemetry connection lost.";
            notifyListeners();
          }
        });
    }, 12000);
  }
}

export function useTelemetry(): TelemetryState {
  const [state, setState] = useState<TelemetryState>(globalState);

  useEffect(() => {
    listeners.add(setState);
    initializeTelemetryService();
    return () => {
      listeners.delete(setState);
    };
  }, []);

  return state;
}

