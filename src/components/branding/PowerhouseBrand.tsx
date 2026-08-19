import React from 'react';

interface PowerhouseBrandProps {
  currentCase: string;
}

export const PowerhouseBrand: React.FC<PowerhouseBrandProps> = ({ currentCase }) => {
  return (
    <aside 
      className="fixed left-0 top-0 bottom-0 w-16 md:w-20 z-50 bg-[#05080E] border-r border-white/10 flex flex-col items-center justify-between py-5 select-none shadow-2xl"
      aria-label="Powerhouse Branding"
    >
      {/* Top Official Logo Image from File */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-11 h-11 rounded-lg overflow-hidden border border-white/20 bg-black shadow-md">
          <img
            src="/powerhouse_logo.jpeg"
            alt="Powerhouse Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-[9px] font-mono-tech tracking-wider text-[#E30613] font-bold">
          SIH 2026
        </span>
      </div>

      {/* Main Persistent Vertical Wordmark with Impact Font */}
      <div className="flex-1 flex items-center justify-center my-6">
        <div className="rotate-180 [writing-mode:vertical-rl] flex items-center gap-3">
          <span className="font-impact text-2xl md:text-3xl tracking-[0.25em] text-[#E30613] uppercase drop-shadow hover:text-[#FF1A2E] transition-colors">
            POWERHOUSE
          </span>
          <span className="h-6 w-[1.5px] bg-white/20"></span>
          <span className="text-[9px] font-mono-tech uppercase tracking-[0.25em] text-white/50">
            KMRL • AI SYSTEMS
          </span>
        </div>
      </div>

      {/* Bottom Steady Clean System Indicator (No blinking/pinging) */}
      <div className="flex flex-col items-center gap-1.5 bg-[#0E1626] border border-white/10 px-2 py-2 rounded-lg w-12 text-center">
        <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
        <span className="text-[7px] font-mono-tech text-white/60 tracking-wider uppercase font-bold">
          {currentCase.toUpperCase()}
        </span>
      </div>
    </aside>
  );
};
