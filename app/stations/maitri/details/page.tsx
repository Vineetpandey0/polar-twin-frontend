"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MAITRI_ASSET_REGISTRY, DigitalTwinAsset } from "@/lib/3d/assetRegistry";
import { getStatusColor } from "@/lib/3d/materials";
import {
  Radio,
  Truck,
  Building,
  Zap,
  Droplets,
  Activity,
  Compass,
  Sliders,
  Maximize2,
  Search,
  CheckCircle2,
  Flame,
  Globe,
  Gauge,
  Box,
  Layers,
  Award,
  Database,
  ArrowRight,
  Coffee,
  Sparkles,
  Play,
  RotateCcw,
} from "lucide-react";

// WebGL Canvas (client-only)
const StationCanvas = dynamic(() => import("@/components/3d/StationCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-950 rounded-2xl border border-slate-800">
      <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin mb-3" />
      <span className="text-xs text-amber-400 font-mono animate-pulse">Initialising Maitri 3D Twin...</span>
    </div>
  ),
});

export default function MaitriDetailsPage() {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>("BLD-MAI-MAIN");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Playful Interactive Simulators State for Maitri
  const [cadiFrequency, setCadiFrequency] = useState<number>(4.85); // MHz
  const [lakeFlowRate, setLakeFlowRate] = useState<number>(160); // L/h
  const [genLoadKw, setGenLoadKw] = useState<number>(110); // kW
  const [convoyProgress, setConvoyProgress] = useState<number>(0);
  const [isConvoyRunning, setIsConvoyRunning] = useState<boolean>(false);
  const [teaCount, setTeaCount] = useState<number>(142);

  const assetsList = useMemo(() => Object.values(MAITRI_ASSET_REGISTRY), []);

  const filteredAssets = useMemo(() => {
    return assetsList.filter((a) => {
      const matchCat =
        selectedCategory === "ALL" ||
        a.category === selectedCategory ||
        (selectedCategory === "HUTS" && a.assetId.startsWith("HUT-"));
      const matchSearch =
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Object.values(a.specifications || {}).some((val) =>
          val.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchCat && matchSearch;
    });
  }, [assetsList, selectedCategory, searchQuery]);

  const selectedAsset = selectedAssetId ? MAITRI_ASSET_REGISTRY[selectedAssetId] || null : null;

  // Compute calculated Lake Priyadarshini Potable Water Buffer Volume
  const calculatedPotableBuffer = useMemo(() => {
    return Math.round(lakeFlowRate * 51.25);
  }, [lakeFlowRate]);

  // Compute calculated Kirloskar Genset Hydronic Heat Output
  const calculatedHydronicHeatKw = useMemo(() => {
    return Math.round(genLoadKw * 1.18);
  }, [genLoadKw]);

  // Run 100km convoy simulation tick
  const handleStartConvoy = () => {
    setIsConvoyRunning(true);
    setConvoyProgress(0);
    const interval = setInterval(() => {
      setConvoyProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsConvoyRunning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-cyan-950/40 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> India's 2nd Antarctic Station
              </span>
              <span className="text-slate-400 text-xs font-mono">Commissioned 26 January 1989</span>
            </div>
            <h1 className="text-3xl font-black text-slate-100 tracking-tight flex items-center space-x-3">
              <span>Maitri Research Station</span>
              <span className="text-amber-400 font-light font-mono">(मैत्री)</span>
              <span className="text-slate-400 font-light text-xl">Machinery & Digital Twin Hub</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1 max-w-3xl leading-relaxed">
              Explore the U-shaped habitat complex elevated on steel stilts in Schirmacher Oasis, 3× Kirloskar heavy-duty diesel gensets, Lake Priyadarshini meltwater pump house, 13 scientific research suites (MARA VHF Radar, CADI Ionosonde), and 14 PistenBully tracked vehicles.
            </p>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href="/stations/maitri/3d"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg glow-amber flex items-center space-x-2"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Full Screen 3D Viewport</span>
            </Link>
            <Link
              href="/stations/maitri"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center space-x-2"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Station Overview</span>
            </Link>
          </div>
        </div>

        {/* Quick Station Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-6 pt-4 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Location</span>
            <span className="font-bold text-amber-400">Schirmacher Oasis</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Winter Complement</span>
            <span className="font-bold text-emerald-400">25 Crew</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Summer Expedition</span>
            <span className="font-bold text-cyan-400">65 Crew</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Freshwater Source</span>
            <span className="font-bold text-slate-200">Lake Priyadarshini</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">PistenBully Fleet</span>
            <span className="font-bold text-amber-400">14 PB-300 Units</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Science Suites</span>
            <span className="font-bold text-purple-400">13 Research Instruments</span>
          </div>
        </div>
      </div>

      {/* Main Dual-Pane Section: 3D Interactive Canvas + Asset Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive 3D Canvas (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-4 rounded-3xl border border-slate-800 flex flex-col h-[700px]">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Interactive 3D Digital Twin Viewport</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Click any 3D asset to inspect machinery signals
            </span>
          </div>

          <div className="flex-1 w-full rounded-2xl overflow-hidden relative border border-slate-800/80 bg-slate-950">
            <StationCanvas
              stationId="maitri"
              selectedAssetId={selectedAssetId}
              onSelectAsset={(id: string | null) => setSelectedAssetId(id)}
              minimalMode={true}
            />
          </div>

          {selectedAsset && (
            <div className="mt-3 bg-slate-900/90 p-3 rounded-2xl border border-amber-500/40 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Currently Focused 3D Asset</span>
                <span className="font-bold text-amber-300">{selectedAsset.name}</span>
              </div>
              <div className="flex items-center space-x-4 font-mono text-[11px]">
                <div>
                  <span className="text-slate-500">Status: </span>
                  <span className="font-bold text-emerald-400">{selectedAsset.operationalStatus}</span>
                </div>
                <div>
                  <span className="text-slate-500">Health: </span>
                  <span className="font-bold text-cyan-400">{Math.round(selectedAsset.healthScore * 100)}%</span>
                </div>
                <div>
                  <span className="text-slate-500">RUL: </span>
                  <span className="font-bold text-amber-400">{selectedAsset.rulHours} hrs</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Asset Inspector & Search Grid (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col h-[700px] overflow-hidden">
          {/* Category Filter Tabs */}
          <div className="space-y-3 shrink-0 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                Equipment & Systems Explorer
              </h2>
              <span className="text-xs text-slate-400 font-mono">{filteredAssets.length} Assets Found</span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search gensets, Lake Priyadarshini, MARA radar, vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "ALL", label: "All Assets", icon: Layers },
                { id: "BUILDING", label: "Architecture", icon: Building },
                { id: "POWER", label: "Gensets & Power", icon: Zap },
                { id: "WATER", label: "Lake Water", icon: Droplets },
                { id: "SCIENCE", label: "Science & Radar", icon: Activity },
                { id: "HUTS", label: "Outdoor Huts", icon: Building },
                { id: "LOGISTICS", label: "Vehicles & Fleet", icon: Truck },
              ].map((tab) => {
                const Icon = tab.icon;
                const isAct = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                      isAct
                        ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                        : "bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Asset List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filteredAssets.map((asset) => {
              const isSelected = selectedAssetId === asset.assetId;
              const statusColor = getStatusColor(asset.operationalStatus, asset.healthScore);

              return (
                <div
                  key={asset.assetId}
                  onClick={() => setSelectedAssetId(asset.assetId)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-slate-900 border-amber-500 shadow-lg glow-amber"
                      : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: statusColor }}
                        />
                        <span className="font-bold text-xs text-slate-100">{asset.name}</span>
                      </div>
                      <span className="text-[10px] text-amber-400 font-mono block mt-0.5">
                        ID: {asset.assetId} | {asset.category}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAssetId(asset.assetId);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold transition-all flex items-center space-x-1"
                    >
                      <span>Focus 3D</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Sensor Readings Preview Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-slate-800/80 text-[11px]">
                    {Object.entries(asset.readings || {}).slice(0, 4).map(([key, val]) => (
                      <div key={key} className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/60">
                        <span className="text-[9px] text-slate-400 block truncate">{val.label || key}</span>
                        <span className="font-mono font-bold text-slate-200">
                          {val.value} <span className="text-[10px] text-amber-400 font-normal">{val.unit}</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Specifications Snippet */}
                  {asset.specifications && (
                    <div className="mt-2 text-[10px] text-slate-400 bg-slate-950/40 p-2 rounded-lg font-mono leading-tight border border-slate-800/40">
                      {Object.entries(asset.specifications)[0]?.[0]}: {Object.entries(asset.specifications)[0]?.[1]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4 Interactive Playful Simulators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simulator 1: CADI Ionosonde & VHF Radar Sounding Simulator */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 bg-gradient-to-br from-slate-900 to-rose-950/30 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Radio className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-sm text-slate-100">CADI Ionosonde & VHF Radar Sounding Simulator</h3>
            </div>
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              Ionosphere 1–30 MHz
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Simulate High-Frequency RF sounding sweeps to diagnose polar ionospheric electron density and critical F2 layer height.
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">Sounding Sweep Frequency:</span>
              <span className="text-rose-300 font-bold">{cadiFrequency.toFixed(2)} MHz</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="30.0"
              step="0.05"
              value={cadiFrequency}
              onChange={(e) => setCadiFrequency(parseFloat(e.target.value))}
              className="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Critical F2 Frequency (foF2):</span>
              <span className="font-bold text-rose-400">{cadiFrequency.toFixed(2)} MHz</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Ionosphere Reflection Height:</span>
              <span className="font-bold text-amber-400">{Math.round(200 + cadiFrequency * 9.2)} km</span>
            </div>
          </div>
        </div>

        {/* Simulator 2: Lake Priyadarshini Water Intake & Buffer Simulator */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 bg-gradient-to-br from-slate-900 to-cyan-950/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplets className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-slate-100">Lake Priyadarshini Water Intake Simulator</h3>
            </div>
            <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              Sub-Ice Meltwater Pump
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Adjust sub-ice meltwater intake flow rate from Lake Priyadarshini to compute station water treatment buffer.
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Sub-Ice Intake Flow Rate:</span>
              <span className="font-mono text-cyan-300 font-bold">{lakeFlowRate} L/h</span>
            </div>
            <input
              type="range"
              min="80"
              max="250"
              step="10"
              value={lakeFlowRate}
              onChange={(e) => setLakeFlowRate(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Heated Pipeline Trace</span>
              <span className="text-base font-mono font-bold text-cyan-400">8.5°C</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Calculated Potable Buffer</span>
              <span className="text-base font-mono font-bold text-emerald-400">{calculatedPotableBuffer} Liters</span>
            </div>
          </div>
        </div>

        {/* Simulator 3: Kirloskar Genset Hydronic Waste-Heat Calculator */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 bg-gradient-to-br from-slate-900 to-amber-950/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-sm text-slate-100">Kirloskar Genset Hydronic Heat Calculator</h3>
            </div>
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              3x 125 kVA Gensets
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Simulate Maitri's active power load demand to calculate captured hydronic heat output used to warm the U-shaped complex.
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Station Power Demand Load:</span>
              <span className="font-mono text-amber-300 font-bold">{genLoadKw} kW</span>
            </div>
            <input
              type="range"
              min="50"
              max="180"
              step="5"
              value={genLoadKw}
              onChange={(e) => setGenLoadKw(Number(e.target.value))}
              className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Captured Hydronic Thermal Heat</span>
              <span className="text-lg font-mono font-bold text-amber-400">{calculatedHydronicHeatKw} kW</span>
            </div>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold">
              Hydronic Loop Active
            </span>
          </div>
        </div>

        {/* Simulator 4: 100km Ice Shelf Convoy Route Simulator */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 bg-gradient-to-br from-slate-900 to-purple-950/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-sm text-slate-100">100 km Ice Shelf Convoy Route Simulator</h3>
            </div>
            <button
              disabled={isConvoyRunning}
              onClick={handleStartConvoy}
              className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 disabled:opacity-50 border border-purple-500/40 text-xs font-bold flex items-center space-x-1 transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isConvoyRunning ? "Convoy Moving..." : "Launch Convoy"}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400">
            14 PistenBully PB-300 crawlers hauling the 'Banjara' living module, 'Jeevan Jyoti' emergency genset, and 5 KL fuel tanker.
          </p>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Maitri Station</span>
              <span>{convoyProgress}% ({Math.round(convoyProgress)} km)</span>
              <span>Indian Ocean Shelf</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 to-purple-400 h-full transition-all duration-300"
                style={{ width: `${convoyProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Complete Maitri SCADA Machinery Signal Matrix */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              Complete Maitri Machinery & Instrumentation Signals Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Detailed technical telemetry dictionary for all 30+ digital twin assets documented in maitri.md
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl self-start border border-slate-700">
            {assetsList.length} Registered Telemetry Nodes
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
                <th className="p-3">Asset Name & ID</th>
                <th className="p-3">Category</th>
                <th className="p-3">SCADA Status</th>
                <th className="p-3">Health Score</th>
                <th className="p-3">Key Telemetry Readings</th>
                <th className="p-3">Technical Specifications</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {assetsList.map((asset) => {
                const statusColor = getStatusColor(asset.operationalStatus, asset.healthScore);
                return (
                  <tr
                    key={asset.assetId}
                    className="hover:bg-slate-900/60 transition-colors"
                  >
                    <td className="p-3 font-semibold text-slate-100">
                      <div>{asset.name}</div>
                      <span className="text-[10px] font-mono text-amber-400">{asset.assetId}</span>
                    </td>
                    <td className="p-3 font-mono text-slate-300 text-[11px]">{asset.category}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-slate-700 bg-slate-900">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
                        <span>{asset.operationalStatus}</span>
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-cyan-400">
                      {Math.round(asset.healthScore * 100)}%
                    </td>
                    <td className="p-3">
                      <div className="space-y-0.5 text-[11px] font-mono">
                        {Object.entries(asset.readings || {}).slice(0, 2).map(([k, v]) => (
                          <div key={k} className="text-slate-300">
                            <span className="text-slate-500">{v.label || k}: </span>
                            <span className="text-slate-100 font-bold">{v.value} {v.unit}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-[11px] text-slate-400 max-w-xs truncate">
                      {Object.values(asset.specifications || {})[0]}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedAssetId(asset.assetId)}
                        className="px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
                      >
                        Inspect 3D
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
