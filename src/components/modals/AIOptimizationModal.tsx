import React from 'react';
import { Cpu, Sparkles, CheckCircle2, Loader2, Zap } from 'lucide-react';

interface AIOptimizationModalProps {
  isOpen: boolean;
  step: number;
}

export const AIOptimizationModal: React.FC<AIOptimizationModalProps> = ({ isOpen, step }) => {
  if (!isOpen) return null;

  const steps = [
    { num: 1, title: 'SCANNING RAILWAY NETWORK & TRACK SENSORS' },
    { num: 2, title: 'ANALYZING PASSENGER DEMAND & QUEUE GROWTH' },
    { num: 3, title: 'CHECKING FLEET READINESS & DEPOT TURNOUT CAPACITY' },
    { num: 4, title: 'EVALUATING MAINTENANCE MATRIX & TRACTION POWER' },
    { num: 5, title: 'GENERATING PARETO-OPTIMAL INDUCTION SCHEDULE' }
  ];

  const progressPct = Math.min(100, Math.round((step / 5) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-xl tech-panel-holo tech-corner tech-corner-red rounded-2xl p-6 md:p-8 border border-[#59F3FF]/40 shadow-[0_0_50px_rgba(89,243,255,0.25)] font-mono-tech overflow-hidden">
        {/* Holographic Laser Scan Line */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#59F3FF] to-transparent animate-scan"></div>

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#E30613] flex items-center justify-center text-white shadow-[0_0_20px_rgba(227,6,19,0.8)]">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg md:text-xl text-white uppercase tracking-wider">
                KMRL AI SOLVER ENGAGED
              </h3>
              <span className="text-xs text-[#59F3FF] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>DYNAMIC PARETO-OPTIMAL MULTI-OBJECTIVE ENGINE</span>
              </span>
            </div>
          </div>

          <span className="text-xl font-black text-[#59F3FF] font-display">
            {progressPct}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden mb-6 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#E30613] via-[#59F3FF] to-[#65FF9A] rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>

        {/* Step Items List */}
        <div className="space-y-3 mb-6">
          {steps.map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div
                key={s.num}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#65FF9A]/10 border-[#65FF9A]/30 text-[#65FF9A]'
                    : isCurrent
                    ? 'bg-[#59F3FF]/20 border-[#59F3FF] text-white shadow-[0_0_15px_rgba(89,243,255,0.2)]'
                    : 'bg-black/30 border-white/5 text-white/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border border-current">
                    {s.num}
                  </span>
                  <span className="text-xs font-bold tracking-wide">
                    {s.title}
                  </span>
                </div>

                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-[#65FF9A]" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-[#59F3FF] animate-spin" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-white/20"></span>
                )}
              </div>
            );
          })}
        </div>

        {/* Telemetry Footnote */}
        <div className="p-3 bg-black/50 rounded-lg border border-white/10 text-[10px] text-white/60 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[#65FF9A]">
            <Zap className="w-3.5 h-3.5" /> 1,420 PERMUTATIONS TESTED
          </span>
          <span className="text-[#59F3FF]">SOLVE LATENCY: ~42ms</span>
        </div>
      </div>
    </div>
  );
};
