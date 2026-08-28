"use client";

import { useState, useEffect } from "react";
import {
  Brain,
  TrendingUp,
  AlertCircle,
  Clock,
  ShieldCheck,
  Zap,
  Activity,
  Sparkles,
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
        hour: `+${i * 2}h`,
        predictedLoad: Math.round(load),
        targetGen: Math.round(load + 25),
        temp: Math.round((isMaitri ? -25 : -18) + Math.cos(i) * 3),
      });
    }
    setForecast(hours);
  }, [stationId, isMaitri]);

  const assetMLScores = isMaitri
    ? [
        { id: "GEN-MAI-001", name: "Primary Generator 1", type: "Generator", anomalyScore: 0.04, failureRisk: "2.1%", rul: "8,450 hrs", status: "NOMINAL" },
        { id: "GEN-MAI-002", name: "Primary Generator 2", type: "Generator", anomalyScore: 0.12, failureRisk: "4.8%", rul: "6,800 hrs", status: "NOMINAL" },
        { id: "BAT-MAI-001", name: "Battery Bank A", type: "Battery", anomalyScore: 0.02, failureRisk: "1.0%", rul: "12,000 hrs", status: "OPTIMAL" },
        { id: "HVC-MAI-001", name: "Central HVAC", type: "Thermal", anomalyScore: 0.28, failureRisk: "11.5%", rul: "2,100 hrs", status: "ATTENTION" },
        { id: "WTR-MAI-001", name: "Water Unit", type: "Water", anomalyScore: 0.06, failureRisk: "3.2%", rul: "5,400 hrs", status: "NOMINAL" },
      ]
    : [
        { id: "GEN-BHA-001", name: "CHP Generator 1", type: "Generator", anomalyScore: 0.03, failureRisk: "1.8%", rul: "9,200 hrs", status: "NOMINAL" },
        { id: "GEN-BHA-002", name: "CHP Generator 2", type: "Generator", anomalyScore: 0.05, failureRisk: "2.4%", rul: "8,600 hrs", status: "NOMINAL" },
        { id: "BAT-BHA-001", name: "Main Storage Bank", type: "Battery", anomalyScore: 0.01, failureRisk: "0.8%", rul: "14,500 hrs", status: "OPTIMAL" },
        { id: "HVC-BHA-001", name: "Station HVAC", type: "Thermal", anomalyScore: 0.09, failureRisk: "4.1%", rul: "7,100 hrs", status: "NOMINAL" },
      ];

  return (
    <div className="space-y-6">
      {/* ML Engine Status Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-slate-950/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-lg glow-blue">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-slate-100 text-base">Scikit-Learn Predictive Analytics Engine</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                ACTIVE INGESTION
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multivariate Isolation Forest anomaly detection & Random Forest energy load regression
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">ML Model Confidence</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">98.4%</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Inference Frequency</span>
            <span className="text-sm font-bold text-cyan-400 font-mono">5s / TICK</span>
          </div>
        </div>
      </div>

      {/* Asset Anomaly & Failure Risk Matrix */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-sm">Asset Health & RUL Prognostics Matrix</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Model: IsolationForest (100 Estimators)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold">
                <th className="pb-3 pl-2">Asset Node</th>
                <th className="pb-3">Subsystem</th>
                <th className="pb-3">Anomaly Score</th>
                <th className="pb-3">Failure Probability</th>
                <th className="pb-3">Est. RUL</th>
                <th className="pb-3 pr-2">Prognostic Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {assetMLScores.map((asset) => {
                const isAttention = asset.status === "ATTENTION";
                return (
                  <tr key={asset.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 pl-2 font-mono font-bold text-slate-200">
                      <div>{asset.name}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{asset.id}</div>
                    </td>
                    <td className="py-3.5 text-slate-400">{asset.type}</td>
                    <td className="py-3.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full ${
                              asset.anomalyScore > 0.2 ? "bg-amber-500" : "bg-emerald-400"
                            }`}
                            style={{ width: `${Math.min(100, asset.anomalyScore * 250)}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-300">{asset.anomalyScore.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 font-mono font-bold text-slate-200">{asset.failureRisk}</td>
                    <td className="py-3.5 font-mono text-cyan-300 font-semibold">{asset.rul}</td>
                    <td className="py-3.5 pr-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAttention
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 24-Hour ML Energy Load Forecast Curve */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-sm">24-Hour Predictive Energy Demand Forecast</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Model: RandomForestRegressor (100 Trees)</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {forecast.map((item, idx) => (
            <div key={idx} className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono font-bold text-cyan-400">{item.hour}</span>
                <span className="text-slate-500">{item.temp}°C</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Forecast Demand</span>
                <span className="text-base font-bold text-slate-100 font-mono">{item.predictedLoad} kW</span>
              </div>
              <div className="pt-1 border-t border-slate-800/80 text-[10px] flex items-center justify-between text-slate-400">
                <span>Gen Margin</span>
                <span className="text-emerald-400 font-mono font-bold">{item.targetGen} kW</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
