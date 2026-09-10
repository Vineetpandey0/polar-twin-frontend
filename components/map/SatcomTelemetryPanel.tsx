"use client";

import React, { useState } from "react";
import {
  SatelliteLiveTelemetry,
  GROUND_STATIONS,
} from "@/lib/satcom/satelliteEngine";
import {
  Radio,
  Clock,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Satellite,
  Activity,
} from "lucide-react";

interface SatcomTelemetryPanelProps {
  telemetries: SatelliteLiveTelemetry[];
  selectedSatId: number | null;
  onSelectSat: (id: number | null) => void;
  tleFreshness: string;
  isStale: boolean;
  cachedAt: string;
}

export default function SatcomTelemetryPanel({
  telemetries,
  selectedSatId,
  onSelectSat,
  tleFreshness,
  isStale,
  cachedAt,
}: SatcomTelemetryPanelProps) {
  const [stationFilter, setStationFilter] = useState<"all" | "bharati" | "maitri">("all");

  const filteredTelemetries = telemetries.filter((t) => {
    if (stationFilter === "bharati") return t.metadata.targetStation !== "MAITRI COMMS";
    if (stationFilter === "maitri") return t.metadata.targetStation !== "BHARATI AGEOS";
    return true;
  });

  return (
    <div className="bg-[#0F1722] p-3.5 rounded-sm border border-[#1E293B] flex flex-col h-full overflow-hidden text-xs">
      {/* Header Bar */}
      <div className="space-y-2 pb-3 border-b border-[#1E293B] shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-[#38BDF8]" />
            <h2 className="font-semibold text-[17px] text-[#E2EAF4] uppercase tracking-wider leading-snug">
              Satcom Telemetry & Pass Predictor
            </h2>
          </div>
          <span
            className={`px-2 py-0.5 rounded-sm font-mono text-[10px] font-semibold border flex items-center space-x-1 ${
              isStale
                ? "bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/30"
                : "bg-[#34D399]/10 text-[#34D399] border-[#34D399]/30"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isStale ? "bg-[#FBBF24]" : "bg-[#34D399] animate-pulse"
              }`}
            />
            <span>{tleFreshness}</span>
          </span>
        </div>

        {/* Station Filter Pills */}
        <div className="flex items-center space-x-1 pt-1">
          {[
            { id: "all", label: "ALL ORBITS", color: "#38BDF8" },
            { id: "bharati", label: "BHARATI AGEOS", color: "#38BDF8" },
            { id: "maitri", label: "MAITRI COMMS", color: "#FBBF24" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStationFilter(tab.id as any)}
              className={`px-2 py-1 rounded-sm text-[11px] font-mono transition-colors ${
                stationFilter === tab.id
                  ? "bg-[#131D2B] text-[#E2EAF4] border border-[#38BDF8] font-bold"
                  : "bg-[#090D14] text-[#8CA1B6] hover:bg-[#131D2B] border border-[#1E293B]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Satellite Telemetry List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1">
        {filteredTelemetries.map((t) => {
          const isSelected = selectedSatId === t.metadata.id;
          const lookMaitri = t.lookAngles.maitri;
          const lookBharati = t.lookAngles.bharati;

          const activeStation =
            t.metadata.targetStation === "MAITRI COMMS"
              ? lookMaitri
              : lookBharati;

          const isPassActive = activeStation.isInView;

          return (
            <div
              key={t.metadata.id}
              onClick={() => onSelectSat(isSelected ? null : t.metadata.id)}
              className={`p-3 rounded-sm border transition-colors cursor-pointer ${
                isSelected
                  ? "bg-[#131D2B] border-[#38BDF8]"
                  : isPassActive
                  ? "bg-[#090D14] border-[#34D399]/60 hover:border-[#34D399]"
                  : "bg-[#090D14] border-[#1E293B] hover:border-[#334155]"
              }`}
            >
              {/* Satellite Title & Status Chip */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-2 h-2 rounded-sm shrink-0 ${
                        isPassActive ? "bg-[#34D399] animate-ping" : "bg-[#8CA1B6]"
                      }`}
                    />
                    <h3 className="font-semibold text-[15px] text-[#E2EAF4] tracking-wide leading-snug">
                      {t.metadata.name}
                    </h3>
                  </div>
                  <span className="text-[10px] text-[#8CA1B6] font-mono block mt-0.5">
                    NORAD {t.metadata.noradId} // {t.metadata.orbitType} // {t.metadata.band}
                  </span>
                </div>

                {/* Pass Status Badge */}
                <div>
                  {isPassActive ? (
                    <span className="px-2 py-0.5 rounded-sm bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40 font-mono text-[10px] font-bold">
                      IN VIEW (EL {activeStation.elevationDeg}°)
                    </span>
                  ) : activeStation.nextAosMinutes !== null ? (
                    <span className="px-2 py-0.5 rounded-sm bg-[#090D14] text-[#FBBF24] border border-[#FBBF24]/30 font-mono text-[10px]">
                      AOS IN {activeStation.nextAosMinutes}m
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-sm bg-[#090D14] text-[#8CA1B6] border border-[#1E293B] font-mono text-[10px]">
                      GEO FIXED
                    </span>
                  )}
                </div>
              </div>

              {/* Real-time Sub-Satellite Metrics Grid */}
              <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-[#1E293B] text-[11px] font-mono">
                <div className="bg-[#070A0F] p-1.5 rounded-sm border border-[#1E293B]">
                  <span className="text-[9px] text-[#8CA1B6] block">ALTITUDE</span>
                  <span className="text-[#E2EAF4] font-bold">{t.altKm} km</span>
                </div>
                <div className="bg-[#070A0F] p-1.5 rounded-sm border border-[#1E293B]">
                  <span className="text-[9px] text-[#8CA1B6] block">VELOCITY</span>
                  <span className="text-[#38BDF8] font-bold">{t.velocityKmS} km/s</span>
                </div>
                <div className="bg-[#070A0F] p-1.5 rounded-sm border border-[#1E293B]">
                  <span className="text-[9px] text-[#8CA1B6] block">SUB-SAT LAT/LON</span>
                  <span className="text-[#E2EAF4] font-bold">
                    {t.lat.toFixed(1)}°, {t.lon.toFixed(1)}°
                  </span>
                </div>
              </div>

              {/* Look Angles from Both Stations */}
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#1E293B] text-[10px] font-mono">
                {/* Bharati Look Angles */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between text-[#8CA1B6]">
                    <span className="text-[#38BDF8] font-bold">BHARATI (AGEOS):</span>
                    <span className={lookBharati.isInView ? "text-[#34D399] font-bold" : "text-[#8CA1B6]"}>
                      {lookBharati.elevationDeg > 0 ? `+${lookBharati.elevationDeg}°` : `${lookBharati.elevationDeg}°`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#5B7086]">
                    <span>AZ: {lookBharati.azimuthDeg}°</span>
                    <span>{lookBharati.rangeKm} km</span>
                  </div>
                </div>

                {/* Maitri Look Angles */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between text-[#8CA1B6]">
                    <span className="text-[#FBBF24] font-bold">MAITRI (COMMS):</span>
                    <span className={lookMaitri.isInView ? "text-[#34D399] font-bold" : "text-[#8CA1B6]"}>
                      {lookMaitri.elevationDeg > 0 ? `+${lookMaitri.elevationDeg}°` : `${lookMaitri.elevationDeg}°`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#5B7086]">
                    <span>AZ: {lookMaitri.azimuthDeg}°</span>
                    <span>{lookMaitri.rangeKm} km</span>
                  </div>
                </div>
              </div>

              {/* Purpose & Target Description */}
              <div className="mt-2 text-[10px] text-[#8CA1B6] font-mono leading-tight bg-[#070A0F] p-1.5 rounded-sm border border-[#1E293B]">
                {t.metadata.purpose}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="pt-2 border-t border-[#1E293B] shrink-0 mt-2 flex items-center justify-between font-mono text-[10px] text-[#5B7086]">
        <span>PROPAGATION: SGP4 CLIENT ENGINE (1HZ)</span>
        <span>CACHE: {cachedAt ? new Date(cachedAt).toLocaleTimeString() : "READY"}</span>
      </div>
    </div>
  );
}
