import React, { useState } from 'react';
import { CaseType } from '../../types/simulation';
import { BarChart3, Award } from 'lucide-react';

interface PerformanceComparisonProps {
  currentCase: CaseType;
}

export const PerformanceComparison: React.FC<PerformanceComparisonProps> = ({ currentCase }) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);

  const comparisonMetrics = [
    {
      name: 'Leak Localization Precision Radius',
      unit: 'Radial distance uncertainty on flagged pipe span',
      manual: '±450 meters',
      conventional: '±120 meters',
      ai: '±1.2 meters',
      improvement: '99% precision boost'
    },
    {
      name: 'Anomaly Detection & Response Latency',
      unit: 'Time from initial hydraulic anomaly to pinpoint action',
      manual: '4.5 hours',
      conventional: '40 minutes',
      ai: '< 45 seconds',
      improvement: '50× faster mitigation'
    },
    {
      name: 'Non-Revenue Water (NRW) Loss Reduction',
      unit: 'Volume of treated drinking water preserved',
      manual: '14.0% (Baseline)',
      conventional: '38.0%',
      ai: '74.2%',
      improvement: '+36.2% water saved'
    },
    {
      name: 'False Positive Alarm Rejection Rate',
      unit: 'Distinguishing legitimate demand surges from leaks',
      manual: '42.0%',
      conventional: '76.0%',
      ai: '98.8%',
      improvement: 'Zero false alarms'
    },
    {
      name: 'Acoustic Coherence SNR (Signal-to-Noise)',
      unit: 'Cross-correlation peak sharpness under ambient noise',
      manual: '12 dB',
      conventional: '18 dB',
      ai: '34 dB (GCC-PHAT)',
      improvement: '+16 dB clarity'
    },
    {
      name: 'Inspection Crew Dispatch Overhead',
      unit: 'Physical excavation & ground verification time',
      manual: '100% (Baseline)',
      conventional: '62.0%',
      ai: '18.4%',
      improvement: '81.6% cost reduction'
    }
  ];

  const scenarioBenchmarks = [
    {
      name: 'MAINLINE BURST ON SEGMENT S-14 (08:42 AM)',
      manual: { loss: '84.5 m³/h', accuracy: '±450m', response: '4.5 hrs', contained: '18%' },
      conventional: { loss: '38.2 m³/h', accuracy: '±120m', response: '40 min', contained: '44%' },
      ai: { loss: '2.4 m³/h', accuracy: '±1.2m', response: '< 45s', contained: '98%' },
      gain: '74.2% Water Preserved • Instant Pinpointing at 38.4m'
    },
    {
      name: 'NIGHT MINIMUM FLOW (MNF) ACOUSTIC SCAN (03:00 AM)',
      manual: { loss: '32.0 m³/h', accuracy: '±300m', response: '6.0 hrs', contained: '22%' },
      conventional: { loss: '16.5 m³/h', accuracy: '±90m', response: '1.2 hrs', contained: '52%' },
      ai: { loss: '0.8 m³/h', accuracy: '±0.8m', response: '< 30s', contained: '99%' },
      gain: 'Deep Acoustic Cross-Correlation • Pinhole Leaks Detected'
    },
    {
      name: 'PEAK DIURNAL DEMAND SURGE IN CBD (09:00 AM)',
      manual: { loss: 'False Alarms', accuracy: 'Ambiguous', response: '2.0 hrs', contained: 'N/A' },
      conventional: { loss: 'High Alarms', accuracy: '±200m', response: '25 min', contained: '60%' },
      ai: { loss: '1.1 m³/h', accuracy: 'Zero False Alarms', response: '< 15s', contained: '100%' },
      gain: 'Digital Twin Head Loss Compensation • High Stability'
    }
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 space-y-5 select-none shadow-none">
      {/* SCADA Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-[#F4F5F7] border border-[#E5E7EB] text-[#144230]">
            <BarChart3 className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div>
            <h2 className="font-mono-tech font-bold text-xs md:text-sm uppercase tracking-wider text-[#111827]">
              OPERATIONAL BENCHMARK MATRIX
            </h2>
            <p className="text-[11px] font-mono-tech text-[#6B7280]">
              Quantitative comparison across 3 pipeline monitoring paradigms
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-[#F4F5F7] text-[#144230] font-bold text-xs border border-[#E5E7EB] flex items-center gap-1.5 font-mono-tech">
            <Award className="w-3.5 h-3.5 text-[#22C55E]" /> SCADA BENCHMARK MATRIX
          </span>
        </div>
      </div>

      {/* Primary Metrics Comparison Table */}
      <div className="overflow-x-auto border border-[#E5E7EB] rounded">
        <table className="w-full text-left border-collapse text-xs font-mono-tech">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280]">
              <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">
                HYDRAULIC PARAMETER
              </th>
              <th className="py-2.5 px-3 font-bold text-center text-[10px] uppercase">
                MANUAL PATROL
              </th>
              <th className="py-2.5 px-3 font-bold text-center text-[10px] uppercase">
                CONVENTIONAL SCADA
              </th>
              <th className="py-2.5 px-3 font-bold text-center text-[#144230] bg-[#E8F7EE]/60 text-[10px] uppercase">
                JALDRISHTI SCADA
              </th>
              <th className="py-2.5 px-3 font-bold text-right text-[#144230] text-[10px] uppercase">
                VARIANCE / DELTA
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {comparisonMetrics.map((m, idx) => (
              <tr key={idx} className="hover:bg-[#F9FAFB] transition-colors">
                <td className="py-2.5 px-3 font-medium text-[#111827]">
                  <div className="font-bold text-xs">{m.name}</div>
                  <div className="text-[10px] text-[#6B7280]">{m.unit}</div>
                </td>
                <td className="py-2.5 px-3 text-center text-[#6B7280]">
                  {m.manual}
                </td>
                <td className="py-2.5 px-3 text-center text-[#4B5563] font-semibold">
                  {m.conventional}
                </td>
                <td className="py-2.5 px-3 text-center text-[#144230] font-bold bg-[#E8F7EE]/40 text-xs">
                  {m.ai}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="px-1.5 py-0.5 rounded bg-[#E8F7EE] text-[#144230] font-bold text-[10px] border border-[#B7E4C7]">
                    {m.improvement}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scenario Benchmark Case Cards */}
      <div className="pt-1">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#E5E7EB]">
          <span className="text-xs font-mono-tech font-bold text-[#111827] uppercase tracking-wider">
            STRESS-TEST BENCHMARK SCENARIOS
          </span>
          <div className="flex items-center gap-1 font-mono-tech">
            {scenarioBenchmarks.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedScenarioIndex(i)}
                className={`w-6 h-6 rounded text-xs font-bold transition-colors cursor-pointer border ${
                  selectedScenarioIndex === i 
                    ? 'bg-[#144230] text-white border-[#0F3224]' 
                    : 'bg-[#F4F5F7] text-[#6B7280] border-[#E5E7EB] hover:bg-[#E5E7EB]'
                }`}
              >
                0{i + 1}
              </button>
            ))}
          </div>
        </div>

        {(() => {
          const s = scenarioBenchmarks[selectedScenarioIndex];
          return (
            <div className="p-3.5 rounded bg-[#F9FAFB] border border-[#E5E7EB] space-y-2.5 font-mono-tech text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E7EB] pb-2">
                <span className="font-bold text-xs text-[#111827]">
                  {s.name}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#E8F7EE] text-[#144230] font-bold text-[10px] border border-[#B7E4C7]">
                  {s.gain}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-0.5">
                <div className="p-2.5 rounded bg-white border border-[#E5E7EB]">
                  <span className="text-[9px] text-[#6B7280] uppercase block font-bold mb-1">MANUAL PATROL</span>
                  <div className="text-xs text-[#4B5563]">LOSS: {s.manual.loss}</div>
                  <div className="text-xs text-[#4B5563]">ACCURACY: {s.manual.accuracy}</div>
                  <div className="text-xs text-[#4B5563]">RESPONSE: {s.manual.response}</div>
                </div>

                <div className="p-2.5 rounded bg-white border border-[#E5E7EB]">
                  <span className="text-[9px] text-[#6B7280] uppercase block font-bold mb-1">CONVENTIONAL SCADA</span>
                  <div className="text-xs text-[#4B5563]">LOSS: {s.conventional.loss}</div>
                  <div className="text-xs text-[#4B5563]">ACCURACY: {s.conventional.accuracy}</div>
                  <div className="text-xs text-[#4B5563]">RESPONSE: {s.conventional.response}</div>
                </div>

                <div className="p-2.5 rounded bg-[#E8F7EE] border border-[#B7E4C7]">
                  <span className="text-[9px] text-[#144230] uppercase block font-bold mb-1">JALDRISHTI SCADA</span>
                  <div className="text-xs text-[#144230] font-bold">LOSS: {s.ai.loss}</div>
                  <div className="text-xs text-[#144230] font-bold">ACCURACY: {s.ai.accuracy}</div>
                  <div className="text-xs text-[#144230] font-bold">RESPONSE: {s.ai.response}</div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default PerformanceComparison;
