"use client";

import React from "react";
import { Html } from "@react-three/drei";
import { getStatusColor } from "@/lib/3d/materials";

interface HoverTooltipProps {
  position?: [number, number, number];
  name: string;
  category?: string;
  operationalStatus?: string;
  healthScore?: number;
  readings?: Record<string, any>;
  specifications?: Record<string, string>;
  distanceFactor?: number;
  subtitle?: string;
}

export function HoverTooltip({
  position = [0, 2.5, 0],
  name,
  category,
  operationalStatus = "RUNNING",
  healthScore = 0.95,
  readings,
  specifications,
  distanceFactor = 32,
  subtitle,
}: HoverTooltipProps) {
  const statusColor = getStatusColor(operationalStatus, healthScore);
  const healthPercent = Math.round(healthScore * 100);

  // Normalize readings into array of { label, value, unit }
  const formattedReadings: Array<{ key: string; label: string; value: string; unit: string; isHighlight?: boolean }> = [];

  if (readings) {
    for (const [key, raw] of Object.entries(readings)) {
      if (raw === null || raw === undefined) continue;
      
      let label = key;
      let valStr = "";
      let unitStr = "";

      if (typeof raw === "object" && "value" in raw) {
        label = raw.label || key;
        valStr = String(raw.value);
        unitStr = raw.unit || "";
      } else {
        valStr = String(raw);
      }

      // Check if key is a highlighted primary metric (e.g. Battery SOC, Fuel Level, Load, Temp)
      const kLower = key.toLowerCase();
      const isHighlight =
        kLower.includes("soc") ||
        kLower.includes("fuel") ||
        kLower.includes("load") ||
        kLower.includes("power") ||
        kLower.includes("capacity") ||
        kLower.includes("temp") ||
        kLower.includes("downlink") ||
        kLower.includes("flow");

      formattedReadings.push({ key, label, value: valStr, unit: unitStr, isHighlight });
    }
  }

  return (
    <Html position={position} center distanceFactor={distanceFactor}>
      <div className="bg-slate-950/95 text-slate-100 border-2 border-cyan-500/80 p-3.5 rounded-2xl shadow-2xl backdrop-blur-lg whitespace-nowrap pointer-events-none min-w-[240px] max-w-[320px] z-50 space-y-2.5">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <span
              className="w-3 h-3 rounded-full animate-pulse shadow-md"
              style={{ backgroundColor: statusColor }}
            />
            <div>
              <div className="text-sm font-extrabold text-cyan-200 tracking-wide">{name}</div>
              {subtitle && <div className="text-[11px] text-slate-400 font-mono">{subtitle}</div>}
            </div>
          </div>
          <div className="flex items-center space-x-1.5 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Health</span>
            <span className="text-xs font-black font-mono" style={{ color: statusColor }}>
              {healthPercent}%
            </span>
          </div>
        </div>

        {/* Primary Readings Display */}
        {formattedReadings.length > 0 && (
          <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            {formattedReadings.slice(0, 4).map((r, idx) => (
              <div
                key={idx}
                className={`flex flex-col px-2 py-1 rounded-lg bg-slate-950/60 border border-slate-800/80 ${
                  r.isHighlight ? "col-span-1 border-cyan-500/30" : ""
                }`}
              >
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 truncate">
                  {r.label}
                </span>
                <div className="flex items-baseline space-x-1">
                  <span className={`font-black font-mono ${r.isHighlight ? "text-base text-cyan-300" : "text-sm text-slate-200"}`}>
                    {r.value}
                  </span>
                  {r.unit && <span className="text-[11px] font-bold text-slate-400 font-mono">{r.unit}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Operational Status Tag */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-0.5">
          <span>Status: <strong className="text-slate-200 uppercase">{operationalStatus}</strong></span>
          {category && <span className="text-[10px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800 font-bold">{category}</span>}
        </div>
      </div>
    </Html>
  );
}
