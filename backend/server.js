/**
 * JalDrishti Local Backend Server
 * 
 * - Subscribes to local MQTT broker (jaldrishti/node01/vibration)
 * - Validates physical ESP32 + ADXL345 telemetry in m/s²
 * - Caches latest telemetry in memory
 * - Persists history to local SQLite database
 * - Exposes clean REST API on 0.0.0.0:5001
 */

import express from 'express';
import cors from 'cors';
import mqtt from 'mqtt';
import CONFIG from './config.js';
import db from './db.js';

const app = express();

// Enable CORS for all local development origins
app.use(cors());
app.use(express.json());

// Initialize SQLite database
db.initDatabase();

// In-Memory Telemetry State
let latestTelemetry = null;
let lastTelemetryReceivedAt = null;
let totalMessagesReceived = 0;
let lastMqttError = null;
let isMqttConnected = false;
const startTime = Date.now();

// Validation Function for ESP32 Telemetry (Supports dual-sensor and legacy payloads)
function validateTelemetry(payload) {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Payload must be a JSON object' };
  }

  if (typeof payload.device_id !== 'string' || !payload.device_id.trim()) {
    return { valid: false, error: 'device_id must be a non-empty string' };
  }

  if (typeof payload.timestamp_ms !== 'number' || isNaN(payload.timestamp_ms)) {
    return { valid: false, error: 'timestamp_ms must be a valid number' };
  }

  // Dual-sensor format: sensor_1 and sensor_2
  if (payload.sensor_1 && typeof payload.sensor_1 === 'object') {
    for (const axis of ['x', 'y', 'z', 'vibration']) {
      if (typeof payload.sensor_1[axis] !== 'number' || isNaN(payload.sensor_1[axis])) {
        return { valid: false, error: `sensor_1.${axis} must be a valid number` };
      }
    }

    if (payload.sensor_2 && typeof payload.sensor_2 === 'object') {
      for (const axis of ['x', 'y', 'z', 'vibration']) {
        if (typeof payload.sensor_2[axis] !== 'number' || isNaN(payload.sensor_2[axis])) {
          return { valid: false, error: `sensor_2.${axis} must be a valid number` };
        }
      }
    } else {
      return { valid: false, error: 'sensor_2 object is required when sensor_1 is present' };
    }

    return { valid: true, isDual: true };
  }

  // Legacy single-sensor format: x, y, z, vibration at root
  if (typeof payload.x === 'number' && !isNaN(payload.x) &&
      typeof payload.y === 'number' && !isNaN(payload.y) &&
      typeof payload.z === 'number' && !isNaN(payload.z) &&
      typeof payload.vibration === 'number' && !isNaN(payload.vibration)) {
    return { valid: true, isDual: false };
  }

  return { valid: false, error: 'Payload must contain sensor_1 and sensor_2 objects with {x, y, z, vibration}' };
}

// Compute pipeline freshness status
function computeFreshness() {
  if (!latestTelemetry || !lastTelemetryReceivedAt) {
    return {
      is_fresh: false,
      age_seconds: null,
      status: 'NO_DATA'
    };
  }

  const ageMs = Date.now() - new Date(lastTelemetryReceivedAt).getTime();
  const ageSeconds = parseFloat((ageMs / 1000).toFixed(2));
  const isFresh = ageMs <= CONFIG.FRESHNESS_TIMEOUT_MS;

  return {
    is_fresh: isFresh,
    age_seconds: ageSeconds,
    status: isFresh ? 'LIVE' : 'STALE'
  };
}

// ==========================================
// MQTT CLIENT SETUP
// ==========================================
console.log(`[MQTT] Connecting to broker at: ${CONFIG.MQTT_BROKER_URL}...`);
const mqttClient = mqtt.connect(CONFIG.MQTT_BROKER_URL, {
  reconnectPeriod: 2000,
  connectTimeout: 5000,
  clientId: `jaldrishti_backend_${Math.random().toString(16).slice(2, 8)}`
});

