import React from 'react';
import { Activity, RefreshCw, Cpu, ShieldAlert, Sparkles } from 'lucide-react';
import { CaseType } from '../../types/simulation';

interface TopStatusBarProps {
  simTime: string;
  currentCase: CaseType;
  activeTrainsCount: number;
  totalTrainsCount: number;
  onReset: () => void;
  onRunOptimization: () => void;
  isOptimizing: boolean;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({
  simTime,
  currentCase,
  activeTrainsCount,
  totalTrainsCount,
  onReset,
  onRunOptimization,
  isOptimizing
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#080C14]/95 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3 flex items-center justify-between text-xs font-mono-tech select-none">
      {/* Left: Authority & System Brand */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 bg-black flex-shrink-0">
            <img
              src="/powerhouse_logo.jpeg"
              alt="Powerhouse"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black tracking-wider text-sm md:text-base text-white">
                KMRL <span className="text-[#38BDF8] font-normal">| AI OPERATIONS CENTRE</span>
              </span>
              <span className="hidden sm:inline-block text-[9px] font-mono-tech px-2 py-0.5 rounded bg-[#E30613] text-white font-bold">
                SIH 2026
              </span>
            </div>
            <span className="text-[10px] text-white/50 hidden md:block">
              AI-Driven Train Induction Planning & Scheduling Simulation Suite
            </span>
          </div>
        </div>

        {/* Operational Case Indicator (Clean Pill) */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded bg-[#0E1626] border border-white/10 text-[11px] uppercase font-bold tracking-wider">
          <span className="text-white/40">MODE:</span>
          {currentCase === 'ai' ? (
            <span className="text-[#22C55E] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#22C55E]" /> AI DYNAMIC INDUCTION
            </span>
          ) : currentCase === 'conventional' ? (
            <span className="text-[#38BDF8] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> CONVENTIONAL CBTC
            </span>
          ) : (
            <span className="text-[#F59E0B] flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> MANUAL DISPATCH
            </span>
          )}
        </div>
      </div>

      {/* Right: In-Page Section Jump Navigation & Telemetry */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center gap-4 text-xs font-mono-tech text-white/60 mr-2">
          <a href="#control-deck" className="hover:text-white transition-colors">01. CONSOLE</a>
          <a href="#ai-engine-section" className="hover:text-white transition-colors">02. AI DECISION</a>
          <a href="#fleet-section" className="hover:text-white transition-colors">03. FLEET</a>
          <a href="#scenarios-section" className="hover:text-white transition-colors">04. SCENARIOS</a>
          <a href="#comparison-section" className="hover:text-white transition-colors">05. BENCHMARK</a>
        </nav>

        {/* Fleet Count */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#0E1626] border border-white/10 px-3 py-1 rounded text-xs">
          <span className="text-white/40">FLEET:</span>
          <span className="text-[#22C55E] font-bold">{activeTrainsCount}/{totalTrainsCount}</span>
          <span className="text-[10px] text-white/60">ACTIVE</span>
        </div>

        {/* Live Simulation Clock */}
        <div className="flex items-center gap-2 bg-[#0E1626] border border-white/15 px-3 py-1 rounded">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
          <span className="text-white font-bold text-xs md:text-sm tracking-wider">
            {simTime}
          </span>
          <span className="text-[9px] text-white/40">IST</span>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          title="Reset Simulation to Initial State"
          aria-label="Reset simulation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
