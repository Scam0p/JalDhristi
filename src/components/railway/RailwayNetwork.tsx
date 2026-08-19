import React, { useState } from 'react';
import { Train, Station, CaseType } from '../../types/simulation';
import { TrainVehicle } from './TrainVehicle';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Sparkles, 
  Layers, 
  Radio, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Info 
} from 'lucide-react';

interface RailwayNetworkProps {
  trains: Train[];
  stations: Station[];
  currentCase: CaseType;
  onSelectTrain: (train: Train) => void;
  onSelectStation: (station: Station) => void;
  selectedTrain: Train | null;
  selectedStation: Station | null;
  isOptimizing: boolean;
  // Side Controls Props
  simTime: string;
  simSeconds: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  simSpeed: number;
  onSetSpeed: (speed: number) => void;
  onReset: () => void;
  onRunOptimization: () => void;
}

export const RailwayNetwork: React.FC<RailwayNetworkProps> = ({
  trains,
  stations,
  currentCase,
  onSelectTrain,
  onSelectStation,
  selectedTrain,
  selectedStation,
  isOptimizing,
  simTime,
  simSeconds,
  isPlaying,
  onTogglePlay,
  simSpeed,
  onSetSpeed,
  onReset,
  onRunOptimization
}) => {
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null);

  // Scaled coordinates on the expanded 1200x480 SVG map
  const stationCoords: Record<string, { x: number; y: number }> = {
    DEPOT: { x: 120, y: 95 },
    ALUVA: { x: 200, y: 290 },
    KALAMASSERY: { x: 390, y: 290 },
    EDAPPALLY: { x: 580, y: 290 },
    KALOOR: { x: 770, y: 290 },
    MG_ROAD: { x: 960, y: 290 },
    TRIPUNITHURA: { x: 1120, y: 290 }
  };

  // Timeline Progress Calculation (08:00 to 09:30)
  const startSeconds = 8 * 3600;
  const endSeconds = 9.5 * 3600;
  const progressPct = Math.max(0, Math.min(100, ((simSeconds - startSeconds) / (endSeconds - startSeconds)) * 100));

  return (
    <div className="w-full gov-panel-elevated rounded-2xl p-4 md:p-6 border border-white/10 shadow-2xl space-y-4">
      {/* Top Header of the Unified Simulation Deck */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#0E1626] border border-white/10 text-[#38BDF8]">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-base md:text-xl text-white tracking-wide uppercase">
                KMRL MAINLINE & DEPOT OPERATIONS MAP
              </h2>
              <span className="text-[10px] font-mono-tech px-2.5 py-0.5 rounded bg-white/5 text-white/80 border border-white/10 font-semibold">
                LINE 1 • 25.6 KM
              </span>
            </div>
            <p className="text-xs text-white/50 font-mono-tech">
              Interactive high-resolution corridor schematic • Real-time train positions & siding induction
            </p>
          </div>
        </div>

        {/* Status Legend (Clean & Professional) */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tech text-white/70">
          <div className="flex items-center gap-1.5 bg-[#080C14] px-2.5 py-1 rounded border border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></span>
            <span>In Service</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#080C14] px-2.5 py-1 rounded border border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]"></span>
            <span>AI Inducting</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#080C14] px-2.5 py-1 rounded border border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
            <span>Standby Depot</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#080C14] px-2.5 py-1 rounded border border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
            <span>Maintenance</span>
          </div>
        </div>
      </div>

      {/* Main Expansive Layout: Big SVG Canvas + Integrated Side Controls Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        {/* Dominant Large Railway Simulation Canvas (9 Cols) */}
        <div className="xl:col-span-9 relative bg-[#05080E] rounded-xl border border-white/10 p-3 overflow-x-auto min-h-[480px] flex items-center">
          <div className="w-full min-w-[1040px] relative">
            <svg
              viewBox="0 0 1200 480"
              className="w-full h-auto select-none"
              style={{ minHeight: '440px' }}
            >
              <defs>
                {/* Subtle, Clean Track Gradients */}
                <linearGradient id="mainlineStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284C7" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.8" />
                </linearGradient>

                <linearGradient id="depotSidingStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#E30613" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Clean Background Grid */}
              <g opacity="0.08">
                {Array.from({ length: 24 }).map((_, i) => (
                  <line
                    key={`vg-${i}`}
                    x1={i * 50}
                    y1="0"
                    x2={i * 50}
                    y2="480"
                    stroke="#FFFFFF"
                    strokeWidth="0.5"
                  />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <line
                    key={`hg-${i}`}
                    x1="0"
                    y1={i * 50}
                    x2="1200"
                    y2={i * 50}
                    stroke="#FFFFFF"
                    strokeWidth="0.5"
                  />
                ))}
              </g>

              {/* MUTTOM MAINTENANCE DEPOT (Top-Left Facility Box) */}
              <g transform="translate(30, 30)">
                <rect
                  x="0"
                  y="0"
                  width="180"
                  height="130"
                  rx="8"
                  fill="#0E1626"
                  stroke="#F59E0B"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <text
                  x="14"
                  y="24"
                  fill="#F59E0B"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="Space Grotesk"
                  letterSpacing="0.08em"
                >
                  MUTTOM DEPOT
                </text>
                <text
                  x="14"
                  y="38"
                  fill="rgba(255,255,255,0.4)"
                  fontSize="8.5"
                  fontFamily="JetBrains Mono"
                >
                  ROLLING STOCK STABLING & INDUCTION
                </text>

                {/* Depot Stabling Siding Tracks */}
                <line x1="18" y1="65" x2="162" y2="65" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
                <text x="20" y="60" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="JetBrains Mono">SIDING 1</text>

                <line x1="18" y1="95" x2="162" y2="95" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
                <text x="20" y="90" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="JetBrains Mono">SIDING 2 (HOT RESERVE)</text>

                <line x1="18" y1="120" x2="162" y2="120" stroke="#E30613" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
                <text x="20" y="116" fill="#E30613" fontSize="7" fontFamily="JetBrains Mono">INDUCTION DISPATCH LINE</text>
              </g>

              {/* DEPOT-TO-MAINLINE TURNOUT FEEDER TRACK */}
              <g>
                <path
                  d="M 140 100 C 160 100, 180 190, 200 290"
                  stroke="url(#depotSidingStroke)"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="5 3"
                />
                <text
                  x="165"
                  y="200"
                  fill="#E30613"
                  fontSize="8.5"
                  fontWeight="bold"
                  fontFamily="JetBrains Mono"
                >
                  DEPOT TURNOUT
                </text>
              </g>

              {/* MAINLINE DOUBLE TRACKS (DOWN & UP) */}
              <g>
                {/* Track Base Beds */}
                <line
                  x1="190"
                  y1="272"
                  x2="1130"
                  y2="272"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <line
                  x1="190"
                  y1="272"
                  x2="1130"
                  y2="272"
                  stroke="url(#mainlineStroke)"
                  strokeWidth="3"
                />

                <line
                  x1="190"
                  y1="308"
                  x2="1130"
                  y2="308"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <line
                  x1="190"
                  y1="308"
                  x2="1130"
                  y2="308"
                  stroke="url(#mainlineStroke)"
                  strokeWidth="3"
                />

                {/* Track Cross Sleepers */}
                {Array.from({ length: 48 }).map((_, i) => {
                  const tieX = 195 + i * 20;
                  return (
                    <line
                      key={`tie-${i}`}
                      x1={tieX}
                      y1="264"
                      x2={tieX}
                      y2="316"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1.5"
                    />
                  );
                })}

                {/* Direction Labels */}
                <text
                  x="660"
                  y="260"
                  fill="rgba(56,189,248,0.7)"
                  fontSize="8.5"
                  fontFamily="JetBrains Mono"
                  letterSpacing="0.1em"
                >
                  DOWN LINE → (SOUTHBOUND TO TRIPUNITHURA)
                </text>
                <text
                  x="660"
                  y="326"
                  fill="rgba(56,189,248,0.7)"
                  fontSize="8.5"
                  fontFamily="JetBrains Mono"
                  letterSpacing="0.1em"
                >
                  ← UP LINE (NORTHBOUND TO ALUVA)
                </text>
              </g>

              {/* EMERGENCY SIDING NEAR KALAMASSERY */}
              <g>
                <path
                  d="M 370 308 L 390 210 L 450 210"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  fill="none"
                />
                <text
                  x="395"
                  y="200"
                  fill="#EF4444"
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="JetBrains Mono"
                >
                  EMERGENCY SIDING (ISOLATION)
                </text>
              </g>

              {/* RENDER ALL STATIONS WITH CLEAR LABELS & LOAD BARS */}
              {stations.filter(s => s.id !== 'DEPOT').map((station) => {
                const coords = stationCoords[station.id];
                const isSelected = selectedStation?.id === station.id;
                const isSurge = station.status === 'SURGE_CRITICAL' || station.passengerDemandPct >= 85;

                return (
                  <g
                    key={station.id}
                    transform={`translate(${coords.x}, ${coords.y})`}
                    onClick={() => onSelectStation(station)}
                    onMouseEnter={() => setHoveredStation(station)}
                    onMouseLeave={() => setHoveredStation(null)}
                    className="cursor-pointer select-none"
                  >
                    {/* Station Node Halo */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSurge ? "24" : "18"}
                      fill={isSurge ? "rgba(239,68,68,0.25)" : "rgba(56,189,248,0.15)"}
                    />

                    {/* Station Pillar / Marker */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? "11" : "8"}
                      fill="#0E1626"
                      stroke={isSelected ? '#38BDF8' : isSurge ? '#EF4444' : '#0284C7'}
                      strokeWidth={isSelected ? '3' : '2'}
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? "5" : "3.5"}
                      fill={isSurge ? '#EF4444' : '#22C55E'}
                    />

                    {/* Station Name & Code (Top) */}
                    <g transform="translate(0, -32)">
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="11.5"
                        fontWeight="bold"
                        fontFamily="Space Grotesk"
                        letterSpacing="0.04em"
                      >
                        {station.name.toUpperCase()}
                      </text>
                      <text
                        x="0"
                        y="12"
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.45)"
                        fontSize="8"
                        fontFamily="JetBrains Mono"
                      >
                        KM {station.kmPosition.toFixed(1)} • {station.code}
                      </text>
                    </g>

                    {/* Demand & Queue HUD Badge (Bottom) */}
                    <g transform="translate(0, 48)">
                      <rect
                        x="-40"
                        y="-13"
                        width="80"
                        height="26"
                        rx="4"
                        fill="#0E1626"
                        stroke={isSurge ? '#EF4444' : 'rgba(255,255,255,0.15)'}
                        strokeWidth={isSurge ? '1.5' : '1'}
                      />
                      
                      {/* Passenger Demand Bar */}
                      <rect x="-34" y="-8" width="68" height="4.5" rx="1" fill="rgba(255,255,255,0.1)" />
                      <rect
                        x="-34"
                        y="-8"
                        width={Math.max(4, (station.passengerDemandPct / 100) * 68)}
                        height="4.5"
                        rx="1"
                        fill={isSurge ? '#EF4444' : station.passengerDemandPct > 70 ? '#F59E0B' : '#22C55E'}
                      />

                      {/* Waiting Count */}
                      <text
                        x="-32"
                        y="8"
                        fill={isSurge ? '#EF4444' : '#38BDF8'}
                        fontSize="8"
                        fontWeight="bold"
                        fontFamily="JetBrains Mono"
                      >
                        {station.waitingCount} PAX
                      </text>
                      <text
                        x="32"
                        y="8"
                        textAnchor="end"
                        fill="rgba(255,255,255,0.8)"
                        fontSize="8"
                        fontFamily="JetBrains Mono"
                      >
                        {station.passengerDemandPct}%
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* RENDER ALL MOVING TRAINS */}
              {trains.map((train) => (
                <TrainVehicle
                  key={train.id}
                  train={train}
                  onClick={onSelectTrain}
                  isSelected={selectedTrain?.id === train.id}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Integrated Side Control & Telemetry Deck (3 Cols) */}
        <div className="xl:col-span-3 gov-card rounded-xl p-4 border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/10">
              <span className="text-[10px] font-mono-tech uppercase tracking-wider text-white/50 font-bold">
                SIMULATION CONTROLS
              </span>
              <div className="flex items-center gap-1.5 text-xs font-mono-tech text-[#38BDF8]">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-bold">{simTime}</span>
              </div>
            </div>

            {/* Playback Controls (Play / Pause, Speed Multipliers) */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onTogglePlay}
                  className={`py-2.5 px-3 rounded-lg font-display font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-sm ${
                    isPlaying
                      ? 'bg-[#E30613] text-white hover:bg-[#FF1A2E]'
                      : 'bg-[#22C55E] text-black hover:bg-[#4ADE80]'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>PAUSE SIM</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>RUN SIM</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onReset}
                  className="py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-mono-tech text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET</span>
                </button>
              </div>

              {/* Speed Multipliers */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono-tech text-white/40 uppercase block">
                  PLAYBACK SPEED
                </span>
                <div className="grid grid-cols-4 gap-1.5 bg-[#05080E] p-1 rounded-lg border border-white/10 font-mono-tech text-xs">
                  {[0.5, 1, 2, 4].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => onSetSpeed(spd)}
                      className={`py-1 rounded transition-colors cursor-pointer text-center ${
                        simSpeed === spd
                          ? 'bg-[#0284C7] text-white font-bold'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {spd}×
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Scrubber Slider */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <div className="flex justify-between text-[10px] font-mono-tech text-white/60">
                  <span>08:00 (START)</span>
                  <span className="text-[#38BDF8] font-bold">{progressPct.toFixed(0)}% ELAPSED</span>
                  <span>09:30 (END)</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0284C7] rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick Live Telemetry Readout */}
            <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-xs font-mono-tech">
              <span className="text-[9px] font-bold text-white/40 uppercase block">
                CORRIDOR TELEMETRY
              </span>
              <div className="flex justify-between p-2 rounded bg-white/5">
                <span className="text-white/50">ACTIVE FLEET:</span>
                <span className="text-[#22C55E] font-bold">
                  {trains.filter(t => t.status === 'IN_SERVICE' || t.status === 'INDUCTING').length}/{trains.length} Units
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-white/5">
                <span className="text-white/50">TARGET HEADWAY:</span>
                <span className="text-[#38BDF8] font-bold">04:30 MIN</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-white/5">
                <span className="text-white/50">POWER GRID:</span>
                <span className="text-white font-bold">750V DC (OK)</span>
              </div>
            </div>
          </div>

          {/* Quick AI Optimize Action Button */}
          <div className="pt-3 border-t border-white/10">
            <button
              onClick={onRunOptimization}
              disabled={isOptimizing}
              className="w-full py-2.5 px-3 rounded-lg bg-[#E30613] hover:bg-[#FF1A2E] text-white font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'SOLVING...' : 'TRIGGER AI OPTIMIZE'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hover Station Inspector Tooltip */}
      {hoveredStation && (
        <div className="absolute top-20 right-8 bg-[#0E1626] border border-white/20 rounded-xl p-4 shadow-2xl z-30 min-w-[240px] pointer-events-none text-xs font-mono-tech">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
            <span className="font-bold text-white uppercase text-sm font-display">
              {hoveredStation.name}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              hoveredStation.status === 'SURGE_CRITICAL' 
                ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40' 
                : 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40'
            }`}>
              {hoveredStation.status}
            </span>
          </div>

          <div className="space-y-1.5 text-white/80">
            <div className="flex justify-between">
              <span className="text-white/40">DEMAND LOAD:</span>
              <span className="text-[#38BDF8] font-bold">{hoveredStation.passengerDemandPct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">WAITING QUEUE:</span>
              <span className="text-white font-bold">{hoveredStation.waitingCount} commuters</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">INFLOW RATE:</span>
              <span className="text-[#F59E0B] font-bold">+{hoveredStation.inflowRatePerMin} pax/min</span>
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-white/10 text-[9px] text-[#38BDF8] flex items-center gap-1">
            <Info className="w-3 h-3" />
            <span>Click node to view full platform CCTV telemetry</span>
          </div>
        </div>
      )}
    </div>
  );
};
