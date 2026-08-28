import React from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { materials, getStatusColor, POLAR_PALETTE } from "@/lib/3d/materials";
import { DigitalTwinAsset } from "@/lib/3d/assetRegistry";

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
  const seaPump = assets["PMP-BHA-SEA"];
  const roPlant = assets["WTR-BHA-001"];

  return (
    <group name="bharati-seawater-desalination-zone">
      {/* Coastal Sea-Water Pump House at Prydz Bay (PMP-BHA-SEA) */}
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
          {/* Heavy Steel Support Stilts over coastal ice */}
          <mesh position={[0, -0.6, 0]} material={materials.structuralStilts}>
            <cylinderGeometry args={[0.15, 0.15, 1.4, 8]} />
          </mesh>

          {/* Faceted Modern Seawater Pump Enclosure */}
          <mesh position={[0, 0.6, 0]} material={materials.bharatiPanelSilver} castShadow>
            <boxGeometry args={[3.2, 1.8, 2.4]} />
          </mesh>

          {/* Submerged Ocean Intake Pipe into Prydz Bay */}
          <mesh position={[0, -1.2, 0]} material={materials.structuralStilts}>
            <cylinderGeometry args={[0.18, 0.18, 2.2, 12]} />
          </mesh>

          {(selectedAssetId === seaPump.assetId || hoveredAssetId === seaPump.assetId) && (
            <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.2, 2.5, 24]} />
              <meshBasicMaterial color={POLAR_PALETTE.statusCyan} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          )}

          {hoveredAssetId === seaPump.assetId && selectedAssetId !== seaPump.assetId && (
            <Html position={[0, 2.0, 0]} center distanceFactor={14}>
              <div className="bg-slate-900/95 text-slate-100 border border-cyan-500/60 px-3 py-2 rounded-xl shadow-2xl backdrop-blur-md whitespace-nowrap text-xs pointer-events-none space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-bold">{seaPump.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Intake: {seaPump.readings?.seawaterFlow?.value} L/h | Pressure: {seaPump.readings?.intakePressure?.value} bar | Temp: {seaPump.readings?.seawaterTemp?.value}°C
                </div>
              </div>
            </Html>
          )}
        </group>
      )}

      {/* High-Pressure Heated Seawater Pipeline up the promontory */}
      <mesh position={[4.2, 0.8, -12.0]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 12.0, 8]} />
        <meshStandardMaterial color={POLAR_PALETTE.pipeWaterBlue} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Seawater Reverse Osmosis (RO) Desalination Plant (WTR-BHA-001) */}
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
          <mesh position={[0, 1.0, 0]} material={materials.bharatiPanelSilver} castShadow>
            <boxGeometry args={[3.4, 2.0, 2.8]} />
          </mesh>
        </group>
      )}
    </group>
  );
}
