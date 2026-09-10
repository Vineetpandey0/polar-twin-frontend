"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import {
  SatelliteLiveTelemetry,
  GROUND_STATIONS,
  latLonToVector3,
} from "@/lib/satcom/satelliteEngine";

interface PolarGlobeCanvasProps {
  telemetries: SatelliteLiveTelemetry[];
  selectedSatId: number | null;
  onSelectSat: (id: number | null) => void;
  showOrbits: boolean;
  showBeams: boolean;
  showGraticules: boolean;
  nasaGibsActive: boolean;
  gibsMetadata: any;
}

// Fixed Station Marker Component on 3D Globe
function GroundStationMarker({
  station,
  radius = 10,
}: {
  station: (typeof GROUND_STATIONS)[keyof typeof GROUND_STATIONS];
  radius: number;
}) {
  const markerPos = useMemo(
    () => latLonToVector3(station.lat, station.lon, radius + 0.08),
    [station, radius]
  );
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      const t = (state.clock.getElapsedTime() * 0.8) % 1.0;
      const s = 1.0 + t * 2.0;
      ringRef.current.scale.set(s, s, s);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = (1.0 - t) * 0.8;
    }
  });

  return (
    <group position={markerPos}>
      {/* Central Solid Beacon */}
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial
          color={station.color}
          emissive={station.color}
          emissiveIntensity={2}
        />
      </mesh>

      {/* Pulsing Radar Range Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.4, 32]} />
        <meshBasicMaterial
          color={station.color}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Horizon Visibility Coverage Circle (~1500km line of sight cone) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.8, 1.88, 48]} />
        <meshBasicMaterial
          color={station.color}
          side={THREE.DoubleSide}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Floating Station Tag */}
      <Html position={[0, 0.6, 0]} center distanceFactor={18}>
        <div
          className="px-2 py-0.5 rounded-sm border font-mono text-[10px] font-bold whitespace-nowrap shadow-lg pointer-events-none"
          style={{
            backgroundColor: "#090D14",
            borderColor: station.color,
            color: station.color,
          }}
        >
          {station.code} // {station.name.split(" ")[0].toUpperCase()}
        </div>
      </Html>
    </group>
  );
}

