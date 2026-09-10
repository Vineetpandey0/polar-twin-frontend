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

  // Multi-segment 3D fluid paths
  // Segment 1: Source to Treatment
  // Segment 2: Treatment to Main Habitat
  const maitriSegments = [
    { start: new THREE.Vector3(16.0, 0.8, -24.0), end: new THREE.Vector3(10.0, 1.2, -14.0) },
    { start: new THREE.Vector3(10.0, 1.2, -14.0), end: new THREE.Vector3(0.0, 2.0, 0.0) },
  ];

  const bharatiSegments = [
    { start: new THREE.Vector3(6.0, 0.6, -20.0), end: new THREE.Vector3(3.5, 1.2, -6.5) },
    { start: new THREE.Vector3(3.5, 1.2, -6.5), end: new THREE.Vector3(0.0, 2.5, 0.0) },
    { start: new THREE.Vector3(0.0, 2.5, 0.0), end: new THREE.Vector3(6.5, 1.2, -3.5) },
  ];

  const activeSegments = isMaitri ? maitriSegments : bharatiSegments;

  useFrame(() => {
    if (pulseGroupRef.current && active) {
      pulseGroupRef.current.children.forEach((child, i) => {
        // Distribute pulses across segments
        const segIdx = i % activeSegments.length;
        const segment = activeSegments[segIdx];
        const t = (Date.now() * 0.0012 + (i / pulseGroupRef.current!.children.length)) % 1.0;
        child.position.lerpVectors(segment.start, segment.end, t);
      });
    }
  });

  if (!active) return null;

  return (
    <group name="water-flow-visualization-layer">
      {/* High-visibility Cyan Fluid Glow Lines */}
      {activeSegments.map((seg, idx) => {
        const points = [seg.start, seg.end];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <primitive
            key={idx}
            object={
              new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial({
                  color: "#06b6d4",
                  linewidth: 3,
                  transparent: true,
                  opacity: 0.9,
                })
              )
            }
          />
        );
      })}

      {/* Dynamic Flowing Fluid Particles */}
      <group ref={pulseGroupRef}>
        {[0, 1, 2, 3, 4, 5].map((idx) => (
          <mesh key={idx} position={[0, 0, 0]}>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
