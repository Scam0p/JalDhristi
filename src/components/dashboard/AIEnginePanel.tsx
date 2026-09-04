import React from 'react';
import { LeakAlert, CaseType } from '../../types/simulation';
import { Cpu, Check, ArrowRight, Layers, Droplets } from 'lucide-react';

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
    { name: 'HYDRAULIC DIGITAL TWIN (EPANET)', confidence: 96, color: '#144230' },
    { name: 'SPARSE SENSOR MASS-FLOW BALANCE', confidence: 98, color: '#22C55E' },
    { name: 'ACOUSTIC CROSS-CORRELATION (GCC-PHAT)', confidence: 94, color: '#22C55E' },
    { name: 'HIGH-FREQUENCY TRANSIENT ANALYZER', confidence: 99, color: '#144230' }
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 flex flex-col justify-between h-full select-none shadow-none space-y-4">
      <div>
        {/* SCADA Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#F4F5F7] border border-[#E5E7EB] text-[#144230]">
              <Droplets className="w-4 h-4 text-[#22C55E]" />
            </div>
            <div>
              <h3 className="font-mono-tech font-bold text-xs uppercase tracking-wider text-[#111827]">
                HYDRAULIC SOLVER &amp; DIGITAL TWIN
              </h3>
              <span className="text-[10px] font-mono-tech text-[#6B7280]">
                JALDRISHTI-CAUVERY-SOLVER v3.1 • SECTOR Z-07
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F4F5F7] border border-[#E5E7EB] text-[#144230] text-[10px] font-mono-tech font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span>SOLVER ONLINE</span>
          </div>
        </div>

        {/* 4-Stage Operational Pipeline Stepper */}
        <div className="mb-3 p-2.5 bg-[#F9FAFB] rounded border border-[#E5E7EB] flex items-center justify-between text-xs font-mono-tech">
          <div className="flex items-center gap-1.5 text-[#144230] font-bold">
            <span className="w-4 h-4 rounded bg-[#144230] text-white flex items-center justify-center text-[10px]">1</span>
            <span>DETECT</span>
          </div>
          <ArrowRight className="w-3 h-3 text-[#9CA3AF]" />
          <div className="flex items-center gap-1.5 text-[#144230] font-bold">
            <span className="w-4 h-4 rounded bg-[#144230] text-white flex items-center justify-center text-[10px]">2</span>
            <span>NARROW</span>
          </div>
          <ArrowRight className="w-3 h-3 text-[#9CA3AF]" />
          <div className="flex items-center gap-1.5 text-[#15803D] font-bold">
            <span className="w-4 h-4 rounded bg-[#22C55E] text-white flex items-center justify-center text-[10px]">3</span>
            <span>PINPOINT</span>
          </div>
          <ArrowRight className="w-3 h-3 text-[#9CA3AF]" />
          <div className="flex items-center gap-1.5 text-[#4B5563] font-bold">
            <span className="w-4 h-4 rounded bg-[#E5E7EB] text-[#374151] flex items-center justify-center text-[10px]">4</span>
            <span>RESPOND</span>
          </div>
        </div>

        {/* Sub-Model Convergence Confidence Bars */}
        <div className="space-y-2 mb-3 bg-[#F9FAFB] p-3 rounded border border-[#E5E7EB] text-xs font-mono-tech">
          <span className="text-[9px] uppercase tracking-wider text-[#6B7280] font-bold block mb-1">
            SUB-MODEL CONVERGENCE STATUS
          </span>
          {models.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#374151]">
                <span className="font-medium">{m.name}</span>
                <span className="font-bold text-[#111827]">{m.confidence}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#E5E7EB] rounded-none overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${m.confidence}%`,
                    backgroundColor: m.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Technical Constraints Formulation */}
        <div className="p-3 rounded bg-white border border-[#E5E7EB] mb-3 text-xs font-mono-tech space-y-1">
          <div className="flex items-center gap-1.5 text-[#144230] font-bold text-[10px]">
            <Layers className="w-3.5 h-3.5" />
            <span>PARETO MITIGATION CRITERIA</span>
          </div>
          <div className="text-[10px] text-[#374151] leading-relaxed pt-0.5">
            <span className="text-[#144230] font-bold">MINIMIZE: </span>
            <span>0.50·WaterLoss + 0.30·LocalizationError + 0.20·PressureShock</span>
            <br />
            <span className="text-[#92400E] font-bold">CONSTRAINTS: </span>
            <span>DMA Residual ≤ 1.5% • Wave Speed = 1,200 m/s</span>
          </div>
        </div>

        {/* Recommendations List */}
        <div>
          <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#6B7280] font-bold block mb-2">
            PENDING HYDRAULIC MITIGATION ACTIONS
          </span>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {alerts.slice(0, 3).map((rec) => {
              const isDeployed = rec.status === 'DEPLOYED';

              return (
                <div
                  key={rec.id}
                  className="p-3 rounded bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#D1D5DB] transition-colors font-mono-tech text-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                        rec.severity === 'CRITICAL' ? 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]' :
                        'bg-[#E8F7EE] text-[#144230] border-[#B7E4C7]'
                      }`}>
                        {rec.severity}
                      </span>
                      <span className="font-bold text-[#111827] text-xs">
                        {rec.title}
                      </span>
                    </div>

                    <span className="text-[9px] text-[#144230] font-bold bg-white px-1.5 py-0.5 rounded border border-[#E5E7EB]">
                      {rec.confidenceScore}% CONF
                    </span>
                  </div>

                  <p className="text-[10px] text-[#6B7280] mb-2 leading-relaxed">
                    {rec.rationale}
                  </p>

                  <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#E5E7EB]">
                    <span className="text-[#144230] font-semibold">
                      MITIGATION: {rec.estimatedLoss}
                    </span>

                    {!isDeployed ? (
                      <button
                        onClick={() => onDeployRecommendation(rec.id)}
                        className="px-2.5 py-1 rounded bg-[#144230] hover:bg-[#1A543E] text-white font-bold transition-colors cursor-pointer flex items-center gap-1 border border-[#0F3224]"
                      >
                        <span>EXECUTE ISOLATION</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-[#15803D] font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> THROTTLED
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

export default AIEnginePanel;
