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
    <div className="flex min-h-screen bg-[#090D14] text-[#E2EAF4] w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TelemetryBanner />
        <Header />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-[#090D14]">{children}</main>
      </div>
    </div>
  );
}