// Satellite 3D Node & Signal Beams
function SatelliteObject({
  telemetry,
  isSelected,
  onSelect,
  showOrbits,
  showBeams,
  radius = 10,
}: {
  telemetry: SatelliteLiveTelemetry;
  isSelected: boolean;
  onSelect: () => void;
  showOrbits: boolean;
  showBeams: boolean;
  radius: number;
}) {
  const satRef = useRef<THREE.Group>(null);
  const { metadata, globePosition, subSatGlobePos, orbitPath3D, lookAngles } = telemetry;

  // Station line-of-sight status
  const inMaitriView = lookAngles.maitri.isInView;
  const inBharatiView = lookAngles.bharati.isInView;
  const isDownlinking = inMaitriView || inBharatiView;

  const satColor = isDownlinking
    ? inBharatiView
      ? "#38BDF8"
      : "#FBBF24"
    : isSelected
    ? "#38BDF8"
    : "#94A3B8";

  // Create smooth 3D orbit curve
  const orbitCurveGeom = useMemo(() => {
    if (orbitPath3D.length < 2) return null;
    const points = orbitPath3D.map((p) => new THREE.Vector3(...p));
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [orbitPath3D]);

  // Active pass downlink beam geometries to station
  const maitriBeamGeom = useMemo(() => {
    if (!inMaitriView) return null;
    const stPos = latLonToVector3(GROUND_STATIONS.maitri.lat, GROUND_STATIONS.maitri.lon, radius + 0.1);
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...globePosition),
      new THREE.Vector3(...stPos),
    ]);
  }, [inMaitriView, globePosition, radius]);

  const bharatiBeamGeom = useMemo(() => {
    if (!inBharatiView) return null;
    const stPos = latLonToVector3(GROUND_STATIONS.bharati.lat, GROUND_STATIONS.bharati.lon, radius + 0.1);
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...globePosition),
      new THREE.Vector3(...stPos),
    ]);
  }, [inBharatiView, globePosition, radius]);

  return (
    <group>
      {/* 1. 3D Orbital Trajectory Arc */}
      {showOrbits && orbitCurveGeom && (
        <primitive
          object={
            new THREE.Line(
              orbitCurveGeom,
              new THREE.LineBasicMaterial({
                color: isSelected ? "#38BDF8" : "#475569",
                linewidth: isSelected ? 2 : 1,
                transparent: true,
                opacity: isSelected ? 0.9 : 0.35,
              })
            )
          }
        />
      )}

      {/* 2. Active Signal Downlink Cones/Lines to Station */}
      {showBeams && maitriBeamGeom && (
        <primitive
          object={
            new THREE.Line(
              maitriBeamGeom,
              new THREE.LineBasicMaterial({
                color: "#FBBF24",
                linewidth: 2,
                transparent: true,
                opacity: 0.85,
              })
            )
          }
        />
      )}

      {showBeams && bharatiBeamGeom && (
        <primitive
          object={
            new THREE.Line(
              bharatiBeamGeom,
              new THREE.LineBasicMaterial({
                color: "#38BDF8",
                linewidth: 3,
                transparent: true,
                opacity: 0.95,
              })
            )
          }
        />
      )}

      {/* 3. Sub-Satellite Nadir Ground Drop Line */}
      {isSelected && (
        <primitive
          object={
            new THREE.Line(
              new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(...globePosition),
                new THREE.Vector3(...subSatGlobePos),
              ]),
              new THREE.LineDashedMaterial({
                color: satColor,
                dashSize: 0.2,
                gapSize: 0.1,
                transparent: true,
                opacity: 0.7,
              })
            )
          }
        />
      )}

      {/* 4. Satellite 3D Bus & Solar Panels at Globe Position */}
      <group
        ref={satRef}
        position={globePosition}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="cursor-pointer"
      >
        {/* Main Body Bus */}
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.3, 0.4]} />
          <meshStandardMaterial
            color="#E2EAF4"
            metalness={0.8}
            roughness={0.2}
            emissive={satColor}
            emissiveIntensity={isDownlinking ? 0.8 : 0.2}
          />
        </mesh>

        {/* Solar Panel Wings */}
        <mesh position={[0.5, 0, 0]}>
          <boxGeometry args={[0.6, 0.2, 0.02]} />
          <meshStandardMaterial color="#1E3A8A" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-0.5, 0, 0]}>
          <boxGeometry args={[0.6, 0.2, 0.02]} />
          <meshStandardMaterial color="#1E3A8A" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Pulse beacon */}
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color={satColor} />
        </mesh>

        {/* Floating Satellite Name Tag */}
        <Html position={[0, 0.7, 0]} center distanceFactor={22}>
          <div
            onClick={onSelect}
            className={`px-1.5 py-0.5 rounded-sm text-[9px] font-mono whitespace-nowrap cursor-pointer transition-all border ${
              isSelected
                ? "bg-[#090D14] border-[#38BDF8] text-[#38BDF8] font-bold shadow-md"
                : isDownlinking
                ? "bg-[#090D14]/90 border-[#34D399] text-[#34D399]"
                : "bg-[#090D14]/80 border-[#1E293B] text-[#8CA1B6] hover:text-[#E2EAF4]"
            }`}
          >
            {metadata.name.split(" ")[0]} [{telemetry.altKm}km]
            {isDownlinking && <span className="ml-1 text-[#34D399]">● PASS</span>}
          </div>
        </Html>
      </group>
    </group>
  );
}

