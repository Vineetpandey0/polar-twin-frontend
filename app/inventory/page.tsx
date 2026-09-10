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
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="bg-[#0F1722] p-4 rounded-sm border border-[#1E2C3D] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs mb-1">
            <span className="text-[#38BDF8] font-bold">[LOGISTICS CONSOLE :: SUPPLY CHAIN]</span>
            <span className="text-[#8CA1B6]">[NCPOR ANTARCTIC EXPEDITION 43]</span>
          </div>
          <h1 className="text-2xl lg:text-[28px] font-bold text-[#E2EAF4] uppercase tracking-wide leading-tight flex items-center space-x-2">
            <Box className="w-6 h-6 text-[#38BDF8]" />
            <span>Station Inventory & Strategic Stock Runway</span>
          </h1>
          <p className="text-sm font-mono text-[#8CA1B6] mt-1 leading-relaxed">
            Automated consumption projections, fuel depletion curves, and dispatch requisition planning
          </p>
        </div>

        {/* Global Summary Stats */}
        <div className="flex items-center space-x-2 font-mono">
          <div className="bg-[#131D2B] border border-[#1E2C3D] px-3.5 py-2 rounded-sm text-left">
            <span className="text-[10px] text-[#8CA1B6] uppercase tracking-wider block">Total Polar Diesel</span>
            <span className="text-[22px] font-bold font-mono text-[#38BDF8] tnum leading-tight">{totalFuelLiters.toLocaleString()} L</span>
          </div>

          <div className="bg-[#131D2B] border border-[#1E2C3D] px-3.5 py-2 rounded-sm text-left">
            <span className="text-[10px] text-[#8CA1B6] uppercase tracking-wider block">Food Runway</span>
            <span className="text-[22px] font-bold font-mono text-[#34D399] tnum leading-tight">120 - 180 DAYS</span>
          </div>

          <div className="bg-[#131D2B] border border-[#1E2C3D] px-3.5 py-2 rounded-sm text-left">
            <span className="text-[10px] text-[#8CA1B6] uppercase tracking-wider block">Critical Deficits</span>
            <span className="text-[22px] font-bold font-mono text-[#34D399] tnum leading-tight">0 DEFICITS</span>
          </div>
        </div>
      </div>

      {requisitionSuccess && (
        <div className="p-3 rounded-sm bg-[#10291D] border border-[#34D399] text-[#34D399] text-xs font-mono font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
          <span>{requisitionSuccess}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-[#0F1722] p-3 rounded-sm border border-[#1E2C3D] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Station Selector */}
          <div className="flex items-center bg-[#131D2B] p-0.5 rounded-sm border border-[#1E2C3D] space-x-0.5">
            {(["ALL", "maitri", "bharati"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStationFilter(st)}
                className={`px-2.5 py-1 rounded-sm uppercase tracking-wider transition-colors text-[11px] ${
                  stationFilter === st
                    ? "bg-[#1E2C3D] text-[#E2EAF4] font-bold border border-[#38BDF8]"
                    : "text-[#8CA1B6] hover:text-[#E2EAF4]"
                }`}
              >
                {st === "ALL" ? "ALL STATIONS" : st.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Category Selector */}
          <div className="flex items-center bg-[#131D2B] p-0.5 rounded-sm border border-[#1E2C3D] space-x-0.5">
            {(["ALL", "FUEL", "FOOD", "MEDICAL", "SPARE_PARTS"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-1 rounded-sm uppercase tracking-wider transition-colors text-[11px] ${
                  categoryFilter === cat
                    ? "bg-[#1E2C3D] text-[#E2EAF4] font-bold border border-[#38BDF8]"
                    : "text-[#8CA1B6] hover:text-[#E2EAF4]"
                }`}
              >
                {cat.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-[#8CA1B6] absolute left-2.5 top-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter supply ID or item..."
            className="w-full bg-[#131D2B] border border-[#1E2C3D] rounded-sm pl-8 pr-3 py-1 text-xs font-mono text-[#E2EAF4] placeholder-[#5B7086] focus:outline-none focus:border-[#38BDF8]"
          />
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredItems.map((item) => {
          const Icon = getCategoryIcon(item.category);
          const pct = Math.round((item.current_level / item.max_capacity) * 100);
          const isWarning = item.days_remaining < 30 || pct < 30;

          return (
            <div
              key={item.id}
              className="p-4 rounded-sm bg-[#0F1722] border border-[#1E2C3D] hover:border-[#2A3B4F] space-y-3 transition-colors font-mono"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-sm bg-[#131D2B] border border-[#1E2C3D] text-[#38BDF8] shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-bold px-1.5 py-0.5 rounded-sm bg-[#131D2B] text-[#38BDF8] border border-[#1E2C3D] uppercase text-[10px]">
                        [{item.station_id.toUpperCase()}]
                      </span>
                      <span className="text-[#8CA1B6]">[{item.id}]</span>
                    </div>
                    <h3 className="font-semibold text-[15.5px] text-[#E2EAF4] mt-1 uppercase tracking-wide leading-snug">
                      {item.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => handleRequisition(item.name)}
                  className="px-2.5 py-1 rounded-sm bg-[#131D2B] hover:bg-[#1E2C3D] border border-[#1E2C3D] hover:border-[#38BDF8] text-[11px] font-semibold text-[#E2EAF4] flex items-center space-x-1 transition-colors"
                >
                  <PlusCircle className="w-3 h-3 text-[#38BDF8]" />
                  <span>REQUISITION</span>
                </button>
              </div>

              {/* Progress Meter */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-[#8CA1B6]">
                  <span>CURRENT STOCK CAPACITY</span>
                  <span className="font-bold text-[#E2EAF4] tnum text-sm">
                    {item.current_level.toLocaleString()} {item.unit} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#131D2B] border border-[#1E2C3D] rounded-none overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      pct > 60
                        ? "bg-[#34D399]"
                        : pct > 30
                        ? "bg-[#FBBF24]"
                        : "bg-[#F87171]"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Depletion Forecast Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1E2C3D] text-xs">
                <div className="bg-[#131D2B] p-2 rounded-sm border border-[#1E2C3D]">
                  <span className="text-[10px] text-[#8CA1B6] block mb-0.5 uppercase tracking-wider">EST. RUNWAY</span>
                  <span className="font-bold text-[#34D399] tnum text-[18px] leading-none block">
                    {item.days_remaining} DAYS
                  </span>
                </div>

                <div className="bg-[#131D2B] p-2 rounded-sm border border-[#1E2C3D]">
                  <span className="text-[10px] text-[#8CA1B6] block mb-0.5 uppercase tracking-wider">DAILY BURN</span>
                  <span className="font-bold text-[#E2EAF4] tnum text-sm block">
                    {item.burn_rate_daily} {item.unit}/D
                  </span>
                </div>

                <div className="bg-[#131D2B] p-2 rounded-sm border border-[#1E2C3D]">
                  <span className="text-[10px] text-[#8CA1B6] block mb-0.5">REORDER POINT</span>
                  <span className="font-bold text-[#E2EAF4] tnum">
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
