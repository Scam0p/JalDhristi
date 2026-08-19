import { Station, Train, KPISet, AIRecommendation, AIEventLog, ScenarioDefinition, ChartDataPoint, CaseType } from '../types/simulation';

export const INITIAL_STATIONS: Station[] = [
  {
    id: 'DEPOT',
    name: 'Muttom Maintenance Depot',
    code: 'DPT',
    kmPosition: -2.5,
    xPercent: 8,
    yPercent: 20,
    passengerDemandPct: 0,
    waitingCount: 0,
    platformCapacity: 1000,
    status: 'NORMAL',
    inflowRatePerMin: 0,
    cctvRiskScore: 4
  },
  {
    id: 'ALUVA',
    name: 'Aluva',
    code: 'ALV',
    kmPosition: 0.0,
    xPercent: 18,
    yPercent: 55,
    passengerDemandPct: 81,
    waitingCount: 340,
    platformCapacity: 600,
    status: 'HIGH_LOAD',
    inflowRatePerMin: 42,
    cctvRiskScore: 68
  },
  {
    id: 'KALAMASSERY',
    name: 'Kalamassery',
    code: 'KLM',
    kmPosition: 7.2,
    xPercent: 34,
    yPercent: 55,
    passengerDemandPct: 62,
    waitingCount: 195,
    platformCapacity: 500,
    status: 'NORMAL',
    inflowRatePerMin: 26,
    cctvRiskScore: 35
  },
  {
    id: 'EDAPPALLY',
    name: 'Edappally',
    code: 'EDP',
    kmPosition: 12.8,
    xPercent: 50,
    yPercent: 55,
    passengerDemandPct: 94,
    waitingCount: 485,
    platformCapacity: 650,
    status: 'SURGE_CRITICAL',
    inflowRatePerMin: 68,
    cctvRiskScore: 92
  },
  {
    id: 'KALOOR',
    name: 'Kaloor',
    code: 'KLR',
    kmPosition: 16.4,
    xPercent: 66,
    yPercent: 55,
    passengerDemandPct: 76,
    waitingCount: 310,
    platformCapacity: 600,
    status: 'HIGH_LOAD',
    inflowRatePerMin: 38,
    cctvRiskScore: 62
  },
  {
    id: 'MG_ROAD',
    name: 'MG Road',
    code: 'MGR',
    kmPosition: 20.1,
    xPercent: 82,
    yPercent: 55,
    passengerDemandPct: 88,
    waitingCount: 420,
    platformCapacity: 700,
    status: 'HIGH_LOAD',
    inflowRatePerMin: 54,
    cctvRiskScore: 78
  },
  {
    id: 'TRIPUNITHURA',
    name: 'Tripunithura',
    code: 'TPN',
    kmPosition: 25.6,
    xPercent: 96,
    yPercent: 55,
    passengerDemandPct: 34,
    waitingCount: 115,
    platformCapacity: 550,
    status: 'NORMAL',
    inflowRatePerMin: 14,
    cctvRiskScore: 18
  }
];

