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
import { WaterStorageTankCard } from './WaterStorageTankCard';
import { RailwayNetwork } from '../railway/RailwayNetwork';
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
  selectedSensorKey?: 'sensor_1' | 'sensor_2';
  onSelectSensorKey?: (key: 'sensor_1' | 'sensor_2') => void;
  simulationScenario?: SimulationScenario;
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
  selectedSensorKey,
  onSelectSensorKey,
  simulationScenario = null,
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
      {/* 1. SCADA Operations Deck Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#E5E7EB]">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-mono-tech font-bold text-xl md:text-2xl text-[#111827] tracking-tight">
              JALDRISHTI SCADA CONTROL CENTRE
            </h1>
            <span className="text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]">
              CAUVERY TRANSMISSION ZONE Z-07
            </span>
          </div>
          <p className="text-xs text-[#6B7280] font-mono-tech mt-1">
            BWSSB Pipeline Telemetry Network • Dual ADXL345 Instrumentation Test Rig (100 cm) • Acoustic Leak Pinpointing Engine
          </p>
        </div>

        {/* Operator Action Buttons (Rectangular SCADA Engineering Buttons) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onRunOptimization}
            disabled={isOptimizing}
            className="px-3.5 py-2 rounded-md bg-[#144230] hover:bg-[#1A543E] text-white font-mono-tech font-bold text-xs tracking-wider transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 border border-[#0D2D20]"
          >
            <Droplets className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>{isOptimizing ? 'SOLVER RUNNING...' : 'RUN HYDRAULIC SOLVER'}</span>
          </button>

          <button
            onClick={onReset}
            className="px-3.5 py-2 rounded-md bg-white hover:bg-[#F9FAFB] text-[#111827] border border-[#D1D5DB] font-mono-tech font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>RESET RIG</span>
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
          selectedSensorKey={selectedSensorKey}
          onSelectSensorKey={onSelectSensorKey}
          simulationScenario={simulationScenario}
          realTimeEventState={realTimeEventState}
          simulationState={simulationState}
          onSetSimulationState={onSetSimulationState}
          isFetchingSensor={isFetchingSensor}
          fetchingSensorId={fetchingSensorId}
          onSelectSensorAsync={onSelectSensorAsync}
        />
      </section>

      {/* 2. STORAGE TANK & SCADA TELEMETRY STREAM */}
      <section id="telemetry-stream-section" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Physical Water Storage Tank (5 Cols) */}
        <div className="lg:col-span-5">
          <WaterStorageTankCard
            tankId="TANK-01"
            tankName="STORAGE RESERVOIR"
            levelPct={72}
            capacityL={500}
            status="NORMAL"
          />
        </div>

        {/* Real-time Telemetry Stream & Event Log (7 Cols) */}
        <div className="lg:col-span-7">
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

      {/* 5. Citizen Grievance Portal Access Card */}
      {onOpenComplaintPortal && (
        <section id="complaint-access-section" className="donezo-card p-4 border border-[#E5E7EB] bg-white rounded-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-md bg-[#E8F7EE] text-[#144230] border border-[#B7E4C7] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[#144230]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-mono-tech font-bold text-sm text-[#111827] uppercase tracking-wide">
                    Citizen Grievance &amp; Field Incident Portal
                  </h3>
                  <span className="text-[10px] font-mono-tech font-bold px-1.5 py-0.5 rounded bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]">
                    CIVIC TELEMETRY
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] font-mono-tech mt-0.5 max-w-xl">
                  Log field inspection reports, visible bursts, pipe fractures, or waterlogging directly into the JalDrishti civic operations queue.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenComplaintPortal}
              className="px-4 py-2 rounded-md bg-[#144230] hover:bg-[#1A543E] text-white font-mono-tech font-bold text-xs tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-[#0D2D20]"
            >
              <span>OPEN COMPLAINT PORTAL</span>
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
