"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { runScenarioApi } from "@/lib/api";
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
      const data = await runScenarioApi(stationId, selectedScenario);
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
    <div className="space-y-4 max-w-7xl mx-auto font-mono">
      {/* Header Bar */}
      <div className="bg-[#0F1722] p-4 rounded-sm border border-[#1E2C3D] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href={`/stations/${stationId}`}
            className="p-1.5 rounded-sm bg-[#131D2B] border border-[#1E2C3D] text-[#8CA1B6] hover:text-[#E2EAF4] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[#38BDF8] font-bold">
                [SIMULATOR :: CONTINGENCY MODELING]
              </span>
              <span className="text-[#8CA1B6]">[ISOLATED TWIN SANDBOX]</span>
            </div>
            <h1 className="text-2xl lg:text-[28px] font-bold text-[#E2EAF4] uppercase tracking-wide mt-1 leading-tight">
              {isMaitri ? "Maitri" : "Bharati"} Emergency Scenario Engine
            </h1>
            <p className="text-sm text-[#8CA1B6] mt-1 leading-relaxed">
              Inject deterministic hardware faults and calculate telemetry state-delta projections
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Scenario Config Selector */}
        <div className="bg-[#0F1722] p-4 rounded-sm border border-[#1E2C3D] space-y-4 lg:col-span-1">
          <div className="flex items-center space-x-2 border-b border-[#1E2C3D] pb-2">
            <Sliders className="w-4 h-4 text-[#38BDF8]" />
            <h2 className="font-semibold text-[17px] text-[#E2EAF4] uppercase tracking-wider leading-snug">
              Select Contingency Vector
            </h2>
          </div>

          <div className="space-y-2">
            {scenarioOptions.map((scen) => {
              const Icon = scen.icon;
              const isSelected = selectedScenario === scen.id;

              return (
                <button
                  key={scen.id}
                  onClick={() => setSelectedScenario(scen.id)}
                  className={`w-full text-left p-3 rounded-sm border transition-colors space-y-1 ${
                    isSelected
                      ? "bg-[#131D2B] border-[#38BDF8] text-[#E2EAF4]"
                      : "bg-[#131D2B]/50 border-[#1E2C3D] text-[#8CA1B6] hover:text-[#E2EAF4] hover:bg-[#131D2B]"
                  }`}
                >
                  <div className="flex items-center space-x-2 font-semibold text-sm">
                    <Icon className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span className="uppercase">{scen.name}</span>
                  </div>
                  <p className="text-sm text-[#8CA1B6] leading-relaxed pl-5.5">{scen.description}</p>
                </button>
              );
            })}
          </div>

          {selectedScenario === "extreme_weather" && (
            <div className="space-y-2 pt-2 border-t border-[#1E2C3D]">
              <label className="text-xs text-[#8CA1B6] block">
                TEMPERATURE DELTA: <span className="text-[#38BDF8] font-bold tnum">{tempDelta}°C</span>
              </label>
              <input
                type="range"
                min="-35"
                max="-5"
                value={tempDelta}
                onChange={(e) => setTempDelta(Number(e.target.value))}
                className="w-full accent-[#38BDF8]"
              />
            </div>
          )}

          <button
            onClick={handleRunScenario}
            disabled={running}
            className="w-full py-2.5 rounded-sm bg-[#131D2B] hover:bg-[#1E2C3D] border border-[#38BDF8] text-[#38BDF8] hover:text-[#E2EAF4] font-bold text-xs flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{running ? "CALCULATING CASCADE..." : "EXECUTE IN TWIN SANDBOX"}</span>
          </button>
        </div>

        {/* State Diff Results Panel */}
        <div className="bg-[#0F1722] p-4 rounded-sm border border-[#1E2C3D] space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#1E2C3D] pb-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#38BDF8]" />
              <h2 className="font-semibold text-[17px] text-[#E2EAF4] uppercase tracking-wider leading-snug">
                State Diff & Projected Impact Matrix
              </h2>
            </div>
            {result && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-[#10291D] text-[#34D399] border border-[#34D399]">
                [SANDBOX ISOLATED :: NO LIVE MUTATION]
              </span>
            )}
          </div>

          {!result ? (
            <div className="h-64 flex flex-col items-center justify-center text-[#8CA1B6] text-xs space-y-2 border border-dashed border-[#1E2C3D] rounded-sm">
              <Sliders className="w-6 h-6 text-[#5B7086]" />
              <span>Select a contingency scenario and execute to compute real-time state diffs</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Metrics Comparison Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                <div className="bg-[#131D2B] p-3 rounded-sm border border-[#1E2C3D] space-y-1">
                  <span className="text-[10px] text-[#8CA1B6] uppercase block">Health Score</span>
                  <div className="flex items-baseline space-x-2 tnum">
                    <span className="text-sm font-bold text-[#E2EAF4]">
                      {Math.round((result.current_state?.station_health_score || 0.95) * 100)}%
                    </span>
                    <span className="text-xs font-bold text-[#F87171]">
                      &rarr; {Math.round((result.projected_state?.station_health_score || 0.65) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="bg-[#131D2B] p-3 rounded-sm border border-[#1E2C3D] space-y-1">
                  <span className="text-[10px] text-[#8CA1B6] uppercase block">Power Balance</span>
                  <div className="flex items-baseline space-x-2 tnum">
                    <span className="text-sm font-bold text-[#E2EAF4]">
                      {result.current_state?.active_power_kw || 145} kW
                    </span>
                    <span className="text-xs font-bold text-[#FBBF24]">
                      &rarr; {result.projected_state?.active_power_kw || 78} kW
                    </span>
                  </div>
                </div>

                <div className="bg-[#131D2B] p-3 rounded-sm border border-[#1E2C3D] space-y-1">
                  <span className="text-[10px] text-[#8CA1B6] uppercase block">Battery SOC</span>
                  <div className="flex items-baseline space-x-2 tnum">
                    <span className="text-sm font-bold text-[#E2EAF4]">
                      {result.current_state?.battery_soc || 88}%
                    </span>
                    <span className="text-xs font-bold text-[#F87171]">
                      &rarr; {result.projected_state?.battery_soc || 64}%
                    </span>
                  </div>
                </div>

                <div className="bg-[#131D2B] p-3 rounded-sm border border-[#1E2C3D] space-y-1">
                  <span className="text-[10px] text-[#8CA1B6] uppercase block">Fuel Burn Rate</span>
                  <div className="flex items-baseline space-x-2 tnum">
                    <span className="text-sm font-bold text-[#E2EAF4]">
                      {result.current_state?.daily_fuel_l || 375} L/d
                    </span>
                    <span className="text-xs font-bold text-[#38BDF8]">
                      &rarr; {result.projected_state?.daily_fuel_l || 485} L/d
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommended Automated Mitigation Protocols */}
              <div className="bg-[#131D2B] p-3.5 rounded-sm border border-[#1E2C3D] space-y-2">
                <h4 className="text-sm font-bold text-[#FBBF24] flex items-center space-x-2 uppercase tracking-wide">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#FBBF24]" />
                  <span>Automated Twin Remediation Recommendations</span>
                </h4>
                <ul className="text-sm text-[#E2EAF4] space-y-1 list-disc pl-4 leading-relaxed">
                  <li>Initiate auto-crank signal to Backup Generator Unit 3 via local PLC relay.</li>
                  <li>Shed non-life-support laboratory heating circuits to conserve BESS battery runway.</li>
                  <li>Notify NCPOR Mission Operations via HF backup frequency.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

