import React, { useState } from 'react';
import { Train, Station, CaseType } from '../../types/simulation';
import { TrainVehicle } from './TrainVehicle';
import { 
  Radio, 
  Info,
  Clock
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

  // Coordinates on the 1200x480 SVG map
  const stationCoords: Record<string, { x: number; y: number }> = {
    DEPOT: { x: 120, y: 95 },
    ALUVA: { x: 200, y: 290 },
    KALAMASSERY: { x: 390, y: 290 },
    EDAPPALLY: { x: 580, y: 290 },
    KALOOR: { x: 770, y: 290 },
    MG_ROAD: { x: 960, y: 290 },
    TRIPUNITHURA: { x: 1120, y: 290 }
  };

  return (
    <div className="donezo-card p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F0F2F5]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#E8F7EE] text-[#144230]">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-base md:text-lg text-[#111827]">
                Corridor & Depot Operations Map
              </h2>
              <span className="text-[10px] font-mono-tech px-2.5 py-0.5 rounded-full bg-[#F4F5F7] text-[#4B5563] border border-[#E5E7EB] font-semibold">
                LINE 1 • 25.6 KM • ALSTOM CBTC
              </span>
            </div>
            <p className="text-xs text-[#6B7280]">
              Real-time train positioning, siding turnover, and passenger queue telemetry
            </p>
          </div>
        </div>

        {/* Clean Status Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tech text-[#6B7280]">
          <div className="flex items-center gap-1.5 bg-[#F4F5F7] px-2.5 py-1 rounded-full border border-[#E5E7EB]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#144230]" />
            <span className="text-[#111827] font-medium">In Service</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#F4F5F7] px-2.5 py-1 rounded-full border border-[#E5E7EB]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
            <span className="text-[#111827] font-medium">AI Inducting</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#F4F5F7] px-2.5 py-1 rounded-full border border-[#E5E7EB]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <span className="text-[#111827] font-medium">Standby Depot</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#F4F5F7] px-2.5 py-1 rounded-full border border-[#E5E7EB]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            <span className="text-[#111827] font-medium">Maintenance</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative bg-[#F9FAFB] rounded-2xl border border-[#ECEEF2] p-3 overflow-x-auto min-h-[460px] flex items-center">
        <div className="w-full min-w-[1040px] relative">
          <svg
            viewBox="0 0 1200 480"
            className="w-full h-auto select-none"
            style={{ minHeight: '440px' }}
          >
            <defs>
              <linearGradient id="mainlineTrackStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#144230" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#22C55E" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#144230" stopOpacity="0.75" />
              </linearGradient>

              <linearGradient id="depotFeederStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#144230" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Subtle Grid Lines */}
            <g opacity="0.04">
              {Array.from({ length: 24 }).map((_, i) => (
                <line
                  key={`vg-${i}`}
                  x1={i * 50}
                  y1="0"
                  x2={i * 50}
                  y2="480"
                  stroke="#111827"
                  strokeWidth="1"
                />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <line
                  key={`hg-${i}`}
                  x1="0"
                  y1={i * 50}
                  x2="1200"
                  y2={i * 50}
                  stroke="#111827"
                  strokeWidth="1"
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
                rx="12"
                fill="#FFFFFF"
                stroke="#144230"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                className="drop-shadow-2xs"
              />
              <text
                x="14"
                y="24"
                fill="#144230"
                fontSize="11"
                fontWeight="bold"
                fontFamily="Plus Jakarta Sans"
                letterSpacing="0.04em"
              >
                MUTTOM DEPOT
              </text>
              <text
                x="14"
                y="38"
                fill="#6B7280"
                fontSize="8.5"
                fontFamily="JetBrains Mono"
              >
                ROLLING STOCK STABLING & INDUCTION
              </text>

              {/* Depot Siding Tracks */}
              <line x1="18" y1="65" x2="162" y2="65" stroke="#D1D5DB" strokeWidth="2.5" />
              <text x="20" y="60" fill="#9CA3AF" fontSize="7" fontFamily="JetBrains Mono">SIDING 1</text>

              <line x1="18" y1="95" x2="162" y2="95" stroke="#D1D5DB" strokeWidth="2.5" />
              <text x="20" y="90" fill="#9CA3AF" fontSize="7" fontFamily="JetBrains Mono">SIDING 2 (HOT RESERVE)</text>

              <line x1="18" y1="120" x2="162" y2="120" stroke="#144230" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
              <text x="20" y="116" fill="#144230" fontSize="7" fontFamily="JetBrains Mono" fontWeight="bold">INDUCTION LINE</text>
            </g>

            {/* DEPOT-TO-MAINLINE TURNOUT FEEDER TRACK */}
            <g>
              <path
                d="M 140 100 C 160 100, 180 190, 200 290"
                stroke="url(#depotFeederStroke)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5 3"
              />
              <text
                x="165"
                y="200"
                fill="#144230"
                fontSize="8.5"
                fontWeight="bold"
                fontFamily="JetBrains Mono"
              >
                DEPOT TURNOUT
              </text>
            </g>

            {/* MAINLINE DOUBLE TRACKS (DOWN & UP) */}
            <g>
              {/* Track 1 Bed (Down Line) */}
              <line
                x1="190"
                y1="272"
                x2="1130"
                y2="272"
                stroke="#E5E7EB"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <line
                x1="190"
                y1="272"
                x2="1130"
                y2="272"
                stroke="url(#mainlineTrackStroke)"
                strokeWidth="3"
              />

              {/* Track 2 Bed (Up Line) */}
              <line
                x1="190"
                y1="308"
                x2="1130"
                y2="308"
                stroke="#E5E7EB"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <line
                x1="190"
                y1="308"
                x2="1130"
                y2="308"
                stroke="url(#mainlineTrackStroke)"
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
                    stroke="#E5E7EB"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Direction Labels */}
              <text
                x="660"
                y="260"
                fill="#144230"
                fontSize="8.5"
                fontFamily="JetBrains Mono"
                fontWeight="600"
              >
                DOWN LINE → (SOUTHBOUND TO TRIPUNITHURA)
              </text>
              <text
                x="660"
                y="326"
                fill="#144230"
                fontSize="8.5"
                fontFamily="JetBrains Mono"
                fontWeight="600"
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

            {/* RENDER ALL STATIONS */}
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
                  {/* Station Halo */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isSurge ? "24" : "18"}
                    fill={isSurge ? "rgba(239,68,68,0.15)" : "rgba(20,66,48,0.08)"}
                  />

                  {/* Station Pillar / Marker */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isSelected ? "11" : "8"}
                    fill="#FFFFFF"
                    stroke={isSelected ? '#144230' : isSurge ? '#EF4444' : '#144230'}
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
                      fill="#111827"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="Plus Jakarta Sans"
                    >
                      {station.name}
                    </text>
                    <text
                      x="0"
                      y="12"
                      textAnchor="middle"
                      fill="#6B7280"
                      fontSize="8"
                      fontFamily="JetBrains Mono"
                    >
                      KM {station.kmPosition.toFixed(1)} • {station.code}
                    </text>
                  </g>

                  {/* Demand & Queue HUD Badge (Bottom) */}
                  <g transform="translate(0, 48)">
                    <rect
                      x="-42"
                      y="-13"
                      width="84"
                      height="26"
                      rx="6"
                      fill="#FFFFFF"
                      stroke={isSurge ? '#EF4444' : '#E5E7EB'}
                      strokeWidth={isSurge ? '1.5' : '1'}
                      className="drop-shadow-2xs"
                    />
                    
                    {/* Passenger Demand Bar */}
                    <rect x="-36" y="-8" width="72" height="4.5" rx="1.5" fill="#E5E7EB" />
                    <rect
                      x="-36"
                      y="-8"
                      width={Math.max(4, (station.passengerDemandPct / 100) * 72)}
                      height="4.5"
                      rx="1.5"
                      fill={isSurge ? '#EF4444' : station.passengerDemandPct > 70 ? '#F59E0B' : '#144230'}
                    />

                    {/* Waiting Count */}
                    <text
                      x="-34"
                      y="8"
                      fill={isSurge ? '#EF4444' : '#144230'}
                      fontSize="8"
                      fontWeight="bold"
                      fontFamily="JetBrains Mono"
                    >
                      {station.waitingCount} PAX
                    </text>
                    <text
                      x="34"
                      y="8"
                      textAnchor="end"
                      fill="#4B5563"
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

      {/* Station Hover Tooltip */}
      {hoveredStation && (
        <div className="absolute top-20 right-8 bg-white border border-[#ECEEF2] rounded-2xl p-4 shadow-xl z-30 min-w-[240px] pointer-events-none text-xs font-mono-tech">
          <div className="flex items-center justify-between border-b border-[#F0F2F5] pb-1.5 mb-2">
            <span className="font-bold text-[#111827] text-sm font-display">
              {hoveredStation.name}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              hoveredStation.status === 'SURGE_CRITICAL' 
                ? 'bg-[#FEE2E2] text-[#991B1B]' 
                : 'bg-[#E8F7EE] text-[#144230]'
            }`}>
              {hoveredStation.status}
            </span>
          </div>

          <div className="space-y-1.5 text-[#4B5563]">
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">DEMAND LOAD:</span>
              <span className="text-[#144230] font-bold">{hoveredStation.passengerDemandPct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">WAITING QUEUE:</span>
              <span className="text-[#111827] font-bold">{hoveredStation.waitingCount} commuters</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9CA3AF]">INFLOW RATE:</span>
              <span className="text-[#D97706] font-bold">+{hoveredStation.inflowRatePerMin} pax/min</span>
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-[#F0F2F5] text-[9px] text-[#144230] flex items-center gap-1">
            <Info className="w-3 h-3" />
            <span>Click node to view full CCTV telemetry</span>
          </div>
        </div>
      )}
    </div>
  );
};
