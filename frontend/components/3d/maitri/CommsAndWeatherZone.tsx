import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { materials, getStatusColor, POLAR_PALETTE } from "@/lib/3d/materials";
import { DigitalTwinAsset } from "@/lib/3d/assetRegistry";

interface CommsAndWeatherZoneProps {
  assets: Record<string, DigitalTwinAsset>;
  selectedAssetId: string | null;
  hoveredAssetId: string | null;
  onSelect: (assetId: string) => void;
  onHover: (assetId: string | null) => void;
}

export function MaitriCommsAndWeatherZone({
  assets,
  selectedAssetId,
  hoveredAssetId,
  onSelect,
  onHover,
}: CommsAndWeatherZoneProps) {
  const anemometerRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  const radome = assets["COM-MAI-001"];
  const aws = assets["AWS-MAI-001"];

  useFrame((_, delta) => {
    // Spin anemometer proportional to wind speed (28.5 km/h)
    if (anemometerRef.current) {
      anemometerRef.current.rotation.y += delta * 6;
    }
    // Pulse aviation safety red beacon
    if (beaconRef.current) {
      const s = 1.0 + Math.sin(Date.now() * 0.006) * 0.3;
      beaconRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group name="maitri-comms-and-science-zone">
      {/* Ku-Band Satellite Ground Station Radome (COM-MAI-001) */}
      {radome && (
        <group
          position={radome.position3D}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(radome.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(radome.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          {/* Structural Steel Tower Pedestal */}
          <mesh position={[0, -2.0, 0]} material={materials.structuralStilts}>
            <cylinderGeometry args={[0.9, 1.4, 4.0, 8]} />
          </mesh>

          {/* Spherical Hydrophobic Polar Radome */}
          <mesh position={[0, 0.4, 0]} material={materials.radomeCover} castShadow>
            <sphereGeometry args={[2.1, 32, 24]} />
          </mesh>

          {/* Aviation Warning Beacon at Top */}
          <mesh ref={beaconRef} position={[0, 2.6, 0]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>

          {(selectedAssetId === radome.assetId || hoveredAssetId === radome.assetId) && (
            <mesh position={[0, -4.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.5, 2.9, 32]} />
              <meshBasicMaterial color={POLAR_PALETTE.statusCyan} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          )}

          {hoveredAssetId === radome.assetId && selectedAssetId !== radome.assetId && (
            <Html position={[0, 3.2, 0]} center distanceFactor={14}>
              <div className="bg-slate-900/95 text-slate-100 border border-cyan-500/60 px-3 py-2 rounded-xl shadow-2xl backdrop-blur-md whitespace-nowrap text-xs pointer-events-none space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-bold">{radome.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  SNR: {radome.readings?.signalSnr?.value} dB | Uplink: {radome.readings?.uplinkThroughput?.value} Mbps | Latency: {radome.readings?.latency?.value} ms
                </div>
              </div>
            </Html>
          )}
        </group>
      )}

      {/* Automatic Weather Station (AWS-MAI-001) */}
      {aws && (
        <group
          position={aws.position3D}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(aws.assetId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(aws.assetId);
          }}
          onPointerOut={() => onHover(null)}
        >
          {/* Weather Mast Guyed Lattice Pole */}
          <mesh position={[0, 1.5, 0]} material={materials.structuralStilts}>
            <cylinderGeometry args={[0.06, 0.08, 3.2, 8]} />
          </mesh>

          {/* Meteorological Data Logger Shield Box */}
          <mesh position={[0, 1.0, 0.2]} material={materials.radomeCover}>
            <boxGeometry args={[0.4, 0.5, 0.3]} />
          </mesh>

          {/* Rotating Anemometer Assembly */}
          <group position={[0, 3.1, 0]} ref={anemometerRef}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            {/* 3 Cups */}
            {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
              <group key={idx} rotation={[0, angle, 0]}>
                <mesh position={[0.2, 0, 0]}>
                  <boxGeometry args={[0.4, 0.02, 0.02]} />
                  <meshStandardMaterial color="#64748b" />
                </mesh>
                <mesh position={[0.4, 0, 0]}>
                  <sphereGeometry args={[0.06, 8, 8, 0, Math.PI]} />
                  <meshStandardMaterial color="#0284c7" />
                </mesh>
              </group>
            ))}
          </group>

          {(selectedAssetId === aws.assetId || hoveredAssetId === aws.assetId) && (
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.0, 1.2, 24]} />
              <meshBasicMaterial color={POLAR_PALETTE.statusCyan} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          )}
        </group>
      )}
    </group>
  );
}
