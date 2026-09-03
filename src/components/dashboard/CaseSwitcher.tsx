import React from 'react';
import { CaseType } from '../../types/simulation';
import { UserCheck, ShieldCheck, Droplets, CheckCircle2, ArrowRight } from 'lucide-react';

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
    icon: typeof Droplets;
    loss: string;
    accuracy: string;
    response: string;
    health: string;
  }[] = [
    {
      id: 'manual',
      index: '01',
      title: 'Manual Inspection',
      subtitle: 'Walk-the-Line Acoustic Patrols',
      description: 'Pipeline leak detection relies on periodic ground patrols, acoustic listening sticks, and customer complaints. Reactive response results in massive unmetered water losses and delayed repairs.',
      icon: UserCheck,
      loss: '84.5 m³/h',
      accuracy: '±450m',
      response: '4.5 hours',
      health: '62%'
    },
    {
      id: 'conventional',
      index: '02',
      title: 'Conventional SCADA',
      subtitle: 'Static Threshold Flow & Pressure Alarms',
      description: 'Supervisory control triggers alarms based on rigid high/low flow thresholds. Cannot pinpoint exact leak positions along long spans and produces frequent false alarms during normal peak consumption surges.',
      icon: ShieldCheck,
      loss: '38.2 m³/h',
      accuracy: '±120m',
      response: '40 min',
      health: '79%'
    },
    {
      id: 'ai',
      index: '03',
      title: 'JalDrishti Hydraulic Intelligence',
      subtitle: 'Digital Twin & Acoustic Pinpointing',
      description: 'Continuous 4-stage pipeline intelligence (Detect → Narrow → Pinpoint → Respond). Uses sparse sensors to detect flow residuals, hydraulic digital twin to isolate probable segments, and targeted acoustic cross-correlation to pinpoint leaks within ±1.2m.',
      icon: Droplets,
      loss: '2.4 m³/h',
      accuracy: '±1.2m',
      response: '< 45 sec',
      health: '98%'
    }
  ];

  return (
    <div className="donezo-card p-6 select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-[#F0F2F5]">
        <div>
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-[#144230] font-bold block">
            OPERATIONAL ARCHITECTURES
          </span>
          <h2 className="font-display font-bold text-lg text-[#111827]">
            Select Water Intelligence Operational Paradigm
          </h2>
        </div>
        <div className="text-xs font-mono-tech text-[#6B7280] bg-[#F4F5F7] px-3 py-1 rounded-full border border-[#E5E7EB]">
          SWITCH PARADIGM TO RECONFIGURE LIVE HYDRAULIC NETWORK
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
                  <CheckCircle2 className="w-3 h-3 text-[#22C55E]" /> ACTIVE PARADIGM
                </div>
              )}

              <div>
                {/* Card Top: Index & Icon */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono-tech font-extrabold text-2xl text-[#144230]/40">
                    {c.index}
                  </span>
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#144230] text-white' : 'bg-[#F4F5F7] text-[#6B7280]'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-display font-bold text-base text-[#111827] mb-0.5">
                  {c.title}
                </h3>
                <span className="text-[11px] font-mono-tech text-[#144230] font-semibold block mb-2">
                  {c.subtitle}
                </span>

                <p className="text-xs text-[#6B7280] leading-relaxed mb-4 line-clamp-3">
                  {c.description}
                </p>
              </div>

              {/* Bottom Metrics Snapshot */}
              <div className="pt-3 border-t border-[#ECEEF2] grid grid-cols-2 gap-2 text-xs font-mono-tech">
                <div className="p-2 rounded-xl bg-[#F4F5F7] border border-[#E5E7EB]">
                  <span className="text-[9px] text-[#9CA3AF] uppercase block">WATER LOSS</span>
                  <span className="font-bold text-[#111827] text-xs">{c.loss}</span>
                </div>

                <div className="p-2 rounded-xl bg-[#F4F5F7] border border-[#E5E7EB]">
                  <span className="text-[9px] text-[#9CA3AF] uppercase block">ACCURACY</span>
                  <span className="font-bold text-[#144230] text-xs">{c.accuracy}</span>
                </div>

                <div className="p-2 rounded-xl bg-[#F4F5F7] border border-[#E5E7EB]">
                  <span className="text-[9px] text-[#9CA3AF] uppercase block">RESPONSE</span>
                  <span className="font-bold text-[#111827] text-xs">{c.response}</span>
                </div>

                <div className="p-2 rounded-xl bg-[#F4F5F7] border border-[#E5E7EB]">
                  <span className="text-[9px] text-[#9CA3AF] uppercase block">HEALTH</span>
                  <span className="font-bold text-[#22C55E] text-xs">{c.health}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
