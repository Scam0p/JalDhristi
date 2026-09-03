import React from 'react';
import { LeakAlert, CaseType } from '../../types/simulation';
import { Cpu, Sparkles, Check, ArrowRight, Layers, Droplets } from 'lucide-react';

interface AIEnginePanelProps {
  recommendations: LeakAlert[];
  onDeployRecommendation: (id: string) => void;
  onRunOptimization: () => void;
  isOptimizing: boolean;
  currentCase: CaseType;
}

export const AIEnginePanel: React.FC<AIEnginePanelProps> = ({
  recommendations: alerts,
  onDeployRecommendation,
  onRunOptimization,
  isOptimizing,
  currentCase
}) => {
  const models = [
    { name: 'HYDRAULIC NETWORK DIGITAL TWIN (EPANET)', confidence: 96, color: '#144230' },
    { name: 'SPARSE SENSOR MASS-FLOW BALANCE', confidence: 98, color: '#22C55E' },
    { name: 'ACOUSTIC CROSS-CORRELATION (GCC-PHAT)', confidence: 94, color: '#22C55E' },
    { name: 'HIGH-FREQUENCY PRESSURE TRANSIENT ANALYZER', confidence: 99, color: '#144230' }
  ];

  return (
    <div className="donezo-card p-6 flex flex-col justify-between h-full space-y-4 select-none">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F0F2F5]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#E8F7EE] text-[#144230]">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#111827]">
                Hydraulic Intelligence & Digital Twin Engine
              </h3>
              <span className="text-[10px] font-mono-tech text-[#6B7280]">
                JALDRISHTI-NEURAL-PINPOINT-SOLVER v3.1
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F7EE] text-[#144230] text-[10px] font-mono-tech font-bold">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span>SOLVER ONLINE</span>
          </div>
        </div>

        {/* 4-Stage Operational Flow Breadcrumb */}
        <div className="mb-4 p-3 bg-white rounded-2xl border border-[#ECEEF2] flex items-center justify-between text-xs font-mono-tech">
          <div className="flex items-center gap-1.5 text-[#144230] font-bold">
            <span className="w-5 h-5 rounded-full bg-[#144230] text-white flex items-center justify-center text-[10px]">1</span>
            <span>DETECT</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <div className="flex items-center gap-1.5 text-[#144230] font-bold">
            <span className="w-5 h-5 rounded-full bg-[#144230] text-white flex items-center justify-center text-[10px]">2</span>
            <span>NARROW</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <div className="flex items-center gap-1.5 text-[#22C55E] font-bold">
            <span className="w-5 h-5 rounded-full bg-[#22C55E] text-white flex items-center justify-center text-[10px]">3</span>
            <span>PINPOINT</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <div className="flex items-center gap-1.5 text-[#111827] font-bold">
            <span className="w-5 h-5 rounded-full bg-[#E5E7EB] text-[#4B5563] flex items-center justify-center text-[10px]">4</span>
            <span>RESPOND</span>
          </div>
        </div>

        {/* Neural Sub-Model Confidence Gauges */}
        <div className="space-y-2 mb-4 bg-[#F4F5F7] p-4 rounded-2xl border border-[#E5E7EB] text-xs font-mono-tech">
          <span className="text-[9px] uppercase tracking-wider text-[#6B7280] font-bold block mb-1">
            HYDRAULIC SUB-MODEL CONVERGENCE CONFIDENCE
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
            <span>PARETO MITIGATION OPTIMIZATION</span>
          </div>
          <div className="text-[11px] text-[#111827] leading-relaxed pt-1">
            <span className="text-[#144230] font-bold">MINIMIZE: </span>
            <span>0.50·WaterLoss + 0.30·LocalizationError + 0.20·PressureShock</span>
            <br />
            <span className="text-[#92400E] font-bold">CONSTRAINTS: </span>
            <span>DMA Inflow Residual ≤ 1.5%, Acoustic Wave Speed = 1,200 m/s</span>
          </div>
        </div>

        {/* Recommendations List */}
        <div>
          <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#6B7280] font-bold block mb-2">
            REAL-TIME HYDRAULIC MITIGATION RECOMMENDATIONS
          </span>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {alerts.slice(0, 3).map((rec) => {
              const isDeployed = rec.status === 'DEPLOYED';

              return (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#ECEEF2] hover:border-[#D1D5DB] transition-all font-mono-tech text-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border ${
                        rec.severity === 'CRITICAL' ? 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]' :
                        'bg-[#E8F7EE] text-[#144230] border-[#B7E4C7]'
                      }`}>
                        {rec.severity}
                      </span>
                      <span className="font-bold text-[#111827] text-xs">
                        {rec.title}
                      </span>
                    </div>

                    <span className="text-[9px] text-[#144230] font-bold bg-white px-2 py-0.5 rounded-md border border-[#E5E7EB]">
                      {rec.confidenceScore}% CONF
                    </span>
                  </div>

                  <p className="text-[11px] text-[#6B7280] mb-2 leading-relaxed">
                    {rec.rationale}
                  </p>

                  <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#F0F2F5]">
                    <span className="text-[#144230] font-semibold">
                      Mitigation: {rec.estimatedLoss}
                    </span>

                    {!isDeployed ? (
                      <button
                        onClick={() => onDeployRecommendation(rec.id)}
                        className="px-3 py-1 rounded-full bg-[#144230] hover:bg-[#1A543E] text-white font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                      >
                        <span>Execute Isolation</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-[#22C55E] font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Throttled
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