mqttClient.on('connect', () => {
  isMqttConnected = true;
  lastMqttError = null;
  console.log(`[MQTT] Connected to broker successfully!`);
  console.log(`[MQTT] Subscribing to topic: "${CONFIG.MQTT_TOPIC}"...`);

  mqttClient.subscribe(CONFIG.MQTT_TOPIC, { qos: 0 }, (err) => {
    if (err) {
      console.error(`[MQTT] Subscription error:`, err);
    } else {
      console.log(`[MQTT] Subscribed successfully to topic: "${CONFIG.MQTT_TOPIC}"`);
    }
  });
});

mqttClient.on('error', (err) => {
  isMqttConnected = false;
  lastMqttError = err.message;
  console.error(`[MQTT] Error:`, err.message);
});

mqttClient.on('offline', () => {
  isMqttConnected = false;
  console.log(`[MQTT] Client went offline. Retrying in 2s...`);
});

mqttClient.on('reconnect', () => {
  console.log(`[MQTT] Reconnecting to broker...`);
});

// MQTT Ingestion & Validation Pipeline
mqttClient.on('message', (topic, rawMessage) => {
  if (topic !== CONFIG.MQTT_TOPIC) return;

  const nowISO = new Date().toISOString();
  let parsed = null;

  try {
    parsed = JSON.parse(rawMessage.toString());
  } catch (err) {
    console.warn(`[INGEST] [WARN] Dropped unparseable JSON packet:`, rawMessage.toString());
    return;
  }

  const validation = validateTelemetry(parsed);
  if (!validation.valid) {
    console.warn(`[INGEST] [WARN] Dropped invalid telemetry payload (${validation.error}):`, parsed);
    return;
  }

  totalMessagesReceived++;
  lastTelemetryReceivedAt = nowISO;

  let sensor1, sensor2;
  if (validation.isDual) {
    sensor1 = {
      x: parseFloat(parsed.sensor_1.x.toFixed(4)),
      y: parseFloat(parsed.sensor_1.y.toFixed(4)),
      z: parseFloat(parsed.sensor_1.z.toFixed(4)),
      vibration: parseFloat(parsed.sensor_1.vibration.toFixed(4))
    };
    sensor2 = {
      x: parseFloat(parsed.sensor_2.x.toFixed(4)),
      y: parseFloat(parsed.sensor_2.y.toFixed(4)),
      z: parseFloat(parsed.sensor_2.z.toFixed(4)),
      vibration: parseFloat(parsed.sensor_2.vibration.toFixed(4))
    };
  } else {
    sensor1 = {
      x: parseFloat(parsed.x.toFixed(4)),
      y: parseFloat(parsed.y.toFixed(4)),
      z: parseFloat(parsed.z.toFixed(4)),
      vibration: parseFloat(parsed.vibration.toFixed(4))
    };
    sensor2 = { ...sensor1 };
  }

  // Normalized payload with guaranteed m/s² units for both sensors
  const cleanTelemetry = {
    device_id: parsed.device_id,
    timestamp_ms: parsed.timestamp_ms,
    sensor_1: sensor1,
    sensor_2: sensor2,
    x: sensor1.x,
    y: sensor1.y,
    z: sensor1.z,
    vibration: sensor1.vibration,
    status: (parsed.status || 'NORMAL').toUpperCase(),
    unit: CONFIG.UNIT, // m/s²
    received_at: nowISO
  };

  // 1. Update in-memory cache
  latestTelemetry = cleanTelemetry;

  // 2. Persist to local SQLite database
  try {
    const saved = db.insertTelemetry(cleanTelemetry);
    cleanTelemetry.id = saved.id;
  } catch (dbErr) {
    console.error(`[DB] Error inserting telemetry into SQLite:`, dbErr);
  }

  // Periodic log summary (every 10 packets or status changes)
  if (totalMessagesReceived % 10 === 1 || cleanTelemetry.status !== 'NORMAL') {
    console.log(
      `[TELEMETRY] [#${totalMessagesReceived}] [${cleanTelemetry.status}] ` +
      `S1(50cm): vib=${cleanTelemetry.sensor_1.vibration} m/s² (X=${cleanTelemetry.sensor_1.x}, Y=${cleanTelemetry.sensor_1.y}, Z=${cleanTelemetry.sensor_1.z}) | ` +
      `S2(90cm): vib=${cleanTelemetry.sensor_2.vibration} m/s² (X=${cleanTelemetry.sensor_2.x}, Y=${cleanTelemetry.sensor_2.y}, Z=${cleanTelemetry.sensor_2.z}) ` +
      `from ${cleanTelemetry.device_id}`
    );
  }
});

