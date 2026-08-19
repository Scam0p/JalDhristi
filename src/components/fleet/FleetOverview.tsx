import React from 'react';
import { Train } from '../../types/simulation';
import { TrainTrack, ChevronRight } from 'lucide-react';

interface FleetOverviewProps {
  trains: Train[];
  onSelectTrain: (train: Train) => void;
  selectedTrain: Train | null;
}

export const FleetOverview: React.FC<FleetOverviewProps> = ({
  trains,
  onSelectTrain,
  selectedTrain
}) => {
  const getStatusBadge = (status: Train['status']) => {
    switch (status) {
      case 'IN_SERVICE':
        return { text: 'IN SERVICE', bg: 'bg-[#E8F7EE] text-[#144230] border-[#B7E4C7]' };
      case 'INDUCTING':
        return { text: 'INDUCTING (AI)', bg: 'bg-[#E8F7EE] text-[#144230] border-[#144230]' };
      case 'READY_INDUCTION':
        return { text: 'READY FOR INDUCTION', bg: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]' };
      case 'STANDBY':
        return { text: 'DEPOT STANDBY', bg: 'bg-[#F4F5F7] text-[#4B5563] border-[#E5E7EB]' };
      case 'MAINTENANCE':
        return { text: 'MAINTENANCE HOLD', bg: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]' };
      default:
        return { text: status, bg: 'bg-[#F4F5F7] text-[#4B5563] border-[#E5E7EB]' };
    }
  };

  return (
    <div className="donezo-card p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-[#F0F2F5]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#E8F7EE] text-[#144230]">
            <TrainTrack className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base md:text-lg text-[#111827]">
              Rolling Stock Fleet Roster
            </h2>
            <p className="text-xs text-[#6B7280]">
              8 Metropolis 3-Car Trainsets • Alstom CBTC Urbalis 400
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-tech text-[#4B5563]">
          <div className="bg-[#F4F5F7] px-3 py-1 rounded-full border border-[#E5E7EB]">
            <span className="text-[#9CA3AF]">IN SERVICE: </span>
            <span className="text-[#144230] font-bold">
              {trains.filter(t => t.status === 'IN_SERVICE' || t.status === 'INDUCTING').length}
            </span>
          </div>
          <div className="bg-[#F4F5F7] px-3 py-1 rounded-full border border-[#E5E7EB]">
            <span className="text-[#9CA3AF]">DEPOT RESERVE: </span>
            <span className="text-[#D97706] font-bold">
              {trains.filter(t => t.status === 'STANDBY' || t.status === 'READY_INDUCTION').length}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 8 Trainset Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trains.map((train) => {
          const isSelected = selectedTrain?.id === train.id;
          const badge = getStatusBadge(train.status);
          const loadPct = Math.round((train.passengerLoad / train.capacity) * 100);

          return (
            <div
              key={train.id}
              onClick={() => onSelectTrain(train)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#E8F7EE]/50 border-2 border-[#144230] shadow-sm'
                  : 'bg-white hover:bg-[#F9FAFB] border-[#ECEEF2] hover:border-[#D1D5DB]'
              }`}
            >
              {/* Top: Train ID & Status Badge */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech font-black text-xl text-[#111827]">
                      {train.id}
                    </span>
                    <span className="text-[10px] font-mono-tech text-[#6B7280]">
                      {train.name.replace('Trainset ', '')}
                    </span>
                  </div>
                  <span className={`text-[8px] font-mono-tech font-bold px-2 py-0.5 rounded-full border uppercase ${badge.bg}`}>
                    {badge.text}
                  </span>
                </div>

                {/* Location */}
                <div className="text-xs text-[#4B5563] font-mono-tech mb-3 truncate flex items-center gap-1">
                  <span className="text-[#9CA3AF]">LOC:</span>
                  <span className="font-medium text-[#111827] truncate">{train.location}</span>
                </div>

                {/* Passenger Load Bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-[10px] font-mono-tech">
                    <span className="text-[#6B7280]">OCCUPANCY</span>
                    <span className="font-bold text-[#111827]">
                      {train.passengerLoad} / {train.capacity} ({loadPct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        loadPct > 85 ? 'bg-[#EF4444]' : loadPct > 65 ? 'bg-[#F59E0B]' : 'bg-[#144230]'
                      }`}
                      style={{ width: `${loadPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Telemetry Metrics Row */}
              <div className="pt-2.5 border-t border-[#F0F2F5] grid grid-cols-3 gap-1 text-[10px] font-mono-tech text-[#4B5563]">
                <div>
                  <span className="text-[#9CA3AF] block text-[8px]">SPEED</span>
                  <span className="font-bold text-[#111827]">{train.speedKmh} km/h</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] block text-[8px]">TEMP</span>
                  <span className={`font-bold ${train.motorTempC > 70 ? 'text-[#EF4444]' : 'text-[#111827]'}`}>
                    {train.motorTempC}°C
                  </span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] block text-[8px]">HEALTH</span>
                  <span className="font-bold text-[#144230]">{train.healthScorePct}%</span>
                </div>
              </div>

              {/* Action trigger */}
              <div className="mt-2.5 flex items-center justify-between text-[9px] font-mono-tech text-[#6B7280]">
                <span>{train.driverStatus}</span>
                <span className="flex items-center gap-0.5 text-[#144230] font-bold">
                  INSPECT <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
