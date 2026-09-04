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
import { RailwayNetwork } from '../railway/RailwayNetwork';
import { AIEnginePanel } from './AIEnginePanel';
import { DecisionFeed } from './DecisionFeed';
import { FleetOverview } from '../fleet/FleetOverview';
import { PerformanceComparison } from '../comparison/PerformanceComparison';
import { RotateCcw, Droplets, FileText } from 'lucide-react';
import { DashboardMode, SimulationScenario } from '../../hooks/useSimulation';
import { PipelineEventState } from '../../config/pipelineConfig';

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
  // Mode-Specific and Real-Time Event Props
  dashboardMode?: DashboardMode;
  onSelectMode?: (mode: DashboardMode) => void;
  selectedSensorKey?: 'sensor_1' | 'sensor_2';
  onSelectSensorKey?: (key: 'sensor_1' | 'sensor_2') => void;
  simulationScenario?: SimulationScenario;
  onSelectSimulationScenario?: (scen: SimulationScenario) => void;
  realTimeEventState?: PipelineEventState;
  simulationState?: 'NORMAL' | 'WARNING' | 'LEAK_SUSPECTED';
  onSetSimulationState?: (state: 'NORMAL' | 'WARNING' | 'LEAK_SUSPECTED') => void;
  isFetchingSensor?: boolean;
  fetchingSensorId?: string | null;
  onSelectSensorAsync?: (sensor: SensorNode) => void;
  onOpenComplaintPortal?: () => void;
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
  dashboardMode = 'REAL',
  onSelectMode,
  selectedSensorKey,
  onSelectSensorKey,
  simulationScenario = 'NORMAL',
  onSelectSimulationScenario,
  realTimeEventState,
  simulationState,
  onSetSimulationState,
  isFetchingSensor,
  fetchingSensorId,
  onSelectSensorAsync,
  onOpenComplaintPortal
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
            Bengaluru&apos;s Cauvery Water Pipeline Network — Dual physical accelerometer test rig, hydraulic digital twin intelligence, and targeted acoustic leak pinpointing.
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
            dashboardMode={dashboardMode}
            realTimeEventState={realTimeEventState}
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

      {/* 1. PIPELINE SIMULATION (Interactive pipeline with Sensor 1 at 50 cm and Sensor 2 at 90 cm) */}
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
          dashboardMode={dashboardMode}
          onSelectMode={onSelectMode}
          selectedSensorKey={selectedSensorKey}
          onSelectSensorKey={onSelectSensorKey}
          simulationScenario={simulationScenario}
          onSelectSimulationScenario={onSelectSimulationScenario}
          realTimeEventState={realTimeEventState}
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
      {/* OTHER DASHBOARD SECTIONS                                                  */}
      {/* ========================================================================= */}

      {/* 4. Sensor Fleet Operational Inventory */}
      <section id="fleet-section">
        <FleetOverview
          trains={trains}
          onSelectTrain={onSelectTrain}
          selectedTrain={selectedTrain}
        />
      </section>

      {/* 5. Citizen Complaint Portal Access Card */}
      {onOpenComplaintPortal && (
        <section id="complaint-access-section" className="donezo-card p-6 border border-[#ECEEF2] bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F7EE] text-[#144230] flex items-center justify-center shadow-2xs">
                <FileText className="w-6 h-6 text-[#144230]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base text-[#111827]">
                    Citizen Grievance &amp; Complaint Portal
                  </h3>
                  <span className="text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded-full bg-[#E8F7EE] text-[#144230] border border-[#B7E4C7]">
                    NEW CIVIC REPORTING
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5 max-w-xl">
                  Notice a visible pipeline leak, burst main, waterlogging, or damaged infrastructure in Bengaluru? Report it directly to the 24x7 JalDrishti civic inspection team.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenComplaintPortal}
              className="px-5 py-2.5 rounded-full bg-[#144230] hover:bg-[#1A543E] text-white font-display font-bold text-xs tracking-wide transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-98"
            >
              <span>Open Complaint Portal</span>
            </button>
          </div>
        </section>
      )}

      {/* 7. Empirical Performance Benchmark & Comparison */}
      <section id="comparison-section">
        <PerformanceComparison currentCase={currentCase} />
      </section>
    </div>
  );
};

export default ControlCentre;
