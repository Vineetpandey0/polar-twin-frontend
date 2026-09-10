"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { SatelliteMetadata } from "@/app/api/satcom/tle/route";
import {
  SatelliteLiveTelemetry,
  propagateSatellite,
  GROUND_STATIONS,
} from "@/lib/satcom/satelliteEngine";
import SatcomTelemetryPanel from "@/components/map/SatcomTelemetryPanel";
import {
  Globe,
  Radio,
  Layers,
  Compass,
  Maximize2,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

// Client-only dynamic import of 3D Polar Globe Canvas
const PolarGlobeCanvas = dynamic(
  () => import("@/components/map/PolarGlobeCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-[#070A0F] rounded-sm border border-[#1E293B]">
        <div className="w-10 h-10 border-2 border-[#38BDF8]/30 border-t-[#38BDF8] rounded-full animate-spin mb-3" />
        <span className="text-xs text-[#38BDF8] font-mono tracking-wider">
          INITIALISING 3D POLAR STEREOGRAPHIC GLOBE...
        </span>
      </div>
    ),
  }
);

export default function OperationsMapPage() {
  const [satellitesMeta, setSatellitesMeta] = useState<SatelliteMetadata[]>([]);
  const [telemetries, setTelemetries] = useState<SatelliteLiveTelemetry[]>([]);
  const [selectedSatId, setSelectedSatId] = useState<number | null>(null);

  // Layer Toggles
  const [showOrbits, setShowOrbits] = useState<boolean>(true);
  const [showBeams, setShowBeams] = useState<boolean>(true);
  const [showGraticules, setShowGraticules] = useState<boolean>(true);
  const [nasaGibsActive, setNasaGibsActive] = useState<boolean>(false);

  // Metadata & Freshness
  const [tleFreshness, setTleFreshness] = useState<string>("LOADING TLE...");
  const [isStale, setIsStale] = useState<boolean>(false);
  const [cachedAt, setCachedAt] = useState<string>("");
  const [gibsMetadata, setGibsMetadata] = useState<any>(null);

  // 1. Initial Data Fetch (Fetched ONCE on mount; zero repeated network polling)
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        // Fetch TLEs
        const tleRes = await fetch("/api/satcom/tle");
        if (tleRes.ok) {
          const tleData = await tleRes.json();
          if (isMounted) {
            setSatellitesMeta(tleData.satellites || []);
            setTleFreshness(tleData.freshnessLabel || "ACTIVE");
            setIsStale(tleData.isStale ?? false);
            setCachedAt(tleData.cachedAt || "");
          }
        }

        // Fetch NASA GIBS Metadata
        const gibsRes = await fetch("/api/map/gibs");
        if (gibsRes.ok) {
          const gibsData = await gibsRes.json();
          if (isMounted) {
            setGibsMetadata(gibsData);
          }
        }
      } catch (err) {
        if (isMounted) {
          setTleFreshness("STALE — LOCAL CACHE");
          setIsStale(true);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Real-time Client-side Orbital Propagation (1Hz tick with zero network calls)
  useEffect(() => {
    if (satellitesMeta.length === 0) return;

    const tickPropagation = () => {
      const now = new Date();
      const newTelemetries: SatelliteLiveTelemetry[] = [];

      for (const sat of satellitesMeta) {
        const tel = propagateSatellite(sat, now, 10);
        if (tel) newTelemetries.push(tel);
      }

      setTelemetries(newTelemetries);
    };

    tickPropagation();
    const interval = setInterval(tickPropagation, 1000); // 1-second cadence

    return () => clearInterval(interval);
  }, [satellitesMeta]);

  return (
    <div className="space-y-4 max-w-[1700px] mx-auto pb-8 h-[calc(100vh-4.5rem)] flex flex-col">
      {/* Header Bar */}
      <div className="bg-[#0F1722] p-4 rounded-sm border border-[#1E293B] shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2.5 mb-1">
              <span className="bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-0.5 rounded-sm text-[11px] font-mono font-semibold">
                MISSION OPERATIONS // GEOSPATIAL
              </span>
              <span className="text-[#8CA1B6] text-xs font-mono">
                WGS84 3D Spherical Polar Projection (South Pole Centered)
              </span>
            </div>
            <h1 className="text-2xl lg:text-[28px] font-bold text-[#E2EAF4] tracking-wide leading-tight flex items-center space-x-3">
              <span>Live Polar Operations Map</span>
              <span className="text-[#38BDF8] text-xs font-mono font-medium px-2 py-0.5 bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-sm">
                ISRO / CELESTRAK SATCOM TELEMETRY
              </span>
            </h1>
          </div>

          {/* Layer Control Toggles */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0 text-xs font-mono">
            <button
              onClick={() => setShowOrbits(!showOrbits)}
              className={`px-2.5 py-1.5 rounded-sm border transition-colors ${
                showOrbits
                  ? "bg-[#131D2B] text-[#38BDF8] border-[#38BDF8] font-bold"
                  : "bg-[#090D14] text-[#8CA1B6] border-[#1E293B]"
              }`}
            >
              [ORBITS: {showOrbits ? "ON" : "OFF"}]
            </button>

            <button
              onClick={() => setShowBeams(!showBeams)}
              className={`px-2.5 py-1.5 rounded-sm border transition-colors ${
                showBeams
                  ? "bg-[#131D2B] text-[#34D399] border-[#34D399] font-bold"
                  : "bg-[#090D14] text-[#8CA1B6] border-[#1E293B]"
              }`}
            >
              [SIGNALS: {showBeams ? "ON" : "OFF"}]
            </button>

            <button
              onClick={() => setShowGraticules(!showGraticules)}
              className={`px-2.5 py-1.5 rounded-sm border transition-colors ${
                showGraticules
                  ? "bg-[#131D2B] text-[#E2EAF4] border-[#38BDF8] font-bold"
                  : "bg-[#090D14] text-[#8CA1B6] border-[#1E293B]"
              }`}
            >
              [POLAR GRID: {showGraticules ? "ON" : "OFF"}]
            </button>

            <button
              onClick={() => setNasaGibsActive(!nasaGibsActive)}
              className={`px-2.5 py-1.5 rounded-sm border transition-colors ${
                nasaGibsActive
                  ? "bg-[#131D2B] text-[#FBBF24] border-[#FBBF24] font-bold"
                  : "bg-[#090D14] text-[#8CA1B6] border-[#1E293B]"
              }`}
              title="Toggle NASA GIBS Daily MODIS Reflectance Layer"
            >
              [NASA GIBS: {nasaGibsActive ? "ACTIVE" : "OFF"}]
            </button>
          </div>
        </div>

        {/* Station Coordinates Quick Reference */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-2.5 border-t border-[#1E293B] text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-sm bg-[#FBBF24]" />
            <span className="text-[#8CA1B6]">MAITRI STATION:</span>
            <span className="text-[#E2EAF4] font-bold">70°46′S, 11°44′E (117m)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-sm bg-[#38BDF8]" />
            <span className="text-[#8CA1B6]">BHARATI (AGEOS):</span>
            <span className="text-[#E2EAF4] font-bold">69°24′S, 76°11′E (35m)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#8CA1B6]">TRACKED CONSTELLATION:</span>
            <span className="text-[#38BDF8] font-bold">{satellitesMeta.length} SATELLITES</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#8CA1B6]">DATA FRESHNESS:</span>
            <span className={isStale ? "text-[#FBBF24]" : "text-[#34D399]"}>
              {tleFreshness}
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Layout: 70% 3D Polar Globe / 30% SCADA Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Left Column: 3D Polar Globe Canvas (8 Cols) */}
        <div className="lg:col-span-8 h-full min-h-[500px]">
          <PolarGlobeCanvas
            telemetries={telemetries}
            selectedSatId={selectedSatId}
            onSelectSat={setSelectedSatId}
            showOrbits={showOrbits}
            showBeams={showBeams}
            showGraticules={showGraticules}
            nasaGibsActive={nasaGibsActive}
            gibsMetadata={gibsMetadata}
          />
        </div>

        {/* Right Column: Satcom Telemetry & Look Angles Panel (4 Cols) */}
        <div className="lg:col-span-4 h-full min-h-[500px]">
          <SatcomTelemetryPanel
            telemetries={telemetries}
            selectedSatId={selectedSatId}
            onSelectSat={setSelectedSatId}
            tleFreshness={tleFreshness}
            isStale={isStale}
            cachedAt={cachedAt}
          />
        </div>
      </div>
    </div>
  );
}
