import React, { useState } from 'react';
import { SensorNode, PipelineSegment, CaseType } from '../../types/simulation';
import { 
  Activity, 
  Info,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Wifi,
  Battery,
  Layers,
  ArrowRight,
  Zap,
  Loader2,
  Search
} from 'lucide-react';

interface RailwayNetworkProps {
  trains: SensorNode[]; // Sensors
  stations: PipelineSegment[]; // Segments
  currentCase: CaseType;
  onSelectTrain: (sensor: SensorNode) => void;
  onSelectStation: (segment: PipelineSegment) => void;
  selectedTrain: SensorNode | null;
  selectedStation: PipelineSegment | null;
  isOptimizing: boolean;
  simTime: string;
  simSeconds: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  simSpeed: number;
  onSetSpeed: (speed: number) => void;
  onReset: () => void;
  onRunOptimization: () => void;
  // Optional JalDrishti interactive extension props
  simulationState?: 'NORMAL' | 'WARNING' | 'LEAK_SUSPECTED';
  onSetSimulationState?: (state: 'NORMAL' | 'WARNING' | 'LEAK_SUSPECTED') => void;
  isFetchingSensor?: boolean;
  fetchingSensorId?: string | null;
  onSelectSensorAsync?: (sensor: SensorNode) => void;
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
  onRunOptimization,
  simulationState = 'LEAK_SUSPECTED',
  onSetSimulationState,
  isFetchingSensor = false,
  fetchingSensorId = null,
  onSelectSensorAsync
}) => {
  const [internalSimState, setInternalSimState] = useState<'NORMAL' | 'WARNING' | 'LEAK_SUSPECTED'>('LEAK_SUSPECTED');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const activeState = onSetSimulationState ? simulationState : internalSimState;
  const setActiveState = onSetSimulationState || setInternalSimState;

  // Retrieve Sensor A (PS-01) and Sensor B (FS-02)
  const sensorA = trains.find(s => s.id === 'PS-01') || trains[0];
  const sensorB = trains.find(s => s.id === 'FS-02') || trains[1];

  const handleSensorClick = (sensor: SensorNode) => {
    if (onSelectSensorAsync) {
      onSelectSensorAsync(sensor);
    } else {
      onSelectTrain(sensor);
    }
  };

  return (
    <div className="donezo-card p-5 md:p-6 space-y-5 select-none">
      {/* 1. Header with JalDrishti Water Intelligence Branding & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F0F2F5]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#E8F7EE] text-[#144230] shadow-2xs">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display font-bold text-base md:text-lg text-[#111827]">
                Pipeline Simulation & Acoustic Localisation
              </h2>
              <span className="text-[10px] font-mono-tech px-2.5 py-0.5 rounded-full bg-[#E8F7EE] text-[#144230] border border-[#B7E4C7] font-bold">
                ZONE Z-07 • SEGMENT S-14 • DN600 DUCTILE IRON • 650M SPAN
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Interactive dual-sensor monitoring with hydraulic digital twin and acoustic leak pinpointing
            </p>
          </div>
        </div>

        {/* Simulation State Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F5F7] rounded-full border border-[#E5E7EB] text-xs font-mono-tech">
          <button
            onClick={() => setActiveState('NORMAL')}
            className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeState === 'NORMAL'
                ? 'bg-[#144230] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Normal</span>
          </button>

          <button
            onClick={() => setActiveState('WARNING')}
            className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeState === 'WARNING'
                ? 'bg-[#F59E0B] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Anomaly</span>
          </button>

          <button
            onClick={() => setActiveState('LEAK_SUSPECTED')}
            className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeState === 'LEAK_SUSPECTED'
                ? 'bg-[#EF4444] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>Leak Suspected</span>
          </button>
        </div>
      </div>

      {/* 2. Central Water Pipeline Simulation Graphic Canvas */}
      <div className="relative bg-[#F9FAFB] rounded-3xl border border-[#ECEEF2] p-4 md:p-6 overflow-x-auto min-h-[460px] flex flex-col justify-between shadow-inner">
        {/* Top Status & Instructional Pill */}
        <div className="flex items-center justify-between gap-2 text-xs font-mono-tech mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[#144230] font-bold text-[11px]">
              {activeState === 'NORMAL' && 'PIPELINE HYDRAULICS BALANCED • 0.0 m³/h UNMETERED RESIDUAL'}
              {activeState === 'WARNING' && 'WARNING: HYDRAULIC IMBALANCE DETECTED (ΔQ = -70 m³/h • ΔP = 0.9 bar)'}
              {activeState === 'LEAK_SUSPECTED' && 'CRITICAL: ACOUSTIC SIGNATURE PINPOINTED AT 38.4m FROM SENSOR A'}
            </span>
          </div>

          <div className="text-[10px] text-[#6B7280] bg-white px-2.5 py-1 rounded-full border border-[#E5E7EB] shadow-2xs flex items-center gap-1">
            <Info className="w-3 h-3 text-[#144230]" />
            <span>Click either sensor node to fetch live telemetry</span>
          </div>
        </div>

        {/* The Pipeline & Sensors Visual SVG */}
        <div className="w-full min-w-[920px] relative my-auto py-6">
          <svg viewBox="0 0 1000 360" className="w-full h-auto select-none" style={{ minHeight: '340px' }}>
            <defs>
              {/* Pipe Metallic Gradient */}
              <linearGradient id="pipeWallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#374151" />
                <stop offset="15%" stopColor="#4B5563" />
                <stop offset="50%" stopColor="#9CA3AF" />
                <stop offset="85%" stopColor="#4B5563" />
                <stop offset="100%" stopColor="#1F2937" />
              </linearGradient>

              {/* Water Fluid Flow Gradient */}
              <linearGradient id="waterFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#144230" stopOpacity="0.85" />
                <stop offset="35%" stopColor="#22C55E" stopOpacity="0.9" />
                <stop offset="65%" stopColor={activeState === 'LEAK_SUSPECTED' ? '#EF4444' : '#22C55E'} stopOpacity="0.85" />
                <stop offset="100%" stopColor={activeState === 'NORMAL' ? '#144230' : '#D97706'} stopOpacity="0.85" />
              </linearGradient>

              {/* Flange Gradient */}
              <linearGradient id="flangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4B5563" />
                <stop offset="50%" stopColor="#9CA3AF" />
                <stop offset="100%" stopColor="#1F2937" />
              </linearGradient>

              {/* Glow Filter for Sensors */}
              <filter id="sensorGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Subtle Grid Backdrop */}
            <g opacity="0.04">
              {Array.from({ length: 20 }).map((_, i) => (
                <line key={`vg-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="360" stroke="#111827" strokeWidth="1" />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <line key={`hg-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} stroke="#111827" strokeWidth="1" />
              ))}
            </g>

            {/* Flow Direction Indicator Banner (Top Pipe) */}
            <g transform="translate(420, 115)">
              <rect x="0" y="0" width="160" height="22" rx="11" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
              <text x="80" y="15" fill="#144230" fontSize="9.5" fontWeight="bold" fontFamily="JetBrains Mono" textAnchor="middle">
                FLUID FLOW → (930 m³/h)
              </text>
            </g>

            {/* ================= MAIN PIPELINE STRUCTURE ================= */}
            <g id="main-pipeline-assembly">
              {/* Pipe Shadow */}
              <rect x="100" y="215" width="800" height="10" rx="5" fill="#E5E7EB" />

              {/* Outer Steel Pipe Body */}
              <rect
                x="110"
                y="150"
                width="780"
                height="62"
                rx="6"
                fill="url(#pipeWallGradient)"
                stroke="#1F2937"
                strokeWidth="2"
              />

              {/* Inner Fluid Core (Animated Flow Pulse) */}
              <rect
                x="116"
                y="158"
                width="768"
                height="46"
                rx="4"
                fill="url(#waterFlowGradient)"
                opacity="0.9"
              />

              {/* Flow Streamlines & Particle Dash Pulse */}
              <line
                x1="120"
                y1="172"
                x2="880"
                y2="172"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeDasharray="18 12"
                strokeOpacity="0.6"
              >
                {isPlaying && (
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-60"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                )}
              </line>
              <line
                x1="120"
                y1="190"
                x2="880"
                y2="190"
                stroke="#B7E4C7"
                strokeWidth="2"
                strokeDasharray="12 16"
                strokeOpacity="0.5"
              >
                {isPlaying && (
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-56"
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                )}
              </line>

              {/* Pipe Couplings / Mechanical Joints (Welds & Flanges) */}
              {[110, 260, 480, 700, 890].map((flangeX, idx) => (
                <g key={`flange-${idx}`}>
                  <rect
                    x={flangeX - 7}
                    y="142"
                    width="14"
                    height="78"
                    rx="3"
                    fill="url(#flangeGradient)"
                    stroke="#111827"
                    strokeWidth="1.5"
                  />
                  {/* Flange Bolts */}
                  <circle cx={flangeX} cy="148" r="2.5" fill="#111827" />
                  <circle cx={flangeX} cy="160" r="2" fill="#E5E7EB" />
                  <circle cx={flangeX} cy="202" r="2" fill="#E5E7EB" />
                  <circle cx={flangeX} cy="214" r="2.5" fill="#111827" />
                </g>
              ))}

              {/* Pipe Specification Text on Body */}
              <text
                x="500"
                y="185"
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="bold"
                fontFamily="JetBrains Mono"
                letterSpacing="0.08em"
                textAnchor="middle"
                opacity="0.85"
              >
                WATER DISTRIBUTION PIPELINE • DN600 DUCTILE IRON (CLASS K9)
              </text>
            </g>

            {/* ================= SENSOR A ASSEMBLY (LEFT: PS-01) ================= */}
            <g
              id="sensor-node-a"
              transform="translate(260, 150)"
              onClick={() => handleSensorClick(sensorA)}
              onMouseEnter={() => setHoveredNode('sensorA')}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer group"
            >
              {/* Vertical Mounting Stalk & Collar */}
              <rect x="-6" y="-60" width="12" height="60" fill="#374151" stroke="#111827" strokeWidth="1.5" rx="2" />
              <rect x="-14" y="-12" width="28" height="14" fill="#9CA3AF" stroke="#111827" strokeWidth="1.5" rx="3" />
              <circle cx="0" cy="-6" r="3" fill="#144230" />

              {/* Selected / Hover Halo Pulse */}
              <circle
                cx="0"
                cy="-70"
                r={selectedTrain?.id === 'PS-01' ? "32" : hoveredNode === 'sensorA' ? "28" : "22"}
                fill={selectedTrain?.id === 'PS-01' ? "rgba(20,66,48,0.25)" : "rgba(34,197,94,0.18)"}
                className="transition-all duration-300"
              />

              {/* Sensor Head Housing Capsule */}
              <circle
                cx="0"
                cy="-70"
                r="18"
                fill={selectedTrain?.id === 'PS-01' ? "#144230" : "#FFFFFF"}
                stroke="#144230"
                strokeWidth={selectedTrain?.id === 'PS-01' ? "3.5" : "2.5"}
                className="group-hover:scale-110 transition-transform origin-center"
              />
              <circle
                cx="0"
                cy="-70"
                r="7"
                fill={selectedTrain?.id === 'PS-01' ? "#22C55E" : "#144230"}
              />

              {/* Diagnostic LED */}
              <circle cx="9" cy="-79" r="3" fill="#22C55E" />

              {/* Loading Spinner if being fetched */}
              {isFetchingSensor && fetchingSensorId === 'PS-01' && (
                <circle cx="0" cy="-70" r="14" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeDasharray="14 10">
                  <animateTransform attributeName="transform" type="rotate" from="0 0 -70" to="360 0 -70" dur="0.8s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Top Sensor Label Card (Matching Donezo Pill) */}
              <g transform="translate(0, -112)">
                <rect
                  x="-75"
                  y="-18"
                  width="150"
                  height="36"
                  rx="10"
                  fill="#FFFFFF"
                  stroke={selectedTrain?.id === 'PS-01' ? '#144230' : '#E5E7EB'}
                  strokeWidth={selectedTrain?.id === 'PS-01' ? '2' : '1'}
                  className="drop-shadow-sm group-hover:scale-105 transition-transform"
                />
                <text x="0" y="-3" fill="#144230" fontSize="10.5" fontWeight="bold" fontFamily="Plus Jakarta Sans" textAnchor="middle">
                  SENSOR A (PS-01)
                </text>
                <text x="0" y="11" fill="#4B5563" fontSize="8.5" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">
                  PRESSURE: {sensorA.pressureBar} BAR • NOMINAL
                </text>
              </g>

              {/* Chainage Marker (Bottom) */}
              <g transform="translate(0, 85)">
                <rect x="-42" y="-10" width="84" height="20" rx="5" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
                <text x="0" y="4" fill="#6B7280" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                  Ch. 12+200m
                </text>
              </g>
            </g>

            {/* ================= SENSOR B ASSEMBLY (RIGHT: FS-02) ================= */}
            <g
              id="sensor-node-b"
              transform="translate(700, 150)"
              onClick={() => handleSensorClick(sensorB)}
              onMouseEnter={() => setHoveredNode('sensorB')}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer group"
            >
              {/* Vertical Mounting Stalk & Collar */}
              <rect x="-6" y="-60" width="12" height="60" fill="#374151" stroke="#111827" strokeWidth="1.5" rx="2" />
              <rect x="-14" y="-12" width="28" height="14" fill="#9CA3AF" stroke="#111827" strokeWidth="1.5" rx="3" />
              <circle cx="0" cy="-6" r="3" fill={activeState === 'NORMAL' ? '#144230' : '#EF4444'} />

              {/* Selected / Hover Halo Pulse */}
              <circle
                cx="0"
                cy="-70"
                r={selectedTrain?.id === 'FS-02' ? "32" : hoveredNode === 'sensorB' ? "28" : "22"}
                fill={
                  activeState === 'NORMAL'
                    ? "rgba(34,197,94,0.18)"
                    : "rgba(239,68,68,0.2)"
                }
                className="transition-all duration-300"
              />

              {/* Sensor Head Housing Capsule */}
              <circle
                cx="0"
                cy="-70"
                r="18"
                fill={selectedTrain?.id === 'FS-02' ? "#144230" : "#FFFFFF"}
                stroke={activeState === 'NORMAL' ? '#144230' : '#EF4444'}
                strokeWidth={selectedTrain?.id === 'FS-02' ? "3.5" : "2.5"}
                className="group-hover:scale-110 transition-transform origin-center"
              />
              <circle
                cx="0"
                cy="-70"
                r="7"
                fill={activeState === 'NORMAL' ? '#22C55E' : '#EF4444'}
              />

              {/* Diagnostic LED */}
              <circle cx="9" cy="-79" r="3" fill={activeState === 'NORMAL' ? '#22C55E' : '#EF4444'} />

              {/* Loading Spinner if being fetched */}
              {isFetchingSensor && fetchingSensorId === 'FS-02' && (
                <circle cx="0" cy="-70" r="14" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="14 10">
                  <animateTransform attributeName="transform" type="rotate" from="0 0 -70" to="360 0 -70" dur="0.8s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Top Sensor Label Card (Matching Donezo Pill) */}
              <g transform="translate(0, -112)">
                <rect
                  x="-75"
                  y="-18"
                  width="150"
                  height="36"
                  rx="10"
                  fill="#FFFFFF"
                  stroke={selectedTrain?.id === 'FS-02' ? '#144230' : activeState === 'NORMAL' ? '#E5E7EB' : '#FECACA'}
                  strokeWidth={selectedTrain?.id === 'FS-02' ? '2' : '1'}
                  className="drop-shadow-sm group-hover:scale-105 transition-transform"
                />
                <text x="0" y="-3" fill={activeState === 'NORMAL' ? '#144230' : '#991B1B'} fontSize="10.5" fontWeight="bold" fontFamily="Plus Jakarta Sans" textAnchor="middle">
                  SENSOR B (FS-02)
                </text>
                <text x="0" y="11" fill="#4B5563" fontSize="8.5" fontFamily="JetBrains Mono" fontWeight="600" textAnchor="middle">
                  {activeState === 'NORMAL' ? `FLOW: 930 m³/h • NOMINAL` : `FLOW: ${sensorB.flowRateM3h} m³/h • ${sensorB.pressureBar} BAR`}
                </text>
              </g>

              {/* Chainage Marker (Bottom) */}
              <g transform="translate(0, 85)">
                <rect x="-42" y="-10" width="84" height="20" rx="5" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
                <text x="0" y="4" fill="#6B7280" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                  Ch. 12+850m
                </text>
              </g>
            </g>

            {/* ================= DYNAMIC LEAK PINPOINTING HUD (BETWEEN SENSOR A & B) ================= */}
            {activeState === 'LEAK_SUSPECTED' && (
              <g id="leak-anomaly-pinpoint" transform="translate(380, 180)">
                {/* Acoustic Ripple Waves emitting from leak point */}
                <circle cx="0" cy="0" r="16" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8">
                  <animate attributeName="r" values="8;36" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="0" r="28" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6">
                  <animate attributeName="r" values="16;52" dur="1.8s" begin="0.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="1.8s" begin="0.4s" repeatCount="indefinite" />
                </circle>

                {/* Pinpoint Anchor Dot */}
                <circle cx="0" cy="0" r="6" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />

                {/* Pinpoint Acoustic Callout Tag */}
                <g transform="translate(0, 52)">
                  <rect
                    x="-140"
                    y="-22"
                    width="280"
                    height="44"
                    rx="12"
                    fill="#FFFFFF"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    className="drop-shadow-md"
                  />
                  <text x="0" y="-6" fill="#991B1B" fontSize="10" fontWeight="bold" fontFamily="Plus Jakarta Sans" textAnchor="middle">
                    ⚠ PINPOINTED LEAK: 38.4m FROM SENSOR A
                  </text>
                  <text x="0" y="10" fill="#4B5563" fontSize="8.5" fontFamily="JetBrains Mono" textAnchor="middle">
                    Ch. 12+238.4m • GCC-PHAT Δτ = 12.8ms • 97.4% CONF
                  </text>
                </g>

                {/* Distance Dimension Line from Sensor A to Leak */}
                <line x1="-120" y1="-45" x2="0" y2="-45" stroke="#144230" strokeWidth="1.5" strokeDasharray="3 2" />
                <circle cx="-120" cy="-45" r="2" fill="#144230" />
                <circle cx="0" cy="-45" r="2" fill="#EF4444" />
                <rect x="-70" y="-55" width="48" height="16" rx="4" fill="#E8F7EE" stroke="#B7E4C7" strokeWidth="0.8" />
                <text x="-46" y="-44" fill="#144230" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                  38.4m
                </text>
              </g>
            )}

            {/* In Warning Mode: Pressure Gradient & Imbalance Vector */}
            {activeState === 'WARNING' && (
              <g transform="translate(480, 180)">
                <rect x="-105" y="-18" width="210" height="36" rx="10" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.5" />
                <text x="0" y="-2" fill="#92400E" fontSize="9.5" fontWeight="bold" fontFamily="Plus Jakarta Sans" textAnchor="middle">
                  PRESSURE GRADIENT ANOMALY
                </text>
                <text x="0" y="10" fill="#78350F" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                  ΔP: 0.9 bar drop • Flow deficit: -70 m³/h
                </text>
              </g>
            )}

            {/* In Normal Mode: Balanced State Tag */}
            {activeState === 'NORMAL' && (
              <g transform="translate(480, 180)">
                <rect x="-95" y="-16" width="190" height="32" rx="8" fill="#E8F7EE" stroke="#B7E4C7" strokeWidth="1" />
                <text x="0" y="-2" fill="#144230" fontSize="9" fontWeight="bold" fontFamily="Plus Jakarta Sans" textAnchor="middle">
                  HYDRAULIC CONTINUITY VERIFIED
                </text>
                <text x="0" y="9" fill="#166534" fontSize="7.5" fontFamily="JetBrains Mono" textAnchor="middle">
                  Q_in (930) == Q_out (930) • 0.0 m³/h LOSS
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* 3. Bottom Quick Telemetry Summary Ribbon */}
        <div className="pt-3 border-t border-[#ECEEF2] flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E5E7EB] shadow-2xs">
              <span className="text-[#9CA3AF]">SENSOR A:</span>
              <span className="text-[#144230] font-bold">PS-01 (4.8 bar)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E5E7EB] shadow-2xs">
              <span className="text-[#9CA3AF]">SENSOR B:</span>
              <span className={`font-bold ${activeState === 'NORMAL' ? 'text-[#144230]' : 'text-[#EF4444]'}`}>
                FS-02 ({activeState === 'NORMAL' ? '4.8 bar' : `${sensorB.pressureBar} bar`})
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${activeState === 'NORMAL' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`} />
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E5E7EB] shadow-2xs">
              <span className="text-[#9CA3AF]">SPAN DISTANCE:</span>
              <span className="text-[#111827] font-bold">650.0 meters</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRunOptimization}
              disabled={isOptimizing}
              className="px-4 py-1.5 rounded-full bg-[#144230] hover:bg-[#1A543E] text-white font-display font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Activity className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>{isOptimizing ? 'Pinpointing Leak...' : 'Solve Acoustic Model'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Complete Water Pipeline Network Corridor Route (Segments S-00 to S-06) */}
      <div className="p-4 rounded-2xl bg-white border border-[#ECEEF2]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#111827] font-display uppercase tracking-wider">
            Bengaluru Cauvery Transmission Corridor • 26.8 KM Network Overview
          </span>
          <span className="text-[10px] font-mono-tech text-[#6B7280]">
            CLICK SEGMENT NODE TO INSPECT HYDRAULIC GRADE LINE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {stations.map((segment) => {
            const isSelected = selectedStation?.id === segment.id;
            const isCrit = segment.status === 'CRITICAL_LEAK';
            const isWarn = segment.status === 'PRESSURE_DROP';

            return (
              <div
                key={segment.id}
                onClick={() => onSelectStation(segment)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#E8F7EE] border-[#144230] shadow-sm'
                    : isCrit
                    ? 'bg-[#FEF2F2] border-[#FECACA] hover:border-[#EF4444]'
                    : isWarn
                    ? 'bg-[#FFFBEB] border-[#FDE68A] hover:border-[#F59E0B]'
                    : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-[#D1D5DB]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono-tech font-bold text-xs text-[#111827]">
                    {segment.code}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    isCrit ? 'bg-[#EF4444] animate-ping' : isWarn ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'
                  }`} />
                </div>
                <div className="text-[10px] text-[#4B5563] truncate font-medium">
                  {segment.name.split(' ')[1] || segment.name}
                </div>
                <div className="text-[9px] font-mono-tech text-[#9CA3AF] mt-1">
                  DN{segment.diameterMm} • {segment.actualFlowM3h} m³/h
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
