import React from 'react';

interface PowerhouseBrandProps {
  currentCase: string;
}

export const PowerhouseBrand: React.FC<PowerhouseBrandProps> = ({ currentCase }) => {
  return (
    <aside 
      className="fixed left-0 top-0 bottom-0 w-16 md:w-20 z-50 bg-[#144230] border-r border-[#1A543E] flex flex-col items-center justify-between py-5 select-none shadow-2xl"
      aria-label="JalDrishti Branding"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="w-11 h-11 rounded-lg overflow-hidden border border-white/20 bg-[#0D2D20] shadow-md flex items-center justify-center text-white">
          <span className="font-bold text-xs">JD</span>
        </div>
        <span className="text-[9px] font-mono-tech tracking-wider text-[#22C55E] font-bold">
          JALDRISHTI
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center my-6">
        <div className="rotate-180 [writing-mode:vertical-rl] flex items-center gap-3">
          <span className="font-display font-black text-lg md:text-xl tracking-[0.25em] text-white uppercase drop-shadow">
            JALDRISHTI
          </span>
          <span className="h-6 w-[1.5px] bg-white/20"></span>
          <span className="text-[9px] font-mono-tech uppercase tracking-[0.25em] text-[#34D399]">
            WATER INTELLIGENCE
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 bg-[#0D2D20] border border-white/10 px-2 py-2 rounded-lg w-12 text-center">
        <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
        <span className="text-[7px] font-mono-tech text-white/60 tracking-wider uppercase font-bold">
          {currentCase.toUpperCase()}
        </span>
      </div>
    </aside>
  );
};
