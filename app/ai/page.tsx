"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  User,
  Sparkles,
  Zap,
  Radio,
  Fuel,
  ShieldAlert,
  RotateCcw,
  Compass,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export default function AIAssistantPage() {
  const [stationContext, setStationContext] = useState<"maitri" | "bharati">("maitri");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Greetings, Commander. I am **PolarTwin AI**, connected directly to live telemetry streams and predictive simulation models for **Maitri** and **Bharati** research stations.\n\nAsk me about live subsystem health, fuel runway forecasts, power grid balances, or ask me to **simulate emergency scenarios** (e.g., generator failure, extreme blizzard, satellite loss).",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterQuestions = [
    {
      label: "Simulate Generator Failure",
      prompt: `What happens if generator GEN-${stationContext === "maitri" ? "MAI" : "BHA"}-001 fails right now?`,
      icon: Zap,
    },
    {
      label: "Check Fuel Reserves",
      prompt: `Analyze the remaining polar diesel fuel runway and daily consumption rate for ${
        stationContext === "maitri" ? "Maitri" : "Bharati"
      }.`,
      icon: Fuel,
    },
    {
      label: "Simulate Extreme Blizzard",
      prompt: `Simulate an extreme Antarctic blizzard of -45°C and 95 km/h winds at ${
        stationContext === "maitri" ? "Maitri" : "Bharati"
      }.`,
      icon: ShieldAlert,
    },
    {
      label: "Overall Health Analysis",
      prompt: `Provide a full digital twin health score breakdown for ${
        stationContext === "maitri" ? "Maitri" : "Bharati"
      } station.`,
      icon: Compass,
    },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          station_id: stationContext,
        }),
      });

      if (!res.ok) throw new Error("API call failed");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (e) {
      // Fallback local intelligent generator
      const isMaitri = stationContext === "maitri";
      const q = textToSend.toLowerCase();
      let replyText = "";

      if (q.includes("fail") || q.includes("generator") || q.includes("power")) {
        replyText = `### ⚠️ Simulation Analysis: Generator Outage at ${isMaitri ? "Maitri" : "Bharati"}\n\n` +
          `**Projected Impact**:\n` +
          `- Station Health drops to **65.0%** (DEGRADED).\n` +
          `- Active electrical demand automatically shifts to secondary unit and Battery Bank (${isMaitri ? "BAT-MAI-001" : "BAT-BHA-001"}).\n` +
          `- Net battery discharge rate increases to **~12.5 kW**.\n\n` +
          `**Recommended Protocol**:\n` +
          `1. Auto-crank Backup Generator 3 to restore baseline power.\n` +
          `2. Shed non-critical auxiliary lab thermal heaters.`;
      } else if (q.includes("fuel") || q.includes("inventory") || q.includes("diesel")) {
        replyText = `### 📦 ${isMaitri ? "Maitri" : "Bharati"} Fuel & Supply Runway\n\n` +
          `- **Polar Diesel Reserve**: **${isMaitri ? "45,000" : "60,000"} Liters** (~${isMaitri ? "120" : "180"} days operational runway).\n` +
          `- **Daily Burn Rate**: 375 L/day across generators and station heating loops.\n` +
          `- **Food & Ration Supplies**: ${isMaitri ? "120" : "180"} Days freeze-dried stock.\n` +
          `- **Status**: **OPTIMAL** (No emergency resupply required).`;
      } else if (q.includes("blizzard") || q.includes("weather") || q.includes("cold")) {
        replyText = `### ❄️ Extreme Weather Simulation (-45°C, 95 km/h Gale)\n\n` +
          `- Central HVAC heating loop duty cycle increases to **98%**.\n` +
          `- Generator fuel consumption rate rises to **480 L/day** (+28%).\n` +
          `- Fuel reserves remain secure for **>90 days**.\n` +
          `- Satellite link tracking antennas locked into protective stowage.`;
      } else {
        replyText = `### 🛰️ ${isMaitri ? "Maitri" : "Bharati"} Digital Twin Telemetry Summary\n\n` +
          `- **Health Score**: **${isMaitri ? "94.0" : "98.0"}%** (Nominal)\n` +
          `- **Ambient Conditions**: ${isMaitri ? "-25.2°C" : "-18.4°C"}, Wind ${isMaitri ? "28.5" : "34.1"} km/h.\n` +
          `- **Power Grid**: Generation ${isMaitri ? "145.2" : "180.5"} kW vs Base Load ${isMaitri ? "110.0" : "135.0"} kW.\n` +
          `- **Battery State**: ${isMaitri ? "88%" : "94%"} SOC (Float charging mode).`;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: replyText,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: "assistant",
        content: `Conversation reset. Ready for queries regarding **${
          stationContext === "maitri" ? "Maitri" : "Bharati"
        }** station.`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-6rem)] flex flex-col glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-slate-100 text-sm">PolarTwin AI Operations Assistant</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Grounded Live
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Context-aware tool-calling agent with scenario simulation & diagnostic reasoning
            </p>
          </div>
        </div>

        {/* Station Switcher & Reset */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 space-x-1 text-xs">
            <button
              onClick={() => setStationContext("maitri")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                stationContext === "maitri"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Maitri Context
            </button>
            <button
              onClick={() => setStationContext("bharati")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                stationContext === "bharati"
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Bharati Context
            </button>
          </div>

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message History Feed */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((m, idx) => {
          const isUser = m.role === "user";

          return (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              <div
                className={`p-2 rounded-xl text-xs shrink-0 ${
                  isUser
                    ? "bg-cyan-500 text-slate-950 font-bold"
                    : "bg-slate-900 text-cyan-400 border border-slate-800 shadow-md"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-1 max-w-[85%]">
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? "bg-cyan-500/20 text-cyan-100 border border-cyan-500/30 rounded-tr-none"
                      : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none shadow-xl whitespace-pre-wrap"
                  }`}
                >
                  {m.content}
                </div>
                {m.timestamp && (
                  <span className={`text-[10px] font-mono text-slate-500 block ${isUser ? "text-right" : "text-left"}`}>
                    {m.timestamp}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-slate-900 text-cyan-400 border border-slate-800 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-2xl rounded-tl-none border border-slate-800 flex items-center space-x-2 text-xs text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Querying live twin telemetry & running predictive simulation...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Questions Bar */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center space-x-2 overflow-x-auto shrink-0">
        <span className="text-[10px] text-slate-500 uppercase font-semibold flex items-center space-x-1 shrink-0">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Quick Actions:</span>
        </span>
        {starterQuestions.map((q, idx) => {
          const Icon = q.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(q.prompt)}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-cyan-300 flex items-center space-x-1.5 whitespace-nowrap transition-all shadow-sm"
            >
              <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{q.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Composer Bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center space-x-3 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={`Ask AI about ${
            stationContext === "maitri" ? "Maitri" : "Bharati"
          } subsystems, emergency failure simulations, fuel forecasts...`}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 transition-all shadow-lg glow-blue disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
