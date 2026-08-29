"use client";

import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky, Stars } from "@react-three/drei";
import { PolarTerrain } from "@/lib/3d/terrainGenerators";
import { MaitriStation } from "./maitri/MaitriStation";
import { BharatiStation } from "./bharati/BharatiStation";
import { PowerFlowLayer } from "./overlays/PowerFlowLayer";
import { WaterFlowLayer } from "./overlays/WaterFlowLayer";
import { ThermalLayer } from "./overlays/ThermalLayer";
import { CommunicationsLayer } from "./overlays/CommunicationsLayer";
import { WeatherLayer } from "./overlays/WeatherLayer";
import { CameraController, CameraPreset } from "./ui/CameraController";
import { DigitalTwinHUD, VisualizationLayer } from "./ui/DigitalTwinHUD";
import { MAITRI_ASSET_REGISTRY, BHARATI_ASSET_REGISTRY, DigitalTwinAsset } from "@/lib/3d/assetRegistry";

interface StationCanvasProps {
  stationId: string;
  selectedAssetId?: string | null;
  onSelectAsset?: (assetId: string | null) => void;
  onStationSwitch?: (newStationId: string) => void;
  minimalMode?: boolean;
}

export default function StationCanvas({
  stationId: initialStationId,
  selectedAssetId: externalSelectedAssetId,
  onSelectAsset: externalOnSelectAsset,
  onStationSwitch,
  minimalMode = false,
}: StationCanvasProps) {
  const [currentStation, setCurrentStation] = useState<"maitri" | "bharati">(
    initialStationId === "bharati" ? "bharati" : "maitri"
  );

  const [activeLayer, setActiveLayer] = useState<VisualizationLayer>(minimalMode ? "NONE" : "ALL");
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("ORBIT");
  const [isPolarNight, setIsPolarNight] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [internalSelectedAssetId, setInternalSelectedAssetId] = useState<string | null>(null);
  const [hoveredAssetId, setHoveredAssetId] = useState<string | null>(null);

  const selectedAssetId = externalSelectedAssetId !== undefined ? externalSelectedAssetId : internalSelectedAssetId;
  const setSelectedAssetId = (id: string | null) => {
    setInternalSelectedAssetId(id);
    if (externalOnSelectAsset) externalOnSelectAsset(id);
  };

  const isMaitri = currentStation === "maitri";
  const activeRegistry = isMaitri ? MAITRI_ASSET_REGISTRY : BHARATI_ASSET_REGISTRY;
  const selectedAsset: DigitalTwinAsset | null = selectedAssetId ? activeRegistry[selectedAssetId] || null : null;

  const handleStationChange = (st: "maitri" | "bharati") => {
    setCurrentStation(st);
    setSelectedAssetId(null);
    if (onStationSwitch) onStationSwitch(st);
  };

  return (
    <div className="relative w-full h-full min-h-[620px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        camera={{ position: [24, 18, 28], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          {/* Atmospheric Lighting: Polar Day vs Polar Night */}
          {!isPolarNight ? (
            <>
              {/* Polar Day: Crisp low-angle arctic sun */}
              <Sky sunPosition={[40, 20, 50]} turbidity={0.4} rayleigh={0.6} mieCoefficient={0.005} />
              <ambientLight intensity={0.85} color="#e0f2fe" />
              <directionalLight
                castShadow
                position={[45, 25, 45]}
                intensity={1.8}
                color="#fdfbf7"
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={120}
                shadow-camera-left={-40}
                shadow-camera-right={40}
                shadow-camera-top={40}
                shadow-camera-bottom={-40}
              />
              <hemisphereLight intensity={0.4} color="#bae6fd" groundColor="#334155" />
            </>
          ) : (
            <>
              {/* Polar Night: Deep starfield with ethereal Antarctic Aurora glow */}
              <color attach="background" args={["#030712"]} />
              <Stars radius={100} depth={50} count={3500} factor={4} saturation={0.5} fade speed={1} />
              <ambientLight intensity={0.35} color="#38bdf8" />
              <directionalLight position={[-30, 20, -30]} intensity={0.6} color="#a855f7" />
              {/* Aurora Borealis / Australis ambient bounce */}
              <pointLight position={[0, 30, 0]} intensity={1.2} color="#10b981" distance={80} />
            </>
          )}

          {/* Procedural Polar Terrain (Maitri Oasis Moraine vs Bharati Coastal Headland) */}
          <PolarTerrain stationId={currentStation} />

          {/* Master 3D Station Models */}
          {isMaitri ? (
            <MaitriStation
              selectedAssetId={selectedAssetId}
              hoveredAssetId={hoveredAssetId}
              onSelectAsset={setSelectedAssetId}
              onHoverAsset={setHoveredAssetId}
            />
          ) : (
            <BharatiStation
              selectedAssetId={selectedAssetId}
              hoveredAssetId={hoveredAssetId}
              onSelectAsset={setSelectedAssetId}
              onHoverAsset={setHoveredAssetId}
            />
          )}

          {/* Multi-Layer System Visualizations */}
          {!minimalMode && (
            <>
              <PowerFlowLayer stationId={currentStation} active={activeLayer === "POWER" || activeLayer === "ALL"} />
              <WaterFlowLayer stationId={currentStation} active={activeLayer === "WATER" || activeLayer === "ALL"} />
              <ThermalLayer stationId={currentStation} active={activeLayer === "THERMAL"} />
              <CommunicationsLayer stationId={currentStation} active={activeLayer === "COMMS" || activeLayer === "ALL"} />
              <WeatherLayer windSpeed={isMaitri ? 28.5 : 34.1} active={activeLayer === "WEATHER" || activeLayer === "ALL"} />
            </>
          )}

          {/* Camera Director */}
          <CameraController
            preset={cameraPreset}
            targetPosition={selectedAsset ? selectedAsset.position3D : null}
            autoRotate={autoRotate}
          />
        </Suspense>
      </Canvas>

      {/* Industrial SCADA Overlay HUD (Hidden in Minimal Mode) */}
      {!minimalMode && (
        <DigitalTwinHUD
          stationId={currentStation}
          onStationChange={handleStationChange}
          activeLayer={activeLayer}
          onLayerChange={setActiveLayer}
          cameraPreset={cameraPreset}
          onCameraChange={setCameraPreset}
          isPolarNight={isPolarNight}
          onTogglePolarNight={() => setIsPolarNight(!isPolarNight)}
          autoRotate={autoRotate}
          onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
          selectedAsset={selectedAsset}
          onCloseAsset={() => setSelectedAssetId(null)}
        />
      )}
    </div>
  );
}
