import React from 'react';
import { KPISet, CaseType } from '../../types/simulation';

interface ProgressGaugeCardProps {
  kpis: KPISet;
  currentCase: CaseType;
}

export const ProgressGaugeCard: React.FC<ProgressGaugeCardProps> = ({ kpis, currentCase }) => {
  // NRW loss containment percentage compared to baseline
  const containmentPct = currentCase === 'ai' ? 74 : currentCase === 'conventional' ? 38 : 14;
  const displayPercentage = `${containmentPct}%`;

  return (
    <div className="donezo-card p-5 flex flex-col justify-between h-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display font-bold text-base text-[#111827]">
          Water Balance & NRW Index
        </h3>
        <span className="text-[10px] font-mono-tech text-[#6B7280]">
          NON-REVENUE WATER
        </span>
      </div>

      {/* Semi-Circular Progress Gauge (Donezo Reference Architecture) */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg className="w-48 h-28" viewBox="0 0 200 110">
          <defs>
            <linearGradient id="gaugeGreenWater" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#144230" />
            </linearGradient>
          </defs>

          {/* Background / Unmitigated Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Active Completed Green Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGreenWater)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * Math.max(0.08, containmentPct / 100))}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Percentage & Label */}
        <div className="text-center -mt-10">
          <span className="font-display font-extrabold text-3xl text-[#111827] block tracking-tight">
            {displayPercentage}
          </span>
          <span className="text-[11px] text-[#6B7280] font-medium block -mt-0.5">
            NRW Loss Contained
          </span>
        </div>
      </div>

      {/* Bottom Legend */}
      <div className="pt-3 border-t border-[#F0F2F5] flex items-center justify-center gap-4 text-[11px] font-mono-tech text-[#6B7280]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#144230]" />
          <span>Pinpointed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
          <span>Active Flow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D1D5DB]" />
          <span>Unaccounted</span>
        </div>
      </div>
    </div>
  );
};
