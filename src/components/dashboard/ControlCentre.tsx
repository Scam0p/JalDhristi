import React from 'react';
import { 
  CaseType, 
  ScenarioType, 
  Train, 
  Station, 
  KPISet, 
  AIRecommendation, 
  AIEventLog 
} from '../../types/simulation';
import { CaseSwitcher } from './CaseSwitcher';
import { KPIRibbon } from './KPIRibbon';
import { RailwayNetwork } from '../railway/RailwayNetwork';
import { AIEnginePanel } from './AIEnginePanel';
import { DecisionFeed } from './DecisionFeed';
import { FleetOverview } from '../fleet/FleetOverview';
import { ScenarioControlCenter } from '../scenarios/ScenarioControlCenter';
import { PerformanceComparison } from '../comparison/PerformanceComparison';

interface ControlCentreProps {
  currentCase: CaseType;
  onSelectCase: (c: CaseType) => void;
  activeScenario: ScenarioType;
  onSelectScenario: (s: ScenarioType) => void;
  trains: Train[];
  stations: Station[];
  kpis: KPISet;
  recommendations: AIRecommendation[];
  eventLogs: AIEventLog[];
  simTime: string;
  simSeconds: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  simSpeed: number;
  onSetSpeed: (speed: number) => void;
  onSelectTrain: (train: Train) => void;
  onSelectStation: (station: Station) => void;
  selectedTrain: Train | null;
  selectedStation: Station | null;
  onRunOptimization: () => void;
  isOptimizing: boolean;
  onDeployRecommendation: (id: string) => void;
  onReset: () => void;
  isCaseTransitioning: boolean;
}

export const ControlCentre: React.FC<ControlCentreProps> = ({
  currentCase,
  onSelectCase,
  activeScenario,
  onSelectScenario,
  trains,
  stations,
  kpis,
  recommendations,
  eventLogs,
  simTime,
  simSeconds,
  isPlaying,
  onTogglePlay,
  simSpeed,
  onSetSpeed,
  onSelectTrain,
  onSelectStation,
  selectedTrain,
  selectedStation,
  onRunOptimization,
  isOptimizing,
  onDeployRecommendation,
  onReset,
  isCaseTransitioning
}) => {
  return (
    <div id="control-deck" className="space-y-10 max-w-7xl mx-auto">
      {/* 1. Paradigm Case Selector */}
      <section>
        <CaseSwitcher
          currentCase={currentCase}
          onSelectCase={onSelectCase}
          isTransitioning={isCaseTransitioning}
        />
      </section>

      {/* 2. Core Executive KPIs Ribbon */}
      <section>
        <KPIRibbon
          kpis={kpis}
          currentCase={currentCase}
        />
      </section>

      {/* 3. Master Expansive Railway Simulation Deck (With Integrated Side Controls) */}
      <section id="network-section">
        <RailwayNetwork
          trains={trains}
          stations={stations}
          currentCase={currentCase}
          onSelectTrain={onSelectTrain}
          onSelectStation={onSelectStation}
          selectedTrain={selectedTrain}
          selectedStation={selectedStation}
          isOptimizing={isOptimizing}
          simTime={simTime}
          simSeconds={simSeconds}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          simSpeed={simSpeed}
          onSetSpeed={onSetSpeed}
          onReset={onReset}
          onRunOptimization={onRunOptimization}
        />
      </section>

      {/* 4. AI Decision Engine & Event Stream */}
      <section id="ai-engine-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <AIEnginePanel
            recommendations={recommendations}
            onDeployRecommendation={onDeployRecommendation}
            onRunOptimization={onRunOptimization}
            isOptimizing={isOptimizing}
            currentCase={currentCase}
          />
        </div>
        <div className="lg:col-span-5">
          <DecisionFeed logs={eventLogs} />
        </div>
      </section>

      {/* 5. Fleet Operational Roster */}
      <section id="fleet-section">
        <FleetOverview
          trains={trains}
          onSelectTrain={onSelectTrain}
          selectedTrain={selectedTrain}
        />
      </section>

      {/* 6. Contingency Scenarios Simulator */}
      <section id="scenarios-section">
        <ScenarioControlCenter
          activeScenario={activeScenario}
          onSelectScenario={onSelectScenario}
        />
      </section>

      {/* 7. Empirical Performance Benchmark & Comparison */}
      <section id="comparison-section">
        <PerformanceComparison currentCase={currentCase} />
      </section>
    </div>
  );
};
