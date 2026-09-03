import React from 'react';
import { 
  CaseType, 
  ScenarioType, 
  SensorNode, 
  PipelineSegment, 
  KPISet, 
  LeakAlert, 
  HydraulicEventLog 
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
import { RotateCcw, Droplets } from 'lucide-react';

interface ControlCentreProps {
  currentCase: CaseType;
  onSelectCase: (c: CaseType) => void;
  activeScenario: ScenarioType;
  onSelectScenario: (s: ScenarioType) => void;
  trains: SensorNode[];
  stations: PipelineSegment[];
  kpis: KPISet;
  recommendations: LeakAlert[];
  eventLogs: HydraulicEventLog[];
  simTime: string;
  simSeconds: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  simSpeed: number;
  onSetSpeed: (speed: number) => void;
  onSelectTrain: (sensor: SensorNode) => void;
  onSelectStation: (segment: PipelineSegment) => void;
  selectedTrain: SensorNode | null;
  selectedStation: PipelineSegment | null;
  onRunOptimization: () => void;
  isOptimizing: boolean;
  onDeployRecommendation: (id: string) => void;
  onReset: () => void;
  isCaseTransitioning: boolean;
  // JalDrishti interactive extension props
  simulationState?: 'NORMAL' | 'WARNING' | 'LEAK_SUSPECTED';
  onSetSimulationState?: (state: 'NORMAL' | 'WARNING' | 'LEAK_SUSPECTED') => void;
  isFetchingSensor?: boolean;
  fetchingSensorId?: string | null;
  onSelectSensorAsync?: (sensor: SensorNode) => void;
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
  isCaseTransitioning,
  simulationState,
  onSetSimulationState,
  isFetchingSensor,
  fetchingSensorId,
  onSelectSensorAsync
}) => {
  return (
    <div id="control-deck" className="space-y-8 max-w-7xl mx-auto select-none">
      {/* 1. Dashboard Page Header (Donezo layout) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-extrabold text-3xl text-[#111827] tracking-tight">
              JalDrishti Operations Deck
            </h1>
            <span className="text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded-full bg-[#E8F7EE] text-[#144230] border border-[#B7E4C7]">
              BENGALURU • CAUVERY NETWORK
            </span>
          </div>
          <p className="text-sm text-[#6B7280] font-normal mt-0.5">
            Bengaluru&apos;s Cauvery Water Pipeline Network — Sparse sensor monitoring, hydraulic digital twin intelligence, and targeted acoustic leak pinpointing.
          </p>
        </div>

        {/* Action Buttons (Solid Forest Green Pill + White Border Pill) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRunOptimization}
            disabled={isOptimizing}
            className="px-5 py-2.5 rounded-full bg-[#144230] hover:bg-[#1A543E] text-white font-display font-bold text-xs tracking-wide transition-all shadow-sm cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Droplets className="w-4 h-4 text-[#22C55E]" />
            <span>{isOptimizing ? 'Pinpointing Leak...' : 'Run Hydraulic Solver'}</span>
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

      {/* ========================================================================= */}
      {/* REQUIRED REORDERED CORE WORKFLOW SECTIONS                                  */}
      {/* 1. PIPELINE SIMULATION -> 2. HYDRAULIC EVENTS -> 3. TELEMETRY STREAM     */}
      {/* ========================================================================= */}

      {/* 1. PIPELINE SIMULATION (Interactive pipeline with Sensor A and Sensor B) */}
      <section id="pipeline-section">
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
          simulationState={simulationState}
          onSetSimulationState={onSetSimulationState}
          isFetchingSensor={isFetchingSensor}
          fetchingSensorId={fetchingSensorId}
          onSelectSensorAsync={onSelectSensorAsync}
        />
      </section>

      {/* 2. HYDRAULIC EVENTS (Hydraulic Events & Digital Twin Intelligence) */}
      <section id="hydraulic-events-section">
        <AIEnginePanel
          recommendations={recommendations}
          onDeployRecommendation={onDeployRecommendation}
          onRunOptimization={onRunOptimization}
          isOptimizing={isOptimizing}
          currentCase={currentCase}
        />
      </section>

      {/* 3. TELEMETRY STREAM (Real-Time Telemetry Stream & NRW Progress Gauge) */}
      <section id="telemetry-stream-section" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Water Balance & NRW Progress Gauge (4 Cols) */}
        <div className="lg:col-span-4">
          <ProgressGaugeCard
            kpis={kpis}
            currentCase={currentCase}
          />
        </div>

        {/* Real-time Telemetry Stream & Event Log (8 Cols) */}
        <div className="lg:col-span-8">
          <DecisionFeed logs={eventLogs} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* OTHER EXISTING DASHBOARD SECTIONS (Preserved)                             */}
      {/* ========================================================================= */}

      {/* 4. Sensor Fleet Operational Inventory */}
      <section id="fleet-section">
        <FleetOverview
          trains={trains}
          onSelectTrain={onSelectTrain}
          selectedTrain={selectedTrain}
        />
      </section>

      {/* 5. Operational Paradigm Case Switcher */}
      <section id="cases-section">
        <CaseSwitcher
          currentCase={currentCase}
          onSelectCase={onSelectCase}
          isTransitioning={isCaseTransitioning}
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
