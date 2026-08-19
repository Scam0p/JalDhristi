import React from 'react';
import { KPISet, CaseType } from '../../types/simulation';
import { Clock, Gauge, AlertTriangle, Zap, TrendingUp, Users } from 'lucide-react';

interface KPIRibbonProps {
  kpis: KPISet;
  currentCase: CaseType;
}

export const KPIRibbon: React.FC<KPIRibbonProps> = ({ kpis, currentCase }) => {
  const cards = [
    {
      id: 'wait',
      label: 'AVG PASSENGER WAIT TIME',
      value: `${kpis.avgWaitTimeMin.toFixed(1)} MIN`,
      delta: currentCase === 'ai' ? '↓ 54% vs Manual' : currentCase === 'conventional' ? '↓ 29% vs Manual' : 'BASELINE',
      deltaColor: currentCase === 'ai' ? 'text-[#22C55E]' : currentCase === 'conventional' ? 'text-[#38BDF8]' : 'text-[#F59E0B]',
      icon: Clock
    },
    {
      id: 'util',
      label: 'FLEET UTILIZATION RATE',
      value: `${kpis.fleetUtilizationPct}%`,
      delta: currentCase === 'ai' ? '+28% Fleet Boost' : currentCase === 'conventional' ? '+11% Fleet Boost' : '63% Base',
      deltaColor: currentCase === 'ai' ? 'text-[#22C55E]' : 'text-white/70',
      icon: Gauge
    },
    {
      id: 'congestion',
      label: 'PEAK CONGESTION LEVEL',
      value: kpis.peakCongestion,
      delta: kpis.peakCongestion === 'LOW' ? 'OPTIMAL (3% Delay)' : kpis.peakCongestion === 'MEDIUM' ? 'MODERATE (22% Delay)' : 'OVERCROWDED (48% Delay)',
      deltaColor: kpis.peakCongestion === 'LOW' ? 'text-[#22C55E]' : kpis.peakCongestion === 'MEDIUM' ? 'text-[#F59E0B]' : 'text-[#EF4444]',
      icon: AlertTriangle
    },
    {
      id: 'response',
      label: 'INDUCTION RESPONSE TIME',
      value: `${kpis.responseTimeMin < 1 ? '< 1 MIN' : `${kpis.responseTimeMin.toFixed(1)} MIN`}`,
      delta: currentCase === 'ai' ? '42ms ML Solve' : currentCase === 'conventional' ? '7 min lag' : '12 min lag',
      deltaColor: currentCase === 'ai' ? 'text-[#38BDF8]' : 'text-white/50',
      icon: Zap
    },
    {
      id: 'headway',
      label: 'HEADWAY CONSISTENCY',
      value: `${kpis.headwayConsistencyPct}%`,
      delta: 'Target: 04:30 min',
      deltaColor: 'text-[#38BDF8]',
      icon: TrendingUp
    },
    {
      id: 'pax',
      label: 'HOURLY COMMUTER VOLUME',
      value: kpis.paxServedTotal.toLocaleString(),
      delta: '+4,200 pax throughput',
      deltaColor: 'text-[#22C55E]',
      icon: Users
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 w-full">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="gov-panel p-4 rounded-xl border border-white/10 flex flex-col justify-between hover:border-white/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-mono-tech uppercase tracking-wider text-white/50 font-bold">
                {card.label}
              </span>
              <Icon className="w-4 h-4 text-white/40" />
            </div>

            <div>
              <span className="font-display font-black text-2xl md:text-3xl text-white tracking-tight block">
                {card.value}
              </span>
              <span className={`text-[10px] font-mono-tech font-bold ${card.deltaColor} block mt-1`}>
                {card.delta}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
