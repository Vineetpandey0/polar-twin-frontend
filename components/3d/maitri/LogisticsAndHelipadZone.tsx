import React from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { materials, POLAR_PALETTE } from "@/lib/3d/materials";
import { DigitalTwinAsset } from "@/lib/3d/assetRegistry";

interface LogisticsAndHelipadZoneProps {
  assets: Record<string, DigitalTwinAsset>;
  selectedAssetId: string | null;
  hoveredAssetId: string | null;
  onSelect: (assetId: string) => void;
  onHover: (assetId: string | null) => void;
}

export function MaitriLogisticsAndHelipadZone({
  assets,
  selectedAssetId,
  hoveredAssetId,
  onSelect,
  onHover,
}: LogisticsAndHelipadZoneProps) {
  const helipad = assets["HLP-MAI-001"];

  return (
    <group name="maitri-logistics-and-helipad-zone">
      {/* Designated Snow Helipad (HLP-MAI-001) */}
      {helipad && (
        <group
          position={helipad.position3D}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(helipad.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(helipad.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          {/* Compacted Helideck Surface */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[5.5, 32]} />
            <meshStandardMaterial color="#475569" roughness={0.9} />
          </mesh>

          {/* Yellow Aviation 'H' Marking */}
          <group position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            {/* Left Bar */}
            <mesh position={[-1.2, 0, 0]} material={materials.helipadMarking}>
              <planeGeometry args={[0.5, 3.2]} />
            </mesh>
            {/* Right Bar */}
            <mesh position={[1.2, 0, 0]} material={materials.helipadMarking}>
              <planeGeometry args={[0.5, 3.2]} />
            </mesh>
            {/* Cross Bar */}
            <mesh position={[0, 0, 0]} material={materials.helipadMarking}>
              <planeGeometry args={[2.0, 0.5]} />
            </mesh>
            {/* Outer Ring */}
            <mesh>
              <ringGeometry args={[4.5, 4.9, 32]} />
              <primitive object={materials.helipadMarking} attach="material" />
            </mesh>
          </group>

          {/* Perimeter Safety Beacon Lights */}
          {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4].map((angle, i) => {
            const px = Math.cos(angle) * 5.2;
            const pz = Math.sin(angle) * 5.2;
            return (
              <mesh key={i} position={[px, 0.15, pz]}>
                <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
            );
          })}

          {(selectedAssetId === helipad.assetId || hoveredAssetId === helipad.assetId) && (
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[5.6, 6.0, 32]} />
              <meshBasicMaterial color={POLAR_PALETTE.statusCyan} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          )}
        </group>
      )}

      {/* PistenBully Tracked Polar Snow Vehicle */}
      <group position={[-8.5, 0.6, 12.0]} rotation={[0, 0.4, 0]}>
        {/* Main Red Chassis */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[2.8, 1.2, 1.8]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} />
        </mesh>
        {/* Cab Glass Window */}
        <mesh position={[0.6, 0.8, 0]}>
          <boxGeometry args={[1.2, 0.7, 1.7]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} />
        </mesh>
        {/* Left & Right Rubber Snow Tracks */}
        <mesh position={[0, 0.15, 0.95]} material={materials.generatorBody}>
          <boxGeometry args={[3.2, 0.4, 0.45]} />
        </mesh>
        <mesh position={[0, 0.15, -0.95]} material={materials.generatorBody}>
          <boxGeometry args={[3.2, 0.4, 0.45]} />
        </mesh>
        {/* Front Snow Plow Blade */}
        <mesh position={[1.8, 0.3, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.1, 0.6, 2.4]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
        </mesh>
      </group>

      {/* Heavy Cargo Transport Sled */}
      <group position={[-12.5, 0.3, 13.5]} rotation={[0, 0.4, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[3.5, 0.3, 1.6]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
        {/* Cargo Shipping Container on Sled */}
        <mesh position={[0, 1.0, 0]} material={materials.maitriWallYellow}>
          <boxGeometry args={[3.2, 1.4, 1.5]} />
        </mesh>
      </group>
    </group>
  );
}
