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
    <div className="bg-[#0F1722] rounded-sm p-4 border border-[#1E2C3D]">
      <div className="flex items-center justify-between mb-3 border-b border-[#1E2C3D] pb-2">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-[#FBBF24]" />
          <h2 className="font-semibold text-[17px] text-[#E2EAF4] uppercase tracking-wider leading-snug">
            SCADA Incident & Advisory Log
          </h2>
        </div>
        <span className="text-[11px] font-mono text-[#8CA1B6] tnum">
          [LOGGED EVENTS: {alerts.length}]
        </span>
      </div>

      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <div className="text-center py-10 text-[#8CA1B6] font-mono flex flex-col items-center space-y-2 border border-dashed border-[#1E2C3D] rounded-sm">
            <CheckSquare className="w-6 h-6 text-[#34D399]" />
            <span className="text-[#E2EAF4] font-semibold text-sm uppercase tracking-wide">TELEMETRY NOMINAL</span>
            <span className="text-sm text-[#8CA1B6]">Zero active warning or critical excursions detected across Antarctic stations.</span>
          </div>
        ) : (
          alerts.map((alert) => {
            const isCrit = alert.severity === "CRITICAL";
            return (
              <div
                key={alert.id}
                className={`p-3.5 rounded-sm border transition-colors ${
                  isCrit
                    ? "bg-[#180D11] border-[#F87171] text-[#E2EAF4]"
                    : "bg-[#19150E] border-[#FBBF24] text-[#E2EAF4]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {isCrit ? (
                      <span className="px-1.5 py-0.5 bg-[#2D1217] border border-[#F87171] text-[#F87171] font-bold text-[10px] font-mono rounded-sm">
                        [CRIT]
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 bg-[#292010] border border-[#FBBF24] text-[#FBBF24] font-bold text-[10px] font-mono rounded-sm">
                        [WARN]
                      </span>
                    )}
                    <h3 className="font-semibold text-[14.5px] text-[#E2EAF4] tracking-wide leading-snug">
                      <span className="font-mono text-xs text-[#38BDF8] mr-1.5">[{alert.station_id.toUpperCase()}]</span>
                      {alert.message}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-[#8CA1B6] shrink-0 tnum" suppressHydrationWarning>
                    {new Date(alert.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-[#8CA1B6] mt-1.5 max-w-prose leading-relaxed">
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

