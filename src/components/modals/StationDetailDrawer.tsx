import React from 'react';
import { Station, Train } from '../../types/simulation';
import { X, Video, Users, TrendingUp, AlertTriangle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface StationDetailDrawerProps {
  station: Station | null;
  trains: Train[];
  onClose: () => void;
  onDeployInductionToStation?: (stationId: string) => void;
}

export const StationDetailDrawer: React.FC<StationDetailDrawerProps> = ({
  station,
  trains,
  onClose,
  onDeployInductionToStation
}) => {
  if (!station) return null;

  const isSurge = station.status === 'SURGE_CRITICAL' || station.passengerDemandPct >= 85;
  const approachingTrains = trains.filter(t => t.status === 'IN_SERVICE' || t.status === 'INDUCTING');

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#090C10]/95 backdrop-blur-2xl border-l border-white/20 shadow-2xl p-6 flex flex-col justify-between font-mono-tech select-none animate-in slide-in-from-right duration-300">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-xl text-white uppercase">
                {station.name}
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30">
                {station.code}
              </span>
            </div>
            <span className="text-xs text-white/50">
              KM {station.kmPosition.toFixed(1)} • ELEVATED INTERCHANGE
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live CCTV Video Feed Simulation HUD */}
        <div className="relative rounded-xl overflow-hidden border border-white/15 bg-[#020305] mb-6">
          <div className="p-3 bg-black/60 flex items-center justify-between border-b border-white/10 text-[10px]">
            <div className="flex items-center gap-1.5 text-[#EF4444]">
              <Video className="w-3.5 h-3.5" />
              <span className="font-bold">LIVE CCTV • CAM-04 (PLATFORM 2)</span>
            </div>
            <span className="text-[#22C55E]">AI CROWD DENSITY: {station.cctvRiskScore}%</span>
          </div>

          {/* CCTV Visual Canvas Frame */}
          <div className="h-36 relative flex items-center justify-center p-4 bg-gradient-to-b from-[#090C10] to-[#020305]">
            {/* Simulated Bounding Boxes */}
            <div className="absolute inset-4 border border-dashed border-[#38BDF8]/30 rounded flex items-center justify-center">
              <div className="text-center space-y-1">
                <Users className="w-8 h-8 mx-auto text-[#38BDF8]/60" />
                <span className="text-[11px] text-white/90 font-bold block">
                  {station.waitingCount} COMMUTERS DETECTED
                </span>
                <span className="text-[9px] text-[#F59E0B]">
                  SURGE INFLOW: +{station.inflowRatePerMin} pax/min
                </span>
              </div>
            </div>

            {/* Corner HUD Markers */}
            <div className="absolute top-2 left-2 text-[8px] text-white/40">FPS: 30.0</div>
            <div className="absolute bottom-2 right-2 text-[8px] text-[#22C55E]">OPTICAL FLOW: ACTIVE</div>
          </div>
        </div>

        {/* Queue & Capacity Metrics */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <span className="text-[10px] text-white/40 uppercase block mb-1">PLATFORM LOAD</span>
              <span className={`font-display font-bold text-2xl ${isSurge ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                {station.passengerDemandPct}%
              </span>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <span className="text-[10px] text-white/40 uppercase block mb-1">BOTTLENECK RISK</span>
              <span className={`font-display font-bold text-2xl ${station.cctvRiskScore > 75 ? 'text-[#EF4444]' : 'text-[#38BDF8]'}`}>
                {station.cctvRiskScore}/100
              </span>
            </div>
          </div>

          {/* Approaching Trains Stream */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-white/40 block">
              APPROACHING METRO TRAINSETS
            </span>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {approachingTrains.slice(0, 3).map((train) => (
                <div
                  key={train.id}
                  className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{train.id}</span>
                    <span className="text-[10px] text-white/50">{train.direction} LINE</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#38BDF8] font-bold block">{train.speedKmh} km/h</span>
                    <span className="text-[9px] text-white/40">{train.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-white/10">
        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
        >
          CLOSE CCTV INSPECTOR
        </button>
      </div>
    </div>
  );
};
