import React from 'react';
import { AIRecommendation, CaseType } from '../../types/simulation';
import { Cpu, Sparkles, Check, ArrowRight, Layers } from 'lucide-react';

interface AIEnginePanelProps {
  recommendations: AIRecommendation[];
  onDeployRecommendation: (id: string) => void;
  onRunOptimization: () => void;
  isOptimizing: boolean;
  currentCase: CaseType;
}

export const AIEnginePanel: React.FC<AIEnginePanelProps> = ({
  recommendations,
  onDeployRecommendation,
  onRunOptimization,
  isOptimizing,
  currentCase
}) => {
  const models = [
    { name: 'PASSENGER DEMAND PREDICTOR', confidence: 94, color: '#144230' },
    { name: 'FLEET READINESS MATRIX', confidence: 98, color: '#22C55E' },
    { name: 'MAINTENANCE & SAFETY CONSTRAINTS', confidence: 100, color: '#22C55E' },
    { name: 'HEADWAY & TURNOUT SOLVER', confidence: 96, color: '#144230' }
  ];

  return (
    <div className="donezo-card p-6 flex flex-col justify-between h-full space-y-4">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F0F2F5]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#E8F7EE] text-[#144230]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#111827]">
                AI Decision Engine
              </h3>
              <span className="text-[10px] font-mono-tech text-[#6B7280]">
                KMRL-NEURAL-INDUCTION-SCHEDULER v2.6
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F7EE] text-[#144230] text-[10px] font-mono-tech font-bold">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            <span>MODEL ONLINE</span>
          </div>
        </div>

        {/* Neural Sub-Model Confidence Gauges */}
        <div className="space-y-2 mb-4 bg-[#F4F5F7] p-4 rounded-2xl border border-[#E5E7EB] text-xs font-mono-tech">
          <span className="text-[9px] uppercase tracking-wider text-[#6B7280] font-bold block mb-1">
            NEURAL SUB-MODEL CONFIDENCE
          </span>
          {models.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#374151]">
                <span className="font-medium">{m.name}</span>
                <span className="font-bold text-[#111827]">{m.confidence}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${m.confidence}%`,
                    backgroundColor: m.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pareto Objective Formulation */}
        <div className="p-3.5 rounded-2xl bg-[#E8F7EE]/60 border border-[#B7E4C7] mb-4 text-xs font-mono-tech space-y-1">
          <div className="flex items-center gap-1.5 text-[#144230] font-bold text-[10px]">
            <Layers className="w-3.5 h-3.5" />
            <span>PARETO OBJECTIVE FORMULATION</span>
          </div>
          <div className="text-[11px] text-[#111827] leading-relaxed pt-1">
            <span className="text-[#144230] font-bold">MINIMIZE: </span>
            <span>0.45·WaitTime + 0.35·Congestion + 0.20·IdleFleet</span>
            <br />
            <span className="text-[#92400E] font-bold">CONSTRAINTS: </span>
            <span>Depot Turnout ≤ 2 trains/5m, Safe Headway ≥ 180s</span>
          </div>
        </div>

        {/* Recommendations List */}
        <div>
          <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#6B7280] font-bold block mb-2">
            REAL-TIME INDUCTION RECOMMENDATIONS
          </span>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {recommendations.slice(0, 3).map((rec) => {
              const isDeployed = rec.status === 'DEPLOYED';

              return (
                <div
                  key={rec.id}
                  className={`p-3 rounded-2xl border transition-all text-xs font-mono-tech ${
                    isDeployed
                      ? 'bg-[#F9FAFB] border-[#E5E7EB] opacity-60'
                      : 'bg-white border-[#E5E7EB] shadow-2xs hover:border-[#D1D5DB]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#144230] text-white font-bold text-[9px]">
                        {rec.trainId}
                      </span>
                      <span className="font-bold text-[#111827] tracking-wide text-xs">
                        {rec.title}
                      </span>
                    </div>
                    <span className="text-[9px] text-[#144230] font-bold">
                      {rec.confidenceScore}% CONF
                    </span>
                  </div>

                  <p className="text-[11px] text-[#6B7280] font-normal my-1 leading-normal">
                    {rec.rationale}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0F2F5]">
                    <span className="text-[10px] text-[#144230] font-medium">
                      IMPACT: {rec.expectedWaitReduction}
                    </span>

                    {isDeployed ? (
                      <span className="inline-flex items-center gap-1 text-[#22C55E] font-bold text-[10px]">
                        <Check className="w-3 h-3" /> DEPLOYED
                      </span>
                    ) : (
                      <button
                        onClick={() => onDeployRecommendation(rec.id)}
                        className="px-3 py-1 rounded-full bg-[#144230] hover:bg-[#1A543E] text-white text-[10px] font-bold uppercase transition-colors cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
                      >
                        <span>EXECUTE</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trigger Button */}
      <div className="pt-3 border-t border-[#F0F2F5]">
        <button
          onClick={onRunOptimization}
          disabled={isOptimizing}
          className="w-full py-3 px-4 rounded-full bg-[#144230] hover:bg-[#1A543E] text-white font-display font-bold text-xs md:text-sm tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'SOLVING OPTIMAL INDUCTION...' : 'RUN AI OPTIMIZATION SOLVER'}</span>
        </button>
      </div>
    </div>
  );
};
