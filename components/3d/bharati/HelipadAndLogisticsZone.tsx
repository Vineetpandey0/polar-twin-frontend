import React from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { materials, getStatusColor, POLAR_PALETTE } from "@/lib/3d/materials";
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
  const helipad = assets["HLP-BHA-001"] || { position3D: [0.0, 0.6, 18.0], name: "Aviation Helideck" };
  const pBully = assets["VEH-BHA-PBULLY"];
  const toyota = assets["VEH-BHA-TOYOTA"];
  const scooter = assets["VEH-BHA-SCOOTER"];
  const summerCamp = assets["CAMP-BHA-SUMMER"];

  return (
    <group name="bharati-helipad-and-logistics-zone">
      {/* 1. ELEVATED CERTIFIED AVIATION HELIDECK PLATFORM (HLP-BHA-001) */}
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
          {/* Structural Steel Support Stilts Lattice */}
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

      {/* 2. PISTENBULLY 300 / 400 HEAVY SNOWCAT CRAWLER (VEH-BHA-PBULLY) */}
      {pBully && (
        <group
          position={pBully.position3D}
          rotation={[0, 0.3, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(pBully.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(pBully.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          {/* Crawler Tracks */}
          <mesh position={[0, 0.2, 1.1]} material={materials.generatorBody}>
            <boxGeometry args={[4.2, 0.5, 0.6]} />
          </mesh>
          <mesh position={[0, 0.2, -1.1]} material={materials.generatorBody}>
            <boxGeometry args={[4.2, 0.5, 0.6]} />
          </mesh>

          {/* Orange Operator Cab */}
          <mesh position={[-0.4, 1.0, 0]} castShadow>
            <boxGeometry args={[2.4, 1.3, 2.0]} />
            <meshStandardMaterial color={POLAR_PALETTE.maitriCladdingOrange} roughness={0.4} />
          </mesh>
          {/* Front Dozer Blade Arms */}
          <mesh position={[2.2, 0.4, 0]} material={materials.structuralStilts}>
            <boxGeometry args={[0.4, 0.8, 2.6]} />
          </mesh>
        </group>
      )}

      {/* 3. TOYOTA ARCTIC TRUCK TUNDRA (VEH-BHA-TOYOTA) */}
      {toyota && (
        <group
          position={toyota.position3D}
          rotation={[0, -0.4, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(toyota.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(toyota.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          {/* Pickup Body */}
          <mesh position={[0, 0.7, 0]} castShadow material={materials.bharatiPanelSilver}>
            <boxGeometry args={[3.2, 1.1, 1.6]} />
          </mesh>
          {/* 44-Inch Ultra-Wide Balloon Tires */}
          {[-1.1, 1.1].map((x) =>
            [-0.9, 0.9].map((z) => (
              <mesh key={`wheel-${x}-${z}`} position={[x, 0.35, z]} rotation={[Math.PI / 2, 0, 0]} material={materials.generatorBody}>
                <cylinderGeometry args={[0.45, 0.45, 0.4, 16]} />
              </mesh>
            ))
          )}
        </group>
      )}

      {/* 4. EXPEDITION SNOW SCOOTERS FLEET (VEH-BHA-SCOOTER) */}
      {scooter && (
        <group
          position={scooter.position3D}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(scooter.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(scooter.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          {[-1.0, 1.0].map((offset, idx) => (
            <group key={idx} position={[offset * 1.4, 0, 0]}>
              <mesh position={[0, 0.3, 0]} material={materials.maitriSteelGray}>
                <boxGeometry args={[1.4, 0.4, 0.6]} />
              </mesh>
              <mesh position={[0.6, 0.5, 0]} material={materials.generatorBody}>
                <boxGeometry args={[0.4, 0.4, 0.5]} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 5. TENTED EXPEDITION SUMMER CAMP & STORAGE CONTAINERS (CAMP-BHA-SUMMER) */}
      {summerCamp && (
        <group
          position={summerCamp.position3D}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(summerCamp.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(summerCamp.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          {/* Polar Expedition Tents */}
          {[-3.0, 0, 3.0].map((x, idx) => (
            <mesh key={idx} position={[x, 0.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <coneGeometry args={[1.5, 1.8, 4]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.6} />
            </mesh>
          ))}
          {/* Standalone ISO Storage Container */}
          <mesh position={[0, 0.8, 4.0]} material={materials.maitriWallOrange} castShadow>
            <boxGeometry args={[4.2, 1.6, 1.8]} />
          </mesh>
        </group>
      )}
    </group>
  );
}
