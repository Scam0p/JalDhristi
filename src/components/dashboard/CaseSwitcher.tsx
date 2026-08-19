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
      title: 'Manual Dispatch',
      subtitle: 'Static Timetable & Phone Logs',
      description: 'Train induction decisions rely on static pre-scheduled timetables. Reactive manual phone dispatch creates delayed response to unexpected commuter surges.',
      icon: UserCheck,
      wait: '11.4 min',
      util: '63%',
      congestion: 'HIGH',
      response: '12 min'
    },
    {
      id: 'conventional',
      index: '02',
      title: 'Conventional Control',
      subtitle: 'Rule-Based Fixed Interval CBTC',
      description: 'Automated headway control operates on rigid fixed intervals. Maintains consistency under normal conditions but lacks adaptive flexibility during disruptions.',
      icon: ShieldCheck,
      wait: '8.1 min',
      util: '74%',
      congestion: 'MEDIUM',
      response: '7 min'
    },
    {
      id: 'ai',
      index: '03',
      title: 'AI Train Induction',
      subtitle: 'Dynamic Pareto-Optimal Engine',
      description: 'Continuously fuses real-time platform CCTV density, fleet health, depot turnout capacity, and energy profiles to automatically induct and reallocate trainsets.',
      icon: Cpu,
      wait: '5.2 min',
      util: '91%',
      congestion: 'LOW',
      response: '< 1 min'
    }
  ];

  return (
    <div className="donezo-card p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-[#F0F2F5]">
        <div>
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-[#144230] font-bold block">
            OPERATIONAL ARCHITECTURES
          </span>
          <h2 className="font-display font-bold text-lg text-[#111827]">
            Select Train Induction Paradigm
          </h2>
        </div>
        <div className="text-xs font-mono-tech text-[#6B7280] bg-[#F4F5F7] px-3 py-1 rounded-full border border-[#E5E7EB]">
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
              className={`text-left p-5 rounded-2xl transition-all duration-200 relative cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#E8F7EE]/70 border-2 border-[#144230] shadow-sm'
                  : 'bg-white hover:bg-[#F9FAFB] border border-[#ECEEF2] hover:border-[#D1D5DB]'
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute -top-3 right-4 bg-[#144230] text-white font-mono-tech font-bold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#22C55E]" /> ACTIVE SYSTEM
                </div>
              )}

              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech font-bold text-lg text-[#9CA3AF]">
                      {c.index}
                    </span>
                    <h3 className="font-display font-bold text-base text-[#111827]">
                      {c.title}
                    </h3>
                  </div>
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#144230] text-white' : 'bg-[#F4F5F7] text-[#6B7280]'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-[10px] font-mono-tech text-[#144230] font-semibold tracking-wide uppercase mb-2">
                  {c.subtitle}
                </p>

                <p className="text-xs text-[#6B7280] font-normal leading-relaxed mb-4 line-clamp-3">
                  {c.description}
                </p>
              </div>

              {/* KPI Metrics Box */}
              <div className="pt-3 border-t border-[#ECEEF2] grid grid-cols-2 gap-2 text-xs font-mono-tech">
                <div className="bg-[#F4F5F7] p-2 rounded-xl border border-[#E5E7EB]">
                  <span className="text-[9px] text-[#6B7280] block">AVG WAIT TIME</span>
                  <span className={`font-bold ${c.id === 'ai' ? 'text-[#144230]' : 'text-[#111827]'}`}>
                    {c.wait}
                  </span>
                </div>
                <div className="bg-[#F4F5F7] p-2 rounded-xl border border-[#E5E7EB]">
                  <span className="text-[9px] text-[#6B7280] block">UTILIZATION</span>
                  <span className="font-bold text-[#111827]">{c.util}</span>
                </div>
                <div className="bg-[#F4F5F7] p-2 rounded-xl border border-[#E5E7EB]">
                  <span className="text-[9px] text-[#6B7280] block">CONGESTION</span>
                  <span className={`font-bold ${c.congestion === 'LOW' ? 'text-[#22C55E]' : c.congestion === 'MEDIUM' ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                    {c.congestion}
                  </span>
                </div>
                <div className="bg-[#F4F5F7] p-2 rounded-xl border border-[#E5E7EB]">
                  <span className="text-[9px] text-[#6B7280] block">RESPONSE</span>
                  <span className="font-bold text-[#111827]">{c.response}</span>
                </div>
              </div>

              {/* Action indicator */}
              <div className="mt-3 flex items-center justify-end text-[10px] font-mono-tech text-[#6B7280] gap-1">
                <span>{isSelected ? 'CURRENTLY ACTIVE' : 'SWITCH TO PARADIGM'}</span>
                <ArrowRight className="w-3 h-3 text-[#144230]" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
