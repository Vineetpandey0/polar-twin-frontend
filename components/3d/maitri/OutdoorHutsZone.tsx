import React from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { getStatusColor } from "@/lib/3d/materials";

interface OutdoorHutsZoneProps {
  assets: Record<string, any>;
  selectedAssetId: string | null;
  hoveredAssetId: string | null;
  onSelect: (assetId: string) => void;
  onHover: (assetId: string | null) => void;
}

export function MaitriOutdoorHutsZone({
  assets,
  selectedAssetId,
  hoveredAssetId,
  onSelect,
  onHover,
}: OutdoorHutsZoneProps) {
  const huts = [
    {
      id: "HUT-MAI-NANDADEVI",
      name: "Nandadevi Hut",
      sub: "IIG Geomagnetism Lab",
      pos: [-18.0, 1.2, -10.0] as [number, number, number],
      color: "#ef4444", // Bright Red polar hut
      tag: "IIG Magnetometers",
    },
    {
      id: "HUT-MAI-TIRUVELLA",
      name: "Tiruvella Hut",
      sub: "GSI Geology Core Lab",
      pos: [-15.0, 1.2, -12.0] as [number, number, number],
      color: "#f97316", // Bright Orange
      tag: "GSI Geology",
    },
    {
      id: "HUT-MAI-NPL",
      name: "NPL Hut",
      sub: "Atmospheric & Ionospheric",
      pos: [-12.0, 1.2, -14.0] as [number, number, number],
      color: "#eab308", // Yellow
      tag: "NPL Physics",
    },
    {
      id: "HUT-MAI-DODDABETTA",
      name: "Dodda Betta",
      sub: "Recreation & Tea/Coffee",
      pos: [-9.0, 1.2, -12.0] as [number, number, number],
      color: "#10b981", // Emerald Green
      tag: "Tea & Coffee Lounge",
    },
    {
      id: "HUT-MAI-ANNAPOORNA",
      name: "Annapoorna Hut",
      sub: "Support Module",
      pos: [-6.0, 1.2, -10.0] as [number, number, number],
      color: "#06b6d4", // Cyan
      tag: "Support Module",
    },
    {
      id: "HUT-MAI-GAURIPARBAT",
      name: "Gauri Parbat",
      sub: "Research Module",
      pos: [-3.0, 1.2, -10.0] as [number, number, number],
      color: "#8b5cf6", // Purple
      tag: "Research Module",
    },
    {
      id: "HUT-MAI-GIRNAR",
      name: "Girnar Hut",
      sub: "Support Module",
      pos: [0.0, 1.2, -10.0] as [number, number, number],
      color: "#ec4899", // Pink
      tag: "Support Module",
    },
  ];

  return (
    <group name="maitri-outdoor-scientific-huts">
      {huts.map((hut) => {
        const asset = assets[hut.id] || { position3D: hut.pos, name: hut.name };
        const isSelected = selectedAssetId === hut.id;
        const isHovered = hoveredAssetId === hut.id;
        const statusColor = getStatusColor(asset.operationalStatus || "RUNNING", asset.healthScore || 0.98);

        const hutMaterial = new THREE.MeshStandardMaterial({
          color: hut.color,
          roughness: 0.4,
          metalness: 0.3,
        });

        return (
          <group
            key={hut.id}
            position={asset.position3D || hut.pos}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(hut.id);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover(hut.id);
            }}
            onPointerOut={() => onHover(null)}
          >
            {/* Skids / Base Runners */}
            <mesh position={[-0.8, -0.6, 0]}>
              <boxGeometry args={[0.15, 0.15, 3.2]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            <mesh position={[0.8, -0.6, 0]}>
              <boxGeometry args={[0.15, 0.15, 3.2]} />
              <meshStandardMaterial color="#334155" />
            </mesh>

            {/* Prefabricated Insulated Box Hut Body */}
            <mesh position={[0, 0.3, 0]} material={hutMaterial} castShadow receiveShadow>
              <boxGeometry args={[2.2, 1.6, 3.0]} />
            </mesh>

            {/* Weatherproof Roof Pitch */}
            <mesh position={[0, 1.15, 0]}>
              <boxGeometry args={[2.3, 0.1, 3.1]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>

            {/* Entrance Door */}
            <mesh position={[0, 0.2, 1.51]}>
              <boxGeometry args={[0.7, 1.3, 0.04]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>

            {/* Window */}
            <mesh position={[0.8, 0.4, 1.51]}>
              <boxGeometry args={[0.4, 0.4, 0.04]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.1} />
            </mesh>

            {/* Antenna / Exhaust Pipe on Roof */}
            <mesh position={[-0.6, 1.4, -0.8]}>
              <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
              <meshStandardMaterial color="#cbd5e1" />
            </mesh>

            {/* Glow Selection Ring */}
            {(isSelected || isHovered) && (
              <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.8, 2.1, 24]} />
                <meshBasicMaterial color={statusColor} side={THREE.DoubleSide} transparent opacity={0.8} />
              </mesh>
            )}

            {/* 3D Label */}
            {isHovered && (
              <Html position={[0, 1.8, 0]} center distanceFactor={14}>
                <div
                  className="px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-lg border whitespace-nowrap"
                  style={{
                    backgroundColor: `${hut.color}22`,
                    borderColor: hut.color,
                    color: "#f8fafc",
                  }}
                >
                  {hut.name} ({hut.tag})
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
