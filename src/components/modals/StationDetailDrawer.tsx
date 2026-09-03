import React from 'react';
import { PipelineSegment, SensorNode } from '../../types/simulation';
import { X, Droplets, Activity, Gauge, ShieldAlert, Layers, CheckCircle2, AlertTriangle } from 'lucide-react';

interface StationDetailDrawerProps {
  station: PipelineSegment | null;
  trains: SensorNode[];
  onClose: () => void;
  onDeployInductionToStation?: (segmentId: string) => void;
}

export const StationDetailDrawer: React.FC<StationDetailDrawerProps> = ({
  station: segment,
  trains: sensors,
  onClose
}) => {
  if (!segment) return null;

  const isCritical = segment.status === 'CRITICAL_LEAK';
  const isWarn = segment.status === 'PRESSURE_DROP';
  const attachedSensorsList = sensors.filter(s => segment.attachedSensors.includes(s.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
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
                  {segment.name}
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#E8F7EE] text-[#144230] border border-[#B7E4C7]">
                  {segment.code}
                </span>
              </div>
              <span className="text-xs text-[#6B7280]">
                KM {segment.kmPosition.toFixed(1)} • {segment.lengthMeters}M SPAN • DN{segment.diameterMm}
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

          {/* Pipe Specifications Banner */}
          <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#ECEEF2] mb-6 space-y-2 text-xs">
            <span className="text-[10px] text-[#9CA3AF] uppercase font-bold block">
              PIPELINE SPECIFICATIONS
            </span>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Material:</span>
              <span className="font-bold text-[#111827]">{segment.material}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Nominal Bore:</span>
              <span className="font-bold text-[#111827]">DN{segment.diameterMm} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Span Length:</span>
              <span className="font-bold text-[#111827]">{segment.lengthMeters} meters</span>
            </div>
          </div>

          {/* Live Acoustic Spectrogram Simulation Frame */}
          <div className="relative rounded-2xl overflow-hidden border border-[#ECEEF2] bg-[#F9FAFB] mb-6">
            <div className="p-3 bg-white flex items-center justify-between border-b border-[#ECEEF2] text-[10px]">
              <div className="flex items-center gap-1.5 text-[#144230]">
                <Activity className="w-3.5 h-3.5 text-[#22C55E]" />
                <span className="font-bold">ACOUSTIC SPECTROGRAM • GCC-PHAT</span>
              </div>
              <span className={`font-bold ${isCritical ? 'text-[#EF4444]' : 'text-[#144230]'}`}>
                RISK INDEX: {segment.acousticRiskScore}%
              </span>
            </div>

            {/* Spectrogram Canvas Frame */}
            <div className="h-32 relative flex items-center justify-center p-4 bg-[#144230]/5">
              <div className="w-full flex items-end justify-between gap-1.5 h-20 px-2">
                {[20, 35, 60, 45, isCritical ? 95 : 30, isCritical ? 88 : 25, 40, 30, 22, 18, 15].map((val, idx) => (
                  <div key={idx} className="flex-1 bg-white rounded-md flex items-end p-0.5 shadow-2xs">
                    <div
                      className={`w-full rounded-xs transition-all duration-500 ${
                        val > 70 ? 'bg-[#EF4444]' : val > 50 ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'
                      }`}
                      style={{ height: `${val}%` }}
                    />
                  </div>
                ))}
              </div>

              {isCritical && (
                <div className="absolute inset-0 bg-[#EF4444]/10 flex items-center justify-center backdrop-blur-3xs">
                  <div className="bg-white/95 px-3 py-1.5 rounded-xl border border-[#EF4444] shadow-sm text-center">
                    <span className="text-[10px] font-bold text-[#991B1B] block">
                      ACOUSTIC BURST SIGNATURE DETECTED
                    </span>
                    <span className="text-[9px] text-[#6B7280]">
                      Frequency Peak: 1,840 Hz • Coherence: 0.94
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hydraulic Flow & Residual Metrics */}
          <div className="space-y-4 mb-6">
            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] block font-bold">
              HYDRAULIC CONTINUITY & HEAD LOSS
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#F4F5F7] border border-[#E5E7EB]">
                <span className="text-[10px] text-[#9CA3AF] uppercase block mb-1">INFLOW HEAD</span>
                <span className="font-display font-bold text-2xl text-[#144230]">
                  {segment.inflowPressureBar} <span className="text-xs font-normal text-[#6B7280]">bar</span>
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F5F7] border border-[#E5E7EB]">
                <span className="text-[10px] text-[#9CA3AF] uppercase block mb-1">OUTFLOW HEAD</span>
                <span className={`font-display font-bold text-2xl ${isCritical ? 'text-[#EF4444]' : 'text-[#144230]'}`}>
                  {segment.outflowPressureBar} <span className="text-xs font-normal text-[#6B7280]">bar</span>
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F5F7] border border-[#E5E7EB]">
                <span className="text-[10px] text-[#9CA3AF] uppercase block mb-1">ACTUAL FLOW</span>
                <span className="font-display font-bold text-xl text-[#111827]">
                  {segment.actualFlowM3h} <span className="text-xs font-normal text-[#6B7280]">m³/h</span>
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4F5F7] border border-[#E5E7EB]">
                <span className="text-[10px] text-[#9CA3AF] uppercase block mb-1">FLOW RESIDUAL</span>
                <span className={`font-display font-bold text-xl ${
                  segment.flowResidualPct < -5 ? 'text-[#EF4444]' : 'text-[#144230]'
                }`}>
                  {segment.flowResidualPct}%
                </span>
              </div>
            </div>
          </div>

          {/* Attached Sensor Nodes */}
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] block font-bold mb-2">
              ATTACHED SENSOR HARDWARE ({attachedSensorsList.length})
            </span>
            <div className="space-y-2">
              {attachedSensorsList.map(s => (
                <div key={s.id} className="p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <span className="font-bold text-[#111827]">{s.id}</span>
                    <span className="text-[#6B7280]">{s.name}</span>
                  </div>
                  <span className="text-[10px] font-mono-tech text-[#144230] font-bold">
                    {s.pressureBar} bar
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#F0F2F5]">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-full bg-[#144230] hover:bg-[#1A543E] text-white font-display font-bold text-xs tracking-wide transition-all shadow-sm cursor-pointer text-center"
          >
            Close Segment Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
