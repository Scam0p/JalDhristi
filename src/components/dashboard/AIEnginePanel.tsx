import React from 'react';
import { AIRecommendation, CaseType } from '../../types/simulation';
import { Cpu, Sparkles, Check, ArrowRight, Layers, ShieldCheck } from 'lucide-react';

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
    { name: 'PASSENGER DEMAND PREDICTOR', confidence: 94, color: '#38BDF8' },
    { name: 'FLEET READINESS MATRIX', confidence: 98, color: '#22C55E' },
    { name: 'MAINTENANCE & SAFETY CONSTRAINTS', confidence: 100, color: '#22C55E' },
    { name: 'HEADWAY & TURNOUT SOLVER', confidence: 96, color: '#38BDF8' }
  ];

  return (
    <div className="gov-panel rounded-2xl p-5 md:p-6 border border-white/10 shadow-xl flex flex-col justify-between h-full space-y-4">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#0E1626] border border-white/10 text-[#38BDF8]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base md:text-lg text-white uppercase tracking-wide">
                AI DECISION ENGINE
              </h3>
              <span className="text-[10px] font-mono-tech text-[#38BDF8]">
                KMRL-NEURAL-INDUCTION-SCHEDULER v2.6
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#080C14] border border-white/10 text-[10px] font-mono-tech">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
            <span className="text-[#22C55E] font-bold">MODEL ONLINE</span>
          </div>
        </div>

        {/* Neural Sub-Model Confidence Gauges */}
        <div className="space-y-2 mb-4 bg-[#080C14] p-3.5 rounded-xl border border-white/5 text-xs font-mono-tech">
          <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold block mb-1">
            NEURAL SUB-MODEL CONFIDENCE
          </span>
          {models.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[10px] text-white/80">
                <span>{m.name}</span>
                <span className="font-bold text-white">{m.confidence}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${m.confidence}%`,
                    backgroundColor: m.color
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pareto Objective Formulation */}
        <div className="p-3.5 rounded-xl bg-[#080C14] border border-white/10 mb-4 text-xs font-mono-tech space-y-1">
          <div className="flex items-center gap-1.5 text-[#38BDF8] font-bold text-[10px]">
            <Layers className="w-3.5 h-3.5" />
            <span>PARETO OBJECTIVE FORMULATION</span>
          </div>
          <div className="text-[11px] text-white/90 leading-relaxed pt-1">
            <span className="text-[#22C55E] font-bold">MINIMIZE: </span>
            <span>0.45·WaitTime + 0.35·Congestion + 0.20·IdleFleet</span>
            <br />
            <span className="text-[#F59E0B] font-bold">CONSTRAINTS: </span>
            <span>Depot Turnout ≤ 2 trains/5m, Safe Headway ≥ 180s</span>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <span className="text-[10px] font-mono-tech uppercase tracking-wider text-white/50 font-bold block mb-2">
            REAL-TIME INDUCTION RECOMMENDATIONS
          </span>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {recommendations.slice(0, 3).map((rec) => {
              const isDeployed = rec.status === 'DEPLOYED';

              return (
                <div
                  key={rec.id}
                  className={`p-3 rounded-xl border transition-all text-xs font-mono-tech ${
                    isDeployed
                      ? 'bg-[#080C14]/50 border-white/5 opacity-60'
                      : 'bg-[#0E1626] border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#E30613] text-white font-bold text-[9px]">
                        {rec.trainId}
                      </span>
                      <span className="font-bold text-white tracking-wide text-xs">
                        {rec.title}
                      </span>
                    </div>
                    <span className="text-[9px] text-[#22C55E] font-bold">
                      {rec.confidenceScore}% CONF
                    </span>
                  </div>

                  <p className="text-[11px] text-white/70 font-normal my-1 leading-normal">
                    {rec.rationale}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                    <span className="text-[10px] text-[#38BDF8] font-medium">
                      IMPACT: {rec.expectedWaitReduction}
                    </span>

                    {isDeployed ? (
                      <span className="inline-flex items-center gap-1 text-[#22C55E] font-bold text-[10px]">
                        <Check className="w-3 h-3" /> DEPLOYED
                      </span>
                    ) : (
                      <button
                        onClick={() => onDeployRecommendation(rec.id)}
                        className="px-3 py-1 rounded bg-[#E30613] hover:bg-[#FF1A2E] text-white text-[10px] font-bold uppercase transition-colors cursor-pointer flex items-center gap-1 shadow active:scale-95"
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
      <div className="pt-2 border-t border-white/10">
        <button
          onClick={onRunOptimization}
          disabled={isOptimizing}
          className="w-full py-3 px-4 rounded-xl bg-[#E30613] hover:bg-[#FF1A2E] text-white font-display font-bold text-xs md:text-sm tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-2 shadow disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'SOLVING OPTIMAL INDUCTION...' : 'RUN AI OPTIMIZATION SOLVER'}</span>
        </button>
      </div>
    </div>
  );
};
