import { 
  PipelineSegment, 
  SensorNode, 
  KPISet, 
  LeakAlert, 
  HydraulicEventLog, 
  ScenarioDefinition, 
  ChartDataPoint, 
  CaseType
} from '../types/simulation';

export const INITIAL_STATIONS: PipelineSegment[] = [
  {
    id: 'RESERVOIR',
    name: 'TK Halli Cauvery Master Pumping Station & Header',
    code: 'TKH',
    kmPosition: 0.0,
    lengthMeters: 450,
    diameterMm: 900,
    material: 'Prestressed Concrete / Mild Steel Header',
    xPercent: 8,
    yPercent: 20,
    expectedFlowM3h: 1250,
    actualFlowM3h: 1250,
    flowResidualPct: 0,
    inflowPressureBar: 5.8,
    outflowPressureBar: 5.5,
    pressureDropBar: 0.3,
    status: 'NORMAL',
    acousticRiskScore: 6,
    leakProbabilityPct: 3,
    attachedSensors: ['RV-05', 'PT-07']
  },
  {
    id: 'S_01_KENGERI',
    name: 'S-01 Cauvery South Transmission Main (Kengeri Intake)',
    code: 'S-01',
    kmPosition: 3.2,
    lengthMeters: 3200,
    diameterMm: 800,
    material: 'Ductile Iron (Class K9)',
    xPercent: 18,
    yPercent: 55,
    expectedFlowM3h: 1100,
    actualFlowM3h: 1092,
    flowResidualPct: -0.7,
    inflowPressureBar: 5.4,
    outflowPressureBar: 5.1,
    pressureDropBar: 0.3,
    status: 'NORMAL',
    acousticRiskScore: 12,
    leakProbabilityPct: 8,
    attachedSensors: ['PT-07']
  },
  {
    id: 'S_02_RRNAGAR',
    name: 'S-02 Rajarajeshwari Nagar (RR Nagar) Distribution Main',
    code: 'S-02',
    kmPosition: 8.4,
    lengthMeters: 5200,
    diameterMm: 700,
    material: 'Mild Steel Mortar Lined',
    xPercent: 34,
    yPercent: 55,
    expectedFlowM3h: 980,
    actualFlowM3h: 965,
    flowResidualPct: -1.5,
    inflowPressureBar: 5.0,
    outflowPressureBar: 4.7,
    pressureDropBar: 0.3,
    status: 'NORMAL',
    acousticRiskScore: 22,
    leakProbabilityPct: 14,
    attachedSensors: ['VB-04']
  },
  {
    id: 'S_03_ZONE_Z07',
    name: 'S-03 / S-14 Zone Z-07 Distribution Trunk (Primary Monitored)',
    code: 'S-14',
    kmPosition: 13.6,
    lengthMeters: 5200,
    diameterMm: 600,
    material: 'Ductile Iron (Class K9)',
    xPercent: 50,
    yPercent: 55,
    expectedFlowM3h: 930,
    actualFlowM3h: 860,
    flowResidualPct: -7.5,
    inflowPressureBar: 4.8,
    outflowPressureBar: 3.9,
    pressureDropBar: 0.9,
    status: 'CRITICAL_LEAK',
    acousticRiskScore: 94,
    leakProbabilityPct: 97,
    pinpointedLeakDistanceM: 38.4,
    attachedSensors: ['PS-01', 'FS-02', 'AL-03', 'VS-06']
  },
  {
    id: 'S_04_KORAMANGALA',
    name: 'S-04 Koramangala - HSR Ring Main',
    code: 'S-04',
    kmPosition: 17.8,
    lengthMeters: 4200,
    diameterMm: 500,
    material: 'High-Density Polyethylene (PE100)',
    xPercent: 66,
    yPercent: 55,
    expectedFlowM3h: 750,
    actualFlowM3h: 710,
    flowResidualPct: -5.3,
    inflowPressureBar: 4.2,
    outflowPressureBar: 3.7,
    pressureDropBar: 0.5,
    status: 'MONITORING',
    acousticRiskScore: 48,
    leakProbabilityPct: 35,
    attachedSensors: ['AL-08']
  },
  {
    id: 'S_05_MG_ROAD',
    name: 'S-05 MG Road CBD Distribution Feeder (Bengaluru Central)',
    code: 'S-05',
    kmPosition: 21.5,
    lengthMeters: 3700,
    diameterMm: 450,
    material: 'Ductile Iron (Class K9)',
    xPercent: 82,
    yPercent: 55,
    expectedFlowM3h: 620,
    actualFlowM3h: 590,
    flowResidualPct: -4.8,
    inflowPressureBar: 3.8,
    outflowPressureBar: 3.3,
    pressureDropBar: 0.5,
    status: 'MONITORING',
    acousticRiskScore: 56,
    leakProbabilityPct: 42,
    attachedSensors: []
  },
  {
    id: 'S_06_WHITEFIELD',
    name: 'S-06 Whitefield / Mahadevapura Eastern Extension',
    code: 'S-06',
    kmPosition: 26.8,
    lengthMeters: 5300,
    diameterMm: 400,
    material: 'Ductile Iron (Class K9)',
    xPercent: 96,
    yPercent: 55,
    expectedFlowM3h: 420,
    actualFlowM3h: 415,
    flowResidualPct: -1.2,
    inflowPressureBar: 3.2,
    outflowPressureBar: 2.9,
    pressureDropBar: 0.3,
    status: 'NORMAL',
    acousticRiskScore: 16,
    leakProbabilityPct: 9,
    attachedSensors: []
  }
];

