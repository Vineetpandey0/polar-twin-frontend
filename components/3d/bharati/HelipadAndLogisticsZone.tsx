import React from "react";
import * as THREE from "three";
import { materials, POLAR_PALETTE } from "@/lib/3d/materials";
import { DigitalTwinAsset } from "@/lib/3d/assetRegistry";

interface HelipadAndLogisticsZoneProps {
  assets: Record<string, DigitalTwinAsset>;
  selectedAssetId: string | null;
  hoveredAssetId: string | null;
  onSelect: (assetId: string) => void;
  onHover: (assetId: string | null) => void;
}

export function BharatiHelipadAndLogisticsZone({
  assets,
  selectedAssetId,
  hoveredAssetId,
  onSelect,
  onHover,
}: HelipadAndLogisticsZoneProps) {
  const helipad = assets["HLP-BHA-001"];

  return (
    <group name="bharati-helipad-and-logistics-zone">
      {/* Elevated Certified Aviation Helideck (HLP-BHA-001) */}
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
          {/* Structural Steel Helideck Support Lattice */}
          <group position={[0, -0.4, 0]}>
            {[-3.5, 3.5].map((x) =>
              [-3.5, 3.5].map((z) => (
                <mesh key={`${x}-${z}`} position={[x, 0, z]} material={materials.structuralStilts}>
                  <cylinderGeometry args={[0.16, 0.16, 0.8, 8]} />
                </mesh>
              ))
            )}
          </group>

          {/* Octagonal Steel Helideck Platform */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <cylinderGeometry args={[6.2, 6.2, 0.25, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.5} />
          </mesh>

          {/* Helideck 'H' Landing Markings */}
          <group position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh position={[-1.4, 0, 0]} material={materials.helipadMarking}>
              <planeGeometry args={[0.6, 3.6]} />
            </mesh>
            <mesh position={[1.4, 0, 0]} material={materials.helipadMarking}>
              <planeGeometry args={[0.6, 3.6]} />
            </mesh>
            <mesh position={[0, 0, 0]} material={materials.helipadMarking}>
              <planeGeometry args={[2.2, 0.6]} />
            </mesh>
            <mesh>
              <ringGeometry args={[4.8, 5.2, 32]} />
              <primitive object={materials.helipadMarking} attach="material" />
            </mesh>
          </group>

          {/* Perimeter Aviation Approach Lights */}
          {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4].map((angle, i) => {
            const px = Math.cos(angle) * 5.8;
            const pz = Math.sin(angle) * 5.8;
            return (
              <mesh key={i} position={[px, 0.25, pz]}>
                <cylinderGeometry args={[0.07, 0.07, 0.3, 8]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
            );
          })}

          {(selectedAssetId === helipad.assetId || hoveredAssetId === helipad.assetId) && (
            <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[6.4, 6.8, 32]} />
              <meshBasicMaterial color={POLAR_PALETTE.statusCyan} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          )}
        </group>
      )}

      {/* Polar Heavy Vehicle Transport */}
      <group position={[-10.0, 0.6, 12.0]} rotation={[0, 0.2, 0]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[3.2, 1.4, 2.0]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.2, 1.1]} material={materials.generatorBody}>
          <boxGeometry args={[3.6, 0.45, 0.45]} />
        </mesh>
        <mesh position={[0, 0.2, -1.1]} material={materials.generatorBody}>
          <boxGeometry args={[3.6, 0.45, 0.45]} />
        </mesh>
      </group>
    </group>
  );
}
