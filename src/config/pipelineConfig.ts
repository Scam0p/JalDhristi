/**
 * Physical Pipeline Configuration & Real-Time Event Analysis
 * 
 * Centralized configuration for physical pipeline dimensions, sensor placements,
 * vibration threshold rules, and real-time telemetry classification.
 * 
 * Physical length: 100 cm (0 cm to 100 cm)
 * Sensor 1: 50 cm (ADXL345 #1)
 * T-shaped valve / leak branch: 75 cm
 * Sensor 2: 90 cm (ADXL345 #2)
 */

export const PIPELINE_CONFIG = {
  PIPELINE_LENGTH_CM: 100,
  SENSOR_1_POSITION_CM: 50,
  LEAK_POSITION_CM: 75,
  SENSOR_2_POSITION_CM: 90,

  /**
   * Calculate proportional percentage (0 - 100%) along the pipeline.
   */
  getProportionalPercent: (positionCm: number): number => {
    return (positionCm / PIPELINE_CONFIG.PIPELINE_LENGTH_CM) * 100;
  },

  /**
   * Calculate visual SVG X coordinate given pipeline start X and total pixel width.
   */
  getSvgX: (positionCm: number, startX: number, totalWidth: number): number => {
    return startX + (positionCm / PIPELINE_CONFIG.PIPELINE_LENGTH_CM) * totalWidth;
  }
} as const;

export const PIPELINE_LENGTH_CM = PIPELINE_CONFIG.PIPELINE_LENGTH_CM;
export const SENSOR_1_POSITION_CM = PIPELINE_CONFIG.SENSOR_1_POSITION_CM;
export const LEAK_POSITION_CM = PIPELINE_CONFIG.LEAK_POSITION_CM;
export const SENSOR_2_POSITION_CM = PIPELINE_CONFIG.SENSOR_2_POSITION_CM;

// ==========================================
// CENTRALIZED VIBRATION THRESHOLDS (in m/s²)
// ==========================================
export const VIBRATION_THRESHOLDS = {
  /** Stationary baseline upper bound: vibration below this is considered NORMAL */
  NORMAL_BASELINE_MAX: 0.18,
  /** Vibration from 0.18 m/s² up to 0.45 m/s² is flagged as ANOMALY DETECTED */
  ANOMALY_THRESHOLD: 0.18,
  /** Sustained or significant disturbance >= 0.45 m/s² is flagged as POTENTIAL LEAK */
  POTENTIAL_LEAK_THRESHOLD: 0.45,
} as const;

export const NORMAL_VIBRATION_THRESHOLD = VIBRATION_THRESHOLDS.NORMAL_BASELINE_MAX;
export const ANOMALY_VIBRATION_THRESHOLD = VIBRATION_THRESHOLDS.ANOMALY_THRESHOLD;
export const POTENTIAL_LEAK_THRESHOLD = VIBRATION_THRESHOLDS.POTENTIAL_LEAK_THRESHOLD;

// ==========================================
// REAL-TIME EVENT ANALYSIS TYPES
// ==========================================
export type RealTimeCondition = 'NORMAL' | 'ANOMALY DETECTED' | 'POTENTIAL LEAK';

export interface SensorConditionReport {
  sensorKey: 'sensor_1' | 'sensor_2';
  name: string;
  positionCm: number;
  vibration: number;
  x: number;
  y: number;
  z: number;
  condition: RealTimeCondition;
  eventStatus: string;
  isTriggered: boolean;
}

export interface PipelineEventState {
  overall_status: RealTimeCondition;
  active_sensor_id: 'sensor_1' | 'sensor_2' | 'both' | null;
  sensor_position_cm: number | null;
  vibration: number;
  event_type: RealTimeCondition;
  event_message: string;
  timestamp: number;
  sensor_1: SensorConditionReport;
  sensor_2: SensorConditionReport;
}

/**
 * Classifies a single vibration magnitude value according to centralized thresholds.
 */
export function classifyVibration(vibration: number): RealTimeCondition {
  if (vibration >= VIBRATION_THRESHOLDS.POTENTIAL_LEAK_THRESHOLD) {
    return 'POTENTIAL LEAK';
  }
  if (vibration >= VIBRATION_THRESHOLDS.NORMAL_BASELINE_MAX) {
    return 'ANOMALY DETECTED';
  }
  return 'NORMAL';
}

/**
 * Evaluates dual-sensor telemetry to determine which sensor is affected,
 * classifying the real-time event status and compiling individual and overall reports.
 */
