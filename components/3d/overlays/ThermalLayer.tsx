import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface ThermalLayerProps {
  stationId: "maitri" | "bharati";
  active: boolean;
}

export function ThermalLayer({ stationId, active }: ThermalLayerProps) {
  const pulseRef = useRef<THREE.Group>(null);
  const isMaitri = stationId === "maitri";

  // Hydronic Waste Heat Recovery Loop Path
  // From Genset Coolant Jacket Exchanger -> Main Station Heating Matrix
  const hydronicStart = isMaitri
    ? new THREE.Vector3(-14.5, 1.2, 0.5)
    : new THREE.Vector3(-12.0, 1.6, 2.5);

  const hydronicEnd = isMaitri
    ? new THREE.Vector3(0.0, 1.8, 0.0)
    : new THREE.Vector3(0.0, 2.8, 0.0);

  useFrame(() => {
    if (pulseRef.current && active) {
      pulseRef.current.children.forEach((child, i) => {
        const t = (Date.now() * 0.0015 + i * 0.25) % 1.0;
        child.position.lerpVectors(hydronicStart, hydronicEnd, t);
      });
    }
  });

  if (!active) return null;

  const hydronicGeom = new THREE.BufferGeometry().setFromPoints([hydronicStart, hydronicEnd]);

  return (
    <group name="thermal-heatmap-visualization-layer">
      {/* 1. Main Habitat Living Pods (Warm Zone +21°C) */}
      <mesh position={[0, isMaitri ? 1.8 : 2.8, 0]}>
        <boxGeometry
          args={[isMaitri ? 18.0 : 19.0, isMaitri ? 2.8 : 3.8, isMaitri ? 6.0 : 10.8]}
        />
        <meshBasicMaterial color="#eab308" transparent opacity={0.3} />
      </mesh>

      {/* 2. Genset Engines & Exhaust Core (High Heat Red/Orange +80°C to +340°C) */}
      <mesh position={[isMaitri ? -14.5 : -12.0, 1.6, isMaitri ? 0.5 : 2.5]}>
        <boxGeometry
          args={[isMaitri ? 5.2 : 4.8, 2.6, isMaitri ? 10.5 : 9.5]}
        />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.45} />
      </mesh>

      {/* 3. Fuel Storage (Sub-Zero Cold Blue -15°C) */}
      <mesh position={[isMaitri ? 14.0 : 16.0, 1.8, isMaitri ? 4.0 : 6.0]}>
        <boxGeometry
          args={[isMaitri ? 7.8 : 6.5, 3.2, isMaitri ? 7.2 : 5.0]}
        />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.35} />
      </mesh>

      {/* 4. Active Hydronic Waste Heat Recovery Transfer Pipeline */}
      <primitive
        object={
          new THREE.Line(
            hydronicGeom,
            new THREE.LineBasicMaterial({
              color: "#f97316",
              linewidth: 3,
              transparent: true,
              opacity: 0.9,
            })
          )
        }
      />

      {/* Flowing Hot Hydronic Fluid Pulses */}
      <group ref={pulseRef}>
        {[0, 1, 2, 3].map((idx) => (
          <mesh key={idx} position={[0, 0, 0]}>
            <sphereGeometry args={[0.24, 12, 12]} />
            <meshBasicMaterial color="#ffedd5" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
