import React from 'react';
import { Play, Pause, RotateCcw, Clock, Droplets } from 'lucide-react';

interface SimulationTimelineProps {
  simTime: string;
  simSeconds: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  simSpeed: number;
  onSetSpeed: (speed: number) => void;
  onReset: () => void;
}

export const SimulationTimeline: React.FC<SimulationTimelineProps> = ({
  simTime,
  simSeconds,
  isPlaying,
  onTogglePlay,
  simSpeed,
  onSetSpeed,
  onReset
}) => {
  const startSeconds = 8 * 3600;
  const endSeconds = 9.5 * 3600;
  const progressPct = Math.max(0, Math.min(100, ((simSeconds - startSeconds) / (endSeconds - startSeconds)) * 100));

  const milestones = [
    { label: '08:00', title: 'START MONITORING', pct: 0 },
    { label: '08:15', title: 'BASE INFLOW', pct: 16.6 },
    { label: '08:30', title: 'RESIDUAL SPIKE', pct: 33.3, alert: true },
    { label: '08:45', title: 'TWIN PINPOINT', pct: 50.0, highlight: true },
    { label: '09:00', title: 'VALVE THROTTLED', pct: 66.6 },
    { label: '09:15', title: 'SURGE SETTLING', pct: 83.3 },
    { label: '09:30', title: 'NOMINAL SERVICE', pct: 100 }
  ];

  return (
    <div className="donezo-card p-4 md:p-5 select-none">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePlay}
            className="px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 cursor-pointer transition-all bg-[#144230] text-white hover:bg-[#1A543E] active:scale-95 shadow-sm"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                <span>RESUME</span>
              </>
            )}
          </button>

          {/* Speed Multipliers */}
          <div className="flex items-center bg-[#F4F5F7] border border-[#E5E7EB] rounded-full p-0.5 text-xs font-mono-tech">
            {[0.5, 1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => onSetSpeed(spd)}
                className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer font-bold ${
                  simSpeed === spd
                    ? 'bg-[#144230] text-white shadow-sm'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                {spd}×
              </button>
            ))}
          </div>

          <button
            onClick={onReset}
            className="p-2 rounded-full bg-[#F4F5F7] hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Current Time Clock Readout */}
        <div className="flex items-center gap-2 bg-[#E8F7EE] border border-[#B7E4C7] px-3.5 py-1.5 rounded-full font-mono-tech text-xs">
          <Clock className="w-3.5 h-3.5 text-[#144230]" />
          <span className="font-black text-[#144230] tracking-widest">
            {simTime}
          </span>
          <span className="text-[10px] text-[#144230]/70">IST</span>
        </div>
      </div>

      {/* Progress Bar & Timeline Track */}
      <div className="relative pt-4 pb-2">
        <div className="w-full h-2 bg-[#F4F5F7] rounded-full relative overflow-hidden border border-[#E5E7EB]">
          <div
            className="h-full bg-gradient-to-r from-[#144230] to-[#22C55E] rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="relative w-full flex justify-between mt-3 text-[10px] font-mono-tech select-none">
          {milestones.map((m, i) => (
            <div
              key={i}
              className="flex flex-col items-center"
              style={{ width: `${100 / milestones.length}%` }}
            >
              <div className={`w-1.5 h-1.5 rounded-full mb-1 ${m.highlight ? 'bg-[#22C55E]' : m.alert ? 'bg-[#EF4444]' : 'bg-[#D1D5DB]'}`} />
              <span className="font-bold text-[#111827]">{m.label}</span>
              <span className={`text-[8px] uppercase tracking-tighter truncate max-w-[80px] text-center ${m.highlight ? 'text-[#144230] font-bold' : m.alert ? 'text-[#EF4444]' : 'text-[#9CA3AF]'}`}>
                {m.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
