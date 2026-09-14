"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Box, Layers, RefreshCw } from "lucide-react";

// WebGL R3F Canvas must not be SSR rendered
const StationCanvas = dynamic(() => import("@/components/3d/StationCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#090D14] font-mono text-[#E2EAF4]">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-[#1E2C3D] border-t-[#38BDF8] animate-spin flex items-center justify-center" />
        <Box className="w-6 h-6 text-[#38BDF8] absolute inset-0 m-auto animate-pulse" />
      </div>
      <div className="space-y-1 text-center">
        <div className="flex items-center justify-center space-x-2">
          <span className="w-2 h-2 rounded-sm bg-[#34D399] animate-ping" />
          <span className="text-sm font-bold tracking-wider text-[#38BDF8] uppercase">
            POLARTWIN SPATIAL 3D ENGINE
          </span>
        </div>
        <p className="text-xs text-[#8CA1B6] tracking-wide">
          Loading procedural terrain, atmospheric physics & SCADA asset meshes...
        </p>
      </div>
    </div>
  ),
});

function Fullscreen3DView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stationParam = searchParams.get("station");
  const initialStation = stationParam === "bharati" ? "bharati" : "maitri";

  const [activeStation, setActiveStation] = useState<string>(initialStation);

  useEffect(() => {
    if (stationParam === "bharati" || stationParam === "maitri") {
      setActiveStation(stationParam);
    }
  }, [stationParam]);

  const handleStationSwitch = (newStationId: string) => {
    setActiveStation(newStationId);
    // Update URL query param smoothly without unmounting Three.js context
    const url = new URL(window.location.href);
    url.searchParams.set("station", newStationId);
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <div className="w-screen h-screen fixed inset-0 z-50 overflow-hidden bg-slate-950 select-none">
      <StationCanvas
        stationId={activeStation}
        onStationSwitch={handleStationSwitch}
      />
    </div>
  );
}

export default function RootPage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center bg-[#090D14] font-mono text-xs text-[#38BDF8] animate-pulse">
          BOOTING POLARTWIN 3D ENGINE...
        </div>
      }
    >
      <Fullscreen3DView />
    </Suspense>
  );
}
