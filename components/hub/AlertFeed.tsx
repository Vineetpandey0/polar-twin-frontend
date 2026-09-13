"use client";

import { ShieldAlert, AlertTriangle, Info, CheckSquare } from "lucide-react";

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
    <div className="bg-[#0F1722] rounded-sm p-5 border border-[#1E2C3D]">
      <div className="flex items-center justify-between mb-4 border-b border-[#1E2C3D] pb-3">
        <div className="flex items-center space-x-2.5">
          <ShieldAlert className="w-5 h-5 text-[#FBBF24]" />
          <h2 className="font-semibold text-lg lg:text-xl text-[#E2EAF4] uppercase tracking-wider leading-snug">
            SCADA Incident & Advisory Log
          </h2>
        </div>
        <span className="text-xs sm:text-sm font-mono text-[#8CA1B6] font-medium tnum">
          [LOGGED EVENTS: {alerts.length}]
        </span>
      </div>

      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <div className="text-center py-12 text-[#8CA1B6] font-mono flex flex-col items-center space-y-2.5 border border-dashed border-[#1E2C3D] rounded-sm px-4">
            <CheckSquare className="w-8 h-8 text-[#34D399] mb-1" />
            <span className="text-[#E2EAF4] font-bold text-base sm:text-lg uppercase tracking-wide">TELEMETRY NOMINAL</span>
            <span className="text-sm sm:text-base text-[#8CA1B6] max-w-lg leading-relaxed">Zero active warning or critical excursions detected across Antarctic stations.</span>
          </div>
        ) : (
          alerts.map((alert) => {
            const isCrit = alert.severity === "CRITICAL";
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-sm border transition-colors ${
                  isCrit
                    ? "bg-[#180D11] border-[#F87171] text-[#E2EAF4]"
                    : "bg-[#19150E] border-[#FBBF24] text-[#E2EAF4]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    {isCrit ? (
                      <span className="px-2 py-0.5 bg-[#2D1217] border border-[#F87171] text-[#F87171] font-bold text-xs font-mono rounded-sm">
                        [CRIT]
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-[#292010] border border-[#FBBF24] text-[#FBBF24] font-bold text-xs font-mono rounded-sm">
                        [WARN]
                      </span>
                    )}
                    <h3 className="font-semibold text-base text-[#E2EAF4] tracking-wide leading-snug">
                      <span className="font-mono text-sm text-[#38BDF8] mr-2">[{alert.station_id.toUpperCase()}]</span>
                      {alert.message}
                    </h3>
                  </div>
                  <span className="text-xs sm:text-sm font-mono text-[#8CA1B6] shrink-0 tnum" suppressHydrationWarning>
                    {new Date(alert.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[#8CA1B6] mt-2 max-w-prose leading-relaxed">
                  {alert.reason}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

