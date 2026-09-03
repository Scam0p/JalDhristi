import React from 'react';
import { 
  LayoutDashboard, 
  Droplets, 
  Activity,
  Sliders, 
  Cpu, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  RotateCcw,
  X
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
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeTrainsCount,
  totalTrainsCount,
  onReset,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Pipeline Sim', icon: Droplets },
    { id: 'fleet', label: 'Sensor Fleet', icon: Activity, badge: `${activeTrainsCount}/${totalTrainsCount}` },
    { id: 'ai-engine', label: 'Hydraulic AI', icon: Cpu },
    { id: 'scenarios', label: 'Scenarios', icon: Sliders },
    { id: 'comparison', label: 'Benchmarks', icon: BarChart3 }
  ];

  const generalItems = [
    { id: 'settings', label: 'System Settings', icon: Settings, action: () => {} },
    { id: 'help', label: 'Architecture Docs', icon: HelpCircle, action: () => window.open('https://github.com/Scam0p/JalDhristi', '_blank') },
    { id: 'reset', label: 'Reset System', icon: RotateCcw, action: onReset }
  ];

  const handleNavClick = (id: string, action?: () => void) => {
    if (action) {
      action();
      onCloseMobile?.();
      return;
    }
    setActiveTab(id);
    onCloseMobile?.();
    const element = document.getElementById(`${id}-section`) || document.getElementById('control-deck');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full py-6 px-4 select-none">
      <div>
        {/* Brand & Logo + Mobile Close Button */}
        <div className="flex items-center justify-between px-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#144230] flex items-center justify-center text-white shadow-md">
              <Droplets className="w-5 h-5 text-[#22C55E]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-lg text-[#111827] tracking-tight">
                  JalDrishti
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E8F7EE] text-[#144230]">
                  WATER AI
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280] font-medium leading-none mt-0.5">
                Water Intelligence
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-full hover:bg-[#F4F5F7] text-[#6B7280] hover:text-[#111827] cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#9CA3AF] px-3 font-semibold block mb-2">
              MONITORING DECK
            </span>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full font-display text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#144230] text-white shadow-sm'
                        : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F4F5F7]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#9CA3AF]'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono-tech px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#E8F7EE] text-[#144230]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#9CA3AF] px-3 font-semibold block mb-2">
              SYSTEM
            </span>
            <div className="space-y-1">
              {generalItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.action)}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full font-display text-xs font-semibold text-[#6B7280] hover:text-[#111827] hover:bg-[#F4F5F7] transition-all cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-[#9CA3AF]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Network Health Metric Pill at Bottom */}
      <div className="p-3.5 rounded-2xl bg-[#E8F7EE] border border-[#B7E4C7] flex items-center justify-between text-xs font-mono-tech">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-[#144230] font-bold text-[11px]">HYDRAULIC TWIN</span>
        </div>
        <span className="text-[#144230] font-black text-xs">98.2%</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-[#ECEEF2] flex-shrink-0 h-screen sticky top-0 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-out Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex-shrink-0 z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
