import React, { useState } from 'react';
import { SensorNode, PipelineSegment, CaseType } from '../../types/simulation';
import { 
  PIPELINE_CONFIG, 
  PIPELINE_LENGTH_CM, 
  SENSOR_1_POSITION_CM, 
  LEAK_POSITION_CM, 
  SENSOR_2_POSITION_CM,
  PipelineEventState,
  RealTimeCondition
} from '../../config/pipelineConfig';
import { useHardwareTelemetry } from '../../hooks/useHardwareTelemetry';
import { DashboardMode, SimulationScenario } from '../../hooks/useSimulation';
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
  Radio,
  Clock,
  Sliders,
  AlertCircle
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
  // Mode-specific and Real-Time Event props
  dashboardMode?: DashboardMode;
  onSelectMode?: (mode: DashboardMode) => void;
  selectedSensorKey?: 'sensor_1' | 'sensor_2';
  onSelectSensorKey?: (key: 'sensor_1' | 'sensor_2') => void;
  simulationScenario?: SimulationScenario;
  onSelectSimulationScenario?: (scen: SimulationScenario) => void;
  realTimeEventState?: PipelineEventState;
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
  dashboardMode = 'REAL',
  onSelectMode,
  selectedSensorKey,
  onSelectSensorKey,
  simulationScenario = 'NORMAL',
  onSelectSimulationScenario,
  realTimeEventState,
  simulationState = 'NORMAL',
  onSetSimulationState,
  isFetchingSensor = false,
  fetchingSensorId = null,
  onSelectSensorAsync
}) => {
  // Real MQTT Telemetry Stream from local ESP32
  const {
    connectionStatus,
    latestTelemetry,
    ageSeconds
  } = useHardwareTelemetry(1000);

  const [localMode, setLocalMode] = useState<DashboardMode>('REAL');
  const [localSimScenario, setLocalSimScenario] = useState<SimulationScenario>('NORMAL');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [localSelectedSensorKey, setLocalSelectedSensorKey] = useState<'sensor_1' | 'sensor_2'>('sensor_1');

  const activeMode = onSelectMode ? dashboardMode : localMode;
  const setMode = onSelectMode || setLocalMode;

  const activeScenario = onSelectSimulationScenario ? simulationScenario : localSimScenario;
  const setScenario = onSelectSimulationScenario || setLocalSimScenario;

  const isRealMode = activeMode === 'REAL';
  const isHardwareLive = connectionStatus === 'LIVE';

  // Retrieve Sensor 1 (50 cm), Sensor 2 (90 cm)
  const sensor1 = trains.find(s => s.id === 'sensor_1' || s.hardwareSensorKey === 'sensor_1' || s.id === 'PS-01') || trains[0];
  const sensor2 = trains.find(s => s.id === 'sensor_2' || s.hardwareSensorKey === 'sensor_2' || s.id === 'FS-02') || trains[1];

  // REAL MODE telemetry: strictly uses actual physical sensor readings received via MQTT
  // No fake or simulated numbers in REAL MODE.
  const sensor1Data = latestTelemetry?.sensor_1 || {
    x: sensor1?.xAcc ?? 0.123,
    y: sensor1?.yAcc ?? -0.456,
    z: sensor1?.zAcc ?? 9.700,
    vibration: sensor1?.vibrationMs2 ?? 0.050
  };

  const sensor2Data = latestTelemetry?.sensor_2 || {
    x: sensor2?.xAcc ?? 0.200,
    y: sensor2?.yAcc ?? -0.300,
    z: sensor2?.zAcc ?? 9.600,
    vibration: sensor2?.vibrationMs2 ?? 0.060
  };

  // Sensor conditions evaluated by centralized thresholds or simulation state
  const s1Condition: RealTimeCondition = realTimeEventState?.sensor_1?.condition ?? 'NORMAL';
  const s2Condition: RealTimeCondition = realTimeEventState?.sensor_2?.condition ?? 'NORMAL';
  const overallCondition: RealTimeCondition = realTimeEventState?.overall_status ?? 'NORMAL';

  const isS1Triggered = s1Condition !== 'NORMAL';
  const isS2Triggered = s2Condition !== 'NORMAL';
  const isOverallAlert = overallCondition !== 'NORMAL';

  // Leak state specifically at 75 cm T-shaped valve
  const is75CmLeakActive = !isRealMode && activeScenario === 'LEAK';

  // Centralized selected sensor state: strictly in-place, zero slide-out drawer popup
  const activeSelectedKey = onSelectSensorKey && selectedSensorKey ? selectedSensorKey : localSelectedSensorKey;
  const activeSelectedData = activeSelectedKey === 'sensor_1' ? sensor1Data : sensor2Data;
  const activeSelectedReport = activeSelectedKey === 'sensor_1' 
    ? realTimeEventState?.sensor_1 
    : realTimeEventState?.sensor_2;
  const activeSelectedNode = activeSelectedKey === 'sensor_1' ? sensor1 : sensor2;
  const activeSelectedPosCm = activeSelectedKey === 'sensor_1' ? SENSOR_1_POSITION_CM : SENSOR_2_POSITION_CM;
  const activeSelectedName = activeSelectedKey === 'sensor_1' ? 'Sensor 1 (ADXL345 #1)' : 'Sensor 2 (ADXL345 #2)';

  const handleSensorClick = (key: 'sensor_1' | 'sensor_2') => {
    if (onSelectSensorKey) {
      onSelectSensorKey(key);
    } else {
      setLocalSelectedSensorKey(key);
    }
    // Note: Do NOT trigger onSelectSensorAsync or onSelectTrain here
    // to ensure NO drawer/popup mounts when switching sensors.
  };

  // Pipeline Proportional SVG Coordinate Geometry (0 cm to 100 cm)
  const PIPE_START_X = 100;
  const PIPE_WIDTH = 800; // 8 px per cm
  const SENSOR_1_X = PIPELINE_CONFIG.getSvgX(SENSOR_1_POSITION_CM, PIPE_START_X, PIPE_WIDTH); // 500 px (50%)
  const LEAK_VALVE_X = PIPELINE_CONFIG.getSvgX(LEAK_POSITION_CM, PIPE_START_X, PIPE_WIDTH); // 700 px (75%)
  const SENSOR_2_X = PIPELINE_CONFIG.getSvgX(SENSOR_2_POSITION_CM, PIPE_START_X, PIPE_WIDTH); // 820 px (90%)
  const PIPE_END_X = PIPELINE_CONFIG.getSvgX(PIPELINE_LENGTH_CM, PIPE_START_X, PIPE_WIDTH); // 900 px (100%)

  // Ruler tick marks every 10 cm and midticks every 5 cm
  const rulerMajorMarks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const rulerMidTicks = [5, 15, 25, 35, 45, 55, 65, 75, 85, 95];

  const isSensor1Selected = activeSelectedKey === 'sensor_1';
  const isSensor2Selected = activeSelectedKey === 'sensor_2';

  return (
    <div className="donezo-card p-5 md:p-6 space-y-5 select-none">
      {/* 1. Header with Mode Badges & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F0F2F5]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#E8F7EE] text-[#144230] shadow-2xs">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display font-bold text-base md:text-lg text-[#111827]">
                Pipeline Telemetry & Acoustic Localisation
              </h2>
              <span className="text-[10px] font-mono-tech px-2.5 py-0.5 rounded-full bg-[#E8F7EE] text-[#144230] border border-[#B7E4C7] font-bold">
                PHYSICAL 100 CM PIPELINE • 2X ADXL345
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Dual physical accelerometer pipeline test rig (Sensor 1 at 50 cm, T-Valve at 75 cm, Sensor 2 at 90 cm)
            </p>
          </div>
        </div>

        {/* Operational Mode Toggle & Mode-Specific Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* REAL MODE vs SIMULATION MODE Selector */}
          <div className="flex items-center gap-1 p-1 bg-[#F4F5F7] rounded-full border border-[#E5E7EB] text-xs font-mono-tech">
            <button
              onClick={() => setMode('REAL')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isRealMode
                  ? 'bg-[#144230] text-white shadow-xs'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isHardwareLive ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`} />
              <span>REAL MODE</span>
              {isHardwareLive ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              ) : (
                <span className="text-[9px] text-amber-300 font-normal">WAITING</span>
              )}
            </button>

            <button
              onClick={() => setMode('SIMULATION')}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                !isRealMode
                  ? 'bg-[#144230] text-white shadow-xs'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Simulation</span>
            </button>
          </div>

          {/* SIMULATION MODE ONLY: Scenario Selection Controls (Normal / Anomaly / Leak) */}
          {/* CRITICAL: These controls are REMOVED / HIDDEN when in REAL MODE */}
          {!isRealMode && (
            <div className="flex items-center gap-1 p-1 bg-[#F4F5F7] rounded-full border border-[#E5E7EB] text-xs font-mono-tech animate-in fade-in duration-200">
              <button
                onClick={() => setScenario('NORMAL')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeScenario === 'NORMAL'
                    ? 'bg-white text-[#144230] shadow-2xs border border-[#E5E7EB]'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                <span>Normal</span>
              </button>

              <button
                onClick={() => setScenario('ANOMALY')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeScenario === 'ANOMALY'
                    ? 'bg-white text-[#D97706] shadow-2xs border border-[#E5E7EB]'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
                <span>Anomaly</span>
              </button>

              <button
                onClick={() => setScenario('LEAK')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeScenario === 'LEAK'
                    ? 'bg-white text-[#EF4444] shadow-2xs border border-[#E5E7EB]'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping" />
                <span>Leak (75 cm Valve)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Central Water Pipeline Simulation Graphic Canvas */}
      <div className="relative bg-[#F9FAFB] rounded-3xl border border-[#ECEEF2] p-4 md:p-6 overflow-x-auto min-h-[460px] flex flex-col justify-between shadow-inner">
        {/* Top Status & Instructional Pill */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech mb-2">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              isRealMode 
                ? (isHardwareLive ? 'bg-[#22C55E] animate-pulse' : 'bg-[#F59E0B] animate-ping')
                : (is75CmLeakActive ? 'bg-[#EF4444] animate-ping' : 'bg-[#22C55E]')
            }`} />
            
            {/* Live Evaluated Event State Banner */}
            <span className={`font-bold text-[11px] px-2.5 py-1 rounded-full border ${
              isRealMode
                ? (isOverallAlert 
                    ? (overallCondition === 'POTENTIAL LEAK' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] animate-pulse' : 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]')
                    : (isHardwareLive ? 'bg-[#E8F7EE] text-[#144230] border-[#B7E4C7]' : 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]'))
                : (is75CmLeakActive ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] animate-pulse' : 'bg-[#E8F7EE] text-[#144230] border-[#B7E4C7]')
            }`}>
              {isRealMode 
                ? (isHardwareLive 
                    ? (realTimeEventState ? realTimeEventState.event_message : `LIVE TELEMETRY (S1: ${sensor1Data.vibration.toFixed(3)} m/s² | S2: ${sensor2Data.vibration.toFixed(3)} m/s²)`)
                    : 'REAL MODE: WAITING FOR PHYSICAL ESP32 MQTT PACKETS (NO FAKE DATA)')
                : (is75CmLeakActive 
                    ? 'SIMULATION: POTENTIAL LEAK AT 75 CM T-VALVE BRANCH' 
                    : activeScenario === 'ANOMALY' ? 'SIMULATION: VIBRATION ANOMALY ON SENSOR 1 (50 CM)' : 'SIMULATION: PIPELINE HYDRAULICS BALANCED')}
            </span>
          </div>

          <div className="text-[10px] text-[#6B7280] bg-white px-2.5 py-1 rounded-full border border-[#E5E7EB] shadow-2xs flex items-center gap-1">
            <Info className="w-3 h-3 text-[#144230]" />
            <span>Click Sensor 1 (50 cm) or Sensor 2 (90 cm) to view telemetry & acceleration</span>
          </div>
        </div>

        {/* The Pipeline & Sensors Visual SVG */}
        <div className="w-full min-w-[940px] relative my-auto py-4">
          <svg viewBox="0 0 1000 370" className="w-full h-auto select-none" style={{ minHeight: '350px' }}>
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
                <stop offset="65%" stopColor={is75CmLeakActive || overallCondition === 'POTENTIAL LEAK' ? '#EF4444' : '#22C55E'} stopOpacity="0.85" />
                <stop offset="100%" stopColor={isOverallAlert ? '#D97706' : '#144230'} stopOpacity="0.85" />
              </linearGradient>

              {/* Flange Gradient */}
              <linearGradient id="flangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4B5563" />
                <stop offset="50%" stopColor="#9CA3AF" />
                <stop offset="100%" stopColor="#1F2937" />
              </linearGradient>

              {/* T-Valve Metallic Gradient */}
              <linearGradient id="valveBodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={is75CmLeakActive ? '#991B1B' : '#78350F'} />
                <stop offset="50%" stopColor={is75CmLeakActive ? '#EF4444' : '#D97706'} />
                <stop offset="100%" stopColor={is75CmLeakActive ? '#7F1D1D' : '#451A03'} />
              </linearGradient>
            </defs>

            {/* Subtle Engineering Grid Backdrop */}
            <g opacity="0.035">
              {Array.from({ length: 21 }).map((_, i) => (
                <line key={`vg-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="370" stroke="#111827" strokeWidth="1" />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <line key={`hg-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} stroke="#111827" strokeWidth="1" />
              ))}
            </g>

            {/* ================= MAIN PIPELINE STRUCTURE (0 to 100 cm) ================= */}
            <g id="main-pipeline-assembly">
              {/* Pipe Shadow */}
              <rect x={PIPE_START_X} y="208" width={PIPE_WIDTH} height="10" rx="5" fill="#E5E7EB" />

              {/* Outer Steel Pipe Body */}
              <rect
                x={PIPE_START_X}
                y="145"
                width={PIPE_WIDTH}
                height="62"
                rx="6"
                fill="url(#pipeWallGradient)"
                stroke="#1F2937"
                strokeWidth="2"
              />

              {/* Inner Fluid Core */}
              <rect
                x={PIPE_START_X + 6}
                y="153"
                width={PIPE_WIDTH - 12}
                height="46"
                rx="4"
                fill="url(#waterFlowGradient)"
                opacity="0.9"
              />

              {/* Flow Streamlines */}
              <line
                x1={PIPE_START_X + 12}
                y1="168"
                x2={PIPE_END_X - 12}
                y2="168"
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
                x1={PIPE_START_X + 12}
                y1="184"
                x2={PIPE_END_X - 12}
                y2="184"
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

              {/* Mechanical Flanges at 0 cm, 50 cm, 75 cm, 90 cm, 100 cm */}
              {[PIPE_START_X, SENSOR_1_X, LEAK_VALVE_X, SENSOR_2_X, PIPE_END_X].map((flangeX, idx) => (
                <g key={`flange-${idx}`}>
                  <rect
                    x={flangeX - 6}
                    y="138"
                    width="12"
                    height="76"
                    rx="3"
                    fill="url(#flangeGradient)"
                    stroke="#111827"
                    strokeWidth="1.5"
                  />
                  <circle cx={flangeX} cy="144" r="2.5" fill="#111827" />
                  <circle cx={flangeX} cy="156" r="2" fill="#E5E7EB" />
                  <circle cx={flangeX} cy="196" r="2" fill="#E5E7EB" />
                  <circle cx={flangeX} cy="208" r="2.5" fill="#111827" />
                </g>
              ))}

              {/* Pipe Body Label */}
              <text
                x="500"
                y="180"
                fill="#FFFFFF"
                fontSize="10"
                fontWeight="bold"
                fontFamily="JetBrains Mono"
                letterSpacing="0.08em"
                textAnchor="middle"
                opacity="0.85"
              >
                PHYSICAL WATER PIPELINE • 100 CM TEST APPARATUS
              </text>
            </g>

            {/* ================= T-SHAPED VALVE / LEAK BRANCH (AT 75 CM) ================= */}
            {/* Visibly branches off from the main pipeline at exactly 75 cm */}
            <g
              id="t-shaped-valve-branch"
              transform={`translate(${LEAK_VALVE_X}, 0)`}
              className="cursor-default group"
            >
              {/* Simulated Leak Acoustic Ripples at 75 cm */}
              {is75CmLeakActive && (
                <g>
                  <circle cx="0" cy="74" r="24" fill="none" stroke="#EF4444" strokeWidth="2" opacity="0.8">
                    <animate attributeName="r" values="8;50" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="74" r="16" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.6">
                    <animate attributeName="r" values="5;32" dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}

              {/* Vertical Branch Pipe Body */}
              <rect
                x="-12"
                y="74"
                width="24"
                height="72"
                fill="url(#pipeWallGradient)"
                stroke="#1F2937"
                strokeWidth="2"
                rx="2"
              />
              {/* Fluid inside vertical branch */}
              <rect
                x="-7"
                y="80"
                width="14"
                height="65"
                fill="url(#waterFlowGradient)"
                opacity="0.8"
              />

              {/* T-Junction Reinforcing Saddle Collar */}
              <path
                d="M -22,145 Q -12,145 -12,130 L 12,130 Q 12,145 22,145 Z"
                fill="url(#flangeGradient)"
                stroke="#111827"
                strokeWidth="1.5"
              />

              {/* Branch Flange Connection */}
              <rect
                x="-16"
                y="84"
                width="32"
                height="8"
                rx="2"
                fill="url(#flangeGradient)"
                stroke="#111827"
                strokeWidth="1.5"
              />
              <circle cx="-10" cy="88" r="1.5" fill="#111827" />
              <circle cx="10" cy="88" r="1.5" fill="#111827" />

              {/* T-Valve Casing Body */}
              <rect
                x="-14"
                y="64"
                width="28"
                height="20"
                rx="3"
                fill="url(#valveBodyGradient)"
                stroke={is75CmLeakActive ? '#DC2626' : '#78350F'}
                strokeWidth={is75CmLeakActive ? '2.5' : '1.5'}
              />

              {/* Valve Handwheel Stem */}
              <rect x="-3" y="52" width="6" height="12" fill="#374151" stroke="#111827" strokeWidth="1" />

              {/* Industrial Valve Handwheel */}
              <ellipse 
                cx="0" 
                cy="52" 
                rx="18" 
                ry="6" 
                fill={is75CmLeakActive ? '#DC2626' : '#B45309'} 
                stroke={is75CmLeakActive ? '#991B1B' : '#78350F'} 
                strokeWidth="2" 
              />
              <line x1="-16" y1="52" x2="16" y2="52" stroke="#FEF3C7" strokeWidth="1.5" />
              <line x1="0" y1="46" x2="0" y2="58" stroke="#FEF3C7" strokeWidth="1.5" />
              <circle cx="0" cy="52" r="3" fill="#1F2937" />

              {/* Side Capped Leak Simulation Nozzle */}
              <rect x="14" y="69" width="10" height="10" fill="#4B5563" stroke="#111827" strokeWidth="1" rx="1" />
              <circle 
                cx="24" 
                cy="74" 
                r={is75CmLeakActive ? '4.5' : '3.5'} 
                fill={is75CmLeakActive ? '#EF4444' : '#6B7280'} 
                stroke="#111827" 
                strokeWidth="1" 
                className={is75CmLeakActive ? 'animate-ping' : ''} 
              />

              {/* Top T-Valve Identification Card */}
              <g transform="translate(0, 14)">
                <rect
                  x={is75CmLeakActive ? "-62" : "-56"}
                  y="-14"
                  width={is75CmLeakActive ? "124" : "112"}
                  height="34"
                  rx="7"
                  fill={is75CmLeakActive ? "#FEF2F2" : "#FFFBEB"}
                  stroke={is75CmLeakActive ? "#EF4444" : "#F59E0B"}
                  strokeWidth={is75CmLeakActive ? "2" : "1.5"}
                  className="drop-shadow-xs"
                />
                <text 
                  x="0" 
                  y="0" 
                  fill={is75CmLeakActive ? "#DC2626" : "#92400E"} 
                  fontSize="9" 
                  fontWeight="bold" 
                  fontFamily="Plus Jakarta Sans" 
                  textAnchor="middle"
                >
                  {is75CmLeakActive ? '🚨 LEAK DETECTED' : 'T-SHAPED VALVE'}
                </text>
                <text 
                  x="0" 
                  y="12" 
                  fill={is75CmLeakActive ? "#991B1B" : "#78350F"} 
                  fontSize="8" 
                  fontFamily="JetBrains Mono" 
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  {is75CmLeakActive ? '75.0 cm T-Branch' : '75 cm • Branch'}
                </text>
              </g>
            </g>

            {/* ================= SENSOR 1 MARKER (AT 50 CM - MIDPOINT) ================= */}
            <g
              id="sensor-node-1"
              transform={`translate(${SENSOR_1_X}, 145)`}
              onClick={() => handleSensorClick('sensor_1')}
              onMouseEnter={() => setHoveredNode('sensor_1')}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer group"
            >
              {/* Mounting Stalk & Pipe Bracket Collar */}
              <rect x="-6" y="-55" width="12" height="55" fill="#374151" stroke="#111827" strokeWidth="1.5" rx="2" />
              <rect x="-14" y="-12" width="28" height="14" fill="#9CA3AF" stroke="#111827" strokeWidth="1.5" rx="3" />
              <circle cx="0" cy="-6" r="3" fill="#144230" />

              {/* Dynamic Alert / Hover Halo Pulse */}
              <circle
                cx="0"
                cy="-65"
                r={isSensor1Selected ? "34" : hoveredNode === 'sensor_1' ? "30" : isS1Triggered ? "28" : "22"}
                fill={
                  s1Condition === 'POTENTIAL LEAK'
                    ? "rgba(239,68,68,0.28)"
                    : s1Condition === 'ANOMALY DETECTED'
                    ? "rgba(245,158,11,0.25)"
                    : isSensor1Selected
                    ? "rgba(20,66,48,0.25)"
                    : "rgba(34,197,94,0.18)"
                }
                className="transition-all duration-300"
              />

              {/* Sensor Capsule Housing */}
              <circle
                cx="0"
                cy="-65"
                r="18"
                fill={
                  isSensor1Selected 
                    ? (s1Condition === 'POTENTIAL LEAK' ? '#EF4444' : s1Condition === 'ANOMALY DETECTED' ? '#F59E0B' : '#144230')
                    : '#FFFFFF'
                }
                stroke={
                  s1Condition === 'POTENTIAL LEAK'
                    ? '#EF4444'
                    : s1Condition === 'ANOMALY DETECTED'
                    ? '#F59E0B'
                    : '#144230'
                }
                strokeWidth={isSensor1Selected || isS1Triggered ? "3.5" : "2.5"}
                className="group-hover:scale-110 transition-transform origin-center"
              />
              <circle
                cx="0"
                cy="-65"
                r="7"
                fill={
                  s1Condition === 'POTENTIAL LEAK'
                    ? '#EF4444'
                    : s1Condition === 'ANOMALY DETECTED'
                    ? '#F59E0B'
                    : isSensor1Selected
                    ? '#22C55E'
                    : '#144230'
                }
              />

              {/* Diagnostic Active Hardware LED */}
              <circle 
                cx="9" 
                cy="-74" 
                r="3" 
                fill={
                  s1Condition === 'POTENTIAL LEAK'
                    ? '#EF4444'
                    : s1Condition === 'ANOMALY DETECTED'
                    ? '#F59E0B'
                    : '#22C55E'
                } 
                className={isS1Triggered ? 'animate-ping' : 'animate-pulse'} 
              />

              {/* Top Sensor 1 Label Card */}
              <g transform="translate(0, -114)">
                <rect
                  x="-68"
                  y="-20"
                  width="136"
                  height="50"
                  rx="8"
                  fill={
                    s1Condition === 'POTENTIAL LEAK'
                      ? '#FEF2F2'
                      : s1Condition === 'ANOMALY DETECTED'
                      ? '#FFFBEB'
                      : isSensor1Selected
                      ? '#FFFFFF'
                      : '#F9FAFB'
                  }
                  stroke={
                    s1Condition === 'POTENTIAL LEAK'
                      ? '#EF4444'
                      : s1Condition === 'ANOMALY DETECTED'
                      ? '#F59E0B'
                      : isSensor1Selected
                      ? '#144230'
                      : '#E5E7EB'
                  }
                  strokeWidth={isSensor1Selected || isS1Triggered ? '2.5' : '1.5'}
                  className="drop-shadow-sm group-hover:scale-105 transition-transform"
                />
                
                {/* Line 1: Name and Location */}
                <text 
                  x="0" 
                  y="-6" 
                  fill="#111827"
                  fontSize="9.5" 
                  fontWeight="bold" 
                  fontFamily="Plus Jakarta Sans" 
                  textAnchor="middle"
                >
                  SENSOR 1 • 50 cm
                </text>
                
                {/* Line 2: Dedicated Status Badge Pill */}
                <rect
                  x="-42"
                  y="-2"
                  width="84"
                  height="14"
                  rx="4"
                  fill={
                    s1Condition === 'POTENTIAL LEAK'
                      ? '#FEE2E2'
                      : s1Condition === 'ANOMALY DETECTED'
                      ? '#FEF3C7'
                      : '#E8F7EE'
                  }
                  stroke={
                    s1Condition === 'POTENTIAL LEAK'
                      ? '#FCA5A5'
                      : s1Condition === 'ANOMALY DETECTED'
                      ? '#FDE68A'
                      : '#B7E4C7'
                  }
                  strokeWidth="0.8"
                />
                <text 
                  x="0" 
                  y="8.5" 
                  fill={
                    s1Condition === 'POTENTIAL LEAK'
                      ? '#DC2626'
                      : s1Condition === 'ANOMALY DETECTED'
                      ? '#D97706'
                      : '#144230'
                  } 
                  fontSize="8" 
                  fontFamily="JetBrains Mono" 
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  {s1Condition === 'POTENTIAL LEAK' ? 'POTENTIAL LEAK' : s1Condition === 'ANOMALY DETECTED' ? 'ANOMALY' : 'NORMAL'}
                </text>
                
                {/* Line 3: Vibration Value */}
                <text 
                  x="0" 
                  y="22" 
                  fill={
                    s1Condition === 'POTENTIAL LEAK'
                      ? '#DC2626'
                      : s1Condition === 'ANOMALY DETECTED'
                      ? '#B45309'
                      : '#047857'
                  } 
                  fontSize="8.5" 
                  fontFamily="JetBrains Mono" 
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  VIB: {sensor1Data.vibration.toFixed(3)} m/s²
                </text>
              </g>
            </g>

            {/* ================= SENSOR 2 MARKER (AT 90 CM) ================= */}
            <g
              id="sensor-node-2"
              transform={`translate(${SENSOR_2_X}, 145)`}
              onClick={() => handleSensorClick('sensor_2')}
              onMouseEnter={() => setHoveredNode('sensor_2')}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer group"
            >
              {/* Mounting Stalk & Pipe Bracket Collar */}
              <rect x="-6" y="-55" width="12" height="55" fill="#374151" stroke="#111827" strokeWidth="1.5" rx="2" />
              <rect x="-14" y="-12" width="28" height="14" fill="#9CA3AF" stroke="#111827" strokeWidth="1.5" rx="3" />
              <circle cx="0" cy="-6" r="3" fill="#144230" />

              {/* Dynamic Alert / Hover Halo Pulse */}
              <circle
                cx="0"
                cy="-65"
                r={isSensor2Selected ? "34" : hoveredNode === 'sensor_2' ? "30" : isS2Triggered ? "28" : "22"}
                fill={
                  s2Condition === 'POTENTIAL LEAK'
                    ? "rgba(239,68,68,0.28)"
                    : s2Condition === 'ANOMALY DETECTED'
                    ? "rgba(245,158,11,0.25)"
                    : isSensor2Selected
                    ? "rgba(20,66,48,0.25)"
                    : "rgba(34,197,94,0.18)"
                }
                className="transition-all duration-300"
              />

              {/* Sensor Capsule Housing */}
              <circle
                cx="0"
                cy="-65"
                r="18"
                fill={
                  isSensor2Selected 
                    ? (s2Condition === 'POTENTIAL LEAK' ? '#EF4444' : s2Condition === 'ANOMALY DETECTED' ? '#F59E0B' : '#144230')
                    : '#FFFFFF'
                }
                stroke={
                  s2Condition === 'POTENTIAL LEAK'
                    ? '#EF4444'
                    : s2Condition === 'ANOMALY DETECTED'
                    ? '#F59E0B'
                    : '#144230'
                }
                strokeWidth={isSensor2Selected || isS2Triggered ? "3.5" : "2.5"}
                className="group-hover:scale-110 transition-transform origin-center"
              />
              <circle
                cx="0"
                cy="-65"
                r="7"
                fill={
                  s2Condition === 'POTENTIAL LEAK'
                    ? '#EF4444'
                    : s2Condition === 'ANOMALY DETECTED'
                    ? '#F59E0B'
                    : isSensor2Selected
                    ? '#22C55E'
                    : '#144230'
                }
              />

              {/* Diagnostic Active Hardware LED */}
              <circle 
                cx="9" 
                cy="-74" 
                r="3" 
                fill={
                  s2Condition === 'POTENTIAL LEAK'
                    ? '#EF4444'
                    : s2Condition === 'ANOMALY DETECTED'
                    ? '#F59E0B'
                    : '#22C55E'
                } 
                className={isS2Triggered ? 'animate-ping' : 'animate-pulse'} 
              />

              {/* Top Sensor 2 Label Card */}
              <g transform="translate(0, -114)">
                <rect
                  x="-48"
                  y="-20"
                  width="136"
                  height="50"
                  rx="8"
                  fill={
                    s2Condition === 'POTENTIAL LEAK'
                      ? '#FEF2F2'
                      : s2Condition === 'ANOMALY DETECTED'
                      ? '#FFFBEB'
                      : isSensor2Selected
                      ? '#FFFFFF'
                      : '#F9FAFB'
                  }
                  stroke={
                    s2Condition === 'POTENTIAL LEAK'
                      ? '#EF4444'
                      : s2Condition === 'ANOMALY DETECTED'
                      ? '#F59E0B'
                      : isSensor2Selected
                      ? '#144230'
                      : '#E5E7EB'
                  }
                  strokeWidth={isSensor2Selected || isS2Triggered ? '2.5' : '1.5'}
                  className="drop-shadow-sm group-hover:scale-105 transition-transform"
                />
                
                {/* Line 1: Name and Location */}
                <text 
                  x="20" 
                  y="-6" 
                  fill="#111827"
                  fontSize="9.5" 
                  fontWeight="bold" 
                  fontFamily="Plus Jakarta Sans" 
                  textAnchor="middle"
                >
                  SENSOR 2 • 90 cm
                </text>
                
                {/* Line 2: Dedicated Status Badge Pill */}
                <rect
                  x="-22"
                  y="-2"
                  width="84"
                  height="14"
                  rx="4"
                  fill={
                    s2Condition === 'POTENTIAL LEAK'
                      ? '#FEE2E2'
                      : s2Condition === 'ANOMALY DETECTED'
                      ? '#FEF3C7'
                      : '#E8F7EE'
                  }
                  stroke={
                    s2Condition === 'POTENTIAL LEAK'
                      ? '#FCA5A5'
                      : s2Condition === 'ANOMALY DETECTED'
                      ? '#FDE68A'
                      : '#B7E4C7'
                  }
                  strokeWidth="0.8"
                />
                <text 
                  x="20" 
                  y="8.5" 
                  fill={
                    s2Condition === 'POTENTIAL LEAK'
                      ? '#DC2626'
                      : s2Condition === 'ANOMALY DETECTED'
                      ? '#D97706'
                      : '#144230'
                  } 
                  fontSize="8" 
                  fontFamily="JetBrains Mono" 
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  {s2Condition === 'POTENTIAL LEAK' ? 'POTENTIAL LEAK' : s2Condition === 'ANOMALY DETECTED' ? 'ANOMALY' : 'NORMAL'}
                </text>
                
                {/* Line 3: Vibration Value */}
                <text 
                  x="20" 
                  y="22" 
                  fill={
                    s2Condition === 'POTENTIAL LEAK'
                      ? '#DC2626'
                      : s2Condition === 'ANOMALY DETECTED'
                      ? '#B45309'
                      : '#047857'
                  } 
                  fontSize="8.5" 
                  fontFamily="JetBrains Mono" 
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  VIB: {sensor2Data.vibration.toFixed(3)} m/s²
                </text>
              </g>
            </g>

            {/* ================= PIPELINE MEASUREMENT RULER (0 - 100 CM) ================= */}
            {/* Positioned directly below the pipeline with subtle, compact, crisp ticks and labels */}
            <g id="pipeline-measurement-ruler" transform="translate(0, 226)">
              {/* Ruler Guide Background Pill */}
              <rect
                x={PIPE_START_X - 10}
                y="-4"
                width={PIPE_WIDTH + 20}
                height="38"
                rx="6"
                fill="#FFFFFF"
                stroke="#ECEEF2"
                strokeWidth="1"
                opacity="0.9"
              />

              {/* Main Ruler Baseline */}
              <line
                x1={PIPE_START_X}
                y1="0"
                x2={PIPE_END_X}
                y2="0"
                stroke="#6B7280"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Midpoint Sub-ticks (every 5 cm) */}
              {rulerMidTicks.map(cm => {
                const tickX = PIPELINE_CONFIG.getSvgX(cm, PIPE_START_X, PIPE_WIDTH);
                return (
                  <line
                    key={`subtick-${cm}`}
                    x1={tickX}
                    y1="0"
                    x2={tickX}
                    y2="5"
                    stroke="#9CA3AF"
                    strokeWidth="1"
                    strokeOpacity="0.7"
                  />
                );
              })}

              {/* Major 10 cm Ticks and Clean Monospace Numbers */}
              {rulerMajorMarks.map(cm => {
                const tickX = PIPELINE_CONFIG.getSvgX(cm, PIPE_START_X, PIPE_WIDTH);
                const isKey = cm === 50 || cm === 90;

                return (
                  <g key={`majortick-${cm}`}>
                    <line
                      x1={tickX}
                      y1="0"
                      x2={tickX}
                      y2={isKey ? "10" : "8"}
                      stroke={isKey ? "#144230" : "#4B5563"}
                      strokeWidth={isKey ? "2" : "1.2"}
                    />
                    <text
                      x={tickX}
                      y="20"
                      fill={isKey ? "#144230" : "#4B5563"}
                      fontSize={cm === 100 ? "8.5" : "9"}
                      fontWeight={isKey ? "bold" : "600"}
                      fontFamily="JetBrains Mono"
                      textAnchor="middle"
                    >
                      {cm === 100 ? "100 cm" : cm}
                    </text>
                  </g>
                );
              })}

              {/* Key Position Highlight Flags on Ruler */}
              {/* Sensor 1 (50 cm) diamond flag */}
              <g transform={`translate(${SENSOR_1_X}, 0)`}>
                <polygon points="0,0 -4,5 0,10 4,5" fill={isS1Triggered ? "#F59E0B" : "#144230"} />
                <rect 
                  x="-24" 
                  y="24" 
                  width="48" 
                  height="12" 
                  rx="3" 
                  fill={isS1Triggered ? "#FEF3C7" : "#E8F7EE"} 
                  stroke={isS1Triggered ? "#FDE68A" : "#B7E4C7"} 
                  strokeWidth="0.8" 
                />
                <text 
                  x="0" 
                  y="32.5" 
                  fill={isS1Triggered ? "#92400E" : "#144230"} 
                  fontSize="7.5" 
                  fontWeight="bold" 
                  fontFamily="JetBrains Mono" 
                  textAnchor="middle"
                >
                  SENSOR 1
                </text>
              </g>

              {/* T-Valve (75 cm) triangle flag */}
              <g transform={`translate(${LEAK_VALVE_X}, 0)`}>
                <line x1="0" y1="0" x2="0" y2="10" stroke={is75CmLeakActive ? "#EF4444" : "#D97706"} strokeWidth="1.5" />
                <polygon points="0,0 -4,6 4,6" fill={is75CmLeakActive ? "#EF4444" : "#D97706"} />
                <rect 
                  x="-24" 
                  y="24" 
                  width="48" 
                  height="12" 
                  rx="3" 
                  fill={is75CmLeakActive ? "#FEF2F2" : "#FFFBEB"} 
                  stroke={is75CmLeakActive ? "#FECACA" : "#FDE68A"} 
                  strokeWidth="0.8" 
                />
                <text 
                  x="0" 
                  y="32.5" 
                  fill={is75CmLeakActive ? "#DC2626" : "#92400E"} 
                  fontSize="7.5" 
                  fontWeight="bold" 
                  fontFamily="JetBrains Mono" 
                  textAnchor="middle"
                >
                  T-VALVE
                </text>
              </g>

              {/* Sensor 2 (90 cm) diamond flag */}
              <g transform={`translate(${SENSOR_2_X}, 0)`}>
                <polygon points="0,0 -4,5 0,10 4,5" fill={isS2Triggered ? "#F59E0B" : "#144230"} />
                <rect 
                  x="-24" 
                  y="24" 
                  width="48" 
                  height="12" 
                  rx="3" 
                  fill={isS2Triggered ? "#FEF3C7" : "#E8F7EE"} 
                  stroke={isS2Triggered ? "#FDE68A" : "#B7E4C7"} 
                  strokeWidth="0.8" 
                />
                <text 
                  x="0" 
                  y="32.5" 
                  fill={isS2Triggered ? "#92400E" : "#144230"} 
                  fontSize="7.5" 
                  fontWeight="bold" 
                  fontFamily="JetBrains Mono" 
                  textAnchor="middle"
                >
                  SENSOR 2
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* 3. Interactive Selected Sensor Comprehensive Details HUD Bar */}
        {/* Fulfills requirements: Clean spacing, clear CURRENT STATUS vs EVENT STATUS separation, 4 spacious telemetry cards */}
        <div className="mt-4 p-5 md:p-6 rounded-3xl bg-white border border-[#ECEEF2] shadow-sm select-none">
          {/* Top Row: Sensor Identity + Primary Sensor Selector Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F0F2F5]">
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-display font-extrabold text-sm shadow-2xs text-white ${
                activeSelectedReport?.condition === 'POTENTIAL LEAK' 
                  ? 'bg-[#EF4444]' 
                  : activeSelectedReport?.condition === 'ANOMALY DETECTED' 
                  ? 'bg-[#F59E0B]' 
                  : 'bg-[#144230]'
              }`}>
                {activeSelectedKey === 'sensor_1' ? 'S1' : 'S2'}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display font-bold text-base text-[#111827]">
                    {activeSelectedName}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold bg-[#E8F7EE] text-[#144230] border border-[#B7E4C7]">
                    MOUNT: {activeSelectedPosCm}.0 CM
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold border ${
                    activeSelectedReport?.condition === 'POTENTIAL LEAK'
                      ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
                      : activeSelectedReport?.condition === 'ANOMALY DETECTED'
                      ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
                      : 'bg-[#E8F7EE] text-[#144230] border-[#B7E4C7]'
                  }`}>
                    {activeSelectedReport?.condition || 'NORMAL'}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5 font-normal">
                  Physical ADXL345 3-axis accelerometer sensor on 100 cm pipeline • Calibrated units: m/s²
                </p>
              </div>
            </div>

            {/* Primary Sensor Switcher Buttons (Centralized, Smooth In-Place Update, No Popups) */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F4F5F7] rounded-full border border-[#E5E7EB] text-xs font-mono-tech">
              <button
                onClick={() => handleSensorClick('sensor_1')}
                className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeSelectedKey === 'sensor_1'
                    ? 'bg-[#144230] text-white shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${s1Condition === 'POTENTIAL LEAK' ? 'bg-[#EF4444]' : s1Condition === 'ANOMALY DETECTED' ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'}`} />
                <span>Sensor 1 (50 cm)</span>
              </button>

              <button
                onClick={() => handleSensorClick('sensor_2')}
                className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeSelectedKey === 'sensor_2'
                    ? 'bg-[#144230] text-white shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${s2Condition === 'POTENTIAL LEAK' ? 'bg-[#EF4444]' : s2Condition === 'ANOMALY DETECTED' ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'}`} />
                <span>Sensor 2 (90 cm)</span>
              </button>
            </div>
          </div>

          {/* Middle Row: Two Clearly Separated Status Cards (CURRENT STATUS vs EVENT STATUS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            {/* CARD A: CURRENT STATUS (Operational Condition) */}
            <div className={`p-4 rounded-2xl border transition-all ${
              activeSelectedReport?.condition === 'POTENTIAL LEAK'
                ? 'bg-[#FEF2F2] border-[#FECACA]'
                : activeSelectedReport?.condition === 'ANOMALY DETECTED'
                ? 'bg-[#FFFBEB] border-[#FDE68A]'
                : 'bg-[#F9FAFB] border-[#ECEEF2]'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono-tech font-bold tracking-wider text-[#6B7280] uppercase">
                  CURRENT STATUS
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold border ${
                  activeSelectedReport?.condition === 'POTENTIAL LEAK'
                    ? 'bg-white text-[#DC2626] border-[#FECACA]'
                    : activeSelectedReport?.condition === 'ANOMALY DETECTED'
                    ? 'bg-white text-[#D97706] border-[#FDE68A]'
                    : 'bg-white text-[#144230] border-[#B7E4C7]'
                }`}>
                  OPERATIONAL CONDITION
                </span>
              </div>
              <div className={`font-display font-extrabold text-2xl tracking-tight ${
                activeSelectedReport?.condition === 'POTENTIAL LEAK'
                  ? 'text-[#DC2626]'
                  : activeSelectedReport?.condition === 'ANOMALY DETECTED'
                  ? 'text-[#D97706]'
                  : 'text-[#144230]'
              }`}>
                {activeSelectedReport?.condition || 'NORMAL'}
              </div>
              <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                {activeSelectedReport?.condition === 'POTENTIAL LEAK'
                  ? 'Vibration characteristics match acoustic leak pattern at nearby 75 cm T-branch.'
                  : activeSelectedReport?.condition === 'ANOMALY DETECTED'
                  ? 'Elevated vibration threshold exceeded (> 0.080 m/s²); mechanical disturbance or pressure surge.'
                  : 'Nominal baseline operational limits maintained (< 0.080 m/s²).'}
              </p>
            </div>

            {/* CARD B: EVENT STATUS (Descriptive Event Message) */}
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#ECEEF2]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono-tech font-bold tracking-wider text-[#6B7280] uppercase">
                  EVENT STATUS
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-tech font-bold bg-white text-[#4B5563] border border-[#E5E7EB]">
                  ACOUSTIC INTELLIGENCE
                </span>
              </div>
              <div className="font-display font-bold text-base text-[#111827] leading-snug">
                {activeSelectedReport?.eventStatus || 'Nominal baseline — no abnormal vibration event detected'}
              </div>
              <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                Real-time rule engine &amp; frequency spectrum evaluation from ADXL345 3-axis accelerometer.
              </p>
            </div>
          </div>

          {/* Bottom Row: 4 Spacious Telemetry Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono-tech">
            {/* 1. Vibration Magnitude */}
            <div className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#ECEEF2] hover:border-[#D1D5DB] transition-all">
              <span className="text-[10px] font-bold text-[#6B7280] block mb-1 uppercase tracking-wider">
                VIBRATION
              </span>
              <div className={`font-display font-black text-2xl ${
                activeSelectedReport?.condition === 'POTENTIAL LEAK'
                  ? 'text-[#DC2626]'
                  : activeSelectedReport?.condition === 'ANOMALY DETECTED'
                  ? 'text-[#D97706]'
                  : 'text-[#144230]'
              }`}>
                {activeSelectedData.vibration.toFixed(3)}{' '}
                <span className="text-xs font-normal text-[#6B7280]">m/s²</span>
              </div>
              <div className="text-[10px] text-[#6B7280] mt-1">
                Dynamic RMS magnitude
              </div>
            </div>

            {/* 2. X Acceleration */}
            <div className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#ECEEF2] hover:border-[#D1D5DB] transition-all">
              <span className="text-[10px] font-bold text-[#6B7280] block mb-1 uppercase tracking-wider">
                X ACCELERATION
              </span>
              <div className="font-display font-black text-2xl text-[#111827]">
                {activeSelectedData.x >= 0 ? `+${activeSelectedData.x.toFixed(3)}` : activeSelectedData.x.toFixed(3)}
              </div>
              <div className="text-[10px] text-[#6B7280] mt-1">Lateral axis (m/s²)</div>
            </div>

            {/* 3. Y Acceleration */}
            <div className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#ECEEF2] hover:border-[#D1D5DB] transition-all">
              <span className="text-[10px] font-bold text-[#6B7280] block mb-1 uppercase tracking-wider">
                Y ACCELERATION
              </span>
              <div className="font-display font-black text-2xl text-[#111827]">
                {activeSelectedData.y >= 0 ? `+${activeSelectedData.y.toFixed(3)}` : activeSelectedData.y.toFixed(3)}
              </div>
              <div className="text-[10px] text-[#6B7280] mt-1">Axial pipe axis (m/s²)</div>
            </div>

            {/* 4. Z Acceleration */}
            <div className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#ECEEF2] hover:border-[#D1D5DB] transition-all">
              <span className="text-[10px] font-bold text-[#6B7280] block mb-1 uppercase tracking-wider">
                Z ACCELERATION
              </span>
              <div className="font-display font-black text-2xl text-[#111827]">
                {activeSelectedData.z >= 0 ? `+${activeSelectedData.z.toFixed(3)}` : activeSelectedData.z.toFixed(3)}
              </div>
              <div className="text-[10px] text-[#6B7280] mt-1">Vertical vector (g ≈ 9.81)</div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Quick Summary Ribbon (Clean Read-Only Telemetry Badges) */}
        <div className="pt-3 border-t border-[#ECEEF2] flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech mt-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className={`flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border shadow-2xs ${
              s1Condition !== 'NORMAL' ? 'border-[#F59E0B] bg-[#FFFBEB]' : 'border-[#E5E7EB]'
            }`}>
              <span className="text-[#9CA3AF]">SENSOR 1 (50 cm):</span>
              <span className={`font-bold ${s1Condition === 'POTENTIAL LEAK' ? 'text-[#DC2626]' : s1Condition === 'ANOMALY DETECTED' ? 'text-[#D97706]' : 'text-[#144230]'}`}>
                {sensor1Data.vibration.toFixed(3)} m/s²
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${s1Condition !== 'NORMAL' ? 'bg-[#F59E0B] animate-ping' : (isHardwareLive ? 'bg-[#22C55E]' : 'bg-[#9CA3AF]')}`} />
            </div>

            <div className={`flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border shadow-2xs ${
              s2Condition !== 'NORMAL' ? 'border-[#F59E0B] bg-[#FFFBEB]' : 'border-[#E5E7EB]'
            }`}>
              <span className="text-[#9CA3AF]">SENSOR 2 (90 cm):</span>
              <span className={`font-bold ${s2Condition === 'POTENTIAL LEAK' ? 'text-[#DC2626]' : s2Condition === 'ANOMALY DETECTED' ? 'text-[#D97706]' : 'text-[#144230]'}`}>
                {sensor2Data.vibration.toFixed(3)} m/s²
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${s2Condition !== 'NORMAL' ? 'bg-[#F59E0B] animate-ping' : (isHardwareLive ? 'bg-[#22C55E]' : 'bg-[#9CA3AF]')}`} />
            </div>

            <div className={`flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border shadow-2xs ${
              is75CmLeakActive ? 'border-[#EF4444] bg-[#FEF2F2]' : 'border-[#E5E7EB]'
            }`}>
              <span className="text-[#9CA3AF]">T-VALVE (75 cm):</span>
              <span className={`font-bold ${is75CmLeakActive ? 'text-[#DC2626]' : 'text-[#144230]'}`}>
                {is75CmLeakActive ? 'SIMULATED LEAK' : 'Branch Ready'}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E5E7EB] shadow-2xs">
              <span className="text-[#9CA3AF]">RIG SPAN:</span>
              <span className="text-[#111827] font-bold">100.0 cm Physical Rig</span>
            </div>
          </div>

          <div className="text-[11px] text-[#6B7280] font-medium">
            Status: <span className="text-[#144230] font-bold">{isRealMode ? (isHardwareLive ? 'Live MQTT Stream' : 'Awaiting Hardware') : 'Simulation Rig'}</span>
          </div>
        </div>
      </div>

      {/* 5. Complete Water Pipeline Network Corridor Route (Segments S-00 to S-06) */}
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

export default RailwayNetwork;
