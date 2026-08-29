import React from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { materials, getStatusColor, POLAR_PALETTE } from "@/lib/3d/materials";
import { DigitalTwinAsset } from "@/lib/3d/assetRegistry";
import { HoverTooltip } from "@/components/3d/ui/HoverTooltip";

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
      {/* 1. GEWI STEEL PILES & ANGLED V-COLONNADE UNDERCROFT (83 Piles Grid) */}
      <group position={[0, -1.8, 0]}>
        {/* Main Grid Piles */}
        {[-8, -5, -2, 2, 5, 8].map((x) =>
          [-4, 0, 4].map((z) => (
            <group key={`pile-${x}-${z}`} position={[x, 0, z]}>
              <mesh material={materials.structuralStilts} castShadow>
                <cylinderGeometry args={[0.18, 0.18, 2.8, 12]} />
              </mesh>
              {/* Ground Anchor Plate */}
              <mesh position={[0, -1.35, 0]} material={materials.structuralStilts}>
                <boxGeometry args={[0.7, 0.2, 0.7]} />
              </mesh>
            </group>
          ))
        )}

        {/* Signature V-Shaped (Y-Shaped) Diagonal Steel Structural Columns (Front Seaward Overhang) */}
        {[-7, 0, 7].map((x) => (
          <group key={`v-col-${x}`} position={[x, 0.2, 5.2]}>
            <mesh rotation={[0, 0, Math.PI / 8]} material={materials.structuralStilts}>
              <cylinderGeometry args={[0.15, 0.15, 2.8, 12]} />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 8]} material={materials.structuralStilts}>
              <cylinderGeometry args={[0.15, 0.15, 2.8, 12]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 2. AERODYNAMIC STREAMLINED 3-STORY SUPERSTRUCTURE (50m x 30m Footprint) */}
      {/* Main Streamlined Hull Body (Silver Composite Panels) */}
      <mesh position={[0, 0.6, 0]} material={materials.bharatiPanelSilver} castShadow receiveShadow>
        <boxGeometry args={[18.5, 3.2, 10.5]} />
      </mesh>

      {/* Aerodynamic Rounded Windward Ends (Soft curved corner hull profile) */}
      <mesh position={[9.8, 0.6, 0]} rotation={[0, 0, -Math.PI / 8]} material={materials.bharatiPanelSilver}>
        <boxGeometry args={[1.8, 2.8, 9.8]} />
      </mesh>
      <mesh position={[-9.8, 0.6, 0]} rotation={[0, 0, Math.PI / 8]} material={materials.bharatiPanelSilver}>
        <boxGeometry args={[1.8, 2.8, 9.8]} />
      </mesh>

      {/* Level 3: Rooftop HVAC & Command Observatory Deck */}
      <mesh position={[0, 2.4, 0]} material={materials.bharatiPanelSilver} castShadow>
        <boxGeometry args={[13.0, 1.4, 8.2]} />
      </mesh>

      {/* 3. PANORAMIC GLAZED END-WALLS (Dining Room & Lounge Windows) */}
      {/* East End Glazing */}
      <mesh position={[9.3, 0.6, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.bharatiGlass}>
        <boxGeometry args={[9.2, 2.2, 0.1]} />
      </mesh>
      {/* West End Glazing */}
      <mesh position={[-9.3, 0.6, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.bharatiGlass}>
        <boxGeometry args={[9.2, 2.2, 0.1]} />
      </mesh>
      {/* Side Ribbons */}
      <mesh position={[0, 2.4, 4.15]} material={materials.bharatiGlass}>
        <boxGeometry args={[12.4, 0.9, 0.08]} />
      </mesh>
      <mesh position={[0, 2.4, -4.15]} material={materials.bharatiGlass}>
        <boxGeometry args={[12.4, 0.9, 0.08]} />
      </mesh>

      {/* 4. INDIAN TRICOLOR (TIRANGA) FLAG MOUNTED ON FACADE */}
      <group position={[0, 1.2, 5.35]}>
        {/* Signage Plate */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[6.5, 0.8, 0.06]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Tricolor Emblem */}
        <group position={[-2.4, 0, 0.04]}>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.9, 0.18, 0.02]} />
            <meshBasicMaterial color="#FF9933" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.9, 0.18, 0.02]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0, 0, 0.015]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.01, 16]} />
            <meshBasicMaterial color="#000080" />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[0.9, 0.18, 0.02]} />
            <meshBasicMaterial color="#138808" />
          </mesh>
        </group>
      </group>

      {/* 5. ROOFTOP OPEN SCIENCE TERRACE & HVAC CHILLERS */}
      <group position={[0, 3.2, 0]}>
        {/* Terrace Safety Guard Rail */}
        <mesh position={[5.0, 0.4, 0]} material={materials.structuralStilts}>
          <boxGeometry args={[5.2, 0.8, 7.5]} />
        </mesh>
        {/* HVAC Air Exchangers */}
        <mesh position={[-4.5, 0.5, -1.5]} material={materials.generatorExhaust}>
          <boxGeometry args={[2.5, 0.9, 2.5]} />
        </mesh>
        <mesh position={[-4.5, 0.5, 1.5]} material={materials.generatorExhaust}>
          <cylinderGeometry args={[0.4, 0.4, 1.2, 12]} />
        </mesh>
      </group>

      {/* Selection Glow Ring */}
      {(isSelected || isHovered) && (
        <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[11.0, 11.8, 48]} />
          <meshBasicMaterial color={statusColor} side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Hover HTML Tooltip */}
      {isHovered && !isSelected && (
        <HoverTooltip
          position={[0, 5.2, 0]}
          name={asset.name}
          category={asset.category}
          operationalStatus={asset.operationalStatus}
          healthScore={asset.healthScore}
          readings={asset.readings}
          subtitle="134 ISO Containers | 50m x 30m Aerodynamic Hull | 47 Crew"
        />
      )}
    </group>
  );
}
