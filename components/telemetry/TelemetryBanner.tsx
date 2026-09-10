"use client";

import React from "react";
import { useTelemetry } from "@/lib/telemetry";
import { AlertTriangle, RefreshCw } from "lucide-react";

export function TelemetryBanner() {
  const { isConnected, isBackendAlive, lastUpdated, error, metricsCount } = useTelemetry();

  if (error || !isBackendAlive) {
    return (
      <div className="w-full bg-[#180D11] border-b border-[#F87171] text-[#F87171] px-4 py-2 text-xs sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-4 h-4 text-[#F87171] shrink-0" />
          <div className="flex items-center space-x-2 font-mono">
            <span className="font-bold uppercase tracking-wider text-[#F87171]">
              [FAULT :: TELEMETRY BUS OFFLINE]
            </span>
            <span className="text-[#8CA1B6] hidden md:inline">
              Backend database/telemetry simulator unreachable. Polling suspended.
            </span>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-2.5 py-1 bg-[#2D1217] hover:bg-[#3D181F] border border-[#F87171] rounded-sm text-xs font-mono font-semibold text-[#F87171] flex items-center space-x-1.5 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>RETRY LINK</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0F1722] border-b border-[#1E2C3D] text-[#E2EAF4] px-4 py-1.5 text-xs flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-3 font-mono text-[11px]">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-sm bg-[#34D399]"></span>
          <span className="font-bold text-[#E2EAF4] tracking-wide">
            [SCADA BUS: PRIMARY ACTIVE]
          </span>
        </div>
        <span className="text-[#8CA1B6] hidden sm:inline">
          PROTOCOL :: MQTT / INGESTION STREAM 5000ms
        </span>
      </div>

      <div className="flex items-center space-x-4 font-mono text-[11px] tnum">
        <span className="text-[#38BDF8] hidden md:inline">
          METRICS INGESTED: {metricsCount}
        </span>
        {lastUpdated && (
          <span className="text-[#8CA1B6]">
            LAST TICK: <span className="text-[#34D399] font-medium">{lastUpdated}</span>
          </span>
        )}
      </div>
    </div>
  );
}

