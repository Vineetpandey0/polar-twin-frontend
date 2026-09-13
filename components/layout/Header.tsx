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
    <header className="h-13 lg:h-14 bg-[#0F1722] border-b border-[#1E2C3D] px-4 sm:px-5 flex items-center justify-between select-none">
      {/* Station Environmental Telemetry Readings */}
      <div className="flex items-center space-x-3.5">
        <div className="hidden xl:flex items-center space-x-2 text-xs sm:text-sm font-mono text-[#8CA1B6] pr-3 border-r border-[#1E2C3D]">
          <span className="text-[#38BDF8] font-bold">[NCPOR :: EXP-43]</span>
          <span className="font-medium">INDIAN POLAR RESEARCH PROGRAM</span>
        </div>

        <div className="flex items-center space-x-2.5 text-xs sm:text-sm font-mono">
          <div className="px-3 py-1.5 bg-[#131D2B] border border-[#1E2C3D] rounded-sm flex items-center space-x-2 text-[#E2EAF4]">
            <span className="text-[#8CA1B6] text-xs font-semibold">MAITRI EXT:</span>
            <span className="font-bold text-sm sm:text-base text-[#FBBF24] tnum">-25.2°C</span>
            <span className="text-xs text-[#5B7086] font-medium">145 kW</span>
          </div>

          <div className="px-3 py-1.5 bg-[#131D2B] border border-[#1E2C3D] rounded-sm flex items-center space-x-2 text-[#E2EAF4]">
            <span className="text-[#8CA1B6] text-xs font-semibold">BHARATI EXT:</span>
            <span className="font-bold text-sm sm:text-base text-[#38BDF8] tnum">-18.4°C</span>
            <span className="text-xs text-[#5B7086] font-medium">181 kW</span>
          </div>
        </div>
      </div>

      {/* Mission Chronometer & Telemetry Bus State */}
      <div className="flex items-center space-x-3 text-xs sm:text-sm font-mono">
        <div className="flex items-center space-x-2 bg-[#131D2B] px-3.5 py-1.5 rounded-sm border border-[#1E2C3D] text-[#E2EAF4]">
          <Clock className="w-4 h-4 text-[#38BDF8]" />
          <span className="tnum tracking-wider text-xs sm:text-sm font-medium">{time || "UTC 00:00:00"}</span>
        </div>

        <div className="flex items-center space-x-2 bg-[#131D2B] px-3 py-1.5 rounded-sm border border-[#1E2C3D] text-[#34D399]">
          <span className="w-2 h-2 rounded-sm bg-[#34D399]"></span>
          <span className="text-xs sm:text-sm font-semibold tracking-wider">ALL BUSES NOMINAL</span>
        </div>
      </div>
    </header>
  );
}

