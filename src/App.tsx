import React, { useState, useRef, useEffect } from 'react';
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
      />

      {/* 2. Main Viewport Area */}
      <div ref={mainScrollRef} className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        {/* Top Header Bar with Mobile Menu Hamburger Trigger & Mode Selector */}
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
          onSelectMode={setDashboardMode}
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
              onSelectMode={setDashboardMode}
              selectedSensorKey={selectedSensorKey}
              onSelectSensorKey={setSelectedSensorKey}
              simulationScenario={simulationScenario}
              onSelectSimulationScenario={setSimulationScenario}
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
    </div>
  );
};

export default App;
