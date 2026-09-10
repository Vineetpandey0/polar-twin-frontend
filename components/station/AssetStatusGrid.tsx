"use client";

import { Cpu, Zap, Battery, Flame, Droplets, Radio, Shield } from "lucide-react";

const getIcon = (type: string) => {
  switch (type) {
    case "GENERATOR": return Zap;
    case "BATTERY": return Battery;
    case "HVAC": return Flame;
    case "WATER": return Droplets;
    case "COMMS": return Radio;
    default: return Cpu;
  }
};

interface AssetStatusGridProps {
  assets: Record<string, any>;
}

export default function AssetStatusGrid({ assets }: AssetStatusGridProps) {
  const assetList = Object.values(assets);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {assetList.map((asset: any) => {
        const Icon = getIcon(asset.asset_type);
        const isRunning = asset.operational_status === "RUNNING";
        const isFailed = asset.operational_status === "FAILED";
        const healthPct = Math.round((asset.health_score || 1) * 100);

        return (
          <div
            key={asset.asset_id}
            className="p-3 rounded-sm bg-[#0F1722] border border-[#1E2C3D] hover:border-[#2A3B4F] transition-colors flex items-start space-x-3"
          >
            <div className={`p-2 rounded-sm border shrink-0 ${
              isFailed
                ? "bg-[#180D11] border-[#F87171] text-[#F87171]"
                : isRunning
                ? "bg-[#131D2B] border-[#1E2C3D] text-[#38BDF8]"
                : "bg-[#19150E] border-[#FBBF24] text-[#FBBF24]"
            }`}>
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#8CA1B6] uppercase">[{asset.asset_id}]</span>
                <span className={`px-1.5 py-0.5 rounded-sm font-bold border text-[10px] ${
                  isFailed
                    ? "bg-[#2D1217] border-[#F87171] text-[#F87171]"
                    : isRunning
                    ? "bg-[#10291D] border-[#34D399] text-[#34D399]"
                    : "bg-[#292010] border-[#FBBF24] text-[#FBBF24]"
                }`}>
                  [{asset.operational_status}]
                </span>
              </div>

              <h3 className="text-[15px] font-semibold text-[#E2EAF4] truncate mt-1 tracking-wide leading-snug">
                {asset.name}
              </h3>

              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#1E2C3D] font-mono text-xs text-[#8CA1B6]">
                <div>
                  <span>HEALTH: </span>
                  <span className="text-sm font-bold text-[#E2EAF4] font-mono tnum">{healthPct}%</span>
                </div>
                <div>
                  <span>BUS: </span>
                  <span className="text-[#34D399] font-bold">{asset.connectivity || "LIVE"}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