export const INITIAL_TRAINS: SensorNode[] = [
  {
    id: 'sensor_1',
    name: 'Sensor 1 (ADXL345 #1)',
    sensorType: 'VIBRATION_SENSOR',
    status: 'NORMAL',
    location: 'Physical Pipeline • Position 50 cm (Midpoint)',
    currentSegmentId: 'S_03_ZONE_Z07',
    chainageKm: 12.2,
    physicalPositionCm: 50,
    hardwareSensorKey: 'sensor_1',
    pressureBar: 4.8,
    flowRateM3h: 930,
    batteryPct: 92,
    signalStrength: 'EXCELLENT',
    rssiDbm: -62,
    lastUpdated: 'Live MQTT',
    temperatureC: 26.4,
    healthScorePct: 100,
    firmwareVersion: 'v1.0-ESP32-ADXL345',
    protocol: 'LoRaWAN',
    xAcc: 0.123,
    yAcc: -0.456,
    zAcc: 9.700,
    vibrationMs2: 0.050,
    history: [
      { time: '08:00', pressure: 4.85, flow: 930 },
      { time: '08:15', pressure: 4.82, flow: 932 },
      { time: '08:30', pressure: 4.80, flow: 928 },
      { time: '08:45', pressure: 4.80, flow: 930 }
    ]
  },
  {
    id: 'sensor_2',
    name: 'Sensor 2 (ADXL345 #2)',
    sensorType: 'VIBRATION_SENSOR',
    status: 'NORMAL',
    location: 'Physical Pipeline • Position 90 cm',
    currentSegmentId: 'S_03_ZONE_Z07',
    chainageKm: 12.85,
    physicalPositionCm: 90,
    hardwareSensorKey: 'sensor_2',
    pressureBar: 4.7,
    flowRateM3h: 925,
    batteryPct: 90,
    signalStrength: 'EXCELLENT',
    rssiDbm: -65,
    lastUpdated: 'Live MQTT',
    temperatureC: 26.8,
    healthScorePct: 100,
    firmwareVersion: 'v1.0-ESP32-ADXL345',
    protocol: 'LoRaWAN',
    xAcc: 0.200,
    yAcc: -0.300,
    zAcc: 9.600,
    vibrationMs2: 0.120,
    history: [
      { time: '08:00', pressure: 4.70, flow: 928 },
      { time: '08:15', pressure: 4.65, flow: 925 },
      { time: '08:30', pressure: 4.10, flow: 880 },
      { time: '08:45', pressure: 3.90, flow: 860 }
    ]
  },
  {
    id: 'AL-03',
    name: 'Acoustic Logger Node 03',
    sensorType: 'ACOUSTIC_LOGGER',
    status: 'NORMAL',
    location: 'Zone Z-07 • Pipeline Segment S-14 (Ch. 12+450m)',
    currentSegmentId: 'S_03_ZONE_Z07',
    chainageKm: 12.45,
    pressureBar: 4.2,
    flowRateM3h: 890,
    batteryPct: 94,
    signalStrength: 'EXCELLENT',
    rssiDbm: -68,
    lastUpdated: '12s ago',
    temperatureC: 25.8,
    healthScorePct: 96,
    firmwareVersion: 'v4.1.0-ACOUSTIC',
    protocol: 'NB-IoT'
  },
  {
    id: 'VB-04',
    name: 'Physical ESP32 Dual Sensor Hub',
    sensorType: 'VIBRATION_SENSOR',
    status: 'NORMAL',
    location: 'Physical Pipeline 100 cm Test Rig (Node 01)',
    currentSegmentId: 'S_03_ZONE_Z07',
    chainageKm: 12.48,
    physicalPositionCm: 50,
    hardwareSensorKey: 'sensor_1',
    pressureBar: 4.8,
    flowRateM3h: 930,
    batteryPct: 98,
    signalStrength: 'EXCELLENT',
    rssiDbm: -54,
    lastUpdated: 'Live telemetry',
    temperatureC: 26.2,
    healthScorePct: 100,
    firmwareVersion: 'v2.0.0-DUAL-ADXL345',
    protocol: 'LoRaWAN'
  },
  {
    id: 'RV-05',
    name: 'TK Halli Cauvery Reservoir Hydrostatic Level Sensor',
    sensorType: 'RESERVOIR_LEVEL',
    status: 'NORMAL',
    location: 'Cauvery Stage IV Master Pumping Station (TK Halli)',
    currentSegmentId: 'RESERVOIR',
    chainageKm: 0.0,
    pressureBar: 5.8,
    flowRateM3h: 1250,
    batteryPct: 98,
    signalStrength: 'EXCELLENT',
    rssiDbm: -60,
    lastUpdated: '5s ago',
    temperatureC: 24.5,
    healthScorePct: 100,
    firmwareVersion: 'v5.0.2-LVL',
    protocol: 'Modbus-RTU'
  },
  {
    id: 'VS-06',
    name: 'Motorized Segment Isolation Valve V-04',
    sensorType: 'CONTROL_VALVE',
    status: 'NORMAL',
    location: 'Zone Z-07 Upstream Isolation Vault (Ch. 12+150m)',
    currentSegmentId: 'S_03_ZONE_Z07',
    chainageKm: 12.15,
    pressureBar: 4.8,
    flowRateM3h: 930,
    batteryPct: 100,
    signalStrength: 'EXCELLENT',
    rssiDbm: -64,
    lastUpdated: 'Just now',
    temperatureC: 26.0,
    healthScorePct: 100,
    firmwareVersion: 'v2.1.0-ACTUATOR',
    protocol: 'Modbus-RTU'
  },
  {
    id: 'PT-07',
    name: 'High-Frequency Pressure Transient Transducer',
    sensorType: 'PRESSURE_TRANSDUCER',
    status: 'NORMAL',
    location: 'Kengeri Booster Pump Discharge (Bengaluru South)',
    currentSegmentId: 'S_01_KENGERI',
    chainageKm: 3.2,
    pressureBar: 5.4,
    flowRateM3h: 1092,
    batteryPct: 89,
    signalStrength: 'GOOD',
    rssiDbm: -74,
    lastUpdated: '18s ago',
    temperatureC: 26.9,
    healthScorePct: 99,
    firmwareVersion: 'v3.2.1-JAL',
    protocol: 'LoRaWAN'
  },
  {
    id: 'AL-08',
    name: 'Acoustic Correlator Node 08',
    sensorType: 'ACOUSTIC_LOGGER',
    status: 'NORMAL',
    location: 'Koramangala Ring Metering Sump (Bengaluru South-East)',
    currentSegmentId: 'S_04_KORAMANGALA',
    chainageKm: 17.8,
    pressureBar: 4.2,
    flowRateM3h: 710,
    batteryPct: 91,
    signalStrength: 'GOOD',
    rssiDbm: -76,
    lastUpdated: '30s ago',
    temperatureC: 26.2,
    healthScorePct: 97,
    firmwareVersion: 'v4.1.0-ACOUSTIC',
    protocol: 'NB-IoT'
  }
];

