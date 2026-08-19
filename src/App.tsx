import React from 'react';
import { useSimulation } from './hooks/useSimulation';
import { PowerhouseBrand } from './components/branding/PowerhouseBrand';
import { TopStatusBar } from './components/layout/TopStatusBar';
import { HeroSection } from './components/hero/HeroSection';
import { ControlCentre } from './components/dashboard/ControlCentre';
import { TrainDetailDrawer } from './components/modals/TrainDetailDrawer';
import { StationDetailDrawer } from './components/modals/StationDetailDrawer';
import { AIOptimizationModal } from './components/modals/AIOptimizationModal';
import { CommandFooter } from './components/footer/CommandFooter';

export const App: React.FC = () => {
  const {
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
    isOptimizing,
    optimizationStep,
    runAIOptimization,
    handleDeployRecommendation,
    resetSimulation,
    isCaseTransitioning
  } = useSimulation();

  const handleExploreClick = () => {
    const el = document.getElementById('control-deck');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeTrainsCount = trains.filter(t => t.status === 'IN_SERVICE' || t.status === 'INDUCTING').length;

  return (
    <div className="relative min-h-screen bg-[#050608] text-[#F5F7FA] overflow-x-hidden">
      {/* 1. Persistent Powerhouse Brand Bar (Left Edge) */}
      <PowerhouseBrand currentCase={currentCase} />

      {/* 2. Main Viewport Container (Offset for left branding rail) */}
      <div className="pl-16 md:pl-20 flex flex-col min-h-screen">
        {/* Persistent Top Status Bar */}
        <TopStatusBar
          simTime={simTime}
          currentCase={currentCase}
          activeTrainsCount={activeTrainsCount}
          totalTrainsCount={trains.length}
          onReset={resetSimulation}
          onRunOptimization={runAIOptimization}
          isOptimizing={isOptimizing}
        />

        {/* Main Content Sections */}
        <main className="flex-1 space-y-12 pb-16">
          {/* Hero Section */}
          <HeroSection
            onExploreClick={handleExploreClick}
            onRunOptimization={runAIOptimization}
            currentCase={currentCase}
            onCaseChange={handleCaseChange}
          />

          {/* Main Control Centre Deck */}
          <div className="px-4 md:px-8 max-w-7xl mx-auto">
            <ControlCentre
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
              onSelectTrain={setSelectedTrain}
              onSelectStation={setSelectedStation}
              selectedTrain={selectedTrain}
              selectedStation={selectedStation}
              onRunOptimization={runAIOptimization}
              isOptimizing={isOptimizing}
              onDeployRecommendation={handleDeployRecommendation}
              onReset={resetSimulation}
              isCaseTransitioning={isCaseTransitioning}
            />
          </div>
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

      {/* Cinematic AI Optimization Scan Overlay */}
      <AIOptimizationModal
        isOpen={isOptimizing}
        step={optimizationStep}
      />
    </div>
  );
};

export default App;
