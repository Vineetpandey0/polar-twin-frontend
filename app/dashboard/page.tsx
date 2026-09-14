"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StationCard from "@/components/hub/StationCard";
import AlertFeed from "@/components/hub/AlertFeed";
import { fetchStations, fetchStationAlerts } from "@/lib/api";
import { useTelemetry } from "@/lib/telemetry";
import { Activity, ShieldCheck, Flame, Radio, Cpu, Layers, Box, Compass, ExternalLink } from "lucide-react";

export default function TelemetryDashboard() {
  const telemetry = useTelemetry();
  const [stations, setStations] = useState<any[]>([
    {
      stationId: "maitri",
      name: "Maitri Research Station",
      location: "Schirmacher Oasis, Queen Maud Land (-70.7667° S, 11.7333° E)",
      healthScore: 0.94,
      alertCount: 1,
      connectivity: "LIVE",
    },
    {
      stationId: "bharati",
      name: "Bharati Research Station",
      location: "Larsemann Hills (-69.4072° S, 76.1872° E)",
      healthScore: 0.98,
      alertCount: 0,
      connectivity: "LIVE",
    },
  ]);

  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    async function loadLiveData() {
      try {
        const liveStations = await fetchStations();
        if (liveStations && Array.isArray(liveStations)) {
          setStations(
            liveStations.map((s: any) => ({
              stationId: s.station_id,
              name: s.name,
              location: s.location || "Antarctica",
              healthScore: s.health_score ?? 0.95,
              alertCount: s.active_alert_count ?? 0,
              connectivity: s.connectivity_status || "LIVE",
            }))
          );
        }

        const maitriAlerts = await fetchStationAlerts("maitri").catch(() => []);
        const bharatiAlerts = await fetchStationAlerts("bharati").catch(() => []);
        setAlerts([...(maitriAlerts || []), ...(bharatiAlerts || [])]);
      } catch (err) {
        console.error("Failed to load live hub data from API:", err);
      }
    }

    loadLiveData();
    const timer = setInterval(loadLiveData, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* 2D Dashboard Header with 3D Navigation Action */}
      <div className="bg-[#0F1722] p-5 lg:p-6 rounded-sm border border-[#1E2C3D] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5 text-xs sm:text-sm font-mono">
            <span className="text-[#38BDF8] font-bold">[NCPOR-OPS-01]</span>
            <span className="text-[#8CA1B6] font-medium">MINISTRY OF EARTH SCIENCES :: GOVT. OF INDIA</span>
            <span className="px-2 py-0.5 rounded-sm bg-[#131D2B] text-[#34D399] border border-[#1E2C3D] text-[11px] font-bold">
              2D TELEMETRY CONSOLE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#E2EAF4] tracking-wide uppercase leading-tight">
            Antarctic Mission Operations Command Hub
          </h1>
          <p className="text-sm sm:text-base text-[#8CA1B6] max-w-3xl leading-relaxed">
            Real-time Digital Twin telemetry, life-support microgrid surveillance & predictive maintenance engine for Maitri and Bharati research stations (SIH PS 26060).
          </p>

          <div className="pt-2 flex items-center space-x-3">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-sm bg-[#131D2B] hover:bg-[#1E2C3D] text-[#38BDF8] border border-[#38BDF8]/60 hover:border-[#38BDF8] transition-all duration-150 font-mono text-xs sm:text-sm font-bold shadow-[0_0_12px_rgba(56,189,248,0.15)] group"
            >
              <Box className="w-4 h-4 text-[#38BDF8] group-hover:scale-110 transition-transform" />
              <span>RETURN TO FULLSCREEN 3D DIGITAL TWIN</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30">
                [LIVE 3D]
              </span>
            </Link>

            <span className="text-xs font-mono text-[#5B7086] hidden sm:inline">
              // Switch to spatial viewport anytime
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0 font-mono">
          <div className="bg-[#131D2B] px-4 py-3 rounded-sm border border-[#1E2C3D] text-left">
            <span className="text-xs text-[#8CA1B6] block uppercase tracking-wider font-mono font-medium mb-0.5">Active Twins</span>
            <span className="text-2xl lg:text-[26px] font-bold text-[#E2EAF4] font-mono tnum leading-tight">2 STATIONS</span>
          </div>
          <div className="bg-[#131D2B] px-4 py-3 rounded-sm border border-[#1E2C3D] text-left">
            <span className="text-xs text-[#8CA1B6] block uppercase tracking-wider font-mono font-medium mb-0.5">Monitored Assets</span>
            <span className="text-2xl lg:text-[26px] font-bold text-[#34D399] font-mono tnum leading-tight">16 UNITS</span>
          </div>
          <div className="bg-[#131D2B] px-4 py-3 rounded-sm border border-[#1E2C3D] text-left">
            <span className="text-xs text-[#8CA1B6] block uppercase tracking-wider font-mono font-medium mb-0.5">Total Power Gen</span>
            <span className="text-2xl lg:text-[26px] font-bold text-[#38BDF8] font-mono tnum leading-tight">325.7 kW</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {stations.map((s) => (
          <StationCard key={s.stationId} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <AlertFeed alerts={alerts} />
        </div>

        <div className="bg-[#0F1722] rounded-sm p-5 border border-[#1E2C3D] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2C3D] pb-3">
            <div className="flex items-center space-x-2.5">
              <Layers className="w-5 h-5 text-[#38BDF8]" />
              <h2 className="font-semibold text-lg lg:text-xl text-[#E2EAF4] uppercase tracking-wider leading-snug">
                SCADA Telemetry Engine
              </h2>
            </div>
            <span
              className={`text-xs font-mono font-bold ${
                telemetry.isConnected
                  ? "text-[#34D399]"
                  : telemetry.isBackendAlive
                  ? "text-[#FBBF24]"
                  : "text-[#F87171]"
              }`}
            >
              {telemetry.isConnected
                ? "[LIVE SYNC]"
                : telemetry.isBackendAlive
                ? "[STANDBY]"
                : "[OFFLINE]"}
            </span>
          </div>

          <div className="space-y-2.5 font-mono">
            <div className="p-3 bg-[#131D2B] rounded-sm border border-[#1E2C3D] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Radio className="w-4 h-4 text-[#8CA1B6]" />
                <span className="text-sm sm:text-base text-[#8CA1B6]">MQTT Ingestion Rate</span>
              </div>
              <span className="text-sm sm:text-base text-[#E2EAF4] font-bold font-mono tnum">12 MSGS/SEC</span>
            </div>

            <div className="p-3 bg-[#131D2B] rounded-sm border border-[#1E2C3D] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Cpu className="w-4 h-4 text-[#8CA1B6]" />
                <span className="text-sm sm:text-base text-[#8CA1B6]">State Synchronization</span>
              </div>
              <span className="text-sm sm:text-base text-[#34D399] font-bold font-mono tnum">&lt; 50ms</span>
            </div>

            <div className="p-3 bg-[#131D2B] rounded-sm border border-[#1E2C3D] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Flame className="w-4 h-4 text-[#8CA1B6]" />
                <span className="text-sm sm:text-base text-[#8CA1B6]">Predictive Failure Risk</span>
              </div>
              <span className="text-sm sm:text-base text-[#34D399] font-bold font-mono tnum">NOMINAL (0.04)</span>
            </div>

            <div className="p-3 bg-[#131D2B] rounded-sm border border-[#1E2C3D] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Activity className="w-4 h-4 text-[#8CA1B6]" />
                <span className="text-sm sm:text-base text-[#8CA1B6]">Telemetry Bus Latency</span>
              </div>
              <span className="text-sm sm:text-base text-[#38BDF8] font-bold font-mono tnum">14ms [GROUND-LINK]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
