import React from 'react';
import { AIRecommendation } from '../../types/simulation';
import { Sparkles, Check, ArrowRight, Zap, Bell } from 'lucide-react';

interface RemindersCardProps {
  recommendations: AIRecommendation[];
  onDeployRecommendation: (id: string) => void;
  onRunOptimization: () => void;
  isOptimizing: boolean;
}

export const RemindersCard: React.FC<RemindersCardProps> = ({
  recommendations,
  onDeployRecommendation,
  onRunOptimization,
  isOptimizing
}) => {
  // Get latest pending recommendation or latest overall
  const pendingRec = recommendations.find(r => r.status === 'PENDING') || recommendations[0];
  const isDeployed = pendingRec?.status === 'DEPLOYED';

  return (
    <div className="donezo-card p-5 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#6B7280] tracking-wide font-display">
              Priority Actions & Induction Alerts
            </span>
          </div>
          <span className="text-[10px] font-mono-tech font-bold text-[#144230] bg-[#E8F7EE] px-2 py-0.5 rounded-full">
            {recommendations.filter(r => r.status === 'PENDING').length} PENDING
          </span>
        </div>

        {/* Priority Action Content (Matching reference 'Meeting with Arc Company') */}
        {pendingRec ? (
          <div className="my-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-[#144230] text-white font-mono-tech font-bold text-[10px]">
                {pendingRec.trainId}
              </span>
              <h4 className="font-display font-bold text-base text-[#111827] leading-snug">
                {pendingRec.title}
              </h4>
            </div>

            <p className="text-xs text-[#6B7280] line-clamp-2 my-1.5 leading-relaxed">
              {pendingRec.rationale}
            </p>

            <div className="text-[11px] font-mono-tech text-[#144230] font-semibold mt-2">
              Time : {pendingRec.timestamp} • Impact: {pendingRec.expectedWaitReduction}
            </div>
          </div>
        ) : (
          <div className="my-4 text-center text-xs text-[#9CA3AF]">
            All induction schedules optimal. No pending actions.
          </div>
        )}
      </div>

      {/* Action Button (Pill shaped solid dark green button like reference 'Start Meeting') */}
      <div className="mt-4 pt-3 border-t border-[#F0F2F5]">
        {pendingRec && !isDeployed ? (
          <button
            onClick={() => onDeployRecommendation(pendingRec.id)}
            className="w-full py-2.5 px-4 rounded-full bg-[#144230] hover:bg-[#1A543E] text-white font-display font-bold text-xs tracking-wide transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Execute Train Induction</span>
          </button>
        ) : (
          <div className="w-full py-2 px-4 rounded-full bg-[#E8F7EE] text-[#144230] font-display font-bold text-xs flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4 text-[#22C55E]" />
            <span>Induction Executed & In Service</span>
          </div>
        )}
      </div>
    </div>
  );
};
