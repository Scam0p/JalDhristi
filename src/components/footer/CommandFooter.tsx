import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const CommandFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#020305] border-t border-white/10 py-10 px-4 md:px-12 font-mono-tech select-none pl-20 md:pl-24 text-xs text-white/50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Disclaimer Banner */}
        <div className="p-3.5 rounded-xl bg-[#090C10] border border-[#E30613]/30 flex flex-wrap items-center justify-between gap-3 text-white/80">
          <div className="flex items-center gap-2 text-[#E30613]">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-bold tracking-wider text-[11px] uppercase">
              SIMULATION DEMONSTRATION LAYER ONLY
            </span>
          </div>
          <span className="text-[10px] text-white/60">
            NOT CONNECTED TO LIVE KOCHI METRO RAIL LIMITED OPERATIONAL SIGNALING OR ATS SYSTEMS
          </span>
        </div>

        {/* Middle Meta Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-impact text-lg text-[#E30613] tracking-wider">
                POWERHOUSE
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                TEAM
              </span>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed font-light">
              Advanced AI Train Induction Planning & Dispatch Scheduling Platform engineered for SIH 2026.
            </p>
          </div>

          <div>
            <span className="text-[10px] text-white/70 uppercase font-bold block mb-2">
              PROBLEM STATEMENT
            </span>
            <p className="text-[10px] text-white/40 leading-relaxed font-light">
              SIH 2026: AI-Driven Train Induction Planning & Scheduling for Kochi Metro Rail Limited (KMRL).
            </p>
          </div>

          <div>
            <span className="text-[10px] text-white/70 uppercase font-bold block mb-2">
              SYSTEM ARCHITECTURE
            </span>
            <p className="text-[10px] text-white/40 leading-relaxed font-light">
              Multi-Objective Pareto Optimization • Real-time CBTC Telemetry Ingestion • Dynamic Siding Induction.
            </p>
          </div>

          <div>
            <span className="text-[10px] text-white/70 uppercase font-bold block mb-2">
              SIMULATION ENGINE
            </span>
            <p className="text-[10px] text-white/40 leading-relaxed font-light">
              Deterministic High-Fidelity Front-End Engine • Latency: 14ms • Build: 2026.08-SIH-GOLD.
            </p>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[10px] text-white/30">
          <span>© 2026 POWERHOUSE • KOCHI METRO RAIL LIMITED SIMULATION SUITE</span>
          <span className="text-[#38BDF8]">KMRL AI TRAIN INDUCTION DASHBOARD</span>
        </div>
      </div>
    </footer>
  );
};
