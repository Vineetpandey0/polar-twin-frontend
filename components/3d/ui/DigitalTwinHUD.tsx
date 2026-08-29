"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Zap,
  Droplets,
  Flame,
  Radio,
  Wind,
  Sun,
  Moon,
  Eye,
  Camera,
  RotateCw,
  Compass,
  Activity,
  AlertTriangle,
  Clock,
  Wrench,
  X,
  Maximize2,
  Minimize2,
  ShieldCheck,
} from "lucide-react";
import { DigitalTwinAsset } from "@/lib/3d/assetRegistry";
import { CameraPreset } from "./CameraController";

export type VisualizationLayer = "ALL" | "POWER" | "WATER" | "THERMAL" | "COMMS" | "WEATHER" | "NONE";

interface DigitalTwinHUDProps {
  stationId: "maitri" | "bharati";
  onStationChange: (st: "maitri" | "bharati") => void;
  activeLayer: VisualizationLayer;
  onLayerChange: (layer: VisualizationLayer) => void;
  cameraPreset: CameraPreset;
  onCameraChange: (preset: CameraPreset) => void;
  isPolarNight: boolean;
  onTogglePolarNight: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  selectedAsset: DigitalTwinAsset | null;
  onCloseAsset: () => void;
}

export function DigitalTwinHUD({
  stationId,
  onStationChange,
  activeLayer,
  onLayerChange,
  cameraPreset,
  onCameraChange,
  isPolarNight,
  onTogglePolarNight,
  autoRotate,
  onToggleAutoRotate,
  selectedAsset,
  onCloseAsset,
}: DigitalTwinHUDProps) {
  const isMaitri = stationId === "maitri";
  const [layersOpen, setLayersOpen] = useState(true);
  const [cameraOpen, setCameraOpen] = useState(true);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 font-sans">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pointer-events-auto">
        {/* Station Identity & Switcher */}
        <div className="glass-panel p-2.5 rounded-2xl border border-cyan-500/30 flex items-center space-x-3 bg-slate-950/80 backdrop-blur-xl shadow-2xl">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg glow-blue text-xs">
            {isMaitri ? "MAI" : "BHA"}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-extrabold text-slate-100 text-sm">
                {isMaitri ? "Maitri Station Twin" : "Bharati Station Twin"}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 animate-pulse">
                LIVE 3D SCADA
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {isMaitri ? "Schirmacher Oasis (-70.76°S, 11.73°E)" : "Larsemann Hills (-69.40°S, 76.18°E)"}
            </p>
          </div>

          <div className="flex items-center space-x-1 pl-2 border-l border-slate-800">
            <button
              onClick={() => onStationChange("maitri")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isMaitri ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Maitri
            </button>
            <button
              onClick={() => onStationChange("bharati")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !isMaitri ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Bharati
            </button>
          </div>
        </div>

        {/* Global Controls: Polar Lighting & Auto Tour */}
        <div className="glass-panel p-2 rounded-2xl border border-slate-800 flex items-center space-x-2 bg-slate-950/80 backdrop-blur-xl">
          <button
            onClick={onTogglePolarNight}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 text-xs font-bold flex items-center space-x-1.5 transition-all"
            title="Toggle Polar Day / Polar Night"
          >
            {isPolarNight ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span className="text-[11px]">{isPolarNight ? "Polar Night" : "Polar Day"}</span>
          </button>

          <button
            onClick={onToggleAutoRotate}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all ${
              autoRotate
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? "animate-spin" : ""}`} />
            <span className="text-[11px]">Tour Mode</span>
          </button>
        </div>
      </div>

      {/* Middle Row: Left Layer Controls & Right Selected Asset Telemetry Drawer */}
      <div className="flex items-start justify-between flex-1 my-4 pointer-events-none">
        {/* Left Side: System Visualization Layers */}
        <div className="pointer-events-auto space-y-2 max-w-[210px]">
          <div className="glass-card p-3 rounded-2xl border border-slate-800/90 bg-slate-950/90 backdrop-blur-xl space-y-2 shadow-2xl">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-xs font-bold text-slate-300">
              <div className="flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>System Layers</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              {[
                { id: "ALL", label: "Overview Layer", icon: Eye, color: "text-slate-300" },
                { id: "POWER", label: "Power Grid Flow", icon: Zap, color: "text-amber-400" },
                { id: "WATER", label: "Water & Intake Loop", icon: Droplets, color: "text-cyan-400" },
                { id: "THERMAL", label: "Thermal Heatmap", icon: Flame, color: "text-rose-400" },
                { id: "COMMS", label: "Satcom RF Links", icon: Radio, color: "text-sky-400" },
                { id: "WEATHER", label: "Wind & Particles", icon: Wind, color: "text-emerald-400" },
              ].map((layer) => {
                const Icon = layer.icon;
                const isActive = activeLayer === layer.id;

                return (
                  <button
                    key={layer.id}
                    onClick={() => onLayerChange(layer.id as VisualizationLayer)}
                    className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg font-semibold text-[11px] transition-all ${
                      isActive
                        ? "bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${layer.color}`} />
                    <span>{layer.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Camera Perspectives */}
          <div className="glass-card p-3 rounded-2xl border border-slate-800/90 bg-slate-950/90 backdrop-blur-xl space-y-2 shadow-2xl">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-xs font-bold text-slate-300">
              <div className="flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5 text-purple-400" />
                <span>Camera Views</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 text-[10px]">
              {[
                { id: "ORBIT", label: "Orbit 360" },
                { id: "TOP_DOWN", label: "Master Plan" },
                { id: "ISOMETRIC", label: "Isometric" },
                { id: "GROUND", label: "Ground View" },
                { id: "POWER_PLANT", label: "Power Plant" },
                { id: "WATER_INTAKE", label: "Water Intake" },
                { id: "COMMS_RADOME", label: "Satcom Array" },
                { id: "HELIPAD", label: "Helipad Deck" },
              ].map((cam) => (
                <button
                  key={cam.id}
                  onClick={() => onCameraChange(cam.id as CameraPreset)}
                  className={`px-2 py-1 rounded-md text-left font-mono truncate transition-all ${
                    cameraPreset === cam.id
                      ? "bg-purple-500/25 text-purple-300 border border-purple-500/40"
                      : "text-slate-400 hover:text-slate-200 bg-slate-900/50"
                  }`}
                >
                  {cam.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Selected Asset Inspector Drawer */}
        {selectedAsset && (
          <div className="pointer-events-auto glass-panel p-4 rounded-2xl border border-cyan-500/40 bg-slate-950/95 backdrop-blur-2xl shadow-2xl max-w-sm w-full space-y-3.5 animate-fadeIn">
            {/* Header */}
            <div className="flex items-start justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {selectedAsset.category} ASSET
                </span>
                <h3 className="font-extrabold text-slate-100 text-sm mt-1">{selectedAsset.name}</h3>
                <div className="text-[10px] text-slate-500 font-mono">{selectedAsset.assetId}</div>
              </div>
              <button
                onClick={onCloseAsset}
                className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Health & Prognostics Card */}
            <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 text-center">
              <div>
                <span className="text-[9px] text-slate-400 block uppercase">Health Score</span>
                <span className="text-sm font-black text-emerald-400 font-mono">
                  {Math.round(selectedAsset.healthScore * 100)}%
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block uppercase">Failure Risk</span>
                <span className="text-sm font-black text-slate-200 font-mono">
                  {(selectedAsset.failureProbability * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block uppercase">Est. RUL</span>
                <span className="text-sm font-black text-cyan-300 font-mono">
                  {selectedAsset.rulHours}h
                </span>
              </div>
            </div>

            {/* Real-Time Telemetry Grid */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Live Operating Telemetry
              </span>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {Object.entries(selectedAsset.readings || {}).map(([key, item]: [string, any]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between text-xs p-1.5 bg-slate-900/60 rounded-lg border border-slate-800/60"
                  >
                    <span className="text-slate-400 text-[11px]">{item.label || key}</span>
                    <span className="font-mono font-bold text-slate-100 text-[11px]">
                      {item.value} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications & Maintenance */}
            <div className="pt-2 border-t border-slate-800/80 text-[10px] space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Next Service Window:</span>
                <span className="font-mono text-slate-200">{selectedAsset.maintenance?.nextDueHours} operating hours</span>
              </div>
              <div className="flex justify-between">
                <span>Last Overhaul:</span>
                <span className="font-mono text-slate-300">{selectedAsset.maintenance?.lastService}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Bar */}
      <div className="flex items-center justify-between pointer-events-auto">
        <div className="glass-panel px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2 bg-slate-950/80">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Interactive 3D Viewport — Click any asset or tower to inspect telemetry</span>
        </div>

        <Link
          href={`/stations/${stationId}`}
          className="glass-panel px-3.5 py-2 rounded-xl border border-cyan-500/40 text-xs font-bold text-cyan-300 bg-slate-950/90 hover:bg-cyan-500/20 transition-all shadow-lg flex items-center space-x-1.5"
        >
          <span>Open Full 2D Telemetry Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
