import React from 'react';
import { Play, Pause, RotateCcw, Clock, Droplets } from 'lucide-react';

interface TimeTrackerCardProps {
  simTime: string;
  simSeconds: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  simSpeed: number;
  onSetSpeed: (speed: number) => void;
  onReset: () => void;
}

export const TimeTrackerCard: React.FC<TimeTrackerCardProps> = ({
  simTime,
  simSeconds,
  isPlaying,
  onTogglePlay,
  simSpeed,
  onSetSpeed,
  onReset
}) => {
  // Timeline Progress Calculation (08:00 to 09:30 window)
  const startSeconds = 8 * 3600;
  const endSeconds = 9.5 * 3600;
  const progressPct = Math.max(0, Math.min(100, ((simSeconds - startSeconds) / (endSeconds - startSeconds)) * 100));

  return (
    <div className="donezo-card-dark p-5 flex flex-col justify-between relative overflow-hidden bg-mesh-dark-green h-full shadow-lg select-none">
      {/* Subtle Contour Wave Lines in Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-wavy-lines">
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="80" stroke="#34D399" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="60" stroke="#34D399" strokeWidth="1" />
          <circle cx="100" cy="100" r="40" stroke="#34D399" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-white/80 tracking-wide font-display">
            Hydraulic Telemetry Clock
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-[#34D399] bg-white/10 px-2 py-0.5 rounded-full">
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'}`} />
            <span>{isPlaying ? 'STREAMING' : 'PAUSED'}</span>
          </div>
        </div>

        {/* Large Digital Time */}
        <div className="text-center my-3">
          <div className="font-mono-tech font-black text-3xl sm:text-4xl text-white tracking-widest">
            {simTime}
          </div>
          <span className="text-[10px] font-mono-tech text-white/50 block mt-0.5">
            08:00 — 09:30 MORNING CONSUMPTION PEAK
          </span>
        </div>

        {/* Playback Controls (Circular Buttons) */}
        <div className="flex items-center justify-center gap-3 my-2">
          {/* Play / Pause Toggle Circle Button */}
          <button
            onClick={onTogglePlay}
            className="w-11 h-11 rounded-full bg-white hover:bg-[#F3F4F6] text-[#144230] flex items-center justify-center transition-transform active:scale-95 shadow-md cursor-pointer"
            title={isPlaying ? 'Pause Telemetry' : 'Resume Telemetry'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Reset Circle Button */}
          <button
            onClick={onReset}
            className="w-11 h-11 rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-white flex items-center justify-center transition-transform active:scale-95 shadow-md cursor-pointer"
            title="Reset Simulation"
            aria-label="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Speed Multipliers & Progress Scrubber */}
      <div className="relative z-10 pt-3 border-t border-white/10 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono-tech">
          <span className="text-white/60">SPEED:</span>
          <div className="flex items-center gap-1 bg-black/20 p-0.5 rounded-lg">
            {[0.5, 1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => onSetSpeed(spd)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                  simSpeed === spd
                    ? 'bg-[#22C55E] text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Mini Scrubber Bar */}
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#22C55E] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
};
