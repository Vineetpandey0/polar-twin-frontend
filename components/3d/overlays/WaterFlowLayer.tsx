import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface WaterFlowLayerProps {
  stationId: "maitri" | "bharati";
  active: boolean;
}

export function WaterFlowLayer({ stationId, active }: WaterFlowLayerProps) {
  const pulseGroupRef = useRef<THREE.Group>(null);
  const isMaitri = stationId === "maitri";

  useFrame(() => {
    if (pulseGroupRef.current && active) {
      pulseGroupRef.current.children.forEach((child, i) => {
        const t = (Date.now() * 0.0015 + i * 0.25) % 1.0;
        child.position.z = isMaitri
          ? THREE.MathUtils.lerp(-16.0, 0.0, t)
          : THREE.MathUtils.lerp(-18.0, 0.0, t);
      });
    }
  });

  if (!active) return null;

  const lines = isMaitri
    ? [
        [[-6.0, 0.8, -16.0], [-5.0, 1.2, -6.0]], // Lake Pump to Treatment
        [[-5.0, 1.2, -6.0], [0.0, 1.5, 0.0]],    // Treatment to Main Building
      ]
    : [
        [[5.0, 0.6, -18.0], [3.5, 1.2, -6.5]],   // Seawater Intake to RO Plant
        [[3.5, 1.2, -6.5], [0.0, 2.2, 0.0]],     // RO Plant to Main Superstructure
      ];

  return (
    <group name="water-flow-visualization-layer">
      {/* Cyan Fluid Path Splines */}
      {lines.map((line, idx) => {
        const points = [new THREE.Vector3(...line[0]), new THREE.Vector3(...line[1])];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <primitive key={idx} object={new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({ color: "#06b6d4", linewidth: 3, transparent: true, opacity: 0.9 })
          )} />
        );
      })}

      {/* Pulsing Water Droplets */}
      <group ref={pulseGroupRef}>
        {[0, 1, 2, 3].map((idx) => (
          <mesh key={idx} position={[-5.2, 1.2, -10.0]}>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
