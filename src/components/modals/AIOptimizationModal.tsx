import React from 'react';
import { Check, Loader2, Zap, Droplets } from 'lucide-react';

interface AIOptimizationModalProps {
  isOpen: boolean;
  step: number;
}

export const AIOptimizationModal: React.FC<AIOptimizationModalProps> = ({ isOpen, step }) => {
  if (!isOpen) return null;

  const steps = [
    { num: 1, title: 'INGESTING SPARSE SENSOR TELEMETRY & TRANSIENT BUFFERS' },
    { num: 2, title: 'EXECUTING HYDRAULIC DIGITAL TWIN EQUATIONS (HAZEN-WILLIAMS)' },
    { num: 3, title: 'COMPUTING FLOW RESIDUALS & PRESSURE GRADIENT RESIDUALS' },
    { num: 4, title: 'NARROWING PROBABLE PIPELINE SEGMENT VIA NETWORK TOPOLOGY' },
    { num: 5, title: 'SOLVING ACOUSTIC CROSS-CORRELATION (GCC-PHAT) LEAK PINPOINT' }
  ];

  const progressPct = Math.min(100, Math.round((step / 5) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg bg-white border border-[#E5E7EB] rounded-lg p-6 font-mono-tech shadow-xl">
        {/* SCADA Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-[#144230] flex items-center justify-center text-white">
              <Droplets className="w-5 h-5 text-[#22C55E]" />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase text-[#111827] tracking-wider">
                HYDRAULIC SOLVER IN EXECUTION
              </h3>
              <span className="text-[10px] text-[#6B7280]">
                TRANSIENT SOLVER &amp; ACOUSTIC LOCALIZATION CORE
              </span>
            </div>
          </div>

          <span className="text-xl font-bold text-[#144230]">
            {progressPct}%
          </span>
        </div>

        {/* Rectangular Progress Bar */}
        <div className="w-full h-2 bg-[#E5E7EB] rounded-none overflow-hidden mb-4">
          <div
            className="h-full bg-[#144230] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Step Items List */}
        <div className="space-y-2 mb-4 text-xs">
          {steps.map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div
                key={s.num}
                className={`p-2.5 rounded border flex items-center justify-between transition-colors ${
                  isCompleted
                    ? 'bg-[#E8F7EE] border-[#B7E4C7] text-[#144230]'
                    : isCurrent
                    ? 'bg-white border-[#144230] text-[#111827]'
                    : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center border ${
                    isCompleted || isCurrent ? 'border-[#144230] text-[#144230] bg-white' : 'border-[#D1D5DB] text-[#9CA3AF]'
                  }`}>
                    {s.num}
                  </span>
                  <span className="text-[11px] font-bold tracking-tight">
                    {s.title}
                  </span>
                </div>

                {isCompleted ? (
                  <Check className="w-4 h-4 text-[#15803D]" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-[#144230] animate-spin" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-none border border-[#D1D5DB]" />
                )}
              </div>
            );
          })}
        </div>

        {/* Telemetry Footnote */}
        <div className="p-2.5 bg-[#F9FAFB] rounded border border-[#E5E7EB] text-[10px] text-[#6B7280] flex items-center justify-between">
          <span className="flex items-center gap-1 text-[#144230] font-semibold">
            <Zap className="w-3.5 h-3.5 text-[#22C55E]" /> 26.8 KM PIPELINE CONSTRAINTS
          </span>
          <span className="text-[#144230] font-bold">SOLVER CYCLE: ~42ms</span>
        </div>
      </div>
    </div>
  );
};

export default AIOptimizationModal;
