import React from 'react';
import { ArrowDown, Sparkles, Cpu, Activity, ShieldAlert } from 'lucide-react';
import { CaseType } from '../../types/simulation';

interface HeroSectionProps {
  onExploreClick: () => void;
  onRunOptimization: () => void;
  currentCase: CaseType;
  onCaseChange: (c: CaseType) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onRunOptimization,
  currentCase,
  onCaseChange
}) => {
  return (
    <section 
      id="hero-section" 
      className="relative min-h-[75vh] flex flex-col justify-center items-center px-4 md:px-12 py-12 overflow-hidden grid-bg-clean border-b border-white/10"
    >
      {/* Background Metro Schematic Lines (Subtle & Clean) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden flex items-center justify-center">
        <svg className="w-full h-full min-w-[1200px]" viewBox="0 0 1200 500" fill="none">
          <path
            d="M 50 250 C 200 250, 250 160, 400 160 C 550 160, 650 340, 800 340 C 950 340, 1000 250, 1150 250"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="4"
          />
          <path
            d="M 120 100 C 220 100, 260 220, 350 220 L 450 220"
            stroke="#E30613"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center gap-6">
        {/* Government / Authority Header Tag */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#0E1626] border border-white/15 text-xs font-mono-tech shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#E30613]"></span>
          <span className="tracking-widest text-[#38BDF8] font-bold">
            SIH 2026 • SMART INDIA HACKATHON
          </span>
          <span className="text-white/30">|</span>
          <span className="text-white/80 font-medium">
            KOCHI METRO RAIL LIMITED
          </span>
        </div>

        {/* Main Headline */}
        <div className="space-y-3">
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight uppercase leading-[1.0]">
            AI-DRIVEN TRAIN INDUCTION <br />
            <span className="text-[#38BDF8]">
              PLANNING & SCHEDULING
            </span>
          </h1>
          <p className="font-mono-tech text-xs sm:text-sm tracking-widest text-[#E30613] font-bold uppercase">
            OPERATIONAL DEMONSTRATION PROPOSAL • POWERHOUSE AI SYSTEMS
          </p>
        </div>

        {/* Executive Summary Narrative */}
        <p className="max-w-3xl text-sm sm:text-base md:text-lg text-white/75 font-normal leading-relaxed">
          An adaptive scheduling platform for Kochi Metro Rail Limited (KMRL) that dynamically synchronizes 
          passenger demand surges, maintenance windows, depot turnover, and real-time headway control.
        </p>

        {/* Core Thesis Box */}
        <div className="w-full max-w-3xl gov-panel-elevated p-5 md:p-6 rounded-xl border-l-4 border-[#E30613] text-center my-1 shadow-lg">
          <span className="text-[10px] font-mono-tech uppercase tracking-widest text-[#38BDF8] font-bold block mb-1">
            CORE OPERATIONAL PRINCIPLE
          </span>
          <p className="font-display text-lg sm:text-2xl font-bold text-white tracking-wide">
            &ldquo;Don&rsquo;t run more trains. Run the <span className="text-[#22C55E]">right trains</span> at the <span className="text-[#38BDF8]">right time</span> with the <span className="text-[#F59E0B]">right capacity</span>.&rdquo;
          </p>
        </div>

        {/* 3-Way Quick Case Selector on Hero */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xl justify-center mt-2">
          <button
            onClick={() => onCaseChange('manual')}
            className={`flex-1 w-full py-2.5 px-4 rounded-lg font-mono-tech text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              currentCase === 'manual'
                ? 'bg-[#F59E0B]/20 border border-[#F59E0B] text-[#F59E0B]'
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>01. MANUAL</span>
          </button>

          <button
            onClick={() => onCaseChange('conventional')}
            className={`flex-1 w-full py-2.5 px-4 rounded-lg font-mono-tech text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              currentCase === 'conventional'
                ? 'bg-[#0284C7]/20 border border-[#38BDF8] text-[#38BDF8]'
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>02. CONVENTIONAL</span>
          </button>

          <button
            onClick={() => onCaseChange('ai')}
            className={`flex-1 w-full py-2.5 px-4 rounded-lg font-mono-tech text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
              currentCase === 'ai'
                ? 'bg-[#E30613] text-white shadow-md'
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>03. AI-POWERED</span>
          </button>
        </div>

        {/* Hero CTA Button */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <button
            onClick={onExploreClick}
            className="group px-8 py-3 rounded-lg bg-white text-black font-display font-bold text-sm tracking-wider uppercase hover:bg-[#38BDF8] transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>ENTER OPERATIONS CONSOLE</span>
            <ArrowDown className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
