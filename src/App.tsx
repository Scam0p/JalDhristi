import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useSimulation } from './hooks/useSimulation';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { ControlCentre } from './components/dashboard/ControlCentre';
import { CitizenComplaintPortal } from './components/complaints/CitizenComplaintPortal';
import { TrainDetailDrawer } from './components/modals/TrainDetailDrawer';
import { StationDetailDrawer } from './components/modals/StationDetailDrawer';
import { AIOptimizationModal } from './components/modals/AIOptimizationModal';
import { CommandFooter } from './components/footer/CommandFooter';

export const App: React.FC = () => {
  const {
    dashboardMode,
    setDashboardMode,
    selectedSensorKey,
    setSelectedSensorKey,
    simulationScenario,
    setSimulationScenario,
    cycleSystemMode,
    modeToast,
    realTimeEventState,
    hardwareTelemetry,
    currentCase,
    handleCaseChange,
    activeScenario,
    handleScenarioChange,
    trains,
    stations,
    kpis,
    recommendations,
    eventLogs,
    simTime,
    simSeconds,
    isPlaying,
    setIsPlaying,
    simSpeed,
    setSimSpeed,
    selectedTrain,
    setSelectedTrain,
    selectedStation,
    setSelectedStation,
    isFetchingSensor,
    fetchingSensorId,
    handleSelectSensorAsync,
    simulationState,
    setSimulationState,
    isOptimizing,
    optimizationStep,
    runAIOptimization,
    handleDeployRecommendation,
    resetSimulation,
    isCaseTransitioning
  } = useSimulation();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  // Automatically reset the scroll container to TOP whenever Complaint Portal is opened
  useEffect(() => {
    if (activeTab === 'complaints') {
      if (mainScrollRef.current) {
        mainScrollRef.current.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    }
  }, [activeTab]);

  const activeSensorsCount = trains.filter(t => t.status === 'NORMAL' || t.status === 'WARNING').length;

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#111827] flex selection:bg-[#144230] selection:text-white">
      {/* 1. Vertical Sidebar (Desktop persistent, Mobile hidden until triggered) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeTrainsCount={activeSensorsCount}
        totalTrainsCount={trains.length}
        onRunOptimization={runAIOptimization}
        onReset={resetSimulation}
        isOptimizing={isOptimizing}
        currentCase={currentCase}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onCycleMode={cycleSystemMode}
      />

      {/* 2. Main Viewport Area */}
      <div ref={mainScrollRef} className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        {/* Top Header Bar with Mobile Menu Hamburger Trigger */}
        <TopBar
          simTime={simTime}
          currentCase={currentCase}
          activeTrainsCount={activeSensorsCount}
          totalTrainsCount={trains.length}
          onReset={resetSimulation}
          onRunOptimization={runAIOptimization}
          isOptimizing={isOptimizing}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
          dashboardMode={dashboardMode}
          realTimeEventState={realTimeEventState}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'complaints' ? (
            <CitizenComplaintPortal onBackToDashboard={() => setActiveTab('dashboard')} />
          ) : (
            <ControlCentre
              onOpenComplaintPortal={() => setActiveTab('complaints')}
              dashboardMode={dashboardMode}
              selectedSensorKey={selectedSensorKey}
              onSelectSensorKey={setSelectedSensorKey}
              simulationScenario={simulationScenario}
              realTimeEventState={realTimeEventState}
              currentCase={currentCase}
              onSelectCase={handleCaseChange}
              activeScenario={activeScenario}
              onSelectScenario={handleScenarioChange}
              trains={trains}
              stations={stations}
              kpis={kpis}
              recommendations={recommendations}
              eventLogs={eventLogs}
              simTime={simTime}
              simSeconds={simSeconds}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(prev => !prev)}
              simSpeed={simSpeed}
              onSetSpeed={setSimSpeed}
              onSelectTrain={handleSelectSensorAsync}
              onSelectStation={setSelectedStation}
              selectedTrain={selectedTrain}
              selectedStation={selectedStation}
              onRunOptimization={runAIOptimization}
              isOptimizing={isOptimizing}
              onDeployRecommendation={handleDeployRecommendation}
              onReset={resetSimulation}
              isCaseTransitioning={isCaseTransitioning}
              simulationState={simulationState}
              onSetSimulationState={setSimulationState}
              isFetchingSensor={isFetchingSensor}
              fetchingSensorId={fetchingSensorId}
              onSelectSensorAsync={handleSelectSensorAsync}
            />
          )}
        </main>

        {/* Command Footer */}
        <CommandFooter />
      </div>

      {/* Slide-out Telemetry Drawers */}
      <TrainDetailDrawer
        train={selectedTrain}
        onClose={() => setSelectedTrain(null)}
      />

      <StationDetailDrawer
        station={selectedStation}
        trains={trains}
        onClose={() => setSelectedStation(null)}
      />

      {/* Hydraulic Optimization Solver Dialog */}
      <AIOptimizationModal
        isOpen={isOptimizing}
        step={optimizationStep}
      />

      {/* Subtle Toast Feedback for Discreet Mode Transitions */}
      {modeToast && (
        <div
          key={modeToast.id}
          className="fixed bottom-6 right-6 z-50 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#144230] text-white shadow-xl border border-[#22C55E]/30 text-xs font-mono-tech font-semibold">
            {modeToast.type === 'REAL' && (
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse shrink-0" />
            )}
            {modeToast.type === 'NORMAL' && (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
            )}
            {modeToast.type === 'LEAK' && (
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping shrink-0" />
            )}
            <span>{modeToast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
