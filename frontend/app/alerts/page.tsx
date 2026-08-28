"use client";

import { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Filter,
  Search,
  Check,
  Radio,
  Cpu,
  Clock,
  Wrench,
  AlertOctagon,
} from "lucide-react";

interface AlertItem {
  id: number;
  station_id: string;
  asset_id: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  title: string;
  message: string;
  reason: string;
  remedy: string;
  created_at: string;
  acknowledged: boolean;
}

export default function AlertCenterPage() {
  const [stationFilter, setStationFilter] = useState<"ALL" | "maitri" | "bharati">("ALL");
  const [severityFilter, setSeverityFilter] = useState<"ALL" | "CRITICAL" | "WARNING" | "INFO">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "ACKNOWLEDGED" | "ALL">("ACTIVE");
  const [searchQuery, setSearchQuery] = useState("");

  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 1,
      station_id: "maitri",
      asset_id: "HVC-MAI-001",
      severity: "WARNING",
      title: "HVAC Thermal Load Delta Exceeded",
      message: "Central HVAC heating load at 92% due to -25.2°C ambient blizzard conditions",
      reason: "Intake duct air temperature dropped below -24°C, increasing auxiliary heating element duty cycle.",
      remedy: "Inspect thermal intake dampers and enable secondary zone circulation fan.",
      created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      acknowledged: false,
    },
    {
      id: 2,
      station_id: "maitri",
      asset_id: "GEN-MAI-002",
      severity: "WARNING",
      title: "Primary Generator Coolant Temp Warning",
      message: "GEN-MAI-002 coolant temperature operating at 82.1°C (Threshold: 80°C)",
      reason: "Continuous 67 kW active load under restricted intake radiator airflow.",
      remedy: "Clear snow accumulation around radiator intake louvers.",
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      acknowledged: false,
    },
    {
      id: 3,
      station_id: "bharati",
      asset_id: "BAT-BHA-001",
      severity: "INFO",
      title: "Battery Storage Bank Floating Charge Mode",
      message: "Main Energy Storage Bank reached 94% SOC. Switch to float charging.",
      reason: "CHP Generator output surplus currently balancing base load.",
      remedy: "No action required. Automatic BESS BMS power management active.",
      created_at: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
      acknowledged: true,
    },
    {
      id: 4,
      station_id: "maitri",
      asset_id: "WTR-MAI-001",
      severity: "INFO",
      title: "Priyadarshini Water Unit Nominal Filtration",
      message: "Daily meltwater filtration batch completed: 8,200 L reserve maintained.",
      reason: "Thermal heating line operational, pump pressure stable at 3.8 bar.",
      remedy: "Standard routine inspection on next scheduled cycle.",
      created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      acknowledged: true,
    },
  ]);

  const handleAcknowledge = (id: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const filteredAlerts = alerts.filter((a) => {
    if (stationFilter !== "ALL" && a.station_id !== stationFilter) return false;
    if (severityFilter !== "ALL" && a.severity !== severityFilter) return false;
    if (statusFilter === "ACTIVE" && a.acknowledged) return false;
    if (statusFilter === "ACKNOWLEDGED" && !a.acknowledged) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.message.toLowerCase().includes(q) ||
        a.asset_id.toLowerCase().includes(q) ||
        a.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const criticalCount = alerts.filter((a) => a.severity === "CRITICAL" && !a.acknowledged).length;
  const warningCount = alerts.filter((a) => a.severity === "WARNING" && !a.acknowledged).length;
  const activeTotal = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Operations Center
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 mt-1 flex items-center space-x-2.5">
            <ShieldAlert className="w-7 h-7 text-amber-400" />
            <span>Station Alert & Anomaly Center</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time rule engine & ML anomaly detection stream for Maitri and Bharati
          </p>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center space-x-3">
          <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Critical</span>
              <span className="text-lg font-bold text-rose-400">{criticalCount}</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Warning</span>
              <span className="text-lg font-bold text-amber-400">{warningCount}</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Active</span>
              <span className="text-lg font-bold text-cyan-400">{activeTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-card p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Station Selector */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 space-x-1 text-xs">
            {(["ALL", "maitri", "bharati"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStationFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                  stationFilter === st
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {st === "ALL" ? "All Stations" : st}
              </button>
            ))}
          </div>

          {/* Severity Selector */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 space-x-1 text-xs">
            {(["ALL", "CRITICAL", "WARNING", "INFO"] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                  severityFilter === sev
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Status Selector */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 space-x-1 text-xs">
            {(["ACTIVE", "ACKNOWLEDGED", "ALL"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                  statusFilter === st
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts or asset ID..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl border border-slate-800 text-center flex flex-col items-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400/80" />
            <h3 className="font-bold text-slate-200">No Alerts Match Selected Filters</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              All monitored subsystems and generators are operating within safe deterministic thresholds.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCrit = alert.severity === "CRITICAL";
            const isWarn = alert.severity === "WARNING";

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border transition-all glass-card ${
                  isCrit
                    ? "bg-rose-500/10 border-rose-500/30"
                    : isWarn
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-slate-900/60 border-slate-800"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3.5">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                        isCrit
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                          : isWarn
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                      }`}
                    >
                      {isCrit ? (
                        <AlertOctagon className="w-5 h-5" />
                      ) : isWarn ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <Info className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950/80 text-cyan-300 uppercase">
                          {alert.station_id}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 uppercase">
                          {alert.asset_id}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isCrit
                              ? "bg-rose-500/30 text-rose-200"
                              : isWarn
                              ? "bg-amber-500/30 text-amber-200"
                              : "bg-cyan-500/30 text-cyan-200"
                          }`}
                        >
                          {alert.severity}
                        </span>
                        {alert.acknowledged && (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            ACKNOWLEDGED
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-100">{alert.title}</h3>
                      <p className="text-xs text-slate-300">{alert.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
                    <div className="text-right text-[11px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(alert.created_at).toLocaleTimeString()}</span>
                    </div>

                    {!alert.acknowledged ? (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-all shadow-md"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Acknowledge</span>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-1 text-xs text-emerald-400 font-semibold px-2 py-1 bg-emerald-500/10 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolved</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reasoning & Corrective Action */}
                <div className="mt-3.5 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-0.5">
                      Diagnostic Root Cause
                    </span>
                    <span className="text-slate-300 leading-relaxed">{alert.reason}</span>
                  </div>

                  <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60 flex items-start space-x-2">
                    <Wrench className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-cyan-400 font-semibold uppercase block mb-0.5">
                        Recommended Operator SOP
                      </span>
                      <span className="text-slate-300 leading-relaxed">{alert.remedy}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
