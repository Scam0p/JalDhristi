export type CaseType = 'manual' | 'conventional' | 'ai';

export type ScenarioType = 
  | 'baseline' 
  | 'mainline_burst' 
  | 'partial_blockage' 
  | 'peak_demand' 
  | 'sensor_drift' 
  | 'night_minimum_flow';

export type SensorStatus = 
  | 'NORMAL' 
  | 'WARNING' 
  | 'CRITICAL' 
  | 'CALIBRATING' 
  | 'STANDBY';

export type SensorType = 
  | 'PRESSURE_TRANSDUCER' 
  | 'ELECTROMAGNETIC_FLOW_METER' 
  | 'ACOUSTIC_LOGGER' 
  | 'VIBRATION_SENSOR' 
  | 'RESERVOIR_LEVEL' 
  | 'CONTROL_VALVE';

export type SegmentId = 
  | 'RESERVOIR' 
  | 'S_01_KENGERI' 
  | 'S_02_RRNAGAR' 
  | 'S_03_ZONE_Z07' 
  | 'S_04_KORAMANGALA' 
  | 'S_05_MG_ROAD' 
  | 'S_06_WHITEFIELD';

export interface MitigationPlan {
  action: 'ISOLATE_VALVE' | 'PRESSURE_REDUCE' | 'ACOUSTIC_VALIDATION' | 'STANDBY_LOGGER';
  targetSegment: string;
  plannedTime: string;
  expectedLossReduction: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  isolationRoute: string;
}

export interface TelemetryPoint {
  time: string;
  pressure: number;
  flow: number;
}

export interface SensorNode {
  id: string; // e.g. 'PS-01', 'FS-02'
  name: string;
  sensorType: SensorType;
  status: SensorStatus;
  location: string;
  currentSegmentId: SegmentId;
  chainageKm: number; // position in km
  pressureBar: number;
  flowRateM3h: number;
  batteryPct: number;
  signalStrength: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'DEGRADED';
  rssiDbm: number;
  lastUpdated: string;
  temperatureC: number;
  healthScorePct: number;
  mitigationPlan?: MitigationPlan;
  history?: TelemetryPoint[];
  firmwareVersion: string;
  protocol: 'LoRaWAN' | 'NB-IoT' | 'Modbus-RTU';
  physicalPositionCm?: number; // Physical pipeline position in cm (e.g. 50 cm or 90 cm)
  hardwareSensorKey?: 'sensor_1' | 'sensor_2'; // MQTT dual-sensor hardware key
  xAcc?: number; // Acceleration X in m/s²
  yAcc?: number; // Acceleration Y in m/s²
  zAcc?: number; // Acceleration Z in m/s²
  vibrationMs2?: number; // Vibration magnitude in m/s²
}

export interface PipelineSegment {
  id: SegmentId;
  name: string;
  code: string;
  kmPosition: number;
  lengthMeters: number;
  diameterMm: number;
  material: string;
  xPercent: number; // SVG horizontal position (0-100)
  yPercent: number; // SVG vertical position (0-100)
  expectedFlowM3h: number;
  actualFlowM3h: number;
  flowResidualPct: number; // (actual - expected) / expected
  inflowPressureBar: number;
  outflowPressureBar: number;
  pressureDropBar: number;
  status: 'NORMAL' | 'MONITORING' | 'PRESSURE_DROP' | 'CRITICAL_LEAK';
  acousticRiskScore: number;
  leakProbabilityPct: number;
  pinpointedLeakDistanceM?: number;
  attachedSensors: string[];
}

export interface KPISet {
  totalSegments: number;
  activeSensors: number;
  healthySensors: number;
  warningSensors: number;
  criticalAlerts: number;
  activeLeaksDetected: number;
  estimatedWaterLossM3h: number;
  networkHealthPct: number;
  leakLocalizationAccuracyM: number;
  meanResponseTimeSec: number;
  nrwReductionPct: number;
  energyCostIndex: number;
}

export interface LeakAlert {
  id: string;
  timestamp: string;
  sensorId: string;
  segmentId: SegmentId;
  severity: 'CRITICAL' | 'WARNING' | 'MONITORING';
  title: string;
  probableLocation: string;
  rationale: string;
  estimatedLoss: string;
  confidenceScore: number;
  status: 'PENDING' | 'ISOLATING' | 'DEPLOYED' | 'DISMISSED';
  recommendedAction: string;
}

export interface HydraulicEventLog {
  id: string;
  time: string;
  type: 'ANOMALY' | 'OPTIMIZATION' | 'DEPLOYMENT' | 'CONSTRAINT' | 'TELEMETRY' | 'WARNING';
  title: string;
  detail: string;
  segmentId?: SegmentId;
  sensorId?: string;
}

export interface ScenarioDefinition {
  id: ScenarioType;
  title: string;
  badge: string;
  description: string;
  iconName: string;
  flowMultiplier: Record<SegmentId, number>;
  affectedSensors: { id: string; targetStatus: SensorStatus; note: string }[];
  expectedAIAction: string;
  simulationState: 'NORMAL' | 'WARNING' | 'LEAK_SUSPECTED';
  leakDetails?: {
    segmentName: string;
    distanceFromSensorAMeters: number;
    estimatedLossM3h: number;
    acousticConfidence: number;
  };
}

export interface ChartDataPoint {
  time: string;
  actualFlow: number;
  expectedFlow: number;
  pressure: number;
  waterLoss: number;
}

// Aliases for compatibility
export type Train = SensorNode;
export type Station = PipelineSegment;
export type AIRecommendation = LeakAlert;
export type AIEventLog = HydraulicEventLog;
export type StationId = SegmentId;
