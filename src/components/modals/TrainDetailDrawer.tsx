import React from 'react';
import { Train } from '../../types/simulation';
import { X, Train as TrainIcon, Gauge, Thermometer, Zap, Shield, Radio, CheckCircle, ArrowRight } from 'lucide-react';

interface TrainDetailDrawerProps {
  train: Train | null;
  onClose: () => void;
}

export const TrainDetailDrawer: React.FC<TrainDetailDrawerProps> = ({ train, onClose }) => {
  if (!train) return null;

  const loadPercentage = Math.round((train.passengerLoad / train.capacity) * 100);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#090C10]/95 backdrop-blur-2xl border-l border-white/20 shadow-2xl p-6 flex flex-col justify-between font-mono-tech select-none animate-in slide-in-from-right duration-300">
      <div>
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#E30613] flex items-center justify-center font-impact text-white text-xl">
              {train.id}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white uppercase">
                {train.name}
              </h3>
              <span className="text-xs text-[#38BDF8]">
                ALSTOM METROPOLIS • 3-CAR FORMATION
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Highlight Banner */}
        <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 mb-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/40 uppercase block">OPERATIONAL STATUS</span>
            <span className="text-sm font-bold text-[#22C55E] uppercase tracking-wide">
              {train.status.replace('_', ' ')}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-white/40 uppercase block">CBTC CONTROL MODE</span>
            <span className="text-xs font-bold text-[#38BDF8]">
              {train.driverStatus} (GoA2)
            </span>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-wider text-white/40 block">
            LIVE TRAIN TELEMETRY
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 text-white/50 text-[10px] mb-1">
                <Gauge className="w-3.5 h-3.5" />
                <span>CURRENT SPEED</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                {train.speedKmh} <span className="text-xs font-normal text-white/50">km/h</span>
              </span>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 text-white/50 text-[10px] mb-1">
                <Thermometer className="w-3.5 h-3.5" />
                <span>TRACTION MOTOR</span>
              </div>
              <span className={`font-display font-bold text-xl ${train.motorTempC > 70 ? 'text-[#EF4444]' : 'text-white'}`}>
                {train.motorTempC}° <span className="text-xs font-normal text-white/50">Celsius</span>
              </span>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 text-white/50 text-[10px] mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>TRACTION POWER</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                {train.energyConsumptionKwh} <span className="text-xs font-normal text-white/50">kWh</span>
              </span>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-1.5 text-white/50 text-[10px] mb-1">
                <Shield className="w-3.5 h-3.5" />
                <span>HEALTH SCORE</span>
              </div>
              <span className="font-display font-bold text-xl text-[#22C55E]">
                {train.healthScorePct}%
              </span>
            </div>
          </div>

          {/* Passenger Capacity Gauge */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/50">PASSENGER OCCUPANCY</span>
              <span className="font-bold text-white">
                {train.passengerLoad} / {train.capacity} ({loadPercentage}%)
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  loadPercentage > 85 ? 'bg-[#EF4444]' : loadPercentage > 65 ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'
                }`}
                style={{ width: `${loadPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Location Details */}
          <div className="p-3.5 rounded-lg bg-white/5 border border-white/5 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-white/40">CURRENT TRACK BLOCK:</span>
              <span className="text-white font-bold">{train.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">RUNNING DIRECTION:</span>
              <span className="text-[#38BDF8] font-bold">
                {train.direction === 'DOWN' ? 'SOUTHBOUND (Tripunithura)' : 'NORTHBOUND (Aluva)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">ASSIGNED ROUTE:</span>
              <span className="text-white font-bold">{train.assignedRoute}</span>
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
          CLOSE TELEMETRY INSPECTOR
        </button>
      </div>
    </div>
  );
};
