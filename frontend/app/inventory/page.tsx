"use client";

import { useState } from "react";
import {
  Box,
  Fuel,
  Apple,
  HeartPulse,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Search,
  PlusCircle,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";

interface InventoryItem {
  id: string;
  station_id: string;
  name: string;
  category: "FUEL" | "FOOD" | "MEDICAL" | "SPARE_PARTS";
  current_level: number;
  max_capacity: number;
  unit: string;
  reorder_threshold: number;
  days_remaining: number;
  burn_rate_daily: number;
}

export default function InventoryPage() {
  const [stationFilter, setStationFilter] = useState<"ALL" | "maitri" | "bharati">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "FUEL" | "FOOD" | "MEDICAL" | "SPARE_PARTS">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [requisitionSuccess, setRequisitionSuccess] = useState<string | null>(null);

  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: "INV-MAI-001",
      station_id: "maitri",
      name: "Arctic High-Grade Polar Diesel",
      category: "FUEL",
      current_level: 45000,
      max_capacity: 65000,
      unit: "LITERS",
      reorder_threshold: 15000,
      days_remaining: 120,
      burn_rate_daily: 375,
    },
    {
      id: "INV-MAI-002",
      station_id: "maitri",
      name: "Freeze-Dried & Ration Reserves",
      category: "FOOD",
      current_level: 120,
      max_capacity: 180,
      unit: "DAYS",
      reorder_threshold: 30,
      days_remaining: 120,
      burn_rate_daily: 1,
    },
    {
      id: "INV-MAI-003",
      station_id: "maitri",
      name: "Medical Trauma & Surgical Stock",
      category: "MEDICAL",
      current_level: 95,
      max_capacity: 100,
      unit: "PCT",
      reorder_threshold: 40,
      days_remaining: 250,
      burn_rate_daily: 0.2,
    },
    {
      id: "INV-MAI-004",
      station_id: "maitri",
      name: "Generator Fuel Injectors & Belts",
      category: "SPARE_PARTS",
      current_level: 25,
      max_capacity: 35,
      unit: "UNITS",
      reorder_threshold: 5,
      days_remaining: 180,
      burn_rate_daily: 0.1,
    },
    {
      id: "INV-BHA-001",
      station_id: "bharati",
      name: "Arctic High-Grade Polar Diesel",
      category: "FUEL",
      current_level: 60000,
      max_capacity: 80000,
      unit: "LITERS",
      reorder_threshold: 20000,
      days_remaining: 180,
      burn_rate_daily: 330,
    },
    {
      id: "INV-BHA-002",
      station_id: "bharati",
      name: "Freeze-Dried & Ration Reserves",
      category: "FOOD",
      current_level: 180,
      max_capacity: 240,
      unit: "DAYS",
      reorder_threshold: 45,
      days_remaining: 180,
      burn_rate_daily: 1,
    },
    {
      id: "INV-BHA-003",
      station_id: "bharati",
      name: "Medical Trauma Kits & Emergency O2",
      category: "MEDICAL",
      current_level: 100,
      max_capacity: 100,
      unit: "PCT",
      reorder_threshold: 40,
      days_remaining: 300,
      burn_rate_daily: 0.1,
    },
    {
      id: "INV-BHA-004",
      station_id: "bharati",
      name: "CHP Turbine Filters & Seals",
      category: "SPARE_PARTS",
      current_level: 30,
      max_capacity: 40,
      unit: "UNITS",
      reorder_threshold: 8,
      days_remaining: 220,
      burn_rate_daily: 0.1,
    },
  ]);

  const handleRequisition = (itemName: string) => {
    setRequisitionSuccess(`Requisition order generated for ${itemName}. Logged to NCAOR Antarctic Mission Dispatch.`);
    setTimeout(() => setRequisitionSuccess(null), 4000);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "FUEL":
        return Fuel;
      case "FOOD":
        return Apple;
      case "MEDICAL":
        return HeartPulse;
      default:
        return Wrench;
    }
  };

  const filteredItems = items.filter((item) => {
    if (stationFilter !== "ALL" && item.station_id !== stationFilter) return false;
    if (categoryFilter !== "ALL" && item.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalFuelLiters = items
    .filter((i) => i.category === "FUEL")
    .reduce((acc, i) => acc + i.current_level, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              Logistics & Supply Chain
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 mt-1 flex items-center space-x-2.5">
            <Box className="w-7 h-7 text-cyan-400" />
            <span>Station Inventory & Stock Forecasting</span>
          </h1>
          <p className="text-xs text-slate-400">
            Automated consumption depletion projections and resupply planning
          </p>
        </div>

        {/* Global Summary Stats */}
        <div className="flex items-center space-x-3">
          <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Polar Diesel</span>
            <span className="text-lg font-bold text-amber-400">{totalFuelLiters.toLocaleString()} L</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Food Runway</span>
            <span className="text-lg font-bold text-emerald-400">120 - 180 Days</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Critical Deficits</span>
            <span className="text-lg font-bold text-emerald-400">0 Items</span>
          </div>
        </div>
      </div>

      {requisitionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{requisitionSuccess}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Station Selector */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 space-x-1 text-xs">
            {(["ALL", "maitri", "bharati"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStationFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                  stationFilter === st
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {st === "ALL" ? "All Stations" : st}
              </button>
            ))}
          </div>

          {/* Category Selector */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 space-x-1 text-xs">
            {(["ALL", "FUEL", "FOOD", "MEDICAL", "SPARE_PARTS"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                  categoryFilter === cat
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inventory items..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const Icon = getCategoryIcon(item.category);
          const pct = Math.round((item.current_level / item.max_capacity) * 100);
          const isWarning = item.days_remaining < 30 || pct < 30;

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950/80 text-cyan-300 uppercase">
                        {item.station_id}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{item.id}</span>
                    </div>
                    <h3 className="font-bold text-slate-100 text-sm mt-0.5">{item.name}</h3>
                  </div>
                </div>

                <button
                  onClick={() => handleRequisition(item.name)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-cyan-400 flex items-center space-x-1 transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Requisition</span>
                </button>
              </div>

              {/* Progress Meter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Current Stock Level</span>
                  <span className="font-bold text-slate-100">
                    {item.current_level.toLocaleString()} {item.unit} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct > 60
                        ? "bg-gradient-to-r from-cyan-500 to-emerald-400"
                        : pct > 30
                        ? "bg-gradient-to-r from-amber-500 to-amber-400"
                        : "bg-gradient-to-r from-rose-600 to-rose-400"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Depletion Forecast Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/50">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Est. Runway</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {item.days_remaining} Days
                  </span>
                </div>

                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/50">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Daily Burn</span>
                  <span className="font-bold text-slate-200 font-mono">
                    {item.burn_rate_daily} {item.unit}/d
                  </span>
                </div>

                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/50">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Reorder Point</span>
                  <span className="font-bold text-slate-200 font-mono">
                    {item.reorder_threshold} {item.unit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
