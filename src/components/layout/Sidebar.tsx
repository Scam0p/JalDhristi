import React from 'react';
import { 
  LayoutDashboard, 
  Droplets, 
  Activity, 
  Cpu, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  RotateCcw,
  X,
  FileText,
  Database
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
  onCycleMode?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeTrainsCount,
  totalTrainsCount,
  onReset,
  isMobileOpen = false,
  onCloseMobile,
  onCycleMode
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Pipeline Sim', icon: Droplets },
    { id: 'telemetry-stream', label: 'Tank & Register', icon: Database },
    { id: 'fleet', label: 'Sensor Fleet', icon: Activity, badge: `${activeTrainsCount}/${totalTrainsCount}` },
    { id: 'complaints', label: 'Citizen Grievance Portal', icon: FileText, badge: 'PORTAL' },
    { id: 'comparison', label: 'Benchmarks', icon: BarChart3 }
  ];

  const generalItems = [
    { id: 'settings', label: 'System Settings', icon: Settings, action: onCycleMode },
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

    if (id === 'complaints') {
      const scrollContainer = document.querySelector('.overflow-y-auto');
      if (scrollContainer) {
        scrollContainer.scrollTop = 0;
      }
      window.scrollTo(0, 0);
      return;
    }

    // Scroll to dashboard section
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
                <span className="text-[10px] font-mono-tech font-bold px-1.5 py-0.5 rounded bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]">
                  SCADA
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280] font-mono-tech leading-none mt-0.5">
                Cauvery Pipeline Network • Bengaluru
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-md hover:bg-[#F4F5F7] text-[#6B7280] hover:text-[#111827] cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="space-y-5">
          <div>
            <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#6B7280] px-3 font-bold block mb-1.5">
              MONITORING DECK
            </span>
            <div className="space-y-0.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isComplaints = item.id === 'complaints';

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer border ${
                      isActive
                        ? 'bg-[#144230] text-white border-[#144230]'
                        : isComplaints
                        ? 'bg-[#E8F7EE] text-[#144230] border-[#B7E4C7] font-bold hover:bg-[#D8F3E5]'
                        : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB] border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isComplaints ? 'text-[#144230]' : 'text-[#6B7280]'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono-tech px-1.5 py-0.5 rounded font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : isComplaints
                            ? 'bg-[#144230] text-white'
                            : 'bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]'
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
            <span className="text-[10px] font-mono-tech uppercase tracking-wider text-[#6B7280] px-3 font-bold block mb-1.5">
              SYSTEM CONTROL
            </span>
            <div className="space-y-0.5">
              {generalItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.action)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-[#6B7280]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Network Health Metric Box at Bottom */}
      <div className="p-3 rounded-md bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-between text-xs font-mono-tech">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="text-[#374151] font-bold text-[11px]">SCADA TELEMETRY</span>
        </div>
        <span className="text-[#144230] font-bold text-xs">ONLINE • 98.2%</span>
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
