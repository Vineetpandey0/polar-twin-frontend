import React from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { materials, getStatusColor, POLAR_PALETTE } from "@/lib/3d/materials";
import { DigitalTwinAsset } from "@/lib/3d/assetRegistry";

interface FuelFarmZoneProps {
  assets: Record<string, DigitalTwinAsset>;
  selectedAssetId: string | null;
  hoveredAssetId: string | null;
  onSelect: (assetId: string) => void;
  onHover: (assetId: string | null) => void;
}

export function MaitriFuelFarmZone({
  assets,
  selectedAssetId,
  hoveredAssetId,
  onSelect,
  onHover,
}: FuelFarmZoneProps) {
  const tank1 = assets["FUL-MAI-001"];
  const tank2 = assets["FUL-MAI-002"];
  const pump = assets["PMP-MAI-FUEL"];

  const renderFuelTank = (asset: DigitalTwinAsset) => {
    if (!asset) return null;
    const isSelected = selectedAssetId === asset.assetId;
    const isHovered = hoveredAssetId === asset.assetId;
    const statusColor = getStatusColor(asset.operationalStatus, asset.healthScore);
    const fillPercent = Number((asset.readings as any)?.fillPercent?.value || (asset.readings as any)?.fuel_level?.value || 78.5);

    return (
      <group
        key={asset.assetId}
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
        {/* Tank Steel Saddle Supports */}
        <mesh position={[0, -0.9, -1.2]} material={materials.structuralStilts}>
          <boxGeometry args={[2.2, 0.4, 0.4]} />
        </mesh>
        <mesh position={[0, -0.9, 1.2]} material={materials.structuralStilts}>
          <boxGeometry args={[2.2, 0.4, 0.4]} />
        </mesh>

        {/* Horizontal Cylindrical Tank Body */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.fuelTank} castShadow receiveShadow>
          <cylinderGeometry args={[1.3, 1.3, 3.6, 24]} />
        </mesh>

        {/* Dished End Caps */}
        <mesh position={[0, 0, 1.8]} material={materials.fuelTank}>
          <sphereGeometry args={[1.3, 24, 12, 0, Math.PI * 2, 0, Math.PI / 3]} />
        </mesh>
        <mesh position={[0, 0, -1.8]} rotation={[Math.PI, 0, 0]} material={materials.fuelTank}>
          <sphereGeometry args={[1.3, 24, 12, 0, Math.PI * 2, 0, Math.PI / 3]} />
        </mesh>

        {/* Top Manway & Breather Vent */}
        <mesh position={[0, 1.4, 0]} material={materials.structuralStilts}>
          <cylinderGeometry args={[0.25, 0.25, 0.3, 12]} />
        </mesh>

        {/* Visual Level Sight Gauge Bar */}
        <group position={[1.32, 0, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.04, 1.8, 0.08]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.01, -0.9 + (fillPercent / 100) * 0.9, 0]}>
            <boxGeometry args={[0.05, (fillPercent / 100) * 1.8, 0.06]} />
            <meshBasicMaterial color={statusColor} />
          </mesh>
        </group>

        {/* Selection Ring */}
        {(isSelected || isHovered) && (
          <mesh position={[0, -1.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.2, 2.5, 32]} />
            <meshBasicMaterial color={statusColor} side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        )}

        {/* Tooltip */}
        {isHovered && !isSelected && (
          <Html position={[0, 2.2, 0]} center distanceFactor={14}>
            <div className="bg-slate-900/95 text-slate-100 border border-cyan-500/60 px-3 py-2 rounded-xl shadow-2xl backdrop-blur-md whitespace-nowrap text-xs pointer-events-none space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
                <span className="font-bold">{asset.name}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Level: {fillPercent}% ({(asset.readings as any)?.volumeLiters?.value ?? "--"} L) | Runway: {(asset.readings as any)?.daysRunway?.value ?? "--"}
              </div>
            </div>
          </Html>
        )}
      </group>
    );
  };

  return (
    <group name="maitri-fuel-farm-zone">
      {/* 110% Secondary Containment Bunding Concrete Berm */}
      <group position={[14.0, 0, 4.0]}>
        <mesh position={[0, 0.1, 0]} receiveShadow material={materials.structuralStilts}>
          <boxGeometry args={[8.5, 0.2, 7.5]} />
        </mesh>
        {/* Perimeter Bunding Walls */}
        <mesh position={[0, 0.4, 3.65]} material={materials.maitriRoof}>
          <boxGeometry args={[8.5, 0.6, 0.2]} />
        </mesh>
        <mesh position={[0, 0.4, -3.65]} material={materials.maitriRoof}>
          <boxGeometry args={[8.5, 0.6, 0.2]} />
        </mesh>
        <mesh position={[4.15, 0.4, 0]} material={materials.maitriRoof}>
          <boxGeometry args={[0.2, 0.6, 7.5]} />
        </mesh>
        <mesh position={[-4.15, 0.4, 0]} material={materials.maitriRoof}>
          <boxGeometry args={[0.2, 0.6, 7.5]} />
        </mesh>
      </group>

      {/* Render Tanks */}
      {tank1 && renderFuelTank(tank1)}
      {tank2 && renderFuelTank(tank2)}

      {/* Fuel Transfer Pump Skid (PMP-MAI-FUEL) */}
      {pump && (
        <group
          position={pump.position3D}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(pump.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(pump.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          <mesh position={[0, 0.3, 0]} material={materials.structuralStilts}>
            <boxGeometry args={[1.2, 0.6, 0.8]} />
          </mesh>
          <mesh position={[0, 0.7, 0]} material={materials.generatorBody}>
            <cylinderGeometry args={[0.2, 0.2, 0.5, 12]} />
          </mesh>
        </group>
      )}

      {/* Connecting Heated Pipeline to Power House [-14.5, 1.2, 0.5] from Fuel Farm [14.0, 0.8, 6.5] */}
      <mesh position={[-0.25, 0.25, 3.5]} rotation={[0, -0.207, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 29.2, 8]} />
        <meshStandardMaterial color={POLAR_PALETTE.pipeFuelAmber} roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}
