"use client";

import Link from "next/link";
import { ShieldCheck, AlertTriangle, ArrowRight, Activity, Battery, Zap } from "lucide-react";

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

  return (
    <div className={`glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.01] ${
      isMaitri ? "hover:border-amber-500/40 glow-amber" : "hover:border-cyan-500/40 glow-blue"
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
            isMaitri ? "bg-amber-500/20 text-amber-400" : "bg-cyan-500/20 text-cyan-400"
          }`}>
            {stationId.toUpperCase()}
          </span>
          <h2 className="text-xl font-bold text-slate-100 mt-1">{name}</h2>
          <p className="text-xs text-slate-400">{location}</p>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-1">
            <span className={`text-2xl font-extrabold ${healthPct >= 90 ? "text-emerald-400" : "text-amber-400"}`}>
              {healthPct}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Health Score</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 my-4">
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Power Output</span>
          </div>
          <p className="text-sm font-semibold text-slate-200">{isMaitri ? "145.2 kW" : "180.5 kW"}</p>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
            <Battery className="w-3.5 h-3.5 text-cyan-400" />
            <span>Storage SOC</span>
          </div>
          <p className="text-sm font-semibold text-slate-200">{isMaitri ? "88%" : "94%"}</p>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Active Alerts</span>
          </div>
          <p className="text-sm font-semibold text-slate-200">{alertCount}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/80">
        <div className="flex items-center space-x-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-slate-400 font-medium">{connectivity} CONNECTED</span>
        </div>

        <Link
          href={`/stations/${stationId}`}
          className={`inline-flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-xl transition-colors ${
            isMaitri
              ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30"
              : "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30"
          }`}
        >
          <span>Open Digital Twin</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