export const CASE_KPIS: Record<CaseType, KPISet> = {
  manual: {
    totalSegments: 7,
    activeSensors: 4,
    healthySensors: 2,
    warningSensors: 2,
    criticalAlerts: 3,
    activeLeaksDetected: 2,
    estimatedWaterLossM3h: 84.5,
    networkHealthPct: 62,
    leakLocalizationAccuracyM: 450,
    meanResponseTimeSec: 16200, // 4.5 hours
    nrwReductionPct: 14,
    energyCostIndex: 142
  },
  conventional: {
    totalSegments: 7,
    activeSensors: 6,
    healthySensors: 4,
    warningSensors: 2,
    criticalAlerts: 1,
    activeLeaksDetected: 1,
    estimatedWaterLossM3h: 38.2,
    networkHealthPct: 79,
    leakLocalizationAccuracyM: 120,
    meanResponseTimeSec: 2400, // 40 min
    nrwReductionPct: 38,
    energyCostIndex: 118
  },
  ai: {
    totalSegments: 7,
    activeSensors: 8,
    healthySensors: 7,
    warningSensors: 1,
    criticalAlerts: 1,
    activeLeaksDetected: 1,
    estimatedWaterLossM3h: 2.4,
    networkHealthPct: 98,
    leakLocalizationAccuracyM: 1.2,
    meanResponseTimeSec: 42, // 42 seconds
    nrwReductionPct: 74,
    energyCostIndex: 84
  }
};

