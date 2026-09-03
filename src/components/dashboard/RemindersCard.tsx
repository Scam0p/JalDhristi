import React from 'react';
import { LeakAlert } from '../../types/simulation';
import { AlertTriangle, Check, Zap, Bell, ShieldCheck } from 'lucide-react';

interface RemindersCardProps {
  recommendations: LeakAlert[];
  onDeployRecommendation: (id: string) => void;
  onRunOptimization: () => void;
  isOptimizing: boolean;
}

export const RemindersCard: React.FC<RemindersCardProps> = ({
  recommendations: alerts,
  onDeployRecommendation,
  onRunOptimization,
  isOptimizing
}) => {
  // Get latest pending leak alert or latest overall
  const pendingAlert = alerts.find(r => r.status === 'PENDING') || alerts[0];
  const isDeployed = pendingAlert?.status === 'DEPLOYED';

  return (
    <div className="donezo-card p-5 flex flex-col justify-between h-full select-none">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#6B7280] tracking-wide font-display">
              Priority Leak Alerts & Mitigations
            </span>
          </div>
          <span className="text-[10px] font-mono-tech font-bold text-[#144230] bg-[#E8F7EE] px-2 py-0.5 rounded-full">
            {alerts.filter(r => r.status === 'PENDING').length} ACTIVE
          </span>
        </div>

        {/* Priority Action Content (Matching Donezo reference layout) */}
        {pendingAlert ? (
          <div className="my-2">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-2 py-0.5 rounded-md font-mono-tech font-bold text-[10px] ${
                pendingAlert.severity === 'CRITICAL' ? 'bg-[#EF4444] text-white' : 'bg-[#144230] text-white'
              }`}>
                {pendingAlert.severity}
              </span>
              <h4 className="font-display font-bold text-sm md:text-base text-[#111827] leading-snug">
                {pendingAlert.title}
              </h4>
            </div>

            <p className="text-xs text-[#6B7280] line-clamp-2 my-1.5 leading-relaxed">
              {pendingAlert.rationale}
            </p>

            <div className="text-[11px] font-mono-tech text-[#144230] font-semibold mt-2">
              Loss: {pendingAlert.estimatedLoss} • Conf: {pendingAlert.confidenceScore}%
            </div>

            <div className="text-[10px] font-mono-tech text-[#6B7280] mt-1 bg-[#F4F5F7] p-2 rounded-xl border border-[#E5E7EB]">
              <span className="text-[#144230] font-bold">Action: </span>
              {pendingAlert.recommendedAction}
            </div>
          </div>
        ) : (
          <div className="my-4 text-center text-xs text-[#9CA3AF]">
            All network sectors operating nominally. No uncontained leaks.
          </div>
        )}
      </div>

      {/* Action Button (Pill shaped solid dark green button) */}
      <div className="mt-4 pt-3 border-t border-[#F0F2F5]">
        {pendingAlert && !isDeployed ? (
          <button
            onClick={() => onDeployRecommendation(pendingAlert.id)}
            className="w-full py-2.5 px-4 rounded-full bg-[#144230] hover:bg-[#1A543E] text-white font-display font-bold text-xs tracking-wide transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-[#22C55E]" />
            <span>Execute Mitigation & Valve Isolation</span>
          </button>
        ) : (
          <div className="w-full py-2 px-4 rounded-full bg-[#E8F7EE] text-[#144230] font-display font-bold text-xs flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4 text-[#22C55E]" />
            <span>Valve Throttled • Surge Suppressed</span>
          </div>
        )}
      </div>
    </div>
  );
};
