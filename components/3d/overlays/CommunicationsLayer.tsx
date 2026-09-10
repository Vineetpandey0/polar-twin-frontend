import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface CommunicationsLayerProps {
  stationId: "maitri" | "bharati";
  active: boolean;
}

export function CommunicationsLayer({ stationId, active }: CommunicationsLayerProps) {
  const beam1Ref = useRef<THREE.Mesh>(null);
  const beam2Ref = useRef<THREE.Mesh>(null);
  const radarWaveRef = useRef<THREE.Group>(null);
  const isMaitri = stationId === "maitri";

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (beam1Ref.current) {
      beam1Ref.current.rotation.y = t * 0.4;
    }
    if (beam2Ref.current) {
      beam2Ref.current.rotation.y = -t * 0.4;
    }

    // Expanding atmospheric radar / sounding pulse rings
    if (radarWaveRef.current) {
      radarWaveRef.current.children.forEach((child, i) => {
        const ringProgress = (t * 0.6 + i * 0.33) % 1.0;
        child.position.y = ringProgress * 16.0;
        const scale = 1.0 + ringProgress * 3.5;
        child.scale.set(scale, scale, scale);
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = (1.0 - ringProgress) * 0.7;
        }
      });
    }
  });

  if (!active) return null;

  return (
    <group name="communications-and-signals-layer">
      {isMaitri ? (
        /* ================= MAITRI SCIENTIFIC & COMMS SIGNALS ================= */
        <group>
          {/* 1. Ku-Band Satellite Ground Station Radome Uplink Beam at [12.0, 3.5, -7.0] */}
          <group position={[12.0, 3.5, -7.0]}>
            <mesh ref={beam1Ref} position={[0, 14, 0]}>
              <cylinderGeometry args={[5.0, 0.4, 28, 16, 1, true]} />
              <meshBasicMaterial
                color="#38bdf8"
                transparent
                opacity={0.25}
                side={THREE.DoubleSide}
                wireframe
              />
            </mesh>
            {/* Core high-intensity radio focal vector */}
            <mesh position={[0, 14, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 28, 8]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
            </mesh>
          </group>

          {/* 2. MARA 54.5 MHz Atmospheric Radar Vertical Sounding at [10.0, 1.2, -18.0] */}
          <group position={[10.0, 1.2, -18.0]}>
            {/* Pulsed vertical Doppler beam */}
            <mesh position={[0, 15, 0]}>
              <cylinderGeometry args={[4.2, 1.2, 30, 16, 1, true]} />
              <meshBasicMaterial
                color="#a855f7"
                transparent
                opacity={0.22}
                side={THREE.DoubleSide}
                wireframe
              />
            </mesh>
            {/* Expanding atmospheric pulse wavefronts */}
            <group ref={radarWaveRef}>
              {[0, 1, 2].map((idx) => (
                <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                  <ringGeometry args={[1.5, 1.7, 32]} />
                  <meshBasicMaterial color="#c084fc" transparent opacity={0.6} side={THREE.DoubleSide} />
                </mesh>
              ))}
            </group>
          </group>

          {/* 3. CADI Ionosonde 1-30 MHz Ionospheric Sounding Cone at [-12.0, 1.5, -20.0] */}
          <group position={[-12.0, 1.5, -20.0]}>
            <mesh position={[0, 16, 0]}>
              <cylinderGeometry args={[6.5, 0.5, 32, 12, 1, true]} />
              <meshBasicMaterial
                color="#f43f5e"
                transparent
                opacity={0.18}
                side={THREE.DoubleSide}
                wireframe
              />
            </mesh>
          </group>

          {/* 4. Local Telemetry Lines to Main Building [0, 2.2, 0] */}
          {/* Radome to Main Building */}
          {(() => {
            const geom = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(12.0, 3.5, -7.0),
              new THREE.Vector3(0.0, 2.2, 0.0),
            ]);
            return (
              <primitive
                object={
                  new THREE.Line(
                    geom,
                    new THREE.LineBasicMaterial({ color: "#0ea5e9", transparent: true, opacity: 0.6, linewidth: 2 })
                  )
                }
              />
            );
          })()}
          {/* AWS to Main Building */}
          {(() => {
            const geom = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(8.0, 1.5, -12.0),
              new THREE.Vector3(0.0, 2.2, 0.0),
            ]);
            return (
              <primitive
                object={
                  new THREE.Line(
                    geom,
                    new THREE.LineBasicMaterial({ color: "#06b6d4", transparent: true, opacity: 0.5, linewidth: 1 })
                  )
                }
              />
            );
          })()}
        </group>
      ) : (
        /* ================= BHARATI SATCOM & ISRO AGEOS SIGNALS ================= */
        <group>
          {/* 1. ISRO AGEOS Radome 1 Tracking Beam at [11.8, 4.5, -8.0] (Cartosat-3 Polar Orbit) */}
          <group position={[11.8, 4.5, -8.0]} rotation={[0.2, 0.4, 0]}>
            <mesh ref={beam1Ref} position={[0, 16, 0]}>
              <cylinderGeometry args={[5.2, 0.5, 32, 16, 1, true]} />
              <meshBasicMaterial
                color="#38bdf8"
                transparent
                opacity={0.25}
                side={THREE.DoubleSide}
                wireframe
              />
            </mesh>
            <mesh position={[0, 16, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 32, 8]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
            </mesh>
          </group>

          {/* 2. ISRO AGEOS Radome 2 Tracking Beam at [16.2, 4.5, -8.0] (Resourcesat-2A Relay) */}
          <group position={[16.2, 4.5, -8.0]} rotation={[-0.15, -0.3, 0]}>
            <mesh ref={beam2Ref} position={[0, 16, 0]}>
              <cylinderGeometry args={[5.2, 0.5, 32, 16, 1, true]} />
              <meshBasicMaterial
                color="#06b6d4"
                transparent
                opacity={0.25}
                side={THREE.DoubleSide}
                wireframe
              />
            </mesh>
            <mesh position={[0, 16, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 32, 8]} />
              <meshBasicMaterial color="#06b6d4" transparent opacity={0.7} />
            </mesh>
          </group>

          {/* 3. Station VSAT C-Band Parabolic Uplink at [-6.0, 4.2, -4.0] */}
          <group position={[-6.0, 4.2, -4.0]} rotation={[0.3, -0.5, 0]}>
            <mesh position={[0, 14, 0]}>
              <cylinderGeometry args={[3.8, 0.4, 28, 12, 1, true]} />
              <meshBasicMaterial
                color="#10b981"
                transparent
                opacity={0.2}
                side={THREE.DoubleSide}
                wireframe
              />
            </mesh>
          </group>

          {/* 4. Gigabit Optical Fiber Data Pipeline: AGEOS Radomes [14.0, 4.5, -8.0] -> Main Superstructure [0.0, 3.2, 0.0] */}
          {(() => {
            const geom = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(14.0, 4.5, -8.0),
              new THREE.Vector3(0.0, 3.2, 0.0),
            ]);
            return (
              <primitive
                object={
                  new THREE.Line(
                    geom,
                    new THREE.LineBasicMaterial({ color: "#38bdf8", transparent: true, opacity: 0.85, linewidth: 3 })
                  )
                }
              />
            );
          })()}

          {/* IMD AWS Telemetry Line: [-16.0, 1.8, -14.0] -> Main Superstructure [0.0, 3.2, 0.0] */}
          {(() => {
            const geom = new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(-16.0, 1.8, -14.0),
              new THREE.Vector3(0.0, 3.2, 0.0),
            ]);
            return (
              <primitive
                object={
                  new THREE.Line(
                    geom,
                    new THREE.LineBasicMaterial({ color: "#06b6d4", transparent: true, opacity: 0.6, linewidth: 2 })
                  )
                }
              />
            );
          })()}
        </group>
      )}
    </group>
  );
}
