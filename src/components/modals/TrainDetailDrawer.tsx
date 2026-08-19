import React from 'react';
import { Train } from '../../types/simulation';
import { X, Gauge, Thermometer, Zap, Shield } from 'lucide-react';

interface TrainDetailDrawerProps {
  train: Train | null;
  onClose: () => void;
}

export const TrainDetailDrawer: React.FC<TrainDetailDrawerProps> = ({ train, onClose }) => {
  if (!train) return null;

  const loadPercentage = Math.round((train.passengerLoad / train.capacity) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Semi-transparent backdrop to dismiss on click */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-2xs animate-in fade-in duration-200" 
      />

      <div className="relative z-10 w-full max-w-md bg-white h-full border-l border-[#ECEEF2] shadow-2xl p-6 flex flex-col justify-between font-mono-tech select-none overflow-y-auto animate-in slide-in-from-right duration-300">
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F0F2F5] mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#144230] flex items-center justify-center text-white font-mono-tech font-black text-xl shadow-sm">
                {train.id}
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-[#111827]">
                  {train.name}
                </h3>
                <span className="text-xs text-[#6B7280]">
                  ALSTOM METROPOLIS • 3-CAR FORMATION
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#F4F5F7] hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Highlight Banner */}
          <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#ECEEF2] mb-6 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#9CA3AF] uppercase block">OPERATIONAL STATUS</span>
              <span className="text-sm font-bold text-[#144230] uppercase tracking-wide">
                {train.status.replace('_', ' ')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#9CA3AF] uppercase block">CBTC CONTROL MODE</span>
              <span className="text-xs font-bold text-[#111827]">
                {train.driverStatus} (GoA2)
              </span>
            </div>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] block font-bold">
              LIVE TRAIN TELEMETRY
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F4F5F7] border border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 text-[#6B7280] text-[10px] mb-1">
                  <Gauge className="w-3.5 h-3.5" />
                  <span>CURRENT SPEED</span>
                </div>
                <span className="font-display font-bold text-xl text-[#111827]">
                  {train.speedKmh} <span className="text-xs font-normal text-[#6B7280]">km/h</span>
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F5F7] border border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 text-[#6B7280] text-[10px] mb-1">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>TRACTION MOTOR</span>
                </div>
                <span className={`font-display font-bold text-xl ${train.motorTempC > 70 ? 'text-[#EF4444]' : 'text-[#111827]'}`}>
                  {train.motorTempC}° <span className="text-xs font-normal text-[#6B7280]">C</span>
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F5F7] border border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 text-[#6B7280] text-[10px] mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>TRACTION POWER</span>
                </div>
                <span className="font-display font-bold text-xl text-[#111827]">
                  {train.energyConsumptionKwh} <span className="text-xs font-normal text-[#6B7280]">kWh</span>
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F5F7] border border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 text-[#6B7280] text-[10px] mb-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>HEALTH SCORE</span>
                </div>
                <span className="font-display font-bold text-xl text-[#144230]">
                  {train.healthScorePct}%
                </span>
              </div>
            </div>

            {/* Passenger Capacity Gauge */}
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#ECEEF2] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#6B7280]">PASSENGER OCCUPANCY</span>
                <span className="font-bold text-[#111827]">
                  {train.passengerLoad} / {train.capacity} ({loadPercentage}%)
                </span>
              </div>
              <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    loadPercentage > 85 ? 'bg-[#EF4444]' : loadPercentage > 65 ? 'bg-[#F59E0B]' : 'bg-[#144230]'
                  }`}
                  style={{ width: `${loadPercentage}%` }}
                />
              </div>
            </div>

            {/* Location Details */}
            <div className="p-3.5 rounded-2xl bg-[#F4F5F7] border border-[#E5E7EB] text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">CURRENT TRACK BLOCK:</span>
                <span className="text-[#111827] font-bold">{train.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">RUNNING DIRECTION:</span>
                <span className="text-[#144230] font-bold">
                  {train.direction === 'DOWN' ? 'SOUTHBOUND (Tripunithura)' : 'NORTHBOUND (Aluva)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">ASSIGNED ROUTE:</span>
                <span className="text-[#111827] font-bold">{train.assignedRoute}</span>
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
            CLOSE TELEMETRY INSPECTOR
          </button>
        </div>
      </div>
    </div>
  );
};
