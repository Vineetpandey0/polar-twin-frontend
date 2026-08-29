"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { TelemetryBanner } from "@/components/telemetry/TelemetryBanner";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullscreen3D = pathname.endsWith("/3d");

  if (isFullscreen3D) {
    return (
      <main className="w-screen h-screen overflow-hidden p-0 m-0 bg-slate-950">
        <TelemetryBanner />
        {children}
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TelemetryBanner />
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
