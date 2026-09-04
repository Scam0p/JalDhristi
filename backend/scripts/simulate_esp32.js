#!/usr/bin/env node
/**
 * JalDrishti ESP32 Hardware Simulator / Test Publisher
 * 
 * Simulates physical dual ADXL345 vibration packets in m/s²:
 * - Stationary baseline ~9.81 m/s² on Z-axis (gravity), low vibration ~0.02 - 0.08 m/s²
 * - Sensor 1 at 50 cm
 * - Sensor 2 at 90 cm
 * 
 * Flags:
 *   --s1-anomaly    Shake / vibrate Sensor 1 only (0.28 - 0.38 m/s²)
 *   --s1-leak       Sustained disturbance on Sensor 1 only (0.55 - 0.75 m/s²)
 *   --s2-anomaly    Shake / vibrate Sensor 2 only (0.28 - 0.38 m/s²)
 *   --s2-leak       Sustained disturbance on Sensor 2 only (0.55 - 0.75 m/s²)
 *   --anomaly / -a  Shake both sensors
 * 
 * Usage:
 *   node backend/scripts/simulate_esp32.js
 *   node backend/scripts/simulate_esp32.js --s1-anomaly
 *   node backend/scripts/simulate_esp32.js --s2-leak
 */

import mqtt from 'mqtt';
import CONFIG from '../config.js';

const isS1Anomaly = process.argv.includes('--s1-anomaly');
const isS1Leak = process.argv.includes('--s1-leak');
const isS2Anomaly = process.argv.includes('--s2-anomaly');
const isS2Leak = process.argv.includes('--s2-leak');
const isBothAnomaly = process.argv.includes('--anomaly') || process.argv.includes('-a');

const INTERVAL_MS = parseInt(process.env.INTERVAL_MS || '500', 10);

console.log('\n======================================================');
console.log('   JALDRISHTI ESP32 DUAL ADXL345 TEST PUBLISHER');
console.log('======================================================');
console.log(`Target Broker: ${CONFIG.MQTT_BROKER_URL}`);
console.log(`Topic:         ${CONFIG.MQTT_TOPIC}`);
console.log(`Device ID:     ${CONFIG.EXPECTED_DEVICE_ID}`);
console.log(`Units:         ${CONFIG.UNIT} (m/s²)`);
console.log(`Interval:      ${INTERVAL_MS}ms`);
console.log(`Sensor 1 (50cm): ${isS1Leak ? 'POTENTIAL LEAK (>0.5 m/s²)' : (isS1Anomaly || isBothAnomaly ? 'ANOMALY (0.25-0.4 m/s²)' : 'NORMAL BASELINE (<0.18 m/s²)')}`);
console.log(`Sensor 2 (90cm): ${isS2Leak ? 'POTENTIAL LEAK (>0.5 m/s²)' : (isS2Anomaly || isBothAnomaly ? 'ANOMALY (0.25-0.4 m/s²)' : 'NORMAL BASELINE (<0.18 m/s²)')}`);
console.log('======================================================\n');

const client = mqtt.connect(CONFIG.MQTT_BROKER_URL);

let sequence = 0;
let startMs = Date.now();

client.on('connect', () => {
  console.log('[TEST PUBLISHER] Connected to MQTT broker. Transmitting dual-sensor packets...\n');

  setInterval(() => {
    sequence++;
    const elapsedMs = Date.now() - startMs;

    // --- SENSOR 1 (at 50 cm) ---
    let s1_noise = 0.04;
    let s1_offset = 0;
    if (isS1Leak) {
      s1_noise = 0.5;
      s1_offset = 0.55;
    } else if (isS1Anomaly || isBothAnomaly) {
      s1_noise = 0.3;
      s1_offset = 0.28;
    }
    const s1_x = (Math.random() - 0.5) * (s1_noise * 1.5) + (s1_offset > 0 ? 0.2 : 0.02);
    const s1_y = (Math.random() - 0.5) * (s1_noise * 1.5) - (s1_offset > 0 ? 0.15 : 0.03);
    const s1_z = 9.81 + (Math.random() - 0.5) * s1_noise;
    const s1_vib = Math.sqrt(s1_x * s1_x + s1_y * s1_y + Math.pow(s1_z - 9.81, 2)) + s1_offset;

    // --- SENSOR 2 (at 90 cm) ---
    let s2_noise = 0.04;
    let s2_offset = 0;
    if (isS2Leak) {
      s2_noise = 0.6;
      s2_offset = 0.60;
    } else if (isS2Anomaly || isBothAnomaly) {
      s2_noise = 0.35;
      s2_offset = 0.30;
    }
    const s2_x = (Math.random() - 0.5) * (s2_noise * 1.5) + (s2_offset > 0 ? 0.25 : 0.03);
    const s2_y = (Math.random() - 0.5) * (s2_noise * 1.5) - (s2_offset > 0 ? 0.2 : 0.04);
    const s2_z = 9.81 + (Math.random() - 0.5) * s2_noise;
    const s2_vib = Math.sqrt(s2_x * s2_x + s2_y * s2_y + Math.pow(s2_z - 9.81, 2)) + s2_offset;

    const hasAnomaly = isS1Anomaly || isS1Leak || isS2Anomaly || isS2Leak || isBothAnomaly;

    const payload = {
      device_id: CONFIG.EXPECTED_DEVICE_ID,
      timestamp_ms: elapsedMs,
      sensor_1: {
        x: parseFloat(s1_x.toFixed(4)),
        y: parseFloat(s1_y.toFixed(4)),
        z: parseFloat(s1_z.toFixed(4)),
        vibration: parseFloat(s1_vib.toFixed(4))
      },
      sensor_2: {
        x: parseFloat(s2_x.toFixed(4)),
        y: parseFloat(s2_y.toFixed(4)),
        z: parseFloat(s2_z.toFixed(4)),
        vibration: parseFloat(s2_vib.toFixed(4))
      },
      status: hasAnomaly ? 'WARNING' : 'NORMAL'
    };

    client.publish(CONFIG.MQTT_TOPIC, JSON.stringify(payload));
    
    if (sequence % 4 === 0) {
      console.log(
        `[TEST ESP32] Sent #${sequence} | ` +
        `S1(50cm): vib=${payload.sensor_1.vibration} m/s² (X=${payload.sensor_1.x}, Y=${payload.sensor_1.y}, Z=${payload.sensor_1.z}) | ` +
        `S2(90cm): vib=${payload.sensor_2.vibration} m/s² (X=${payload.sensor_2.x}, Y=${payload.sensor_2.y}, Z=${payload.sensor_2.z}) | ` +
        `status=${payload.status}`
      );
    }
  }, INTERVAL_MS);
});

client.on('error', (err) => {
  console.error('[TEST PUBLISHER] MQTT Error:', err.message);
});
