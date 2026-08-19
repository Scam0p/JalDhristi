import React from 'react';
import { ScenarioType, ScenarioDefinition } from '../../types/simulation';
import { SCENARIOS } from '../../data/mockData';
import { Activity, TrendingUp, AlertTriangle, Users, Wrench, Zap, Play, CheckCircle2 } from 'lucide-react';

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
    <div className="gov-panel rounded-2xl p-5 md:p-6 border border-white/10 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-white/10">
        <div>
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-[#38BDF8] font-bold block">
            STRESS-TEST CONTINGENCY MATRIX
          </span>
          <h2 className="font-display font-bold text-lg md:text-xl text-white tracking-wide uppercase">
            OPERATIONAL SCENARIOS SIMULATOR
          </h2>
        </div>
        <div className="text-xs font-mono-tech text-white/50 bg-[#080C14] px-3 py-1 rounded border border-white/10">
          INJECT REAL-TIME ANOMALIES TO DEMONSTRATE AI ADAPTIVE SCHEDULING
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
              className={`p-5 rounded-xl text-left transition-all duration-200 relative cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-[#131E33] border-2 border-[#E30613] shadow-md scale-[1.01]'
                  : 'bg-[#0B111E] hover:bg-[#0E1626] border border-white/10 hover:border-white/20'
              }`}
            >
              {/* Active Badge */}
              {isActive && (
                <div className="absolute -top-3 right-4 bg-[#E30613] text-white font-mono-tech font-bold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded shadow flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ACTIVE SCENARIO
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-[#E30613]/20 text-[#EF4444]' : 'bg-white/5 text-white/50'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[8px] font-mono-tech font-bold px-2 py-0.5 rounded border uppercase ${
                    scenario.badge === 'CRITICAL EVENT' ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40' :
                    scenario.badge === 'HIGH DEMAND' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40' :
                    'bg-white/10 text-white/60 border-white/20'
                  }`}>
                    {scenario.badge}
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm md:text-base text-white uppercase tracking-tight mb-1.5">
                  {scenario.title}
                </h3>

                <p className="text-xs text-white/70 font-normal leading-relaxed mb-3">
                  {scenario.description}
                </p>
              </div>

              {/* Expected AI Reaction Box */}
              <div className="pt-3 border-t border-white/10 text-[10px] font-mono-tech bg-[#080C14] p-3 rounded-lg border border-white/5 space-y-1">
                <span className="text-[#38BDF8] font-bold block">
                  AI ADAPTIVE REACTION:
                </span>
                <span className="text-white/80 font-normal leading-normal block">
                  {scenario.expectedAIAction}
                </span>
              </div>

              {/* Trigger Button Row */}
              <div className="mt-3 flex items-center justify-end text-[10px] font-mono-tech">
                <span className={`flex items-center gap-1 font-bold ${isActive ? 'text-[#22C55E]' : 'text-white/40'}`}>
                  {isActive ? 'CURRENTLY SIMULATING' : 'TRIGGER SCENARIO'} <Play className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
