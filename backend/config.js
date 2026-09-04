/**
 * JalDrishti Local Backend Configuration
 * 
 * Supports dynamic configuration via environment variables:
 * - LAPTOP_IP / MQTT_HOST: The IP address for the local MQTT broker and backend (defaults to detected LAN IP)
 * - MQTT_PORT: MQTT broker port (default: 1883)
 * - MQTT_TOPIC: Telemetry topic to subscribe to (default: jaldrishti/node01/vibration)
 * - PORT: HTTP REST API port (default: 5001)
 * - HOST: Network bind host (default: 0.0.0.0 - accepts network connections from LAN/ESP32)
 * - FRESHNESS_TIMEOUT_MS: Telemetry staleness timeout in ms (default: 10000 = 10s)
 * - UNITS: All acceleration and vibration values strictly use m/s²
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPrimaryLANIP } from './scripts/get-ip.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Auto-detected primary LAN IP (e.g. Wi-Fi or mobile hotspot IP)
const detectedIP = getPrimaryLANIP('127.0.0.1');

export const CONFIG = {
  // Network & Binding
  HOST: process.env.HOST || '0.0.0.0',
  PORT: parseInt(process.env.PORT || '5001', 10),
  LAPTOP_IP: process.env.LAPTOP_IP || detectedIP,

  // MQTT Configuration
  // Local backend server talks to the local broker on loopback (127.0.0.1) by default,
  // making it completely immune to Wi-Fi disconnects, DHCP lease changes, or hotspot switching.
  // The broker itself listens on 0.0.0.0:1883 to receive external packets from ESP32 via LAPTOP_IP.
  MQTT_HOST: process.env.MQTT_HOST || '127.0.0.1',
  MQTT_PORT: parseInt(process.env.MQTT_PORT || '1883', 10),
  MQTT_BROKER_URL: process.env.MQTT_BROKER_URL || `mqtt://${process.env.MQTT_HOST || '127.0.0.1'}:${process.env.MQTT_PORT || 1883}`,
  MQTT_TOPIC: process.env.MQTT_TOPIC || 'jaldrishti/node01/vibration',

  // Database
  DB_PATH: process.env.DB_PATH || path.join(__dirname, 'data', 'jaldrishti_telemetry.db'),

  // Telemetry Pipeline & Freshness
  FRESHNESS_TIMEOUT_MS: parseInt(process.env.FRESHNESS_TIMEOUT_MS || '10000', 10),
  EXPECTED_DEVICE_ID: 'jaldrishti-node-01',
  UNIT: 'm/s²' // Consistent unit standard throughout pipeline
};

export default CONFIG;
