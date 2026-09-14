"use client";

import { useState, useEffect, useCallback } from "react";
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
  RefreshCw,
  Database,
} from "lucide-react";
import { fetchAllAlerts, acknowledgeAlert } from "@/lib/api";

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

  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await fetchAllAlerts(
        stationFilter !== "ALL" ? stationFilter : undefined,
        severityFilter !== "ALL" ? severityFilter : undefined,
        statusFilter !== "ALL" ? statusFilter : undefined
      );
      if (Array.isArray(data)) {
        setAlerts(data);
      } else {
        setAlerts([]);
      }
    } catch (err: any) {
      console.error("Failed to load alerts from database:", err);
      setError("Unable to sync alerts directly from the database server. Check backend connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [stationFilter, severityFilter, statusFilter]);

  useEffect(() => {
    loadAlerts();
    const timer = setInterval(() => loadAlerts(true), 25000);
    return () => clearInterval(timer);
  }, [loadAlerts]);

  const handleAcknowledge = async (id: number) => {
    try {
      // Optimistic update
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
      );
      await acknowledgeAlert(id);
    } catch (err) {
      console.error("Failed to acknowledge alert in database:", err);
      loadAlerts();
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.message && a.message.toLowerCase().includes(q)) ||
        (a.asset_id && a.asset_id.toLowerCase().includes(q)) ||
        (a.reason && a.reason.toLowerCase().includes(q)) ||
        (a.station_id && a.station_id.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const criticalCount = alerts.filter((a) => a.severity === "CRITICAL" && !a.acknowledged).length;
  const warningCount = alerts.filter((a) => a.severity === "WARNING" && !a.acknowledged).length;
  const activeTotal = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="bg-[#0F1722] p-4 rounded-sm border border-[#1E2C3D] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs mb-1">
            <span className="text-[#38BDF8] font-bold">[OPERATIONS CENTER :: FAULT MONITOR]</span>
            <span className="text-[#8CA1B6]">[NCPOR TELEMETRY BUS]</span>
            <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-[#10291D] text-[#34D399] border border-[#34D399]/40 text-[10px]">
              <Database className="w-3 h-3" />
              <span>LIVE DB DATA</span>
            </span>
          </div>
          <h1 className="text-2xl lg:text-[28px] font-bold text-[#E2EAF4] uppercase tracking-wide leading-tight flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-[#FBBF24]" />
            <span>Station Alert & Incident Console</span>
          </h1>
          <p className="text-sm font-mono text-[#8CA1B6] mt-1 leading-relaxed">
            Deterministic SCADA limits and predictive ML isolation forest anomaly stream for Maitri and Bharati
          </p>
        </div>

        {/* Stats Metrics & Manual Refresh */}
        <div className="flex items-center space-x-2 font-mono">
          <div className="bg-[#180D11] border border-[#F87171] px-3.5 py-2 rounded-sm flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#F87171]" />
            <div>
              <span className="text-[10px] text-[#8CA1B6] uppercase tracking-wider block">Critical</span>
              <span className="text-[22px] font-bold font-mono text-[#F87171] tnum leading-tight">{criticalCount} FAULTS</span>
            </div>
          </div>

          <div className="bg-[#19150E] border border-[#FBBF24] px-3.5 py-2 rounded-sm flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#FBBF24]" />
            <div>
              <span className="text-[10px] text-[#8CA1B6] uppercase tracking-wider block">Advisory</span>
              <span className="text-[22px] font-bold font-mono text-[#FBBF24] tnum leading-tight">{warningCount} WARNS</span>
            </div>
          </div>

          <div className="bg-[#131D2B] border border-[#1E2C3D] px-3.5 py-2 rounded-sm flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]" />
            <div>
              <span className="text-[10px] text-[#8CA1B6] uppercase tracking-wider block">Total Active</span>
              <span className="text-[22px] font-bold font-mono text-[#38BDF8] tnum leading-tight">{activeTotal} EVENTS</span>
            </div>
          </div>

          <button
            onClick={() => loadAlerts(true)}
            disabled={refreshing}
            className="p-3 bg-[#131D2B] hover:bg-[#1E2C3D] border border-[#1E2C3D] text-[#8CA1B6] hover:text-[#38BDF8] rounded-sm transition-colors"
            title="Refresh alerts from database"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#38BDF8]" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-sm bg-[#2D1217] border border-[#F87171] text-[#F87171] text-xs font-mono">
          {error}
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="bg-[#0F1722] p-3 rounded-sm border border-[#1E2C3D] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Station Selector */}
          <div className="flex items-center bg-[#131D2B] p-0.5 rounded-sm border border-[#1E2C3D] space-x-0.5">
            {(["ALL", "maitri", "bharati"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStationFilter(st)}
                className={`px-2.5 py-1 rounded-sm uppercase tracking-wider transition-colors text-[11px] ${
                  stationFilter === st
                    ? "bg-[#1E2C3D] text-[#E2EAF4] font-bold border border-[#38BDF8]"
                    : "text-[#8CA1B6] hover:text-[#E2EAF4]"
                }`}
              >
                {st === "ALL" ? "ALL STATIONS" : st.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Severity Selector */}
          <div className="flex items-center bg-[#131D2B] p-0.5 rounded-sm border border-[#1E2C3D] space-x-0.5">
            {(["ALL", "CRITICAL", "WARNING", "INFO"] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2 py-1 rounded-sm uppercase tracking-wider transition-colors text-[11px] ${
                  severityFilter === sev
                    ? "bg-[#1E2C3D] text-[#E2EAF4] font-bold border border-[#38BDF8]"
                    : "text-[#8CA1B6] hover:text-[#E2EAF4]"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Status Selector */}
          <div className="flex items-center bg-[#131D2B] p-0.5 rounded-sm border border-[#1E2C3D] space-x-0.5">
            {(["ACTIVE", "ACKNOWLEDGED", "ALL"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-1 rounded-sm uppercase tracking-wider transition-colors text-[11px] ${
                  statusFilter === st
                    ? "bg-[#1E2C3D] text-[#E2EAF4] font-bold border border-[#38BDF8]"
                    : "text-[#8CA1B6] hover:text-[#E2EAF4]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-[#8CA1B6] absolute left-2.5 top-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter node or asset ID..."
            className="w-full bg-[#131D2B] border border-[#1E2C3D] rounded-sm pl-8 pr-3 py-1 text-xs font-mono text-[#E2EAF4] placeholder-[#5B7086] focus:outline-none focus:border-[#38BDF8]"
          />
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-2.5">
        {loading ? (
          <div className="bg-[#0F1722] p-10 rounded-sm border border-[#1E2C3D] text-center flex flex-col items-center justify-center space-y-3 font-mono">
            <div className="w-8 h-8 rounded-full border-2 border-[#1E2C3D] border-t-[#38BDF8] animate-spin" />
            <span className="text-xs text-[#8CA1B6]">QUERYING SUPABASE DATABASE ALERTS STREAM...</span>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="bg-[#0F1722] p-10 rounded-sm border border-[#1E2C3D] text-center flex flex-col items-center space-y-2 font-mono">
            <CheckCircle2 className="w-8 h-8 text-[#34D399]" />
            <h3 className="font-bold text-sm text-[#E2EAF4] uppercase">[TELEMETRY NOMINAL]</h3>
            <p className="text-xs text-[#8CA1B6] max-w-sm">
              All monitored subsystems and generators are operating within verified operational envelopes.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCrit = alert.severity === "CRITICAL";
            const isWarn = alert.severity === "WARNING";

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-sm border transition-colors ${
                  isCrit
                    ? "bg-[#180D11] border-[#F87171]"
                    : isWarn
                    ? "bg-[#19150E] border-[#FBBF24]"
                    : "bg-[#0F1722] border-[#1E2C3D]"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-sm shrink-0 mt-0.5 border ${
                        isCrit
                          ? "bg-[#2D1217] border-[#F87171] text-[#F87171]"
                          : isWarn
                          ? "bg-[#292010] border-[#FBBF24] text-[#FBBF24]"
                          : "bg-[#131D2B] border-[#1E2C3D] text-[#38BDF8]"
                      }`}
                    >
                      {isCrit ? (
                        <AlertOctagon className="w-4 h-4" />
                      ) : isWarn ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <Info className="w-4 h-4" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2 font-mono text-[10px]">
                        <span className="font-bold px-1.5 py-0.5 rounded-sm bg-[#131D2B] text-[#38BDF8] border border-[#1E2C3D] uppercase">
                          [{alert.station_id.toUpperCase()}]
                        </span>
                        <span className="px-1.5 py-0.5 rounded-sm bg-[#131D2B] text-[#8CA1B6] border border-[#1E2C3D] uppercase">
                          [{alert.asset_id}]
                        </span>
                        <span
                          className={`font-bold uppercase px-1.5 py-0.5 rounded-sm border ${
                            isCrit
                              ? "bg-[#2D1217] border-[#F87171] text-[#F87171]"
                              : isWarn
                              ? "bg-[#292010] border-[#FBBF24] text-[#FBBF24]"
                              : "bg-[#131D2B] border-[#1E2C3D] text-[#38BDF8]"
                          }`}
                        >
                          [{alert.severity}]
                        </span>
                        {alert.acknowledged && (
                          <span className="font-bold uppercase px-1.5 py-0.5 rounded-sm bg-[#10291D] text-[#34D399] border border-[#34D399]">
                            [ACKNOWLEDGED]
                          </span>
                        )}
                      </div>

                      <h3 className="text-[15.5px] font-semibold text-[#E2EAF4] tracking-wide mt-1 leading-snug">{alert.title}</h3>
                      <p className="text-sm text-[#8CA1B6] mt-0.5 leading-relaxed">{alert.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 self-end md:self-center font-mono text-xs">
                    <div className="text-right text-[11px] text-[#8CA1B6] flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span className="tnum">{new Date(alert.created_at).toLocaleTimeString()}</span>
                    </div>

                    {!alert.acknowledged ? (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="px-2.5 py-1.5 rounded-sm bg-[#131D2B] hover:bg-[#1E2C3D] text-xs font-semibold text-[#E2EAF4] border border-[#1E2C3D] hover:border-[#38BDF8] flex items-center space-x-1.5 transition-colors"
                      >
                        <Check className="w-3 h-3 text-[#34D399]" />
                        <span>ACKNOWLEDGE</span>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-1 text-xs text-[#34D399] font-semibold px-2 py-0.5 bg-[#10291D] border border-[#34D399] rounded-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>LOGGED</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reasoning & Corrective Action */}
                <div className="mt-3 pt-2.5 border-t border-[#1E2C3D] grid grid-cols-1 md:grid-cols-2 gap-2.5 font-mono">
                  <div className="bg-[#131D2B] p-2.5 rounded-sm border border-[#1E2C3D]">
                    <span className="text-[10px] text-[#8CA1B6] font-semibold uppercase tracking-wider block mb-1">
                      DIAGNOSTIC ROOT CAUSE
                    </span>
                    <p className="text-sm text-[#E2EAF4] leading-relaxed">{alert.reason}</p>
                  </div>

                  <div className="bg-[#131D2B] p-2.5 rounded-sm border border-[#1E2C3D] flex items-start space-x-2">
                    <Wrench className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-[#38BDF8] font-semibold uppercase tracking-wider block mb-1">
                        OPERATOR SOP ACTION
                      </span>
                      <p className="text-sm text-[#E2EAF4] leading-relaxed">{alert.remedy}</p>
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
