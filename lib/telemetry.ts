"use client";

import { useEffect, useState } from "react";
import { BHARATI_ASSET_REGISTRY, MAITRI_ASSET_REGISTRY, DigitalTwinAsset } from "@/lib/3d/assetRegistry";
import { fetchStations, fetchStationDetail } from "@/lib/api";
import { StationWebSocket } from "@/lib/websocket";

export interface TelemetryState {
  isConnected: boolean;
  isBackendAlive: boolean;
  lastUpdated: string | null;
  error: string | null;
  metricsCount: number;
}

let globalState: TelemetryState = {
  isConnected: false,
  isBackendAlive: false,
  lastUpdated: null,
  error: null,
  metricsCount: 0,
};

const listeners = new Set<(state: TelemetryState) => void>();

function notifyListeners() {
  const snapshot = { ...globalState };
  listeners.forEach((listener) => listener(snapshot));
}

// Map incoming telemetry metrics directly into asset registry readings
export function updateAssetRegistryWithReading(
  stationId: string,
  assetId: string,
  metric: string,
  value: number | string,
  unit?: string
) {
  const st = stationId.toLowerCase();
  const registry = st === "bharati" ? BHARATI_ASSET_REGISTRY : MAITRI_ASSET_REGISTRY;

  // Find target asset in registry
  let targetAsset: DigitalTwinAsset | null = registry[assetId] || null;

  // If asset_id is station-wide (like ENV-MAITRI or ENV-BHARATI), map to main building
  if (!targetAsset) {
    if (assetId.includes("MAITRI") || assetId.includes("MAI")) {
      targetAsset = registry["BLD-MAI-MAIN"] || null;
    } else if (assetId.includes("BHARATI") || assetId.includes("BHA")) {
      targetAsset = registry["BLD-BHA-MAIN"] || null;
    }
  }

  if (targetAsset) {
    if (!targetAsset.readings) targetAsset.readings = {};

    const keyMap: Record<string, string> = {
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
    };

    const targetKey = keyMap[metric] || metric;
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

    globalState.metricsCount += 1;
    globalState.lastUpdated = new Date().toLocaleTimeString();
    globalState.isConnected = true;
    globalState.error = null;
    notifyListeners();
  }
}

export function initializeTelemetryService() {
  let isInitialized = false;

  async function checkBackendAndConnect() {
    try {
      // 1. Initial REST API handshake
      const stations = await fetchStations();
      if (!stations || !Array.isArray(stations)) {
        throw new Error("Invalid response from stations backend API.");
      }

      globalState.isBackendAlive = true;
      globalState.error = null;
      notifyListeners();

      // 2. Fetch full detail for Maitri & Bharati to populate initial live DB values
      for (const stId of ["maitri", "bharati"]) {
        try {
          const detail = await fetchStationDetail(stId);
          if (detail && detail.assets) {
            for (const [aid, assetData] of Object.entries<any>(detail.assets)) {
              if (assetData.sensor_readings) {
                for (const [metric, val] of Object.entries<any>(assetData.sensor_readings)) {
                  updateAssetRegistryWithReading(stId, aid, metric, val);
                }
              }
            }
          }
        } catch (e) {
          console.warn(`Could not load initial DB detail for station ${stId}:`, e);
        }
      }

      // 3. Connect WebSockets for real-time streaming
      const wsMaitri = new StationWebSocket("maitri", (data) => {
        if (data.type === "telemetry_update" || data.metric) {
          updateAssetRegistryWithReading("maitri", data.asset_id, data.metric, data.value, data.unit);
        }
      });
      wsMaitri.connect();

      const wsBharati = new StationWebSocket("bharati", (data) => {
        if (data.type === "telemetry_update" || data.metric) {
          updateAssetRegistryWithReading("bharati", data.asset_id, data.metric, data.value, data.unit);
        }
      });
      wsBharati.connect();

    } catch (err: any) {
      console.error("Telemetry Service Connection Failure:", err);
      globalState.isBackendAlive = false;
      globalState.isConnected = false;
      globalState.error = `CRITICAL TELEMETRY ERROR: Backend Database / Simulator is unavailable at ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}. Live data feed interrupted.`;
      notifyListeners();
    }
  }

  if (!isInitialized) {
    isInitialized = true;
    checkBackendAndConnect();
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
