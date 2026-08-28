import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface PowerFlowLayerProps {
  stationId: "maitri" | "bharati";
  active: boolean;
}

export function PowerFlowLayer({ stationId, active }: PowerFlowLayerProps) {
  const pulseRef = useRef<THREE.Group>(null);
  const isMaitri = stationId === "maitri";

  useFrame(() => {
    if (pulseRef.current && active) {
      pulseRef.current.children.forEach((child, i) => {
        const offset = (Date.now() * 0.002 + i * 0.3) % 1.0;
        child.position.x = THREE.MathUtils.lerp(-12, 0, offset);
      });
    }
  });

  if (!active) return null;

  // Power distribution spline curves
  const lines = isMaitri
    ? [
        [[-14.5, 1.2, -2.5], [-11.0, 1.2, 0.0]],
        [[-14.5, 1.2, 0.5], [-11.0, 1.2, 0.0]],
        [[-11.0, 1.2, 0.0], [-8.5, 1.0, 6.0]], // to BESS
        [[-11.0, 1.2, 0.0], [0.0, 1.8, 0.0]],  // to Main Building
        [[-11.0, 1.2, 0.0], [12.0, 3.5, -7.0]], // to Comms
      ]
    : [
        [[-12.0, 1.6, -1.0], [-9.0, 1.4, 0.5]],
        [[-12.0, 1.6, 2.5], [-9.0, 1.4, 0.5]],
        [[-9.0, 1.4, 0.5], [-6.5, 1.2, 5.5]],  // to BESS
        [[-9.0, 1.4, 0.5], [0.0, 2.8, 0.0]],   // to Main Superstructure
        [[-9.0, 1.4, 0.5], [12.5, 3.8, -6.5]], // to Satcom
      ];

  return (
    <group name="power-flow-visualization-layer">
      {/* Static Glow Cable Lines */}
      {lines.map((line, idx) => {
        const points = [new THREE.Vector3(...line[0]), new THREE.Vector3(...line[1])];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <primitive key={idx} object={new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({ color: "#facc15", linewidth: 3, transparent: true, opacity: 0.85 })
          )} />
        );
      })}

      {/* Dynamic Traveling Energy Pulses */}
      <group ref={pulseRef}>
        {[0, 1, 2, 3, 4].map((idx) => (
          <mesh key={idx} position={[-10, 1.5, 0]}>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
