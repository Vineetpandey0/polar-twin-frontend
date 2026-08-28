import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface CommunicationsLayerProps {
  stationId: "maitri" | "bharati";
  active: boolean;
}

export function CommunicationsLayer({ stationId, active }: CommunicationsLayerProps) {
  const beamRef = useRef<THREE.Mesh>(null);
  const isMaitri = stationId === "maitri";

  useFrame(() => {
    if (beamRef.current && active) {
      beamRef.current.rotation.y += 0.02;
    }
  });

  if (!active) return null;

  const radomePos: [number, number, number] = isMaitri ? [12.0, 4.2, -7.0] : [12.5, 4.5, -6.5];

  return (
    <group name="communications-layer">
      {/* Uplink Telemetry Cone Vector to Satellite Orbit */}
      <mesh ref={beamRef} position={[radomePos[0], radomePos[1] + 12, radomePos[2]]}>
        <cylinderGeometry args={[4.5, 0.4, 24, 16, 1, true]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} side={THREE.DoubleSide} wireframe />
      </mesh>

      {/* Local RF Microwave Link between Radome and AWS Station */}
      <mesh position={[isMaitri ? 10.0 : 10.0, 3.0, -9.5]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 8.0, 8]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}
