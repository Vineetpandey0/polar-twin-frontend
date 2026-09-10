"use client";

import { useEffect, useState } from "react";
import { Clock, ShieldCheck, Thermometer } from "lucide-react";

export default function Header() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      setTime(new Date().toUTCString().replace("GMT", "UTC"));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-12 bg-[#0F1722] border-b border-[#1E2C3D] px-4 flex items-center justify-between select-none">
      {/* Station Environmental Telemetry Readings */}
      <div className="flex items-center space-x-3">
        <div className="hidden xl:flex items-center space-x-2 text-[11px] font-mono text-[#8CA1B6] pr-2 border-r border-[#1E2C3D]">
          <span className="text-[#38BDF8] font-bold">[NCPOR :: EXP-43]</span>
          <span>INDIAN POLAR RESEARCH PROGRAM</span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="px-2.5 py-1 bg-[#131D2B] border border-[#1E2C3D] rounded-sm flex items-center space-x-2 text-[#E2EAF4]">
            <span className="text-[#8CA1B6] text-[10px] font-medium">MAITRI EXT:</span>
            <span className="font-semibold text-[#FBBF24] tnum">-25.2°C</span>
            <span className="text-[10px] text-[#5B7086]">145 kW</span>
          </div>

          <div className="px-2.5 py-1 bg-[#131D2B] border border-[#1E2C3D] rounded-sm flex items-center space-x-2 text-[#E2EAF4]">
            <span className="text-[#8CA1B6] text-[10px] font-medium">BHARATI EXT:</span>
            <span className="font-semibold text-[#38BDF8] tnum">-18.4°C</span>
            <span className="text-[10px] text-[#5B7086]">181 kW</span>
          </div>
        </div>
      </div>

      {/* Mission Chronometer & Telemetry Bus State */}
      <div className="flex items-center space-x-3 text-xs font-mono">
        <div className="flex items-center space-x-2 bg-[#131D2B] px-3 py-1 rounded-sm border border-[#1E2C3D] text-[#E2EAF4]">
          <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="tnum tracking-wider text-[11px]">{time || "UTC 00:00:00"}</span>
        </div>

        <div className="flex items-center space-x-1.5 bg-[#131D2B] px-2.5 py-1 rounded-sm border border-[#1E2C3D] text-[#34D399]">
          <span className="w-1.5 h-1.5 rounded-sm bg-[#34D399]"></span>
          <span className="text-[11px] font-semibold tracking-wider">ALL BUSES NOMINAL</span>
        </div>
      </div>
    </header>
  );
}

