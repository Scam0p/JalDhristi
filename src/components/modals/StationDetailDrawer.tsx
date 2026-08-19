import React from 'react';
import { Station, Train } from '../../types/simulation';
import { X, Video, Users } from 'lucide-react';

interface StationDetailDrawerProps {
  station: Station | null;
  trains: Train[];
  onClose: () => void;
  onDeployInductionToStation?: (stationId: string) => void;
}

export const StationDetailDrawer: React.FC<StationDetailDrawerProps> = ({
  station,
  trains,
  onClose
}) => {
  if (!station) return null;

  const isSurge = station.status === 'SURGE_CRITICAL' || station.passengerDemandPct >= 85;
  const approachingTrains = trains.filter(t => t.status === 'IN_SERVICE' || t.status === 'INDUCTING');

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Semi-transparent backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-2xs animate-in fade-in duration-200" 
      />

      <div className="relative z-10 w-full max-w-md bg-white h-full border-l border-[#ECEEF2] shadow-2xl p-6 flex flex-col justify-between font-mono-tech select-none overflow-y-auto animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F0F2F5] mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-xl text-[#111827]">
                  {station.name}
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#E8F7EE] text-[#144230] border border-[#B7E4C7]">
                  {station.code}
                </span>
              </div>
              <span className="text-xs text-[#6B7280]">
                KM {station.kmPosition.toFixed(1)} • ELEVATED INTERCHANGE
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#F4F5F7] hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Live CCTV Video Feed Simulation HUD */}
          <div className="relative rounded-2xl overflow-hidden border border-[#ECEEF2] bg-[#F9FAFB] mb-6">
            <div className="p-3 bg-white flex items-center justify-between border-b border-[#ECEEF2] text-[10px]">
              <div className="flex items-center gap-1.5 text-[#144230]">
                <Video className="w-3.5 h-3.5" />
                <span className="font-bold">LIVE CCTV • CAM-04 (PLATFORM 2)</span>
              </div>
              <span className="text-[#144230] font-bold">CROWD DENSITY: {station.cctvRiskScore}%</span>
            </div>

            {/* CCTV Visual Canvas Frame */}
            <div className="h-36 relative flex items-center justify-center p-4 bg-[#F4F5F7]">
              {/* Simulated Bounding Boxes */}
              <div className="absolute inset-4 border border-dashed border-[#144230]/40 rounded-xl flex items-center justify-center bg-white/60">
                <div className="text-center space-y-1">
                  <Users className="w-8 h-8 mx-auto text-[#144230]/70" />
                  <span className="text-[11px] text-[#111827] font-bold block">
                    {station.waitingCount} COMMUTERS DETECTED
                  </span>
                  <span className="text-[9px] text-[#D97706] font-semibold">
                    SURGE INFLOW: +{station.inflowRatePerMin} pax/min
                  </span>
                </div>
              </div>

              {/* Corner HUD Markers */}
              <div className="absolute top-2 left-2 text-[8px] text-[#9CA3AF]">FPS: 30.0</div>
              <div className="absolute bottom-2 right-2 text-[8px] text-[#144230] font-semibold">OPTICAL FLOW: ACTIVE</div>
            </div>
          </div>

          {/* Queue & Capacity Metrics */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#F4F5F7] border border-[#E5E7EB]">
                <span className="text-[10px] text-[#9CA3AF] uppercase block mb-1">PLATFORM LOAD</span>
                <span className={`font-display font-bold text-2xl ${isSurge ? 'text-[#EF4444]' : 'text-[#144230]'}`}>
                  {station.passengerDemandPct}%
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F5F7] border border-[#E5E7EB]">
                <span className="text-[10px] text-[#9CA3AF] uppercase block mb-1">BOTTLENECK RISK</span>
                <span className={`font-display font-bold text-2xl ${station.cctvRiskScore > 75 ? 'text-[#EF4444]' : 'text-[#144230]'}`}>
                  {station.cctvRiskScore}/100
                </span>
              </div>
            </div>

            {/* Approaching Trains Stream */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#6B7280] block font-bold">
                APPROACHING METRO TRAINSETS
              </span>

              <div className="space-y-2 max-h-32 overflow-y-auto">
                {approachingTrains.slice(0, 3).map((train) => (
                  <div
                    key={train.id}
                    className="p-2.5 rounded-xl bg-[#F9FAFB] border border-[#ECEEF2] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#111827]">{train.id}</span>
                      <span className="text-[10px] text-[#6B7280]">{train.direction} LINE</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#144230] font-bold block">{train.speedKmh} km/h</span>
                      <span className="text-[9px] text-[#9CA3AF]">{train.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-[#F0F2F5]">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-[#144230] hover:bg-[#1A543E] text-white font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            CLOSE CCTV INSPECTOR
          </button>
        </div>
      </div>
    </div>
  );
};
