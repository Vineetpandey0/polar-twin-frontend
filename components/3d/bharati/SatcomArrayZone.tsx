import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { materials, getStatusColor, POLAR_PALETTE } from "@/lib/3d/materials";
import { DigitalTwinAsset } from "@/lib/3d/assetRegistry";
import { HoverTooltip } from "@/components/3d/ui/HoverTooltip";

interface SatcomArrayZoneProps {
  assets: Record<string, DigitalTwinAsset>;
  selectedAssetId: string | null;
  hoveredAssetId: string | null;
  onSelect: (assetId: string) => void;
  onHover: (assetId: string | null) => void;
}

export function BharatiSatcomArrayZone({
  assets,
  selectedAssetId,
  hoveredAssetId,
  onSelect,
  onHover,
}: SatcomArrayZoneProps) {
  const beacon1Ref = useRef<THREE.Mesh>(null);
  const beacon2Ref = useRef<THREE.Mesh>(null);

  const ageos = assets["COM-BHA-AGEOS"] || assets["COM-BHA-001"];
  const vsat = assets["COM-BHA-001"];

  useFrame(() => {
    if (beacon1Ref.current && beacon2Ref.current) {
      const s = 1.0 + Math.sin(Date.now() * 0.007) * 0.3;
      beacon1Ref.current.scale.set(s, s, s);
      beacon2Ref.current.scale.set(s, s, s);
    }
  });

  return (
    <group name="bharati-satcom-radome-array-zone">
      {/* 1. ISRO AGEOS DUAL 7.3m TRACKING RADOMES (COM-BHA-AGEOS) */}
      {ageos && (
        <group
          position={ageos.position3D}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(ageos.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(ageos.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          {/* Dual Ground Station Concrete & Steel Foundations */}
          {[-2.2, 2.2].map((offset, idx) => (
            <group key={idx} position={[offset, 0, 0]}>
              {/* Foundation Pylon */}
              <mesh position={[0, -2.2, 0]} material={materials.structuralStilts}>
                <cylinderGeometry args={[0.9, 1.4, 4.2, 16]} />
              </mesh>

              {/* Hydrophobic 7.3m Pressurized Geodesic Radome Sphere */}
              <mesh position={[0, 0.5, 0]} material={materials.radomeCover} castShadow>
                <sphereGeometry args={[2.2, 32, 24]} />
              </mesh>

              {/* Internal Az-El Steerable Parabolic Tracking Antenna Silhouette */}
              <group position={[0, 0.5, 0]} rotation={[0.4, idx === 0 ? 0.8 : -0.5, 0]}>
                <mesh material={materials.fuelTank}>
                  <cylinderGeometry args={[1.5, 0.3, 0.4, 16]} />
                </mesh>
              </group>

              {/* Aviation Warning Beacon Light */}
              <mesh ref={idx === 0 ? beacon1Ref : beacon2Ref} position={[0, 2.8, 0]}>
                <sphereGeometry args={[0.14, 12, 12]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
            </group>
          ))}

          {(selectedAssetId === ageos.assetId || hoveredAssetId === ageos.assetId) && (
            <mesh position={[0, -4.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[4.2, 4.8, 32]} />
              <meshBasicMaterial color={POLAR_PALETTE.statusCyan} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          )}

          {hoveredAssetId === ageos.assetId && selectedAssetId !== ageos.assetId && (
            <HoverTooltip
              position={[0, 4.0, 0]}
              name={ageos.name}
              category={ageos.category}
              operationalStatus={ageos.operationalStatus}
              healthScore={ageos.healthScore}
              readings={ageos.readings}
              subtitle="Dual 7.3m Az-El Dishes | Cartosat / Resourcesat Polar Orbit Relay"
            />
          )}
        </group>
      )}

      {/* 2. STATION VSAT C-BAND DISH ON ROOFTOP (COM-BHA-001) */}
      {vsat && vsat.assetId !== ageos?.assetId && (
        <group
          position={vsat.position3D}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(vsat.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(vsat.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          <mesh position={[0, 0, 0]} material={materials.structuralStilts}>
            <cylinderGeometry args={[0.08, 0.08, 1.2, 12]} />
          </mesh>
          <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 4, 0, 0]} material={materials.fuelTank}>
            <cylinderGeometry args={[1.2, 0.2, 0.3, 16]} />
          </mesh>
          {hoveredAssetId === vsat.assetId && selectedAssetId !== vsat.assetId && (
            <HoverTooltip
              position={[0, 2.2, 0]}
              name={vsat.name}
              category={vsat.category}
              operationalStatus={vsat.operationalStatus}
              healthScore={vsat.healthScore}
              readings={vsat.readings}
            />
          )}
        </group>
      )}
    </group>
  );
}