export const INITIAL_AI_RECOMMENDATIONS: LeakAlert[] = [
  {
    id: 'ALERT-S14-CRIT',
    timestamp: '08:41:10',
    sensorId: 'PS-01',
    segmentId: 'S_03_ZONE_Z07',
    severity: 'CRITICAL',
    title: 'CRITICAL LEAK CONFIRMED ON SEGMENT S-14 (ZONE Z-07)',
    probableLocation: 'Zone Z-07 • Ch. 12+238.4m (38.4m downstream of Sensor A)',
    rationale: 'Acoustic GCC-PHAT cross-correlation confirmed acoustic burst signature with 97.4% confidence. Residual flow gap ΔQ = -70 m³/h between Sensor A (1,000 released / 930 at A) and Sensor B (860 received).',
    estimatedLoss: '70.0 m³/h (Water Loss Risk: High)',
    confidenceScore: 97.4,
    status: 'PENDING',
    recommendedAction: 'Throttle BWSSB Valve V-04 to 35% pressure head and dispatch Bengaluru Rapid Response Acoustic Pinpointer team.'
  },
  {
    id: 'ALERT-S04-WARN',
    timestamp: '08:38:25',
    sensorId: 'AL-08',
    segmentId: 'S_04_KORAMANGALA',
    severity: 'WARNING',
    title: 'MINOR PRESSURE TRANSIENT / CAVITATION ON S-04',
    probableLocation: 'Segment S-04 Koramangala - HSR Ring Main',
    rationale: 'High-frequency pressure transient wave (0.5 bar amplitude) detected during midday valve shifting.',
    estimatedLoss: '1.2 m³/h (Under Investigation)',
    confidenceScore: 88.2,
    status: 'PENDING',
    recommendedAction: 'Adjust BWSSB PRV-02 damping coefficient to absorb pressure surge.'
  },
  {
    id: 'ALERT-RES-NORM',
    timestamp: '08:30:12',
    sensorId: 'RV-05',
    segmentId: 'RESERVOIR',
    severity: 'MONITORING',
    title: 'TK HALLI CAUVERY RESERVOIR INFLOW BALANCED',
    probableLocation: 'TK Halli Master Reservoir (Cauvery Water Supply)',
    rationale: 'Pumping rate synchronized with diurnal urban consumption curve across Bengaluru. NRW loss below threshold.',
    estimatedLoss: 'Zero excess loss',
    confidenceScore: 99.1,
    status: 'DEPLOYED',
    recommendedAction: 'Maintain current variable speed drive (VSD) pump profile.'
  }
];

