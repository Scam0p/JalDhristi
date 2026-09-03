import React from 'react';
import { KPISet, CaseType, SensorNode } from '../../types/simulation';
import { ArrowUpRight, Droplets, Gauge, Activity, Clock } from 'lucide-react';

interface KPIRibbonProps {
  kpis: KPISet;
  currentCase: CaseType;
  trains?: SensorNode[];
}

export const KPIRibbon: React.FC<KPIRibbonProps> = ({ kpis, currentCase, trains = [] }) => {
  const activeSensorsCount = trains.filter(t => t.status === 'NORMAL' || t.status === 'WARNING').length || 7;
  const totalSensorsCount = trains.length || 8;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full select-none">
      {/* 1. PRIMARY HIGHLIGHTED KPI (Dark Forest Green Card from Donezo Reference) */}
      <div className="donezo-card-dark p-5 flex flex-col justify-between relative overflow-hidden bg-mesh-dark-green shadow-lg">
        {/* Header: Title & Top-Right Circular Arrow Button */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-white/80 tracking-wide font-display">
            Active Monitored Sensors
          </span>
          <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer border border-white/10">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Large Metric Value */}
        <div className="my-1">
          <div className="font-display font-extrabold text-4xl text-white tracking-tight">
            {activeSensorsCount} <span className="text-xl font-normal text-white/50">/ {totalSensorsCount} Nodes</span>
          </div>
        </div>

        {/* Bottom Supporting Badge */}
        <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-mono-tech text-[#34D399] font-medium">
          <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold text-[10px]">
            {currentCase === 'ai' ? 'HEALTH 98%' : currentCase === 'conventional' ? 'HEALTH 79%' : 'HEALTH 62%'}
          </span>
          <span>{currentCase === 'ai' ? 'LoRaWAN + NB-IoT Online' : 'Periodic Intermittent'}</span>
        </div>
      </div>

      {/* 2. SECONDARY KPI: Estimated Water Loss (White Card) */}
      <div className="donezo-card p-5 flex flex-col justify-between hover:border-[#D1D5DB] transition-all">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-[#6B7280] tracking-wide font-display">
            Estimated Water Loss Rate
          </span>
          <div className="w-8 h-8 rounded-full bg-[#F4F5F7] hover:bg-[#E5E7EB] flex items-center justify-center text-[#111827] transition-colors cursor-pointer border border-[#E5E7EB]">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="my-1">
          <div className="font-display font-extrabold text-4xl text-[#111827] tracking-tight">
            {kpis.estimatedWaterLossM3h.toFixed(1)} <span className="text-xl font-medium text-[#6B7280]">m³/h</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-[#F0F2F5] flex items-center gap-1.5 text-[11px] font-mono-tech">
          <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
            currentCase === 'ai' ? 'bg-[#E8F7EE] text-[#144230]' : 'bg-[#FEF3C7] text-[#92400E]'
          }`}>
            {currentCase === 'ai' ? '↓ 74% Loss' : currentCase === 'conventional' ? '↓ 38% Loss' : 'BASELINE'}
          </span>
          <span className="text-[#6B7280]">
            {currentCase === 'ai' ? 'Rapid containment' : 'Unmitigated network leakage'}
          </span>
        </div>
      </div>

      {/* 3. SECONDARY KPI: Acoustic Pinpoint Confidence (White Card) */}
      <div className="donezo-card p-5 flex flex-col justify-between hover:border-[#D1D5DB] transition-all">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-[#6B7280] tracking-wide font-display">
            Acoustic Pinpoint Confidence
          </span>
          <div className="w-8 h-8 rounded-full bg-[#F4F5F7] hover:bg-[#E5E7EB] flex items-center justify-center text-[#111827] transition-colors cursor-pointer border border-[#E5E7EB]">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="my-1">
          <div className="font-display font-extrabold text-4xl text-[#111827] tracking-tight">
            {currentCase === 'ai' ? '97.4%' : currentCase === 'conventional' ? '68.0%' : '34.0%'}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-[#F0F2F5] flex items-center gap-1.5 text-[11px] font-mono-tech">
          <span className="px-1.5 py-0.5 rounded bg-[#E8F7EE] text-[#144230] font-bold text-[10px]">
            ±{kpis.leakLocalizationAccuracyM}m
          </span>
          <span className="text-[#6B7280]">Targeted localization error</span>
        </div>
      </div>

      {/* 4. SECONDARY KPI: Anomaly Response Latency (White Card) */}
      <div className="donezo-card p-5 flex flex-col justify-between hover:border-[#D1D5DB] transition-all">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-[#6B7280] tracking-wide font-display">
            Detection & Response Latency
          </span>
          <div className="w-8 h-8 rounded-full bg-[#F4F5F7] hover:bg-[#E5E7EB] flex items-center justify-center text-[#111827] transition-colors cursor-pointer border border-[#E5E7EB]">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        <div className="my-1">
          <div className="font-display font-extrabold text-4xl text-[#111827] tracking-tight">
            {currentCase === 'ai' ? '< 45s' : currentCase === 'conventional' ? '40m' : '4.5h'}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-[#F0F2F5] flex items-center gap-1.5 text-[11px] font-mono-tech">
          <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
            currentCase === 'ai' ? 'bg-[#E8F7EE] text-[#144230]' : 'bg-[#F4F5F7] text-[#4B5563]'
          }`}>
            {currentCase === 'ai' ? 'AUTOMATED' : 'MANUAL DISPATCH'}
          </span>
          <span className="text-[#6B7280]">
            {currentCase === 'ai' ? 'Digital twin instant trigger' : 'Delayed crew dispatch'}
          </span>
        </div>
      </div>
    </div>
  );
};
