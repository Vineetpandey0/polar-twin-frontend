import React from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { materials, getStatusColor, POLAR_PALETTE } from "@/lib/3d/materials";
import { DigitalTwinAsset } from "@/lib/3d/assetRegistry";

interface LakePriyadarshiniZoneProps {
  assets: Record<string, DigitalTwinAsset>;
  selectedAssetId: string | null;
  hoveredAssetId: string | null;
  onSelect: (assetId: string) => void;
  onHover: (assetId: string | null) => void;
}

export function MaitriLakePriyadarshiniZone({
  assets,
  selectedAssetId,
  hoveredAssetId,
  onSelect,
  onHover,
}: LakePriyadarshiniZoneProps) {
  const lakePump = assets["PMP-MAI-LAKE"] || { position3D: [16.0, 0.8, -24.0], name: "Lake Pump House" };
  const wtrPlant = assets["WTR-MAI-001"] || { position3D: [10.0, 1.2, -14.0], name: "Water Treatment Plant" };

  return (
    <group name="maitri-lake-priyadarshini-water-zone">
      {/* Lake-Water Pump House at Lake Shoreline (PMP-MAI-LAKE) */}
      {lakePump && (
        <group
          position={lakePump.position3D}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(lakePump.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(lakePump.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          {/* Support Stilts over shoreline ice */}
          <mesh position={[0, -0.6, 0]} material={materials.structuralStilts}>
            <cylinderGeometry args={[0.12, 0.12, 1.2, 8]} />
          </mesh>

          {/* Insulated Pump House Container Cabin */}
          <mesh position={[0, 0.6, 0]} material={materials.maitriWallYellow} castShadow>
            <boxGeometry args={[2.8, 1.8, 2.2]} />
          </mesh>

          {/* Sub-Ice Penetration Intake Tube into Lake Priyadarshini */}
          <mesh position={[2.0, -1.0, -1.5]} rotation={[0, 0, Math.PI / 4]} material={materials.structuralStilts}>
            <cylinderGeometry args={[0.15, 0.15, 2.4, 12]} />
          </mesh>

          {/* Status Indicator */}
          <mesh position={[1.42, 1.0, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial color={getStatusColor(lakePump.operationalStatus, lakePump.healthScore)} />
          </mesh>

          {(selectedAssetId === lakePump.assetId || hoveredAssetId === lakePump.assetId) && (
            <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.0, 2.3, 24]} />
              <meshBasicMaterial color={POLAR_PALETTE.statusCyan} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          )}

          {hoveredAssetId === lakePump.assetId && selectedAssetId !== lakePump.assetId && (
            <Html position={[0, 2.0, 0]} center distanceFactor={14}>
              <div className="bg-slate-900/95 text-slate-100 border border-cyan-500/60 px-3 py-2 rounded-xl shadow-2xl backdrop-blur-md whitespace-nowrap text-xs pointer-events-none space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(lakePump.operationalStatus, lakePump.healthScore) }} />
                  <span className="font-bold">{lakePump.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Flow: {(lakePump.readings as any)?.intakeFlow?.value ?? (lakePump.readings as any)?.intake_flow?.value ?? "--"} L/h | Trace Temp: {(lakePump.readings as any)?.pipeTraceTemp?.value ?? "--"}°C
                </div>
              </div>
            </Html>
          )}
        </group>
      )}

      {/* Heated Insulated Water Pipeline from Lake Pump House to Treatment Plant */}
      <mesh position={[13.0, 0.4, -19.0]} rotation={[0, -Math.PI / 6, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 12.0, 8]} />
        <meshStandardMaterial color={POLAR_PALETTE.pipeWaterBlue} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Priyadarshini Water Treatment Unit (WTR-MAI-001) */}
      {wtrPlant && (
        <group
          position={wtrPlant.position3D}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(wtrPlant.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(wtrPlant.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          <mesh position={[0, 0.8, 0]} material={materials.maitriWallOrange} castShadow>
            <boxGeometry args={[3.2, 1.9, 2.4]} />
          </mesh>
          <mesh position={[0, 1.9, 0]} material={materials.maitriRoof}>
            <boxGeometry args={[3.4, 0.15, 2.6]} />
          </mesh>
        </group>
      )}
    </group>
  );
}
