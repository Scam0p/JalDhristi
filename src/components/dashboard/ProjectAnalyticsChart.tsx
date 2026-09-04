import React from 'react';
import { PipelineSegment } from '../../types/simulation';
import { BarChart2, Droplets } from 'lucide-react';

interface ProjectAnalyticsChartProps {
  stations: PipelineSegment[];
  onSelectStation: (segment: PipelineSegment) => void;
  selectedStation: PipelineSegment | null;
}

export const ProjectAnalyticsChart: React.FC<ProjectAnalyticsChartProps> = ({
  stations: segments,
  onSelectStation,
  selectedStation
}) => {
  // Filter out master reservoir for the 6 network pipeline distribution segments
  const lineSegments = segments.filter(s => s.id !== 'RESERVOIR');

  const segmentBars = lineSegments.map((segment, index) => {
    const isCriticalLeak = segment.status === 'CRITICAL_LEAK';
    const isPressureDrop = segment.status === 'PRESSURE_DROP';
    const isSelected = selectedStation?.id === segment.id;

    // Fill class matching Donezo reference
    let fillClass = 'pattern-hatch-green';
    if (isCriticalLeak) {
      fillClass = 'bg-[#144230]'; // Deep forest green for highlighted focus
    } else if (isPressureDrop) {
      fillClass = 'bg-[#22C55E]'; // Vibrant emerald green
    }

    // Height proportional to actual flow percentage vs expected flow (min 28% for pill shape)
    const ratioPct = Math.round((segment.actualFlowM3h / segment.expectedFlowM3h) * 100);
    const heightPct = Math.max(28, Math.min(100, ratioPct));

    return {
      segment,
      heightPct,
      fillClass,
      isCriticalLeak,
      isPressureDrop,
      isSelected,
      ratioPct
    };
  });

  return (
    <div className="donezo-card p-4 flex flex-col justify-between h-full select-none bg-white border border-[#E5E7EB] rounded-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#E5E7EB]">
        <div>
          <h3 className="font-mono-tech font-bold text-xs md:text-sm text-[#111827] uppercase tracking-wide">
            DMA Sector Flow Residuals
          </h3>
          <p className="text-[10px] text-[#6B7280] font-mono-tech">
            Volumetric mass balance &amp; pressure head across sectors
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-[#374151] bg-[#F9FAFB] px-2 py-0.5 rounded border border-[#E5E7EB] font-semibold">
          <Droplets className="w-3 h-3 text-[#144230]" />
          <span>6 SECTORS</span>
        </div>
      </div>

      {/* SCADA Industrial Bar Chart Area */}
      <div className="relative pt-6 pb-2 flex items-end justify-between gap-2 sm:gap-3 h-48 px-1 border-b border-[#E5E7EB]">
        {segmentBars.map((bar) => (
          <div
            key={bar.segment.id}
            onClick={() => onSelectStation(bar.segment)}
            className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
          >
            {/* Value Tooltip Badge on Highlighted/Anomaly Bar */}
            {(bar.isCriticalLeak || bar.isPressureDrop || bar.isSelected) && (
              <div className="absolute -top-1 bg-white border border-[#D1D5DB] shadow-xs rounded px-1.5 py-0.5 text-[9px] font-mono-tech font-bold text-[#111827] whitespace-nowrap z-10">
                {bar.segment.flowResidualPct < 0 ? `${bar.segment.flowResidualPct}%` : `+${bar.segment.flowResidualPct}%`}
              </div>
            )}

            {/* Rectangular Industrial Bar */}
            <div className="w-full max-w-[38px] h-full flex items-end">
              <div
                className={`w-full rounded-t-xs border border-b-0 transition-all duration-200 relative ${
                  bar.isCriticalLeak 
                    ? 'bg-[#144230] border-[#0D2D20]' 
                    : bar.isPressureDrop 
                    ? 'bg-[#22C55E] border-[#15803D]' 
                    : 'bg-[#E5E7EB] border-[#D1D5DB]'
                } ${
                  bar.isSelected ? 'ring-2 ring-[#144230] ring-offset-1' : 'group-hover:opacity-90'
                }`}
                style={{
                  height: `${bar.heightPct}%`,
                  minHeight: '28px'
                }}
              />
            </div>

            {/* Bottom Label (Segment code) */}
            <div className="mt-2 text-center">
              <span className="text-[11px] font-mono-tech font-bold text-[#374151] group-hover:text-[#111827] block">
                {bar.segment.code}
              </span>
              <span className="text-[9px] text-[#6B7280] font-mono-tech hidden sm:block">
                {bar.segment.actualFlowM3h} m³
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Chart Legend */}
      <div className="pt-2.5 flex items-center justify-between text-[10px] font-mono-tech text-[#6B7280]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2 rounded-xs bg-[#144230] border border-[#0D2D20]" />
          <span>Critical Leak (&gt; 5%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2 rounded-xs bg-[#22C55E] border border-[#15803D]" />
          <span>Pressure Transient</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2 rounded-xs bg-[#E5E7EB] border border-[#D1D5DB]" />
          <span>Normal Baseline</span>
        </div>
      </div>
    </div>
  );
};
