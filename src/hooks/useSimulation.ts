import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  CaseType, 
  ScenarioType, 
  Train, 
  Station, 
  KPISet, 
  AIRecommendation, 
  AIEventLog, 
  StationId 
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
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('baseline');
  const [trains, setTrains] = useState<Train[]>(INITIAL_TRAINS);
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [kpis, setKpis] = useState<KPISet>(CASE_KPIS.ai);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(INITIAL_AI_RECOMMENDATIONS);
  const [eventLogs, setEventLogs] = useState<AIEventLog[]>(INITIAL_AI_LOGS);
  
  // Playback & Clock
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [simSeconds, setSimSeconds] = useState<number>(8 * 3600 + 42 * 60 + 15); // 08:42:15

  // Modal / Drawer Selection
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  // AI Optimization modal sequence
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationStep, setOptimizationStep] = useState<number>(0);
  const [isCaseTransitioning, setIsCaseTransitioning] = useState<boolean>(false);

  // Reference for animation tick
  const lastTickRef = useRef<number>(Date.now());

  // Formatted simulation time string
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const simTimeString = formatTime(simSeconds);

  // Recalculate KPIs based on current case & scenario
  const computeKpis = useCallback((caseType: CaseType, scenario: ScenarioType): KPISet => {
    const base = { ...CASE_KPIS[caseType] };
    if (scenario === 'peak_hour') {
      if (caseType === 'manual') {
        base.avgWaitTimeMin = 14.8;
        base.peakCongestion = 'CRITICAL';
        base.responseTimeMin = 16.0;
        base.headwayConsistencyPct = 48;
      } else if (caseType === 'conventional') {
        base.avgWaitTimeMin = 10.4;
        base.peakCongestion = 'HIGH';
        base.responseTimeMin = 8.5;
        base.headwayConsistencyPct = 70;
      } else {
        base.avgWaitTimeMin = 5.6;
        base.peakCongestion = 'LOW';
        base.responseTimeMin = 0.6;
        base.fleetUtilizationPct = 96;
        base.headwayConsistencyPct = 98;
      }
    } else if (scenario === 'breakdown_t04') {
      if (caseType === 'manual') {
        base.avgWaitTimeMin = 18.2;
        base.peakCongestion = 'CRITICAL';
        base.responseTimeMin = 22.0;
      } else if (caseType === 'conventional') {
        base.avgWaitTimeMin = 12.0;
        base.peakCongestion = 'HIGH';
        base.responseTimeMin = 10.0;
      } else {
        base.avgWaitTimeMin = 6.1;
        base.peakCongestion = 'MEDIUM';
        base.responseTimeMin = 1.1;
        base.headwayConsistencyPct = 92;
      }
    } else if (scenario === 'off_peak') {
      if (caseType === 'ai') {
        base.energyCostIndex = 62;
        base.fleetUtilizationPct = 78;
        base.avgWaitTimeMin = 4.8;
      }
    }
    return base;
  }, []);

  // Handle Case Switching
  const handleCaseChange = (newCase: CaseType) => {
    if (newCase === currentCase) return;
    setIsCaseTransitioning(true);
    setCurrentCase(newCase);
    setKpis(computeKpis(newCase, activeScenario));

    // Log the event
    const now = formatTime(simSeconds);
    const newLog: AIEventLog = {
      id: `LOG-CASE-${Date.now()}`,
      time: now,
      type: 'OPTIMIZATION',
      title: `MODE SWITCHED: ${newCase.toUpperCase()} ARCHITECTURE`,
      detail: newCase === 'ai' 
        ? 'AI Dynamic Induction Engine engaged. Auto-balancing active headway.' 
        : newCase === 'conventional' 
        ? 'Reverted to fixed timetable intervals (Rule-based CBTC).' 
        : 'Operator manual override enabled. Static timetable dispatch.'
    };
    setEventLogs(prev => [newLog, ...prev.slice(0, 24)]);

    setTimeout(() => {
      setIsCaseTransitioning(false);
    }, 600);
  };

  // Handle Scenario Selection
  const handleScenarioChange = (scenarioId: ScenarioType) => {
    setActiveScenario(scenarioId);
    const scenarioDef = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenarioDef) return;

    // 1. Update station loads
    setStations(prev => prev.map(station => {
      const baseStation = INITIAL_STATIONS.find(s => s.id === station.id)!;
      const mult = scenarioDef.demandMultiplier[station.id] || 1.0;
      const newDemand = Math.min(100, Math.round(baseStation.passengerDemandPct * mult));
      const newWaiting = Math.round(baseStation.waitingCount * mult);
      let status: Station['status'] = 'NORMAL';
      if (newDemand >= 90) status = 'SURGE_CRITICAL';
      else if (newDemand >= 75) status = 'HIGH_LOAD';
      else if (station.id === 'EDAPPALLY' && mult > 1.2) status = 'BOTTLENECK';

      return {
        ...station,
        passengerDemandPct: newDemand,
        waitingCount: newWaiting,
        status,
        inflowRatePerMin: Math.round(baseStation.inflowRatePerMin * mult)
      };
    }));

    // 2. Update affected trains
    setTrains(prev => prev.map(train => {
      const affected = scenarioDef.affectedTrains.find(at => at.id === train.id);
      if (affected) {
        if (affected.targetStatus === 'INDUCTING' || affected.targetStatus === 'IN_SERVICE') {
          return {
            ...train,
            status: currentCase === 'ai' ? 'INDUCTING' : (currentCase === 'conventional' ? 'STANDBY' : 'STANDBY'),
            speedKmh: currentCase === 'ai' ? 45 : 0,
            location: currentCase === 'ai' ? 'Depot → Mainline Interlock' : train.location,
            direction: 'DOWN'
          };
        } else if (affected.targetStatus === 'MAINTENANCE') {
          return {
            ...train,
            status: 'MAINTENANCE',
            speedKmh: 0,
            location: 'Kalamassery Siding / Isolated',
            driverStatus: 'MANUAL_OVERRIDE'
          };
        } else if (affected.targetStatus === 'STANDBY') {
          return {
            ...train,
            status: 'STANDBY',
            speedKmh: 0,
            location: 'Muttom Depot Track 4',
            direction: 'DEPOT'
          };
        }
      }
      return train;
    }));

    // 3. Update KPIs
    setKpis(computeKpis(currentCase, scenarioId));

    // 4. Log scenario events
    const now = formatTime(simSeconds);
    const newLog: AIEventLog = {
      id: `LOG-SCENARIO-${Date.now()}`,
      time: now,
      type: scenarioId.includes('breakdown') ? 'WARNING' : 'ANOMALY',
      title: `SCENARIO ACTIVATED: ${scenarioDef.title.toUpperCase()}`,
      detail: scenarioDef.description
    };
    setEventLogs(prev => [newLog, ...prev.slice(0, 24)]);

    // 5. Update recommendations if AI mode
    if (currentCase === 'ai') {
      if (scenarioId === 'peak_hour') {
        const peakRec: AIRecommendation = {
          id: `REC-PEAK-${Date.now()}`,
          timestamp: now,
          trainId: 'T06',
          action: 'INDUCT_FLEET',
          title: 'INDUCT T06 FOR EDAPPALLY PEAK SURGE',
          targetStation: 'EDAPPALLY',
          rationale: 'Passenger surge (+45%) detected. Deploying T06 reduces peak platform congestion.',
          expectedWaitReduction: '-3.2 min wait time',
          confidenceScore: 98.6,
          status: 'PENDING'
        };
        setRecommendations(prev => [peakRec, ...prev]);
      } else if (scenarioId === 'breakdown_t04') {
        const breakdownRec: AIRecommendation = {
          id: `REC-BRK-${Date.now()}`,
          timestamp: now,
          trainId: 'T08',
          action: 'INDUCT_FLEET',
          title: 'HOT-SWAP INDUCT T08 (REPLACE FAULTED T04)',
          targetStation: 'KALAMASSERY',
          rationale: 'T04 traction inverter failure. T08 immediately deployed to preserve 04:30 headway.',
          expectedWaitReduction: '-4.1 min disruption cushion',
          confidenceScore: 99.2,
          status: 'PENDING'
        };
        setRecommendations(prev => [breakdownRec, ...prev]);
      }
    }
  };

  // Trigger Induction Recommendation Action
  const handleDeployRecommendation = (recId: string) => {
    const rec = recommendations.find(r => r.id === recId);
    if (!rec) return;

    setRecommendations(prev => prev.map(r => r.id === recId ? { ...r, status: 'DEPLOYED' } : r));

    // Update the corresponding train to INDUCTING / IN_SERVICE
    setTrains(prev => prev.map(t => {
      if (t.id === rec.trainId) {
        return {
          ...t,
          status: 'INDUCTING',
          speedKmh: 52,
          location: `Inducting → ${rec.targetStation}`,
          direction: 'DOWN',
          trackProgress: 12
        };
      }
      return t;
    }));

    const now = formatTime(simSeconds);
    const newLog: AIEventLog = {
      id: `LOG-DEP-${Date.now()}`,
      time: now,
      type: 'DEPLOYMENT',
      title: `OPERATOR EXECUTED INDUCTION: ${rec.trainId}`,
      detail: `Plan executed: ${rec.title}. Target: ${rec.targetStation}`,
      trainId: rec.trainId
    };
    setEventLogs(prev => [newLog, ...prev.slice(0, 24)]);
  };

  // Run Cinematic AI Optimization Sequence
  const runAIOptimization = () => {
    if (isOptimizing) return;
    setIsOptimizing(true);
    setOptimizationStep(1);

    const steps = [
      { step: 1, delay: 500, title: 'SCANNING RAILWAY NETWORK & TRACK SENSORS...' },
      { step: 2, delay: 1100, title: 'ANALYZING PASSENGER DEMAND & QUEUE GROWTH...' },
      { step: 3, delay: 1800, title: 'CHECKING FLEET READINESS & DEPOT TURNOUT CAPACITY...' },
      { step: 4, delay: 2500, title: 'EVALUATING MAINTENANCE MATRIX & ENERGY CONSUMPTION...' },
      { step: 5, delay: 3200, title: 'GENERATING PARETO-OPTIMAL INDUCTION SCHEDULE...' }
    ];

    steps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setOptimizationStep(step);
      }, delay);
    });

    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationStep(0);

      // Force case to AI if not already
      if (currentCase !== 'ai') {
        setCurrentCase('ai');
      }

      // Re-apply optimal state
      setKpis(CASE_KPIS.ai);

      // Induct T06 and T08 if ready
      setTrains(prev => prev.map(t => {
        if (t.id === 'T06' && (t.status === 'READY_INDUCTION' || t.status === 'STANDBY')) {
          return {
            ...t,
            status: 'IN_SERVICE',
            speedKmh: 58,
            location: 'Mainline → Edappally',
            trackProgress: 36,
            direction: 'DOWN'
          };
        }
        return t;
      }));

      const now = formatTime(simSeconds);
      const optLog: AIEventLog = {
        id: `LOG-OPT-${Date.now()}`,
        time: now,
        type: 'OPTIMIZATION',
        title: 'GLOBAL OPTIMIZATION COMPLETE',
        detail: 'Dynamic induction plan applied. Fleet utilization increased to 91%. Avg wait reduced to 5.2 min.'
      };
      setEventLogs(prev => [optLog, ...prev.slice(0, 24)]);
    }, 3800);
  };

  // Reset Simulation
  const resetSimulation = () => {
    setCurrentCase('ai');
    setActiveScenario('baseline');
    setTrains(INITIAL_TRAINS);
    setStations(INITIAL_STATIONS);
    setKpis(CASE_KPIS.ai);
    setRecommendations(INITIAL_AI_RECOMMENDATIONS);
    setEventLogs(INITIAL_AI_LOGS);
    setSimSeconds(8 * 3600 + 42 * 60 + 15);
    setSelectedTrain(null);
    setSelectedStation(null);
    setIsPlaying(true);
    setSimSpeed(1);
  };

  // Main Simulation Animation Loop (Moves Trains along track)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSimSeconds(prev => prev + simSpeed);

      setTrains(prevTrains => {
        return prevTrains.map(train => {
          if (train.status === 'STANDBY' || train.status === 'MAINTENANCE') {
            return train;
          }

          // In manual mode, simulate slight speed jitter / uneven headway
          let speedFactor = 0.25 * simSpeed;
          if (currentCase === 'manual') {
            speedFactor *= (0.8 + (parseInt(train.id.slice(1), 10) % 3) * 0.25);
          } else if (currentCase === 'ai') {
            speedFactor *= 1.1; // optimized travel
          }

          let newProgress = train.trackProgress;
          let newDirection = train.direction;
          let newLocation = train.location;
          let newCurrentStation = train.currentStationId;
          let newSpeed = train.speedKmh;

          if (train.status === 'INDUCTING') {
            // Train leaving depot and merging onto mainline
            newProgress += speedFactor * 0.8;
            if (newProgress >= 20) {
              return {
                ...train,
                status: 'IN_SERVICE',
                trackProgress: 22,
                direction: 'DOWN',
                location: 'Aluva → Kalamassery',
                speedKmh: 58,
                currentStationId: 'ALUVA'
              };
            }
            return {
              ...train,
              trackProgress: newProgress,
              speedKmh: 42
            };
          }

          if (newDirection === 'DOWN') {
            newProgress += speedFactor;
            if (newProgress >= 96) {
              newProgress = 96;
              newDirection = 'UP';
              newCurrentStation = 'TRIPUNITHURA';
              newLocation = 'Tripunithura (Reversing)';
            } else if (newProgress > 80) {
              newCurrentStation = 'MG_ROAD';
              newLocation = 'MG Road → Tripunithura';
            } else if (newProgress > 64) {
              newCurrentStation = 'KALOOR';
              newLocation = 'Kaloor → MG Road';
            } else if (newProgress > 48) {
              newCurrentStation = 'EDAPPALLY';
              newLocation = 'Edappally → Kaloor';
            } else if (newProgress > 32) {
              newCurrentStation = 'KALAMASSERY';
              newLocation = 'Kalamassery → Edappally';
            } else {
              newCurrentStation = 'ALUVA';
              newLocation = 'Aluva → Kalamassery';
            }
          } else if (newDirection === 'UP') {
            newProgress -= speedFactor;
            if (newProgress <= 18) {
              newProgress = 18;
              newDirection = 'DOWN';
              newCurrentStation = 'ALUVA';
              newLocation = 'Aluva (Reversing)';
            } else if (newProgress < 34) {
              newCurrentStation = 'KALAMASSERY';
              newLocation = 'Kalamassery → Aluva';
            } else if (newProgress < 50) {
              newCurrentStation = 'EDAPPALLY';
              newLocation = 'Edappally → Kalamassery';
            } else if (newProgress < 66) {
              newCurrentStation = 'KALOOR';
              newLocation = 'Kaloor → Edappally';
            } else if (newProgress < 82) {
              newCurrentStation = 'MG_ROAD';
              newLocation = 'MG Road → Kaloor';
            } else {
              newCurrentStation = 'TRIPUNITHURA';
              newLocation = 'Tripunithura → MG Road';
            }
          }

          return {
            ...train,
            trackProgress: newProgress,
            direction: newDirection,
            location: newLocation,
            currentStationId: newCurrentStation,
            speedKmh: newSpeed > 0 ? (50 + Math.round(Math.sin(newProgress) * 12)) : 0
          };
        });
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed, currentCase]);

  // Keep selected train synced with live train state
  useEffect(() => {
    if (selectedTrain) {
      const fresh = trains.find(t => t.id === selectedTrain.id);
      if (fresh) setSelectedTrain(fresh);
    }
  }, [trains]);

  return {
    currentCase,
    handleCaseChange,
    activeScenario,
    handleScenarioChange,
    trains,
    stations,
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
    isOptimizing,
    optimizationStep,
    runAIOptimization,
    handleDeployRecommendation,
    resetSimulation,
    isCaseTransitioning
  };
}
