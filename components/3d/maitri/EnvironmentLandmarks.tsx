import React from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";

const rockMaterial = new THREE.MeshStandardMaterial({
  color: "#292524", // Dark Grey/Brown Rock
  roughness: 0.9,
  metalness: 0.1,
});

const iceWallMaterial = new THREE.MeshStandardMaterial({
  color: "#e0f2fe", // Continental Glacier Ice
  roughness: 0.2,
  metalness: 0.1,
  transparent: true,
  opacity: 0.85,
});

export function MaitriEnvironmentLandmarks() {
  const [hoveredLandmark, setHoveredLandmark] = React.useState<string | null>(null);

  return (
    <group name="maitri-environment-landmarks-and-terrain">

      {/* 2. SHIVLINGA NUNATAK (Exposed Rock Outcrop Landmark near approach route) */}
      <group
        position={[28.0, 0, 12.0]}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredLandmark("shivlinga"); }}
        onPointerOut={() => setHoveredLandmark(null)}
      >
        {/* Jagged Rock Cone */}
        <mesh position={[0, 3.5, 0]} material={rockMaterial} castShadow receiveShadow>
          <coneGeometry args={[4.2, 7.0, 7]} />
        </mesh>
        <mesh position={[-1.2, 1.8, 1.2]} material={rockMaterial} castShadow>
          <coneGeometry args={[2.5, 3.6, 6]} />
        </mesh>
        {/* 3D Label */}
        {hoveredLandmark === "shivlinga" && (
          <Html position={[0, 7.5, 0]} center distanceFactor={22}>
            <div className="bg-stone-900/90 text-amber-300 border border-amber-500/50 px-2.5 py-1 rounded text-[11px] font-bold font-mono shadow-xl whitespace-nowrap">
              "Shivlinga" Nunatak Landmark
            </div>
          </Html>
        )}
      </group>

      {/* 3. ICE CAVES 3 KM DISTANCE POINTER */}
      <group
        position={[-32.0, 0, -22.0]}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredLandmark("icecaves"); }}
        onPointerOut={() => setHoveredLandmark(null)}
      >
        <mesh position={[0, 2.0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 4.0, 8]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>
        {/* Glacier Arch Representation */}
        <mesh position={[0, 1.5, 0]} material={iceWallMaterial}>
          <torusGeometry args={[2.2, 0.8, 12, 16, Math.PI]} />
        </mesh>
        {hoveredLandmark === "icecaves" && (
          <Html position={[0, 4.5, 0]} center distanceFactor={22}>
            <div className="bg-sky-950/90 text-sky-300 border border-sky-500/50 px-2.5 py-1 rounded text-[11px] font-bold font-mono shadow-xl whitespace-nowrap">
              Glacier Ice Caves (~3 km Walk)
            </div>
          </Html>
        )}
      </group>

      {/* 4. ROCKY BEDROCK BOULDERS CLUSTER (Schirmacher Oasis Terrain Details) */}
      {[
        [-15, 0.4, 18],
        [15, 0.5, 20],
        [-25, 0.6, 4],
        [22, 0.5, -8],
        [-8, 0.3, 22],
      ].map((pos, idx) => (
        <mesh key={`boulder-${idx}`} position={pos as [number, number, number]} material={rockMaterial} castShadow>
          <dodecahedronGeometry args={[0.8 + (idx % 3) * 0.4, 1]} />
        </mesh>
      ))}
    </group>
  );
}
