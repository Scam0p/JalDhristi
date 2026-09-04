import React from 'react';
import { PipelineSegment, SensorNode } from '../../types/simulation';
import { X, Activity } from 'lucide-react';

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
  const attachedSensorsList = sensors.filter(s => segment.attachedSensors.includes(s.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-2xs animate-in fade-in duration-200" 
      />

      <div className="relative z-10 w-full max-w-md bg-white h-full border-l border-[#E5E7EB] shadow-2xl p-5 flex flex-col justify-between font-mono-tech select-none overflow-y-auto animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm uppercase text-[#111827]">
                  {segment.name}
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E8F7EE] text-[#144230] border border-[#B7E4C7]">
                  {segment.code}
                </span>
              </div>
              <span className="text-[10px] text-[#6B7280]">
                KM {segment.kmPosition.toFixed(1)} • {segment.lengthMeters}M SPAN • DN{segment.diameterMm}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded bg-[#F4F5F7] hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer border border-[#E5E7EB]"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pipe Specifications Banner */}
          <div className="p-3 rounded bg-[#F9FAFB] border border-[#E5E7EB] mb-4 space-y-1.5 text-xs">
            <span className="text-[9px] text-[#6B7280] uppercase font-bold block">
              PIPELINE SPECIFICATIONS
            </span>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#6B7280]">Material:</span>
              <span className="font-bold text-[#111827]">{segment.material}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#6B7280]">Nominal Bore:</span>
              <span className="font-bold text-[#111827]">DN{segment.diameterMm} mm</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#6B7280]">Span Length:</span>
              <span className="font-bold text-[#111827]">{segment.lengthMeters} meters</span>
            </div>
          </div>

          {/* Live Acoustic Spectrogram Simulation Frame */}
          <div className="relative rounded overflow-hidden border border-[#E5E7EB] bg-[#F9FAFB] mb-4">
            <div className="p-2.5 bg-white flex items-center justify-between border-b border-[#E5E7EB] text-[10px]">
              <div className="flex items-center gap-1.5 text-[#144230]">
                <Activity className="w-3.5 h-3.5 text-[#22C55E]" />
                <span className="font-bold">ACOUSTIC SPECTROGRAM • GCC-PHAT</span>
              </div>
              <span className={`font-bold ${isCritical ? 'text-[#DC2626]' : 'text-[#144230]'}`}>
                RISK INDEX: {segment.acousticRiskScore}%
              </span>
            </div>

            {/* Spectrogram Canvas Frame */}
            <div className="h-28 relative flex items-center justify-center p-3 bg-[#F4F5F7]">
              <div className="w-full flex items-end justify-between gap-1 h-16 px-1">
                {[20, 35, 60, 45, isCritical ? 95 : 30, isCritical ? 88 : 25, 40, 30, 22, 18, 15].map((val, idx) => (
                  <div key={idx} className="flex-1 bg-white rounded-none flex items-end p-0.5 border border-[#E5E7EB]">
                    <div
                      className={`w-full transition-all duration-500 ${
                        val > 70 ? 'bg-[#EF4444]' : val > 50 ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'
                      }`}
                      style={{ height: `${val}%` }}
                    />
                  </div>
                ))}
              </div>

              {isCritical && (
                <div className="absolute inset-0 bg-[#EF4444]/10 flex items-center justify-center">
                  <div className="bg-white px-2.5 py-1 rounded border border-[#EF4444] text-center">
                    <span className="text-[10px] font-bold text-[#991B1B] block uppercase">
                      ACOUSTIC BURST SIGNATURE DETECTED
                    </span>
                    <span className="text-[9px] text-[#6B7280]">
                      Frequency: 1,840 Hz • Coherence: 0.94
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hydraulic Flow & Residual Metrics */}
          <div className="space-y-2 mb-4">
            <span className="text-[9px] uppercase tracking-wider text-[#6B7280] block font-bold">
              HYDRAULIC CONTINUITY &amp; HEAD LOSS
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-[#F9FAFB] border border-[#E5E7EB]">
                <span className="text-[9px] text-[#6B7280] uppercase block mb-0.5">INFLOW HEAD</span>
                <span className="font-bold text-lg text-[#144230]">
                  {segment.inflowPressureBar} <span className="text-xs font-normal text-[#6B7280]">bar</span>
                </span>
              </div>

              <div className="p-2.5 rounded bg-[#F9FAFB] border border-[#E5E7EB]">
                <span className="text-[9px] text-[#6B7280] uppercase block mb-0.5">OUTFLOW HEAD</span>
                <span className={`font-bold text-lg ${isCritical ? 'text-[#DC2626]' : 'text-[#144230]'}`}>
                  {segment.outflowPressureBar} <span className="text-xs font-normal text-[#6B7280]">bar</span>
                </span>
              </div>

              <div className="p-2.5 rounded bg-[#F9FAFB] border border-[#E5E7EB]">
                <span className="text-[9px] text-[#6B7280] uppercase block mb-0.5">ACTUAL FLOW</span>
                <span className="font-bold text-lg text-[#111827]">
                  {segment.actualFlowM3h} <span className="text-xs font-normal text-[#6B7280]">m³/h</span>
                </span>
              </div>

              <div className="p-2.5 rounded bg-[#F9FAFB] border border-[#E5E7EB]">
                <span className="text-[9px] text-[#6B7280] uppercase block mb-0.5">FLOW RESIDUAL</span>
                <span className={`font-bold text-lg ${
                  segment.flowResidualPct < -5 ? 'text-[#DC2626]' : 'text-[#144230]'
                }`}>
                  {segment.flowResidualPct}%
                </span>
              </div>
            </div>
          </div>

          {/* Attached Sensor Nodes */}
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#6B7280] block font-bold mb-1.5">
              ATTACHED SENSORS ({attachedSensorsList.length})
            </span>
            <div className="space-y-1.5">
              {attachedSensorsList.map(s => (
                <div key={s.id} className="p-2 rounded bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    <span className="font-bold text-[#111827]">{s.id}</span>
                    <span className="text-[#6B7280]">{s.name}</span>
                  </div>
                  <span className="text-[10px] text-[#144230] font-bold">
                    {s.pressureBar} bar
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E5E7EB]">
          <button
            onClick={onClose}
            className="w-full py-2 px-3 rounded bg-[#144230] hover:bg-[#1A543E] text-white font-mono-tech font-bold text-xs uppercase tracking-wider transition-colors border border-[#0F3224] cursor-pointer text-center"
          >
            CLOSE INSPECTOR
          </button>
        </div>
      </div>
    </div>
  );
};

export default StationDetailDrawer;
