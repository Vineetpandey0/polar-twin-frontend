"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export type CameraPreset =
  | "ORBIT"
  | "TOP_DOWN"
  | "ISOMETRIC"
  | "GROUND"
  | "POWER_PLANT"
  | "WATER_INTAKE"
  | "COMMS_RADOME"
  | "HELIPAD";

interface CameraControllerProps {
  preset: CameraPreset;
  targetPosition?: [number, number, number] | null;
  autoRotate?: boolean;
}

export function CameraController({
  preset,
  targetPosition,
  autoRotate = false,
}: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Preset destination vectors
  const presetConfigs: Record<
    CameraPreset,
    { pos: [number, number, number]; lookAt: [number, number, number] }
  > = {
    ORBIT: { pos: [24, 18, 28], lookAt: [0, 1, 0] },
    TOP_DOWN: { pos: [0, 52, 0.1], lookAt: [0, 0, 0] },
    ISOMETRIC: { pos: [30, 24, 30], lookAt: [0, 1, 0] },
    GROUND: { pos: [0, 2.2, 22], lookAt: [0, 2.0, 0] },
    POWER_PLANT: { pos: [-20, 8, 4], lookAt: [-14.5, 1.2, 0.5] },
    WATER_INTAKE: { pos: [-10, 6, -20], lookAt: [-5.5, 0.8, -16.0] },
    COMMS_RADOME: { pos: [18, 9, -4], lookAt: [12.0, 4.2, -7.0] },
    HELIPAD: { pos: [8, 7, 22], lookAt: [0, 0.6, 15.0] },
  };

  useEffect(() => {
    if (controlsRef.current) {
      if (targetPosition) {
        // Focus camera smoothly on selected asset
        controlsRef.current.target.set(
          targetPosition[0],
          targetPosition[1],
          targetPosition[2]
        );
        camera.position.set(
          targetPosition[0] + 8,
          targetPosition[1] + 6,
          targetPosition[2] + 10
        );
      } else {
        const config = presetConfigs[preset] || presetConfigs.ORBIT;
        controlsRef.current.target.set(...config.lookAt);
        camera.position.set(...config.pos);
      }
      controlsRef.current.update();
    }
  }, [preset, targetPosition, camera]);

  useFrame(() => {
    if (controlsRef.current && autoRotate) {
      controlsRef.current.autoRotate = true;
      controlsRef.current.autoRotateSpeed = 0.8;
      controlsRef.current.update();
    } else if (controlsRef.current) {
      controlsRef.current.autoRotate = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={4}
      maxDistance={80}
      maxPolarAngle={Math.PI / 2 - 0.05} // Prevent clipping beneath snow plane
    />
  );
}
