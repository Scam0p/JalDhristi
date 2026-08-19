import React from 'react';
import { AIEventLog } from '../../types/simulation';
import { Terminal, AlertCircle, CheckCircle, Zap, Cpu, Bell } from 'lucide-react';

interface DecisionFeedProps {
  logs: AIEventLog[];
}

export const DecisionFeed: React.FC<DecisionFeedProps> = ({ logs }) => {
  const getBadgeStyle = (type: AIEventLog['type']) => {
    switch (type) {
      case 'ANOMALY':
        return 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40';
      case 'WARNING':
        return 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40';
      case 'DEPLOYMENT':
        return 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/40';
      case 'OPTIMIZATION':
        return 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40';
      case 'CONSTRAINT':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  const getIcon = (type: AIEventLog['type']) => {
    switch (type) {
      case 'ANOMALY':
      case 'WARNING':
        return AlertCircle;
      case 'DEPLOYMENT':
        return CheckCircle;
      case 'OPTIMIZATION':
        return Cpu;
      case 'CONSTRAINT':
        return Zap;
      default:
        return Bell;
    }
  };

  return (
    <div className="gov-panel rounded-2xl p-5 md:p-6 border border-white/10 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#0E1626] border border-white/10 text-[#38BDF8]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm md:text-base text-white uppercase tracking-wide">
              EVENT & TELEMETRY STREAM
            </h3>
            <span className="text-[9px] font-mono-tech text-white/40">
              REAL-TIME AUDIT LOG
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[9px] font-mono-tech text-[#22C55E] bg-[#080C14] px-2.5 py-1 rounded border border-white/10 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
          <span>LIVE STREAM</span>
        </div>
      </div>

      {/* Stream List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[380px] pr-1 font-mono-tech text-xs">
        {logs.map((log) => {
          const Icon = getIcon(log.type);
          const badgeClass = getBadgeStyle(log.type);

          return (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-[#080C14] border border-white/5 hover:border-white/15 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-white/40" />
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${badgeClass}`}>
                    {log.type}
                  </span>
                  <span className="font-bold text-white text-[11px] truncate">
                    {log.title}
                  </span>
                </div>
                <span className="text-[9px] text-white/40 whitespace-nowrap">
                  {log.time}
                </span>
              </div>

              <p className="text-[10px] text-white/65 font-normal leading-relaxed pl-4 border-l border-white/10 mt-1">
                {log.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
