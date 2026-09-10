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
  const lakePump = assets["PMP-MAI-LAKE"] || {
    assetId: "PMP-MAI-LAKE",
    position3D: [16.0, 0.8, -24.0],
    name: "Lake Priyadarshini Pump House",
    operationalStatus: "RUNNING",
    healthScore: 0.94,
    readings: {},
  };

  const wtrPlant = assets["WTR-MAI-001"] || {
    assetId: "WTR-MAI-001",
    position3D: [10.0, 1.2, -14.0],
    name: "Priyadarshini Water Treatment Plant",
    operationalStatus: "RUNNING",
    healthScore: 0.95,
    readings: {},
  };

  return (
    <group name="maitri-lake-priyadarshini-water-zone">
      {/* 1. Lake-Water Pump House at Lake Shoreline (PMP-MAI-LAKE) */}
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
          <mesh position={[1.8, -0.8, -1.8]} rotation={[0.4, -0.4, 0]} material={materials.structuralStilts}>
            <cylinderGeometry args={[0.14, 0.14, 2.8, 12]} />
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
              <div className="bg-[#090D14]/95 text-[#E2EAF4] border border-[#38BDF8]/60 px-3 py-2 rounded-sm shadow-2xl backdrop-blur-md whitespace-nowrap text-xs pointer-events-none space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(lakePump.operationalStatus, lakePump.healthScore) }} />
                  <span className="font-bold">{lakePump.name}</span>
                </div>
                <div className="text-[10px] text-[#8CA1B6] font-mono">
                  Flow: {(lakePump.readings as any)?.intakeFlow?.value ?? (lakePump.readings as any)?.intake_flow?.value ?? "160"} L/h | Trace: +8.5°C
                </div>
              </div>
            </Html>
          )}
        </group>
      )}

      {/* 2. Heated Insulated Pipeline: Lake Pump [16, 0.8, -24] -> Treatment Plant [10, 1.2, -14] */}
      {/* Midpoint: [13, 1.0, -19], dx = -6, dy = 0.4, dz = 10, length = 11.67 */}
      <group position={[13.0, 0.7, -19.0]} rotation={[0.54, 0.54, 0]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 11.8, 8]} />
          <meshStandardMaterial color={POLAR_PALETTE.pipeWaterBlue} roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* Pipeline Support Pylons on Rocky Moraine */}
      {[
        [14.5, 0.35, -21.5],
        [13.0, 0.35, -19.0],
        [11.5, 0.35, -16.5],
      ].map(([px, py, pz], idx) => (
        <mesh key={`pylon-lake-${idx}`} position={[px, py, pz]} material={materials.structuralStilts}>
          <cylinderGeometry args={[0.06, 0.08, 0.7, 8]} />
        </mesh>
      ))}

      {/* 3. Priyadarshini Water Treatment Plant (WTR-MAI-001) */}
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

          {/* Filtration Pressure Vessels on Side Skid */}
          <mesh position={[1.4, 0.8, 0]} material={materials.fuelTank}>
            <cylinderGeometry args={[0.3, 0.3, 1.6, 12]} />
          </mesh>

          {(selectedAssetId === wtrPlant.assetId || hoveredAssetId === wtrPlant.assetId) && (
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.2, 2.5, 24]} />
              <meshBasicMaterial color={POLAR_PALETTE.statusCyan} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          )}

          {hoveredAssetId === wtrPlant.assetId && selectedAssetId !== wtrPlant.assetId && (
            <Html position={[0, 2.3, 0]} center distanceFactor={14}>
              <div className="bg-[#090D14]/95 text-[#E2EAF4] border border-[#38BDF8]/60 px-3 py-2 rounded-sm shadow-2xl backdrop-blur-md whitespace-nowrap text-xs pointer-events-none space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusColor(wtrPlant.operationalStatus, wtrPlant.healthScore) }} />
                  <span className="font-bold">{wtrPlant.name}</span>
                </div>
                <div className="text-[10px] text-[#8CA1B6] font-mono">
                  Potable Output: 250 L/h | UV: Active | Storage: 8,200 L
                </div>
              </div>
            </Html>
          )}
        </group>
      )}

      {/* 4. Potable Water Feed Pipeline: Treatment Plant [10, 1.2, -14] -> Main Building [0, 2.0, 0] */}
      {/* Midpoint: [5.0, 1.3, -7.0], dx = -10, dy = 0.8, dz = 14, length = 17.2 */}
      <group position={[5.0, 0.9, -7.0]} rotation={[0.62, 0.58, 0]}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.07, 17.2, 8]} />
          <meshStandardMaterial color={POLAR_PALETTE.pipeWaterBlue} roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* Pylons for main habitat feed pipe */}
      {[
        [8.0, 0.4, -11.5],
        [5.0, 0.4, -7.0],
        [2.0, 0.4, -2.5],
      ].map(([px, py, pz], idx) => (
        <mesh key={`pylon-feed-${idx}`} position={[px, py, pz]} material={materials.structuralStilts}>
          <cylinderGeometry args={[0.06, 0.08, 0.8, 8]} />
        </mesh>
      ))}
    </group>
  );
}
