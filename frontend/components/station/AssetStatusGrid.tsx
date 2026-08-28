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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assetList.map((asset: any) => {
        const Icon = getIcon(asset.asset_type);
        const isRunning = asset.operational_status === "RUNNING";
        const isFailed = asset.operational_status === "FAILED";

        return (
          <div
            key={asset.asset_id}
            className="p-4 rounded-xl glass-card border border-slate-800 flex items-start space-x-3.5"
          >
            <div className={`p-2.5 rounded-xl ${
              isFailed
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                : isRunning
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}>
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase">{asset.asset_id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isFailed ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"
                }`}>
                  {asset.operational_status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 truncate mt-0.5">{asset.name}</h4>
              <div className="flex items-center space-x-3 mt-2 text-xs text-slate-400">
                <span>Health: <strong className="text-slate-200">{Math.round((asset.health_score || 1) * 100)}%</strong></span>
                <span>Signal: <strong className="text-slate-200">{asset.connectivity || "LIVE"}</strong></span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
