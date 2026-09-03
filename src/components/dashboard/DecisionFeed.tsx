import React from 'react';
import { HydraulicEventLog } from '../../types/simulation';
import { Terminal, AlertCircle, CheckCircle, Zap, Cpu, Bell, Droplets } from 'lucide-react';

interface DecisionFeedProps {
  logs: HydraulicEventLog[];
}

export const DecisionFeed: React.FC<DecisionFeedProps> = ({ logs }) => {
  const getBadgeStyle = (type: HydraulicEventLog['type']) => {
    switch (type) {
      case 'ANOMALY':
        return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
      case 'WARNING':
        return 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]';
      case 'DEPLOYMENT':
        return 'bg-[#E8F7EE] text-[#144230] border-[#B7E4C7]';
      case 'OPTIMIZATION':
        return 'bg-[#E8F7EE] text-[#144230] border-[#B7E4C7]';
      case 'CONSTRAINT':
        return 'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]';
      default:
        return 'bg-[#F4F5F7] text-[#4B5563] border-[#E5E7EB]';
    }
  };

  const getIcon = (type: HydraulicEventLog['type']) => {
    switch (type) {
      case 'ANOMALY':
      case 'WARNING':
        return AlertCircle;
      case 'DEPLOYMENT':
        return CheckCircle;
      case 'OPTIMIZATION':
        return Droplets;
      case 'CONSTRAINT':
        return Zap;
      default:
        return Bell;
    }
  };

  return (
    <div className="donezo-card p-6 flex flex-col h-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F0F2F5]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#F4F5F7] text-[#144230]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm md:text-base text-[#111827]">
              Hydraulic Event & Telemetry Stream
            </h3>
            <span className="text-[9px] font-mono-tech text-[#6B7280]">
              REAL-TIME NETWORK AUDIT LOG
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[9px] font-mono-tech text-[#144230] bg-[#E8F7EE] px-2.5 py-1 rounded-full font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          <span>LIVE TELEMETRY</span>
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
              className="p-3 rounded-2xl bg-[#F9FAFB] border border-[#ECEEF2] hover:border-[#D1D5DB] transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 truncate">
                  <Icon className="w-3.5 h-3.5 text-[#6B7280] flex-shrink-0" />
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border ${badgeClass}`}>
                    {log.type}
                  </span>
                  <span className="font-bold text-[#111827] text-[11px] truncate">
                    {log.title}
                  </span>
                </div>
                <span className="text-[9px] text-[#9CA3AF] whitespace-nowrap">
                  {log.time}
                </span>
              </div>

              <p className="text-[10px] text-[#6B7280] font-normal leading-relaxed pl-4 border-l border-[#E5E7EB] mt-1">
                {log.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
