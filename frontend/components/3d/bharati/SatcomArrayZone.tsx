import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { materials, getStatusColor, POLAR_PALETTE } from "@/lib/3d/materials";
import { DigitalTwinAsset } from "@/lib/3d/assetRegistry";

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

  const satcom = assets["COM-BHA-001"];

  useFrame(() => {
    if (beacon1Ref.current && beacon2Ref.current) {
      const s = 1.0 + Math.sin(Date.now() * 0.007) * 0.3;
      beacon1Ref.current.scale.set(s, s, s);
      beacon2Ref.current.scale.set(s, s, s);
    }
  });

  return (
    <group name="bharati-satcom-radome-array-zone">
      {satcom && (
        <group
          position={satcom.position3D}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(satcom.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(satcom.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          {/* Dual Ground Station Pedestals */}
          {[-1.8, 1.8].map((offset, idx) => (
            <group key={idx} position={[offset, 0, 0]}>
              {/* Support Pylon */}
              <mesh position={[0, -2.2, 0]} material={materials.structuralStilts}>
                <cylinderGeometry args={[0.8, 1.3, 4.2, 12]} />
              </mesh>

              {/* Hydrophobic 7.3m Tracking Radome Sphere */}
              <mesh position={[0, 0.4, 0]} material={materials.radomeCover} castShadow>
                <sphereGeometry args={[2.0, 32, 24]} />
              </mesh>

              {/* Aviation Warning Beacon */}
              <mesh ref={idx === 0 ? beacon1Ref : beacon2Ref} position={[0, 2.5, 0]}>
                <sphereGeometry args={[0.14, 12, 12]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
            </group>
          ))}

          {(selectedAssetId === satcom.assetId || hoveredAssetId === satcom.assetId) && (
            <mesh position={[0, -4.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[3.8, 4.3, 32]} />
              <meshBasicMaterial color={POLAR_PALETTE.statusCyan} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          )}

          {hoveredAssetId === satcom.assetId && selectedAssetId !== satcom.assetId && (
            <Html position={[0, 3.2, 0]} center distanceFactor={14}>
              <div className="bg-slate-900/95 text-slate-100 border border-cyan-500/60 px-3 py-2 rounded-xl shadow-2xl backdrop-blur-md whitespace-nowrap text-xs pointer-events-none space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-bold">{satcom.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Mission: {satcom.readings?.satelliteTrack?.value} | Downlink: {satcom.readings?.downlinkRate?.value} Mbps | C/N: {satcom.readings?.signalStrength?.value}%
                </div>
              </div>
            </Html>
          )}
        </group>
      )}
    </group>
  );
}
