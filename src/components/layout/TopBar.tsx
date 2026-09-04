import React from 'react';
import { Search, Bell, ChevronDown, Clock, Menu, Radio, Sliders, AlertTriangle } from 'lucide-react';
import { CaseType } from '../../types/simulation';
import { DashboardMode } from '../../hooks/useSimulation';
import { PipelineEventState } from '../../config/pipelineConfig';

interface TopBarProps {
  simTime: string;
  currentCase: CaseType;
  activeTrainsCount: number;
  totalTrainsCount: number;
  onReset: () => void;
  onRunOptimization: () => void;
  isOptimizing: boolean;
  onToggleMobileMenu?: () => void;
  dashboardMode?: DashboardMode;
  realTimeEventState?: PipelineEventState;
}

export const TopBar: React.FC<TopBarProps> = ({
  simTime,
  currentCase,
  onToggleMobileMenu,
  dashboardMode = 'REAL',
  realTimeEventState
}) => {
  const isReal = dashboardMode === 'REAL';
  const isAlert = realTimeEventState && realTimeEventState.overall_status !== 'NORMAL';
  const isLeak = realTimeEventState && realTimeEventState.overall_status === 'POTENTIAL LEAK';

  return (
    <header className="w-full bg-white border-b border-[#E5E7EB] px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Left: Mobile Menu Trigger + Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {/* Mobile Hamburger Button */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 rounded-md bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] text-[#111827] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
            title="Open Menu"
          >
            <Menu className="w-4 h-4 text-[#144230]" />
          </button>
        )}

        {/* Industrial SCADA Search Input */}
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sensor node (Sensor 1, Sensor 2, Segment S-14)..."
            className="w-full pl-8 pr-12 py-1.5 rounded-md bg-white border border-[#D1D5DB] hover:border-[#9CA3AF] focus:border-[#144230] focus:bg-white focus:outline-none text-xs text-[#111827] placeholder-[#9CA3AF] transition-all font-mono-tech"
          />
          <span className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono-tech text-[#6B7280] bg-[#F9FAFB] px-1 py-0.5 rounded border border-[#E5E7EB] font-semibold">
            /
          </span>
        </div>
      </div>

      {/* Middle/Right: Real-Time Event Status & SCADA Clock */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Telemetry Alert Status Badge */}
        {isReal && realTimeEventState && isAlert && (
          <div className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold font-mono-tech border ${
            isLeak 
              ? 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626] animate-pulse'
              : 'bg-[#FFFBEB] border-[#FDE68A] text-[#D97706]'
          }`}>
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-current" />
            <span className="truncate max-w-[240px]">
              {realTimeEventState.event_message}
            </span>
          </div>
        )}

        {/* SCADA System Runtime Clock */}
        <div className="flex items-center gap-1.5 bg-[#F9FAFB] border border-[#E5E7EB] px-2.5 py-1 rounded-md text-xs font-mono-tech">
          <Clock className="w-3.5 h-3.5 text-[#144230]" />
          <span className="font-bold text-[#111827] tracking-wider">{simTime}</span>
          <span className="text-[10px] text-[#6B7280] hidden sm:inline font-semibold">IST</span>
        </div>

        {/* Alarm Bell Button */}
        <button
          className="w-8 h-8 rounded-md bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center text-[#4B5563] hover:text-[#111827] transition-colors relative cursor-pointer flex-shrink-0"
          title="Hydraulic Alarms"
          aria-label="Alarms"
        >
          <Bell className="w-4 h-4" />
          {isAlert && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full border border-white animate-ping" />
          )}
        </button>

        {/* Operator Profile */}
        <div className="flex items-center gap-2 pl-1 sm:pl-3 sm:border-l border-[#E5E7EB]">
          <div className="w-8 h-8 rounded-md bg-[#144230] text-white flex items-center justify-center font-bold text-xs font-mono-tech shrink-0">
            <span>JD</span>
          </div>
          <div className="hidden xl:block text-left">
            <div className="font-display font-bold text-xs text-[#111827] leading-none">
              Chief Hydraulic Engineer
            </div>
            <div className="text-[10px] text-[#6B7280] font-mono-tech leading-none mt-1">
              bwssb.operations@jaldrishti.gov.in
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] hidden sm:block" />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
