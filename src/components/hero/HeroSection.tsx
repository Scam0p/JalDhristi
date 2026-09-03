import React from 'react';
import { ArrowDown, Cpu, Activity, Droplets } from 'lucide-react';
import { CaseType } from '../../types/simulation';

interface HeroSectionProps {
  onExploreClick: () => void;
  onRunOptimization: () => void;
  currentCase: CaseType;
  onCaseChange: (c: CaseType) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  currentCase,
  onCaseChange
}) => {
  return (
    <section 
      id="hero-section" 
      className="relative min-h-[75vh] flex flex-col justify-center items-center px-4 md:px-12 py-12 overflow-hidden bg-[#144230] text-white border-b border-[#1A543E]"
    >
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-mono-tech shadow-sm">
          <Droplets className="w-4 h-4 text-[#22C55E]" />
          <span className="tracking-widest text-[#34D399] font-bold">
            JALDRISHTI • SMART WATER INTELLIGENCE
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight uppercase leading-[1.0]">
            PIPELINE LEAK DETECTION <br />
            <span className="text-[#34D399]">
              & HYDRAULIC LOCALISATION
            </span>
          </h1>
        </div>

        <p className="max-w-3xl text-sm sm:text-base md:text-lg text-white/75 font-normal leading-relaxed">
          Detect anomalies with sparse sensors, narrow the probable pipeline segment using hydraulic digital twin intelligence, and pinpoint exact leak coordinates using acoustic cross-correlation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <button
            onClick={onExploreClick}
            className="group px-8 py-3 rounded-full bg-white text-[#144230] font-display font-bold text-sm tracking-wider uppercase hover:bg-[#E8F7EE] transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>ENTER OPERATIONS DECK</span>
            <ArrowDown className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
