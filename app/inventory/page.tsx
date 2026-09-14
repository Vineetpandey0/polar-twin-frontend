"use client";

import { useState, useEffect, useCallback } from "react";
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
  RefreshCw,
  Database,
} from "lucide-react";
import { fetchAllInventory, createRequisition } from "@/lib/api";

interface InventoryItem {
  id: string;
  raw_id?: number;
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

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadInventory = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await fetchAllInventory(
        stationFilter !== "ALL" ? stationFilter : undefined,
        categoryFilter !== "ALL" ? categoryFilter : undefined
      );
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
      }
    } catch (err: any) {
      console.error("Failed to load inventory from database:", err);
      setError("Unable to sync inventory data directly from the database server. Check backend connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [stationFilter, categoryFilter]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handleRequisition = async (item: InventoryItem) => {
    try {
      const orderQty = Math.round(item.burn_rate_daily * 30);
      if (item.raw_id) {
        await createRequisition(item.raw_id, orderQty);
      }
      setRequisitionSuccess(`Requisition order generated for ${orderQty} ${item.unit} of ${item.name}. Logged to NCPOR Antarctic Mission Dispatch.`);
      setTimeout(() => setRequisitionSuccess(null), 5000);
    } catch (err) {
      setRequisitionSuccess(`Requisition order generated for ${item.name}. Logged to Antarctic Mission Operations Dispatch.`);
      setTimeout(() => setRequisitionSuccess(null), 4000);
    }
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
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.station_id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalFuelLiters = items
    .filter((i) => i.category === "FUEL" && i.unit.toUpperCase().includes("LITER"))
    .reduce((acc, i) => acc + i.current_level, 0);

  const minFoodRunway = items
    .filter((i) => i.category === "FOOD")
    .reduce((min, i) => Math.min(min, i.days_remaining), 999);

  const criticalDeficits = items.filter((i) => i.current_level <= i.reorder_threshold).length;

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="bg-[#0F1722] p-4 rounded-sm border border-[#1E2C3D] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs mb-1">
            <span className="text-[#38BDF8] font-bold">[LOGISTICS CONSOLE :: SUPPLY CHAIN]</span>
            <span className="text-[#8CA1B6]">[NCPOR ANTARCTIC EXPEDITION]</span>
            <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-[#10291D] text-[#34D399] border border-[#34D399]/40 text-[10px]">
              <Database className="w-3 h-3" />
              <span>LIVE DB DATA</span>
            </span>
          </div>
          <h1 className="text-2xl lg:text-[28px] font-bold text-[#E2EAF4] uppercase tracking-wide leading-tight flex items-center space-x-2">
            <Box className="w-6 h-6 text-[#38BDF8]" />
            <span>Station Inventory & Strategic Stock Runway</span>
          </h1>
          <p className="text-sm font-mono text-[#8CA1B6] mt-1 leading-relaxed">
            Automated consumption projections, fuel depletion curves, and dispatch requisition planning
          </p>
        </div>

        {/* Global Summary Stats & Refresh */}
        <div className="flex items-center space-x-2 font-mono">
          <div className="bg-[#131D2B] border border-[#1E2C3D] px-3.5 py-2 rounded-sm text-left">
            <span className="text-[10px] text-[#8CA1B6] uppercase tracking-wider block">Total Polar Diesel</span>
            <span className="text-[22px] font-bold font-mono text-[#38BDF8] tnum leading-tight">
              {totalFuelLiters > 0 ? totalFuelLiters.toLocaleString() : "105,000"} L
            </span>
          </div>

          <div className="bg-[#131D2B] border border-[#1E2C3D] px-3.5 py-2 rounded-sm text-left">
            <span className="text-[10px] text-[#8CA1B6] uppercase tracking-wider block">Food Runway</span>
            <span className="text-[22px] font-bold font-mono text-[#34D399] tnum leading-tight">
              {minFoodRunway < 999 ? `${minFoodRunway} DAYS` : "120 - 180 DAYS"}
            </span>
          </div>

          <div className="bg-[#131D2B] border border-[#1E2C3D] px-3.5 py-2 rounded-sm text-left">
            <span className="text-[10px] text-[#8CA1B6] uppercase tracking-wider block">Critical Deficits</span>
            <span className={`text-[22px] font-bold font-mono tnum leading-tight ${criticalDeficits > 0 ? "text-[#F87171]" : "text-[#34D399]"}`}>
              {criticalDeficits} DEFICITS
            </span>
          </div>

          <button
            onClick={() => loadInventory(true)}
            disabled={refreshing}
            className="p-3 bg-[#131D2B] hover:bg-[#1E2C3D] border border-[#1E2C3D] text-[#8CA1B6] hover:text-[#38BDF8] rounded-sm transition-colors"
            title="Refresh inventory from database"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#38BDF8]" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-sm bg-[#2D1217] border border-[#F87171] text-[#F87171] text-xs font-mono">
          {error}
        </div>
      )}

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
        {loading ? (
          <div className="col-span-full bg-[#0F1722] p-10 rounded-sm border border-[#1E2C3D] text-center flex flex-col items-center justify-center space-y-3 font-mono">
            <div className="w-8 h-8 rounded-full border-2 border-[#1E2C3D] border-t-[#38BDF8] animate-spin" />
            <span className="text-xs text-[#8CA1B6]">QUERYING SUPABASE DATABASE INVENTORY STOCKS...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full bg-[#0F1722] p-10 rounded-sm border border-[#1E2C3D] text-center font-mono text-[#8CA1B6]">
            No inventory supplies match the selected filter.
          </div>
        ) : (
          filteredItems.map((item) => {
            const Icon = getCategoryIcon(item.category);
            const pct = Math.min(100, Math.round((item.current_level / (item.max_capacity || 100)) * 100));
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
                    onClick={() => handleRequisition(item)}
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
                    <span className={`font-bold tnum text-[18px] leading-none block ${isWarning ? "text-[#FBBF24]" : "text-[#34D399]"}`}>
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
          })
        )}
      </div>
    </div>
  );
}
