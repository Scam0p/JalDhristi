import React from 'react';
import { Database, Activity } from 'lucide-react';

interface WaterStorageTankCardProps {
  tankId?: string;
  tankName?: string;
  levelPct?: number;
  capacityL?: number;
  status?: 'NORMAL' | 'WARNING' | 'CRITICAL';
}

export const WaterStorageTankCard: React.FC<WaterStorageTankCardProps> = ({
  tankId = 'TANK-01',
  tankName = 'STORAGE RESERVOIR',
  levelPct = 72,
  capacityL = 500,
  status = 'NORMAL'
}) => {
  // Clamped level between 0 and 100
  const clampedLevel = Math.max(0, Math.min(100, levelPct));
  const storedVolumeL = Math.round((clampedLevel / 100) * capacityL);
  const ullagePct = 100 - clampedLevel;

  // Geometry calculations for vertical cylindrical tank in 320x390 SVG
  const TANK_TOP_Y = 70;
  const TANK_BOTTOM_Y = 320;
  const TANK_HEIGHT = TANK_BOTTOM_Y - TANK_TOP_Y; // 250px
  const TANK_LEFT_X = 85;
  const TANK_WIDTH = 150;
  const TANK_RIGHT_X = TANK_LEFT_X + TANK_WIDTH; // 235
  const TANK_CENTER_X = TANK_LEFT_X + TANK_WIDTH / 2; // 160

  // Water level height inside tank
  const waterHeight = (TANK_HEIGHT - 6) * (clampedLevel / 100);
  const waterSurfaceY = TANK_BOTTOM_Y - 3 - waterHeight;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 flex flex-col justify-between h-full select-none shadow-none">
      {/* SCADA Header */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-2 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="p-1.5 rounded bg-[#F4F5F7] border border-[#E5E7EB] text-[#144230] flex-shrink-0">
            <Database className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-mono-tech font-bold text-xs sm:text-sm uppercase tracking-wider text-[#111827] truncate">
              {tankId} • {tankName}
            </h3>
            <span className="text-[11px] font-mono-tech text-[#4B5563] block whitespace-nowrap truncate">
              VERTICAL WATER STORAGE TANK • ZONE Z-07
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-1.5 text-xs font-mono-tech text-[#144230] bg-[#E8F7EE] px-2.5 py-1 rounded border border-[#B7E4C7] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span>STATUS: {status}</span>
        </div>
      </div>

      {/* Graphical Water Storage Tank SVG Canvas */}
      <div className="relative flex-1 flex items-center justify-center min-h-[340px] my-1 bg-[#F9FAFB] rounded border border-[#E5E7EB] p-2">
        <svg
          viewBox="0 0 340 370"
          className="w-full h-auto max-h-[360px] select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Cylindrical Metallic Tank Wall Gradient (Matches Pipeline Steel Aesthetic) */}
            <linearGradient id="tankSteelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1F2937" />
              <stop offset="12%" stopColor="#4B5563" />
              <stop offset="45%" stopColor="#9CA3AF" />
              <stop offset="75%" stopColor="#4B5563" />
              <stop offset="100%" stopColor="#1F2937" />
            </linearGradient>

            {/* Fluid Water Core Gradient (Matches Pipeline Green/Blue Aesthetic) */}
            <linearGradient id="tankWaterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.92" />
              <stop offset="35%" stopColor="#16A34A" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#144230" stopOpacity="0.98" />
            </linearGradient>

            {/* Ultrasonic Sensor Housing Metallic Gradient */}
            <linearGradient id="sensorHousingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#111827" />
              <stop offset="50%" stopColor="#374151" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>

            {/* Fluid Wave Mask for subtle surface undulation */}
            <pattern id="tankWaterPattern" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 0 10 Q 10 5, 20 10 T 40 10"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="0.75"
                strokeOpacity="0.25"
              />
            </pattern>
          </defs>

          {/* Background Engineering Alignment Grid */}
          <g opacity="0.04">
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`vg-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="370" stroke="#111827" strokeWidth="1" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`hg-${i}`} x1="0" y1={i * 40} x2="340" y2={i * 40} stroke="#111827" strokeWidth="1" />
            ))}
          </g>

          {/* ================= INLET & OUTLET CONNECTING PIPES ================= */}
          {/* Inlet Pipe on Left (Connected to Pipeline) */}
          <g id="tank-inlet-pipe">
            <rect x="35" y="112" width="50" height="15" rx="2" fill="url(#tankSteelGradient)" stroke="#1F2937" strokeWidth="1.5" />
            <rect x="44" y="109" width="6" height="21" rx="1" fill="#4B5563" stroke="#1F2937" strokeWidth="1" />
            {/* Fluid flow through inlet */}
            <line x1="38" y1="119.5" x2="85" y2="119.5" stroke="#22C55E" strokeWidth="3.5" strokeDasharray="6 4">
              <animate attributeName="stroke-dashoffset" values="20;0" dur="1.2s" repeatCount="indefinite" />
            </line>
            {/* Crisp High-Visibility SCADA Inlet Label Badge (Positioned with clean vertical clearance) */}
            <rect x="25" y="91" width="48" height="17" rx="3" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1" />
            <text x="49" y="103.5" textAnchor="middle" fill="#111827" fontSize="10.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.05em">
              INLET
            </text>
          </g>

          {/* Outlet Drain Pipe on Right Bottom */}
          <g id="tank-outlet-pipe">
            <rect x={TANK_RIGHT_X} y="295" width="50" height="15" rx="2" fill="url(#tankSteelGradient)" stroke="#1F2937" strokeWidth="1.5" />
            <rect x={TANK_RIGHT_X + 28} y="292" width="6" height="21" rx="1" fill="#4B5563" stroke="#1F2937" strokeWidth="1" />
            {/* Fluid outflow */}
            <line x1={TANK_RIGHT_X} y1="302.5" x2={TANK_RIGHT_X + 45} y2="302.5" stroke="#22C55E" strokeWidth="3.5" strokeDasharray="6 4">
              <animate attributeName="stroke-dashoffset" values="0;20" dur="1.2s" repeatCount="indefinite" />
            </line>
            {/* Crisp High-Visibility SCADA Outlet Label Badge */}
            <rect x={TANK_RIGHT_X + 5} y="270" width="54" height="18" rx="3" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1" />
            <text x={TANK_RIGHT_X + 32} y="283" textAnchor="middle" fill="#111827" fontSize="10.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.05em">
              OUTLET
            </text>
          </g>

          {/* ================= TANK STRUCTURAL MOUNTING BASE ================= */}
          <g id="tank-base-assembly">
            {/* Concrete Pad / Skid */}
            <rect x={TANK_LEFT_X - 15} y="326" width={TANK_WIDTH + 30} height="12" rx="2" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1" />
            {/* Left Support Leg */}
            <rect x={TANK_LEFT_X + 12} y="318" width="16" height="10" rx="1" fill="#374151" stroke="#1F2937" strokeWidth="1" />
            {/* Right Support Leg */}
            <rect x={TANK_RIGHT_X - 28} y="318" width="16" height="10" rx="1" fill="#374151" stroke="#1F2937" strokeWidth="1" />
          </g>

          {/* ================= MAIN CYLINDRICAL TANK VESSEL ================= */}
          <g id="main-tank-vessel">
            {/* Tank Outer Shadow */}
            <rect
              x={TANK_LEFT_X}
              y={TANK_TOP_Y}
              width={TANK_WIDTH}
              height={TANK_HEIGHT}
              rx="8"
              fill="#E5E7EB"
              transform="translate(2, 3)"
            />

            {/* Tank Outer Metallic Shell */}
            <rect
              x={TANK_LEFT_X}
              y={TANK_TOP_Y}
              width={TANK_WIDTH}
              height={TANK_HEIGHT}
              rx="8"
              fill="url(#tankSteelGradient)"
              stroke="#111827"
              strokeWidth="2"
            />

            {/* Tank Inner Cavity (Interior Reservoir Chamber) */}
            <rect
              x={TANK_LEFT_X + 4}
              y={TANK_TOP_Y + 4}
              width={TANK_WIDTH - 8}
              height={TANK_HEIGHT - 8}
              rx="6"
              fill="#F3F4F6"
              stroke="#D1D5DB"
              strokeWidth="1"
            />

            {/* Empty Tank Grid Lines */}
            <g opacity="0.15">
              <line x1={TANK_LEFT_X + 4} y1={TANK_TOP_Y + TANK_HEIGHT * 0.25} x2={TANK_RIGHT_X - 4} y2={TANK_TOP_Y + TANK_HEIGHT * 0.25} stroke="#6B7280" strokeDasharray="3 3" />
              <line x1={TANK_LEFT_X + 4} y1={TANK_TOP_Y + TANK_HEIGHT * 0.50} x2={TANK_RIGHT_X - 4} y2={TANK_TOP_Y + TANK_HEIGHT * 0.50} stroke="#6B7280" strokeDasharray="3 3" />
              <line x1={TANK_LEFT_X + 4} y1={TANK_TOP_Y + TANK_HEIGHT * 0.75} x2={TANK_RIGHT_X - 4} y2={TANK_TOP_Y + TANK_HEIGHT * 0.75} stroke="#6B7280" strokeDasharray="3 3" />
            </g>

            {/* ================= WATER FLUID BODY ================= */}
            {clampedLevel > 0 && (
              <g id="tank-water-fluid">
                {/* Water Mass Fill */}
                <rect
                  x={TANK_LEFT_X + 5}
                  y={waterSurfaceY}
                  width={TANK_WIDTH - 10}
                  height={waterHeight}
                  rx="2"
                  fill="url(#tankWaterGradient)"
                />

                {/* Subtle Internal Fluid Texture Pattern */}
                <rect
                  x={TANK_LEFT_X + 5}
                  y={waterSurfaceY}
                  width={TANK_WIDTH - 10}
                  height={waterHeight}
                  fill="url(#tankWaterPattern)"
                  opacity="0.6"
                />

                {/* Animated Water Surface Wave Line */}
                <path
                  d={`M ${TANK_LEFT_X + 5} ${waterSurfaceY} 
                      Q ${TANK_LEFT_X + 35} ${waterSurfaceY - 2.5}, ${TANK_LEFT_X + 70} ${waterSurfaceY} 
                      T ${TANK_RIGHT_X - 5} ${waterSurfaceY}
                      L ${TANK_RIGHT_X - 5} ${waterSurfaceY + 4}
                      L ${TANK_LEFT_X + 5} ${waterSurfaceY + 4} Z`}
                  fill="#86EFAC"
                  opacity="0.85"
                >
                  <animate
                    attributeName="d"
                    values={`
                      M ${TANK_LEFT_X + 5} ${waterSurfaceY} Q ${TANK_LEFT_X + 35} ${waterSurfaceY - 2}, ${TANK_LEFT_X + 75} ${waterSurfaceY} T ${TANK_RIGHT_X - 5} ${waterSurfaceY} L ${TANK_RIGHT_X - 5} ${waterSurfaceY + 3} L ${TANK_LEFT_X + 5} ${waterSurfaceY + 3} Z;
                      M ${TANK_LEFT_X + 5} ${waterSurfaceY} Q ${TANK_LEFT_X + 40} ${waterSurfaceY + 2}, ${TANK_LEFT_X + 80} ${waterSurfaceY} T ${TANK_RIGHT_X - 5} ${waterSurfaceY} L ${TANK_RIGHT_X - 5} ${waterSurfaceY + 3} L ${TANK_LEFT_X + 5} ${waterSurfaceY + 3} Z;
                      M ${TANK_LEFT_X + 5} ${waterSurfaceY} Q ${TANK_LEFT_X + 35} ${waterSurfaceY - 2}, ${TANK_LEFT_X + 75} ${waterSurfaceY} T ${TANK_RIGHT_X - 5} ${waterSurfaceY} L ${TANK_RIGHT_X - 5} ${waterSurfaceY + 3} L ${TANK_LEFT_X + 5} ${waterSurfaceY + 3} Z
                    `}
                    dur="3.5s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Surface Highlight Line */}
                <line
                  x1={TANK_LEFT_X + 6}
                  y1={waterSurfaceY}
                  x2={TANK_RIGHT_X - 6}
                  y2={waterSurfaceY}
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeOpacity="0.8"
                />

                {/* Subsurface Wave Glimmer */}
                <line
                  x1={TANK_LEFT_X + 15}
                  y1={waterSurfaceY + 12}
                  x2={TANK_RIGHT_X - 15}
                  y2={waterSurfaceY + 12}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  strokeDasharray="14 8"
                  strokeOpacity="0.3"
                >
                  <animate attributeName="stroke-dashoffset" values="0;-22" dur="2s" repeatCount="indefinite" />
                </line>
              </g>
            )}

            {/* Vertical Center Glass Sight Gauge (SCADA Inspection Indicator) */}
            <line
              x1={TANK_CENTER_X}
              y1={TANK_TOP_Y + 10}
              x2={TANK_CENTER_X}
              y2={TANK_BOTTOM_Y - 10}
              stroke="#1F2937"
              strokeWidth="1"
              strokeDasharray="4 6"
              strokeOpacity="0.35"
            />
          </g>

          {/* ================= ULTRASONIC SENSOR ASSEMBLY AT TOP ================= */}
          <g id="ultrasonic-sensor-assembly">
            {/* Top Mounting Flange Collar */}
            <rect
              x={TANK_CENTER_X - 22}
              y={TANK_TOP_Y - 6}
              width="44"
              height="8"
              rx="1.5"
              fill="#4B5563"
              stroke="#111827"
              strokeWidth="1.5"
            />

            {/* Sensor Housing (Threaded Transducer Neck) */}
            <rect
              x={TANK_CENTER_X - 14}
              y={TANK_TOP_Y - 24}
              width="28"
              height="18"
              rx="2"
              fill="url(#sensorHousingGradient)"
              stroke="#111827"
              strokeWidth="1.5"
            />

            {/* Sensor Top Cable Gland & Wire */}
            <rect x={TANK_CENTER_X - 5} y={TANK_TOP_Y - 30} width="10" height="6" fill="#4B5563" stroke="#111827" strokeWidth="1" />
            <path d={`M ${TANK_CENTER_X} ${TANK_TOP_Y - 30} Q ${TANK_CENTER_X - 12} ${TANK_TOP_Y - 45}, ${TANK_CENTER_X - 35} ${TANK_TOP_Y - 40}`} fill="none" stroke="#1F2937" strokeWidth="2" />

            {/* Ultrasonic Measurement Cone Beam (Dashed Reference Line to Water Surface) */}
            <line
              x1={TANK_CENTER_X}
              y1={TANK_TOP_Y + 6}
              x2={TANK_CENTER_X}
              y2={waterSurfaceY}
              stroke="#22C55E"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              strokeOpacity="0.75"
            >
              <animate attributeName="stroke-dashoffset" values="0;-12" dur="1s" repeatCount="indefinite" />
            </line>

            {/* Large, Prominent Sensor Label Tag */}
            <rect
              x={TANK_CENTER_X - 78}
              y={10}
              width="156"
              height="22"
              rx="4"
              fill="#FFFFFF"
              stroke="#D1D5DB"
              strokeWidth="1.5"
            />
            <text
              x={TANK_CENTER_X}
              y={25.5}
              textAnchor="middle"
              fill="#111827"
              fontSize="11.5"
              fontFamily="monospace"
              fontWeight="bold"
              letterSpacing="0.04em"
            >
              ULTRASONIC TRANSDUCER
            </text>
          </g>

          {/* ================= LEVEL SCALE & CALIBRATION RULER ================= */}
          <g id="tank-level-ruler">
            {/* Vertical Scale Line */}
            <line
              x1="70"
              y1={TANK_TOP_Y + 6}
              x2="70"
              y2={TANK_BOTTOM_Y - 6}
              stroke="#374151"
              strokeWidth="2"
            />

            {/* 100% Mark (500L) */}
            <line x1="60" y1={TANK_TOP_Y + 6} x2="70" y2={TANK_TOP_Y + 6} stroke="#111827" strokeWidth="2.5" />
            <text x="54" y={TANK_TOP_Y + 10} textAnchor="end" fill="#111827" fontSize="12" fontFamily="monospace" fontWeight="bold">
              100%
            </text>

            {/* 75% Mark (375L) */}
            <line x1="62" y1={TANK_TOP_Y + TANK_HEIGHT * 0.25} x2="70" y2={TANK_TOP_Y + TANK_HEIGHT * 0.25} stroke="#374151" strokeWidth="2" />
            <text x="54" y={TANK_TOP_Y + TANK_HEIGHT * 0.25 + 4} textAnchor="end" fill="#374151" fontSize="11.5" fontFamily="monospace" fontWeight="bold">
              75%
            </text>

            {/* 50% Mark (250L) */}
            <line x1="60" y1={TANK_TOP_Y + TANK_HEIGHT * 0.50} x2="70" y2={TANK_TOP_Y + TANK_HEIGHT * 0.50} stroke="#111827" strokeWidth="2.5" />
            <text x="54" y={TANK_TOP_Y + TANK_HEIGHT * 0.50 + 4} textAnchor="end" fill="#111827" fontSize="12" fontFamily="monospace" fontWeight="bold">
              50%
            </text>

            {/* 25% Mark (125L) */}
            <line x1="62" y1={TANK_TOP_Y + TANK_HEIGHT * 0.75} x2="70" y2={TANK_TOP_Y + TANK_HEIGHT * 0.75} stroke="#374151" strokeWidth="2" />
            <text x="54" y={TANK_TOP_Y + TANK_HEIGHT * 0.75 + 4} textAnchor="end" fill="#374151" fontSize="11.5" fontFamily="monospace" fontWeight="bold">
              25%
            </text>

            {/* 0% Mark (0L) */}
            <line x1="60" y1={TANK_BOTTOM_Y - 6} x2="70" y2={TANK_BOTTOM_Y - 6} stroke="#111827" strokeWidth="2.5" />
            <text x="54" y={TANK_BOTTOM_Y - 2} textAnchor="end" fill="#111827" fontSize="12" fontFamily="monospace" fontWeight="bold">
              0%
            </text>

            {/* Intermediate Tick Marks Every 12.5% */}
            {[0.125, 0.375, 0.625, 0.875].map((fraction, idx) => (
              <line
                key={`subtick-${idx}`}
                x1="64"
                y1={TANK_TOP_Y + TANK_HEIGHT * fraction}
                x2="70"
                y2={TANK_TOP_Y + TANK_HEIGHT * fraction}
                stroke="#6B7280"
                strokeWidth="1.5"
              />
            ))}
          </g>

          {/* ================= CURRENT WATER LEVEL MARKER HUD ================= */}
          <g id="current-level-indicator" transform={`translate(0, ${waterSurfaceY})`}>
            {/* Horizontal Line Across Tank */}
            <line
              x1={TANK_LEFT_X - 10}
              y1="0"
              x2={TANK_RIGHT_X + 15}
              y2="0"
              stroke="#15803D"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            {/* Triangular Arrow Pointer on Right */}
            <polygon
              points={`${TANK_RIGHT_X + 12},0 ${TANK_RIGHT_X + 24},-6 ${TANK_RIGHT_X + 24},6`}
              fill="#144230"
            />
            {/* Readout Badge on Right (Large & Bold) */}
            <rect
              x={TANK_RIGHT_X + 24}
              y="-12"
              width="58"
              height="24"
              rx="4"
              fill="#144230"
              stroke="#0F3224"
              strokeWidth="1.5"
            />
            <text
              x={TANK_RIGHT_X + 53}
              y="4.5"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="12.5"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {clampedLevel.toFixed(1)}%
            </text>
          </g>
        </svg>
      </div>

      {/* Bottom Industrial Telemetry Readout Grid */}
      <div className="pt-3 border-t border-[#E5E7EB] grid grid-cols-3 gap-2.5 font-mono-tech">
        <div className="p-2.5 rounded bg-[#F9FAFB] border border-[#E5E7EB] text-center">
          <span className="text-xs text-[#4B5563] uppercase block font-bold tracking-wider">
            WATER LEVEL
          </span>
          <span className="font-bold text-xl text-[#144230] block mt-1">
            {clampedLevel}%
          </span>
        </div>

        <div className="p-2.5 rounded bg-[#F9FAFB] border border-[#E5E7EB] text-center">
          <span className="text-xs text-[#4B5563] uppercase block font-bold tracking-wider">
            STORED VOLUME
          </span>
          <span className="font-bold text-xl text-[#111827] block mt-1">
            {storedVolumeL}{' '}
            <span className="text-xs font-semibold text-[#6B7280]">L</span>
          </span>
        </div>

        <div className="p-2.5 rounded bg-[#F9FAFB] border border-[#E5E7EB] text-center">
          <span className="text-xs text-[#4B5563] uppercase block font-bold tracking-wider">
            CAPACITY
          </span>
          <span className="font-bold text-xl text-[#111827] block mt-1">
            {capacityL}{' '}
            <span className="text-xs font-semibold text-[#6B7280]">L</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default WaterStorageTankCard;
