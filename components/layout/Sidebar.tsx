"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ShieldAlert,
  Cpu,
  Box,
  Bot,
  Radio,
  Compass,
  Boxes,
  Sliders,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { name: "Operations Hub", href: "/", icon: Activity },
  { name: "Maitri Station", href: "/stations/maitri", icon: Radio },
  { name: "Maitri Machinery Hub", href: "/stations/maitri/details", icon: Sliders },
  { name: "Bharati Station", href: "/stations/bharati", icon: Cpu },
  { name: "Bharati Machinery Hub", href: "/stations/bharati/details", icon: Sliders },
  { name: "Maitri 3D Twin", href: "/stations/maitri/3d", icon: Compass },
  { name: "Bharati 3D Twin", href: "/stations/bharati/3d", icon: Box },
  { name: "Scenario Simulator", href: "/stations/maitri/scenarios", icon: Sliders },
  { name: "Alert Center", href: "/alerts", icon: ShieldAlert },
  { name: "Inventory & Stocks", href: "/inventory", icon: Boxes },
  { name: "AI Assistant", href: "/ai", icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <aside
      className={`glass-panel flex flex-col min-h-screen p-3 border-r border-slate-800 shrink-0 transition-all duration-300 relative ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header Logo & Collapse Toggle */}
      <div className="flex items-center justify-between px-1 py-3 mb-4">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg glow-blue shrink-0">
            PT
          </div>
          {!isCollapsed && (
            <div className="transition-opacity duration-300">
              <h1 className="font-bold text-base text-slate-100 tracking-wide leading-none">PolarTwin</h1>
              <p className="text-[10px] text-cyan-400 font-medium mt-0.5">Antarctic Twin</p>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-all shrink-0"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Telemetry Status Footer */}
      <div className={`p-2.5 glass-card rounded-xl border border-slate-700/50 mt-auto ${isCollapsed ? "text-center" : "space-y-1"}`}>
        <div className={`flex items-center text-xs text-slate-300 ${isCollapsed ? "justify-center" : "space-x-2"}`}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          {!isCollapsed && <span className="font-semibold text-[11px]">Telemetry Engine</span>}
        </div>
        {!isCollapsed && (
          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5">
            <span>Simulation</span>
            <span className="font-mono text-cyan-400 font-bold">5s TICK</span>
          </div>
        )}
      </div>
    </aside>
  );
}
