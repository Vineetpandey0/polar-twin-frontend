import React, { useMemo } from "react";
import * as THREE from "three";
import { materials } from "./materials";

interface TerrainProps {
  stationId: "maitri" | "bharati";
}

export function PolarTerrain({ stationId }: TerrainProps) {
  const isMaitri = stationId === "maitri";

  // Generate procedural heightmap variations
  const { geometry, rockPositions } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(120, 120, 64, 64);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const rocks: [number, number, number, number][] = [];

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      let y = 0;
      if (isMaitri) {
        // Schirmacher Oasis: Rocky rolling hills and lower lake basin at z < -10
        const distFromLake = Math.sqrt(x * x + (z + 16) * (z + 16));
        if (distFromLake < 14) {
          // Lake basin depression
          y = -1.2 + Math.sin(x * 0.4) * 0.2;
        } else {
          // Surrounding rocky moraine terrain
          y = Math.sin(x * 0.08) * 1.5 + Math.cos(z * 0.06) * 1.2 + Math.sin(x * 0.2 + z * 0.2) * 0.4;
          // Flatten station core area
          if (Math.abs(x) < 18 && Math.abs(z) < 12) {
            y = 0;
          }
        }
      } else {
        // Bharati: Larsemann Hills coastal promontory sloping toward Prydz Bay at z < -12
        if (z < -14) {
          y = -1.8 + Math.sin(x * 0.1) * 0.3; // Coastal sea ice level
        } else {
          // Elevated rocky headland
          const slope = (z + 14) * 0.12;
          y = slope + Math.sin(x * 0.12) * 1.8 + Math.cos(z * 0.08) * 0.8;
          // Flatten main building and helipad pad
          if (Math.abs(x) < 20 && Math.abs(z) < 14) {
            y = 0;
          }
        }
      }

      pos.setY(i, y);
    }

    geo.computeVertexNormals();

    // Procedural Rock Outcrops
    const seedCount = isMaitri ? 35 : 45;
    for (let r = 0; r < seedCount; r++) {
      const rx = (Math.random() - 0.5) * 90;
      const rz = (Math.random() - 0.5) * 90;
      if (Math.abs(rx) > 18 || Math.abs(rz) > 14) {
        const rScale = 0.6 + Math.random() * 1.8;
        const ry = (isMaitri && rz < -10) ? -0.5 : 0.2;
        rocks.push([rx, ry, rz, rScale]);
      }
    }

    return { geometry: geo, rockPositions: rocks };
  }, [isMaitri]);

  return (
    <group name="polar-terrain-environment">
      {/* Main Ground Mesh */}
      <mesh geometry={geometry} material={materials.snowTerrain} receiveShadow />

      {/* Maitri: Lake Priyadarshini Frozen Ice Sheet */}
      {isMaitri && (
        <mesh position={[0, -0.6, -16]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[14, 32]} />
          <primitive object={materials.lakeIce} attach="material" />
        </mesh>
      )}

      {/* Bharati: Prydz Bay Coastal Sea Water & Ice Shelf */}
      {!isMaitri && (
        <mesh position={[0, -1.2, -32]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[120, 36]} />
          <primitive object={materials.seaWater} attach="material" />
        </mesh>
      )}

      {/* Rock Outcrops */}
      {rockPositions.map(([rx, ry, rz, s], idx) => (
        <mesh key={idx} position={[rx, ry, rz]} scale={[s * 1.2, s * 0.8, s]} material={materials.rockMoraine} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.2, 1]} />
        </mesh>
      ))}

      {/* Vehicle tracks & station perimeter pathway */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[12, 18, 32]} />
        <meshStandardMaterial color="#c5d3e0" roughness={0.9} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
