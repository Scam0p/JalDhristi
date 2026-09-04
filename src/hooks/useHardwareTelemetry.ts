import { useState, useEffect, useCallback, useRef } from 'react';

export type HardwareConnectionStatus = 'LIVE' | 'STALE' | 'API_NOT_CONNECTED';

export interface SingleSensorTelemetry {
  x: number;          // Acceleration in m/s²
  y: number;          // Acceleration in m/s²
  z: number;          // Acceleration in m/s²
  vibration: number;  // Vibration magnitude in m/s²
}

export interface HardwareTelemetryData {
  id?: number;
  device_id: string;
  timestamp_ms: number;
  sensor_1: SingleSensorTelemetry;
  sensor_2: SingleSensorTelemetry;
  x?: number;          // Acceleration in m/s² (backward compatible)
  y?: number;          // Acceleration in m/s² (backward compatible)
  z?: number;          // Acceleration in m/s² (backward compatible)
  vibration?: number;  // Vibration magnitude in m/s² (backward compatible)
  status: string;     // NORMAL, WARNING, CALIBRATING, etc.
  unit: string;       // Strictly 'm/s²'
  received_at: string;
}

export interface BackendHealthInfo {
  status: string;
  backend: {
    status: string;
    uptime_seconds: number;
    configured_laptop_ip: string;
    port: number;
  };
  mqtt: {
    broker_url: string;
    broker_host: string;
    broker_port: number;
    connected: boolean;
    topic: string;
    last_error: string | null;
  };
  telemetry_pipeline: {
    status: string;
    freshness_timeout_seconds: number;
    total_messages_received: number;
    last_message_at: string | null;
    last_telemetry_age_seconds: number | null;
    units: string;
  };
  database: {
    status: string;
    total_records: number;
  };
}

export function useHardwareTelemetry(pollingIntervalMs = 1000) {
  const [connectionStatus, setConnectionStatus] = useState<HardwareConnectionStatus>('API_NOT_CONNECTED');
  const [latestTelemetry, setLatestTelemetry] = useState<HardwareTelemetryData | null>(null);
  const [recentHistory, setRecentHistory] = useState<HardwareTelemetryData[]>([]);
  const [backendHealth, setBackendHealth] = useState<BackendHealthInfo | null>(null);
  const [ageSeconds, setAgeSeconds] = useState<number | null>(null);
  const [lastCheckedAt, setLastCheckedAt] = useState<Date | null>(null);

  const isMountedRef = useRef(true);

  const fetchTelemetry = useCallback(async () => {
    try {
      // 1. Query latest telemetry
      const res = await fetch('/api/telemetry/latest', {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const json = await res.json();
      if (!isMountedRef.current) return;

      setLastCheckedAt(new Date());

      if (json.success) {
        const rawData: any = json.data;
        const freshness = json.freshness;

        let normalizedData: HardwareTelemetryData | null = null;
        if (rawData) {
          const s1 = rawData.sensor_1 || {
            x: rawData.x ?? 0,
            y: rawData.y ?? 0,
            z: rawData.z ?? 9.81,
            vibration: rawData.vibration ?? 0
          };
          const s2 = rawData.sensor_2 || {
            x: rawData.x ?? 0,
            y: rawData.y ?? 0,
            z: rawData.z ?? 9.81,
            vibration: rawData.vibration ?? 0
          };

          normalizedData = {
            id: rawData.id,
            device_id: rawData.device_id,
            timestamp_ms: rawData.timestamp_ms,
            sensor_1: s1,
            sensor_2: s2,
            x: s1.x,
            y: s1.y,
            z: s1.z,
            vibration: s1.vibration,
            status: rawData.status || 'NORMAL',
            unit: rawData.unit || 'm/s²',
            received_at: rawData.received_at
          };
        }

        setLatestTelemetry(normalizedData);
        setAgeSeconds(freshness?.age_seconds ?? null);

        // Compute strictly adhering to the 3-state requirement
        if (!normalizedData || freshness?.status === 'NO_DATA') {
          setConnectionStatus('STALE');
        } else if (freshness?.is_fresh) {
          setConnectionStatus('LIVE');
        } else {
          setConnectionStatus('STALE');
        }
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      // Network failure or backend not running -> explicitly API NOT CONNECTED
      setConnectionStatus('API_NOT_CONNECTED');
      setAgeSeconds(null);
    }
  }, []);

  const fetchHistoryAndHealth = useCallback(async () => {
    try {
      // Fetch recent history
      const historyRes = await fetch('/api/telemetry/recent?limit=25', { cache: 'no-store' });
      if (historyRes.ok) {
        const hJson = await historyRes.json();
        if (isMountedRef.current && hJson.success && Array.isArray(hJson.data)) {
          setRecentHistory(hJson.data);
        }
      }

      // Fetch health summary
      const healthRes = await fetch('/api/health', { cache: 'no-store' });
      if (healthRes.ok) {
        const healthJson = await healthRes.json();
        if (isMountedRef.current && healthJson.status === 'ok') {
          setBackendHealth(healthJson);
        }
      }
    } catch (err) {
      // Ignore subsidiary errors; fetchTelemetry handles main connection status
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // Initial fetch
    fetchTelemetry();
    fetchHistoryAndHealth();

    // Fast interval for latest telemetry
    const fastTimer = setInterval(() => {
      fetchTelemetry();
    }, pollingIntervalMs);

    // Slower interval for history and health (every 3s)
    const slowTimer = setInterval(() => {
      fetchHistoryAndHealth();
    }, 3000);

    return () => {
      isMountedRef.current = false;
      clearInterval(fastTimer);
      clearInterval(slowTimer);
    };
  }, [fetchTelemetry, fetchHistoryAndHealth, pollingIntervalMs]);

  const getSensorReading = useCallback((key: 'sensor_1' | 'sensor_2'): SingleSensorTelemetry | null => {
    if (!latestTelemetry) return null;
    return key === 'sensor_1' ? latestTelemetry.sensor_1 : latestTelemetry.sensor_2;
  }, [latestTelemetry]);

  return {
    connectionStatus,
    latestTelemetry,
    recentHistory,
    backendHealth,
    ageSeconds,
    lastCheckedAt,
    getSensorReading,
    refetch: fetchTelemetry
  };
}