export const INITIAL_AI_LOGS: HydraulicEventLog[] = [
  {
    id: 'LOG-HYD-101',
    time: '08:41:02',
    type: 'ANOMALY',
    title: 'FLOW RESIDUAL SPIKE DETECTED',
    detail: 'Downstream flow meter FS-02 reports 860 m³/h vs upstream PS-01 930 m³/h (ΔQ = -70 m³/h).',
    segmentId: 'S_03_ZONE_Z07',
    sensorId: 'FS-02'
  },
  {
    id: 'LOG-HYD-102',
    time: '08:41:05',
    type: 'TELEMETRY',
    title: 'PRESSURE GRADIENT ABNORMALITY',
    detail: 'Hydraulic gradient line (HGL) dropped from 4.8 bar to 3.9 bar over 650m pipe span on S-14.',
    sensorId: 'PS-01'
  },
  {
    id: 'LOG-HYD-103',
    time: '08:41:07',
    type: 'CONSTRAINT',
    title: 'HYDRAULIC DIGITAL TWIN COMPUTATION',
    detail: 'Bengaluru network EPANET residual evaluated: Hazen-Williams friction coefficient C=130 intact.'
  },
  {
    id: 'LOG-HYD-104',
    time: '08:41:09',
    type: 'OPTIMIZATION',
    title: 'NARROWED TO SEGMENT S-14 (ZONE Z-07)',
    detail: 'Hydraulic intelligence narrowed probable leak zone to Segment S-14 (Zone Z-07 Bengaluru).'
  },
  {
    id: 'LOG-HYD-105',
    time: '08:41:10',
    type: 'DEPLOYMENT',
    title: 'ACOUSTIC PINPOINTING SOLVED',
    detail: 'GCC-PHAT cross-correlation computed leak at exactly 38.4m downstream of Sensor A (PS-01).',
    segmentId: 'S_03_ZONE_Z07'
  },
  {
    id: 'LOG-HYD-106',
    time: '08:41:14',
    type: 'OPTIMIZATION',
    title: 'BWSSB MITIGATION DISPATCH PREPARED',
    detail: 'Valve V-04 automated throttling instruction ready for operator confirmation.'
  }
];

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'baseline',
    title: '01. Baseline Steady-State Supply',
    badge: 'NORMAL OPERATING',
    description: 'Steady municipal drinking water distribution from Cauvery to Bengaluru reservoirs. Normal pressure profile and zero unaccounted flow residuals across all DMA sectors.',
    iconName: 'Activity',
    flowMultiplier: {
      RESERVOIR: 1.0,
      S_01_KENGERI: 1.0,
      S_02_RRNAGAR: 1.0,
      S_03_ZONE_Z07: 1.0,
      S_04_KORAMANGALA: 1.0,
      S_05_MG_ROAD: 1.0,
      S_06_WHITEFIELD: 1.0
    },
    affectedSensors: [],
    expectedAIAction: 'Hydraulic digital twin verifies balanced Bengaluru water network. Sensors report nominal telemetry.',
    simulationState: 'NORMAL'
  },
  {
    id: 'mainline_burst',
    title: '02. Mainline Burst on Segment S-14 (Zone Z-07)',
    badge: 'CRITICAL LEAK',
    description: 'Severe pipe burst between Sensor A and Sensor B on Segment S-14 in Zone Z-07. Rapid pressure drop and flow loss of 70 m³/h.',
    iconName: 'AlertTriangle',
    flowMultiplier: {
      RESERVOIR: 1.0,
      S_01_KENGERI: 1.0,
      S_02_RRNAGAR: 1.05,
      S_03_ZONE_Z07: 0.92,
      S_04_KORAMANGALA: 0.95,
      S_05_MG_ROAD: 0.96,
      S_06_WHITEFIELD: 1.0
    },
    affectedSensors: [
      { id: 'PS-01', targetStatus: 'NORMAL', note: 'Upstream pressure normal at 4.8 bar' },
      { id: 'FS-02', targetStatus: 'WARNING', note: 'Downstream flow drops from 930 to 860 m³/h' },
      { id: 'AL-03', targetStatus: 'CRITICAL', note: 'Acoustic burst signature detected at 1.8 kHz' }
    ],
    expectedAIAction: 'Instantly narrows to Segment S-14 (Zone Z-07), pinpoints leak at 38.4m from Sensor A with 97.4% confidence, and recommends V-04 valve throttling.',
    simulationState: 'LEAK_SUSPECTED',
    leakDetails: {
      segmentName: 'Segment S-14 (Zone Z-07 Bengaluru)',
      distanceFromSensorAMeters: 38.4,
      estimatedLossM3h: 70.0,
      acousticConfidence: 97.4
    }
  },
  {
    id: 'partial_blockage',
    title: '03. Valve Cavitation & Throttling Anomaly',
    badge: 'WARNING EVENT',
    description: 'Upstream gate valve partial obstruction in RR Nagar feeder causes localized head loss and micro-pressure transients.',
    iconName: 'Wrench',
    flowMultiplier: {
      RESERVOIR: 1.0,
      S_01_KENGERI: 1.0,
      S_02_RRNAGAR: 0.95,
      S_03_ZONE_Z07: 0.96,
      S_04_KORAMANGALA: 0.97,
      S_05_MG_ROAD: 1.0,
      S_06_WHITEFIELD: 1.0
    },
    affectedSensors: [
      { id: 'FS-02', targetStatus: 'WARNING', note: 'Flow turbulence detected' },
      { id: 'VB-04', targetStatus: 'WARNING', note: 'Abnormal high-frequency vibration spike' }
    ],
    expectedAIAction: 'Distinguishes physical blockage from water leak using pressure transient wave reflection analysis.',
    simulationState: 'WARNING'
  },
  {
    id: 'peak_demand',
    title: '04. Peak Diurnal Demand Surge (Bengaluru CBD)',
    badge: 'HIGH DEMAND',
    description: 'Heavy evening municipal water draw in MG Road & Bengaluru CBD commercial zones. Widespread expected pressure dip.',
    iconName: 'TrendingUp',
    flowMultiplier: {
      RESERVOIR: 1.25,
      S_01_KENGERI: 1.2,
      S_02_RRNAGAR: 1.15,
      S_03_ZONE_Z07: 1.1,
      S_04_KORAMANGALA: 1.35,
      S_05_MG_ROAD: 1.45,
      S_06_WHITEFIELD: 1.1
    },
    affectedSensors: [
      { id: 'RV-05', targetStatus: 'NORMAL', note: 'TK Halli booster discharge increased to 1,450 m³/h' }
    ],
    expectedAIAction: 'Hydraulic digital twin predicts dynamic head loss, preventing false positive leak alarms during legitimate high consumption in Bengaluru.',
    simulationState: 'NORMAL'
  },
  {
    id: 'sensor_drift',
    title: '05. Sensor Calibration Drift Isolation',
    badge: 'MAINTENANCE',
    description: 'Sensor B electromagnetic flow meter in Zone Z-07 exhibits continuous -3% offset drift without corresponding pressure drop.',
    iconName: 'Zap',
    flowMultiplier: {
      RESERVOIR: 1.0,
      S_01_KENGERI: 1.0,
      S_02_RRNAGAR: 1.0,
      S_03_ZONE_Z07: 1.0,
      S_04_KORAMANGALA: 1.0,
      S_05_MG_ROAD: 1.0,
      S_06_WHITEFIELD: 1.0
    },
    affectedSensors: [
      { id: 'FS-02', targetStatus: 'CALIBRATING', note: 'Zero-point calibration offset detected' }
    ],
    expectedAIAction: 'Digital twin isolates sensor drift from physical leak using mass-balance residual consistency test.',
    simulationState: 'WARNING'
  },
  {
    id: 'night_minimum_flow',
    title: '06. Minimum Night Flow (MNF) Leak Audit',
    badge: 'ACOUSTIC AUDIT',
    description: '02:00 to 04:00 AM low-noise acoustic window across Bengaluru. Extremely sensitive background leak detection across network.',
    iconName: 'Users',
    flowMultiplier: {
      RESERVOIR: 0.35,
      S_01_KENGERI: 0.35,
      S_02_RRNAGAR: 0.32,
      S_03_ZONE_Z07: 0.38,
      S_04_KORAMANGALA: 0.30,
      S_05_MG_ROAD: 0.28,
      S_06_WHITEFIELD: 0.25
    },
    affectedSensors: [
      { id: 'AL-03', targetStatus: 'NORMAL', note: 'Acoustic noise floor reduced by 18 dB' },
      { id: 'AL-08', targetStatus: 'NORMAL', note: 'Deep cross-correlation scan active' }
    ],
    expectedAIAction: 'Leverages low acoustic noise floor to locate tiny pinhole leaks down to 0.4 m³/h across Cauvery distribution mains.',
    simulationState: 'LEAK_SUSPECTED',
    leakDetails: {
      segmentName: 'Segment S-14 (Zone Z-07 Bengaluru)',
      distanceFromSensorAMeters: 38.4,
      estimatedLossM3h: 2.1,
      acousticConfidence: 98.6
    }
  }
];

