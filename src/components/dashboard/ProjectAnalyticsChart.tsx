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
    <div className="donezo-card p-5 flex flex-col justify-between h-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-base text-[#111827]">
            DMA Hydraulic Residual Analytics
          </h3>
          <p className="text-[11px] text-[#6B7280]">
            Expected vs Actual flow volume & hydraulic head across sectors
          </p>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono-tech text-[#144230] bg-[#E8F7EE] px-2.5 py-1 rounded-full font-bold">
          <Droplets className="w-3 h-3 text-[#22C55E]" />
          <span>SPARSE SENSORS</span>
        </div>
      </div>

      {/* Pill Bars Chart Area (Donezo Capsule Aesthetics) */}
      <div className="relative pt-6 pb-2 flex items-end justify-between gap-2.5 sm:gap-4 h-48 px-2">
        {segmentBars.map((bar) => (
          <div
            key={bar.segment.id}
            onClick={() => onSelectStation(bar.segment)}
            className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
          >
            {/* Value Tooltip Badge on Highlighted/Anomaly Bar (Matching reference '76%' badge) */}
            {(bar.isCriticalLeak || bar.isPressureDrop || bar.isSelected) && (
              <div className="absolute -top-1 bg-white border border-[#E5E7EB] shadow-sm rounded-full px-1.5 py-0.5 text-[9px] font-mono-tech font-bold text-[#144230] whitespace-nowrap z-10 transition-transform group-hover:scale-110">
                {bar.segment.flowResidualPct < 0 ? `${bar.segment.flowResidualPct}%` : `+${bar.segment.flowResidualPct}%`}
              </div>
            )}

            {/* Vertical Pill Capsule Bar */}
            <div className="w-full max-w-[42px] h-full flex items-end">
              <div
                className={`w-full rounded-full transition-all duration-300 relative ${bar.fillClass} ${
                  bar.isSelected ? 'ring-2 ring-[#144230] ring-offset-2 scale-105' : 'group-hover:opacity-90'
                }`}
                style={{
                  height: `${bar.heightPct}%`,
                  minHeight: '44px'
                }}
              />
            </div>

            {/* Bottom Label (Segment code) */}
            <div className="mt-3 text-center">
              <span className="text-xs font-bold text-[#6B7280] group-hover:text-[#111827] block font-display">
                {bar.segment.code}
              </span>
              <span className="text-[9px] text-[#9CA3AF] font-mono-tech hidden sm:block">
                {bar.segment.actualFlowM3h}m³
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Chart Legend */}
      <div className="pt-3 border-t border-[#F0F2F5] flex items-center justify-between text-[11px] font-mono-tech text-[#6B7280]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#144230]" />
          <span>Critical Leak (Residual &gt; 5%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span>Pressure Anomaly</span>
        </div>
      </div>
    </div>
  );
};
