import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { getStatusColor } from "@/lib/3d/materials";

interface ScienceInstrumentsZoneProps {
  assets: Record<string, any>;
  selectedAssetId: string | null;
  hoveredAssetId: string | null;
  onSelect: (assetId: string) => void;
  onHover: (assetId: string | null) => void;
}

export function MaitriScienceInstrumentsZone({
  assets,
  selectedAssetId,
  hoveredAssetId,
  onSelect,
  onHover,
}: ScienceInstrumentsZoneProps) {
  const balloonRef = useRef<THREE.Group>(null);
  const fieldMillVaneRef = useRef<THREE.Group>(null);

  // Animate weather balloon floating gently & field mill spinning
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (balloonRef.current) {
      balloonRef.current.position.y = 6.0 + Math.sin(t * 0.8) * 0.4;
      balloonRef.current.position.x = Math.cos(t * 0.5) * 0.3;
    }
    if (fieldMillVaneRef.current) {
      fieldMillVaneRef.current.rotation.y = t * 4.0;
    }
  });

  const instrumentsList = [
    { id: "RAD-MAI-MARA", label: "MARA 54.5MHz Radar" },
    { id: "ION-MAI-CADI", label: "CADI Ionosonde" },
    { id: "TEC-MAI-GISTM", label: "GSV-4004B TEC Receiver" },
    { id: "RIO-MAI-38", label: "38.2MHz Imaging Riometer" },
    { id: "GEC-MAI-EFIELD", label: "GEC Electric Field Mill" },
    { id: "AWS-MAI-001", label: "AWS & Radiosonde Balloon" },
    { id: "SEI-MAI-001", label: "Seismograph Bedrock Vault" },
    { id: "GPS-MAI-GEO", label: "Geodetic GPS Monument" },
    { id: "NOX-MAI-001", label: "NOx Gas Analyser Intake" },
    { id: "AER-MAI-001", label: "Aerosol Spectrometer" },
    { id: "AETH-MAI-001", label: "7-Wavelength Aethelometer" },
    { id: "ASI-MAI-001", label: "180° All-Sky Aurora Imager" },
    { id: "VLF-MAI-001", label: "VLF Radio Loop Array" },
  ];

  return (
    <group name="maitri-science-instruments-suite">
      {/* 1. MARA VHF RADAR (54.5 MHz Antenna Grid Array) */}
      {(() => {
        const asset = assets["RAD-MAI-MARA"] || { position3D: [10, 1.2, -18], name: "MARA Radar" };
        const isSelected = selectedAssetId === asset.assetId;
        const isHovered = hoveredAssetId === asset.assetId;
        const statusColor = getStatusColor(asset.operationalStatus || "RUNNING", asset.healthScore || 0.97);

        return (
          <group
            key="RAD-MAI-MARA"
            position={asset.position3D}
            onClick={(e) => { e.stopPropagation(); onSelect(asset.assetId); }}
            onPointerOver={(e) => { e.stopPropagation(); onHover(asset.assetId); }}
            onPointerOut={() => onHover(null)}
          >
            {/* Ground Grid Frame */}
            <mesh position={[0, -0.5, 0]}>
              <boxGeometry args={[6.0, 0.1, 6.0]} />
              <meshStandardMaterial color="#334155" wireframe />
            </mesh>
            {/* Dipole Masts (4x4 Grid Array) */}
            {[-2, -0.6, 0.6, 2].map((x) =>
              [-2, -0.6, 0.6, 2].map((z) => (
                <group key={`mara-${x}-${z}`} position={[x, 0, z]}>
                  <mesh>
                    <cylinderGeometry args={[0.04, 0.04, 1.4, 8]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.8} />
                  </mesh>
                  {/* Cross Dipole Arms */}
                  <mesh position={[0, 0.6, 0]}>
                    <boxGeometry args={[0.8, 0.03, 0.03]} />
                    <meshStandardMaterial color="#38bdf8" />
                  </mesh>
                  <mesh position={[0, 0.6, 0]}>
                    <boxGeometry args={[0.03, 0.03, 0.8]} />
                    <meshStandardMaterial color="#38bdf8" />
                  </mesh>
                </group>
              ))
            )}
            {/* Radar Signal Wave Indicator Rings */}
            <mesh position={[0, 1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.5, 1.6, 24]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
            </mesh>
            {/* 3D Text Label */}
            {hoveredAssetId === (asset.assetId || "RAD-MAI-MARA") && (
              <Html position={[0, 2.2, 0]} center distanceFactor={16}>
                <div className="bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-md">
                  MARA 54.5MHz VHF Radar
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* 2. CADI IONOSONDE (1-30 MHz RF Transmitting Masts) */}
      {(() => {
        const asset = assets["ION-MAI-CADI"] || { position3D: [-12, 1.5, -20], name: "CADI Ionosonde" };
        const statusColor = getStatusColor(asset.operationalStatus || "RUNNING", asset.healthScore || 0.96);

        return (
          <group
            key="ION-MAI-CADI"
            position={asset.position3D}
            onClick={(e) => { e.stopPropagation(); onSelect(asset.assetId); }}
            onPointerOver={(e) => { e.stopPropagation(); onHover(asset.assetId); }}
            onPointerOut={() => onHover(null)}
          >
            {/* 4 Tall Corner Towers with Wire Antenna */}
            {[-3, 3].map((x) =>
              [-3, 3].map((z) => (
                <mesh key={`cadi-tower-${x}-${z}`} position={[x, 1.5, z]}>
                  <cylinderGeometry args={[0.06, 0.08, 4.0, 8]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
                </mesh>
              ))
            )}
            {/* Central Delta Antenna Loop Wire */}
            <mesh position={[0, 3.2, 0]} rotation={[0, Math.PI / 4, 0]}>
              <torusGeometry args={[2.5, 0.02, 8, 4]} />
              <meshBasicMaterial color="#f43f5e" />
            </mesh>
            {/* Central Receiver Container */}
            <mesh position={[0, -0.4, 0]}>
              <boxGeometry args={[1.4, 0.8, 1.0]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            {hoveredAssetId === (asset.assetId || "ION-MAI-CADI") && (
              <Html position={[0, 4.2, 0]} center distanceFactor={16}>
                <div className="bg-rose-950/90 text-rose-300 border border-rose-500/50 px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-md">
                  CADI Ionosonde (1-30 MHz)
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* 3. AWS WEATHER STATION + RADIOSONDE BALLOON LAUNCH PAD */}
      {(() => {
        const asset = assets["AWS-MAI-001"] || { position3D: [8, 1.5, -12], name: "AWS Station" };

        return (
          <group
            key="AWS-MAI-001"
            position={asset.position3D}
            onClick={(e) => { e.stopPropagation(); onSelect(asset.assetId); }}
            onPointerOver={(e) => { e.stopPropagation(); onHover(asset.assetId); }}
            onPointerOut={() => onHover(null)}
          >
            {/* AWS Mast */}
            <mesh position={[0, 1.5, 0]}>
              <cylinderGeometry args={[0.06, 0.08, 4.0, 12]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.7} />
            </mesh>
            {/* Ultrasonic Anemometer */}
            <mesh position={[0, 3.4, 0]}>
              <cylinderGeometry args={[0.25, 0.05, 0.4, 12]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
            {/* Radiation Shield */}
            <mesh position={[0.3, 2.2, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.5, 12]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* --- RADIOSONDE HELIUM BALLOON & SENSOR PAYLOAD --- */}
            <group ref={balloonRef} position={[1.5, 6.0, 0]}>
              {/* White Helium Weather Balloon */}
              <mesh>
                <sphereGeometry args={[0.85, 24, 24]} />
                <meshStandardMaterial color="#ffffff" roughness={0.2} opacity={0.95} transparent />
              </mesh>
              {/* Tether Line */}
              <mesh position={[0, -1.2, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 1.8, 6]} />
                <meshBasicMaterial color="#94a3b8" />
              </mesh>
              {/* Radiosonde Instrument Package Box */}
              <mesh position={[0, -2.1, 0]}>
                <boxGeometry args={[0.25, 0.25, 0.25]} />
                <meshStandardMaterial color="#f59e0b" />
              </mesh>
              {/* Antenna Wire dangling from sonde */}
              <mesh position={[0, -2.5, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 0.6, 4]} />
                <meshBasicMaterial color="#000000" />
              </mesh>
            </group>

            {hoveredAssetId === (asset.assetId || "AWS-MAI-001") && (
              <Html position={[0, 4.2, 0]} center distanceFactor={16}>
                <div className="bg-amber-950/90 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-md">
                  AWS & Radiosonde Launch
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* 4. IMAGING RIOMETER (38.2 MHz Crossed Dipole Grid) */}
      {(() => {
        const asset = assets["RIO-MAI-38"] || { position3D: [18, 0.5, -18], name: "Imaging Riometer" };

        return (
          <group
            key="RIO-MAI-38"
            position={asset.position3D}
            onClick={(e) => { e.stopPropagation(); onSelect(asset.assetId); }}
            onPointerOver={(e) => { e.stopPropagation(); onHover(asset.assetId); }}
            onPointerOut={() => onHover(null)}
          >
            {/* 8 Dipole Units in circular/grid formation */}
            {[-2.5, -0.8, 0.8, 2.5].map((x) =>
              [-1.5, 1.5].map((z) => (
                <group key={`rio-${x}-${z}`} position={[x, 0.3, z]}>
                  <mesh>
                    <boxGeometry args={[1.2, 0.02, 0.02]} />
                    <meshStandardMaterial color="#e11d48" />
                  </mesh>
                  <mesh>
                    <boxGeometry args={[0.02, 0.02, 1.2]} />
                    <meshStandardMaterial color="#e11d48" />
                  </mesh>
                </group>
              ))
            )}
            {hoveredAssetId === (asset.assetId || "RIO-MAI-38") && (
              <Html position={[0, 1.2, 0]} center distanceFactor={16}>
                <div className="bg-rose-950/90 text-rose-300 border border-rose-500/50 px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-md">
                  38.2MHz Imaging Riometer
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* 5. GEC GLOBAL ATMOSPHERIC ELECTRICITY SUITE */}
      {(() => {
        const asset = assets["GEC-MAI-EFIELD"] || { position3D: [-16, 1.2, -15], name: "GEC Field Mill" };

        return (
          <group
            key="GEC-MAI-EFIELD"
            position={asset.position3D}
            onClick={(e) => { e.stopPropagation(); onSelect(asset.assetId); }}
            onPointerOver={(e) => { e.stopPropagation(); onHover(asset.assetId); }}
            onPointerOut={() => onHover(null)}
          >
            {/* Mast */}
            <mesh position={[0, 1.0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 2.0, 10]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
            {/* Rotating Electric Field Mill Vane */}
            <group ref={fieldMillVaneRef} position={[0, 2.0, 0]}>
              {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
                <mesh key={`vane-${idx}`} rotation={[0, angle, 0]} position={[0.2, 0, 0]}>
                  <boxGeometry args={[0.3, 0.02, 0.1]} />
                  <meshStandardMaterial color="#38bdf8" metalness={0.9} />
                </mesh>
              ))}
            </group>
            {/* Long Wire Antenna Line */}
            <mesh position={[-2.5, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.01, 0.01, 5.0, 6]} />
              <meshBasicMaterial color="#f59e0b" />
            </mesh>
            {hoveredAssetId === (asset.assetId || "GEC-MAI-EFIELD") && (
              <Html position={[0, 2.6, 0]} center distanceFactor={16}>
                <div className="bg-sky-950/90 text-sky-300 border border-sky-500/50 px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-md">
                  GEC Electric Field Mill
                </div>
              </Html>
            )}
          </group>
        );
      })()}

      {/* 6. ALL-SKY 180° AURORA IMAGER (Roof Dome Camera) */}
      {(() => {
        const asset = assets["ASI-MAI-001"] || { position3D: [0, 4.8, -2], name: "All Sky Imager" };

        return (
          <group
            key="ASI-MAI-001"
            position={asset.position3D}
            onClick={(e) => { e.stopPropagation(); onSelect(asset.assetId); }}
            onPointerOver={(e) => { e.stopPropagation(); onHover(asset.assetId); }}
            onPointerOut={() => onHover(null)}
          >
            {/* Heated Glass Glass Dome */}
            <mesh>
              <sphereGeometry args={[0.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.0} transparent opacity={0.6} />
            </mesh>
            {/* Fish-eye Camera Base */}
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.42, 0.42, 0.4, 16]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            {hoveredAssetId === (asset.assetId || "ASI-MAI-001") && (
              <Html position={[0, 0.8, 0]} center distanceFactor={16}>
                <div className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-md">
                  180° All-Sky Aurora Camera
                </div>
              </Html>
            )}
          </group>
        );
      })()}
    </group>
  );
}