// ==========================================
// REST API ENDPOINTS
// ==========================================

/**
 * GET /api/health
 * Returns status of:
 * - Backend server
 * - MQTT connection
 * - Telemetry pipeline status (LIVE / STALE / WAITING_FOR_DATA)
 */
app.get('/api/health', (req, res) => {
  const freshness = computeFreshness();
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  res.json({
    status: 'ok',
    backend: {
      status: 'running',
      uptime_seconds: uptimeSeconds,
      timestamp: new Date().toISOString(),
      host: CONFIG.HOST,
      port: CONFIG.PORT,
      configured_laptop_ip: CONFIG.LAPTOP_IP
    },
    mqtt: {
      broker_url: CONFIG.MQTT_BROKER_URL,
      broker_host: CONFIG.MQTT_HOST,
      broker_port: CONFIG.MQTT_PORT,
      connected: isMqttConnected,
      topic: CONFIG.MQTT_TOPIC,
      last_error: lastMqttError
    },
    telemetry_pipeline: {
      status: freshness.status === 'LIVE' ? 'LIVE' : freshness.status === 'STALE' ? 'STALE' : 'WAITING_FOR_DATA',
      freshness_timeout_seconds: CONFIG.FRESHNESS_TIMEOUT_MS / 1000,
      total_messages_received: totalMessagesReceived,
      last_message_at: lastTelemetryReceivedAt,
      last_telemetry_age_seconds: freshness.age_seconds,
      units: CONFIG.UNIT
    },
    database: {
      status: 'connected',
      db_path: CONFIG.DB_PATH,
      total_records: db.getTotalTelemetryCount()
    }
  });
});

/**
 * GET /api/telemetry/latest
 * Returns the latest real telemetry received from the physical ESP32.
 * Strictly no mock or fallback data.
 */
app.get('/api/telemetry/latest', (req, res) => {
  const freshness = computeFreshness();

  // If in-memory is empty (e.g. after server restart), check DB for most recent reading
  let data = latestTelemetry;
  if (!data) {
    const lastDbRecord = db.getLatestTelemetry();
    if (lastDbRecord) {
      data = lastDbRecord;
      if (!lastTelemetryReceivedAt) {
        lastTelemetryReceivedAt = lastDbRecord.received_at;
      }
    }
  }

  res.json({
    success: true,
    data: data || null,
    freshness: computeFreshness(),
    unit: CONFIG.UNIT
  });
});

/**
 * GET /api/telemetry/recent
 * Returns recent telemetry history from local SQLite database.
 */
app.get('/api/telemetry/recent', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
  const records = db.getRecentTelemetry(limit);

  res.json({
    success: true,
    count: records.length,
    unit: CONFIG.UNIT,
    data: records
  });
});

// ==========================================
// START SERVER
// ==========================================
const server = app.listen(CONFIG.PORT, CONFIG.HOST, () => {
  console.log('\n======================================================');
  console.log('   JALDRISHTI LOCAL BACKEND API SERVER');
  console.log('======================================================');
  console.log(`[BACKEND] Bound to:          ${CONFIG.HOST}:${CONFIG.PORT}`);
  console.log(`[BACKEND] Local URL:         http://127.0.0.1:${CONFIG.PORT}/api/health`);
  console.log(`[BACKEND] Network LAN URL:   http://${CONFIG.LAPTOP_IP}:${CONFIG.PORT}/api/health`);
  console.log(`[BACKEND] MQTT Target:       ${CONFIG.MQTT_BROKER_URL}`);
  console.log(`[BACKEND] Telemetry Topic:   ${CONFIG.MQTT_TOPIC}`);
  console.log(`[BACKEND] Units Standard:    ${CONFIG.UNIT} (m/s²)`);
  console.log(`[BACKEND] Freshness Window:  ${CONFIG.FRESHNESS_TIMEOUT_MS / 1000} seconds`);
  console.log('======================================================\n');
});

// Clean shutdown
process.on('SIGINT', () => {
  console.log('\n[BACKEND] Shutting down server...');
  mqttClient.end();
  db.closeDatabase();
  server.close(() => {
    console.log('[BACKEND] Server terminated.');
    process.exit(0);
  });
});
