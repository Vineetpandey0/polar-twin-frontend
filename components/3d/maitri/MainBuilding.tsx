import React, { useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { materials, getStatusColor } from "@/lib/3d/materials";
import { DigitalTwinAsset } from "@/lib/3d/assetRegistry";

interface MainBuildingProps {
  asset: DigitalTwinAsset;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (assetId: string) => void;
  onHover: (assetId: string | null) => void;
}

export function MaitriMainBuilding({
  asset,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: MainBuildingProps) {
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
      {/* Structural Steel Stilts (Elevation 1.8m above ground) */}
      <group position={[0, -1.2, 0]}>
        {[-4.5, -1.5, 1.5, 4.5].map((x) =>
          [-3, 0, 3].map((z) => (
            <group key={`${x}-${z}`} position={[x, 0, z]}>
              <mesh material={materials.structuralStilts} castShadow>
                <cylinderGeometry args={[0.18, 0.18, 2.0, 12]} />
              </mesh>
              {/* Foundation concrete footing pad */}
              <mesh position={[0, -1.0, 0]} material={materials.structuralStilts}>
                <boxGeometry args={[0.7, 0.2, 0.7]} />
              </mesh>
            </group>
          ))
        )}
      </group>

      {/* Main Building Body - 2-Story Modular Cladding (Orange/Yellow) */}
      <mesh position={[0, 0.5, 0]} material={materials.maitriWallOrange} castShadow receiveShadow>
        <boxGeometry args={[11, 2.4, 7.5]} />
      </mesh>

      {/* Second-Story Section / Command Pod */}
      <mesh position={[0, 2.1, 0]} material={materials.maitriWallYellow} castShadow>
        <boxGeometry args={[8.5, 1.2, 6.0]} />
      </mesh>

      {/* Roof Deck & Weatherproofing */}
      <mesh position={[0, 2.75, 0]} material={materials.maitriRoof}>
        <boxGeometry args={[8.8, 0.15, 6.3]} />
      </mesh>

      {/* Insulated Triple-Glazed Polar Windows */}
      {[-3.5, -1.8, 0, 1.8, 3.5].map((x, i) => (
        <mesh key={`win-front-${i}`} position={[x, 0.6, 3.78]}>
          <boxGeometry args={[0.9, 0.7, 0.08]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} />
        </mesh>
      ))}
      {[-3.5, -1.8, 0, 1.8, 3.5].map((x, i) => (
        <mesh key={`win-back-${i}`} position={[x, 0.6, -3.78]}>
          <boxGeometry args={[0.9, 0.7, 0.08]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} />
        </mesh>
      ))}

      {/* External Access Staircase & Handrails */}
      <group position={[5.8, -0.4, 2.0]}>
        <mesh material={materials.structuralStilts} rotation={[0, 0, -Math.PI / 4]} position={[-0.4, 0, 0]}>
          <boxGeometry args={[1.8, 0.1, 1.2]} />
        </mesh>
        {/* Entrance Vestibule Airlock */}
        <mesh position={[-0.8, 0.8, 0]} material={materials.maitriWallYellow}>
          <boxGeometry args={[1.4, 2.0, 1.6]} />
        </mesh>
      </group>

      {/* Rooftop HVAC Ventilation Units & Flues */}
      <group position={[0, 3.1, 0]}>
        <mesh position={[-2.5, 0, -1.5]} material={materials.generatorExhaust}>
          <boxGeometry args={[1.2, 0.6, 1.0]} />
        </mesh>
        <mesh position={[2.5, 0.3, 1.0]} material={materials.generatorExhaust}>
          <cylinderGeometry args={[0.2, 0.2, 0.9, 12]} />
        </mesh>
        <mesh position={[0, 0.4, 0]} material={materials.structuralStilts}>
          <cylinderGeometry args={[0.15, 0.15, 1.1, 12]} />
        </mesh>
      </group>

      {/* Interactive Selection / Status Glow Ring */}
      {(isSelected || isHovered) && (
        <mesh position={[0, -1.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6.8, 7.2, 32]} />
          <meshBasicMaterial color={statusColor} side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Hover HTML Tooltip */}
      {isHovered && !isSelected && (
        <Html position={[0, 3.8, 0]} center distanceFactor={18}>
          <div className="bg-slate-900/95 text-slate-100 border border-cyan-500/60 px-3 py-2 rounded-xl shadow-2xl backdrop-blur-md whitespace-nowrap text-xs pointer-events-none space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
              <span className="font-bold">{asset.name}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Cabin: {asset.readings.cabinTemp?.value}{asset.readings.cabinTemp?.unit} | Load: {asset.readings.powerDemand?.value}{asset.readings.powerDemand?.unit}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
