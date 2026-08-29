import React from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { materials, getStatusColor, POLAR_PALETTE } from "@/lib/3d/materials";
import { DigitalTwinAsset } from "@/lib/3d/assetRegistry";
import { HoverTooltip } from "@/components/3d/ui/HoverTooltip";

interface SeaWaterSystemZoneProps {
  assets: Record<string, DigitalTwinAsset>;
  selectedAssetId: string | null;
  hoveredAssetId: string | null;
  onSelect: (assetId: string) => void;
  onHover: (assetId: string | null) => void;
}

export function BharatiSeaWaterSystemZone({
  assets,
  selectedAssetId,
  hoveredAssetId,
  onSelect,
  onHover,
}: SeaWaterSystemZoneProps) {
  const seaPump = assets["PMP-BHA-SEA"] || { position3D: [6.0, 0.6, -20.0], name: "Prydz Bay Pump House" };
  const roPlant = assets["WTR-BHA-001"] || { position3D: [3.5, 1.2, -6.5], name: "RO Desalination Plant" };
  const wwtpPlant = assets["WWTP-BHA-001"];

  return (
    <group name="bharati-seawater-desalination-zone">
      {/* 1. COASTAL SEAWATER PUMP HOUSE AT PRYDZ BAY SHORELINE (PMP-BHA-SEA) */}
      {seaPump && (
        <group
          position={seaPump.position3D}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(seaPump.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(seaPump.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          {/* Support Stilts over coastal rock & sea ice */}
          <mesh position={[0, -0.6, 0]} material={materials.structuralStilts}>
            <cylinderGeometry args={[0.15, 0.15, 1.4, 8]} />
          </mesh>

          {/* Faceted Streamlined Seawater Pump House Container */}
          <mesh position={[0, 0.6, 0]} material={materials.bharatiPanelSilver} castShadow>
            <boxGeometry args={[3.4, 1.8, 2.4]} />
          </mesh>

          {/* Submerged Ocean Intake Tube penetrating 4.0m into Prydz Bay */}
          <mesh position={[0, -1.4, -1.2]} rotation={[0.4, 0, 0]} material={materials.structuralStilts}>
            <cylinderGeometry args={[0.18, 0.18, 2.8, 12]} />
          </mesh>

          {(selectedAssetId === seaPump.assetId || hoveredAssetId === seaPump.assetId) && (
            <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.2, 2.5, 24]} />
              <meshBasicMaterial color={POLAR_PALETTE.statusCyan} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          )}

          {hoveredAssetId === seaPump.assetId && selectedAssetId !== seaPump.assetId && (
            <HoverTooltip
              position={[0, 2.6, 0]}
              name={seaPump.name}
              category={seaPump.category}
              operationalStatus={seaPump.operationalStatus}
              healthScore={seaPump.healthScore}
              readings={seaPump.readings}
            />
          )}
        </group>
      )}

      {/* DUAL ELECTRIC HEAT-TRACED TITANIUM WATER PIPELINES UP THE ROCKY PROMONTORY */}
      <mesh position={[4.8, 0.8, -13.0]} rotation={[0.3, -0.1, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 14.0, 8]} />
        <meshStandardMaterial color={POLAR_PALETTE.pipeWaterBlue} roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[5.1, 0.8, -13.0]} rotation={[0.3, -0.1, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 14.0, 8]} />
        <meshStandardMaterial color={POLAR_PALETTE.pipeWaterBlue} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* 2. REVERSE OSMOSIS (RO) DESALINATION PLANT (WTR-BHA-001) */}
      {roPlant && (
        <group
          position={roPlant.position3D}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(roPlant.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(roPlant.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          <mesh position={[0, 0.8, 0]} material={materials.bharatiPanelSilver} castShadow>
            <boxGeometry args={[3.4, 1.9, 2.6]} />
          </mesh>

          {/* High-Pressure RO Membrane Pressure Vessels (Dual Cylinder Stack) */}
          <mesh position={[0, 1.8, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.fuelTank}>
            <cylinderGeometry args={[0.25, 0.25, 2.8, 16]} />
          </mesh>

          {hoveredAssetId === roPlant.assetId && selectedAssetId !== roPlant.assetId && (
            <HoverTooltip
              position={[0, 2.6, 0]}
              name={roPlant.name}
              category={roPlant.category}
              operationalStatus={roPlant.operationalStatus}
              healthScore={roPlant.healthScore}
              readings={roPlant.readings}
            />
          )}
        </group>
      )}

      {/* 3. 3-STAGE SEWAGE & WASTEWATER TREATMENT PLANT (WWTP-BHA-001) */}
      {wwtpPlant && (
        <group
          position={wwtpPlant.position3D}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(wwtpPlant.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(wwtpPlant.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          <mesh position={[0, 0.8, 0]} material={materials.generatorBody} castShadow>
            <boxGeometry args={[3.0, 1.8, 2.2]} />
          </mesh>

          {hoveredAssetId === wwtpPlant.assetId && selectedAssetId !== wwtpPlant.assetId && (
            <HoverTooltip
              position={[0, 2.6, 0]}
              name={wwtpPlant.name}
              category={wwtpPlant.category}
              operationalStatus={wwtpPlant.operationalStatus}
              healthScore={wwtpPlant.healthScore}
              readings={wwtpPlant.readings}
            />
          )}
        </group>
      )}
    </group>
  );
}
