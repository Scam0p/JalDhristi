import React from 'react';
import { Users, GraduationCap, Award, Droplets } from 'lucide-react';

export const CommandFooter: React.FC = () => {
  const teamMembers = [
    { name: 'Arjun V', usn: '1EP24IC007', role: 'Team Member' },
    { name: 'Himanshu Kumar', usn: '1EP24IC014', role: 'Team Member' },
    { name: 'Jeevan Jaikumar', usn: '1EP24IC015', role: 'Team Member' },
    { name: 'Roshni Singh R', usn: '1EP24IC044', role: 'Team Member' },
    { name: 'Shailesh M', usn: '1EP24IC050', role: 'Team Member' }
  ];

  return (
    <footer className="w-full bg-white border-t border-[#E5E7EB] py-10 px-6 lg:px-8 font-mono-tech select-none text-xs text-[#6B7280]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Disclaimer & Project Banner */}
        <div className="p-3.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3 text-[#4B5563]">
          <div className="flex items-center gap-2.5 text-[#144230]">
            <Droplets className="w-4 h-4 text-[#22C55E]" />
            <div>
              <span className="font-bold tracking-wider text-xs uppercase block text-[#111827]">
                JALDRISHTI • PIPELINE SCADA &amp; HYDRAULIC CONTROL SYSTEM
              </span>
              <span className="text-[10px] text-[#6B7280]">
                Cauvery Water Transmission Pipeline Network • Dual ADXL345 Telemetry • Acoustic Leak Pinpointing
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-[#F4F5F7] text-[#144230] font-bold text-[10px] border border-[#E5E7EB] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#22C55E]" /> POWERHOUSE
            </span>
          </div>
        </div>

        {/* Dedicated POWERHOUSE Team Showcase Grid */}
        <div className="p-5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#144230] flex items-center justify-center text-white">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#111827] tracking-wider uppercase">
                  TEAM POWERHOUSE
                </h3>
                <p className="text-[10px] text-[#144230] font-semibold flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>DEPT. OF CSE-IOT &amp; CSBT</span>
                </p>
              </div>
            </div>

            <div className="text-[10px] text-[#6B7280] bg-white px-2.5 py-1 rounded border border-[#E5E7EB]">
              5 Core Student Engineers
            </div>
          </div>

          {/* 5 Team Member Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {teamMembers.map((member, idx) => (
              <div
                key={member.usn}
                className="p-3 rounded-md bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#F4F5F7] border border-[#E5E7EB] text-[#144230] flex items-center justify-center font-bold text-xs">
                    {member.name.split(' ')[0].charAt(0)}{member.name.split(' ')[1] ? member.name.split(' ')[1].charAt(0) : ''}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#111827] leading-tight">
                      {member.name}
                    </h4>
                    <span className="text-[10px] text-[#6B7280] block mt-0.5">
                      {member.usn}
                    </span>
                  </div>
                </div>

                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F4F5F7] text-[#6B7280] border border-[#E5E7EB]">
                  #{idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Meta Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <div>
            <span className="text-[10px] text-[#111827] uppercase font-bold block mb-1">
              SYSTEM ARCHITECTURE
            </span>
            <p className="text-[10px] text-[#6B7280] leading-relaxed">
              JalDrishti 4-stage pipeline intelligence workflow (Detect → Narrow → Pinpoint → Respond) across Bengaluru&apos;s Cauvery transmission network.
            </p>
          </div>

          <div>
            <span className="text-[10px] text-[#111827] uppercase font-bold block mb-1">
              SCADA TELEMETRY BUS
            </span>
            <p className="text-[10px] text-[#6B7280] leading-relaxed">
              Real MQTT telemetry bus publishing dual ADXL345 accelerometer packets (50 cm &amp; 90 cm) at 1 Hz for real-time acoustic leak detection.
            </p>
          </div>

          <div>
            <span className="text-[10px] text-[#111827] uppercase font-bold block mb-1">
              DIGITAL TWIN SOLVER
            </span>
            <p className="text-[10px] text-[#6B7280] leading-relaxed">
              Calibrated hydraulic grade lines, EPANET mass balance equations, and high-speed transient wave solvers for accurate pinpointing.
            </p>
          </div>

          <div>
            <span className="text-[10px] text-[#111827] uppercase font-bold block mb-1">
              MUNICIPAL DISPATCH
            </span>
            <p className="text-[10px] text-[#6B7280] leading-relaxed">
              Automated DMA valve throttling directives and citizen grievance integration with BWSSB maintenance operations.
            </p>
          </div>
        </div>

        {/* Bottom SCADA Copyright Bar */}
        <div className="pt-4 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3 text-[10px] text-[#6B7280]">
          <div>
            &copy; {new Date().getFullYear()} JalDrishti SCADA Control Interface • Cauvery Transmission Zone Z-07
          </div>
          <div className="flex items-center gap-3">
            <span>MODBUS-RTU / MQTT v3.1.1</span>
            <span>•</span>
            <span>SYSTEM STATE: OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CommandFooter;