export const HISTORICAL_CHART_DATA: ChartDataPoint[] = [
  { time: '08:00', actualFlow: 928, expectedFlow: 930, pressure: 4.85, waterLoss: 0.5 },
  { time: '08:15', actualFlow: 925, expectedFlow: 930, pressure: 4.82, waterLoss: 1.1 },
  { time: '08:30', actualFlow: 890, expectedFlow: 930, pressure: 4.40, waterLoss: 6.8 },
  { time: '08:45', actualFlow: 860, expectedFlow: 930, pressure: 3.90, waterLoss: 12.8 },
  { time: '09:00', actualFlow: 862, expectedFlow: 930, pressure: 3.92, waterLoss: 12.5 },
  { time: '09:15', actualFlow: 885, expectedFlow: 930, pressure: 4.25, waterLoss: 5.2 },
  { time: '09:30', actualFlow: 924, expectedFlow: 930, pressure: 4.78, waterLoss: 1.2 }
];

export const MANUAL_CHART_DATA: ChartDataPoint[] = [
  { time: '08:00', actualFlow: 920, expectedFlow: 930, pressure: 4.8, waterLoss: 14.5 },
  { time: '08:15', actualFlow: 900, expectedFlow: 930, pressure: 4.6, waterLoss: 28.0 },
  { time: '08:30', actualFlow: 870, expectedFlow: 930, pressure: 4.1, waterLoss: 52.0 },
  { time: '08:45', actualFlow: 840, expectedFlow: 930, pressure: 3.6, waterLoss: 78.5 },
  { time: '09:00', actualFlow: 835, expectedFlow: 930, pressure: 3.5, waterLoss: 84.5 },
  { time: '09:15', actualFlow: 840, expectedFlow: 930, pressure: 3.6, waterLoss: 82.0 },
  { time: '09:30', actualFlow: 850, expectedFlow: 930, pressure: 3.8, waterLoss: 74.0 }
];

export const CONVENTIONAL_CHART_DATA: ChartDataPoint[] = [
  { time: '08:00', actualFlow: 925, expectedFlow: 930, pressure: 4.8, waterLoss: 6.0 },
  { time: '08:15', actualFlow: 915, expectedFlow: 930, pressure: 4.7, waterLoss: 12.5 },
  { time: '08:30', actualFlow: 880, expectedFlow: 930, pressure: 4.3, waterLoss: 28.0 },
  { time: '08:45', actualFlow: 865, expectedFlow: 930, pressure: 3.9, waterLoss: 38.2 },
  { time: '09:00', actualFlow: 870, expectedFlow: 930, pressure: 4.0, waterLoss: 36.0 },
  { time: '09:15', actualFlow: 890, expectedFlow: 930, pressure: 4.4, waterLoss: 22.0 },
  { time: '09:30', actualFlow: 910, expectedFlow: 930, pressure: 4.6, waterLoss: 14.0 }
];
