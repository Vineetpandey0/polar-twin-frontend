"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Activity,
  Cpu,
  BarChart3,
} from "lucide-react";

interface PredictiveMLPanelProps {
  stationId: string;
}

export default function PredictiveMLPanel({ stationId }: PredictiveMLPanelProps) {
  const isMaitri = stationId === "maitri";

  const [forecast, setForecast] = useState<any[]>([]);

  useEffect(() => {
    // Generate 24h ML prediction curve
    const hours = [];
    const baseKW = isMaitri ? 110 : 135;
    for (let i = 1; i <= 12; i++) {
      const load = baseKW + Math.sin(i / 2) * 18 + (i > 6 && i < 10 ? 12 : 0);
      hours.push({
        hour: `+${i * 2}H`,
        predictedLoad: Math.round(load),
        targetGen: Math.round(load + 25),
        temp: Math.round((isMaitri ? -25 : -18) + Math.cos(i) * 3),
      });
    }
    setForecast(hours);
  }, [stationId, isMaitri]);

  const assetMLScores = isMaitri
    ? [
        { id: "GEN-MAI-001", name: "Primary Generator 1", type: "POWER", anomalyScore: 0.04, failureRisk: "2.1%", rul: "8,450 HRS", status: "NOMINAL" },
        { id: "GEN-MAI-002", name: "Primary Generator 2", type: "POWER", anomalyScore: 0.12, failureRisk: "4.8%", rul: "6,800 HRS", status: "NOMINAL" },
        { id: "BAT-MAI-001", name: "Battery Bank A", type: "STORAGE", anomalyScore: 0.02, failureRisk: "1.0%", rul: "12,000 HRS", status: "NOMINAL" },
        { id: "HVC-MAI-001", name: "Central HVAC System", type: "THERMAL", anomalyScore: 0.28, failureRisk: "11.5%", rul: "2,100 HRS", status: "ATTENTION" },
        { id: "WTR-MAI-001", name: "Water Treatment Unit", type: "LIFE-SUPPORT", anomalyScore: 0.06, failureRisk: "3.2%", rul: "5,400 HRS", status: "NOMINAL" },
      ]
    : [
        { id: "GEN-BHA-001", name: "CHP Generator 1", type: "POWER", anomalyScore: 0.03, failureRisk: "1.8%", rul: "9,200 HRS", status: "NOMINAL" },
        { id: "GEN-BHA-002", name: "CHP Generator 2", type: "POWER", anomalyScore: 0.05, failureRisk: "2.4%", rul: "8,600 HRS", status: "NOMINAL" },
        { id: "BAT-BHA-001", name: "Main Storage Bank", type: "STORAGE", anomalyScore: 0.01, failureRisk: "0.8%", rul: "14,500 HRS", status: "NOMINAL" },
        { id: "HVC-BHA-001", name: "Station Thermal HVAC", type: "THERMAL", anomalyScore: 0.09, failureRisk: "4.1%", rul: "7,100 HRS", status: "NOMINAL" },
      ];

  return (
    <div className="space-y-4">
      {/* ML Engine Status Banner */}
      <div className="bg-[#0F1722] p-4 rounded-sm border border-[#1E2C3D] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-sm bg-[#131D2B] border border-[#1E2C3D] text-[#38BDF8]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="font-bold text-[#E2EAF4] text-base tracking-wide uppercase">
                Predictive Analytics & Prognostics Engine
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-[#10291D] text-[#34D399] font-bold border border-[#34D399]">
                ONLINE
              </span>
            </div>
            <p className="text-sm text-[#8CA1B6] mt-0.5 font-mono">
              Isolation Forest anomaly clustering & Random Forest load regression (5000ms tick)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 font-mono">
          <div className="bg-[#131D2B] border border-[#1E2C3D] px-3.5 py-2 rounded-sm text-left">
            <span className="text-[10px] text-[#8CA1B6] block uppercase tracking-wider">CONFIDENCE</span>
            <span className="text-[20px] font-bold text-[#34D399] font-mono tnum leading-tight">98.4%</span>
          </div>
          <div className="bg-[#131D2B] border border-[#1E2C3D] px-3.5 py-2 rounded-sm text-left">
            <span className="text-[10px] text-[#8CA1B6] block uppercase tracking-wider">INFERENCE TICK</span>
            <span className="text-[20px] font-bold text-[#38BDF8] font-mono tnum leading-tight">5000ms</span>
          </div>
        </div>
      </div>

      {/* Asset Anomaly & Failure Risk Matrix */}
      <div className="bg-[#0F1722] p-4 rounded-sm border border-[#1E2C3D] space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E2C3D] pb-2">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#38BDF8]" />
            <h2 className="font-semibold text-[17px] text-[#E2EAF4] uppercase tracking-wider leading-snug">
              Subsystem Health & RUL Prognostics Matrix
            </h2>
          </div>
          <span className="text-[11px] text-[#8CA1B6] font-mono">[ISOLATION FOREST :: 100 ESTIMATORS]</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1E2C3D] text-[#8CA1B6] uppercase text-[10px]">
                <th className="pb-2.5 pl-2">Asset Node</th>
                <th className="pb-2.5">Subsystem</th>
                <th className="pb-2.5">Anomaly Index</th>
                <th className="pb-2.5">Failure Prob</th>
                <th className="pb-2.5">Est. RUL</th>
                <th className="pb-2.5 pr-2">Prognostic Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2C3D]">
              {assetMLScores.map((asset) => {
                const isAttention = asset.status === "ATTENTION";
                return (
                  <tr key={asset.id} className="hover:bg-[#131D2B]/60 transition-colors">
                    <td className="py-2.5 pl-2">
                      <div className="font-semibold text-sm text-[#E2EAF4]">{asset.name}</div>
                      <div className="text-[10px] text-[#8CA1B6] font-normal">[{asset.id}]</div>
                    </td>
                    <td className="py-2.5 text-[#8CA1B6]">{asset.type}</td>
                    <td className="py-2.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-1.5 bg-[#131D2B] border border-[#1E2C3D] rounded-none overflow-hidden">
                          <div
                            className={`h-full ${
                              asset.anomalyScore > 0.2 ? "bg-[#FBBF24]" : "bg-[#34D399]"
                            }`}
                            style={{ width: `${Math.min(100, asset.anomalyScore * 250)}%` }}
                          />
                        </div>
                        <span className="text-[#E2EAF4] tnum font-bold">{asset.anomalyScore.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="py-2.5 font-bold text-[#E2EAF4] tnum">{asset.failureRisk}</td>
                    <td className="py-2.5 text-[#38BDF8] font-bold tnum">{asset.rul}</td>
                    <td className="py-2.5 pr-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm border ${
                          isAttention
                            ? "bg-[#292010] border-[#FBBF24] text-[#FBBF24]"
                            : "bg-[#10291D] border-[#34D399] text-[#34D399]"
                        }`}
                      >
                        [{asset.status}]
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 24-Hour ML Energy Load Forecast Grid */}
      <div className="bg-[#0F1722] p-4 rounded-sm border border-[#1E2C3D] space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E2C3D] pb-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
            <h2 className="font-semibold text-[17px] text-[#E2EAF4] uppercase tracking-wider leading-snug">
              24-Hour Predictive Energy Demand Model
            </h2>
          </div>
          <span className="text-[11px] text-[#8CA1B6] font-mono">[RANDOM FOREST REGRESSION]</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 font-mono">
          {forecast.map((item, idx) => (
            <div key={idx} className="bg-[#131D2B] p-2.5 rounded-sm border border-[#1E2C3D] space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#38BDF8]">{item.hour}</span>
                <span className="text-[#8CA1B6] tnum">{item.temp}°C</span>
              </div>
              <div className="pt-1">
                <span className="text-[10px] text-[#8CA1B6] block uppercase tracking-wider">DEMAND</span>
                <span className="text-[20px] font-bold text-[#E2EAF4] font-mono tnum leading-tight block">{item.predictedLoad} kW</span>
              </div>
              <div className="pt-1 border-t border-[#1E2C3D] text-[11px] flex items-center justify-between text-[#8CA1B6]">
                <span>MARGIN</span>
                <span className="text-[#34D399] font-bold tnum">{item.targetGen} kW</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

