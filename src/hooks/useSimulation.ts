import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  CaseType, 
  ScenarioType, 
  SensorNode, 
  PipelineSegment, 
  KPISet, 
  LeakAlert, 
  HydraulicEventLog,
  SensorStatus
} from '../types/simulation';
import { 
  INITIAL_STATIONS, 
  INITIAL_TRAINS, 
  CASE_KPIS, 
  INITIAL_AI_RECOMMENDATIONS, 
  INITIAL_AI_LOGS, 
  SCENARIOS 
} from '../data/mockData';

export function useSimulation() {
  const [currentCase, setCurrentCase] = useState<CaseType>('ai');
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('mainline_burst');
  const [trains, setTrains] = useState<SensorNode[]>(INITIAL_TRAINS);
  const [stations, setStations] = useState<PipelineSegment[]>(INITIAL_STATIONS);
  const [kpis, setKpis] = useState<KPISet>(CASE_KPIS.ai);
  const [recommendations, setRecommendations] = useState<LeakAlert[]>(INITIAL_AI_RECOMMENDATIONS);
  const [eventLogs, setEventLogs] = useState<HydraulicEventLog[]>(INITIAL_AI_LOGS);
  
  // Pipeline Simulation State: 'NORMAL' | 'WARNING' | 'LEAK_SUSPECTED'
  const [simulationState, setSimulationState] = useState<'NORMAL' | 'WARNING' | 'LEAK_SUSPECTED'>('LEAK_SUSPECTED');

  // Playback & Clock
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [simSeconds, setSimSeconds] = useState<number>(8 * 3600 + 42 * 60 + 15); // 08:42:15

  // Modal / Drawer Selection
  const [selectedTrain, setSelectedTrain] = useState<SensorNode | null>(null);
  const [selectedStation, setSelectedStation] = useState<PipelineSegment | null>(null);

  // Asynchronous sensor fetch state (simulating real sensor telemetry polling)
  const [isFetchingSensor, setIsFetchingSensor] = useState<boolean>(false);
  const [fetchingSensorId, setFetchingSensorId] = useState<string | null>(null);

  // Hydraulic Solver modal sequence
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationStep, setOptimizationStep] = useState<number>(0);
  const [isCaseTransitioning, setIsCaseTransitioning] = useState<boolean>(false);

  // Formatted simulation time string
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const simTimeString = formatTime(simSeconds);

  // Asynchronous sensor data fetcher with realistic network latency
  const handleSelectSensorAsync = useCallback((sensor: SensorNode) => {
    setIsFetchingSensor(true);
    setFetchingSensorId(sensor.id);

    // Simulate 350ms async gateway query
    setTimeout(() => {
      // Find latest sensor data with slight live jitter
      setTrains(prev => prev.map(s => {
        if (s.id === sensor.id) {
          const jitter = (Math.random() - 0.5) * 0.02;
          return {
            ...s,
            pressureBar: parseFloat((s.pressureBar + jitter).toFixed(2)),
            lastUpdated: 'Just now'
          };
        }
        return s;
      }));

      setSelectedTrain(sensor);
      setIsFetchingSensor(false);
      setFetchingSensorId(null);
    }, 320);
  }, []);

  // Recalculate KPIs based on current case & scenario
  const computeKpis = useCallback((caseType: CaseType, scenario: ScenarioType): KPISet => {
    const base = { ...CASE_KPIS[caseType] };
    if (scenario === 'mainline_burst') {
      if (caseType === 'manual') {
        base.estimatedWaterLossM3h = 94.2;
        base.networkHealthPct = 54;
        base.leakLocalizationAccuracyM = 600;
        base.meanResponseTimeSec = 18000;
      } else if (caseType === 'conventional') {
        base.estimatedWaterLossM3h = 42.0;
        base.networkHealthPct = 72;
        base.leakLocalizationAccuracyM = 150;
        base.meanResponseTimeSec = 3600;
      } else {
        base.estimatedWaterLossM3h = 2.4;
        base.networkHealthPct = 98;
        base.leakLocalizationAccuracyM = 1.2;
        base.meanResponseTimeSec = 42;
      }
    } else if (scenario === 'baseline') {
      if (caseType === 'ai') {
        base.estimatedWaterLossM3h = 0.8;
        base.networkHealthPct = 100;
        base.activeLeaksDetected = 0;
        base.criticalAlerts = 0;
      }
    }
    return base;
  }, []);

  // Handle Scenario Change
  const handleScenarioChange = useCallback((scenarioId: ScenarioType) => {
    setActiveScenario(scenarioId);
    const scenDef = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenDef) return;

    setSimulationState(scenDef.simulationState);

    // Update segment pressures and flows
    setStations(prev => prev.map(station => {
      const mult = scenDef.flowMultiplier[station.id] || 1.0;
      const newActual = Math.round(station.expectedFlowM3h * mult);
      const residual = parseFloat((((newActual - station.expectedFlowM3h) / station.expectedFlowM3h) * 100).toFixed(1));
      
      let status: PipelineSegment['status'] = 'NORMAL';
      if (residual < -6 || station.id === 'S_03_ZONE_Z07' && scenDef.simulationState === 'LEAK_SUSPECTED') {
        status = 'CRITICAL_LEAK';
      } else if (residual < -2 || scenDef.simulationState === 'WARNING') {
        status = 'PRESSURE_DROP';
      }

      return {
        ...station,
        actualFlowM3h: newActual,
        flowResidualPct: residual,
        status
      };
    }));

    // Update sensor statuses
    setTrains(prev => prev.map(sensor => {
      const affected = scenDef.affectedSensors.find(a => a.id === sensor.id);
      if (affected) {
        return {
          ...sensor,
          status: affected.targetStatus,
          lastUpdated: 'Just now'
        };
      }
      return {
        ...sensor,
        status: scenDef.simulationState === 'NORMAL' ? 'NORMAL' : sensor.status
      };
    }));

    // Add log entry
    const newLog: HydraulicEventLog = {
      id: `LOG-SCEN-${Date.now().toString().slice(-4)}`,
      time: formatTime(simSeconds),
      type: 'OPTIMIZATION',
      title: `SCENARIO LOADED: ${scenDef.title.toUpperCase()}`,
      detail: scenDef.description
    };
    setEventLogs(prev => [newLog, ...prev.slice(0, 24)]);

    setKpis(computeKpis(currentCase, scenarioId));
  }, [currentCase, computeKpis, simSeconds]);

  // Handle Paradigm / Case Change
  const handleCaseChange = useCallback((newCase: CaseType) => {
    setIsCaseTransitioning(true);
    setCurrentCase(newCase);
    setKpis(computeKpis(newCase, activeScenario));

    setTimeout(() => {
      setIsCaseTransitioning(false);
    }, 400);
  }, [activeScenario, computeKpis]);

  // Run Hydraulic Optimization Solver (5 Steps)
  const runAIOptimization = useCallback(() => {
    if (isOptimizing) return;
    setIsOptimizing(true);
    setOptimizationStep(1);

    const stepInterval = setInterval(() => {
      setOptimizationStep(prev => {
        if (prev >= 5) {
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsOptimizing(false);
            setOptimizationStep(0);
            
            // Add solver completion log
            const completionLog: HydraulicEventLog = {
              id: `LOG-SOLV-${Date.now().toString().slice(-4)}`,
              time: formatTime(simSeconds),
              type: 'DEPLOYMENT',
              title: 'HYDRAULIC SOLVER CONVERGED (42ms)',
              detail: 'Digital twin converged at 97.4% confidence. Segment S-14 leak pinpointed at Ch. 12+238.4m.'
            };
            setEventLogs(l => [completionLog, ...l.slice(0, 24)]);
          }, 600);
          return 5;
        }
        return prev + 1;
      });
    }, 450);
  }, [isOptimizing, simSeconds]);

  // Deploy / Execute Mitigation Recommendation (e.g. Valve Throttling)
  const handleDeployRecommendation = useCallback((recId: string) => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id === recId) {
        return {
          ...rec,
          status: 'DEPLOYED'
        };
      }
      return rec;
    }));

    // Rebalance sensors
    setTrains(prev => prev.map(s => {
      if (s.id === 'FS-02') {
        return { ...s, status: 'NORMAL', pressureBar: 4.4, flowRateM3h: 910 };
      }
      if (s.id === 'VS-06') {
        return { ...s, status: 'NORMAL', flowRateM3h: 910 };
      }
      return s;
    }));

    // Update segment status
    setStations(prev => prev.map(st => {
      if (st.id === 'S_03_ZONE_Z07') {
        return { ...st, status: 'MONITORING', flowResidualPct: -2.1 };
      }
      return st;
    }));

    setSimulationState('NORMAL');

    const log: HydraulicEventLog = {
      id: `LOG-MIT-${Date.now().toString().slice(-4)}`,
      time: formatTime(simSeconds),
      type: 'DEPLOYMENT',
      title: 'VALVE V-04 MITIGATION EXECUTED',
      detail: 'Pressure head throttled to 35%. Downstream surge suppressed, saving 70 m³/h water loss.'
    };
    setEventLogs(l => [log, ...l.slice(0, 24)]);
  }, [simSeconds]);

  // Reset Simulation to default state
  const resetSimulation = useCallback(() => {
    setTrains(INITIAL_TRAINS);
    setStations(INITIAL_STATIONS);
    setKpis(CASE_KPIS.ai);
    setCurrentCase('ai');
    setActiveScenario('mainline_burst');
    setSimulationState('LEAK_SUSPECTED');
    setRecommendations(INITIAL_AI_RECOMMENDATIONS);
    setEventLogs(INITIAL_AI_LOGS);
    setSimSeconds(8 * 3600 + 42 * 60 + 15);
    setSelectedTrain(null);
    setSelectedStation(null);
  }, []);

  // Clock tick effect
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setSimSeconds(prev => prev + 1);
    }, 1000 / simSpeed);
    return () => clearInterval(timer);
  }, [isPlaying, simSpeed]);

  return {
    currentCase,
    handleCaseChange,
    activeScenario,
    handleScenarioChange,
    trains, // sensors list
    stations, // segments list
    sensors: trains,
    segments: stations,
    kpis,
    recommendations,
    eventLogs,
    simTime: simTimeString,
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
  };
}
