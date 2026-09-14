import Link from "next/link";
import { AlertTriangle, Box, Gauge } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 font-mono">
      <div className="p-4 rounded-full bg-[#131D2B] border border-[#F87171]/40 mb-4 animate-pulse">
        <AlertTriangle className="w-10 h-10 text-[#F87171]" />
      </div>
      <span className="text-xs text-[#F87171] uppercase tracking-widest font-bold">
        [STATUS 404 // TELEMETRY NODE NOT FOUND]
      </span>
      <h1 className="text-2xl font-bold text-[#E2EAF4] mt-2 mb-2 uppercase tracking-wider">
        Mission Endpoint Not Found
      </h1>
      <p className="text-sm text-[#8CA1B6] max-w-md mb-6 leading-relaxed">
        The requested PolarTwin telemetry node or console view does not exist or has been relocated to another sector.
      </p>
      <div className="flex items-center space-x-3">
        <Link
          href="/"
          className="flex items-center space-x-2 px-4 py-2 rounded-sm bg-[#131D2B] hover:bg-[#1E2C3D] border border-[#38BDF8] text-[#38BDF8] hover:text-[#E2EAF4] text-xs font-bold transition-all shadow-[0_0_12px_rgba(56,189,248,0.2)]"
        >
          <Box className="w-4 h-4 text-[#38BDF8]" />
          <span>3D DIGITAL TWIN</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 px-4 py-2 rounded-sm bg-[#0F1722] hover:bg-[#131D2B] border border-[#1E2C3D] text-[#8CA1B6] hover:text-[#E2EAF4] text-xs font-bold transition-all"
        >
          <Gauge className="w-4 h-4 text-[#8CA1B6]" />
          <span>2D TELEMETRY DASHBOARD</span>
        </Link>
      </div>
    </div>
  );
}
