import React from 'react';
import { Train } from '../../types/simulation';
import { Train as TrainIcon, ChevronRight } from 'lucide-react';

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
        return { text: 'IN SERVICE', bg: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30' };
      case 'INDUCTING':
        return { text: 'INDUCTING (AI)', bg: 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40' };
      case 'READY_INDUCTION':
        return { text: 'READY FOR INDUCTION', bg: 'bg-[#E30613]/20 text-[#EF4444] border-[#E30613]/40' };
      case 'STANDBY':
        return { text: 'DEPOT STANDBY', bg: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30' };
      case 'MAINTENANCE':
        return { text: 'MAINTENANCE HOLD', bg: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40' };
      default:
        return { text: status, bg: 'bg-white/10 text-white border-white/20' };
    }
  };

  return (
    <div className="gov-panel rounded-2xl p-5 md:p-6 border border-white/10 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#0E1626] border border-white/10 text-[#38BDF8]">
            <TrainIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base md:text-lg text-white uppercase tracking-wide">
              KMRL ROLLING STOCK FLEET ROSTER
            </h2>
            <p className="text-xs text-white/50 font-mono-tech">
              8 Metropolis 3-Car Trainsets • Alstom CBTC Urbalis 400
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-tech text-white/70">
          <div className="bg-[#080C14] px-3 py-1 rounded border border-white/10">
            <span className="text-white/40">IN SERVICE: </span>
            <span className="text-[#22C55E] font-bold">
              {trains.filter(t => t.status === 'IN_SERVICE' || t.status === 'INDUCTING').length}
            </span>
          </div>
          <div className="bg-[#080C14] px-3 py-1 rounded border border-white/10">
            <span className="text-white/40">DEPOT RESERVE: </span>
            <span className="text-[#F59E0B] font-bold">
              {trains.filter(t => t.status === 'STANDBY' || t.status === 'READY_INDUCTION').length}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 8 Trainset Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {trains.map((train) => {
          const isSelected = selectedTrain?.id === train.id;
          const badge = getStatusBadge(train.status);
          const loadPct = Math.round((train.passengerLoad / train.capacity) * 100);

          return (
            <div
              key={train.id}
              onClick={() => onSelectTrain(train)}
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#131E33] border-[#38BDF8] shadow-md scale-[1.01]'
                  : 'bg-[#0B111E] hover:bg-[#0E1626] border-white/10 hover:border-white/20'
              }`}
            >
              {/* Top: Train ID & Status Badge */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-impact text-2xl text-white tracking-wider">
                      {train.id}
                    </span>
                    <span className="text-[10px] font-mono-tech text-white/50">
                      {train.name.replace('Trainset ', '')}
                    </span>
                  </div>
                  <span className={`text-[8px] font-mono-tech font-bold px-2 py-0.5 rounded border uppercase ${badge.bg}`}>
                    {badge.text}
                  </span>
                </div>

                {/* Location */}
                <div className="text-xs text-white/80 font-mono-tech mb-3 truncate flex items-center gap-1">
                  <span className="text-white/40">LOC:</span>
                  <span className="font-medium text-white truncate">{train.location}</span>
                </div>

                {/* Passenger Load Bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-[10px] font-mono-tech">
                    <span className="text-white/50">LOAD FACTOR</span>
                    <span className="font-bold text-white">
                      {train.passengerLoad} / {train.capacity} ({loadPct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        loadPct > 85 ? 'bg-[#EF4444]' : loadPct > 65 ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'
                      }`}
                      style={{ width: `${loadPct}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Telemetry Metrics Row */}
              <div className="pt-2.5 border-t border-white/10 grid grid-cols-3 gap-1 text-[10px] font-mono-tech text-white/70">
                <div>
                  <span className="text-white/40 block text-[8px]">SPEED</span>
                  <span className="font-bold text-white">{train.speedKmh} km/h</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[8px]">TEMP</span>
                  <span className={`font-bold ${train.motorTempC > 70 ? 'text-[#EF4444]' : 'text-white'}`}>
                    {train.motorTempC}°C
                  </span>
                </div>
                <div>
                  <span className="text-white/40 block text-[8px]">HEALTH</span>
                  <span className="font-bold text-[#22C55E]">{train.healthScorePct}%</span>
                </div>
              </div>

              {/* Action trigger */}
              <div className="mt-2.5 flex items-center justify-between text-[9px] font-mono-tech text-white/40">
                <span>{train.driverStatus}</span>
                <span className="flex items-center gap-0.5 text-[#38BDF8]">
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