export const INITIAL_TRAINS: Train[] = [
  {
    id: 'T01',
    name: 'Trainset Alpha-01',
    status: 'IN_SERVICE',
    location: 'Aluva → Kalamassery',
    currentStationId: 'ALUVA',
    direction: 'DOWN',
    speedKmh: 62,
    trackProgress: 24,
    capacity: 975,
    passengerLoad: 780,
    motorTempC: 58,
    energyConsumptionKwh: 142,
    healthScorePct: 98,
    dwellSecondsRemaining: 0,
    assignedRoute: 'MAINLINE UP/DOWN',
    driverStatus: 'AUTO_CBTC'
  },
  {
    id: 'T02',
    name: 'Trainset Bravo-02',
    status: 'STANDBY',
    location: 'Muttom Depot Track 3',
    currentStationId: 'DEPOT',
    direction: 'DEPOT',
    speedKmh: 0,
    trackProgress: 0,
    capacity: 975,
    passengerLoad: 0,
    motorTempC: 32,
    energyConsumptionKwh: 12,
    healthScorePct: 94,
    dwellSecondsRemaining: 0,
    assignedRoute: 'DEPOT RESERVE',
    driverStatus: 'STANDBY'
  },
  {
    id: 'T03',
    name: 'Trainset Charlie-03',
    status: 'IN_SERVICE',
    location: 'Edappally Platform 2',
    currentStationId: 'EDAPPALLY',
    direction: 'DOWN',
    speedKmh: 0,
    trackProgress: 50,
    capacity: 975,
    passengerLoad: 920,
    motorTempC: 64,
    energyConsumptionKwh: 168,
    healthScorePct: 96,
    dwellSecondsRemaining: 18,
    assignedRoute: 'MAINLINE UP/DOWN',
    driverStatus: 'AUTO_CBTC'
  },
  {
    id: 'T04',
    name: 'Trainset Delta-04',
    status: 'IN_SERVICE',
    location: 'Kalamassery → Aluva',
    currentStationId: 'KALAMASSERY',
    direction: 'UP',
    speedKmh: 54,
    trackProgress: 30,
    capacity: 975,
    passengerLoad: 610,
    motorTempC: 72,
    energyConsumptionKwh: 155,
    healthScorePct: 88,
    dwellSecondsRemaining: 0,
    assignedRoute: 'MAINLINE UP/DOWN',
    driverStatus: 'AUTO_CBTC'
  },
  {
    id: 'T05',
    name: 'Trainset Echo-05',
    status: 'IN_SERVICE',
    location: 'Kaloor → MG Road',
    currentStationId: 'KALOOR',
    direction: 'DOWN',
    speedKmh: 58,
    trackProgress: 72,
    capacity: 975,
    passengerLoad: 840,
    motorTempC: 61,
    energyConsumptionKwh: 148,
    healthScorePct: 97,
    dwellSecondsRemaining: 0,
    assignedRoute: 'MAINLINE UP/DOWN',
    driverStatus: 'AUTO_CBTC'
  },
  {
    id: 'T06',
    name: 'Trainset Foxtrot-06',
    status: 'READY_INDUCTION',
    location: 'Muttom Induction Siding A',
    currentStationId: 'DEPOT',
    direction: 'DEPOT',
    speedKmh: 0,
    trackProgress: 4,
    capacity: 975,
    passengerLoad: 0,
    motorTempC: 38,
    energyConsumptionKwh: 22,
    healthScorePct: 100,
    dwellSecondsRemaining: 0,
    inductionPlan: {
      action: 'DEPLOY',
      targetStation: 'EDAPPALLY',
      plannedTime: '08:42:00',
      expectedWaitDelta: '-2.9 min',
      priority: 'CRITICAL',
      inductionRoute: 'DEPOT → VIA ALUVA FLYOVER → EDAPPALLY JUNCTION'
    },
    assignedRoute: 'HOT STANDBY / AI INDUCTION READY',
    driverStatus: 'STANDBY'
  },
  {
    id: 'T07',
    name: 'Trainset Golf-07',
    status: 'IN_SERVICE',
    location: 'MG Road → Tripunithura',
    currentStationId: 'MG_ROAD',
    direction: 'DOWN',
    speedKmh: 60,
    trackProgress: 88,
    capacity: 975,
    passengerLoad: 560,
    motorTempC: 59,
    energyConsumptionKwh: 139,
    healthScorePct: 99,
    dwellSecondsRemaining: 0,
    assignedRoute: 'MAINLINE UP/DOWN',
    driverStatus: 'AUTO_CBTC'
  },
  {
    id: 'T08',
    name: 'Trainset Hotel-08',
    status: 'READY_INDUCTION',
    location: 'Muttom Induction Siding B',
    currentStationId: 'DEPOT',
    direction: 'DEPOT',
    speedKmh: 0,
    trackProgress: 2,
    capacity: 975,
    passengerLoad: 0,
    motorTempC: 30,
    energyConsumptionKwh: 15,
    healthScorePct: 100,
    dwellSecondsRemaining: 0,
    inductionPlan: {
      action: 'DEPLOY',
      targetStation: 'MG_ROAD',
      plannedTime: '08:48:30',
      expectedWaitDelta: '-1.8 min',
      priority: 'HIGH',
      inductionRoute: 'DEPOT → FAST EXPRESS TO CBD'
    },
    assignedRoute: 'COLD STANDBY RESERVE',
    driverStatus: 'STANDBY'
  }
];

