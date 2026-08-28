"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Sliders,
  Play,
  ArrowLeft,
  AlertTriangle,
  Zap,
  Wind,
  Radio,
  Fuel,
  CheckCircle2,
  TrendingDown,
  Activity,
} from "lucide-react";

export default function ScenarioRunnerPage() {
  const params = useParams();
  const stationId = (params.id as string) || "maitri";
  const isMaitri = stationId === "maitri";

  const [selectedScenario, setSelectedScenario] = useState<string>("generator_failure");
  const [tempDelta, setTempDelta] = useState<number>(-20);
  const [running, setRunning] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const scenarioOptions = [
    {
      id: "generator_failure",
      name: "Primary Generator 1 Trip / Outage",
      description: "Cascades to secondary unit, battery discharge rate increases, auxiliary load shedding triggered.",
      icon: Zap,
    },
    {
      id: "extreme_weather",
      name: "Extreme Blizzard & Thermal Drop",
      description: "Ambient drops to -45°C, heating loop increases duty cycle, fuel consumption rises +35%.",
      icon: Wind,
    },
    {
      id: "comms_loss",
      name: "Ku-band Ground Station Blackout",
      description: "Satellite tracking loss, station transitions to Autonomous Local Ingestion Mode.",
      icon: Radio,
    },
    {
      id: "fuel_critical",
      name: "Critical Fuel Reserve Depletion",
      description: "Storage drops to 15% threshold; emergency generator cycling protocol activated.",
      icon: Fuel,
    },
  ];

  const handleRunScenario = async () => {
    setRunning(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/stations/${stationId}/scenarios/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: selectedScenario }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      // Local fallback diff generator
      setResult({
        station_id: stationId,
        scenario: selectedScenario,
        current_state: {
          station_health_score: isMaitri ? 0.94 : 0.98,
          active_power_kw: isMaitri ? 145.2 : 180.5,
          battery_soc: isMaitri ? 88 : 94,
          daily_fuel_l: 375,
        },
        projected_state: {
          station_health_score: selectedScenario === "generator_failure" ? 0.65 : selectedScenario === "extreme_weather" ? 0.82 : 0.55,
          active_power_kw: selectedScenario === "generator_failure" ? 78.0 : isMaitri ? 145.2 : 180.5,
          battery_soc: selectedScenario === "generator_failure" ? 64 : isMaitri ? 88 : 94,
          daily_fuel_l: selectedScenario === "extreme_weather" ? 485 : 375,
        },
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={`/stations/${stationId}`}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                What-If Scenario Simulator
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 mt-1">
              {isMaitri ? "Maitri" : "Bharati"} Emergency Scenario Engine
            </h1>
            <p className="text-xs text-slate-400">
              Inject deterministic fault scenarios and analyze state diff projections in isolated memory sandbox
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Config Selector */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5 lg:col-span-1">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-sm">Select Fault Scenario</h3>
          </div>

          <div className="space-y-2.5">
            {scenarioOptions.map((scen) => {
              const Icon = scen.icon;
              const isSelected = selectedScenario === scen.id;

              return (
                <button
                  key={scen.id}
                  onClick={() => setSelectedScenario(scen.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all space-y-1 ${
                    isSelected
                      ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-200 shadow-md"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold text-xs">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{scen.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight pl-6">{scen.description}</p>
                </button>
              );
            })}
          </div>

          {selectedScenario === "extreme_weather" && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs text-slate-300 font-semibold block">
                Temperature Delta: <span className="text-cyan-400 font-mono">{tempDelta}°C</span>
              </label>
              <input
                type="range"
                min="-35"
                max="-5"
                value={tempDelta}
                onChange={(e) => setTempDelta(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          )}

          <button
            onClick={handleRunScenario}
            disabled={running}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg glow-blue disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{running ? "Simulating Cascade..." : "Execute Scenario in Twin Sandbox"}</span>
          </button>
        </div>

        {/* State Diff Results Panel */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-slate-100 text-sm">State Diff & Projected Impact Matrix</h3>
            </div>
            {result && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800">
                SANDBOX ISOLATED (NO LIVE MUTATION)
              </span>
            )}
          </div>

          {!result ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
              <Sliders className="w-8 h-8 text-slate-600 animate-pulse" />
              <span>Select a scenario and click execute to inspect live vs projected telemetry diffs</span>
            </div>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              {/* Metrics Comparison Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Health Score</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-base font-bold text-slate-200">
                      {Math.round((result.current_state?.station_health_score || 0.95) * 100)}%
                    </span>
                    <span className="text-xs font-bold text-rose-400 font-mono">
                      → {Math.round((result.projected_state?.station_health_score || 0.65) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Power Balance</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-base font-bold text-slate-200">
                      {result.current_state?.active_power_kw || 145} kW
                    </span>
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      → {result.projected_state?.active_power_kw || 78} kW
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Battery SOC</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-base font-bold text-slate-200">
                      {result.current_state?.battery_soc || 88}%
                    </span>
                    <span className="text-xs font-bold text-rose-400 font-mono">
                      → {result.projected_state?.battery_soc || 64}%
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Fuel Burn Rate</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-base font-bold text-slate-200">
                      {result.current_state?.daily_fuel_l || 375} L/d
                    </span>
                    <span className="text-xs font-bold text-cyan-400 font-mono">
                      → {result.projected_state?.daily_fuel_l || 485} L/d
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommended Automated Mitigation Protocols */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-purple-500/30 space-y-2">
                <h4 className="text-xs font-bold text-purple-300 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-purple-400" />
                  <span>Automated Twin Remediation Recommendations</span>
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-5">
                  <li>Initiate auto-crank signal to Backup Generator Unit 3 via local PLC relay.</li>
                  <li>Shed non-life-support laboratory heating circuits to conserve BESS battery runway.</li>
                  <li>Notify NCAOR Mission Operations via HF backup frequency.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
