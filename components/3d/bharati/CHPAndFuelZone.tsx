import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { materials, getStatusColor, POLAR_PALETTE } from "@/lib/3d/materials";
import { DigitalTwinAsset } from "@/lib/3d/assetRegistry";
import { HoverTooltip } from "@/components/3d/ui/HoverTooltip";

interface CHPAndFuelZoneProps {
  assets: Record<string, DigitalTwinAsset>;
  selectedAssetId: string | null;
  hoveredAssetId: string | null;
  onSelect: (assetId: string) => void;
  onHover: (assetId: string | null) => void;
}

export function BharatiCHPAndFuelZone({
  assets,
  selectedAssetId,
  hoveredAssetId,
  onSelect,
  onHover,
}: CHPAndFuelZoneProps) {
  const fan1Ref = useRef<THREE.Group>(null);
  const fan2Ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (fan1Ref.current) fan1Ref.current.rotation.z += delta * 14;
    if (fan2Ref.current) fan2Ref.current.rotation.z += delta * 14;
  });

  const gen1 = assets["GEN-BHA-001"];
  const gen2 = assets["GEN-BHA-002"];
  const bess = assets["BAT-BHA-001"];
  const swg = assets["SWG-BHA-001"];
  const fuel = assets["FUL-BHA-001"];

  const renderCHPUnit = (asset: DigitalTwinAsset, fanRef: React.RefObject<THREE.Group>) => {
    if (!asset) return null;
    const isSelected = selectedAssetId === asset.assetId;
    const isHovered = hoveredAssetId === asset.assetId;
    const statusColor = getStatusColor(asset.operationalStatus, asset.healthScore);

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
        {/* Steel Skid Footing */}
        <mesh position={[0, 0.1, 0]} material={materials.structuralStilts}>
          <boxGeometry args={[2.8, 0.2, 1.6]} />
        </mesh>

        {/* High-Efficiency Sound-Attenuated CHP Module Body */}
        <mesh position={[0, 0.8, 0]} material={materials.generatorBody} castShadow>
          <boxGeometry args={[2.2, 1.2, 1.3]} />
        </mesh>

        {/* Waste-Heat Recovery Heat Exchanger Unit (Top) */}
        <mesh position={[-0.4, 1.6, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.generatorExhaust}>
          <cylinderGeometry args={[0.3, 0.3, 1.4, 16]} />
        </mesh>

        {/* Radiator Fan */}
        <group position={[1.15, 0.8, 0]} ref={fanRef}>
          <mesh>
            <boxGeometry args={[0.02, 0.8, 0.12]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.02, 0.8, 0.12]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>

        {/* Exhaust Stack */}
        <mesh position={[-0.9, 2.0, 0]} material={materials.generatorExhaust}>
          <cylinderGeometry args={[0.1, 0.1, 1.4, 12]} />
        </mesh>

        {/* Status Light */}
        <mesh position={[0.9, 1.45, 0.5]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color={statusColor} />
        </mesh>

        {/* Selection Ring */}
        {(isSelected || isHovered) && (
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.8, 2.0, 24]} />
            <meshBasicMaterial color={statusColor} side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        )}

        {/* Tooltip */}
        {isHovered && !isSelected && (
          <HoverTooltip
            position={[0, 2.8, 0]}
            name={asset.name}
            category={asset.category}
            operationalStatus={asset.operationalStatus}
            healthScore={asset.healthScore}
            readings={asset.readings}
          />
        )}
      </group>
    );
  };

  return (
    <group name="bharati-chp-and-fuel-zone">
      {/* CHP Power Container Facility */}
      <group position={[-12.0, 0, 0.75]}>
        <mesh position={[0, 0.1, 0]} receiveShadow material={materials.structuralStilts}>
          <boxGeometry args={[5.0, 0.2, 7.5]} />
        </mesh>
      </group>

      {gen1 && renderCHPUnit(gen1, fan1Ref as any)}
      {gen2 && renderCHPUnit(gen2, fan2Ref as any)}

      {/* BESS Battery Storage (BAT-BHA-001) */}
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
          <mesh position={[0, 1.2, 0]} material={materials.bharatiPanelSilver} castShadow>
            <boxGeometry args={[2.6, 2.2, 3.8]} />
          </mesh>
          <mesh position={[1.32, 1.6, 0]}>
            <boxGeometry args={[0.04, 0.4, 1.8]} />
            <meshBasicMaterial color={POLAR_PALETTE.statusGreen} />
          </mesh>
          {hoveredAssetId === bess.assetId && selectedAssetId !== bess.assetId && (
            <HoverTooltip
              position={[0, 2.8, 0]}
              name={bess.name}
              category={bess.category}
              operationalStatus={bess.operationalStatus}
              healthScore={bess.healthScore}
              readings={bess.readings}
            />
          )}
        </group>
      )}

      {/* Switchboard (SWG-BHA-001) */}
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
            <boxGeometry args={[1.4, 2.0, 2.2]} />
          </mesh>
          {hoveredAssetId === swg.assetId && selectedAssetId !== swg.assetId && (
            <HoverTooltip
              position={[0, 2.5, 0]}
              name={swg.name}
              category={swg.category}
              operationalStatus={swg.operationalStatus}
              healthScore={swg.healthScore}
              readings={swg.readings}
            />
          )}
        </group>
      )}

      {/* Fuel Storage Tank Battery (FUL-BHA-001) - 3 Vertical Insulated Cylinders */}
      {fuel && (
        <group
          position={fuel.position3D}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(fuel.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(fuel.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          {/* Concrete Bunding Berm Pad */}
          <mesh position={[0, -0.9, 0]} material={materials.structuralStilts}>
            <boxGeometry args={[7.2, 0.3, 4.5]} />
          </mesh>

          {/* 3 Vertical Cylindrical Tanks */}
          {[-2.0, 0, 2.0].map((x, idx) => (
            <group key={idx} position={[x, 0.8, 0]}>
              <mesh material={materials.fuelTank} castShadow>
                <cylinderGeometry args={[0.9, 0.9, 3.4, 24]} />
              </mesh>
              {/* Domed Cap */}
              <mesh position={[0, 1.7, 0]} material={materials.fuelTank}>
                <sphereGeometry args={[0.9, 24, 12, 0, Math.PI * 2, 0, Math.PI / 3]} />
              </mesh>
            </group>
          ))}

          {(selectedAssetId === fuel.assetId || hoveredAssetId === fuel.assetId) && (
            <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[3.8, 4.2, 32]} />
              <meshBasicMaterial color={POLAR_PALETTE.statusCyan} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          )}

          {hoveredAssetId === fuel.assetId && selectedAssetId !== fuel.assetId && (
            <HoverTooltip
              position={[0, 3.2, 0]}
              name={fuel.name}
              category={fuel.category}
              operationalStatus={fuel.operationalStatus}
              healthScore={fuel.healthScore}
              readings={fuel.readings}
            />
          )}
        </group>
      )}

      {/* Arctic Fuel Supply Pipeline from Fuel Battery [16, 1.8, 6] to CHP Plant [-12, 1.6, 2.5] */}
      <group position={[2.0, 0.25, 4.25]} rotation={[0, -0.124, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.07, 0.07, 28.5, 8]} />
          <meshStandardMaterial color={POLAR_PALETTE.pipeFuelAmber} roughness={0.3} metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
