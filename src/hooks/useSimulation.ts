import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  CaseType, 
  ScenarioType, 
  SensorNode, 
  PipelineSegment, 
  KPISet, 
  LeakAlert, 
  HydraulicEventLog
} from '../types/simulation';
import { 
  INITIAL_STATIONS, 
  INITIAL_TRAINS, 
  CASE_KPIS, 
  INITIAL_AI_RECOMMENDATIONS, 
  INITIAL_AI_LOGS, 
  SCENARIOS 
} from '../data/mockData';
import { 
  evaluateRealTimeTelemetry, 
  PipelineEventState, 
  RealTimeCondition,
  SENSOR_1_POSITION_CM,
  SENSOR_2_POSITION_CM,
  LEAK_POSITION_CM
} from '../config/pipelineConfig';
import { useHardwareTelemetry } from './useHardwareTelemetry';

export type DashboardMode = 'REAL' | 'SIMULATION';
export type SimulationScenario = 'NORMAL' | 'ANOMALY' | 'LEAK' | null;
export type SystemCycleState = 0 | 1 | 2;

export function useSimulation() {
  // Operational Mode: REAL MODE (default on fresh load) vs SIMULATION MODE
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>('REAL');

  // Centralized selected sensor state: 'sensor_1' (50 cm) vs 'sensor_2' (90 cm)
  const [selectedSensorKey, setSelectedSensorKey] = useState<'sensor_1' | 'sensor_2'>('sensor_1');

  // Simulation Mode Scenarios: 'NORMAL' | 'ANOMALY' | 'LEAK' | null
  // In REAL MODE: simulationScenario is null.
  // In SIMULATION MODE: 'NORMAL' | 'LEAK' (or 'ANOMALY' internally).
  const [simulationScenario, setSimulationScenario] = useState<SimulationScenario>(null);

  // Discreet 3-State Cycle Controller (Triggered by System Settings in Sidebar):
  // Initial / Fresh Load: State 2 (REAL MODE, scenario = null)
  // Click 1: State 0 (SIMULATION MODE, scenario = NORMAL)
  // Click 2: State 1 (SIMULATION MODE, scenario = LEAK)
  // Click 3: State 2 (REAL MODE, scenario = null)
  // Cycle repeats indefinitely: (state + 1) % 3
  const [systemCycleState, setSystemCycleState] = useState<SystemCycleState>(2);
  const [modeToast, setModeToast] = useState<{ message: string; type: 'REAL' | 'NORMAL' | 'LEAK'; id: number } | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [currentCase, setCurrentCase] = useState<CaseType>('ai');
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('mainline_burst');
  const [trains, setTrains] = useState<SensorNode[]>(INITIAL_TRAINS);
  const [stations, setStations] = useState<PipelineSegment[]>(INITIAL_STATIONS);
  const [kpis, setKpis] = useState<KPISet>(CASE_KPIS.ai);
  const [recommendations, setRecommendations] = useState<LeakAlert[]>(INITIAL_AI_RECOMMENDATIONS);
  const [eventLogs, setEventLogs] = useState<HydraulicEventLog[]>(INITIAL_AI_LOGS);
  
  // Pipeline Simulation State: 'NORMAL' | 'WARNING' | 'LEAK_SUSPECTED'
  const [simulationState, setSimulationState] = useState<'NORMAL' | 'WARNING' | 'LEAK_SUSPECTED'>('NORMAL');

  // Playback & Clock
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [simSeconds, setSimSeconds] = useState<number>(8 * 3600 + 42 * 60 + 15); // 08:42:15

  // Modal / Drawer Selection
  const [selectedTrain, setSelectedTrain] = useState<SensorNode | null>(null);
  const [selectedStation, setSelectedStation] = useState<PipelineSegment | null>(null);

  // Asynchronous sensor fetch state
  const [isFetchingSensor, setIsFetchingSensor] = useState<boolean>(false);
  const [fetchingSensorId, setFetchingSensorId] = useState<string | null>(null);

  // Hydraulic Solver modal sequence
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationStep, setOptimizationStep] = useState<number>(0);
  const [isCaseTransitioning, setIsCaseTransitioning] = useState<boolean>(false);

  // Live Hardware Telemetry Connection
  const hardwareTelemetry = useHardwareTelemetry(1000);
  const { latestTelemetry, connectionStatus } = hardwareTelemetry;

  // Track previous event condition to trigger logs on state changes
  const prevEventConditionRef = useRef<RealTimeCondition>('NORMAL');

  // Formatted simulation time string
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const simTimeString = formatTime(simSeconds);

  // Evaluated Real-Time Event State based on current Mode
  const realTimeEventState: PipelineEventState = useMemo(() => {
    if (dashboardMode === 'REAL') {
      return evaluateRealTimeTelemetry(latestTelemetry?.sensor_1, latestTelemetry?.sensor_2);
    }

    // SIMULATION MODE scenarios
    if (simulationScenario === 'LEAK') {
      return {
        overall_status: 'POTENTIAL LEAK' as const,
        active_sensor_id: 'sensor_2' as const,
        sensor_position_cm: LEAK_POSITION_CM, // 75 cm T-valve leak
        vibration: 0.650,
        event_type: 'POTENTIAL LEAK' as const,
        event_message: 'SIMULATED POTENTIAL LEAK AT 75 CM T-VALVE BRANCH',
        timestamp: Date.now(),
        sensor_1: {
          sensorKey: 'sensor_1',
          name: 'Sensor 1 (ADXL345 #1)',
          positionCm: SENSOR_1_POSITION_CM,
          vibration: 0.280,
          x: 0.210,
          y: -0.180,
          z: 9.750,
          condition: 'ANOMALY DETECTED',
          eventStatus: 'ANOMALY DETECTED',
          isTriggered: true
        },
        sensor_2: {
          sensorKey: 'sensor_2',
          name: 'Sensor 2 (ADXL345 #2)',
          positionCm: SENSOR_2_POSITION_CM,
          vibration: 0.650,
          x: 0.520,
          y: -0.390,
          z: 10.120,
          condition: 'POTENTIAL LEAK',
          eventStatus: 'POTENTIAL LEAK',
          isTriggered: true
        }
      };
    } else if (simulationScenario === 'ANOMALY') {
      return {
        overall_status: 'ANOMALY DETECTED' as const,
        active_sensor_id: 'sensor_1' as const,
        sensor_position_cm: SENSOR_1_POSITION_CM,
        vibration: 0.320,
        event_type: 'ANOMALY DETECTED' as const,
        event_message: 'Sensor 1: ANOMALY DETECTED (0.320 m/s² at 50 cm)',
        timestamp: Date.now(),
        sensor_1: {
          sensorKey: 'sensor_1',
          name: 'Sensor 1 (ADXL345 #1)',
          positionCm: SENSOR_1_POSITION_CM,
          vibration: 0.320,
          x: 0.280,
          y: -0.210,
          z: 9.850,
          condition: 'ANOMALY DETECTED',
          eventStatus: 'ANOMALY DETECTED',
          isTriggered: true
        },
        sensor_2: {
          sensorKey: 'sensor_2',
          name: 'Sensor 2 (ADXL345 #2)',
          positionCm: SENSOR_2_POSITION_CM,
          vibration: 0.065,
          x: 0.035,
          y: -0.045,
          z: 9.810,
          condition: 'NORMAL',
          eventStatus: 'Nominal Baseline',
          isTriggered: false
        }
      };
    } else {
      return {
        overall_status: 'NORMAL' as const,
        active_sensor_id: null,
        sensor_position_cm: null,
        vibration: 0.050,
        event_type: 'NORMAL' as const,
        event_message: 'Normal operation: Stationary baseline vibration readings',
        timestamp: Date.now(),
        sensor_1: {
          sensorKey: 'sensor_1',
          name: 'Sensor 1 (ADXL345 #1)',
          positionCm: SENSOR_1_POSITION_CM,
          vibration: 0.050,
          x: 0.020,
          y: -0.030,
          z: 9.810,
          condition: 'NORMAL',
          eventStatus: 'Nominal Baseline',
          isTriggered: false
        },
        sensor_2: {
          sensorKey: 'sensor_2',
          name: 'Sensor 2 (ADXL345 #2)',
          positionCm: SENSOR_2_POSITION_CM,
          vibration: 0.060,
          x: 0.025,
          y: -0.040,
          z: 9.800,
          condition: 'NORMAL',
          eventStatus: 'Nominal Baseline',
          isTriggered: false
        }
      };
    }
  }, [dashboardMode, simulationScenario, latestTelemetry]);

  // Synchronize REAL MODE telemetry with trains state
  useEffect(() => {
    if (dashboardMode === 'REAL' && latestTelemetry) {
      const evalState = evaluateRealTimeTelemetry(latestTelemetry.sensor_1, latestTelemetry.sensor_2);
      
      setTrains(prev => prev.map(s => {
        if (s.id === 'sensor_1' || s.hardwareSensorKey === 'sensor_1') {
          const s1Cond = evalState.sensor_1.condition;
          return {
            ...s,
            status: s1Cond === 'POTENTIAL LEAK' ? 'CRITICAL' : s1Cond === 'ANOMALY DETECTED' ? 'WARNING' : 'NORMAL',
            vibrationMs2: latestTelemetry.sensor_1.vibration,
            xAcc: latestTelemetry.sensor_1.x,
            yAcc: latestTelemetry.sensor_1.y,
            zAcc: latestTelemetry.sensor_1.z,
            lastUpdated: 'Live MQTT'
          };
        }
        if (s.id === 'sensor_2' || s.hardwareSensorKey === 'sensor_2') {
          const s2Cond = evalState.sensor_2.condition;
          return {
            ...s,
            status: s2Cond === 'POTENTIAL LEAK' ? 'CRITICAL' : s2Cond === 'ANOMALY DETECTED' ? 'WARNING' : 'NORMAL',
            vibrationMs2: latestTelemetry.sensor_2.vibration,
            xAcc: latestTelemetry.sensor_2.x,
            yAcc: latestTelemetry.sensor_2.y,
            zAcc: latestTelemetry.sensor_2.z,
            lastUpdated: 'Live MQTT'
          };
        }
        return s;
      }));

      // Update simulation state for pipeline coloring
      if (evalState.overall_status === 'POTENTIAL LEAK') {
        setSimulationState('LEAK_SUSPECTED');
      } else if (evalState.overall_status === 'ANOMALY DETECTED') {
        setSimulationState('WARNING');
      } else {
        setSimulationState('NORMAL');
      }

      // Log event state transitions
      if (evalState.overall_status !== prevEventConditionRef.current) {
        if (evalState.overall_status !== 'NORMAL') {
          const newLog: HydraulicEventLog = {
            id: `LOG-EVT-${Date.now().toString().slice(-4)}`,
            time: formatTime(simSeconds),
            type: evalState.overall_status === 'POTENTIAL LEAK' ? 'WARNING' : 'ANOMALY',
            title: `REAL SENSOR EVENT: ${evalState.overall_status}`,
            detail: evalState.event_message
          };
          setEventLogs(prev => [newLog, ...prev.slice(0, 24)]);
        } else {
          const normalLog: HydraulicEventLog = {
            id: `LOG-NORM-${Date.now().toString().slice(-4)}`,
            time: formatTime(simSeconds),
            type: 'DEPLOYMENT',
            title: 'PHYSICAL RIG STABILIZED',
            detail: 'All physical sensors returned to baseline stationary vibration limits.'
          };
          setEventLogs(prev => [normalLog, ...prev.slice(0, 24)]);
        }
        prevEventConditionRef.current = evalState.overall_status;
      }
    }
  }, [dashboardMode, latestTelemetry, simSeconds]);

  // Handle Mode Change (REAL MODE vs SIMULATION MODE)
  const handleModeChange = useCallback((newMode: DashboardMode) => {
    setDashboardMode(newMode);
    if (newMode === 'REAL') {
      // In REAL MODE: no simulated scenario is active
      setSimulationScenario(null);
      setSimulationState('NORMAL');
      const log: HydraulicEventLog = {
        id: `LOG-MODE-${Date.now().toString().slice(-4)}`,
        time: formatTime(simSeconds),
        type: 'OPTIMIZATION',
        title: 'REAL MODE ENGAGED',
        detail: 'Dashboard switched to live physical ESP32 dual ADXL345 sensor telemetry. Simulated scenarios disabled.'
      };
      setEventLogs(prev => [log, ...prev.slice(0, 24)]);
    } else {
      // In SIMULATION MODE: reset to current scenario
      const log: HydraulicEventLog = {
        id: `LOG-MODE-${Date.now().toString().slice(-4)}`,
        time: formatTime(simSeconds),
        type: 'OPTIMIZATION',
        title: 'SIMULATION MODE ENGAGED',
        detail: 'Interactive scenario testing mode active. Select Normal, Anomaly, or Leak (at 75 cm T-valve).'
      };
      setEventLogs(prev => [log, ...prev.slice(0, 24)]);
    }
  }, [simSeconds]);

  // Handle Simulation Scenario Change (SIMULATION MODE ONLY)
  const handleSimulationScenarioChange = useCallback((scenario: SimulationScenario) => {
    setSimulationScenario(scenario);
    if (scenario === 'NORMAL') {
      setSimulationState('NORMAL');
      setTrains(prev => prev.map(s => ({
        ...s,
        status: 'NORMAL',
        vibrationMs2: s.id === 'sensor_1' ? 0.05 : s.id === 'sensor_2' ? 0.06 : s.vibrationMs2
      })));
      setStations(prev => prev.map(st => ({ ...st, status: 'NORMAL', flowResidualPct: 0 })));
      const newLog: HydraulicEventLog = {
        id: `LOG-SCEN-${Date.now().toString().slice(-4)}`,
        time: formatTime(simSeconds),
        type: 'OPTIMIZATION',
        title: 'SCENARIO LOADED: NORMAL OPERATION',
        detail: 'Baseline simulation parameters across 100 cm pipeline.'
      };
      setEventLogs(prev => [newLog, ...prev.slice(0, 24)]);
    } else if (scenario === 'ANOMALY') {
      setSimulationState('WARNING');
      setTrains(prev => prev.map(s => {
        if (s.id === 'sensor_1' || s.hardwareSensorKey === 'sensor_1') {
          return { ...s, status: 'WARNING', vibrationMs2: 0.32 };
        }
        return s;
      }));
      const newLog: HydraulicEventLog = {
        id: `LOG-SCEN-${Date.now().toString().slice(-4)}`,
        time: formatTime(simSeconds),
        type: 'ANOMALY',
        title: 'SCENARIO LOADED: ANOMALY (SENSOR 1 AT 50 CM)',
        detail: 'Simulated vibration anomaly injected on Sensor 1 (50 cm midpoint).'
      };
      setEventLogs(prev => [newLog, ...prev.slice(0, 24)]);
    } else if (scenario === 'LEAK') {
      setSimulationState('LEAK_SUSPECTED');
      setTrains(prev => prev.map(s => {
        if (s.id === 'sensor_1' || s.hardwareSensorKey === 'sensor_1') {
          return { ...s, status: 'WARNING', vibrationMs2: 0.28 };
        }
        if (s.id === 'sensor_2' || s.hardwareSensorKey === 'sensor_2') {
          return { ...s, status: 'CRITICAL', vibrationMs2: 0.65 };
        }
        return s;
      }));
      setStations(prev => prev.map(st => {
        if (st.id === 'S_03_ZONE_Z07') {
          return { ...st, status: 'CRITICAL_LEAK', flowResidualPct: -7.5 };
        }
        return st;
      }));
      const newLog: HydraulicEventLog = {
        id: `LOG-SCEN-${Date.now().toString().slice(-4)}`,
        time: formatTime(simSeconds),
        type: 'WARNING',
        title: 'SCENARIO LOADED: POTENTIAL LEAK AT 75 CM T-VALVE',
        detail: 'Simulated potential leak injected at physical T-shaped valve position (75 cm) along 100 cm pipeline.'
      };
      setEventLogs(prev => [newLog, ...prev.slice(0, 24)]);
    }
  }, [simSeconds]);

  // Discreet 3-State Mode Controller (Triggered by System Settings):
  // Initial / Fresh Load: State 2 (REAL MODE, scenario = null)
  // Click 1: State 0 (SIMULATION MODE, scenario = NORMAL)
  // Click 2: State 1 (SIMULATION MODE, scenario = LEAK)
  // Click 3: State 2 (REAL MODE, scenario = null)
  // Repeating cycle: (state + 1) % 3
  const cycleSystemMode = useCallback(() => {
    setSystemCycleState(prev => {
      const next = ((prev + 1) % 3) as SystemCycleState;

      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }

      if (next === 0) {
        // STATE 0: SIMULATION MODE, SCENARIO = NORMAL
        setDashboardMode('SIMULATION');
        handleSimulationScenarioChange('NORMAL');
        setModeToast({ message: 'Simulation: Normal', type: 'NORMAL', id: Date.now() });
      } else if (next === 1) {
        // STATE 1: SIMULATION MODE, SCENARIO = LEAK
        setDashboardMode('SIMULATION');
        handleSimulationScenarioChange('LEAK');
        setModeToast({ message: 'Simulation: Leak', type: 'LEAK', id: Date.now() });
      } else {
        // STATE 2: REAL MODE
        handleModeChange('REAL');
        setModeToast({ message: 'Real Mode Active', type: 'REAL', id: Date.now() });
      }

      toastTimerRef.current = setTimeout(() => {
        setModeToast(null);
      }, 2200);

      return next;
    });
  }, [handleModeChange, handleSimulationScenarioChange]);

  // Asynchronous sensor data fetcher with realistic network latency
  const handleSelectSensorAsync = useCallback((sensor: SensorNode) => {
    setIsFetchingSensor(true);
    setFetchingSensorId(sensor.id);

    setTimeout(() => {
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

  // Handle Contingency Scenario Change
  const handleScenarioChange = useCallback((scenarioId: ScenarioType) => {
    setActiveScenario(scenarioId);
    const scenDef = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenDef) return;

    if (dashboardMode === 'SIMULATION') {
      setSimulationState(scenDef.simulationState);
    }

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

    if (dashboardMode === 'SIMULATION') {
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
    }

    const newLog: HydraulicEventLog = {
      id: `LOG-SCEN-${Date.now().toString().slice(-4)}`,
      time: formatTime(simSeconds),
      type: 'OPTIMIZATION',
      title: `SCENARIO LOADED: ${scenDef.title.toUpperCase()}`,
      detail: scenDef.description
    };
    setEventLogs(prev => [newLog, ...prev.slice(0, 24)]);

    setKpis(computeKpis(currentCase, scenarioId));
  }, [currentCase, computeKpis, simSeconds, dashboardMode]);

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
            
            const completionLog: HydraulicEventLog = {
              id: `LOG-SOLV-${Date.now().toString().slice(-4)}`,
              time: formatTime(simSeconds),
              type: 'DEPLOYMENT',
              title: 'HYDRAULIC SOLVER CONVERGED (42ms)',
              detail: 'Digital twin converged at 97.4% confidence. Pipeline 75 cm T-valve acoustic signature pinpointed.'
            };
            setEventLogs(l => [completionLog, ...l.slice(0, 24)]);
          }, 600);
          return 5;
        }
        return prev + 1;
      });
    }, 450);
  }, [isOptimizing, simSeconds]);

  // Deploy / Execute Mitigation Recommendation
  const handleDeployRecommendation = useCallback((recId: string) => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id === recId) {
        return { ...rec, status: 'DEPLOYED' };
      }
      return rec;
    }));

    setTrains(prev => prev.map(s => {
      if (s.id === 'FS-02' || s.id === 'sensor_2') {
        return { ...s, status: 'NORMAL', pressureBar: 4.4, flowRateM3h: 910 };
      }
      return s;
    }));

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
    setSimulationState('NORMAL');
    setSimulationScenario(null);
    setSystemCycleState(2);
    setDashboardMode('REAL');
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
    dashboardMode,
    setDashboardMode: handleModeChange,
    selectedSensorKey,
    setSelectedSensorKey,
    simulationScenario,
    setSimulationScenario: handleSimulationScenarioChange,
    systemCycleState,
    cycleSystemMode,
    modeToast,
    dismissModeToast: () => setModeToast(null),
    realTimeEventState,
    hardwareTelemetry,
    currentCase,
    handleCaseChange,
    activeScenario,
    handleScenarioChange,
    trains,
    stations,
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
