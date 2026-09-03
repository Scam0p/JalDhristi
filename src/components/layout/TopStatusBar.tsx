import React from 'react';
import { RefreshCw, Cpu, Droplets } from 'lucide-react';
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
  onReset,
  onRunOptimization,
  isOptimizing
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#144230] text-white border-b border-[#1A543E] px-4 md:px-8 py-3 flex items-center justify-between text-xs font-mono-tech select-none">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 bg-[#0D2D20] flex items-center justify-center">
            <Droplets className="w-5 h-5 text-[#22C55E]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black tracking-wider text-sm md:text-base text-white">
                JalDrishti <span className="text-[#34D399] font-normal">| WATER INTELLIGENCE</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
