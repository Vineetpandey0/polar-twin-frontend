"use client";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// R3F / Three.js uses WebGL (browser-only) — must never run on the server
const StationCanvas = dynamic(() => import("@/components/3d/StationCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-950">
      <span className="text-xs text-slate-500 animate-pulse font-mono">Initialising 3D Engine...</span>
    </div>
  ),
});

export default function Station3DPage() {
  const params = useParams();
  const router = useRouter();
  const stationId = (params.id as string) || "maitri";
  const isMaitri = stationId === "maitri";

  return (
    <div className="space-y-3 max-w-7xl mx-auto h-[calc(100vh-5rem)] flex flex-col">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between glass-panel px-4 py-2.5 rounded-2xl border border-slate-800 shrink-0">
        <div className="flex items-center space-x-3">
          <Link
            href={`/stations/${stationId}`}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isMaitri ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              }`}>
                3D Digital Twin Operations Viewport
              </span>
            </div>
            <h1 className="text-lg font-black text-slate-100 mt-0.5">
              {isMaitri ? "Maitri Research Station" : "Bharati Research Station"}
            </h1>
          </div>
        </div>

        {/* Station Switcher */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push("/stations/maitri/3d")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isMaitri
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-lg"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
            }`}
          >
            Maitri Twin
          </button>
          <button
            onClick={() => router.push("/stations/bharati/3d")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !isMaitri
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
            }`}
          >
            Bharati Twin
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Body */}
      <div className="flex-1 min-h-0 relative">
        <StationCanvas
          stationId={stationId}
          onStationSwitch={(newId) => router.push(`/stations/${newId}/3d`)}
        />
      </div>
    </div>
  );
}
