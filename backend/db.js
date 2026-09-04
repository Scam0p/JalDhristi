/**
 * JalDrishti Local SQLite Database Module
 * Uses Node.js 22 built-in node:sqlite (DatabaseSync)
 * 
 * Schema stores physical ESP32 telemetry with consistent units (m/s²)
 */

import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import CONFIG from './config.js';

// Ensure data directory exists
const dbDir = path.dirname(CONFIG.DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let dbInstance = null;
let insertStmt = null;
let latestStmt = null;
let recentStmt = null;
let countStmt = null;

export function initDatabase(dbPath = CONFIG.DB_PATH) {
  if (dbInstance) return dbInstance;

  console.log(`[DB] Initializing local SQLite database at: ${dbPath}`);
  dbInstance = new DatabaseSync(dbPath);

  // Enable WAL mode, busy timeout, and normal synchronous mode for concurrency
  try {
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    dbInstance.exec('PRAGMA busy_timeout = 5000;');
    dbInstance.exec('PRAGMA synchronous = NORMAL;');
  } catch (err) {
    // Some platforms may ignore PRAGMA, continuing safely
  }

  // Create telemetry table if not exists with dual sensor support
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS telemetry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      timestamp_ms INTEGER NOT NULL,
      x REAL NOT NULL DEFAULT 0,
      y REAL NOT NULL DEFAULT 0,
      z REAL NOT NULL DEFAULT 0,
      vibration REAL NOT NULL DEFAULT 0,
      s1_x REAL,
      s1_y REAL,
      s1_z REAL,
      s1_vibration REAL,
      s2_x REAL,
      s2_y REAL,
      s2_z REAL,
      s2_vibration REAL,
      status TEXT NOT NULL,
      unit TEXT NOT NULL DEFAULT 'm/s²',
      received_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_telemetry_received_at ON telemetry(received_at DESC);
    CREATE INDEX IF NOT EXISTS idx_telemetry_device ON telemetry(device_id, timestamp_ms DESC);
  `);

  // Migrate existing table if columns don't exist yet
  try {
    const tableInfoStmt = dbInstance.prepare('PRAGMA table_info(telemetry);');
    const cols = tableInfoStmt.all().map(c => c.name);
    const requiredCols = [
      's1_x', 's1_y', 's1_z', 's1_vibration',
      's2_x', 's2_y', 's2_z', 's2_vibration'
    ];
    for (const col of requiredCols) {
      if (!cols.includes(col)) {
        dbInstance.exec(`ALTER TABLE telemetry ADD COLUMN ${col} REAL;`);
      }
    }
  } catch (migErr) {
    console.warn('[DB] Schema migration check notice:', migErr.message);
  }

  // Prepare queries
  insertStmt = dbInstance.prepare(`
    INSERT INTO telemetry (
      device_id, timestamp_ms, x, y, z, vibration,
      s1_x, s1_y, s1_z, s1_vibration,
      s2_x, s2_y, s2_z, s2_vibration,
      status, unit, received_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  latestStmt = dbInstance.prepare(`
    SELECT *
    FROM telemetry
    ORDER BY id DESC
    LIMIT 1
  `);

  recentStmt = dbInstance.prepare(`
    SELECT *
    FROM telemetry
    ORDER BY id DESC
    LIMIT ?
  `);

  countStmt = dbInstance.prepare(`
    SELECT COUNT(*) AS total FROM telemetry
  `);

  console.log('[DB] SQLite database initialized successfully with dual-sensor support (units: m/s²).');
  return dbInstance;
}

function formatRow(row) {
  if (!row) return null;

  const s1 = (row.s1_x !== null && row.s1_x !== undefined) ? {
    x: Number(row.s1_x),
    y: Number(row.s1_y),
    z: Number(row.s1_z),
    vibration: Number(row.s1_vibration)
  } : {
    x: Number(row.x ?? 0),
    y: Number(row.y ?? 0),
    z: Number(row.z ?? 0),
    vibration: Number(row.vibration ?? 0)
  };

  const s2 = (row.s2_x !== null && row.s2_x !== undefined) ? {
    x: Number(row.s2_x),
    y: Number(row.s2_y),
    z: Number(row.s2_z),
    vibration: Number(row.s2_vibration)
  } : {
    x: Number(row.x ?? 0),
    y: Number(row.y ?? 0),
    z: Number(row.z ?? 0),
    vibration: Number(row.vibration ?? 0)
  };

  return {
    id: row.id,
    device_id: row.device_id,
    timestamp_ms: row.timestamp_ms,
    sensor_1: s1,
    sensor_2: s2,
    // Keep backward-compatible top-level keys matching sensor_1
    x: s1.x,
    y: s1.y,
    z: s1.z,
    vibration: s1.vibration,
    status: row.status,
    unit: row.unit,
    received_at: row.received_at
  };
}

export function insertTelemetry(record) {
  if (!insertStmt) initDatabase();

  const receivedAt = record.received_at || new Date().toISOString();
  const unit = record.unit || CONFIG.UNIT || 'm/s²';

  const s1 = record.sensor_1 || {
    x: record.x ?? 0,
    y: record.y ?? 0,
    z: record.z ?? 0,
    vibration: record.vibration ?? 0
  };

  const s2 = record.sensor_2 || {
    x: record.x ?? 0,
    y: record.y ?? 0,
    z: record.z ?? 0,
    vibration: record.vibration ?? 0
  };

  const status = record.status || 'NORMAL';

  // Retry up to 3 times if momentarily locked
  let lastErr = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = insertStmt.run(
        record.device_id,
        record.timestamp_ms,
        s1.x,
        s1.y,
        s1.z,
        s1.vibration,
        s1.x,
        s1.y,
        s1.z,
        s1.vibration,
        s2.x,
        s2.y,
        s2.z,
        s2.vibration,
        status,
        unit,
        receivedAt
      );

      return {
        id: result.lastInsertRowid,
        device_id: record.device_id,
        timestamp_ms: record.timestamp_ms,
        sensor_1: s1,
        sensor_2: s2,
        x: s1.x,
        y: s1.y,
        z: s1.z,
        vibration: s1.vibration,
        status,
        unit,
        received_at: receivedAt
      };
    } catch (err) {
      lastErr = err;
      if (err.message && err.message.includes('locked')) {
        // Micro pause before retry
        const waitUntil = Date.now() + 50;
        while (Date.now() < waitUntil) {}
      } else {
        throw err;
      }
    }
  }

  throw lastErr;
}

export function getLatestTelemetry() {
  if (!latestStmt) initDatabase();
  const row = latestStmt.get();
  return formatRow(row);
}

export function getRecentTelemetry(limit = 50) {
  if (!recentStmt) initDatabase();
  const safeLimit = Math.min(Math.max(1, parseInt(limit, 10) || 50), 500);
  const rows = recentStmt.all(safeLimit);
  return rows.map(formatRow);
}

export function getTotalTelemetryCount() {
  if (!countStmt) initDatabase();
  const res = countStmt.get();
  return res ? res.total : 0;
}

export function closeDatabase() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    insertStmt = null;
    latestStmt = null;
    recentStmt = null;
    countStmt = null;
    console.log('[DB] Database connection closed.');
  }
}

export default {
  initDatabase,
  insertTelemetry,
  getLatestTelemetry,
  getRecentTelemetry,
  getTotalTelemetryCount,
  closeDatabase
};
