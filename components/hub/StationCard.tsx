"use client";

import Link from "next/link";
import { AlertTriangle, Battery, Zap, Radio, Box } from "lucide-react";

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
    <div className="bg-[#0F1722] rounded-sm p-5 border border-[#1E2C3D] hover:border-[#2A3B4F] transition-colors relative">
      {/* Station Console Header */}
      <div className="flex justify-between items-start border-b border-[#1E2C3D] pb-3.5 mb-3.5">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs sm:text-sm mb-1">
            <span className={isMaitri ? "text-[#FBBF24] font-bold" : "text-[#38BDF8] font-bold"}>
              [{isMaitri ? "STN-MAITRI // SCHIRMACHER" : "STN-BHARATI // LARSEMANN"}]
            </span>
            <span className="text-[#5B7086] text-xs">IOC-34-IN</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#E2EAF4] tracking-wide uppercase leading-tight">{name}</h2>
          <p className="text-sm font-mono text-[#8CA1B6] mt-1">{location}</p>
        </div>

        <div className="flex flex-col items-end font-mono">
          <span className={`text-3xl sm:text-4xl font-bold font-mono tnum leading-none ${isHealthy ? "text-[#34D399]" : "text-[#FBBF24]"}`}>
            {healthPct}%
          </span>
          <span className="text-xs text-[#8CA1B6] uppercase font-semibold tracking-wider mt-1.5">SYSTEM HEALTH</span>
        </div>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-3 gap-3 my-4 font-mono">
        <div className="bg-[#131D2B] p-3.5 rounded-sm border border-[#1E2C3D]">
          <div className="flex items-center space-x-2 text-xs sm:text-[13px] text-[#8CA1B6] mb-1 font-semibold">
            <Zap className="w-4 h-4 text-[#38BDF8]" />
            <span className="tracking-wider">POWER OUTPUT</span>
          </div>
          <p className="text-2xl sm:text-[26px] font-bold font-mono text-[#E2EAF4] tnum leading-none mt-1.5">{isMaitri ? "145.2 kW" : "180.5 kW"}</p>
        </div>

        <div className="bg-[#131D2B] p-3.5 rounded-sm border border-[#1E2C3D]">
          <div className="flex items-center space-x-2 text-xs sm:text-[13px] text-[#8CA1B6] mb-1 font-semibold">
            <Battery className="w-4 h-4 text-[#38BDF8]" />
            <span className="tracking-wider">STORAGE SOC</span>
          </div>
          <p className="text-2xl sm:text-[26px] font-bold font-mono text-[#E2EAF4] tnum leading-none mt-1.5">{isMaitri ? "88.0%" : "94.2%"}</p>
        </div>

        <div className="bg-[#131D2B] p-3.5 rounded-sm border border-[#1E2C3D]">
          <div className="flex items-center space-x-2 text-xs sm:text-[13px] text-[#8CA1B6] mb-1 font-semibold">
            <AlertTriangle className={`w-4 h-4 ${alertCount > 0 ? "text-[#FBBF24]" : "text-[#8CA1B6]"}`} />
            <span className="tracking-wider">ALERTS</span>
          </div>
          <p className={`text-2xl sm:text-[26px] font-bold font-mono tnum leading-none mt-1.5 ${alertCount > 0 ? "text-[#FBBF24]" : "text-[#34D399]"}`}>
            {alertCount > 0 ? `${alertCount} WARN` : "0 ACTIVE"}
          </p>
        </div>
      </div>

      {/* Telemetry Actions & Link Status */}
      <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-[#1E2C3D] font-mono text-xs sm:text-sm flex-wrap gap-2">
        <div className="flex items-center space-x-2.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#34D399]"></span>
          <span className="text-[#8CA1B6] font-medium">{connectivity} GROUND-LINK ACTIVE</span>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href={`/?station=${stationId}`}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-sm bg-[#131D2B] hover:bg-[#1E2C3D] text-[#38BDF8] border border-[#1E2C3D] hover:border-[#38BDF8] transition-colors"
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D MODEL</span>
          </Link>
          <Link
            href={`/stations/${stationId}`}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-sm bg-[#131D2B] hover:bg-[#1E2C3D] text-[#E2EAF4] border border-[#1E2C3D] hover:border-[#38BDF8] transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-[#8CA1B6]" />
            <span>2D CONSOLE</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

