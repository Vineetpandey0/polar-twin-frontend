"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import HealthScoreGauge from "@/components/station/HealthScoreGauge";
import AssetStatusGrid from "@/components/station/AssetStatusGrid";
import PredictiveMLPanel from "@/components/station/PredictiveMLPanel";
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

  const [activeTab, setActiveTab] = useState<"3d" | "ml" | "overview" | "energy" | "inventory">("3d");

  const mockAssets: Record<string, any> = isMaitri
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
              isMaitri ? "bg-amber-500/20 text-amber-400" : "bg-cyan-500/20 text-cyan-400"
            }`}>
              Digital Twin Model
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              3D Interactive
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
              ML Prognostics Active
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 mt-1">
            {isMaitri ? "Maitri Station Twin" : "Bharati Station Twin"}
          </h1>
          <p className="text-xs text-slate-400">
            {isMaitri ? "Schirmacher Oasis (-70.7667° S, 11.7333° E)" : "Larsemann Hills (-69.4072° S, 76.1872° E)"}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/stations/${stationId}/details`}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-lg border ${
              isMaitri
                ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-500/40"
                : "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border-cyan-500/40"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{isMaitri ? "Maitri Machinery Hub" : "Bharati Machinery Hub"}</span>
          </Link>
          <Link
            href={`/stations/${stationId}/3d`}
            className="px-4 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-bold flex items-center space-x-2 transition-all shadow-lg"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Fullscreen 3D</span>
          </Link>
          <HealthScoreGauge score={isMaitri ? 0.94 : 0.98} />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        {(["3d", "ml", "overview", "energy", "inventory"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === tab
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab === "3d" && <Box className="w-3.5 h-3.5" />}
            {tab === "ml" && <Brain className="w-3.5 h-3.5 text-cyan-400" />}
            <span>
              {tab === "3d"
                ? "3D Spatial Twin"
                : tab === "ml"
                ? "ML & Prognostics"
                : tab}
            </span>
          </button>
        ))}
        {isMaitri && (
          <Link
            href="/stations/maitri/details"
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 text-amber-400 hover:bg-amber-500/10 border border-amber-500/30"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Maitri Machinery & Science Explorer</span>
          </Link>
        )}
      </div>

      {/* 3D Spatial Twin Tab */}
      {activeTab === "3d" && (
        <div className="space-y-4">
          <div className="h-[600px] w-full">
            <StationCanvas stationId={stationId} />
          </div>
        </div>
      )}

      {/* ML & Prognostics Tab */}
      {activeTab === "ml" && <PredictiveMLPanel stationId={stationId} />}

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center space-x-3">
              <Thermometer className="w-6 h-6 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ambient Temp</span>
                <span className="text-lg font-bold text-slate-100">{isMaitri ? "-25.2°C" : "-18.4°C"}</span>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center space-x-3">
              <Wind className="w-6 h-6 text-cyan-400" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Wind Speed</span>
                <span className="text-lg font-bold text-slate-100">{isMaitri ? "28.5 km/h" : "34.1 km/h"}</span>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center space-x-3">
              <Eye className="w-6 h-6 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Visibility</span>
                <span className="text-lg font-bold text-slate-100">10.0 km</span>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center space-x-3">
              <Activity className="w-6 h-6 text-purple-400" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pressure</span>
                <span className="text-lg font-bold text-slate-100">984.2 hPa</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">Subsystem Assets Status</h3>
            <AssetStatusGrid assets={mockAssets} />
          </div>
        </div>
      )}

      {/* Energy Tab */}
      {activeTab === "energy" && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-100">Energy Generation & Load Flow</h3>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Active Power Generation</span>
              <span className="text-xl font-bold text-amber-400">{isMaitri ? "145.2 kW" : "180.5 kW"}</span>
            </div>
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Station Base Load</span>
              <span className="text-xl font-bold text-cyan-400">{isMaitri ? "110.0 kW" : "135.0 kW"}</span>
            </div>
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Battery Storage State</span>
              <span className="text-xl font-bold text-emerald-400">{isMaitri ? "88% SOC" : "94% SOC"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === "inventory" && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-100">Station Inventory Levels</h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-900/60 rounded-xl flex justify-between items-center">
              <span>Arctic High-Grade Diesel Reserve</span>
              <span className="font-bold text-amber-400">{isMaitri ? "45,000 L" : "60,000 L"}</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl flex justify-between items-center">
              <span>Food & Dry Ration Reserves</span>
              <span className="font-bold text-emerald-400">{isMaitri ? "120 Days" : "180 Days"}</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl flex justify-between items-center">
              <span>Medical Supplies & Trauma Kits</span>
              <span className="font-bold text-emerald-400">100% Stock</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
