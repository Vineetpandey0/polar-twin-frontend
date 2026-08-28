"use client";

interface HealthGaugeProps {
  score: number;
}

export default function HealthScoreGauge({ score }: HealthGaugeProps) {
  const pct = Math.round(score * 100);
  const color = pct >= 90 ? "#10b981" : pct >= 75 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center justify-center p-4 glass-card rounded-2xl border border-slate-800">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-slate-800"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            strokeWidth="3.5"
            strokeDasharray={`${pct}, 100`}
            strokeLinecap="round"
            stroke={color}
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-black text-slate-100">{pct}%</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Health</span>
        </div>
      </div>
    </div>
  );
}
