import React from 'react';
import { LeakAlert } from '../../types/simulation';
import { AlertTriangle, Check, Zap, Bell, ShieldCheck, Radio } from 'lucide-react';
import { PipelineEventState } from '../../config/pipelineConfig';
import { DashboardMode } from '../../hooks/useSimulation';

interface RemindersCardProps {
  recommendations: LeakAlert[];
  onDeployRecommendation: (id: string) => void;
  onRunOptimization: () => void;
  isOptimizing: boolean;
  dashboardMode?: DashboardMode;
  realTimeEventState?: PipelineEventState;
}

export const RemindersCard: React.FC<RemindersCardProps> = ({
  recommendations: alerts,
  onDeployRecommendation,
  onRunOptimization,
  isOptimizing,
  dashboardMode = 'REAL',
  realTimeEventState
}) => {
  const isRealMode = dashboardMode === 'REAL';
  const isRealAlert = isRealMode && realTimeEventState && realTimeEventState.overall_status !== 'NORMAL';

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
              {isRealMode ? 'Real-Time Event & Mitigation' : 'Priority Leak Alerts & Mitigations'}
            </span>
          </div>
          <span className={`text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded-full ${
            isRealAlert 
              ? 'text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA]' 
              : 'text-[#144230] bg-[#E8F7EE]'
          }`}>
            {isRealMode 
              ? (isRealAlert ? 'EVENT ACTIVE' : 'ALL NOMINAL') 
              : `${alerts.filter(r => r.status === 'PENDING').length} ACTIVE`}
          </span>
        </div>

        {/* Priority Action Content */}
        {isRealAlert && realTimeEventState ? (
          <div className="my-2 p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] animate-pulse">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-2 py-0.5 rounded-md font-mono-tech font-bold text-[10px] ${
                realTimeEventState.overall_status === 'POTENTIAL LEAK' ? 'bg-[#EF4444] text-white' : 'bg-[#F59E0B] text-white'
              }`}>
                {realTimeEventState.overall_status}
              </span>
              <h4 className="font-display font-bold text-xs md:text-sm text-[#991B1B] leading-snug">
                {realTimeEventState.event_message}
              </h4>
            </div>

            <p className="text-xs text-[#7F1D1D] my-1.5 leading-relaxed">
              Physical accelerometer reading {realTimeEventState.vibration.toFixed(3)} m/s² exceeds stationary baseline threshold.
            </p>

            <div className="text-[11px] font-mono-tech text-[#991B1B] font-semibold mt-2">
              Vibration: {realTimeEventState.vibration.toFixed(3)} m/s² • Position: {realTimeEventState.sensor_position_cm ? `${realTimeEventState.sensor_position_cm} cm` : 'Dual'}
            </div>

            <div className="text-[10px] font-mono-tech text-[#991B1B] mt-2 bg-white/80 p-2 rounded-xl border border-[#FECACA]">
              <span className="font-bold">Recommendation: </span>
              Inspect pipeline segment near {realTimeEventState.sensor_position_cm ? `${realTimeEventState.sensor_position_cm} cm` : 'active sensor'} for turbulence, high pressure drop, or mechanical leak.
            </div>
          </div>
        ) : isRealMode ? (
          <div className="my-3 p-3 rounded-2xl bg-[#E8F7EE]/50 border border-[#B7E4C7] text-xs">
            <div className="flex items-center gap-2 text-[#144230] font-bold mb-1">
              <Radio className="w-4 h-4 text-[#22C55E]" />
              <span>Real Mode: Pipeline Nominal</span>
            </div>
            <p className="text-[#047857] text-[11px] leading-relaxed">
              Sensor 1 (50 cm) and Sensor 2 (90 cm) are operating within normal baseline vibration limits (&lt; 0.18 m/s²). No anomalies detected on physical pipeline rig.
            </p>
          </div>
        ) : pendingAlert ? (
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

      {/* Action Button */}
      <div className="mt-4 pt-3 border-t border-[#F0F2F5]">
        {isRealAlert ? (
          <button
            onClick={onRunOptimization}
            disabled={isOptimizing}
            className="w-full py-2.5 rounded-full bg-[#144230] hover:bg-[#1A543E] text-white font-display font-bold text-xs tracking-wide transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
            <span>{isOptimizing ? 'Analyzing Physical Acoustics...' : 'Run Acoustic Pinpointing'}</span>
          </button>
        ) : pendingAlert && !isDeployed ? (
          <button
            onClick={() => onDeployRecommendation(pendingAlert.id)}
            className="w-full py-2.5 rounded-full bg-[#144230] hover:bg-[#1A543E] text-white font-display font-bold text-xs tracking-wide transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <Zap className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Execute Mitigation (Throttle V-04)</span>
          </button>
        ) : (
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#144230] font-semibold py-1 font-mono-tech">
            <Check className="w-4 h-4 text-[#22C55E]" />
            <span>All mitigations deployed</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemindersCard;
