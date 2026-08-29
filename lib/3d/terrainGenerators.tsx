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
    const geo = new THREE.PlaneGeometry(140, 140, 64, 64);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const rocks: [number, number, number, number][] = [];

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      let y = 0;
      if (isMaitri) {
        // Lake Priyadarshini Depression: North-East at (x=26, z=-28)
        const distFromLake = Math.sqrt((x - 26) * (x - 26) + (z + 28) * (z + 28));
        if (distFromLake < 16) {
          // Lake basin depression
          y = -1.5 + Math.sin(x * 0.3) * 0.15;
        } else {
          // Surrounding rocky moraine terrain
          y = Math.sin(x * 0.07) * 1.5 + Math.cos(z * 0.05) * 1.2 + Math.sin(x * 0.15 + z * 0.15) * 0.4;
          // Flatten station core area & runway/vehicle tracks
          if (Math.abs(x) < 24 && Math.abs(z) < 24) {
            y = 0;
          }
        }
      } else {
        // Bharati: Larsemann Hills coastal promontory sloping toward Prydz Bay at z < -14
        if (z < -16) {
          y = -1.8 + Math.sin(x * 0.1) * 0.3; // Coastal sea ice level
        } else {
          // Elevated rocky headland
          const slope = (z + 16) * 0.12;
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
    const seedCount = isMaitri ? 40 : 45;
    for (let r = 0; r < seedCount; r++) {
      const rx = (Math.random() - 0.5) * 110;
      const rz = (Math.random() - 0.5) * 110;
      // Do not spawn rocks inside station core or inside Lake Priyadarshini
      const distFromLake = Math.sqrt((rx - 26) * (rx - 26) + (rz + 28) * (rz + 28));
      if ((Math.abs(rx) > 24 || Math.abs(rz) > 24) && distFromLake > 18) {
        const rScale = 0.6 + Math.random() * 1.8;
        rocks.push([rx, 0.2, rz, rScale]);
      }
    }

    return { geometry: geo, rockPositions: rocks };
  }, [isMaitri]);

  return (
    <group name="polar-terrain-environment">
      {/* Main Ground Mesh */}
      <mesh geometry={geometry} material={materials.snowTerrain} receiveShadow />

      {/* Maitri: Lake Priyadarshini Frozen Ice & Meltwater Sheet at (26, -0.6, -28) */}
      {isMaitri && (
        <group position={[26, -0.6, -28]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[16, 32]} />
            <primitive object={materials.lakeIce} attach="material" />
          </mesh>
          {/* Meltwater Shore Edge Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
            <ringGeometry args={[15.5, 17.5, 32]} />
            <primitive object={materials.seaWater} attach="material" />
          </mesh>
        </group>
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
        <ringGeometry args={[14, 22, 32]} />
        <meshStandardMaterial color="#c5d3e0" roughness={0.9} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
