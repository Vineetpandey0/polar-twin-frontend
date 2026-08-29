import React from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { getStatusColor } from "@/lib/3d/materials";

interface VehicleFleetZoneProps {
  assets: Record<string, any>;
  selectedAssetId: string | null;
  hoveredAssetId: string | null;
  onSelect: (assetId: string) => void;
  onHover: (assetId: string | null) => void;
}

export function MaitriVehicleFleetZone({
  assets,
  selectedAssetId,
  hoveredAssetId,
  onSelect,
  onHover,
}: VehicleFleetZoneProps) {
  // Orange/Yellow material for PistenBully
  const pistenMaterial = new THREE.MeshStandardMaterial({
    color: "#f97316", // Signature PistenBully Orange
    roughness: 0.3,
  });

  const trackMaterial = new THREE.MeshStandardMaterial({
    color: "#1e293b", // Dark Rubber/Steel Track
    metalness: 0.8,
  });

  return (
    <group name="maitri-vehicles-and-machinery-fleet">
      {/* 1. PISTENBULLY PB-300 SNOW GROOMER FLEET (14 Units represented in parking area) */}
      {(() => {
        const asset = assets["VEH-MAI-PBULLY"] || { position3D: [-20, 0.8, 8], name: "PistenBully Fleet" };
        const isSelected = selectedAssetId === asset.assetId;
        const isHovered = hoveredAssetId === asset.assetId;

        return (
          <group
            key="VEH-MAI-PBULLY"
            position={asset.position3D}
            onClick={(e) => { e.stopPropagation(); onSelect(asset.assetId); }}
            onPointerOver={(e) => { e.stopPropagation(); onHover(asset.assetId); }}
            onPointerOut={() => onHover(null)}
          >
            {/* Primary PistenBully 3D Model */}
            <group position={[0, 0, 0]}>
              {/* Crawler Tracks (Left & Right) */}
              <mesh position={[-0.9, -0.2, 0]} material={trackMaterial}>
                <boxGeometry args={[0.5, 0.6, 3.2]} />
              </mesh>
              <mesh position={[0.9, -0.2, 0]} material={trackMaterial}>
                <boxGeometry args={[0.5, 0.6, 3.2]} />
              </mesh>
              {/* Chassis Cab */}
              <mesh position={[0, 0.4, -0.2]} material={pistenMaterial} castShadow>
                <boxGeometry args={[1.8, 1.1, 1.8]} />
              </mesh>
              {/* Glass Windshield */}
              <mesh position={[0, 0.6, 0.65]}>
                <boxGeometry args={[1.6, 0.6, 0.1]} />
                <meshStandardMaterial color="#0284c7" roughness={0.1} />
              </mesh>

              {/* Front Dozer Snow Blade */}
              <group position={[0, -0.2, 1.8]}>
                <mesh material={trackMaterial}>
                  <boxGeometry args={[2.4, 0.6, 0.1]} />
                </mesh>
              </group>

              {/* Rear Snow Tiller */}
              <mesh position={[0, -0.2, -1.8]} material={trackMaterial}>
                <boxGeometry args={[2.2, 0.3, 0.4]} />
              </mesh>
            </group>

            {/* Additional Fleet Units parked adjacent */}
            {[-3.0, 3.0, 6.0].map((xOffset, idx) => (
              <group key={`pbully-fleet-${idx}`} position={[xOffset, 0, -2.5]}>
                <mesh position={[-0.8, -0.2, 0]} material={trackMaterial}>
                  <boxGeometry args={[0.45, 0.55, 2.8]} />
                </mesh>
                <mesh position={[0.8, -0.2, 0]} material={trackMaterial}>
                  <boxGeometry args={[0.45, 0.55, 2.8]} />
                </mesh>
                <mesh position={[0, 0.35, -0.1]} material={pistenMaterial}>
                  <boxGeometry args={[1.6, 1.0, 1.6]} />
                </mesh>
              </group>
            ))}

            {hoveredAssetId === (asset.assetId || "VEH-MAI-PBULLY") && (
              <Html position={[0, 1.8, 0]} center distanceFactor={16}>
                <div className="bg-orange-950/90 text-orange-300 border border-orange-500/50 px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-md">
                  PistenBully Fleet (14 PB-300s)
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* 2. TOYOTA ARCTIC TRUCK (Historic South Pole 44" Tundra Tires Pickup) */}
      {(() => {
        const asset = assets["VEH-MAI-TOYOTA"] || { position3D: [-18, 0.9, 12], name: "Toyota Arctic Truck" };

        return (
          <group
            key="VEH-MAI-TOYOTA"
            position={asset.position3D}
            onClick={(e) => { e.stopPropagation(); onSelect(asset.assetId); }}
            onPointerOver={(e) => { e.stopPropagation(); onHover(asset.assetId); }}
            onPointerOut={() => onHover(null)}
          >
            {/* Red Truck Body */}
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[1.4, 0.8, 2.6]} />
              <meshStandardMaterial color="#dc2626" roughness={0.3} />
            </mesh>
            {/* Truck Cab */}
            <mesh position={[0, 0.9, 0.2]}>
              <boxGeometry args={[1.3, 0.6, 1.2]} />
              <meshStandardMaterial color="#dc2626" roughness={0.3} />
            </mesh>
            {/* Massive 44" Oversized Tundra Wheels */}
            {[-0.8, 0.8].map((x) =>
              [-0.8, 0.8].map((z) => (
                <mesh key={`wheel-${x}-${z}`} position={[x, -0.1, z]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.45, 0.45, 0.35, 16]} />
                  <meshStandardMaterial color="#0f172a" />
                </mesh>
              ))
            )}

            {hoveredAssetId === (asset.assetId || "VEH-MAI-TOYOTA") && (
              <Html position={[0, 1.6, 0]} center distanceFactor={16}>
                <div className="bg-red-950/90 text-red-300 border border-red-500/50 px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-md">
                  Toyota Arctic Truck (South Pole Exp)
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* 3. HEAVY MACHINERY: BD-50 BULLDOZER & MANTIS 50 MT CRANE */}
      {(() => {
        const bulldozer = assets["VEH-MAI-BULLDOZER"] || { position3D: [-22, 1.1, 14], name: "BD-50 Bulldozer" };
        const crane = assets["VEH-MAI-CRANE"] || { position3D: [-26, 1.6, 10], name: "Mantis 50 MT Crane" };

        return (
          <>
            {/* BD-50 Bulldozer */}
            <group
              key="VEH-MAI-BULLDOZER"
              position={bulldozer.position3D}
              onClick={(e) => { e.stopPropagation(); onSelect("VEH-MAI-BULLDOZER"); }}
              onPointerOver={(e) => { e.stopPropagation(); onHover("VEH-MAI-BULLDOZER"); }}
              onPointerOut={() => onHover(null)}
            >
              <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[1.8, 1.2, 2.2]} />
                <meshStandardMaterial color="#eab308" />
              </mesh>
              {/* Dozer Blade */}
              <mesh position={[0, 0, 1.4]}>
                <boxGeometry args={[2.4, 0.8, 0.15]} />
                <meshStandardMaterial color="#334155" metalness={0.9} />
              </mesh>
              {hoveredAssetId === "VEH-MAI-BULLDOZER" && (
                <Html position={[0, 1.6, 0]} center distanceFactor={16}>
                  <div className="bg-yellow-950/90 text-yellow-300 border border-yellow-500/50 px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-md">
                    BD-50 Heavy Bulldozer
                  </div>
                </Html>
              )}
            </group>

            {/* Mantis 50 MT Crane */}
            <group
              key="VEH-MAI-CRANE"
              position={crane.position3D}
              onClick={(e) => { e.stopPropagation(); onSelect("VEH-MAI-CRANE"); }}
              onPointerOver={(e) => { e.stopPropagation(); onHover("VEH-MAI-CRANE"); }}
              onPointerOut={() => onHover(null)}
            >
              {/* Crane Base */}
              <mesh position={[0, 0.6, 0]}>
                <boxGeometry args={[2.0, 1.0, 3.0]} />
                <meshStandardMaterial color="#f59e0b" />
              </mesh>
              {/* Telescopic Boom Arm */}
              <mesh position={[0, 2.4, -0.5]} rotation={[-Math.PI / 4, 0, 0]}>
                <boxGeometry args={[0.4, 0.4, 4.5]} />
                <meshStandardMaterial color="#334155" metalness={0.8} />
              </mesh>
              {hoveredAssetId === "VEH-MAI-CRANE" && (
                <Html position={[0, 3.2, 0]} center distanceFactor={16}>
                  <div className="bg-amber-950/90 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-md">
                    Mantis 50 MT Crane (5 Units)
                  </div>
                </Html>
              )}
            </group>
          </>
        );
      })()}

      {/* 4. BANJARA MOBILE MODULE & JEEVAN JYOTI GENERATOR + 5 KL FUEL TANK */}
      {(() => {
        const asset = assets["MOD-MAI-BANJARA"] || { position3D: [-28, 1.2, 8], name: "Banjara Convoy Module" };

        return (
          <group
            key="MOD-MAI-BANJARA"
            position={asset.position3D}
            onClick={(e) => { e.stopPropagation(); onSelect(asset.assetId); }}
            onPointerOver={(e) => { e.stopPropagation(); onHover(asset.assetId); }}
            onPointerOut={() => onHover(null)}
          >
            {/* 'Banjara' Heated Living Module */}
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[2.2, 1.6, 4.0]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>

            {/* 'Jeevan Jyoti' Portable Generator Skid */}
            <mesh position={[2.2, 0.2, -1.0]}>
              <boxGeometry args={[1.2, 0.8, 1.2]} />
              <meshStandardMaterial color="#e11d48" />
            </mesh>

            {/* 5,000L (5 KL) Cylindrical Fuel Tanker Trailer */}
            <mesh position={[2.2, 0.4, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.6, 0.6, 2.2, 16]} />
              <meshStandardMaterial color="#eab308" metalness={0.6} />
            </mesh>

            {hoveredAssetId === (asset.assetId || "MOD-MAI-BANJARA") && (
              <Html position={[0, 1.8, 0]} center distanceFactor={16}>
                <div className="bg-sky-950/90 text-sky-300 border border-sky-500/50 px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-md">
                  Banjara & Jeevan Jyoti Convoy Unit
                </div>
              </Html>
            )}
          </group>
        );
      })()}
    </group>
  );
}