// Procedural Antarctic Graticules & Polar Circle
function PolarGraticules({ radius = 10 }: { radius: number }) {
  const rings = useMemo(() => {
    const lines: THREE.Vector3[][] = [];

    // Antarctic Circle (66.5° S)
    const antarcticPoints: THREE.Vector3[] = [];
    for (let lon = -180; lon <= 180; lon += 5) {
      antarcticPoints.push(new THREE.Vector3(...latLonToVector3(-66.5, lon, radius + 0.02)));
    }
    lines.push(antarcticPoints);

    // 70° S Parallel (Maitri & Bharati operational belt)
    const p70Points: THREE.Vector3[] = [];
    for (let lon = -180; lon <= 180; lon += 5) {
      p70Points.push(new THREE.Vector3(...latLonToVector3(-70.0, lon, radius + 0.02)));
    }
    lines.push(p70Points);

    // 80° S Parallel
    const p80Points: THREE.Vector3[] = [];
    for (let lon = -180; lon <= 180; lon += 5) {
      p80Points.push(new THREE.Vector3(...latLonToVector3(-80.0, lon, radius + 0.02)));
    }
    lines.push(p80Points);

    // Meridians radiating from South Pole to Equator every 45 degrees
    for (let lon = -180; lon < 180; lon += 45) {
      const meridian: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 0; lat += 5) {
        meridian.push(new THREE.Vector3(...latLonToVector3(lat, lon, radius + 0.02)));
      }
      lines.push(meridian);
    }

    return lines;
  }, [radius]);

  return (
    <group name="polar-graticules">
      {rings.map((pts, idx) => {
        const geom = new THREE.BufferGeometry().setFromPoints(pts);
        return (
          <primitive
            key={idx}
            object={
              new THREE.Line(
                geom,
                new THREE.LineBasicMaterial({
                  color: "#334155",
                  linewidth: 1,
                  transparent: true,
                  opacity: 0.45,
                })
              )
            }
          />
        );
      })}

      {/* South Pole Crosshair Reticle at (lat: -90°) */}
      <group position={[0, -radius - 0.04, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.28, 24]} />
          <meshBasicMaterial color="#38BDF8" side={THREE.DoubleSide} transparent opacity={0.7} />
        </mesh>
      </group>
    </group>
  );
}

