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
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 flex flex-col justify-between h-full select-none shadow-none">
      {/* SCADA Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#E5E7EB]">
        <div>
          <h3 className="font-mono-tech font-bold text-xs uppercase tracking-wider text-[#111827]">
            WATER BALANCE &amp; NRW INDEX
          </h3>
          <span className="text-[10px] font-mono-tech text-[#6B7280]">
            DMA VOLUMETRIC RECOVERY RATIO
          </span>
        </div>
        <span className="text-[10px] font-mono-tech text-[#144230] bg-[#F4F5F7] px-2 py-0.5 rounded border border-[#E5E7EB] font-bold">
          SECTOR Z-07
        </span>
      </div>

      {/* Semi-Circular Progress Gauge */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg className="w-48 h-28" viewBox="0 0 200 110">
          <defs>
            <linearGradient id="gaugeGreenWater" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#144230" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Active Progress Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGreenWater)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * Math.max(0.08, containmentPct / 100))}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Percentage & Label */}
        <div className="text-center -mt-9">
          <span className="font-mono-tech font-black text-3xl text-[#111827] block tracking-tight">
            {displayPercentage}
          </span>
          <span className="text-[10px] font-mono-tech uppercase text-[#6B7280] font-semibold block mt-0.5">
            NRW LOSS CONTAINED
          </span>
        </div>
      </div>

      {/* Industrial Legend */}
      <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-center gap-4 text-[10px] font-mono-tech text-[#6B7280]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-none bg-[#144230]" />
          <span>PINPOINTED</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-none bg-[#22C55E]" />
          <span>ACTIVE FLOW</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-none bg-[#D1D5DB]" />
          <span>UNACCOUNTED</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressGaugeCard;