export const CASE_KPIS: Record<CaseType, KPISet> = {
  manual: {
    avgWaitTimeMin: 11.4,
    fleetUtilizationPct: 63,
    peakCongestion: 'HIGH',
    responseTimeMin: 12.0,
    headwayConsistencyPct: 58,
    energyCostIndex: 138,
    paxServedTotal: 18450
  },
  conventional: {
    avgWaitTimeMin: 8.1,
    fleetUtilizationPct: 74,
    peakCongestion: 'MEDIUM',
    responseTimeMin: 7.0,
    headwayConsistencyPct: 76,
    energyCostIndex: 118,
    paxServedTotal: 22100
  },
  ai: {
    avgWaitTimeMin: 5.2,
    fleetUtilizationPct: 91,
    peakCongestion: 'LOW',
    responseTimeMin: 0.8,
    headwayConsistencyPct: 96,
    energyCostIndex: 88,
    paxServedTotal: 27480
  }
};

export const INITIAL_AI_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 'REC-0841-A',
    timestamp: '08:41:10',
    trainId: 'T06',
    action: 'INDUCT_FLEET',
    title: 'INDUCT T06 → EDAPPALLY SURGE',
    targetStation: 'EDAPPALLY',
    rationale: 'Edappally platform load at 94% with 485 waiting pax. Headway gap 07:10 detected.',
    expectedWaitReduction: '-2.9 min network-wide',
    confidenceScore: 97.4,
    status: 'PENDING'
  },
  {
    id: 'REC-0841-B',
    timestamp: '08:41:22',
    trainId: 'T08',
    action: 'STANDBY_RESERVE',
    title: 'PRIME T08 ON SIDING B',
    targetStation: 'MG ROAD',
    rationale: 'Pre-positioning for anticipated CBD business district surge at 09:00.',
    expectedWaitReduction: '-1.4 min peak cushion',
    confidenceScore: 92.1,
    status: 'PENDING'
  },
  {
    id: 'REC-0840-C',
    timestamp: '08:40:05',
    trainId: 'T02',
    action: 'MAINTENANCE_REROUTE',
    title: 'HOLD T02 FOR SCHEDULED BRAKE CHECK',
    targetStation: 'DEPOT',
    rationale: 'Preventive mileage threshold reached. Replaced in line by T05 dynamic speed adjustment.',
    expectedWaitReduction: 'Zero delay penalty',
    confidenceScore: 99.0,
    status: 'DEPLOYED'
  }
];

