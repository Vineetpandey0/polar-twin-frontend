"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTelemetry } from "@/lib/telemetry";
import {
  Gauge,
  Radio,
  Wrench,
  Compass,
  Building2,
  Zap,
  Box,
  GitBranch,
  ShieldAlert,
  Package,
  Terminal,
  ChevronLeft,
  ChevronRight,
  Crosshair,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  code: string;
  icon: any;
}

interface NavSection {
  title: string;
  accentColor: string;
  stationIndicator?: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "OVERVIEW",
    accentColor: "#38BDF8",
    items: [
      { name: "3D Spatial Twin", href: "/", code: "3D", icon: Box },
      { name: "2D Telemetry Dashboard", href: "/dashboard", code: "HUB", icon: Gauge },
    ],
  },
  {
    title: "MAITRI STATION",
    accentColor: "#FBBF24",
    stationIndicator: "#FBBF24",
    items: [
      { name: "Station Overview", href: "/stations/maitri", code: "MAI", icon: Radio },
      { name: "Machinery Hub", href: "/stations/maitri/details", code: "M-MC", icon: Wrench },
      { name: "3D Digital Twin", href: "/?station=maitri", code: "3D-M", icon: Compass },
    ],
  },
  {
    title: "BHARATI STATION",
    accentColor: "#38BDF8",
    stationIndicator: "#38BDF8",
    items: [
      { name: "Station Overview", href: "/stations/bharati", code: "BHA", icon: Building2 },
      { name: "Machinery Hub", href: "/stations/bharati/details", code: "B-MC", icon: Zap },
      { name: "3D Digital Twin", href: "/?station=bharati", code: "3D-B", icon: Box },
    ],
  },
  {
    title: "OPERATIONS & TOOLS",
    accentColor: "#38BDF8",
    items: [
      { name: "Scenario Simulator", href: "/stations/maitri/scenarios", code: "SIM", icon: GitBranch },
      { name: "Alert Center", href: "/alerts", code: "ALR", icon: ShieldAlert },
      { name: "Inventory & Stocks", href: "/inventory", code: "LOG", icon: Package },
      { name: "AI Diagnostics CLI", href: "/ai", code: "DIA", icon: Terminal },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const telemetry = useTelemetry();

  return (
    <aside
      className={`bg-[#0F1722] flex flex-col h-screen sticky top-0 overflow-hidden p-2.5 border-r border-[#1E293B] shrink-0 transition-all duration-150 select-none z-30 ${
        isCollapsed ? "w-14" : "w-64"
      }`}
    >
      {/* Header Logo & Collapse Toggle */}
      <div className="flex items-center justify-between px-1.5 py-2 mb-2 border-b border-[#1E293B] pb-3">
        <Link href="/" className="flex items-center space-x-2.5 overflow-hidden group">
          {/* Mission Console Station Monogram */}
          <div className="w-8 h-8 rounded-sm bg-[#090D14] border border-[#1E293B] group-hover:border-[#38BDF8] flex items-center justify-center font-mono font-bold text-xs text-[#8CA1B6] group-hover:text-[#38BDF8] shrink-0 transition-colors">
            <Crosshair className="w-4 h-4 text-[#38BDF8]" />
          </div>
          {!isCollapsed && (
            <div className="leading-tight min-w-0">
              <h1 className="font-bold text-base text-[#E2EAF4] group-hover:text-[#38BDF8] tracking-wider uppercase truncate transition-colors">
                PolarTwin
              </h1>
              <span className="text-[10px] font-mono text-[#5B7086] block tracking-wide">
                ANTARCTIC DIGITAL TWIN
              </span>
            </div>
          )}
        </Link>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-6 h-6 rounded-sm bg-[#090D14] hover:bg-[#131D2B] text-[#8CA1B6] hover:text-[#E2EAF4] flex items-center justify-center border border-[#1E293B] transition-colors shrink-0"
          title={isCollapsed ? "Expand Console" : "Collapse Console"}
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Grouped Navigation Sections */}
      <nav className="flex-1 space-y-3.5 overflow-y-auto pr-0.5">
        {navSections.map((section, sectionIdx) => (
          <div key={section.title} className="space-y-1">
            {/* Section Header */}
            {isCollapsed ? (
              sectionIdx > 0 && <div className="border-t border-[#1E293B] my-2" />
            ) : (
              <div className="flex items-center space-x-1.5 px-2 pt-1 pb-1">
                {section.stationIndicator && (
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: section.stationIndicator }}
                  />
                )}
                <span className="text-[11px] font-mono tracking-wider text-[#8CA1B6] font-bold uppercase">
                  {section.title}
                </span>
              </div>
            )}

            {/* Section Items */}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={isCollapsed ? `${section.title}: ${item.name}` : undefined}
                    style={{
                      borderLeftColor: isActive ? section.accentColor : "transparent",
                    }}
                    className={`flex items-center space-x-2.5 px-2.5 py-2 rounded-sm text-sm font-semibold tracking-wide transition-colors ${
                      isActive
                        ? "bg-[#131D2B] text-[#E2EAF4] border-l-[3px] border-y border-r border-[#1E2C3D]"
                        : "text-[#8CA1B6] hover:text-[#E2EAF4] hover:bg-[#131D2B]/50 border border-transparent border-l-[3px]"
                    } ${isCollapsed ? "justify-center px-0" : ""}`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? "text-[#E2EAF4]" : "text-[#8CA1B6]"
                      }`}
                    />
                    {!isCollapsed && (
                      <div className="flex items-center justify-between w-full min-w-0">
                        <span className="truncate">{item.name}</span>
                        <span className="text-xs font-mono text-[#5B7086] ml-2">
                          {item.code}
                        </span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* SCADA Telemetry Bus Footer */}
      <div
        className={`p-2.5 bg-[#090D14] rounded-sm border border-[#1E293B] mt-auto ${
          isCollapsed ? "text-center" : "space-y-1.5"
        }`}
      >
        <div
          className={`flex items-center text-xs text-[#E2EAF4] ${
            isCollapsed ? "justify-center" : "space-x-2"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              telemetry.isConnected
                ? "bg-[#34D399] animate-pulse"
                : telemetry.isBackendAlive
                ? "bg-[#FBBF24] animate-pulse"
                : "bg-[#F87171]"
            }`}
          />
          {!isCollapsed && (
            <span className="font-mono text-xs uppercase tracking-wider text-[#8CA1B6] font-semibold">
              {telemetry.isConnected
                ? "SCADA BUS ACTIVE"
                : telemetry.isBackendAlive
                ? "SCADA BUS STANDBY"
                : "SCADA BUS OFFLINE"}
            </span>
          )}
        </div>
        {!isCollapsed && (
          <div className="text-xs font-mono text-[#5B7086] flex items-center justify-between pt-1.5 border-t border-[#1E293B]">
            <span>ENGINE SYNC</span>
            <span
              className={`font-medium ${
                telemetry.isConnected
                  ? "text-[#34D399]"
                  : telemetry.isBackendAlive
                  ? "text-[#FBBF24]"
                  : "text-[#F87171]"
              }`}
            >
              {telemetry.isConnected ? "LIVE STREAM" : telemetry.isBackendAlive ? "WAITING TICK" : "DISCONNECTED"}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
