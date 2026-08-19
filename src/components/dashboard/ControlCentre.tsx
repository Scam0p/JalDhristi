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
import { KPIRibbon } from './KPIRibbon';
import { ProjectAnalyticsChart } from './ProjectAnalyticsChart';
import { RemindersCard } from './RemindersCard';
import { TimeTrackerCard } from './TimeTrackerCard';
import { ProgressGaugeCard } from './ProgressGaugeCard';
import { CaseSwitcher } from './CaseSwitcher';
import { RailwayNetwork } from '../railway/RailwayNetwork';
import { AIEnginePanel } from './AIEnginePanel';
import { DecisionFeed } from './DecisionFeed';
import { FleetOverview } from '../fleet/FleetOverview';
import { ScenarioControlCenter } from '../scenarios/ScenarioControlCenter';
import { PerformanceComparison } from '../comparison/PerformanceComparison';
import { Plus, RotateCcw, Sparkles } from 'lucide-react';

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
    <div id="control-deck" className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Dashboard Page Header (Matching Reference exact layout) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-[#111827] tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-[#6B7280] font-normal mt-0.5">
            Plan, prioritize, and optimize Kochi Metro train induction with AI precision.
          </p>
        </div>

        {/* Action Buttons (Solid Forest Green Pill + White Border Pill) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRunOptimization}
            disabled={isOptimizing}
            className="px-5 py-2.5 rounded-full bg-[#144230] hover:bg-[#1A543E] text-white font-display font-bold text-xs tracking-wide transition-all shadow-sm cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{isOptimizing ? 'Optimizing...' : 'Run AI Optimization'}</span>
          </button>

          <button
            onClick={onReset}
            className="px-5 py-2.5 rounded-full bg-white hover:bg-[#F9FAFB] text-[#111827] border border-[#D1D5DB] font-display font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Reset Simulation</span>
          </button>
        </div>
      </div>

      {/* 2. Top Row: 4 KPI Cards (1 Dark Green Card + 3 White Cards) */}
      <section>
        <KPIRibbon
          kpis={kpis}
          currentCase={currentCase}
          trains={trains}
        />
      </section>

      {/* 3. Middle Section: Analytics & Live Operation Cards (Donezo Composition) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Project Analytics Capsule Bar Chart (5 Cols) */}
        <div className="lg:col-span-5">
          <ProjectAnalyticsChart
            stations={stations}
            onSelectStation={onSelectStation}
            selectedStation={selectedStation}
          />
        </div>

        {/* Middle: Reminders / Priority AI Action (4 Cols) */}
        <div className="lg:col-span-4">
          <RemindersCard
            recommendations={recommendations}
            onDeployRecommendation={onDeployRecommendation}
            onRunOptimization={onRunOptimization}
            isOptimizing={isOptimizing}
          />
        </div>

        {/* Right: Time Tracker Dark Green Card (3 Cols) */}
        <div className="lg:col-span-3">
          <TimeTrackerCard
            simTime={simTime}
            simSeconds={simSeconds}
            isPlaying={isPlaying}
            onTogglePlay={onTogglePlay}
            simSpeed={simSpeed}
            onSetSpeed={onSetSpeed}
            onReset={onReset}
          />
        </div>
      </section>

      {/* 4. Lower Operations Deck: Progress Gauge & AI Decision Stream */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Progress Gauge (4 Cols) */}
        <div className="lg:col-span-4">
          <ProgressGaugeCard
            kpis={kpis}
            currentCase={currentCase}
          />
        </div>

        {/* Live Event Stream (8 Cols) */}
        <div className="lg:col-span-8">
          <DecisionFeed logs={eventLogs} />
        </div>
      </section>

      {/* 5. Master Expansive Line 1 Railway Corridor Map */}
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

      {/* 6. AI Decision Engine Details */}
      <section id="ai-engine-section">
        <AIEnginePanel
          recommendations={recommendations}
          onDeployRecommendation={onDeployRecommendation}
          onRunOptimization={onRunOptimization}
          isOptimizing={isOptimizing}
          currentCase={currentCase}
        />
      </section>

      {/* 7. Fleet Operational Roster */}
      <section id="fleet-section">
        <FleetOverview
          trains={trains}
          onSelectTrain={onSelectTrain}
          selectedTrain={selectedTrain}
        />
      </section>

      {/* 8. Operational Paradigm Case Switcher */}
      <section>
        <CaseSwitcher
          currentCase={currentCase}
          onSelectCase={onSelectCase}
          isTransitioning={isCaseTransitioning}
        />
      </section>

      {/* 9. Contingency Scenarios Simulator */}
      <section id="scenarios-section">
        <ScenarioControlCenter
          activeScenario={activeScenario}
          onSelectScenario={onSelectScenario}
        />
      </section>

      {/* 10. Empirical Performance Benchmark & Comparison */}
      <section id="comparison-section">
        <PerformanceComparison currentCase={currentCase} />
      </section>
    </div>
  );
};
