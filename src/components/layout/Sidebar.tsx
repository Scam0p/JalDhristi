import React from 'react';
import { 
  LayoutDashboard, 
  TrainTrack, 
  MapPin, 
  Sliders, 
  Cpu, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CaseType } from '../../types/simulation';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeTrainsCount: number;
  totalTrainsCount: number;
  onRunOptimization: () => void;
  onReset: () => void;
  isOptimizing: boolean;
  currentCase: CaseType;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeTrainsCount,
  totalTrainsCount,
  onRunOptimization,
  onReset,
  isOptimizing,
  currentCase
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fleet', label: 'Fleet Roster', icon: TrainTrack, badge: `${activeTrainsCount}/${totalTrainsCount}` },
    { id: 'network', label: 'Corridor Map', icon: MapPin },
    { id: 'scenarios', label: 'Scenarios', icon: Sliders },
    { id: 'ai-engine', label: 'AI Decisions', icon: Cpu },
    { id: 'comparison', label: 'Analytics', icon: BarChart3 }
  ];

  const generalItems = [
    { id: 'settings', label: 'Settings', icon: Settings, action: () => {} },
    { id: 'help', label: 'Technical Docs', icon: HelpCircle, action: () => window.open('https://kmrl.co.in', '_blank') },
    { id: 'reset', label: 'Reset System', icon: RotateCcw, action: onReset }
  ];

  const handleNavClick = (id: string, action?: () => void) => {
    if (action) {
      action();
      return;
    }
    setActiveTab(id);
    const element = document.getElementById(`${id}-section`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-[#ECEEF2] flex flex-col justify-between py-6 px-4 h-screen sticky top-0 select-none z-30 flex-shrink-0 shadow-sm">
      {/* Brand & Logo */}
      <div>
        <div className="flex items-center gap-3 px-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-[#144230] flex items-center justify-center text-white shadow-md">
            {/* Stylized Metro / Induction Logo Mark */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.4" />
              <path d="M12 3a9 9 0 0 1 9 9" stroke="#22C55E" strokeLinecap="round" />
              <circle cx="12" cy="12" r="4" fill="#22C55E" stroke="none" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-lg text-[#111827] tracking-tight">
                KMRL
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E8F7EE] text-[#144230]">
                SIH 2026
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280] font-medium leading-none mt-0.5">
              Train Induction AI
            </p>
          </div>
        </div>

        {/* Main Menu Section */}
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider px-3 block mb-2 font-mono-tech">
              MENU
            </span>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer relative ${
                      isActive
                        ? 'bg-[#E8F7EE] text-[#144230] font-bold'
                        : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F4F5F7]'
                    }`}
                  >
                    {/* Active Left Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#144230] rounded-r-full" />
                    )}

                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#144230]' : 'text-[#9CA3AF]'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono-tech ${
                        isActive ? 'bg-[#144230] text-white' : 'bg-[#E5E7EB] text-[#4B5563]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* General Section */}
          <div>
            <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider px-3 block mb-2 font-mono-tech">
              GENERAL
            </span>
            <nav className="space-y-1">
              {generalItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.action)}
                    className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-[#6B7280] hover:text-[#111827] hover:bg-[#F4F5F7] transition-colors cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-[#9CA3AF]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
};
