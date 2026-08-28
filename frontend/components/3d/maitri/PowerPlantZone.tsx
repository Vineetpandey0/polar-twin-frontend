import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { materials, getStatusColor, POLAR_PALETTE } from "@/lib/3d/materials";
import { DigitalTwinAsset } from "@/lib/3d/assetRegistry";

interface PowerPlantZoneProps {
  assets: Record<string, DigitalTwinAsset>;
  selectedAssetId: string | null;
  hoveredAssetId: string | null;
  onSelect: (assetId: string) => void;
  onHover: (assetId: string | null) => void;
}

export function MaitriPowerPlantZone({
  assets,
  selectedAssetId,
  hoveredAssetId,
  onSelect,
  onHover,
}: PowerPlantZoneProps) {
  const fan1Ref = useRef<THREE.Group>(null);
  const fan2Ref = useRef<THREE.Group>(null);
  const gen1MeshRef = useRef<THREE.Group>(null);

  // Subtle rotation & vibration animations for running generator
  useFrame((_, delta) => {
    if (fan1Ref.current) fan1Ref.current.rotation.z += delta * 15;
    if (fan2Ref.current) fan2Ref.current.rotation.z += delta * 12;

    if (gen1MeshRef.current) {
      gen1MeshRef.current.position.y = 0.5 + Math.sin(Date.now() * 0.04) * 0.008;
    }
  });

  const gen1 = assets["GEN-MAI-001"];
  const gen2 = assets["GEN-MAI-002"];
  const gen3 = assets["GEN-MAI-003"];
  const bess = assets["BAT-MAI-001"];
  const swg = assets["SWG-MAI-001"];

  const renderGeneratorUnit = (
    asset: DigitalTwinAsset,
    fanRef: React.RefObject<THREE.Group> | null,
    isVibrating: boolean = false
  ) => {
    if (!asset) return null;
    const isSelected = selectedAssetId === asset.assetId;
    const isHovered = hoveredAssetId === asset.assetId;
    const statusColor = getStatusColor(asset.operationalStatus, asset.healthScore);

    return (
      <group
        key={asset.assetId}
        position={asset.position3D}
        ref={isVibrating ? gen1MeshRef : undefined}
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
        {/* Steel Base Skid / Anti-vibration Mounts */}
        <mesh position={[0, 0.1, 0]} material={materials.structuralStilts} castShadow>
          <boxGeometry args={[2.4, 0.2, 1.4]} />
        </mesh>

        {/* Heavy Diesel Engine & Alternator Housing */}
        <mesh position={[-0.2, 0.6, 0]} material={materials.generatorBody} castShadow>
          <boxGeometry args={[1.6, 0.8, 1.1]} />
        </mesh>

        {/* Radiator Cooling Fan Box */}
        <mesh position={[0.8, 0.65, 0]} material={materials.generatorExhaust}>
          <boxGeometry args={[0.4, 0.9, 1.1]} />
        </mesh>

        {/* Spinning Fan Blades */}
        <group position={[1.02, 0.65, 0]} ref={fanRef}>
          <mesh rotation={[0, 0, 0]}>
            <boxGeometry args={[0.02, 0.7, 0.1]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.02, 0.7, 0.1]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>

        {/* Exhaust Stack Flue & Silencer */}
        <mesh position={[-0.6, 1.5, 0]} material={materials.generatorExhaust}>
          <cylinderGeometry args={[0.09, 0.09, 1.2, 12]} />
        </mesh>

        {/* Status LED Beacon */}
        <mesh position={[0.7, 1.15, 0.4]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color={statusColor} />
        </mesh>

        {/* Selection Ring */}
        {(isSelected || isHovered) && (
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 1.7, 24]} />
            <meshBasicMaterial color={statusColor} side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        )}

        {/* Tooltip */}
        {isHovered && !isSelected && (
          <Html position={[0, 2.0, 0]} center distanceFactor={14}>
            <div className="bg-slate-900/95 text-slate-100 border border-cyan-500/60 px-3 py-2 rounded-xl shadow-2xl backdrop-blur-md whitespace-nowrap text-xs pointer-events-none space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
                <span className="font-bold">{asset.name}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Load: {asset.readings.activeLoad?.value} kW | Temp: {asset.readings.coolantTemp?.value}°C | RPM: {asset.readings.rpm?.value}
              </div>
            </div>
          </Html>
        )}
      </group>
    );
  };

  return (
    <group name="maitri-power-infrastructure-zone">
      {/* Generator House Shelter Structure (Open Front Facade for digital twin inspection) */}
      <group position={[-14.5, 0, 0.5]}>
        {/* Concrete Pad Foundation */}
        <mesh position={[0, 0.1, 0]} receiveShadow material={materials.structuralStilts}>
          <boxGeometry args={[5.2, 0.2, 10.5]} />
        </mesh>
        {/* Rear Wall & Roof Truss */}
        <mesh position={[-2.4, 1.8, 0]} material={materials.maitriSteelGray}>
          <boxGeometry args={[0.3, 3.4, 10.2]} />
        </mesh>
        <mesh position={[0, 3.4, 0]} material={materials.maitriRoof}>
          <boxGeometry args={[5.2, 0.2, 10.4]} />
        </mesh>
      </group>

      {/* Render 3 Generators */}
      {gen1 && renderGeneratorUnit(gen1, fan1Ref as any, true)}
      {gen2 && renderGeneratorUnit(gen2, fan2Ref as any, false)}
      {gen3 && renderGeneratorUnit(gen3, null, false)}

      {/* BESS Battery Storage Enclosure (BAT-MAI-001) */}
      {bess && (
        <group
          position={bess.position3D}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(bess.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(bess.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          <mesh position={[0, 1.1, 0]} material={materials.generatorBody} castShadow>
            <boxGeometry args={[2.2, 2.0, 3.2]} />
          </mesh>
          {/* Status Glow Indicator */}
          <mesh position={[1.12, 1.4, 0]}>
            <boxGeometry args={[0.05, 0.3, 1.5]} />
            <meshBasicMaterial color={POLAR_PALETTE.statusGreen} />
          </mesh>

          {(selectedAssetId === bess.assetId || hoveredAssetId === bess.assetId) && (
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.0, 2.2, 24]} />
              <meshBasicMaterial color={POLAR_PALETTE.statusGreen} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          )}
        </group>
      )}

      {/* Central Microgrid Switchgear Cabinet (SWG-MAI-001) */}
      {swg && (
        <group
          position={swg.position3D}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(swg.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(swg.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          <mesh position={[0, 1.1, 0]} material={materials.structuralStilts} castShadow>
            <boxGeometry args={[1.2, 2.0, 2.0]} />
          </mesh>
          {/* LED Display screen */}
          <mesh position={[0.61, 1.4, 0]}>
            <boxGeometry args={[0.04, 0.4, 0.8]} />
            <meshBasicMaterial color={POLAR_PALETTE.statusCyan} />
          </mesh>
        </group>
      )}
    </group>
  );
}
