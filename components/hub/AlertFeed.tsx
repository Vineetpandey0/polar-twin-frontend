"use client";

import { ShieldAlert, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

interface AlertItem {
  id: number;
  station_id: string;
  asset_id?: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  message: string;
  reason: string;
  created_at: string;
  acknowledged?: boolean;
}

interface AlertFeedProps {
  alerts: AlertItem[];
}

export default function AlertFeed({ alerts }: AlertFeedProps) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-slate-100">Live Station Alert Feed</h3>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
          {alerts.length} Active
        </span>
      </div>

      <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs flex flex-col items-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400/60" />
            <span>No active critical or warning alerts across stations</span>
          </div>
        ) : (
          alerts.map((alert) => {
            const isCrit = alert.severity === "CRITICAL";
            return (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCrit
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {isCrit ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : (
                      <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <span className="font-bold text-xs uppercase tracking-wide">
                      [{alert.station_id.toUpperCase()}] {alert.message}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(alert.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 pl-6">{alert.reason}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
