"use client";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// R3F / Three.js uses WebGL (browser-only) — must never run on the server
const StationCanvas = dynamic(() => import("@/components/3d/StationCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-950">
      <span className="text-xs text-cyan-400 animate-pulse font-mono">Initialising 3D Engine...</span>
    </div>
  ),
});

export default function Station3DPage() {
  const params = useParams();
  const router = useRouter();
  const stationId = (params.id as string) || "maitri";

  return (
    <div className="w-screen h-screen fixed inset-0 z-50 overflow-hidden bg-slate-950">
      <StationCanvas
        stationId={stationId}
        onStationSwitch={(newId) => router.push(`/stations/${newId}/3d`)}
      />
    </div>
  );
}