// 3D Polar Earth Sphere
function PolarEarth({
  radius = 10,
  nasaGibsActive = false,
}: {
  radius: number;
  nasaGibsActive: boolean;
}) {
  // Generate high-contrast polar continents & ice shelf canvas texture
  const earthTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Deep Ocean (#060B14)
    ctx.fillStyle = "#060B14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Global Latitude Grid
    ctx.strokeStyle = "#0F1A2A";
    ctx.lineWidth = 1;
    for (let y = 0; y <= canvas.height; y += canvas.height / 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    for (let x = 0; x <= canvas.width; x += canvas.width / 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Continents silhouette (Dark Slate #101B2B)
    ctx.fillStyle = "#101B2B";

    // Africa
    ctx.beginPath();
    ctx.ellipse(1080, 520, 140, 180, 0, 0, Math.PI * 2);
    ctx.fill();

    // India / Eurasia
    ctx.beginPath();
    ctx.ellipse(1460, 360, 180, 140, 0, 0, Math.PI * 2);
    ctx.fill();
    // Indian Subcontinent V-shape
    ctx.beginPath();
    ctx.moveTo(1440, 380);
    ctx.lineTo(1470, 520);
    ctx.lineTo(1510, 410);
    ctx.closePath();
    ctx.fill();

    // Australia
    ctx.beginPath();
    ctx.ellipse(1740, 680, 100, 70, 0, 0, Math.PI * 2);
    ctx.fill();

    // South America
    ctx.beginPath();
    ctx.ellipse(720, 640, 90, 160, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // High-Albedo Antarctic Ice Sheet & Ice Shelves (Lat < -65° -> Bottom strip of equirectangular map)
    // Antarctic ice shelf color: Pristine Glacial Ice (#E2EAF4) with faint blue moraines
    const iceGrad = ctx.createLinearGradient(0, canvas.height - 200, 0, canvas.height);
    iceGrad.addColorStop(0, "#2A3D54");
    iceGrad.addColorStop(0.3, "#8CA1B6");
    iceGrad.addColorStop(0.6, "#CBD5E1");
    iceGrad.addColorStop(1.0, "#E2EAF4");

    ctx.fillStyle = iceGrad;
    ctx.fillRect(0, canvas.height - 180, canvas.width, 180);

    // Dronning Maud Land (Maitri sector: ~12°E -> ~1090px on canvas)
    ctx.fillStyle = "#F1F5F9";
    ctx.beginPath();
    ctx.ellipse(1090, canvas.height - 100, 180, 70, 0, 0, Math.PI * 2);
    ctx.fill();

    // Larsemann Hills / Prydz Bay (Bharati sector: ~76°E -> ~1450px on canvas)
    ctx.beginPath();
    ctx.ellipse(1450, canvas.height - 110, 160, 65, 0, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  return (
    <group>
      {/* Base Earth Sphere */}
      <mesh receiveShadow>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture || undefined}
          roughness={0.7}
          metalness={0.2}
          color={nasaGibsActive ? "#CBD5E1" : "#E2EAF4"}
        />
      </mesh>

      {/* Atmospheric Rim Glow */}
      <mesh>
        <sphereGeometry args={[radius + 0.18, 48, 48]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

export default function PolarGlobeCanvas({
  telemetries,
  selectedSatId,
  onSelectSat,
  showOrbits,
  showBeams,
  showGraticules,
  nasaGibsActive,
  gibsMetadata,
}: PolarGlobeCanvasProps) {
  return (
    <div className="w-full h-full relative bg-[#070A0F] rounded-sm overflow-hidden border border-[#1E293B]">
      <Canvas
        camera={{ position: [0, -32, 20], fov: 42 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#070A0F"]} />

        {/* Crisp Low-Angle Antarctic Sunlight */}
        <ambientLight intensity={0.4} color="#E2EAF4" />
        <directionalLight position={[30, -20, 40]} intensity={1.5} color="#FFFFFF" />
        <directionalLight position={[-40, -30, -30]} intensity={0.6} color="#38BDF8" />

        {/* Polar Earth Body */}
        <PolarEarth radius={10} nasaGibsActive={nasaGibsActive} />

        {/* Antarctic Graticule Grid */}
        {showGraticules && <PolarGraticules radius={10} />}

        {/* Fixed Station Markers */}
        <GroundStationMarker station={GROUND_STATIONS.maitri} radius={10} />
        <GroundStationMarker station={GROUND_STATIONS.bharati} radius={10} />

        {/* Satellites & Orbital Paths */}
        {telemetries.map((telemetry) => (
          <SatelliteObject
            key={telemetry.metadata.id}
            telemetry={telemetry}
            isSelected={selectedSatId === telemetry.metadata.id}
            onSelect={() => onSelectSat(telemetry.metadata.id)}
            showOrbits={showOrbits}
            showBeams={showBeams}
            radius={10}
          />
        ))}

        {/* Orbit Controls (default centered on South Pole) */}
        <OrbitControls
          enablePan={false}
          minDistance={14}
          maxDistance={55}
          dampingFactor={0.08}
          rotateSpeed={0.8}
        />
      </Canvas>

      {/* Layer Badge in Bottom Left */}
      <div className="absolute bottom-3 left-3 bg-[#090D14]/90 border border-[#1E293B] px-2.5 py-1.5 rounded-sm text-[11px] font-mono text-[#8CA1B6] space-y-0.5 pointer-events-none backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
          <span className="font-semibold text-[#E2EAF4]">3D POLAR PROJECTION</span>
        </div>
        <div className="text-[10px] text-[#5B7086]">
          {gibsMetadata?.freshnessLabel || "NASA GIBS MODIS TERRA // PASS: 2026-09-08 18:30 UTC // LATENCY: 18H"}
        </div>
      </div>
    </div>
  );
}
