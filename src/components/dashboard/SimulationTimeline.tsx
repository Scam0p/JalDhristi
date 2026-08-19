import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock, Flag } from 'lucide-react';

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
  // 08:00 is 8 * 3600 = 28800
  // 09:30 is 9.5 * 3600 = 34200
  // Total span = 5400 seconds (90 min)
  const startSeconds = 8 * 3600;
  const endSeconds = 9.5 * 3600;
  const progressPct = Math.max(0, Math.min(100, ((simSeconds - startSeconds) / (endSeconds - startSeconds)) * 100));

  const milestones = [
    { label: '08:00', title: 'START OF PEAK', pct: 0 },
    { label: '08:15', title: 'COMMUTER INFLOW', pct: 16.6 },
    { label: '08:30', title: 'DEMAND SPIKE', pct: 33.3, alert: true },
    { label: '08:45', title: 'AI INDUCTION DEPLOY', pct: 50.0, highlight: true },
    { label: '09:00', title: 'HEADWAY STABLE', pct: 66.6 },
    { label: '09:15', title: 'PEAK RECEDING', pct: 83.3 },
    { label: '09:30', title: 'NORMAL SERVICE', pct: 100 }
  ];

  return (
    <div className="tech-panel-elevated tech-corner rounded-xl p-4 md:p-5 border border-white/15 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        {/* Left: Live Playback Controls */}
        <div className="flex items-center gap-3">
          {/* Play / Pause Toggle */}
          <button
            onClick={onTogglePlay}
            className={`p-2.5 rounded-lg font-bold text-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md ${
              isPlaying
                ? 'bg-[#E30613] text-white hover:bg-[#FF1A2E] shadow-[0_0_15px_rgba(227,6,19,0.5)]'
                : 'bg-[#65FF9A] text-black hover:bg-[#59F3FF] shadow-[0_0_15px_rgba(101,255,154,0.5)]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>RESUME SIM</span>
              </>
            )}
          </button>

          {/* Speed Multipliers */}
          <div className="flex items-center bg-black/50 border border-white/10 rounded-lg p-1 text-xs font-mono-tech">
            {[0.5, 1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => onSetSpeed(spd)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  simSpeed === spd
                    ? 'bg-[#59F3FF] text-black font-bold shadow'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {spd}×
              </button>
            ))}
          </div>

          {/* Reset button */}
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono-tech"
            title="Reset to 08:00 start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>

        {/* Current Time Clock Readout */}
        <div className="flex items-center gap-3 bg-[#0D1117] border border-[#59F3FF]/40 px-4 py-1.5 rounded-lg shadow-[0_0_15px_rgba(89,243,255,0.15)] font-mono-tech">
          <Clock className="w-4 h-4 text-[#59F3FF]" />
          <span className="text-sm md:text-base font-black text-[#59F3FF] tracking-widest">
            {simTime}
          </span>
          <span className="text-[10px] text-white/50">IST MORNING PEAK</span>
        </div>
      </div>

      {/* Progress Bar & Timeline Track */}
      <div className="relative pt-6 pb-2">
        {/* Track Line */}
        <div className="w-full h-2 bg-white/10 rounded-full relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#59F3FF] via-[#E30613] to-[#65FF9A] rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>

        {/* Scrubber Playhead */}
        <div
          className="absolute top-4 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-300 z-20"
          style={{ left: `${progressPct}%` }}
        >
          <div className="w-4 h-4 rounded-full bg-[#E30613] border-2 border-white shadow-[0_0_10px_#E30613] animate-pulse"></div>
          <div className="w-0.5 h-6 bg-[#E30613]"></div>
        </div>

        {/* Milestones / Key Events along timeline */}
        <div className="relative w-full flex justify-between mt-3 text-[10px] font-mono-tech select-none">
          {milestones.map((m, i) => (
            <div
              key={i}
              className="flex flex-col items-center"
              style={{ width: `${100 / milestones.length}%` }}
            >
              <div className={`w-1.5 h-1.5 rounded-full mb-1 ${m.highlight ? 'bg-[#59F3FF] shadow-[0_0_6px_#59F3FF]' : m.alert ? 'bg-[#FF1A2E]' : 'bg-white/30'}`}></div>
              <span className="font-bold text-white/90">{m.label}</span>
              <span className={`text-[8px] uppercase tracking-tighter truncate max-w-[80px] text-center ${m.highlight ? 'text-[#59F3FF] font-bold' : m.alert ? 'text-[#FF1A2E]' : 'text-white/40'}`}>
                {m.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
