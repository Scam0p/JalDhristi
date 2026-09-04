import React from 'react';
import { LeakAlert } from '../../types/simulation';
import { ShieldCheck, Check, Zap, Radio, AlertTriangle } from 'lucide-react';
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
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 flex flex-col justify-between h-full select-none shadow-none">
      <div>
        {/* SCADA Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E7EB]">
          <div>
            <span className="text-xs font-mono-tech font-bold uppercase tracking-wider text-[#111827] block">
              {isRealMode ? 'REAL-TIME MITIGATION DIRECTIVE' : 'PRIORITY ALARMS & MITIGATIONS'}
            </span>
            <span className="text-[10px] font-mono-tech text-[#6B7280]">
              AUTOMATED HYDRAULIC CONTROL &amp; DISPATCH
            </span>
          </div>
          <span className={`text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded border ${
            isRealAlert 
              ? 'text-[#DC2626] bg-[#FEF2F2] border-[#FECACA] animate-pulse' 
              : 'text-[#144230] bg-[#F4F5F7] border-[#E5E7EB]'
          }`}>
            {isRealMode 
              ? (isRealAlert ? 'ALARM ACTIVE' : 'NOMINAL') 
              : `${alerts.filter(r => r.status === 'PENDING').length} ACTIVE`}
          </span>
        </div>

        {/* Priority Directive Body */}
        {isRealAlert && realTimeEventState ? (
          <div className="my-2 p-3.5 rounded-md bg-[#FEF2F2] border border-[#FECACA]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-1.5 py-0.5 rounded font-mono-tech font-bold text-[10px] uppercase ${
                realTimeEventState.overall_status === 'POTENTIAL LEAK' ? 'bg-[#EF4444] text-white' : 'bg-[#F59E0B] text-white'
              }`}>
                {realTimeEventState.overall_status}
              </span>
              <h4 className="font-mono-tech font-bold text-xs text-[#991B1B] leading-snug">
                {realTimeEventState.event_message}
              </h4>
            </div>

            <p className="text-xs text-[#7F1D1D] my-1.5 leading-relaxed font-mono-tech">
              Accelerometer reading {realTimeEventState.vibration.toFixed(3)} m/s² exceeds stationary threshold.
            </p>

            <div className="text-[11px] font-mono-tech text-[#991B1B] font-semibold mt-2">
              VIBRATION: {realTimeEventState.vibration.toFixed(3)} m/s² • POSITION: {realTimeEventState.sensor_position_cm ? `${realTimeEventState.sensor_position_cm}.0 cm` : 'DUAL'}
            </div>

            <div className="text-[10px] font-mono-tech text-[#991B1B] mt-2 bg-white/90 p-2.5 rounded border border-[#FECACA]">
              <span className="font-bold uppercase">Directive: </span>
              Inspect pipeline segment near {realTimeEventState.sensor_position_cm ? `${realTimeEventState.sensor_position_cm}.0 cm` : 'active sensor'} for turbulence, high pressure drop, or mechanical leak.
            </div>
          </div>
        ) : isRealMode ? (
          <div className="my-2 p-3.5 rounded-md bg-[#F9FAFB] border border-[#E5E7EB] text-xs font-mono-tech">
            <div className="flex items-center gap-2 text-[#144230] font-bold mb-1">
              <Radio className="w-3.5 h-3.5 text-[#22C55E]" />
              <span className="uppercase text-[11px]">REAL MODE: PIPELINE NOMINAL</span>
            </div>
            <p className="text-[#4B5563] text-[11px] leading-relaxed">
              Sensor 1 (50 cm) and Sensor 2 (90 cm) are operating within normal baseline limits (&lt; 0.18 m/s²). No hydraulic anomalies detected on physical test rig.
            </p>
          </div>
        ) : pendingAlert ? (
          <div className="my-2 p-3.5 rounded-md bg-[#F9FAFB] border border-[#E5E7EB] font-mono-tech">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-1.5 py-0.5 rounded font-mono-tech font-bold text-[10px] uppercase ${
                pendingAlert.severity === 'CRITICAL' ? 'bg-[#EF4444] text-white' : 'bg-[#144230] text-white'
              }`}>
                {pendingAlert.severity}
              </span>
              <h4 className="font-bold text-xs text-[#111827] leading-snug">
                {pendingAlert.title}
              </h4>
            </div>

            <p className="text-xs text-[#6B7280] line-clamp-2 my-1.5 leading-relaxed">
              {pendingAlert.rationale}
            </p>

            <div className="text-[11px] text-[#144230] font-semibold mt-2">
              EST. LOSS: {pendingAlert.estimatedLoss} • CONFIDENCE: {pendingAlert.confidenceScore}%
            </div>

            <div className="text-[10px] text-[#4B5563] mt-2 bg-white p-2.5 rounded border border-[#E5E7EB]">
              <span className="text-[#144230] font-bold uppercase">Directive: </span>
              {pendingAlert.recommendedAction}
            </div>
          </div>
        ) : (
          <div className="my-4 text-center text-xs font-mono-tech text-[#9CA3AF]">
            ALL SECTORS NOMINAL • ZERO UNCONTAINED LEAKS
          </div>
        )}
      </div>

      {/* Industrial Action Button */}
      <div className="mt-4 pt-3 border-t border-[#E5E7EB]">
        {isRealAlert ? (
          <button
            onClick={onRunOptimization}
            disabled={isOptimizing}
            className="w-full py-2 px-3 rounded-md bg-[#144230] hover:bg-[#1A543E] text-white font-mono-tech font-bold text-xs tracking-wider uppercase transition-colors border border-[#0F3224] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
            <span>{isOptimizing ? 'ANALYZING ACOUSTICS...' : 'EXECUTE ACOUSTIC PINPOINTING'}</span>
          </button>
        ) : pendingAlert && !isDeployed ? (
          <button
            onClick={() => onDeployRecommendation(pendingAlert.id)}
            className="w-full py-2 px-3 rounded-md bg-[#144230] hover:bg-[#1A543E] text-white font-mono-tech font-bold text-xs tracking-wider uppercase transition-colors border border-[#0F3224] cursor-pointer flex items-center justify-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>EXECUTE MITIGATION (THROTTLE V-04)</span>
          </button>
        ) : (
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#144230] font-bold py-1 font-mono-tech bg-[#F4F5F7] rounded border border-[#E5E7EB]">
            <Check className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>ALL MITIGATION DIRECTIVES EXECUTED</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemindersCard;
