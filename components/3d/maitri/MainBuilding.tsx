import React from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { materials, getStatusColor } from "@/lib/3d/materials";
import { DigitalTwinAsset } from "@/lib/3d/assetRegistry";
import { HoverTooltip } from "@/components/3d/ui/HoverTooltip";

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
      {/* 1. Structural Steel Stilts (Elevation above bedrock) */}
      <group position={[0, -1.2, 0]}>
        {[-8, -5, -2, 2, 5, 8].map((x) =>
          [-4, 0, 4].map((z) => (
            <group key={`stilt-${x}-${z}`} position={[x, 0, z]}>
              <mesh material={materials.structuralStilts} castShadow>
                <cylinderGeometry args={[0.15, 0.15, 2.0, 12]} />
              </mesh>
              {/* Foundation Footing Pad */}
              <mesh position={[0, -1.0, 0]} material={materials.structuralStilts}>
                <boxGeometry args={[0.6, 0.2, 0.6]} />
              </mesh>
            </group>
          ))
        )}
      </group>

      {/* 2. U-SHAPED MAIN BUILDING SUPERSTRUCTURE WITH PROCEDURAL PANEL CLADDING */}
      {/* Central Corridor (Spine) */}
      <mesh position={[0, 0.5, 0]} material={materials.maitriWallTan} castShadow receiveShadow>
        <boxGeometry args={[18, 2.6, 5.0]} />
      </mesh>
      <mesh position={[0, 1.85, 0]} material={materials.maitriRoof}>
        <boxGeometry args={[18.4, 0.15, 5.4]} />
      </mesh>

      {/* Left Wing (West Extension) */}
      <mesh position={[-7.0, 0.5, 4.5]} material={materials.maitriWallTan} castShadow receiveShadow>
        <boxGeometry args={[4.5, 2.6, 5.0]} />
      </mesh>
      <mesh position={[-7.0, 1.85, 4.5]} material={materials.maitriRoof}>
        <boxGeometry args={[4.8, 0.15, 5.4]} />
      </mesh>

      {/* Right Wing (East Extension) */}
      <mesh position={[7.0, 0.5, 4.5]} material={materials.maitriWallTan} castShadow receiveShadow>
        <boxGeometry args={[4.5, 2.6, 5.0]} />
      </mesh>
      <mesh position={[7.0, 1.85, 4.5]} material={materials.maitriRoof}>
        <boxGeometry args={[4.8, 0.15, 5.4]} />
      </mesh>

      {/* 3. Main Entrance Airlock Vestibule (Centered in U-Court) */}
      <group position={[0, 0.4, 2.8]}>
        <mesh material={materials.maitriWallTan} castShadow>
          <boxGeometry args={[3.2, 2.2, 1.8]} />
        </mesh>
        {/* Entrance Door */}
        <mesh position={[0, -0.1, 0.92]}>
          <boxGeometry args={[1.2, 1.8, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>

        {/* --- LARGE INDIAN TRICOLOR (TIRANGA) FLAG MOUNTED ABOVE MAIN ENTRANCE --- */}
        <group position={[0, 1.7, 0.9]}>
          {/* Flagpole */}
          <mesh position={[0, 0.8, 0]} material={materials.structuralStilts}>
            <cylinderGeometry args={[0.03, 0.03, 1.8, 12]} />
          </mesh>
          {/* Flag (Tiranga: Orange, White, Green + Ashoka Chakra dot) */}
          <group position={[0.6, 1.2, 0]}>
            {/* Orange Top Band */}
            <mesh position={[0, 0.25, 0]}>
              <boxGeometry args={[1.1, 0.25, 0.02]} />
              <meshBasicMaterial color="#FF9933" />
            </mesh>
            {/* White Middle Band */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.1, 0.25, 0.02]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
            {/* Blue Ashoka Chakra Dot */}
            <mesh position={[0, 0, 0.015]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.01, 16]} />
              <meshBasicMaterial color="#000080" />
            </mesh>
            {/* Green Bottom Band */}
            <mesh position={[0, -0.25, 0]}>
              <boxGeometry args={[1.1, 0.25, 0.02]} />
              <meshBasicMaterial color="#138808" />
            </mesh>
          </group>
        </group>
      </group>

      {/* 4. Entry Ramp & Access Stairs (from rock to stilts level) */}
      <group position={[0, -0.6, 4.2]}>
        <mesh rotation={[Math.PI / 8, 0, 0]} material={materials.structuralStilts}>
          <boxGeometry args={[2.5, 0.12, 2.4]} />
        </mesh>
      </group>

      {/* 5. Insulated Windows Array */}
      {[-7, -4, -1, 1, 4, 7].map((x, i) => (
        <mesh key={`win-f-${i}`} position={[x, 0.8, 2.52]}>
          <boxGeometry args={[0.8, 0.6, 0.08]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} />
        </mesh>
      ))}

      {/* 6. Rooftop Satellite Antenna Dish & HVAC Exhaust Flues */}
      <group position={[-5, 2.2, 0]}>
        <mesh rotation={[Math.PI / 4, 0, 0]} material={materials.generatorExhaust}>
          <cylinderGeometry args={[0.8, 0.2, 0.4, 16]} />
        </mesh>
        <mesh position={[0, 0.4, 0]} material={materials.structuralStilts}>
          <cylinderGeometry args={[0.08, 0.08, 0.8, 12]} />
        </mesh>
      </group>
      <group position={[5, 2.1, 0]}>
        <mesh material={materials.generatorExhaust}>
          <boxGeometry args={[1.5, 0.6, 1.2]} />
        </mesh>
      </group>

      {/* Interactive Selection / Status Glow Ring */}
      {(isSelected || isHovered) && (
        <mesh position={[0, -1.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[10.5, 11.2, 48]} />
          <meshBasicMaterial color={statusColor} side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Hover HTML Tooltip */}
      {isHovered && !isSelected && (
        <HoverTooltip
          position={[0, 4.8, 0]}
          name={asset.name}
          category={asset.category}
          operationalStatus={asset.operationalStatus}
          healthScore={asset.healthScore}
          readings={asset.readings}
          subtitle="Commissioned: 26 Jan 1989 | Capacity: 25-65 Crew"
        />
      )}
    </group>
  );
}
