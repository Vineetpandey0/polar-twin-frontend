import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface WeatherLayerProps {
  windSpeed?: number;
  active: boolean;
}

export function WeatherLayer({ windSpeed = 28.5, active }: WeatherLayerProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = 600;
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;

      vel[i * 3] = -(windSpeed / 12) + (Math.random() - 0.5) * 0.4;
      vel[i * 3 + 1] = -0.05 - Math.random() * 0.1;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }

    return { positions: pos, velocities: vel };
  }, [windSpeed]);

  useFrame(() => {
    if (pointsRef.current && active) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        let x = posAttr.getX(i) + velocities[i * 3];
        let y = posAttr.getY(i) + velocities[i * 3 + 1];
        let z = posAttr.getZ(i) + velocities[i * 3 + 2];

        if (x < -40) x = 40;
        if (y < 0.2) y = 20;

        posAttr.setXYZ(i, x, y, z);
      }
      posAttr.needsUpdate = true;
    }
  });

  if (!active) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.25}
        color="#e0f2fe"
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
