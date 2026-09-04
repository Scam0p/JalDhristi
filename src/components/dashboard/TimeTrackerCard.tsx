import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

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
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 flex flex-col justify-between h-full select-none shadow-none">
      <div>
        {/* SCADA Clock Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E7EB]">
          <div>
            <span className="text-xs font-mono-tech font-bold uppercase tracking-wider text-[#111827] block">
              SYSTEM TELEMETRY CLOCK
            </span>
            <span className="text-[10px] font-mono-tech text-[#6B7280]">
              SYNCHRONIZED MASTER RIG TIMELINE
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-[#144230] bg-[#F4F5F7] px-2 py-0.5 rounded border border-[#E5E7EB] font-bold">
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'}`} />
            <span>{isPlaying ? 'STREAMING' : 'PAUSED'}</span>
          </div>
        </div>

        {/* Recessed Industrial Digital Display */}
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded p-4 text-center my-2">
          <div className="font-mono-tech font-black text-3xl sm:text-4xl text-[#111827] tracking-widest">
            {simTime}
          </div>
          <span className="text-[10px] font-mono-tech text-[#6B7280] block mt-1 uppercase">
            08:00 — 09:30 PEAK DEMAND WINDOW • REAL-TIME RUNTIME
          </span>
        </div>

        {/* Industrial Rectangular Playback Controls */}
        <div className="flex items-center gap-2 my-3 font-mono-tech">
          {/* Play / Pause Toggle Button */}
          <button
            onClick={onTogglePlay}
            className="flex-1 py-2 px-3 rounded border border-[#0F3224] bg-[#144230] hover:bg-[#1A543E] text-white flex items-center justify-center gap-2 text-xs font-bold uppercase transition-colors cursor-pointer"
            title={isPlaying ? 'Pause Telemetry' : 'Resume Telemetry'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE CLOCK</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>RESUME CLOCK</span>
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="py-2 px-3 rounded border border-[#FECACA] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center gap-1.5 text-xs font-bold uppercase transition-colors cursor-pointer"
            title="Reset Simulation Clock"
            aria-label="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Speed Multipliers & Progress Scrubber */}
      <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono-tech">
          <span className="text-[#6B7280] font-bold">PLAYBACK RATE:</span>
          <div className="flex items-center gap-1 bg-[#F4F5F7] p-0.5 rounded border border-[#E5E7EB]">
            {[0.5, 1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => onSetSpeed(spd)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                  simSpeed === spd
                    ? 'bg-[#144230] text-white'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Rectangular Scrubber Bar */}
        <div className="w-full bg-[#E5E7EB] h-1.5 rounded-none overflow-hidden">
          <div
            className="bg-[#22C55E] h-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeTrackerCard;
