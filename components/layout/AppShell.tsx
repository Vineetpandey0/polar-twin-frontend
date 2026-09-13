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
      <main className="w-screen h-screen overflow-hidden p-0 m-0 bg-[#090D14]">
        <TelemetryBanner />
        {children}
      </main>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#090D14] text-[#E2EAF4] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <div className="shrink-0 z-40">
          <TelemetryBanner />
        </div>
        <div className="flex-1 overflow-y-auto bg-[#090D14]">
          <Header />
          <main className="p-4 lg:p-6 bg-[#090D14]">{children}</main>
        </div>
      </div>
    </div>
  );
}

