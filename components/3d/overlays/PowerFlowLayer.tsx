import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface PowerFlowLayerProps {
  stationId: "maitri" | "bharati";
  active: boolean;
}

export function PowerFlowLayer({ stationId, active }: PowerFlowLayerProps) {
  const pulseGroupRef = useRef<THREE.Group>(null);
  const isMaitri = stationId === "maitri";

  // Real microgrid 3D cable runs
  const maitriBranches = [
    // Gensets to Switchgear
    { start: new THREE.Vector3(-14.5, 1.2, -2.5), end: new THREE.Vector3(-11.0, 1.2, 0.0) },
    { start: new THREE.Vector3(-14.5, 1.2, 0.5), end: new THREE.Vector3(-11.0, 1.2, 0.0) },
    { start: new THREE.Vector3(-14.5, 1.2, 3.5), end: new THREE.Vector3(-11.0, 1.2, 0.0) },
    // Switchgear outward distributions
    { start: new THREE.Vector3(-11.0, 1.2, 0.0), end: new THREE.Vector3(-8.5, 1.0, 6.0) }, // to BESS
    { start: new THREE.Vector3(-11.0, 1.2, 0.0), end: new THREE.Vector3(0.0, 1.8, 0.0) },  // to Main Habitat
    { start: new THREE.Vector3(-11.0, 1.2, 0.0), end: new THREE.Vector3(10.0, 1.2, -14.0) }, // to Water Plant
    { start: new THREE.Vector3(-11.0, 1.2, 0.0), end: new THREE.Vector3(12.0, 3.5, -7.0) }, // to Satcom Radome
    { start: new THREE.Vector3(-11.0, 1.2, 0.0), end: new THREE.Vector3(10.0, 1.2, -18.0) }, // to MARA Radar
    { start: new THREE.Vector3(-11.0, 1.2, 0.0), end: new THREE.Vector3(14.0, 0.8, 6.5) }, // to Fuel Pump
  ];

  const bharatiBranches = [
    // CHP Gensets to Switchboard
    { start: new THREE.Vector3(-12.0, 1.6, -1.0), end: new THREE.Vector3(-9.0, 1.4, 0.5) },
    { start: new THREE.Vector3(-12.0, 1.6, 2.5), end: new THREE.Vector3(-9.0, 1.4, 0.5) },
    { start: new THREE.Vector3(-12.0, 1.6, 6.0), end: new THREE.Vector3(-9.0, 1.4, 0.5) },
    // Switchboard outward distributions
    { start: new THREE.Vector3(-9.0, 1.4, 0.5), end: new THREE.Vector3(-6.5, 1.2, 5.5) },  // to BESS
    { start: new THREE.Vector3(-9.0, 1.4, 0.5), end: new THREE.Vector3(0.0, 2.8, 0.0) },   // to Main Superstructure
    { start: new THREE.Vector3(-9.0, 1.4, 0.5), end: new THREE.Vector3(14.0, 4.5, -8.0) }, // to ISRO AGEOS Radomes
    { start: new THREE.Vector3(-9.0, 1.4, 0.5), end: new THREE.Vector3(3.5, 1.2, -6.5) },  // to Seawater RO Plant
    { start: new THREE.Vector3(-9.0, 1.4, 0.5), end: new THREE.Vector3(-16.0, 1.8, -14.0) }, // to IMD Weather Mast
  ];

  const activeBranches = isMaitri ? maitriBranches : bharatiBranches;

  useFrame(() => {
    if (pulseGroupRef.current && active) {
      pulseGroupRef.current.children.forEach((child, i) => {
        const branchIdx = i % activeBranches.length;
        const branch = activeBranches[branchIdx];
        const t = (Date.now() * 0.0015 + (i / pulseGroupRef.current!.children.length)) % 1.0;
        child.position.lerpVectors(branch.start, branch.end, t);
      });
    }
  });

  if (!active) return null;

  return (
    <group name="power-flow-visualization-layer">
      {/* High-visibility Amber Power Distribution Cables */}
      {activeBranches.map((branch, idx) => {
        const points = [branch.start, branch.end];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <primitive
            key={idx}
            object={
              new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial({
                  color: "#facc15",
                  linewidth: 3,
                  transparent: true,
                  opacity: 0.85,
                })
              )
            }
          />
        );
      })}

      {/* Dynamic Traveling Energy Pulse Particles */}
      <group ref={pulseGroupRef}>
        {Array.from({ length: Math.min(18, activeBranches.length * 2) }).map((_, idx) => (
          <mesh key={idx} position={[0, 0, 0]}>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