export const INITIAL_AI_LOGS: AIEventLog[] = [
  {
    id: 'LOG-101',
    time: '08:41:03',
    type: 'ANOMALY',
    title: 'DEMAND SPIKE DETECTED',
    detail: 'Edappally Station load increased to 94% (+28% vs schedule baseline)',
    stationId: 'EDAPPALLY'
  },
  {
    id: 'LOG-102',
    time: '08:41:06',
    type: 'TELEMETRY',
    title: 'FLEET TELEMETRY REFRESHED',
    detail: '7/8 active trainsets reporting valid CBTC telemetry. Health index 96.8%'
  },
  {
    id: 'LOG-103',
    time: '08:41:08',
    type: 'CONSTRAINT',
    title: 'CONSTRAINT MATRIX EVALUATION',
    detail: 'Depot turnout capacity: OK | Track headway buffer: 02:45 min | Power grid margin: 18%'
  },
  {
    id: 'LOG-104',
    time: '08:41:10',
    type: 'OPTIMIZATION',
    title: 'PARETO-OPTIMAL INDUCTION SOLVED',
    detail: 'Simulated 1,420 permutations in 42ms. Selected Plan ID #KMR-2026-88'
  },
  {
    id: 'LOG-105',
    time: '08:41:11',
    type: 'DEPLOYMENT',
    title: 'INDUCTION DISPATCH: T06',
    detail: 'Trainset Foxtrot-06 cleared for mainline entry towards Edappally. ETA 4.5 min',
    trainId: 'T06'
  },
  {
    id: 'LOG-106',
    time: '08:41:14',
    type: 'OPTIMIZATION',
    title: 'HEADWAY COMPRESSION STABILIZED',
    detail: 'Target headway reduced from 07:15 to 04:30 min. Waiting backlog clearing.'
  }
];

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'baseline',
    title: '01. Baseline Morning Peak',
    badge: 'DEFAULT',
    description: 'Standard weekday commuter morning. High steady demand across Aluva to MG Road.',
    iconName: 'Activity',
    demandMultiplier: {
      DEPOT: 1.0,
      ALUVA: 1.0,
      KALAMASSERY: 1.0,
      EDAPPALLY: 1.0,
      KALOOR: 1.0,
      MG_ROAD: 1.0,
      TRIPUNITHURA: 1.0
    },
    affectedTrains: [],
    expectedAIAction: 'Optimal synchronous headway balance (4m 30s) maintained.'
  },
  {
    id: 'peak_hour',
    title: '02. Sudden Demand Surge (Edappally)',
    badge: 'HIGH DEMAND',
    description: 'Heavy passenger spike at Edappally & Kaloor junction (+35% queue surge).',
    iconName: 'TrendingUp',
    demandMultiplier: {
      DEPOT: 1.0,
      ALUVA: 1.1,
      KALAMASSERY: 1.15,
      EDAPPALLY: 1.45,
      KALOOR: 1.35,
      MG_ROAD: 1.2,
      TRIPUNITHURA: 1.0
    },
    affectedTrains: [
      { id: 'T06', targetStatus: 'INDUCTING', note: 'AI triggers immediate induction from Muttom depot siding' }
    ],
    expectedAIAction: 'Instantly deploys T06 from Depot to inject 975-pax surge capacity at Edappally.'
  },
  {
    id: 'breakdown_t04',
    title: '03. Train Breakdown (T04 Traction Fault)',
    badge: 'CRITICAL EVENT',
    description: 'Train T04 suffers inverter breakdown near Kalamassery. Track clearance initiated.',
    iconName: 'AlertTriangle',
    demandMultiplier: {
      DEPOT: 1.0,
      ALUVA: 1.25,
      KALAMASSERY: 1.4,
      EDAPPALLY: 1.3,
      KALOOR: 1.1,
      MG_ROAD: 1.0,
      TRIPUNITHURA: 1.0
    },
    affectedTrains: [
      { id: 'T04', targetStatus: 'MAINTENANCE', note: 'Emergency stop & limp-to-depot mode activated' },
      { id: 'T08', targetStatus: 'INDUCTING', note: 'AI hot-swaps T08 into schedule to fill headway gap' }
    ],
    expectedAIAction: 'Isolates T04, accelerates T01/T05 speeds, and induces T08 to eliminate passenger delay.'
  },
  {
    id: 'event_crowd',
    title: '04. MG Road Stadium / Event Crowd',
    badge: 'EVENT SPECIAL',
    description: 'Sudden festival/cricket match egress at JLN Stadium / Kaloor & MG Road CBD.',
    iconName: 'Users',
    demandMultiplier: {
      DEPOT: 1.0,
      ALUVA: 0.9,
      KALAMASSERY: 1.0,
      EDAPPALLY: 1.2,
      KALOOR: 1.6,
      MG_ROAD: 1.55,
      TRIPUNITHURA: 1.2
    },
    affectedTrains: [
      { id: 'T06', targetStatus: 'INDUCTING', note: 'Short-loop service between Edappally & MG Road' },
      { id: 'T08', targetStatus: 'INDUCTING', note: 'High-density express deployment' }
    ],
    expectedAIAction: 'Configures dynamic short-looping shuttle service between Kaloor and MG Road.'
  },
  {
    id: 'maintenance_t02',
    title: '05. Maintenance Constraint Locking',
    badge: 'CONSTRAINT',
    description: 'Depot informs T02 and T04 require compulsory 30-day bogie inspection window.',
    iconName: 'Wrench',
    demandMultiplier: {
      DEPOT: 1.0,
      ALUVA: 1.0,
      KALAMASSERY: 1.0,
      EDAPPALLY: 1.0,
      KALOOR: 1.0,
      MG_ROAD: 1.0,
      TRIPUNITHURA: 1.0
    },
    affectedTrains: [
      { id: 'T02', targetStatus: 'MAINTENANCE', note: 'Locked in Depot Bay 4 for inspection' },
      { id: 'T04', targetStatus: 'MAINTENANCE', note: 'Scheduled ultrasonic wheel inspection' }
    ],
    expectedAIAction: 'Rebalances timetable using remaining 6 active trainsets with 0% penalty on peak capacity.'
  },
  {
    id: 'off_peak',
    title: '06. Off-Peak Energy Optimization',
    badge: 'ECO MODE',
    description: 'Midday passenger demand drops by 45%. System enters energy conservation mode.',
    iconName: 'Zap',
    demandMultiplier: {
      DEPOT: 1.0,
      ALUVA: 0.6,
      KALAMASSERY: 0.55,
      EDAPPALLY: 0.65,
      KALOOR: 0.6,
      MG_ROAD: 0.7,
      TRIPUNITHURA: 0.4
    },
    affectedTrains: [
      { id: 'T01', targetStatus: 'IN_SERVICE', note: 'Regenerative braking profile optimized' },
      { id: 'T06', targetStatus: 'STANDBY', note: 'Recalled to Depot to save traction power' }
    ],
    expectedAIAction: 'Recalls surplus trainsets to depot sidings, saving 340 kWh/hr while keeping wait times <6 min.'
  }
];

