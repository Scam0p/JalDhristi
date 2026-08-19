export type CaseType = 'manual' | 'conventional' | 'ai';

export type ScenarioType = 
  | 'baseline' 
  | 'peak_hour' 
  | 'breakdown_t04' 
  | 'event_crowd' 
  | 'maintenance_t02' 
  | 'off_peak';

export type TrainStatus = 
  | 'IN_SERVICE' 
  | 'STANDBY' 
  | 'MAINTENANCE' 
  | 'READY_INDUCTION' 
  | 'INDUCTING' 
  | 'REVERTING';

export type StationId = 
  | 'DEPOT' 
  | 'ALUVA' 
  | 'KALAMASSERY' 
  | 'EDAPPALLY' 
  | 'KALOOR' 
  | 'MG_ROAD' 
  | 'TRIPUNITHURA';

export interface TrainInductionPlan {
  action: 'DEPLOY' | 'HOLD' | 'MAINTAIN' | 'STANDBY';
  targetStation: string;
  plannedTime: string;
  expectedWaitDelta: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  inductionRoute: string;
}

export interface Train {
  id: string; // e.g. 'T01'
  name: string;
  status: TrainStatus;
  location: string;
  currentStationId: StationId;
  direction: 'UP' | 'DOWN' | 'DEPOT';
  speedKmh: number;
  trackProgress: number; // 0 to 100 on main track path
  capacity: number; // e.g. 975
  passengerLoad: number;
  motorTempC: number;
  energyConsumptionKwh: number;
  healthScorePct: number;
  dwellSecondsRemaining: number;
  inductionPlan?: TrainInductionPlan;
  assignedRoute: string;
  driverStatus: 'AUTO_CBTC' | 'MANUAL_OVERRIDE' | 'STANDBY';
}

export interface Station {
  id: StationId;
  name: string;
  code: string;
  kmPosition: number;
  xPercent: number; // SVG horizontal position (0-100)
  yPercent: number; // SVG vertical position (0-100)
  passengerDemandPct: number;
  waitingCount: number;
  platformCapacity: number;
  status: 'NORMAL' | 'HIGH_LOAD' | 'SURGE_CRITICAL' | 'BOTTLENECK';
  inflowRatePerMin: number;
  cctvRiskScore: number;
}

export interface KPISet {
  avgWaitTimeMin: number;
  fleetUtilizationPct: number;
  peakCongestion: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  responseTimeMin: number;
  headwayConsistencyPct: number;
  energyCostIndex: number;
  paxServedTotal: number;
}

export interface AIRecommendation {
  id: string;
  timestamp: string;
  trainId: string;
  action: 'INDUCT_FLEET' | 'REALLOCATE' | 'STANDBY_RESERVE' | 'MAINTENANCE_REROUTE';
  title: string;
  targetStation: string;
  rationale: string;
  expectedWaitReduction: string;
  confidenceScore: number;
  status: 'PENDING' | 'EXECUTING' | 'DEPLOYED' | 'DISMISSED';
}

export interface AIEventLog {
  id: string;
  time: string;
  type: 'ANOMALY' | 'OPTIMIZATION' | 'DEPLOYMENT' | 'CONSTRAINT' | 'TELEMETRY' | 'WARNING';
  title: string;
  detail: string;
  stationId?: StationId;
  trainId?: string;
}

export interface ScenarioDefinition {
  id: ScenarioType;
  title: string;
  badge: string;
  description: string;
  iconName: string;
  demandMultiplier: Record<StationId, number>;
  affectedTrains: { id: string; targetStatus: TrainStatus; note: string }[];
  expectedAIAction: string;
}

export interface ChartDataPoint {
  time: string;
  demand: number;
  trainSupply: number;
  waitTime: number;
  utilization: number;
}
