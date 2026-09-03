import React from 'react';
import { ShieldCheck, Users, GraduationCap, Award, Droplets } from 'lucide-react';

export const CommandFooter: React.FC = () => {
  const teamMembers = [
    { name: 'Arjun V', usn: '1EP24IC007', role: 'Team Member' },
    { name: 'Harsh Jangir', usn: '1EP24IC012', role: 'Team Member' },
    { name: 'Himanshu Kumar', usn: '1EP24IC014', role: 'Team Member' },
    { name: 'Jeevan Jaikumar', usn: '1EP24IC015', role: 'Team Member' },
    { name: 'Roshni Singh R', usn: '1EP24IC044', role: 'Team Member' },
    { name: 'Shailesh M', usn: '1EP24IC050', role: 'Team Member' }
  ];

  return (
    <footer className="w-full bg-white border-t border-[#ECEEF2] py-12 px-6 lg:px-10 font-mono-tech select-none text-xs text-[#6B7280]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Disclaimer & Project Banner */}
        <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4 text-[#4B5563]">
          <div className="flex items-center gap-2.5 text-[#144230]">
            <Droplets className="w-5 h-5 text-[#22C55E]" />
            <div>
              <span className="font-bold tracking-wider text-xs uppercase block font-display text-[#111827]">
                JalDrishti • Smart Water Intelligence System
              </span>
              <span className="text-[10px] text-[#6B7280] font-normal">
                Sparse Sensor Monitoring • Hydraulic Digital Twin Simulation • Targeted Acoustic Leak Pinpointing
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#E8F7EE] text-[#144230] font-bold text-[11px] border border-[#B7E4C7] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#22C55E]" /> POWERHOUSE
            </span>
          </div>
        </div>

        {/* Dedicated POWERHOUSE Team Showcase Grid */}
        <div className="p-6 rounded-3xl bg-[#F9FAFB] border border-[#ECEEF2] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#ECEEF2]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#144230] flex items-center justify-center text-white shadow-sm">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-black text-base text-[#111827] tracking-tight">
                  TEAM POWERHOUSE
                </h3>
                <p className="text-[11px] text-[#144230] font-semibold flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Dept. of CSE-IoT & CSBT</span>
                </p>
              </div>
            </div>

            <div className="text-[11px] font-mono-tech text-[#6B7280] bg-white px-3 py-1 rounded-full border border-[#E5E7EB]">
              6 Core Student Engineers
            </div>
          </div>

          {/* 6 Team Member Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {teamMembers.map((member, idx) => (
              <div
                key={member.usn}
                className="p-3.5 rounded-2xl bg-white border border-[#ECEEF2] hover:border-[#144230]/30 transition-all flex items-center justify-between shadow-2xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F7EE] text-[#144230] group-hover:bg-[#144230] group-hover:text-white transition-colors flex items-center justify-center font-display font-bold text-xs font-mono-tech">
                    {member.name.split(' ')[0].charAt(0)}{member.name.split(' ')[1] ? member.name.split(' ')[1].charAt(0) : ''}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-[#111827] leading-tight">
                      {member.name}
                    </h4>
                    <span className="text-[10px] text-[#6B7280] font-mono-tech block mt-0.5">
                      {member.usn}
                    </span>
                  </div>
                </div>

                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F4F5F7] text-[#4B5563] font-mono-tech">
                  #{idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Meta Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <div>
            <span className="text-[10px] text-[#111827] uppercase font-bold block mb-1.5 font-display">
              System Architecture
            </span>
            <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
              JalDrishti: 4-stage pipeline intelligence workflow (Detect → Narrow → Pinpoint → Respond).
            </p>
          </div>

          <div>
            <span className="text-[10px] text-[#111827] uppercase font-bold block mb-1.5 font-display">
              Hydraulic Engine
            </span>
            <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
              EPANET-compatible digital twin coupled with generalized cross-correlation phase transform (GCC-PHAT).
            </p>
          </div>

          <div>
            <span className="text-[10px] text-[#111827] uppercase font-bold block mb-1.5 font-display">
              Sensor Hardening
            </span>
            <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
              LoRaWAN & NB-IoT dual-channel telemetry with edge vibration analysis and power optimization.
            </p>
          </div>

          <div>
            <span className="text-[10px] text-[#111827] uppercase font-bold block mb-1.5 font-display">
              Deployment Target
            </span>
            <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
              Municipal water utilities, transmission mains, and smart urban distribution networks.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
