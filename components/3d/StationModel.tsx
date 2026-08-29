"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { HoverTooltip } from "@/components/3d/ui/HoverTooltip";

export interface Asset3DData {
  id: string;
  name: string;
  type: string;
  status: "RUNNING" | "STOPPED" | "FAILED" | "WARNING";
  healthScore: number;
  readings?: Record<string, number | string>;
}

interface StationModelProps {
  stationId: string;
  selectedAsset: string | null;
  onSelectAsset: (assetId: string) => void;
  nightMode?: boolean;
}

export default function StationModel({
  stationId,
  selectedAsset,
  onSelectAsset,
  nightMode = false,
}: StationModelProps) {
  const radarRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  const isMaitri = stationId === "maitri";

  // Real-time animation loop
  useFrame((state, delta) => {
    if (radarRef.current) {
      radarRef.current.rotation.y += delta * 1.2;
    }
    if (beaconRef.current) {
      const material = beaconRef.current.material as THREE.MeshStandardMaterial;
      if (material) {
        const pulse = (Math.sin(state.clock.elapsedTime * 6) + 1) / 2;
        material.emissiveIntensity = 0.5 + pulse * 2.5;
      }
    }
  });

  const getStatusColor = (health: number, status: string) => {
    if (status === "FAILED" || health < 0.5) return "#ef4444"; // Red
    if (status === "WARNING" || health < 0.8) return "#f59e0b"; // Amber
    return "#10b981"; // Emerald
  };

  const maitriAssets: Record<string, Asset3DData> = {
    "GEN-MAI-001": { id: "GEN-MAI-001", name: "Primary Generator 1", type: "GENERATOR", status: "RUNNING", healthScore: 0.95, readings: { load: "78 kW", temp: "82°C", rpm: 1500 } },
    "GEN-MAI-002": { id: "GEN-MAI-002", name: "Primary Generator 2", type: "GENERATOR", status: "RUNNING", healthScore: 0.92, readings: { load: "67 kW", temp: "79°C", rpm: 1500 } },
    "GEN-MAI-003": { id: "GEN-MAI-003", name: "Backup Generator 3", type: "GENERATOR", status: "STOPPED", healthScore: 1.00, readings: { load: "0 kW", temp: "22°C", rpm: 0 } },
    "BAT-MAI-001": { id: "BAT-MAI-001", name: "Battery Bank A", type: "BATTERY", status: "RUNNING", healthScore: 0.98, readings: { soc: "88%", voltage: "400V" } },
    "HVC-MAI-001": { id: "HVC-MAI-001", name: "Central HVAC", type: "HVAC", status: "RUNNING", healthScore: 0.88, readings: { intake: "-25°C", cabin: "21°C" } },
    "WTR-MAI-001": { id: "WTR-MAI-001", name: "Priyadarshini Water Unit", type: "WATER", status: "RUNNING", healthScore: 0.94, readings: { flow: "140 L/h", pressure: "3.8 bar" } },
    "COM-MAI-001": { id: "COM-MAI-001", name: "Satellite Link Array", type: "COMMS", status: "RUNNING", healthScore: 0.99, readings: { signal: "98%", latency: "240ms" } },
    "FUL-MAI-001": { id: "FUL-MAI-001", name: "Diesel Fuel Tank", type: "FUEL_TANK", status: "RUNNING", healthScore: 1.00, readings: { volume: "45,000 L", days: "120d" } },
  };

  const bharatiAssets: Record<string, Asset3DData> = {
    "GEN-BHA-001": { id: "GEN-BHA-001", name: "CHP Generator 1", type: "GENERATOR", status: "RUNNING", healthScore: 0.97, readings: { load: "92 kW", temp: "80°C" } },
    "GEN-BHA-002": { id: "GEN-BHA-002", name: "CHP Generator 2", type: "GENERATOR", status: "RUNNING", healthScore: 0.94, readings: { load: "88 kW", temp: "81°C" } },
    "BAT-BHA-001": { id: "BAT-BHA-001", name: "Storage Battery Bank", type: "BATTERY", status: "RUNNING", healthScore: 0.99, readings: { soc: "94%", temp: "24°C" } },
    "HVC-BHA-001": { id: "HVC-BHA-001", name: "Thermal HVAC System", type: "HVAC", status: "RUNNING", healthScore: 0.93, readings: { cabin: "22°C" } },
    "COM-BHA-001": { id: "COM-BHA-001", name: "High-Speed Satcom Ground Station", type: "COMMS", status: "RUNNING", healthScore: 1.00, readings: { signal: "100%" } },
    "FUL-BHA-001": { id: "FUL-BHA-001", name: "Fuel Storage Depot", type: "FUEL_TANK", status: "RUNNING", healthScore: 0.98, readings: { volume: "60,000 L" } },
  };

  const assets = isMaitri ? maitriAssets : bharatiAssets;

  const renderAssetNode = (
    assetId: string,
    position: [number, number, number],
    geometryType: "box" | "cylinder" | "sphere" = "box",
    size: [number, number, number] = [1, 1, 1]
  ) => {
    const asset = assets[assetId];
    if (!asset) return null;

    const isSelected = selectedAsset === assetId;
    const isHovered = hoveredAsset === assetId;
    const color = getStatusColor(asset.healthScore, asset.status);

    return (
      <group position={position}>
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelectAsset(assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredAsset(assetId);
          }}
          onPointerOut={() => setHoveredAsset(null)}
          castShadow
          receiveShadow
        >
          {geometryType === "box" && <boxGeometry args={size} />}
          {geometryType === "cylinder" && <cylinderGeometry args={[size[0], size[1], size[2], 16]} />}
          {geometryType === "sphere" && <sphereGeometry args={[size[0], 24, 24]} />}

          <meshStandardMaterial
            color={isSelected ? "#38bdf8" : isHovered ? "#67e8f9" : "#e2e8f0"}
            metalness={0.7}
            roughness={0.3}
            emissive={isSelected ? "#0284c7" : color}
            emissiveIntensity={isSelected ? 0.8 : isHovered ? 0.6 : 0.25}
          />
        </mesh>

        {/* Pulsing Status Ring */}
        <mesh position={[0, size[1] / 2 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size[0] * 0.7, size[0] * 0.9, 24]} />
          <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>

        {/* Floating Asset Label */}
        {(isSelected || isHovered) && (
          <HoverTooltip
            position={[0, size[1] + 1.2, 0]}
            name={asset.name}
            category={asset.type}
            operationalStatus={asset.status}
            healthScore={asset.healthScore}
            readings={asset.readings}
          />
        )}
      </group>
    );
  };

  return (
    <group>
      {/* Polar Landscape & Ice Field */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[120, 120, 32, 32]} />
        <meshStandardMaterial
          color={nightMode ? "#0f172a" : "#f1f5f9"}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Raised Structural Stilts (Snow drift protection) */}
      {[-8, -4, 0, 4, 8].map((x) =>
        [-4, 0, 4].map((z) => (
          <mesh key={`stilt-${x}-${z}`} position={[x, 0.6, z]} castShadow>
            <cylinderGeometry args={[0.12, 0.15, 1.2, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
        ))
      )}

      {/* Main Habitat & Living Modules */}
      <group position={[0, 1.8, 0]}>
        {/* Central Core Module */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[14, 2.2, 6]} />
          <meshStandardMaterial
            color={isMaitri ? "#ea580c" : "#0284c7"} // Maitri Orange / Bharati High-tech Blue
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>

        {/* Upper Observation Bridge & Lab Deck */}
        <mesh position={[0, 1.6, 0]} castShadow>
          <boxGeometry args={[8, 1.2, 4]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Windows / Light strips */}
        <mesh position={[0, 0.3, 3.02]}>
          <planeGeometry args={[12, 0.4]} />
          <meshBasicMaterial color={nightMode ? "#38bdf8" : "#fef08a"} />
        </mesh>
      </group>

      {/* Power House & Generators */}
      {isMaitri ? (
        <group position={[-11, 1.2, 0]}>
          {/* Power Plant Building */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[6, 2.4, 5]} />
            <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Exhaust stacks */}
          <mesh position={[-1.5, 2.0, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 1.6]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          <mesh position={[0, 2.0, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 1.6]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          <mesh position={[1.5, 2.0, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 1.6]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>

          {/* Interactive Generator Nodes inside Power House */}
          {renderAssetNode("GEN-MAI-001", [-1.5, 0.2, 3], "box", [1.2, 1.0, 1.2])}
          {renderAssetNode("GEN-MAI-002", [0, 0.2, 3], "box", [1.2, 1.0, 1.2])}
          {renderAssetNode("GEN-MAI-003", [1.5, 0.2, 3], "box", [1.2, 1.0, 1.2])}
        </group>
      ) : (
        <group position={[-10, 1.2, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[5, 2.4, 5]} />
            <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
          </mesh>
          {renderAssetNode("GEN-BHA-001", [-1, 0.2, 3], "box", [1.2, 1.0, 1.2])}
          {renderAssetNode("GEN-BHA-002", [1, 0.2, 3], "box", [1.2, 1.0, 1.2])}
        </group>
      )}

      {/* Battery Energy Storage System (BESS) */}
      <group position={[isMaitri ? -5 : -4, 1.0, 6]}>
        {renderAssetNode(
          isMaitri ? "BAT-MAI-001" : "BAT-BHA-001",
          [0, 0, 0],
          "box",
          [3, 1.8, 2]
        )}
      </group>

      {/* Fuel Storage Tank Array */}
      <group position={[11, 1.2, 4]}>
        {renderAssetNode(
          isMaitri ? "FUL-MAI-001" : "FUL-BHA-001",
          [0, 0, 0],
          "cylinder",
          [1.6, 1.6, 3.5]
        )}
        <mesh position={[3.5, 0, 0]} castShadow>
          <cylinderGeometry args={[1.6, 1.6, 3.5, 24]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* HVAC & Life Support Units */}
      <group position={[5, 1.2, -5]}>
        {renderAssetNode(
          isMaitri ? "HVC-MAI-001" : "HVC-BHA-001",
          [0, 0, 0],
          "box",
          [2.4, 1.6, 2]
        )}
      </group>

      {/* Water Treatment Unit */}
      {isMaitri && (
        <group position={[-5, 1.2, -5]}>
          {renderAssetNode("WTR-MAI-001", [0, 0, 0], "box", [2, 1.5, 2])}
        </group>
      )}

      {/* Satellite Ground Station & Communication Tower */}
      <group position={[11, 0, -6]}>
        {/* Lattice Mast */}
        <mesh position={[0, 4, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.6, 8, 4]} />
          <meshStandardMaterial color="#dc2626" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Pulsing Aircraft Warning Beacon on Top */}
        <mesh ref={beaconRef} position={[0, 8.2, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
        </mesh>

        {/* Rotating Radar & Satcom Dish */}
        <group ref={radarRef} position={[0, 6.5, 0]}>
          <mesh rotation={[Math.PI / 4, 0, 0]} castShadow>
            <sphereGeometry args={[1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.5} roughness={0.3} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.4, 0.8]} rotation={[Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 1]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
        </group>

        {/* Interactive Comms Node */}
        {renderAssetNode(
          isMaitri ? "COM-MAI-001" : "COM-BHA-001",
          [0, 1.5, 0],
          "box",
          [1.8, 1.2, 1.8]
        )}
      </group>

      {/* Solar Panel Array on Perimeter */}
      <group position={[0, 0.8, -10]}>
        {[-4, -1.5, 1.5, 4].map((x) => (
          <mesh key={`solar-${x}`} position={[x, 0, 0]} rotation={[-Math.PI / 3, 0, 0]} castShadow>
            <boxGeometry args={[2.2, 1.6, 0.08]} />
            <meshStandardMaterial color="#1e3a8a" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
