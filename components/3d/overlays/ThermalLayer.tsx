import React from "react";

interface ThermalLayerProps {
  stationId: "maitri" | "bharati";
  active: boolean;
}

export function ThermalLayer({ stationId, active }: ThermalLayerProps) {
  if (!active) return null;
  const isMaitri = stationId === "maitri";

  return (
    <group name="thermal-heatmap-visualization-layer">
      {/* False-Color Heat Maps (Cold Blue Ambient vs Heated Core vs Exhaust Red) */}
      {/* 1. Main Habitat Living Pods (Warm Green/Yellow +22°C) */}
      <mesh position={[0, isMaitri ? 1.8 : 2.5, 0]}>
        <boxGeometry args={[isMaitri ? 11.2 : 16.2, isMaitri ? 3.2 : 4.0, isMaitri ? 7.8 : 9.8]} />
        <meshBasicMaterial color="#eab308" transparent opacity={0.35} wireframe={false} />
      </mesh>

      {/* 2. Generator Engine & Exhaust Core (High Heat Red/Orange +80°C - +340°C) */}
      <mesh position={[isMaitri ? -14.5 : -12.0, 1.6, isMaitri ? 0.5 : 0.75]}>
        <boxGeometry args={[4.8, 2.6, isMaitri ? 9.5 : 6.8]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.45} />
      </mesh>

      {/* 3. Fuel Farm (Sub-Zero Cold Blue -12°C) */}
      <mesh position={[isMaitri ? 14.0 : 14.0, 1.8, 4.0]}>
        <boxGeometry args={[7.8, 3.2, isMaitri ? 7.2 : 4.8]} />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
