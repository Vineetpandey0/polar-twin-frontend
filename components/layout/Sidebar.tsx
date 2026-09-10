"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Globe,
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
      { name: "Operations Hub", href: "/", code: "HUB", icon: Gauge },
      { name: "Live Operations Map", href: "/map", code: "MAP", icon: Globe },
    ],
  },
  {
    title: "MAITRI STATION",
    accentColor: "#FBBF24",
    stationIndicator: "#FBBF24",
    items: [
      { name: "Station Overview", href: "/stations/maitri", code: "MAI", icon: Radio },
      { name: "Machinery Hub", href: "/stations/maitri/details", code: "M-MC", icon: Wrench },
      { name: "3D Digital Twin", href: "/stations/maitri/3d", code: "3D-M", icon: Compass },
    ],
  },
  {
    title: "BHARATI STATION",
    accentColor: "#38BDF8",
    stationIndicator: "#38BDF8",
    items: [
      { name: "Station Overview", href: "/stations/bharati", code: "BHA", icon: Building2 },
      { name: "Machinery Hub", href: "/stations/bharati/details", code: "B-MC", icon: Zap },
      { name: "3D Digital Twin", href: "/stations/bharati/3d", code: "3D-B", icon: Box },
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

  return (
    <aside
      className={`bg-[#0F1722] flex flex-col min-h-screen p-2 border-r border-[#1E293B] shrink-0 transition-all duration-150 select-none z-30 ${
        isCollapsed ? "w-14" : "w-60"
      }`}
    >
      {/* Header Logo & Collapse Toggle */}
      <div className="flex items-center justify-between px-1 py-2 mb-2 border-b border-[#1E293B] pb-2.5">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          {/* Mission Console Station Monogram */}
          <div className="w-7 h-7 rounded-sm bg-[#090D14] border border-[#1E293B] flex items-center justify-center font-mono font-bold text-[11px] text-[#8CA1B6] shrink-0">
            <Crosshair className="w-4 h-4 text-[#38BDF8]" />
          </div>
          {!isCollapsed && (
            <div className="leading-tight min-w-0">
              <h1 className="font-bold text-sm text-[#E2EAF4] tracking-wider uppercase truncate">
                PolarTwin
              </h1>
              <span className="text-[9px] font-mono text-[#5B7086] block tracking-tight">
                ANTARCTIC DIGITAL TWIN
              </span>
            </div>
          )}
        </div>

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
      <nav className="flex-1 space-y-3 overflow-y-auto pr-0.5">
        {navSections.map((section, sectionIdx) => (
          <div key={section.title} className="space-y-0.5">
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
                <span className="text-[10px] font-mono tracking-wider text-[#5B7086] font-semibold uppercase">
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
                    className={`flex items-center space-x-2 px-2 py-1.5 rounded-sm text-xs font-medium tracking-wide transition-colors ${
                      isActive
                        ? "bg-[#131D2B] text-[#E2EAF4] border-l-[3px] border-y border-r border-[#1E293B]"
                        : "text-[#8CA1B6] hover:text-[#E2EAF4] hover:bg-[#131D2B]/50 border border-transparent border-l-[3px]"
                    } ${isCollapsed ? "justify-center px-0" : ""}`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        isActive ? "text-[#E2EAF4]" : "text-[#8CA1B6]"
                      }`}
                    />
                    {!isCollapsed && (
                      <div className="flex items-center justify-between w-full min-w-0">
                        <span className="truncate">{item.name}</span>
                        <span className="text-[9px] font-mono text-[#5B7086] ml-1.5">
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
        className={`p-2 bg-[#090D14] rounded-sm border border-[#1E293B] mt-auto ${
          isCollapsed ? "text-center" : "space-y-1"
        }`}
      >
        <div
          className={`flex items-center text-xs text-[#E2EAF4] ${
            isCollapsed ? "justify-center" : "space-x-1.5"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] shrink-0 animate-pulse" />
          {!isCollapsed && (
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#8CA1B6]">
              SCADA BUS ACTIVE
            </span>
          )}
        </div>
        {!isCollapsed && (
          <div className="text-[9px] font-mono text-[#5B7086] flex items-center justify-between pt-1 border-t border-[#1E293B]">
            <span>ENGINE SYNC</span>
            <span className="text-[#34D399] font-medium">5000ms</span>
          </div>
        )}
      </div>
    </aside>
  );
}
