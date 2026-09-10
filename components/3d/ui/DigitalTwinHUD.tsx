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
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-3 font-mono">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pointer-events-auto">
        {/* Station Identity & Switcher */}
        <div className="bg-[#0F1722] p-2 rounded-sm border border-[#1E2C3D] flex items-center space-x-3">
          <div className="w-8 h-8 rounded-sm bg-[#131D2B] border border-[#38BDF8] flex items-center justify-center font-bold text-[#38BDF8] text-xs">
            {isMaitri ? "MAI" : "BHA"}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-[#E2EAF4] text-xs uppercase tracking-wide">
                {isMaitri ? "Maitri 3D Digital Twin" : "Bharati 3D Digital Twin"}
              </h2>
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[#10291D] text-[#34D399] font-bold border border-[#34D399]">
                [LIVE 3D SCADA]
              </span>
            </div>
            <p className="text-[10px] text-[#8CA1B6]">
              {isMaitri ? "Schirmacher Oasis (-70.76°S, 11.73°E)" : "Larsemann Hills (-69.40°S, 76.18°E)"}
            </p>
          </div>

          <div className="flex items-center space-x-1 pl-2 border-l border-[#1E2C3D]">
            <button
              onClick={() => onStationChange("maitri")}
              className={`px-2 py-1 rounded-sm text-xs font-semibold uppercase transition-colors ${
                isMaitri ? "bg-[#131D2B] text-[#FBBF24] border border-[#FBBF24]" : "text-[#8CA1B6] hover:text-[#E2EAF4]"
              }`}
            >
              MAITRI
            </button>
            <button
              onClick={() => onStationChange("bharati")}
              className={`px-2 py-1 rounded-sm text-xs font-semibold uppercase transition-colors ${
                !isMaitri ? "bg-[#131D2B] text-[#38BDF8] border border-[#38BDF8]" : "text-[#8CA1B6] hover:text-[#E2EAF4]"
              }`}
            >
              BHARATI
            </button>
          </div>
        </div>

        {/* Global Controls: Polar Lighting & Auto Tour */}
        <div className="bg-[#0F1722] p-1.5 rounded-sm border border-[#1E2C3D] flex items-center space-x-1.5">
          <button
            onClick={onTogglePolarNight}
            className="px-2.5 py-1 rounded-sm bg-[#131D2B] hover:bg-[#1E2C3D] border border-[#1E2C3D] text-[#E2EAF4] text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            title="Toggle Polar Day / Polar Night"
          >
            {isPolarNight ? <Moon className="w-3.5 h-3.5 text-[#38BDF8]" /> : <Sun className="w-3.5 h-3.5 text-[#FBBF24]" />}
            <span className="text-[11px] uppercase">{isPolarNight ? "POLAR NIGHT" : "POLAR DAY"}</span>
          </button>

          <button
            onClick={onToggleAutoRotate}
            className={`px-2.5 py-1 rounded-sm border text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
              autoRotate
                ? "bg-[#131D2B] text-[#38BDF8] border-[#38BDF8]"
                : "bg-[#131D2B] border-[#1E2C3D] text-[#8CA1B6] hover:text-[#E2EAF4]"
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="text-[11px] uppercase">TOUR MODE</span>
          </button>
        </div>
      </div>

      {/* Middle Row: Left Layer Controls & Right Selected Asset Telemetry Drawer */}
      <div className="flex items-start justify-between flex-1 my-3 pointer-events-none">
        {/* Left Side: System Visualization Layers */}
        <div className="pointer-events-auto space-y-2 max-w-[200px]">
          <div className="bg-[#0F1722] p-2.5 rounded-sm border border-[#1E2C3D] space-y-1.5">
            <div className="flex items-center justify-between pb-1 border-b border-[#1E2C3D] text-xs font-bold text-[#E2EAF4]">
              <div className="flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="uppercase text-[11px]">SCADA Layers</span>
              </div>
            </div>

            <div className="space-y-0.5 text-xs">
              {[
                { id: "ALL", label: "Overview Layer", icon: Eye, color: "text-[#E2EAF4]" },
                { id: "POWER", label: "Power Grid Flow", icon: Zap, color: "text-[#FBBF24]" },
                { id: "WATER", label: "Water & Intake Loop", icon: Droplets, color: "text-[#38BDF8]" },
                { id: "THERMAL", label: "Thermal Heatmap", icon: Flame, color: "text-[#F87171]" },
                { id: "COMMS", label: "Satcom RF Links", icon: Radio, color: "text-[#38BDF8]" },
                { id: "WEATHER", label: "Wind & Particles", icon: Wind, color: "text-[#34D399]" },
              ].map((layer) => {
                const Icon = layer.icon;
                const isActive = activeLayer === layer.id;

                return (
                  <button
                    key={layer.id}
                    onClick={() => onLayerChange(layer.id as VisualizationLayer)}
                    className={`w-full flex items-center space-x-2 px-2 py-1 rounded-sm text-[11px] transition-colors ${
                      isActive
                        ? "bg-[#131D2B] text-[#E2EAF4] border border-[#38BDF8] font-bold"
                        : "text-[#8CA1B6] hover:text-[#E2EAF4] hover:bg-[#131D2B]/60"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${layer.color}`} />
                    <span className="truncate">{layer.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Camera Perspectives */}
          <div className="bg-[#0F1722] p-2.5 rounded-sm border border-[#1E2C3D] space-y-1.5">
            <div className="flex items-center justify-between pb-1 border-b border-[#1E2C3D] text-xs font-bold text-[#E2EAF4]">
              <div className="flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="uppercase text-[11px]">Camera Presets</span>
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
                  className={`px-1.5 py-1 rounded-sm text-left truncate transition-colors ${
                    cameraPreset === cam.id
                      ? "bg-[#131D2B] text-[#E2EAF4] border border-[#38BDF8] font-bold"
                      : "text-[#8CA1B6] hover:text-[#E2EAF4] bg-[#131D2B]/50"
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
          <div className="pointer-events-auto bg-[#0F1722] p-3.5 rounded-sm border border-[#1E2C3D] max-w-sm w-full space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between pb-2 border-b border-[#1E2C3D]">
              <div>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-sm bg-[#131D2B] text-[#38BDF8] border border-[#1E2C3D]">
                  [{selectedAsset.category} ASSET]
                </span>
                <h3 className="font-bold text-[#E2EAF4] text-xs mt-1 uppercase tracking-wide">{selectedAsset.name}</h3>
                <div className="text-[10px] text-[#8CA1B6]">[{selectedAsset.assetId}]</div>
              </div>
              <button
                onClick={onCloseAsset}
                className="p-1 rounded-sm bg-[#131D2B] border border-[#1E2C3D] text-[#8CA1B6] hover:text-[#E2EAF4]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Health & Prognostics Card */}
            <div className="grid grid-cols-3 gap-1.5 bg-[#131D2B] p-2 rounded-sm border border-[#1E2C3D] text-center">
              <div>
                <span className="text-[9px] text-[#8CA1B6] block uppercase">HEALTH</span>
                <span className="text-xs font-bold text-[#34D399] tnum">
                  {Math.round(selectedAsset.healthScore * 100)}%
                </span>
              </div>
              <div>
                <span className="text-[9px] text-[#8CA1B6] block uppercase">FAIL RISK</span>
                <span className="text-xs font-bold text-[#E2EAF4] tnum">
                  {(selectedAsset.failureProbability * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-[9px] text-[#8CA1B6] block uppercase">EST. RUL</span>
                <span className="text-xs font-bold text-[#38BDF8] tnum">
                  {selectedAsset.rulHours}h
                </span>
              </div>
            </div>

            {/* Real-Time Telemetry Grid */}
            <div className="space-y-1">
              <span className="text-[10px] text-[#8CA1B6] font-bold uppercase tracking-wider block">
                LIVE TELEMETRY VALUES
              </span>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {Object.entries(selectedAsset.readings || {}).map(([key, item]: [string, any]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between text-xs p-1.5 bg-[#131D2B] rounded-sm border border-[#1E2C3D]"
                  >
                    <span className="text-[#8CA1B6] text-[11px]">{item.label || key}</span>
                    <span className="font-bold text-[#E2EAF4] text-[11px] tnum">
                      {item.value} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications & Maintenance */}
            <div className="pt-2 border-t border-[#1E2C3D] text-[10px] space-y-1 text-[#8CA1B6]">
              <div className="flex justify-between">
                <span>NEXT SERVICE:</span>
                <span className="text-[#E2EAF4]">{selectedAsset.maintenance?.nextDueHours} HRS</span>
              </div>
              <div className="flex justify-between">
                <span>LAST OVERHAUL:</span>
                <span className="text-[#E2EAF4]">{selectedAsset.maintenance?.lastService}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Bar */}
      <div className="flex items-center justify-between pointer-events-auto">
        <div className="bg-[#0F1722] px-3 py-1.5 rounded-sm border border-[#1E2C3D] text-[11px] text-[#8CA1B6] flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-sm bg-[#34D399]" />
          <span>INTERACTIVE 3D VIEWPORT // CLICK ANY ASSET OR TOWER TO PROBE SCADA TELEMETRY</span>
        </div>

        <Link
          href={`/stations/${stationId}`}
          className="bg-[#0F1722] hover:bg-[#131D2B] px-3 py-1.5 rounded-sm border border-[#1E2C3D] hover:border-[#38BDF8] text-xs font-semibold text-[#E2EAF4] transition-colors"
        >
          OPEN 2D TELEMETRY CONSOLE
        </Link>
      </div>
    </div>
  );
}

