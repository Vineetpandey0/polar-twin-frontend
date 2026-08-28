import React from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { materials, getStatusColor } from "@/lib/3d/materials";
import { DigitalTwinAsset } from "@/lib/3d/assetRegistry";

interface AerodynamicMainBuildingProps {
  asset: DigitalTwinAsset;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (assetId: string) => void;
  onHover: (assetId: string | null) => void;
}

export function BharatiAerodynamicMainBuilding({
  asset,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: AerodynamicMainBuildingProps) {
  const statusColor = getStatusColor(asset.operationalStatus, asset.healthScore);

  return (
    <group
      position={asset.position3D}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(asset.assetId);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(asset.assetId);
      }}
      onPointerOut={() => onHover(null)}
    >
      {/* Heavy Structural Steel Stilts (Elevation 2.5m above ground to allow Antarctic blizzard airflow) */}
      <group position={[0, -2.0, 0]}>
        {[-6.0, -3.0, 0, 3.0, 6.0].map((x) =>
          [-3.2, 0, 3.2].map((z) => (
            <group key={`${x}-${z}`} position={[x, 0, z]}>
              <mesh material={materials.structuralStilts} castShadow>
                <cylinderGeometry args={[0.22, 0.22, 3.0, 12]} />
              </mesh>
              {/* Massive Concrete Anchor Pier */}
              <mesh position={[0, -1.5, 0]} material={materials.structuralStilts}>
                <boxGeometry args={[0.9, 0.3, 0.9]} />
              </mesh>
            </group>
          ))
        )}
      </group>

      {/* Aerodynamic 3-Story Faceted Superstructure Envelope */}
      {/* Level 1 & 2: Main Faceted Hull (Silver/White Composite Panels) */}
      <mesh position={[0, 0.6, 0]} material={materials.bharatiPanelSilver} castShadow receiveShadow>
        <boxGeometry args={[16.0, 3.0, 9.5]} />
      </mesh>

      {/* Aerodynamic Tapered Front Bow (Wind deflection geometry) */}
      <mesh position={[8.8, 0.6, 0]} rotation={[0, 0, -Math.PI / 6]} material={materials.bharatiPanelSilver}>
        <boxGeometry args={[2.2, 2.6, 9.0]} />
      </mesh>
      <mesh position={[-8.8, 0.6, 0]} rotation={[0, 0, Math.PI / 6]} material={materials.bharatiPanelSilver}>
        <boxGeometry args={[2.2, 2.6, 9.0]} />
      </mesh>

      {/* Level 3: Control Room, Observation Deck & Executive Bridge */}
      <mesh position={[1.5, 2.5, 0]} material={materials.bharatiPanelSilver} castShadow>
        <boxGeometry args={[11.5, 1.4, 7.5]} />
      </mesh>

      {/* Panoramic Polar Triple-Glazed Observation Ribbon Windows */}
      <mesh position={[1.5, 2.5, 3.78]} material={materials.bharatiGlass}>
        <boxGeometry args={[11.2, 0.9, 0.1]} />
      </mesh>
      <mesh position={[1.5, 2.5, -3.78]} material={materials.bharatiGlass}>
        <boxGeometry args={[11.2, 0.9, 0.1]} />
      </mesh>
      {/* Front Bow Observation Deck */}
      <mesh position={[7.3, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.bharatiGlass}>
        <boxGeometry args={[7.2, 0.9, 0.1]} />
      </mesh>

      {/* Rooftop HVAC Chillers, Air Handlers & Mechanical Plant */}
      <group position={[0, 3.5, 0]}>
        <mesh position={[-3.0, 0.4, 0]} material={materials.generatorExhaust}>
          <boxGeometry args={[2.4, 0.8, 2.8]} />
        </mesh>
        <mesh position={[2.0, 0.5, -1.5]} material={materials.generatorExhaust}>
          <cylinderGeometry args={[0.25, 0.25, 1.0, 12]} />
        </mesh>
        <mesh position={[3.5, 0.5, 1.5]} material={materials.generatorExhaust}>
          <cylinderGeometry args={[0.25, 0.25, 1.0, 12]} />
        </mesh>
      </group>

      {/* Indian National Identity & Station Signage Band */}
      <mesh position={[0, 1.8, 4.78]}>
        <boxGeometry args={[6.0, 0.4, 0.05]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>

      {/* Selection / Status Glow Ring */}
      {(isSelected || isHovered) && (
        <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[9.5, 10.0, 32]} />
          <meshBasicMaterial color={statusColor} side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Hover HTML Tooltip */}
      {isHovered && !isSelected && (
        <Html position={[0, 4.6, 0]} center distanceFactor={18}>
          <div className="bg-slate-900/95 text-slate-100 border border-cyan-500/60 px-3 py-2 rounded-xl shadow-2xl backdrop-blur-md whitespace-nowrap text-xs pointer-events-none space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
              <span className="font-bold">{asset.name}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Temp: {asset.readings.cabinTemp?.value}{asset.readings.cabinTemp?.unit} | Load: {asset.readings.totalBaseLoad?.value}{asset.readings.totalBaseLoad?.unit}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
