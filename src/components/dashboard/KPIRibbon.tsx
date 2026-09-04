import React from 'react';
import { KPISet, CaseType, SensorNode } from '../../types/simulation';

interface KPIRibbonProps {
  kpis: KPISet;
  currentCase: CaseType;
  trains?: SensorNode[];
}

export const KPIRibbon: React.FC<KPIRibbonProps> = ({ kpis, currentCase, trains = [] }) => {
  const activeSensorsCount = trains.filter(t => t.status === 'NORMAL' || t.status === 'WARNING').length || 7;
  const totalSensorsCount = trains.length || 8;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 w-full select-none">
      {/* 1. Monitored Nodes Instrumentation Panel */}
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono-tech font-bold text-[#6B7280] uppercase tracking-wider">
            MONITORED SENSOR NODES
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-[#144230] bg-[#F3F4F6] px-1.5 py-0.5 rounded border border-[#E5E7EB]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span className="font-semibold">ONLINE</span>
          </div>
        </div>

        <div className="my-1 flex items-baseline gap-2">
          <span className="font-mono-tech font-bold text-3xl text-[#111827]">
            {activeSensorsCount}
          </span>
          <span className="text-xs font-mono-tech text-[#6B7280]">
            / {totalSensorsCount} NODES ACTIVE
          </span>
        </div>

        <div className="mt-2 pt-2 border-t border-[#F0F2F5] flex items-center justify-between text-[11px] font-mono-tech text-[#4B5563]">
          <span>NETWORK BUS</span>
          <span className="font-bold text-[#144230]">
            {currentCase === 'ai' ? 'HEALTH 98.2%' : 'HEALTH 79.0%'}
          </span>
        </div>
      </div>

      {/* 2. Water Loss Rate Panel */}
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono-tech font-bold text-[#6B7280] uppercase tracking-wider">
            ESTIMATED LOSS RATE
          </span>
          <span className="text-[10px] font-mono-tech text-[#374151] bg-[#F3F4F6] px-1.5 py-0.5 rounded border border-[#E5E7EB] font-semibold">
            DMA BALANCE
          </span>
        </div>

        <div className="my-1 flex items-baseline gap-2">
          <span className="font-mono-tech font-bold text-3xl text-[#111827]">
            {kpis.estimatedWaterLossM3h.toFixed(1)}
          </span>
          <span className="text-xs font-mono-tech text-[#6B7280]">
            m³/h VOLUME
          </span>
        </div>

        <div className="mt-2 pt-2 border-t border-[#F0F2F5] flex items-center justify-between text-[11px] font-mono-tech text-[#4B5563]">
          <span>CONTAINMENT</span>
          <span className="font-bold text-[#144230]">
            {currentCase === 'ai' ? '↓ 74% MITIGATED' : 'BASELINE'}
          </span>
        </div>
      </div>

      {/* 3. Acoustic Pinpoint Accuracy Panel */}
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono-tech font-bold text-[#6B7280] uppercase tracking-wider">
            LOCALIZATION ACCURACY
          </span>
          <span className="text-[10px] font-mono-tech text-[#374151] bg-[#F3F4F6] px-1.5 py-0.5 rounded border border-[#E5E7EB] font-semibold">
            GCC-PHAT
          </span>
        </div>

        <div className="my-1 flex items-baseline gap-2">
          <span className="font-mono-tech font-bold text-3xl text-[#111827]">
            {currentCase === 'ai' ? '97.4%' : currentCase === 'conventional' ? '68.0%' : '34.0%'}
          </span>
          <span className="text-xs font-mono-tech text-[#6B7280]">
            CONFIDENCE
          </span>
        </div>

        <div className="mt-2 pt-2 border-t border-[#F0F2F5] flex items-center justify-between text-[11px] font-mono-tech text-[#4B5563]">
          <span>ERROR BOUNDS</span>
          <span className="font-bold text-[#144230]">
            ±{kpis.leakLocalizationAccuracyM} METERS
          </span>
        </div>
      </div>

      {/* 4. Response Latency Panel */}
      <div className="p-4 bg-white border border-[#E5E7EB] rounded-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono-tech font-bold text-[#6B7280] uppercase tracking-wider">
            DETECTION LATENCY
          </span>
          <span className="text-[10px] font-mono-tech text-[#374151] bg-[#F3F4F6] px-1.5 py-0.5 rounded border border-[#E5E7EB] font-semibold">
            REAL-TIME
          </span>
        </div>

        <div className="my-1 flex items-baseline gap-2">
          <span className="font-mono-tech font-bold text-3xl text-[#111827]">
            {currentCase === 'ai' ? '< 45s' : currentCase === 'conventional' ? '40m' : '4.5h'}
          </span>
          <span className="text-xs font-mono-tech text-[#6B7280]">
            RESPONSE
          </span>
        </div>

        <div className="mt-2 pt-2 border-t border-[#F0F2F5] flex items-center justify-between text-[11px] font-mono-tech text-[#4B5563]">
          <span>DISPATCH</span>
          <span className="font-bold text-[#144230]">
            {currentCase === 'ai' ? 'AUTOMATED TRIGGER' : 'MANUAL DISPATCH'}
          </span>
        </div>
      </div>
    </div>
  );
};
