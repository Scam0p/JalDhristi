import React from 'react';
import { Station } from '../../types/simulation';
import { BarChart2, Info } from 'lucide-react';

interface ProjectAnalyticsChartProps {
  stations: Station[];
  onSelectStation: (station: Station) => void;
  selectedStation: Station | null;
}

export const ProjectAnalyticsChart: React.FC<ProjectAnalyticsChartProps> = ({
  stations,
  onSelectStation,
  selectedStation
}) => {
  // Filter out depot for the 6-7 mainline station bars
  const lineStations = stations.filter(s => s.id !== 'DEPOT');

  // Days/Nodes mapping to match the reference visual composition (S M T W T F S style)
  const stationBars = lineStations.map((station, index) => {
    const isPeakSurge = station.passengerDemandPct >= 90;
    const isHighLoad = station.passengerDemandPct >= 70 && station.passengerDemandPct < 90;
    const isSelected = selectedStation?.id === station.id;

    // Determine bar fill type: Solid dark green, solid emerald with tooltip tag, or patterned hatch
    let fillClass = 'pattern-hatch-green';
    if (isPeakSurge) {
      fillClass = 'bg-[#144230]'; // Deep forest green
    } else if (isHighLoad) {
      fillClass = 'bg-[#22C55E]'; // Vibrant emerald green
    }

    // Height proportional to passenger demand (min height 24% so it forms a nice capsule)
    const heightPct = Math.max(28, station.passengerDemandPct);

    // Letter label (like S M T W T F S in reference, but with station code on hover/subtext)
    const letter = ['A', 'K', 'E', 'K', 'M', 'T'][index] || station.code.charAt(0);

    return {
      station,
      heightPct,
      fillClass,
      letter,
      isPeakSurge,
      isHighLoad,
      isSelected
    };
  });

  return (
    <div className="donezo-card p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-base text-[#111827]">
            Corridor Demand Analytics
          </h3>
          <p className="text-[11px] text-[#6B7280]">
            Live station queue density & headway load
          </p>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono-tech text-[#144230] bg-[#E8F7EE] px-2.5 py-1 rounded-full font-bold">
          <span>LIVE SENSORS</span>
        </div>
      </div>

      {/* Pill Bars Chart Area */}
      <div className="relative pt-6 pb-2 flex items-end justify-between gap-2.5 sm:gap-4 h-48 px-2">
        {stationBars.map((bar, idx) => (
          <div
            key={bar.station.id}
            onClick={() => onSelectStation(bar.station)}
            className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
          >
            {/* Value Tooltip Badge on Highlighted/Surge Bar (Matching reference '76%' badge) */}
            {(bar.isHighLoad || bar.isPeakSurge || bar.isSelected) && (
              <div className="absolute -top-1 bg-white border border-[#E5E7EB] shadow-sm rounded-full px-1.5 py-0.5 text-[9px] font-mono-tech font-bold text-[#144230] whitespace-nowrap z-10 transition-transform group-hover:scale-110">
                {bar.station.passengerDemandPct}%
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

            {/* Bottom Label (Node letter + code) */}
            <div className="mt-3 text-center">
              <span className="text-xs font-bold text-[#6B7280] group-hover:text-[#111827] block font-display">
                {bar.station.code}
              </span>
              <span className="text-[9px] text-[#9CA3AF] font-mono-tech hidden sm:block">
                {bar.station.waitingCount}p
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Chart Footer Legend */}
      <div className="pt-3 border-t border-[#F0F2F5] flex items-center justify-between text-[10px] font-mono-tech text-[#6B7280]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#144230]" />
            <span>Peak Surge</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
            <span>High Load</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full pattern-hatch-green border border-[#B7E4C7]" />
            <span>Nominal</span>
          </div>
        </div>
        <span className="text-[#9CA3AF]">Click bar to inspect</span>
      </div>
    </div>
  );
};