export function evaluateRealTimeTelemetry(
  sensor1Data?: { x: number; y: number; z: number; vibration: number } | null,
  sensor2Data?: { x: number; y: number; z: number; vibration: number } | null
): PipelineEventState {
  const s1 = sensor1Data || { x: 0, y: 0, z: 9.81, vibration: 0.05 };
  const s2 = sensor2Data || { x: 0, y: 0, z: 9.81, vibration: 0.05 };

  const s1Condition = classifyVibration(s1.vibration);
  const s2Condition = classifyVibration(s2.vibration);

  const s1Report: SensorConditionReport = {
    sensorKey: 'sensor_1',
    name: 'Sensor 1 (ADXL345 #1)',
    positionCm: SENSOR_1_POSITION_CM,
    vibration: s1.vibration,
    x: s1.x,
    y: s1.y,
    z: s1.z,
    condition: s1Condition,
    eventStatus: s1Condition === 'NORMAL' ? 'Nominal Baseline' : s1Condition,
    isTriggered: s1Condition !== 'NORMAL'
  };

  const s2Report: SensorConditionReport = {
    sensorKey: 'sensor_2',
    name: 'Sensor 2 (ADXL345 #2)',
    positionCm: SENSOR_2_POSITION_CM,
    vibration: s2.vibration,
    x: s2.x,
    y: s2.y,
    z: s2.z,
    condition: s2Condition,
    eventStatus: s2Condition === 'NORMAL' ? 'Nominal Baseline' : s2Condition,
    isTriggered: s2Condition !== 'NORMAL'
  };

  let overall_status: RealTimeCondition = 'NORMAL';
  let active_sensor_id: 'sensor_1' | 'sensor_2' | 'both' | null = null;
  let sensor_position_cm: number | null = null;
  let vibration = Math.max(s1.vibration, s2.vibration);
  let event_message = 'Normal operation: Stationary baseline vibration readings';

  // Priority: POTENTIAL LEAK > ANOMALY DETECTED > NORMAL
  if (s1Condition === 'POTENTIAL LEAK' && s2Condition === 'POTENTIAL LEAK') {
    overall_status = 'POTENTIAL LEAK';
    active_sensor_id = 'both';
    sensor_position_cm = null;
    event_message = `Sensor 1 & Sensor 2: POTENTIAL LEAK (S1: ${s1.vibration.toFixed(3)} m/s², S2: ${s2.vibration.toFixed(3)} m/s²)`;
  } else if (s1Condition === 'POTENTIAL LEAK') {
    overall_status = 'POTENTIAL LEAK';
    active_sensor_id = 'sensor_1';
    sensor_position_cm = SENSOR_1_POSITION_CM;
    vibration = s1.vibration;
    event_message = `Sensor 1: POTENTIAL LEAK (${s1.vibration.toFixed(3)} m/s² at ${SENSOR_1_POSITION_CM} cm)`;
  } else if (s2Condition === 'POTENTIAL LEAK') {
    overall_status = 'POTENTIAL LEAK';
    active_sensor_id = 'sensor_2';
    sensor_position_cm = SENSOR_2_POSITION_CM;
    vibration = s2.vibration;
    event_message = `Sensor 2: POTENTIAL LEAK (${s2.vibration.toFixed(3)} m/s² at ${SENSOR_2_POSITION_CM} cm)`;
  } else if (s1Condition === 'ANOMALY DETECTED' && s2Condition === 'ANOMALY DETECTED') {
    overall_status = 'ANOMALY DETECTED';
    active_sensor_id = 'both';
    sensor_position_cm = null;
    event_message = `Sensor 1 & Sensor 2: ANOMALY DETECTED (S1: ${s1.vibration.toFixed(3)} m/s², S2: ${s2.vibration.toFixed(3)} m/s²)`;
  } else if (s1Condition === 'ANOMALY DETECTED') {
    overall_status = 'ANOMALY DETECTED';
    active_sensor_id = 'sensor_1';
    sensor_position_cm = SENSOR_1_POSITION_CM;
    vibration = s1.vibration;
    event_message = `Sensor 1: ANOMALY DETECTED (${s1.vibration.toFixed(3)} m/s² at ${SENSOR_1_POSITION_CM} cm)`;
  } else if (s2Condition === 'ANOMALY DETECTED') {
    overall_status = 'ANOMALY DETECTED';
    active_sensor_id = 'sensor_2';
    sensor_position_cm = SENSOR_2_POSITION_CM;
    vibration = s2.vibration;
    event_message = `Sensor 2: ANOMALY DETECTED (${s2.vibration.toFixed(3)} m/s² at ${SENSOR_2_POSITION_CM} cm)`;
  }

  return {
    overall_status,
    active_sensor_id,
    sensor_position_cm,
    vibration,
    event_type: overall_status,
    event_message,
    timestamp: Date.now(),
    sensor_1: s1Report,
    sensor_2: s2Report
  };
}

export default PIPELINE_CONFIG;
