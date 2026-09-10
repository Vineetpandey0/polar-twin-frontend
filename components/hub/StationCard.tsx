"use client";

import Link from "next/link";
import { AlertTriangle, Battery, Zap, Radio } from "lucide-react";

interface StationCardProps {
  stationId: string;
  name: string;
  location: string;
  healthScore: number;
  alertCount: number;
  connectivity: string;
}

export default function StationCard({
  stationId,
  name,
  location,
  healthScore,
  alertCount,
  connectivity,
}: StationCardProps) {
  const isMaitri = stationId === "maitri";
  const healthPct = Math.round(healthScore * 100);
  const isHealthy = healthPct >= 90;

  return (
    <div className="bg-[#0F1722] rounded-sm p-4 border border-[#1E2C3D] hover:border-[#2A3B4F] transition-colors relative">
      {/* Station Console Header */}
      <div className="flex justify-between items-start border-b border-[#1E2C3D] pb-3 mb-3">
        <div>
          <div className="flex items-center space-x-2 font-mono text-[11px] mb-0.5">
            <span className={isMaitri ? "text-[#FBBF24] font-bold" : "text-[#38BDF8] font-bold"}>
              [{isMaitri ? "STN-MAITRI // SCHIRMACHER" : "STN-BHARATI // LARSEMANN"}]
            </span>
            <span className="text-[#5B7086] text-[10px]">IOC-34-IN</span>
          </div>
          <h2 className="text-[17px] font-semibold text-[#E2EAF4] tracking-wide uppercase leading-snug">{name}</h2>
          <p className="text-xs font-mono text-[#8CA1B6] mt-0.5">{location}</p>
        </div>

        <div className="flex flex-col items-end font-mono">
          <span className={`text-[26px] font-bold font-mono tnum leading-none ${isHealthy ? "text-[#34D399]" : "text-[#FBBF24]"}`}>
            {healthPct}%
          </span>
          <span className="text-[10px] text-[#8CA1B6] uppercase font-medium mt-1">SYSTEM HEALTH</span>
        </div>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-3 gap-2.5 my-3 font-mono">
        <div className="bg-[#131D2B] p-2.5 rounded-sm border border-[#1E2C3D]">
          <div className="flex items-center space-x-1.5 text-[11px] text-[#8CA1B6] mb-1">
            <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="tracking-wider">POWER OUTPUT</span>
          </div>
          <p className="text-[22px] font-bold font-mono text-[#E2EAF4] tnum leading-none mt-1">{isMaitri ? "145.2 kW" : "180.5 kW"}</p>
        </div>

        <div className="bg-[#131D2B] p-2.5 rounded-sm border border-[#1E2C3D]">
          <div className="flex items-center space-x-1.5 text-[11px] text-[#8CA1B6] mb-1">
            <Battery className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="tracking-wider">STORAGE SOC</span>
          </div>
          <p className="text-[22px] font-bold font-mono text-[#E2EAF4] tnum leading-none mt-1">{isMaitri ? "88.0%" : "94.2%"}</p>
        </div>

        <div className="bg-[#131D2B] p-2.5 rounded-sm border border-[#1E2C3D]">
          <div className="flex items-center space-x-1.5 text-[11px] text-[#8CA1B6] mb-1">
            <AlertTriangle className={`w-3.5 h-3.5 ${alertCount > 0 ? "text-[#FBBF24]" : "text-[#8CA1B6]"}`} />
            <span className="tracking-wider">ALERTS</span>
          </div>
          <p className={`text-[22px] font-bold font-mono tnum leading-none mt-1 ${alertCount > 0 ? "text-[#FBBF24]" : "text-[#34D399]"}`}>
            {alertCount > 0 ? `${alertCount} WARN` : "0 ACTIVE"}
          </p>
        </div>
      </div>

      {/* Telemetry Actions & Link Status */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1E2C3D] font-mono text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-sm bg-[#34D399]"></span>
          <span className="text-[#8CA1B6] text-[11px]">{connectivity} GROUND-LINK ACTIVE</span>
        </div>

        <Link
          href={`/stations/${stationId}`}
          className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-sm bg-[#131D2B] hover:bg-[#1E2C3D] text-[#E2EAF4] border border-[#1E2C3D] hover:border-[#38BDF8] transition-colors"
        >
          INSPECT DIGITAL TWIN
        </Link>
      </div>
    </div>
  );
}

