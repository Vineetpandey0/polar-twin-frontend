"use client";

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
} from "lucide-react";

const navItems = [
  { name: "Operations Hub", href: "/", icon: Activity },
  { name: "Maitri Station", href: "/stations/maitri", icon: Radio },
  { name: "Bharati Station", href: "/stations/bharati", icon: Cpu },
  { name: "Maitri 3D Twin", href: "/stations/maitri/3d", icon: Compass },
  { name: "Bharati 3D Twin", href: "/stations/bharati/3d", icon: Box },
  { name: "Scenario Simulator", href: "/stations/maitri/scenarios", icon: Sliders },
  { name: "Alert Center", href: "/alerts", icon: ShieldAlert },
  { name: "Inventory & Stocks", href: "/inventory", icon: Boxes },
  { name: "AI Assistant", href: "/ai", icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass-panel flex flex-col min-h-screen p-4 border-r border-slate-800 shrink-0">
      <div className="flex items-center space-x-3 px-2 py-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg glow-blue">
          PT
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-100 tracking-wide">PolarTwin</h1>
          <p className="text-xs text-cyan-400 font-medium">Antarctic Digital Twin</p>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 glass-card rounded-xl border border-slate-700/50 mt-auto space-y-1">
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-[11px]">Telemetry Engine</span>
        </div>
        <div className="text-[10px] text-slate-400 flex items-center justify-between">
          <span>Simulation Mode</span>
          <span className="font-mono text-cyan-400 font-bold">5s TICK</span>
        </div>
      </div>
    </aside>
  );
}
