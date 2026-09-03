import React from 'react';
import { Search, Bell, ChevronDown, Clock, Menu, Droplets } from 'lucide-react';
import { CaseType } from '../../types/simulation';

interface TopBarProps {
  simTime: string;
  currentCase: CaseType;
  activeTrainsCount: number;
  totalTrainsCount: number;
  onReset: () => void;
  onRunOptimization: () => void;
  isOptimizing: boolean;
  onToggleMobileMenu?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  simTime,
  currentCase,
  onToggleMobileMenu
}) => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-[#ECEEF2] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Left: Mobile Menu Trigger + Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {/* Mobile Hamburger Button */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-[#F4F5F7] hover:bg-[#E5E7EB] text-[#111827] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
            title="Open Menu"
          >
            <Menu className="w-5 h-5 text-[#144230]" />
          </button>
        )}

        {/* Clean Pill Search Bar (Donezo) */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sensor (e.g. PS-01, FS-02), segment S-14..."
            className="w-full pl-9 sm:pl-10 pr-4 sm:pr-12 py-2 rounded-full bg-[#F4F5F7] border border-transparent hover:border-[#E5E7EB] focus:border-[#144230] focus:bg-white focus:outline-none text-xs text-[#111827] placeholder-[#9CA3AF] transition-all font-medium"
          />
          <span className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono-tech text-[#9CA3AF] bg-white px-1.5 py-0.5 rounded border border-[#E5E7EB] shadow-2xs font-semibold">
            ⌘F
          </span>
        </div>
      </div>

      {/* Right Actions & User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Active Simulation Clock Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#F4F5F7] border border-[#E5E7EB] px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-mono-tech">
          <Clock className="w-3.5 h-3.5 text-[#144230]" />
          <span className="font-bold text-[#111827] tracking-wider">{simTime}</span>
          <span className="text-[10px] text-[#6B7280] hidden sm:inline">IST</span>
        </div>

        {/* Operational Mode Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F7EE] text-[#144230] text-xs font-bold font-mono-tech">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="uppercase">
            {currentCase === 'ai' ? 'JalDrishti Hydraulic AI' : currentCase === 'conventional' ? 'Conventional SCADA' : 'Manual Inspection'}
          </span>
        </div>

        {/* Notification Bell */}
        <button
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F4F5F7] hover:bg-[#E5E7EB] border border-[#E5E7EB] flex items-center justify-center text-[#4B5563] hover:text-[#111827] transition-colors relative cursor-pointer flex-shrink-0"
          title="Hydraulic Alerts"
          aria-label="Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 bg-[#EF4444] rounded-full border border-white" />
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-3 sm:border-l border-[#E5E7EB]">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#144230] text-white flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden flex-shrink-0">
            <span className="font-display">JD</span>
          </div>
          <div className="hidden lg:block text-left">
            <div className="font-display font-bold text-xs text-[#111827] leading-none">
              Chief Hydraulic Engineer
            </div>
            <div className="text-[10px] text-[#6B7280] font-mono-tech leading-none mt-1">
              control@jaldrishti.gov.in
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] hidden sm:block" />
        </div>
      </div>
    </header>
  );
};
