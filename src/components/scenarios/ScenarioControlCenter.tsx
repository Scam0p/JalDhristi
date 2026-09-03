import React from 'react';
import { ScenarioType } from '../../types/simulation';
import { SCENARIOS } from '../../data/mockData';
import { Activity, TrendingUp, AlertTriangle, Users, Wrench, Zap, Play, CheckCircle2, Droplets } from 'lucide-react';

interface ScenarioControlCenterProps {
  activeScenario: ScenarioType;
  onSelectScenario: (id: ScenarioType) => void;
}

export const ScenarioControlCenter: React.FC<ScenarioControlCenterProps> = ({
  activeScenario,
  onSelectScenario
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp': return TrendingUp;
      case 'AlertTriangle': return AlertTriangle;
      case 'Users': return Users;
      case 'Wrench': return Wrench;
      case 'Zap': return Zap;
      default: return Activity;
    }
  };

  return (
    <div className="donezo-card p-6 select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-[#F0F2F5]">
        <div>
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-[#144230] font-bold block">
            HYDRAULIC CONTINGENCY MATRIX
          </span>
          <h2 className="font-display font-bold text-lg text-[#111827]">
            Operational Scenarios Simulator
          </h2>
        </div>
        <div className="text-xs font-mono-tech text-[#6B7280] bg-[#F4F5F7] px-3 py-1 rounded-full border border-[#E5E7EB]">
          INJECT ANOMALIES TO TEST HYDRAULIC DIGITAL TWIN & PINPOINTING
        </div>
      </div>

      {/* Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SCENARIOS.map((scenario) => {
          const isActive = activeScenario === scenario.id;
          const Icon = getIcon(scenario.iconName);

          return (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario.id)}
              className={`p-5 rounded-2xl text-left transition-all duration-200 relative cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-[#E8F7EE]/70 border-2 border-[#144230] shadow-sm'
                  : 'bg-white hover:bg-[#F9FAFB] border border-[#ECEEF2] hover:border-[#D1D5DB]'
              }`}
            >
              {/* Active Badge */}
              {isActive && (
                <div className="absolute -top-3 right-4 bg-[#144230] text-white font-mono-tech font-bold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#22C55E]" /> ACTIVE SCENARIO
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-[#144230] text-white' : 'bg-[#F4F5F7] text-[#6B7280]'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[8px] font-mono-tech font-bold px-2 py-0.5 rounded-full border uppercase ${
                    scenario.badge === 'CRITICAL LEAK' ? 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]' :
                    scenario.badge === 'HIGH DEMAND' ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]' :
                    scenario.badge === 'ACOUSTIC AUDIT' ? 'bg-[#E8F7EE] text-[#144230] border-[#B7E4C7]' :
                    'bg-[#F4F5F7] text-[#4B5563] border-[#E5E7EB]'
                  }`}>
                    {scenario.badge}
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm md:text-base text-[#111827] mb-1.5">
                  {scenario.title}
                </h3>

                <p className="text-xs text-[#6B7280] font-normal leading-relaxed mb-3 line-clamp-2">
                  {scenario.description}
                </p>
              </div>

              {/* Expected AI Reaction Box */}
              <div className="pt-3 border-t border-[#ECEEF2] text-[10px] font-mono-tech bg-[#F4F5F7] p-3 rounded-xl border border-[#E5E7EB] space-y-1">
                <span className="text-[#144230] font-bold block">
                  JALDRISHTI ADAPTIVE RESPONSE:
                </span>
                <span className="text-[#4B5563] font-normal leading-normal block">
                  {scenario.expectedAIAction}
                </span>
              </div>

              {/* Trigger Button Row */}
              <div className="mt-3 flex items-center justify-end text-[10px] font-mono-tech">
                <span className={`flex items-center gap-1 font-bold ${isActive ? 'text-[#144230]' : 'text-[#6B7280]'}`}>
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isActive ? 'Scenario Loaded' : 'Simulate Scenario'}</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
