import React from 'react';
import { KPISet, CaseType, Train } from '../../types/simulation';
import { ArrowUpRight } from 'lucide-react';

interface KPIRibbonProps {
  kpis: KPISet;
  currentCase: CaseType;
  trains?: Train[];
}

export const KPIRibbon: React.FC<KPIRibbonProps> = ({ kpis, currentCase, trains = [] }) => {
  const activeCount = trains.filter(t => t.status === 'IN_SERVICE' || t.status === 'INDUCTING').length || 6;
  const totalCount = trains.length || 8;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
      {/* 1. PRIMARY HIGHLIGHTED KPI (Dark Forest Green Card from Reference) */}
      <div className="donezo-card-dark p-5 flex flex-col justify-between relative overflow-hidden bg-mesh-dark-green shadow-lg">
        {/* Header: Title & Top-Right Circular Arrow Button */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-white/80 tracking-wide font-display">
            Active In-Service Trains
          </span>
          <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer border border-white/10">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Large Metric Value */}
        <div className="my-1">
          <div className="font-display font-extrabold text-4xl text-white tracking-tight">
            {activeCount} <span className="text-xl font-normal text-white/50">/ {totalCount}</span>
          </div>
        </div>

        {/* Bottom Supporting Badge */}
        <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-mono-tech text-[#34D399] font-medium">
          <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold text-[10px]">
            {currentCase === 'ai' ? '+2 AI' : 'BASE'}
          </span>
          <span>{currentCase === 'ai' ? 'Optimal Headway (04:30)' : 'Timetable Fixed'}</span>
        </div>
      </div>

      {/* 2. SECONDARY KPI: Avg Commuter Wait Time (White Card) */}
      <div className="donezo-card p-5 flex flex-col justify-between hover:border-[#D1D5DB] transition-all">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-[#6B7280] tracking-wide font-display">
            Avg Passenger Wait
          </span>
          <div className="w-8 h-8 rounded-full bg-[#F4F5F7] hover:bg-[#E5E7EB] flex items-center justify-center text-[#111827] transition-colors cursor-pointer border border-[#E5E7EB]">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="my-1">
          <div className="font-display font-extrabold text-4xl text-[#111827] tracking-tight">
            {kpis.avgWaitTimeMin.toFixed(1)} <span className="text-xl font-medium text-[#6B7280]">min</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-[#F0F2F5] flex items-center gap-1.5 text-[11px] font-mono-tech">
          <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
            currentCase === 'ai' ? 'bg-[#E8F7EE] text-[#144230]' : 'bg-[#FEF3C7] text-[#92400E]'
          }`}>
            {currentCase === 'ai' ? '↓ 54%' : currentCase === 'conventional' ? '↓ 29%' : 'BASE'}
          </span>
          <span className="text-[#6B7280]">
            {currentCase === 'ai' ? 'Reduced from baseline' : 'Manual timetable lag'}
          </span>
        </div>
      </div>

      {/* 3. SECONDARY KPI: Fleet Utilization Rate (White Card) */}
      <div className="donezo-card p-5 flex flex-col justify-between hover:border-[#D1D5DB] transition-all">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-[#6B7280] tracking-wide font-display">
            Fleet Utilization Rate
          </span>
          <div className="w-8 h-8 rounded-full bg-[#F4F5F7] hover:bg-[#E5E7EB] flex items-center justify-center text-[#111827] transition-colors cursor-pointer border border-[#E5E7EB]">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="my-1">
          <div className="font-display font-extrabold text-4xl text-[#111827] tracking-tight">
            {kpis.fleetUtilizationPct}<span className="text-2xl font-bold text-[#144230]">%</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-[#F0F2F5] flex items-center gap-1.5 text-[11px] font-mono-tech">
          <span className="px-1.5 py-0.5 rounded bg-[#E8F7EE] text-[#144230] font-bold text-[10px]">
            {currentCase === 'ai' ? '+28%' : '+11%'}
          </span>
          <span className="text-[#6B7280]">Active fleet efficiency</span>
        </div>
      </div>

      {/* 4. SECONDARY KPI: Induction Response Time (White Card) */}
      <div className="donezo-card p-5 flex flex-col justify-between hover:border-[#D1D5DB] transition-all">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-[#6B7280] tracking-wide font-display">
            Induction Response Time
          </span>
          <div className="w-8 h-8 rounded-full bg-[#F4F5F7] hover:bg-[#E5E7EB] flex items-center justify-center text-[#111827] transition-colors cursor-pointer border border-[#E5E7EB]">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="my-1">
          <div className="font-display font-extrabold text-4xl text-[#111827] tracking-tight">
            {kpis.responseTimeMin < 1 ? '< 1' : kpis.responseTimeMin.toFixed(1)} <span className="text-xl font-medium text-[#6B7280]">min</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-[#F0F2F5] flex items-center gap-1.5 text-[11px] font-mono-tech">
          <span className="px-1.5 py-0.5 rounded bg-[#E8F7EE] text-[#144230] font-bold text-[10px]">
            {currentCase === 'ai' ? '42ms' : '7 min'}
          </span>
          <span className="text-[#6B7280]">
            {currentCase === 'ai' ? 'Pareto ML Solver' : 'Rule-based headway'}
          </span>
        </div>
      </div>
    </div>
  );
};