export const HISTORICAL_CHART_DATA: ChartDataPoint[] = [
  { time: '08:00', demand: 45, trainSupply: 50, waitTime: 6.2, utilization: 68 },
  { time: '08:15', demand: 62, trainSupply: 60, waitTime: 6.8, utilization: 74 },
  { time: '08:30', demand: 84, trainSupply: 75, waitTime: 7.9, utilization: 82 },
  { time: '08:45', demand: 96, trainSupply: 95, waitTime: 5.2, utilization: 92 },
  { time: '09:00', demand: 91, trainSupply: 92, waitTime: 5.1, utilization: 90 },
  { time: '09:15', demand: 78, trainSupply: 80, waitTime: 5.4, utilization: 86 },
  { time: '09:30', demand: 60, trainSupply: 65, waitTime: 5.0, utilization: 79 }
];

export const MANUAL_CHART_DATA: ChartDataPoint[] = [
  { time: '08:00', demand: 45, trainSupply: 40, waitTime: 9.8, utilization: 55 },
  { time: '08:15', demand: 62, trainSupply: 45, waitTime: 11.2, utilization: 60 },
  { time: '08:30', demand: 84, trainSupply: 50, waitTime: 13.6, utilization: 68 },
  { time: '08:45', demand: 96, trainSupply: 55, waitTime: 14.8, utilization: 72 },
  { time: '09:00', demand: 91, trainSupply: 60, waitTime: 12.5, utilization: 70 },
  { time: '09:15', demand: 78, trainSupply: 60, waitTime: 10.8, utilization: 65 },
  { time: '09:30', demand: 60, trainSupply: 55, waitTime: 9.5, utilization: 61 }
];

export const CONVENTIONAL_CHART_DATA: ChartDataPoint[] = [
  { time: '08:00', demand: 45, trainSupply: 48, waitTime: 7.5, utilization: 65 },
  { time: '08:15', demand: 62, trainSupply: 55, waitTime: 8.2, utilization: 70 },
  { time: '08:30', demand: 84, trainSupply: 68, waitTime: 9.6, utilization: 76 },
  { time: '08:45', demand: 96, trainSupply: 72, waitTime: 10.4, utilization: 80 },
  { time: '09:00', demand: 91, trainSupply: 75, waitTime: 8.9, utilization: 78 },
  { time: '09:15', demand: 78, trainSupply: 70, waitTime: 7.8, utilization: 74 },
  { time: '09:30', demand: 60, trainSupply: 65, waitTime: 7.2, utilization: 71 }
];
