"use client";

import React from "react";
import { useTelemetry, retryConnection } from "@/lib/telemetry";
import { AlertTriangle, RefreshCw, Radio, CheckCircle2 } from "lucide-react";

function formatElapsed(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s ago` : `${m}m ago`;
}

export function TelemetryBanner() {
  const {
    isConnected,
    isBackendAlive,
    isWsConnected,
    isSimulatorConnected,
    lastUpdated,
    secondsSinceLastTick,
    error,
    metricsCount,
    isChecking,
  } = useTelemetry();

  // 1. Backend or SCADA bus completely offline / unreachable
  if (error || !isBackendAlive) {
    return (
      <div className="w-full bg-[#180D11] border-b border-[#F87171] text-[#F87171] px-4 sm:px-5 py-2.5 text-xs sm:text-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-4 h-4 text-[#F87171] shrink-0 animate-pulse" />
          <div className="flex items-center space-x-2 font-mono">
            <span className="font-bold uppercase tracking-wider text-[#F87171]">
              [FAULT :: TELEMETRY BUS OFFLINE]
            </span>
            <span className="text-[#8CA1B6] hidden md:inline text-xs sm:text-sm">
              {error || "Backend database / telemetry simulator unreachable. Checking link..."}
            </span>
          </div>
        </div>

        <button
          onClick={() => retryConnection()}
          disabled={isChecking}
          className="px-3 py-1.5 bg-[#2D1217] hover:bg-[#3D181F] border border-[#F87171] rounded-sm text-xs sm:text-sm font-mono font-semibold text-[#F87171] flex items-center space-x-1.5 transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin" : ""}`} />
          <span>{isChecking ? "CHECKING..." : "RETRY LINK"}</span>
        </button>
      </div>
    );
  }

  // 2. Stream interrupted / stale (>900s / 15m since last tick for 10-minute cadence)
  if (secondsSinceLastTick !== null && secondsSinceLastTick > 900) {
    const mins = Math.floor(secondsSinceLastTick / 60);
    return (
      <div className="w-full bg-[#1C120A] border-b border-[#FB923C] text-[#FB923C] px-4 sm:px-5 py-2 text-xs sm:text-sm flex items-center justify-between">
        <div className="flex items-center space-x-3 font-mono text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-sm bg-[#FB923C] animate-pulse"></span>
            <span className="font-bold text-[#FB923C] tracking-wide">
              [WARNING :: SIMULATOR STREAM STALE]
            </span>
          </div>
          <span className="text-[#8CA1B6] hidden sm:inline text-xs sm:text-sm">
            No telemetry received for {mins}m (cadence: 10m). Simulator may be paused.
          </span>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs sm:text-sm">
          {lastUpdated && (
            <span className="text-[#8CA1B6] hidden md:inline">
              LAST TICK: <span className="text-[#FB923C] font-medium">{lastUpdated}</span>
            </span>
          )}
          <button
            onClick={() => retryConnection()}
            disabled={isChecking}
            className="px-2.5 py-1 bg-[#2E1A0E] hover:bg-[#3D2214] border border-[#FB923C] rounded-sm text-xs font-mono font-semibold text-[#FB923C] flex items-center space-x-1 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? "animate-spin" : ""}`} />
            <span>RE-CHECK</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. Backend online and socket open, but waiting for next simulator tick (10m interval)
  if (!isSimulatorConnected) {
    return (
      <div className="w-full bg-[#161307] border-b border-[#FBBF24] text-[#FBBF24] px-4 sm:px-5 py-2 text-xs sm:text-sm flex items-center justify-between">
        <div className="flex items-center space-x-3 font-mono text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-sm bg-[#FBBF24] animate-pulse"></span>
            <span className="font-bold text-[#FBBF24] tracking-wide">
              {isWsConnected
                ? "[SIMULATOR STANDBY :: 10-MIN CADENCE]"
                : "[SCADA BUS :: CONNECTING WEBSOCKET]"}
            </span>
          </div>
          <span className="text-[#8CA1B6] hidden sm:inline text-xs sm:text-sm">
            {isWsConnected
              ? "Socket connected. Awaiting next 10-minute sensor telemetry tick..."
              : "Backend verified. Establishing WebSocket link..."}
          </span>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs sm:text-sm">
          <span className="text-[#FBBF24]">STANDBY FOR TICK (10M)</span>
          <button
            onClick={() => retryConnection()}
            disabled={isChecking}
            className="px-2.5 py-1 bg-[#261E0A] hover:bg-[#362A0F] border border-[#FBBF24] rounded-sm text-xs font-mono font-semibold text-[#FBBF24] flex items-center space-x-1 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? "animate-spin" : ""}`} />
            <span>RE-CHECK</span>
          </button>
        </div>
      </div>
    );
  }

  // 4. Live Telemetry Stream Active (Genuine 10-minute cadence transmission)
  return (
    <div className="w-full bg-[#0F1722] border-b border-[#1E2C3D] text-[#E2EAF4] px-4 sm:px-5 py-2 text-xs sm:text-sm flex items-center justify-between">
      <div className="flex items-center space-x-3 font-mono text-xs sm:text-sm">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-sm bg-[#34D399] animate-pulse"></span>
          <span className="font-bold text-[#34D399] tracking-wide">
            [SCADA BUS: PRIMARY ACTIVE]
          </span>
        </div>
        <span className="text-[#8CA1B6] hidden sm:inline text-xs sm:text-sm">
          PROTOCOL :: 10-MIN TELEMETRY STREAM
        </span>
      </div>

      <div className="flex items-center space-x-4 font-mono text-xs sm:text-sm tnum">
        <span className="text-[#38BDF8] hidden md:inline font-medium">
          METRICS INGESTED: {metricsCount}
        </span>
        {lastUpdated ? (
          <span className="text-[#8CA1B6]">
            LAST TICK: <span className="text-[#34D399] font-medium">{lastUpdated}</span>
            {secondsSinceLastTick !== null && (
              <span className="text-[#5B7086] text-[11px] ml-1.5">
                ({formatElapsed(secondsSinceLastTick)})
              </span>
            )}
          </span>
        ) : (
          <span className="text-[#FBBF24]">STANDBY FOR TICK</span>
        )}
      </div>
    </div>
  );
}


