"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { BHARATI_ASSET_REGISTRY, DigitalTwinAsset } from "@/lib/3d/assetRegistry";
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
  Database,
} from "lucide-react";

// WebGL Canvas (client-only)
const StationCanvas = dynamic(() => import("@/components/3d/StationCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-[#070A0F] rounded-sm border border-[#1E293B]">
      <div className="w-8 h-8 border-2 border-[#38BDF8]/30 border-t-[#38BDF8] rounded-full animate-spin mb-3" />
      <span className="text-xs text-[#38BDF8] font-mono tracking-wider">INITIALISING BHARATI 3D TELEMETRY...</span>
    </div>
  ),
});

export default function BharatiDetailsPage() {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>("BLD-BHA-MAIN");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Interactive Simulators State
  const [ageosSatellite, setAgeosSatellite] = useState<string>("CARTOSAT-3");
  const [downlinkRate, setDownlinkRate] = useState<number>(105);
  const [roSalinity, setRoSalinity] = useState<number>(34500);
  const [chpLoadKw, setChpLoadKw] = useState<number>(135);

  const assetsList = useMemo(() => Object.values(BHARATI_ASSET_REGISTRY), []);

  const filteredAssets = useMemo(() => {
    return assetsList.filter((a) => {
      const matchCat = selectedCategory === "ALL" || a.category === selectedCategory;
      const matchSearch =
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [assetsList, selectedCategory, searchQuery]);

  const selectedAsset = selectedAssetId ? BHARATI_ASSET_REGISTRY[selectedAssetId] || null : null;

  // Compute calculated RO Permeate Purity based on salinity slider
  const calculatedRoPurity = useMemo(() => {
    const factor = roSalinity / 34500;
    return Math.round(85 * factor);
  }, [roSalinity]);

  // Compute calculated CHP Recovered Hydronic Heat Output
  const calculatedHydronicHeatKw = useMemo(() => {
    return Math.round(chpLoadKw * 1.22);
  }, [chpLoadKw]);

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-8">
      {/* Header Banner - Mission Control Console Style */}
      <div className="bg-[#0F1722] p-5 rounded-sm border border-[#1E293B]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-1.5">
              <span className="bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-0.5 rounded-sm text-[11px] font-mono font-semibold">
                STATION-03 // BHARATI
              </span>
              <span className="text-[#8CA1B6] text-xs font-mono">69°24′28″ S, 76°11′14″ E • Est. 18 Mar 2012</span>
            </div>
            <h1 className="text-2xl lg:text-[28px] font-bold text-[#E2EAF4] tracking-wide leading-tight flex items-center space-x-3">
              <span>Bharati Research Station</span>
              <span className="text-[#8CA1B6] font-normal text-sm font-mono">[भारती]</span>
              <span className="text-[#38BDF8] text-xs font-mono font-medium px-2 py-0.5 bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-sm">
                SCADA MACHINERY & DIGITAL TWIN HUB
              </span>
            </h1>
            <p className="text-[#8CA1B6] text-sm mt-1.5 max-w-4xl leading-relaxed">
              Aerodynamic superstructure anchored to Larsemann Hills bedrock on 83 GEWI steel piles. Telemetry feeds track 134 ISO container structural health, dual ISRO AGEOS 7.3m satellite radomes, MAN CHP thermal loops, and Prydz Bay seawater RO desalination.
            </p>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <Link
              href="/stations/bharati/3d"
              className="px-3.5 py-2 rounded-sm bg-[#38BDF8] hover:bg-[#0284C7] text-[#090D14] font-semibold text-xs transition-colors flex items-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="tracking-wide">FULLSCREEN VIEWPORT</span>
            </Link>
            <Link
              href="/stations/bharati"
              className="px-3.5 py-2 rounded-sm bg-[#131D2B] hover:bg-[#1E293B] text-[#E2EAF4] font-medium text-xs border border-[#1E293B] transition-colors flex items-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
            >
              <Radio className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="tracking-wide">STATION OVERVIEW</span>
            </Link>
          </div>
        </div>

        {/* Quick Station Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-4 pt-3 border-t border-[#1E293B] text-xs font-mono">
          <div className="bg-[#090D14] p-2.5 rounded-sm border border-[#1E293B]">
            <span className="text-[10px] text-[#8CA1B6] block uppercase tracking-wider">Location</span>
            <span className="font-semibold text-sm text-[#E2EAF4]">Larsemann Hills</span>
          </div>
          <div className="bg-[#090D14] p-2.5 rounded-sm border border-[#1E293B]">
            <span className="text-[10px] text-[#8CA1B6] block uppercase tracking-wider">Winter Complement</span>
            <span className="font-semibold text-sm text-[#34D399] tnum">24 Personnel</span>
          </div>
          <div className="bg-[#090D14] p-2.5 rounded-sm border border-[#1E293B]">
            <span className="text-[10px] text-[#8CA1B6] block uppercase tracking-wider">Summer Expedition</span>
            <span className="font-semibold text-sm text-[#38BDF8] tnum">47 Personnel</span>
          </div>
          <div className="bg-[#090D14] p-2.5 rounded-sm border border-[#1E293B]">
            <span className="text-[10px] text-[#8CA1B6] block uppercase tracking-wider">Desalination Loop</span>
            <span className="font-semibold text-sm text-[#34D399] tnum">4,500 L/day RO</span>
          </div>
          <div className="bg-[#090D14] p-2.5 rounded-sm border border-[#1E293B]">
            <span className="text-[10px] text-[#8CA1B6] block uppercase tracking-wider">Satellite Comms</span>
            <span className="font-semibold text-sm text-[#E2EAF4]">Dual ISRO AGEOS</span>
          </div>
          <div className="bg-[#090D14] p-2.5 rounded-sm border border-[#1E293B]">
            <span className="text-[10px] text-[#8CA1B6] block uppercase tracking-wider">Architecture</span>
            <span className="font-semibold text-sm text-[#E2EAF4] tnum">134 ISO Units</span>
          </div>
        </div>
      </div>

      {/* Main Dual-Pane Section: 3D Interactive Canvas + Asset Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Interactive 3D Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0F1722] p-3.5 rounded-sm border border-[#1E293B] flex flex-col h-[680px]">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-[#38BDF8]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#E2EAF4]">
                Interactive 3D Digital Twin Viewport
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#8CA1B6]">
              SELECT 3D NODE TO FOCUS TELEMETRY
            </span>
          </div>

          <div className="flex-1 w-full rounded-sm overflow-hidden relative border border-[#1E293B] bg-[#070A0F]">
            <StationCanvas
              stationId="bharati"
              selectedAssetId={selectedAssetId}
              onSelectAsset={(id: string | null) => setSelectedAssetId(id)}
              minimalMode={true}
            />
          </div>

          {selectedAsset && (
            <div className="mt-2.5 bg-[#090D14] p-3 rounded-sm border border-[#1E293B] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] text-[#8CA1B6] uppercase font-mono block">Active Telemetry Focus</span>
                <span className="font-bold text-[#E2EAF4]">{selectedAsset.name}</span>
              </div>
              <div className="flex items-center space-x-5 font-mono text-[11px]">
                <div>
                  <span className="text-[#8CA1B6]">STATUS: </span>
                  <span className={`font-semibold ${selectedAsset.operationalStatus === "RUNNING" ? "text-[#34D399]" : "text-[#FBBF24]"}`}>
                    {selectedAsset.operationalStatus}
                  </span>
                </div>
                <div>
                  <span className="text-[#8CA1B6]">HEALTH: </span>
                  <span className="font-semibold text-[#38BDF8]">{Math.round(selectedAsset.healthScore * 100)}%</span>
                </div>
                <div>
                  <span className="text-[#8CA1B6]">RUL: </span>
                  <span className="font-semibold text-[#FBBF24]">{selectedAsset.rulHours}h</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Asset Inspector & Search Grid (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0F1722] p-4 rounded-sm border border-[#1E293B] flex flex-col h-[680px] overflow-hidden">
          {/* Category Filter Tabs */}
          <div className="space-y-2.5 shrink-0 mb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#E2EAF4] flex items-center gap-1.5 uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5 text-[#38BDF8]" />
                Equipment & Systems Directory
              </h2>
              <span className="text-[11px] text-[#8CA1B6] font-mono">{filteredAssets.length} Nodes</span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8CA1B6]" />
              <input
                type="text"
                placeholder="Filter machinery, radomes, pumps, vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#090D14] border border-[#1E293B] rounded-sm pl-8 pr-3 py-1.5 text-xs text-[#E2EAF4] placeholder-[#8CA1B6]/60 focus:outline-none focus:border-[#38BDF8] font-mono transition-colors"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: "ALL", label: "All Nodes", icon: Layers },
                { id: "BUILDING", label: "Architecture", icon: Building },
                { id: "POWER", label: "MAN CHP", icon: Zap },
                { id: "WATER", label: "Seawater RO", icon: Droplets },
                { id: "COMMS", label: "ISRO AGEOS", icon: Radio },
                { id: "SCIENCE", label: "Science", icon: Activity },
                { id: "VEHICLE", label: "Vehicles", icon: Truck },
              ].map((tab) => {
                const isAct = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-2.5 py-1 rounded-sm text-[11px] font-mono transition-colors ${
                      isAct
                        ? "bg-[#38BDF8] text-[#090D14] font-bold"
                        : "bg-[#090D14] text-[#8CA1B6] hover:bg-[#131D2B] hover:text-[#E2EAF4] border border-[#1E293B]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Asset List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredAssets.map((asset) => {
              const isSelected = selectedAssetId === asset.assetId;
              const statusColor = getStatusColor(asset.operationalStatus, asset.healthScore);

              return (
                <div
                  key={asset.assetId}
                  onClick={() => setSelectedAssetId(asset.assetId)}
                  className={`p-3 rounded-sm border transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#131D2B] border-[#38BDF8]"
                      : "bg-[#090D14] border-[#1E293B] hover:border-[#334155] hover:bg-[#0C131D]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-2 h-2 rounded-sm shrink-0"
                          style={{ backgroundColor: statusColor }}
                        />
                        <span className="font-semibold text-xs text-[#E2EAF4]">{asset.name}</span>
                      </div>
                      <span className="text-[10px] text-[#8CA1B6] font-mono block mt-0.5">
                        {asset.assetId} // {asset.category}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAssetId(asset.assetId);
                      }}
                      className="px-2 py-1 rounded-sm bg-[#131D2B] hover:bg-[#1E293B] text-[#38BDF8] border border-[#1E293B] text-[10px] font-mono transition-colors"
                    >
                      [FOCUS 3D]
                    </button>
                  </div>

                  {/* Sensor Readings Preview Grid */}
                  <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-[#1E293B] text-[11px]">
                    {Object.entries(asset.readings || {}).slice(0, 4).map(([key, val]: [string, any]) => (
                      <div key={key} className="bg-[#070A0F] p-1.5 rounded-sm border border-[#1E293B]">
                        <span className="text-[9px] text-[#8CA1B6] block truncate font-mono">{val.label || key}</span>
                        <span className="font-mono font-semibold text-[#E2EAF4]">
                          {val.value} <span className="text-[10px] text-[#8CA1B6] font-normal">{val.unit}</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Specifications Snippet */}
                  {asset.specifications && (
                    <div className="mt-1.5 text-[10px] text-[#8CA1B6] bg-[#070A0F] p-1.5 rounded-sm font-mono leading-tight border border-[#1E293B]">
                      {Object.entries(asset.specifications)[0]?.[0]}: {Object.entries(asset.specifications)[0]?.[1]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4 Interactive Operational Simulators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Simulator 1: ISRO AGEOS Polar Satellite Downlink Tracker */}
        <div className="bg-[#0F1722] p-4 rounded-sm border border-[#1E293B] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-[#38BDF8]" />
              <h3 className="font-semibold text-xs text-[#E2EAF4] uppercase tracking-wide">
                ISRO AGEOS Polar Orbit Downlink Tracker
              </h3>
            </div>
            <span className="bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 text-[10px] font-mono px-2 py-0.5 rounded-sm">
              NRSC DUAL 7.3M RADOMES
            </span>
          </div>

          <p className="text-xs text-[#8CA1B6] leading-relaxed">
            Simulate polar orbit satellite passes (Cartosat, Resourcesat, OceanSat) over Bharati's tracking dishes.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {["CARTOSAT-3", "RESOURCESAT-2A", "OCEANSAT-3"].map((sat) => (
              <button
                key={sat}
                onClick={() => {
                  setAgeosSatellite(sat);
                  setDownlinkRate(sat === "CARTOSAT-3" ? 105 : sat === "RESOURCESAT-2A" ? 85 : 92);
                }}
                className={`py-1.5 rounded-sm text-[11px] font-mono font-semibold border transition-colors ${
                  ageosSatellite === sat
                    ? "bg-[#38BDF8] text-[#090D14] border-[#38BDF8]"
                    : "bg-[#090D14] text-[#8CA1B6] border-[#1E293B] hover:border-[#334155] hover:text-[#E2EAF4]"
                }`}
              >
                {sat}
              </button>
            ))}
          </div>

          <div className="bg-[#090D14] p-3 rounded-sm border border-[#1E293B] space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#8CA1B6]">TARGET MISSION:</span>
              <span className="font-bold text-[#38BDF8]">{ageosSatellite}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8CA1B6]">DOWNLINK THROUGHPUT:</span>
              <span className="font-bold text-[#34D399]">{downlinkRate} Mbps</span>
            </div>
            <div className="w-full bg-[#070A0F] rounded-sm h-1.5 overflow-hidden border border-[#1E293B]">
              <div
                className="bg-[#38BDF8] h-full transition-all duration-300"
                style={{ width: `${(downlinkRate / 120) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Simulator 2: Prydz Bay Seawater RO Desalination Simulator */}
        <div className="bg-[#0F1722] p-4 rounded-sm border border-[#1E293B] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-[#38BDF8]" />
              <h3 className="font-semibold text-xs text-[#E2EAF4] uppercase tracking-wide">
                Prydz Bay Seawater RO Desalination Loop
              </h3>
            </div>
            <span className="bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 text-[10px] font-mono px-2 py-0.5 rounded-sm">
              4,500 L/DAY CAP
            </span>
          </div>

          <p className="text-xs text-[#8CA1B6] leading-relaxed">
            Adjust Prydz Bay seawater intake salinity TDS to calculate high-pressure pump load and permeate purity.
          </p>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8CA1B6]">Raw Intake Salinity:</span>
              <span className="text-[#38BDF8] font-bold">{roSalinity} ppm TDS</span>
            </div>
            <input
              type="range"
              min="28000"
              max="40000"
              step="500"
              value={roSalinity}
              onChange={(e) => setRoSalinity(Number(e.target.value))}
              className="w-full accent-[#38BDF8] bg-[#1E293B] h-1.5 rounded-sm cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-[#090D14] p-2.5 rounded-sm border border-[#1E293B]">
              <span className="text-[10px] text-[#8CA1B6] block">MEMBRANE PRESSURE</span>
              <span className="font-bold text-[#E2EAF4]">58.4 bar</span>
            </div>
            <div className="bg-[#090D14] p-2.5 rounded-sm border border-[#1E293B]">
              <span className="text-[10px] text-[#8CA1B6] block">PERMEATE PURITY</span>
              <span className="font-bold text-[#34D399]">{calculatedRoPurity} ppm TDS</span>
            </div>
          </div>
        </div>

        {/* Simulator 3: MAN CHP Waste-Heat Recovery Thermal Calculator */}
        <div className="bg-[#0F1722] p-4 rounded-sm border border-[#1E293B] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-[#FBBF24]" />
              <h3 className="font-semibold text-xs text-[#E2EAF4] uppercase tracking-wide">
                MAN CHP Waste Heat Recovery Thermal Loop
              </h3>
            </div>
            <span className="bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/30 text-[10px] font-mono px-2 py-0.5 rounded-sm">
              82% FUEL EFF
            </span>
          </div>

          <p className="text-xs text-[#8CA1B6] leading-relaxed">
            Simulate electrical demand to calculate captured hydronic heat output used to warm the station in -40°C blizzards.
          </p>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#8CA1B6]">CHP Electrical Demand:</span>
              <span className="text-[#FBBF24] font-bold">{chpLoadKw} kW</span>
            </div>
            <input
              type="range"
              min="80"
              max="200"
              step="5"
              value={chpLoadKw}
              onChange={(e) => setChpLoadKw(Number(e.target.value))}
              className="w-full accent-[#FBBF24] bg-[#1E293B] h-1.5 rounded-sm cursor-pointer"
            />
          </div>

          <div className="bg-[#090D14] p-2.5 rounded-sm border border-[#1E293B] flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#8CA1B6] block">RECOVERED THERMAL HEAT</span>
              <span className="text-sm font-bold text-[#E2EAF4]">{calculatedHydronicHeatKw} kW</span>
            </div>
            <span className="text-[10px] bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30 px-2 py-0.5 rounded-sm">
              100% HEATING MET
            </span>
          </div>
        </div>

        {/* Simulator 4: ISO Container Architecture Explorer */}
        <div className="bg-[#0F1722] p-4 rounded-sm border border-[#1E293B] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Box className="w-4 h-4 text-[#38BDF8]" />
              <h3 className="font-semibold text-xs text-[#E2EAF4] uppercase tracking-wide">
                134 ISO Container Modular Superstructure
              </h3>
            </div>
            <span className="bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 text-[10px] font-mono px-2 py-0.5 rounded-sm">
              BOF ARCHITEKTEN
            </span>
          </div>

          <p className="text-xs text-[#8CA1B6] leading-relaxed">
            Standard 20-ft intermodal containers wrapped in an insulated aerodynamic aluminium skin on 83 GEWI piles.
          </p>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-[#090D14] p-2.5 rounded-sm border border-[#1E293B]">
              <span className="text-[10px] text-[#8CA1B6] block">LOWER LEVEL</span>
              <span className="font-semibold text-[#E2EAF4]">Labs & Heavy Plant</span>
            </div>
            <div className="bg-[#090D14] p-2.5 rounded-sm border border-[#1E293B]">
              <span className="text-[10px] text-[#8CA1B6] block">UPPER LEVEL</span>
              <span className="font-semibold text-[#E2EAF4]">24 Living Modules</span>
            </div>
            <div className="bg-[#090D14] p-2.5 rounded-sm border border-[#1E293B]">
              <span className="text-[10px] text-[#8CA1B6] block">ROOF LEVEL</span>
              <span className="font-semibold text-[#E2EAF4]">HVAC & Terrace</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Bharati SCADA Machinery Signal Matrix */}
      <div className="bg-[#0F1722] p-4 rounded-sm border border-[#1E293B] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#E2EAF4] flex items-center gap-1.5 uppercase tracking-wide">
              <Database className="w-4 h-4 text-[#38BDF8]" />
              SCADA Machinery & Instrumentation Signal Matrix
            </h2>
            <p className="text-xs text-[#8CA1B6] mt-0.5">
              Technical telemetry dictionary for all registered digital twin nodes under NCPOR station specifications.
            </p>
          </div>
          <span className="text-xs font-mono bg-[#090D14] text-[#8CA1B6] px-2.5 py-1 rounded-sm border border-[#1E293B]">
            {assetsList.length} REGISTERED NODES
          </span>
        </div>

        <div className="overflow-x-auto rounded-sm border border-[#1E293B]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#090D14] text-[#8CA1B6] border-b border-[#1E293B] uppercase font-mono text-[10px]">
                <th className="p-2.5">Asset ID // Name</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">SCADA Status</th>
                <th className="p-2.5">Health</th>
                <th className="p-2.5">Key Sensor Readings</th>
                <th className="p-2.5">Specifications</th>
                <th className="p-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] bg-[#070A0F]">
              {assetsList.map((asset) => {
                const statusColor = getStatusColor(asset.operationalStatus, asset.healthScore);
                return (
                  <tr
                    key={asset.assetId}
                    className="hover:bg-[#0F1722] transition-colors"
                  >
                    <td className="p-2.5 font-medium text-[#E2EAF4]">
                      <div>{asset.name}</div>
                      <span className="text-[10px] font-mono text-[#8CA1B6]">{asset.assetId}</span>
                    </td>
                    <td className="p-2.5 font-mono text-[#8CA1B6] text-[11px]">{asset.category}</td>
                    <td className="p-2.5">
                      <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono border border-[#1E293B] bg-[#090D14]">
                        <span className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: statusColor }} />
                        <span className="text-[#E2EAF4]">{asset.operationalStatus}</span>
                      </span>
                    </td>
                    <td className="p-2.5 font-mono font-semibold text-[#38BDF8]">
                      {Math.round(asset.healthScore * 100)}%
                    </td>
                    <td className="p-2.5">
                      <div className="space-y-0.5 text-[11px] font-mono">
                        {Object.entries(asset.readings || {}).slice(0, 2).map(([k, v]: [string, any]) => (
                          <div key={k} className="text-[#8CA1B6]">
                            <span>{v.label || k}: </span>
                            <span className="text-[#E2EAF4] font-semibold">{v.value} {v.unit}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-2.5 text-[11px] text-[#8CA1B6] max-w-xs truncate font-mono">
                      {Object.values(asset.specifications || {})[0]}
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => setSelectedAssetId(asset.assetId)}
                        className="px-2.5 py-1 rounded-sm bg-[#131D2B] hover:bg-[#1E293B] text-[#38BDF8] border border-[#1E293B] text-[10px] font-mono transition-colors"
                      >
                        [INSPECT]
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
