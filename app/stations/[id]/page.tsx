"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import HealthScoreGauge from "@/components/station/HealthScoreGauge";
import AssetStatusGrid from "@/components/station/AssetStatusGrid";
import PredictiveMLPanel from "@/components/station/PredictiveMLPanel";
import { fetchStationDetail } from "@/lib/api";
import { useTelemetry } from "@/lib/telemetry";
import { Zap, Activity, Thermometer, Wind, Eye, ShieldAlert, Cpu, Box, Maximize2, Brain, Sliders } from "lucide-react";

// R3F / Three.js uses WebGL (browser-only) — must never run on the server
const StationCanvas = dynamic(() => import("@/components/3d/StationCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-950 rounded-2xl border border-slate-800">
      <span className="text-xs text-slate-500 animate-pulse font-mono">Initialising 3D Engine...</span>
    </div>
  ),
});

export default function StationDetailPage() {
  const params = useParams();
  const stationId = (params.id as string) || "maitri";
  const isMaitri = stationId === "maitri";
  const telemetry = useTelemetry();

  const [activeTab, setActiveTab] = useState<"3d" | "ml" | "overview" | "energy" | "inventory">("3d");
  const [stationDetail, setStationDetail] = useState<any>(null);

  useEffect(() => {
    async function loadDetail() {
      try {
        const data = await fetchStationDetail(stationId);
        if (data) {
          setStationDetail(data);
        }
      } catch (err) {
        console.error(`Error loading live station detail for ${stationId}:`, err);
      }
    }
    loadDetail();
    const interval = setInterval(loadDetail, 3500);
    return () => clearInterval(interval);
  }, [stationId]);

  const defaultMockAssets: Record<string, any> = isMaitri
    ? {
        "GEN-MAI-001": { asset_id: "GEN-MAI-001", name: "Primary Generator 1", asset_type: "GENERATOR", operational_status: "RUNNING", health_score: 0.95 },
        "GEN-MAI-002": { asset_id: "GEN-MAI-002", name: "Primary Generator 2", asset_type: "GENERATOR", operational_status: "RUNNING", health_score: 0.92 },
        "BAT-MAI-001": { asset_id: "BAT-MAI-001", name: "Battery Bank A", asset_type: "BATTERY", operational_status: "RUNNING", health_score: 0.98 },
        "HVC-MAI-001": { asset_id: "HVC-MAI-001", name: "Central HVAC", asset_type: "HVAC", operational_status: "RUNNING", health_score: 0.88 },
        "WTR-MAI-001": { asset_id: "WTR-MAI-001", name: "Water Treatment Unit", asset_type: "WATER", operational_status: "RUNNING", health_score: 0.94 },
        "COM-MAI-001": { asset_id: "COM-MAI-001", name: "Satellite Link Array", asset_type: "COMMS", operational_status: "RUNNING", health_score: 0.99 },
      }
    : {
        "GEN-BHA-001": { asset_id: "GEN-BHA-001", name: "CHP Generator 1", asset_type: "GENERATOR", operational_status: "RUNNING", health_score: 0.97 },
        "BAT-BHA-001": { asset_id: "BAT-BHA-001", name: "Main Storage Bank", asset_type: "BATTERY", operational_status: "RUNNING", health_score: 0.99 },
        "HVC-BHA-001": { asset_id: "HVC-BHA-001", name: "Station Thermal System", asset_type: "HVAC", operational_status: "RUNNING", health_score: 0.93 },
      };

  const assets = stationDetail?.assets || defaultMockAssets;
  const healthScore = stationDetail?.station_health_score ?? (isMaitri ? 0.94 : 0.98);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Station Command Console Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between bg-[#0F1722] p-4 rounded-sm border border-[#1E2C3D] gap-4">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs mb-1">
            <span className={`font-bold ${isMaitri ? "text-[#FBBF24]" : "text-[#38BDF8]"}`}>
              [{isMaitri ? "STATION: MAITRI // 70.76°S 11.73°E" : "STATION: BHARATI // 69.41°S 76.19°E"}]
            </span>
            <span className="text-[#8CA1B6]">[3D SPATIAL DIGITAL TWIN]</span>
          </div>
          <h1 className="text-2xl lg:text-[28px] font-bold text-[#E2EAF4] tracking-wide uppercase leading-tight">
            {isMaitri ? "Maitri Station Operations Console" : "Bharati Station Operations Console"}
          </h1>
          <p className="text-sm font-mono text-[#8CA1B6] mt-1">
            {isMaitri ? "Schirmacher Oasis, Queen Maud Land (Established 1989)" : "Larsemann Hills, Ingrid Christensen Coast (Established 2012)"}
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link
            href={`/stations/${stationId}/details`}
            className="px-3 py-1.5 rounded-sm text-xs font-mono font-semibold flex items-center space-x-1.5 bg-[#131D2B] hover:bg-[#1E2C3D] text-[#E2EAF4] border border-[#1E2C3D] hover:border-[#38BDF8] transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>MACHINERY HUB</span>
          </Link>
          <Link
            href={`/stations/${stationId}/3d`}
            className="px-3 py-1.5 rounded-sm bg-[#131D2B] hover:bg-[#1E2C3D] text-[#38BDF8] border border-[#1E2C3D] hover:border-[#38BDF8] text-xs font-mono font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>FULLSCREEN 3D</span>
          </Link>
          <HealthScoreGauge score={healthScore} />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 border-b border-[#1E2C3D] pb-1 font-mono text-xs">
        {(["3d", "ml", "overview", "energy", "inventory"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-sm font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
              activeTab === tab
                ? "bg-[#131D2B] text-[#E2EAF4] border border-[#1E2C3D] border-b-2 border-b-[#38BDF8]"
                : "text-[#8CA1B6] hover:text-[#E2EAF4] hover:bg-[#131D2B]/50"
            }`}
          >
            {tab === "3d" && <Box className="w-3.5 h-3.5" />}
            {tab === "ml" && <Brain className="w-3.5 h-3.5 text-[#38BDF8]" />}
            <span>
              {tab === "3d"
                ? "3D Spatial Twin"
                : tab === "ml"
                ? "ML Prognostics"
                : tab === "overview"
                ? "Sensors & Assets"
                : tab === "energy"
                ? "Energy Grid"
                : "Station Logistics"}
            </span>
          </button>
        ))}
        {isMaitri && (
          <Link
            href="/stations/maitri/details"
            className="px-3 py-1.5 rounded-sm font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5 text-[#FBBF24] hover:bg-[#131D2B] border border-transparent hover:border-[#1E2C3D]"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Machinery Explorer</span>
          </Link>
        )}
      </div>

      {/* 3D Spatial Twin Tab */}
      {activeTab === "3d" && (
        <div className="space-y-2">
          <div className="h-[600px] w-full rounded-sm border border-[#1E2C3D] overflow-hidden bg-[#090D14]">
            <StationCanvas stationId={stationId} />
          </div>
        </div>
      )}

      {/* ML & Prognostics Tab */}
      {activeTab === "ml" && <PredictiveMLPanel stationId={stationId} />}

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
            <div className="bg-[#0F1722] p-3 rounded-sm border border-[#1E2C3D] flex items-center space-x-3">
              <Thermometer className="w-5 h-5 text-[#38BDF8]" />
              <div>
                <span className="text-[11px] text-[#8CA1B6] uppercase tracking-wider block font-mono">Ambient Temp</span>
                <span className="text-[22px] font-bold font-mono text-[#E2EAF4] tnum leading-tight">{isMaitri ? "-25.2°C" : "-18.4°C"}</span>
              </div>
            </div>

            <div className="bg-[#0F1722] p-3 rounded-sm border border-[#1E2C3D] flex items-center space-x-3">
              <Wind className="w-5 h-5 text-[#38BDF8]" />
              <div>
                <span className="text-[11px] text-[#8CA1B6] uppercase tracking-wider block font-mono">Wind Velocity</span>
                <span className="text-[22px] font-bold font-mono text-[#E2EAF4] tnum leading-tight">{isMaitri ? "28.5 km/h" : "34.1 km/h"}</span>
              </div>
            </div>

            <div className="bg-[#0F1722] p-3 rounded-sm border border-[#1E2C3D] flex items-center space-x-3">
              <Eye className="w-5 h-5 text-[#34D399]" />
              <div>
                <span className="text-[11px] text-[#8CA1B6] uppercase tracking-wider block font-mono">Surface Visibility</span>
                <span className="text-[22px] font-bold font-mono text-[#E2EAF4] tnum leading-tight">10.0 km</span>
              </div>
            </div>

            <div className="bg-[#0F1722] p-3 rounded-sm border border-[#1E2C3D] flex items-center space-x-3">
              <Activity className="w-5 h-5 text-[#38BDF8]" />
              <div>
                <span className="text-[11px] text-[#8CA1B6] uppercase tracking-wider block font-mono">Barometric Press</span>
                <span className="text-[22px] font-bold font-mono text-[#E2EAF4] tnum leading-tight">984.2 hPa</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0F1722] p-4 rounded-sm border border-[#1E2C3D]">
            <h2 className="text-[17px] font-semibold text-[#E2EAF4] uppercase tracking-wider mb-3 leading-snug">
              Station Telemetry Matrix :: Monitored Subsystems
            </h2>
            <AssetStatusGrid assets={assets} />
          </div>
        </div>
      )}

      {/* Energy Tab */}
      {activeTab === "energy" && (
        <div className="bg-[#0F1722] p-4 rounded-sm border border-[#1E2C3D] space-y-3 font-mono">
          <h2 className="font-semibold text-[17px] text-[#E2EAF4] uppercase tracking-wider border-b border-[#1E2C3D] pb-2 leading-snug">
            Energy Generation & Microgrid Load Distribution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-[#131D2B] rounded-sm border border-[#1E2C3D]">
              <span className="text-[11px] text-[#8CA1B6] uppercase tracking-wider block mb-1">ACTIVE GENERATION</span>
              <span className="text-[24px] font-bold font-mono text-[#E2EAF4] tnum leading-none">{isMaitri ? "145.2 kW" : "180.5 kW"}</span>
            </div>
            <div className="p-3 bg-[#131D2B] rounded-sm border border-[#1E2C3D]">
              <span className="text-[11px] text-[#8CA1B6] uppercase tracking-wider block mb-1">STATION BASE LOAD</span>
              <span className="text-[24px] font-bold font-mono text-[#38BDF8] tnum leading-none">{isMaitri ? "110.0 kW" : "135.0 kW"}</span>
            </div>
            <div className="p-3 bg-[#131D2B] rounded-sm border border-[#1E2C3D]">
              <span className="text-[11px] text-[#8CA1B6] uppercase tracking-wider block mb-1">BATTERY STORAGE SOC</span>
              <span className="text-[24px] font-bold font-mono text-[#34D399] tnum leading-none">{isMaitri ? "88.0%" : "94.2%"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === "inventory" && (
        <div className="bg-[#0F1722] p-4 rounded-sm border border-[#1E2C3D] space-y-3 font-mono">
          <h2 className="font-semibold text-[17px] text-[#E2EAF4] uppercase tracking-wider border-b border-[#1E2C3D] pb-2 leading-snug">
            Station Strategic Stock & Life-Support Reserves
          </h2>
          <div className="space-y-2">
            <div className="p-3 bg-[#131D2B] rounded-sm border border-[#1E2C3D] flex justify-between items-center">
              <span className="text-sm font-medium text-[#E2EAF4]">Arctic High-Grade ATF / Diesel Reserve</span>
              <span className="text-base font-bold font-mono text-[#E2EAF4] tnum">{isMaitri ? "45,000 L" : "60,000 L"}</span>
            </div>
            <div className="p-3 bg-[#131D2B] rounded-sm border border-[#1E2C3D] flex justify-between items-center">
              <span className="text-sm font-medium text-[#E2EAF4]">Food & Ration Endurance Window</span>
              <span className="text-base font-bold font-mono text-[#34D399] tnum">{isMaitri ? "120 DAYS" : "180 DAYS"}</span>
            </div>
            <div className="p-3 bg-[#131D2B] rounded-sm border border-[#1E2C3D] flex justify-between items-center">
              <span className="text-sm font-medium text-[#E2EAF4]">Medical Trauma Reserves</span>
              <span className="text-base font-bold font-mono text-[#34D399] tnum">100% NOMINAL</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
