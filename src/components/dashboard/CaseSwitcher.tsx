import React from 'react';
import { CaseType } from '../../types/simulation';
import { UserCheck, ShieldCheck, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CaseSwitcherProps {
  currentCase: CaseType;
  onSelectCase: (c: CaseType) => void;
  isTransitioning: boolean;
}

export const CaseSwitcher: React.FC<CaseSwitcherProps> = ({
  currentCase,
  onSelectCase,
  isTransitioning
}) => {
  const cases: {
    id: CaseType;
    index: string;
    title: string;
    subtitle: string;
    description: string;
    icon: typeof Cpu;
    wait: string;
    util: string;
    congestion: string;
    response: string;
  }[] = [
    {
      id: 'manual',
      index: '01',
      title: 'MANUAL DISPATCH',
      subtitle: 'STATIC TIMETABLE & OPERATOR LOGS',
      description: 'Train induction decisions rely on static pre-scheduled timetables. Reactive manual phone dispatch creates delayed response to unexpected commuter surges.',
      icon: UserCheck,
      wait: '11.4 MIN',
      util: '63%',
      congestion: 'HIGH',
      response: '12 MIN'
    },
    {
      id: 'conventional',
      index: '02',
      title: 'CONVENTIONAL CONTROL',
      subtitle: 'RULE-BASED FIXED INTERVAL CBTC',
      description: 'Automated headway control operates on rigid fixed intervals. Maintains consistency under normal conditions but lacks adaptive flexibility during disruptions.',
      icon: ShieldCheck,
      wait: '8.1 MIN',
      util: '74%',
      congestion: 'MEDIUM',
      response: '7 MIN'
    },
    {
      id: 'ai',
      index: '03',
      title: 'AI-POWERED INDUCTION',
      subtitle: 'DYNAMIC MULTI-OBJECTIVE PARETO SCHEDULING',
      description: 'Continuously fuses real-time platform CCTV density, fleet health, depot turnout capacity, and energy profiles to automatically induct and reallocate trainsets.',
      icon: Cpu,
      wait: '5.2 MIN',
      util: '91%',
      congestion: 'LOW',
      response: '< 1 MIN'
    }
  ];

  return (
    <div className="w-full gov-panel rounded-2xl p-5 md:p-6 border border-white/10 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-white/10">
        <div>
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-[#38BDF8] font-bold block">
            OPERATIONAL ARCHITECTURES
          </span>
          <h2 className="font-display font-bold text-lg md:text-xl text-white tracking-wide uppercase">
            SELECT TRAIN INDUCTION PARADIGM
          </h2>
        </div>
        <div className="text-xs font-mono-tech text-white/50 bg-[#080C14] px-3 py-1 rounded border border-white/10">
          CHOOSE AN ARCHITECTURE TO RECONFIGURE LIVE SIMULATION
        </div>
      </div>

      {/* 3 Selectable Case Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cases.map((c) => {
          const isSelected = currentCase === c.id;
          const Icon = c.icon;

          return (
            <button
              key={c.id}
              onClick={() => onSelectCase(c.id)}
              className={`text-left p-5 rounded-xl transition-all duration-200 relative cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#131E33] border-2 border-[#38BDF8] shadow-lg scale-[1.01]'
                  : 'bg-[#0B111E] hover:bg-[#0E1626] border border-white/10 hover:border-white/20'
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute -top-3 right-4 bg-[#38BDF8] text-black font-mono-tech font-bold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded shadow flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ACTIVE SYSTEM
                </div>
              )}

              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-impact text-xl text-white/40">
                      {c.index}
                    </span>
                    <h3 className="font-display font-bold text-base md:text-lg text-white uppercase">
                      {c.title}
                    </h3>
                  </div>
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#38BDF8]/20 text-[#38BDF8]' : 'bg-white/5 text-white/40'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-[10px] font-mono-tech text-[#38BDF8] font-semibold tracking-wider uppercase mb-2">
                  {c.subtitle}
                </p>

                <p className="text-xs text-white/70 font-normal leading-relaxed mb-4">
                  {c.description}
                </p>
              </div>

              {/* KPI Metrics Box */}
              <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs font-mono-tech">
                <div className="bg-[#080C14] p-2 rounded border border-white/5">
                  <span className="text-[9px] text-white/40 block">AVG WAIT TIME</span>
                  <span className={`font-bold ${c.id === 'ai' ? 'text-[#22C55E]' : c.id === 'conventional' ? 'text-[#38BDF8]' : 'text-[#F59E0B]'}`}>
                    {c.wait}
                  </span>
                </div>
                <div className="bg-[#080C14] p-2 rounded border border-white/5">
                  <span className="text-[9px] text-white/40 block">UTILIZATION</span>
                  <span className="font-bold text-white">{c.util}</span>
                </div>
                <div className="bg-[#080C14] p-2 rounded border border-white/5">
                  <span className="text-[9px] text-white/40 block">CONGESTION</span>
                  <span className={`font-bold ${c.congestion === 'LOW' ? 'text-[#22C55E]' : c.congestion === 'MEDIUM' ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                    {c.congestion}
                  </span>
                </div>
                <div className="bg-[#080C14] p-2 rounded border border-white/5">
                  <span className="text-[9px] text-white/40 block">RESPONSE</span>
                  <span className="font-bold text-white">{c.response}</span>
                </div>
              </div>

              {/* Action indicator */}
              <div className="mt-3 flex items-center justify-end text-[10px] font-mono-tech text-white/40 gap-1">
                <span>{isSelected ? 'CURRENTLY ACTIVE' : 'SWITCH TO PARADIGM'}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
