import React from 'react';
import { Cpu, Sparkles, CheckCircle2, Loader2, Zap, Droplets } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-xl donezo-card p-6 md:p-8 font-mono-tech overflow-hidden shadow-2xl border border-[#ECEEF2]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F0F2F5] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#144230] flex items-center justify-center text-white shadow-md">
              <Droplets className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg md:text-xl text-[#111827]">
                JalDrishti Hydraulic Intelligence Solver
              </h3>
              <span className="text-xs text-[#144230] font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>SPARSE SENSOR HYDRAULIC DIGITAL TWIN & PINPOINT SOLVER</span>
              </span>
            </div>
          </div>

          <span className="text-2xl font-black text-[#144230] font-display">
            {progressPct}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-[#E5E7EB] rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-[#144230] to-[#22C55E] rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Step Items List */}
        <div className="space-y-3 mb-6">
          {steps.map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div
                key={s.num}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#E8F7EE] border-[#B7E4C7] text-[#144230]'
                    : isCurrent
                    ? 'bg-white border-[#144230] text-[#111827] shadow-sm'
                    : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border ${
                    isCompleted || isCurrent ? 'border-[#144230] text-[#144230]' : 'border-[#D1D5DB]'
                  }`}>
                    {s.num}
                  </span>
                  <span className="text-xs font-bold tracking-wide">
                    {s.title}
                  </span>
                </div>

                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-[#144230] animate-spin" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-[#D1D5DB]" />
                )}
              </div>
            );
          })}
        </div>

        {/* Telemetry Footnote */}
        <div className="p-3 bg-[#F4F5F7] rounded-xl border border-[#E5E7EB] text-[10px] text-[#6B7280] flex items-center justify-between">
          <span className="flex items-center gap-1 text-[#144230] font-semibold">
            <Zap className="w-3.5 h-3.5 fill-current text-[#22C55E]" /> 26.8 KM PIPELINE NETWORK CONSTRAINTS
          </span>
          <span className="text-[#144230] font-bold">SOLVER LATENCY: ~42ms</span>
        </div>
      </div>
    </div>
  );
};
