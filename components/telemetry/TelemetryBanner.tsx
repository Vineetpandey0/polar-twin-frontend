"use client";

import React from "react";
import { useTelemetry } from "@/lib/telemetry";
import { AlertTriangle, Radio, Wifi, WifiOff, RefreshCw } from "lucide-react";

export function TelemetryBanner() {
  const { isConnected, isBackendAlive, lastUpdated, error, metricsCount } = useTelemetry();

  if (error || !isBackendAlive) {
    return (
      <div className="w-full bg-rose-950/90 border-b-2 border-rose-500 text-rose-100 px-4 py-3 shadow-2xl backdrop-blur-md sticky top-0 z-50 flex items-center justify-between animate-pulse">
        <div className="flex items-center space-x-3 max-w-5xl">
          <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-rose-300">
              Telemetry Database & Simulator Error
            </div>
            <div className="text-xs text-rose-200 font-mono mt-0.5">
              {error || "Backend database / telemetry simulator is unreachable. Real-time telemetry cannot be fetched."}
            </div>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-3 py-1.5 bg-rose-900 hover:bg-rose-800 border border-rose-500/50 rounded-xl text-xs font-bold text-rose-100 flex items-center space-x-1.5 transition-all shadow-md shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/90 border-b border-cyan-500/30 text-slate-200 px-4 py-2 text-xs flex items-center justify-between backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center space-x-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="font-bold text-slate-100 tracking-wide">
          LIVE SIMULATOR & DATABASE FEED ACTIVE
        </span>
        <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
          • Real-Time Telemetry Streaming from Backend Database & Simulator
        </span>
      </div>

      <div className="flex items-center space-x-4 font-mono text-[11px]">
        <span className="text-cyan-400 font-bold hidden md:inline">
          {metricsCount} Metrics Ingested
        </span>
        {lastUpdated && (
          <span className="text-slate-400">
            Last Tick: <strong className="text-emerald-400">{lastUpdated}</strong>
          </span>
        )}
      </div>
    </div>
  );
}
