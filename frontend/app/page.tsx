"use client";

import { useEffect, useState } from "react";
import StationCard from "@/components/hub/StationCard";
import AlertFeed from "@/components/hub/AlertFeed";
import { Activity, ShieldCheck, Flame, Radio, Cpu, Layers } from "lucide-react";

export default function OperationsHub() {
  const [stations, setStations] = useState<any[]>([
    {
      stationId: "maitri",
      name: "Maitri Research Station",
      location: "Schirmacher Oasis, Queen Maud Land (-70.7667° S, 11.7333° E)",
      healthScore: 0.94,
      alertCount: 1,
      connectivity: "LIVE",
    },
    {
      stationId: "bharati",
      name: "Bharati Research Station",
      location: "Larsemann Hills (-69.4072° S, 76.1872° E)",
      healthScore: 0.98,
      alertCount: 0,
      connectivity: "LIVE",
    },
  ]);

  const [alerts, setAlerts] = useState<any[]>([
    {
      id: 1,
      station_id: "maitri",
      severity: "WARNING",
      message: "Generator 1 Temperature High",
      reason: "Primary generator operating temp at 88.5°C threshold",
      created_at: new Date().toISOString(),
    },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-1">
            <Activity className="w-4 h-4" />
            <span>National Centre for Polar and Ocean Research (NCPOR)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">
            Antarctic Operations Command Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time Digital Twin telemetry, life-support monitoring & AI predictive maintenance for Maitri & Bharati research stations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/50 text-right">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Active Twins</span>
            <span className="text-base font-extrabold text-cyan-400">2 Stations</span>
          </div>
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/50 text-right">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Monitored Assets</span>
            <span className="text-base font-extrabold text-amber-400">16 Systems</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stations.map((s) => (
          <StationCard key={s.stationId} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AlertFeed alerts={alerts} />
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100">Telemetry Engine Overview</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300 font-medium">MQTT Ingestion Rate</span>
              </div>
              <span className="font-mono text-cyan-400 font-bold">12 msgs/sec</span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-medium">State Synchronization</span>
                </div>
              <span className="font-mono text-emerald-400 font-bold">&lt; 50ms</span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <span className="text-slate-300 font-medium">Predictive Risk Level</span>
              </div>
              <span className="font-mono text-amber-400 font-bold">LOW (0.04)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
