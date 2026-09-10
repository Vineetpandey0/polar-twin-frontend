"use client";

interface HealthGaugeProps {
  score: number;
}

export default function HealthScoreGauge({ score }: HealthGaugeProps) {
  const pct = Math.round(score * 100);
  const color = pct >= 90 ? "#34D399" : pct >= 75 ? "#FBBF24" : "#F87171";

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#0F1722] rounded-sm border border-[#1E2C3D]">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            strokeWidth="3"
            stroke="#1E2C3D"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            strokeWidth="3"
            strokeDasharray={`${pct}, 100`}
            strokeLinecap="square"
            stroke={color}
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute flex flex-col items-center text-center font-mono">
          <span className="text-[26px] font-bold font-mono text-[#E2EAF4] tnum leading-none">{pct}%</span>
          <span className="text-[10px] text-[#8CA1B6] uppercase tracking-wider mt-1">INDEX</span>
        </div>
      </div>
      <span className="text-[10px] font-mono text-[#5B7086] mt-2 uppercase tracking-wide">
        [SCADA CALIBRATED]
      </span>
    </div>
  );
}

