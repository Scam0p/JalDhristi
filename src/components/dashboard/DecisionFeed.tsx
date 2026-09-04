import React from 'react';
import { HydraulicEventLog } from '../../types/simulation';
import { Terminal } from 'lucide-react';

interface DecisionFeedProps {
  logs: HydraulicEventLog[];
}

export const DecisionFeed: React.FC<DecisionFeedProps> = ({ logs }) => {
  const getSeverityBadge = (type: HydraulicEventLog['type'], title: string = '') => {
    const upperTitle = title.toUpperCase();
    if (upperTitle.includes('BURST') || upperTitle.includes('CRITICAL')) {
      return {
        label: 'CRITICAL',
        style: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
      };
    }
    switch (type) {
      case 'WARNING':
      case 'ANOMALY':
        return {
          label: 'WARNING',
          style: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
        };
      case 'DEPLOYMENT':
        return {
          label: 'ACTION',
          style: 'bg-[#E8F7EE] text-[#144230] border-[#B7E4C7]'
        };
      case 'OPTIMIZATION':
        return {
          label: 'NORMAL',
          style: 'bg-[#E8F7EE] text-[#144230] border-[#B7E4C7]'
        };
      case 'CONSTRAINT':
        return {
          label: 'INFO',
          style: 'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]'
        };
      default:
        return {
          label: 'INFO',
          style: 'bg-[#F4F5F7] text-[#4B5563] border-[#E5E7EB]'
        };
    }
  };

  const getSourceDisplay = (log: HydraulicEventLog) => {
    if (log.sensorId) {
      return log.sensorId.toUpperCase();
    }
    if (log.segmentId) {
      return log.segmentId.replace('S_03_', 'ZONE-').replace('S_0', 'SEG-');
    }
    return 'SYSTEM';
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 flex flex-col h-full select-none shadow-none">
      {/* SCADA Register Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-[#F4F5F7] border border-[#E5E7EB] text-[#144230]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-mono-tech font-bold text-xs uppercase tracking-wider text-[#111827]">
              EVENT &amp; ALARM REGISTER
            </h3>
            <span className="text-[10px] font-mono-tech text-[#6B7280]">
              FIFO CHRONOLOGICAL SEQUENCE • AUDIT TRAIL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-[#144230] bg-[#F4F5F7] px-2.5 py-1 rounded border border-[#E5E7EB] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
          <span>REGISTER ONLINE • 1Hz</span>
        </div>
      </div>

      {/* Industrial Register Table */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden border border-[#E5E7EB] rounded">
        {/* Table Column Headers */}
        <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-3 py-2 grid grid-cols-12 gap-2 text-[10px] font-mono-tech font-bold text-[#6B7280] uppercase tracking-wider">
          <div className="col-span-2">TIME</div>
          <div className="col-span-6">EVENT / ACTION</div>
          <div className="col-span-2 text-center">SOURCE</div>
          <div className="col-span-2 text-right">SEVERITY</div>
        </div>

        {/* Table Body - Expanded to reclaim vertical space naturally */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#F3F4F6] font-mono-tech text-xs max-h-[440px]">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#9CA3AF] font-mono-tech">
              NO ALARM EVENTS IN ACTIVE BUFFER
            </div>
          ) : (
            logs.map((log) => {
              const severity = getSeverityBadge(log.type, log.title);
              const source = getSourceDisplay(log);

              return (
                <div
                  key={log.id}
                  className="px-3 py-2.5 grid grid-cols-12 gap-2 items-center hover:bg-[#F9FAFB] transition-colors"
                >
                  {/* Timestamp */}
                  <div className="col-span-2 text-[11px] text-[#4B5563] font-mono-tech whitespace-nowrap">
                    {log.time}
                  </div>

                  {/* Event & Description */}
                  <div className="col-span-6 min-w-0 pr-2">
                    <div className="text-[11px] font-bold text-[#111827] truncate">
                      {log.title}
                    </div>
                    {log.detail && (
                      <div className="text-[10px] text-[#6B7280] truncate mt-0.5">
                        {log.detail}
                      </div>
                    )}
                  </div>

                  {/* Source Identifier */}
                  <div className="col-span-2 text-center">
                    <span className="text-[10px] font-mono-tech font-bold text-[#374151] bg-[#F3F4F6] border border-[#E5E7EB] px-1.5 py-0.5 rounded">
                      {source}
                    </span>
                  </div>

                  {/* Severity Pill */}
                  <div className="col-span-2 text-right">
                    <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${severity.style}`}>
                      {severity.label}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Register Footer */}
        <div className="bg-[#F9FAFB] border-t border-[#E5E7EB] px-3 py-1.5 flex items-center justify-between text-[10px] font-mono-tech text-[#6B7280]">
          <span>TOTAL LOGGED EVENTS: {logs.length}</span>
          <span>BUFFER DEPTH: 100 RECORDS</span>
        </div>
      </div>
    </div>
  );
};

export default DecisionFeed;
