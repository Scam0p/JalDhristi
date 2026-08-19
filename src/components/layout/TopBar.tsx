import React from 'react';
import { Search, Bell, Mail, ChevronDown, Clock, ShieldCheck } from 'lucide-react';
import { CaseType } from '../../types/simulation';

interface TopBarProps {
  simTime: string;
  currentCase: CaseType;
  activeTrainsCount: number;
  totalTrainsCount: number;
  onReset: () => void;
  onRunOptimization: () => void;
  isOptimizing: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  simTime,
  currentCase,
  activeTrainsCount,
  totalTrainsCount,
  onReset,
  onRunOptimization,
  isOptimizing
}) => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-[#ECEEF2] px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Left: Clean Pill Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search train, station, or route..."
            className="w-full pl-10 pr-12 py-2 rounded-full bg-[#F4F5F7] border border-transparent hover:border-[#E5E7EB] focus:border-[#144230] focus:bg-white focus:outline-none text-xs text-[#111827] placeholder-[#9CA3AF] transition-all font-medium"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono-tech text-[#9CA3AF] bg-white px-1.5 py-0.5 rounded border border-[#E5E7EB] shadow-2xs font-semibold">
            ⌘F
          </span>
        </div>
      </div>

      {/* Right Actions & User Profile */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Active Simulation Clock Pill */}
        <div className="hidden sm:flex items-center gap-2 bg-[#F4F5F7] border border-[#E5E7EB] px-3 py-1.5 rounded-full text-xs font-mono-tech">
          <Clock className="w-3.5 h-3.5 text-[#144230]" />
          <span className="font-bold text-[#111827] tracking-wider">{simTime}</span>
          <span className="text-[10px] text-[#6B7280]">IST</span>
        </div>

        {/* Operational Mode Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F7EE] text-[#144230] text-xs font-bold font-mono-tech">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="uppercase">
            {currentCase === 'ai' ? 'AI Dynamic Induction' : currentCase === 'conventional' ? 'Conventional CBTC' : 'Manual Dispatch'}
          </span>
        </div>

        {/* Notification Bell with alert indicator */}
        <button
          className="w-9 h-9 rounded-full bg-[#F4F5F7] hover:bg-[#E5E7EB] border border-[#E5E7EB] flex items-center justify-center text-[#4B5563] hover:text-[#111827] transition-colors relative cursor-pointer"
          title="Operational Alerts"
          aria-label="Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full border border-white" />
        </button>

        {/* User Profile Pill (Inspired directly by Donezo reference) */}
        <div className="flex items-center gap-3 pl-2 sm:pl-3 sm:border-l border-[#E5E7EB]">
          <div className="w-9 h-9 rounded-full bg-[#144230] text-white flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden">
            <span className="font-display">KC</span>
          </div>
          <div className="hidden lg:block text-left">
            <div className="font-display font-bold text-xs text-[#111827] leading-none">
              KMRL Chief Controller
            </div>
            <div className="text-[10px] text-[#6B7280] font-mono-tech leading-none mt-1">
              operations@kmrl.co.in
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] hidden sm:block" />
        </div>
      </div>
    </header>
  );
};
