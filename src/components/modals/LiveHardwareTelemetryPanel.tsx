import React, { useState } from 'react';
import { 
  useHardwareTelemetry, 
  HardwareConnectionStatus 
} from '../../hooks/useHardwareTelemetry';
import { classifyVibration } from '../../config/pipelineConfig';
import { 
  Activity, 
  Radio, 
  Cpu, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Database, 
  WifiOff, 
  HelpCircle,
  RefreshCw
} from 'lucide-react';

interface LiveHardwareTelemetryPanelProps {
  sensorId?: string;
  sensorKey?: 'sensor_1' | 'sensor_2';
}

export const LiveHardwareTelemetryPanel: React.FC<LiveHardwareTelemetryPanelProps> = ({ 
  sensorId = 'sensor_1',
  sensorKey
}) => {
  const {
    connectionStatus,
    latestTelemetry,
    recentHistory,
    backendHealth,
    ageSeconds,
    lastCheckedAt,
    refetch
  } = useHardwareTelemetry(1000);

  // Determine initial active sensor tab (Sensor 1 at 50 cm or Sensor 2 at 90 cm)
  const initialKey: 'sensor_1' | 'sensor_2' = 
    sensorKey || 
    (sensorId === 'sensor_2' || sensorId === 'FS-02' || sensorId === '90cm' ? 'sensor_2' : 'sensor_1');

  const [activeSensorKey, setActiveSensorKey] = useState<'sensor_1' | 'sensor_2'>(initialKey);

  // Sync if prop changes
  React.useEffect(() => {
    if (sensorKey) {
      setActiveSensorKey(sensorKey);
    } else if (sensorId === 'sensor_2' || sensorId === 'FS-02') {
      setActiveSensorKey('sensor_2');
    } else if (sensorId === 'sensor_1' || sensorId === 'PS-01') {
      setActiveSensorKey('sensor_1');
    }
  }, [sensorKey, sensorId]);

  const isLive = connectionStatus === 'LIVE';
  const isStale = connectionStatus === 'STALE';
  const isDisconnected = connectionStatus === 'API_NOT_CONNECTED';

  // Read active sensor data from real MQTT payload
  const currentSensorData = latestTelemetry 
    ? (activeSensorKey === 'sensor_1' ? latestTelemetry.sensor_1 : latestTelemetry.sensor_2)
    : null;

  const sensorName = activeSensorKey === 'sensor_1' ? 'Sensor 1 (ADXL345 #1)' : 'Sensor 2 (ADXL345 #2)';
  const sensorPositionCm = activeSensorKey === 'sensor_1' ? 50 : 90;

  const evaluatedCondition = currentSensorData ? classifyVibration(currentSensorData.vibration) : 'NORMAL';
  const eventStatusText = evaluatedCondition === 'NORMAL' ? 'Nominal Baseline' : evaluatedCondition;

  return (
    <div className="rounded-2xl border border-[#ECEEF2] bg-white p-4 mb-6 shadow-xs font-mono-tech select-none">
      {/* Header & Live Connection Status Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#F0F2F5]">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${
            isLive ? 'bg-[#E8F7EE] text-[#144230]' : isStale ? 'bg-[#FEF3C7] text-[#92400E]' : 'bg-[#FEF2F2] text-[#EF4444]'
          }`}>
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-display font-bold text-xs md:text-sm text-[#111827]">
              REAL ESP32 DUAL-SENSOR TELEMETRY
            </h4>
            <span className="text-[9px] text-[#6B7280]">
              2X ADXL345 • PHYSICAL 100 CM PIPELINE
            </span>
          </div>
        </div>

        {/* Dynamic Status Badge (Strict 3 States) */}
        <div className="flex items-center gap-1.5">
          {isLive && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8F7EE] border border-[#B7E4C7] text-[#144230] text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span>LIVE MQTT</span>
            </div>
          )}

          {isStale && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
              <span>STALE / NO LIVE DATA</span>
            </div>
          )}

          {isDisconnected && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#EF4444] text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
              <span>API NOT CONNECTED</span>
            </div>
          )}

          <button
            onClick={refetch}
            title="Refresh connection"
            className="p-1 rounded-md text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F4F5F7] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sensor Switcher Tabs: Sensor 1 (50 cm) vs Sensor 2 (90 cm) */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-[#F4F5F7] rounded-xl border border-[#E5E7EB] mb-3 text-xs">
        <button
          onClick={() => setActiveSensorKey('sensor_1')}
          className={`py-1.5 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSensorKey === 'sensor_1'
              ? 'bg-[#144230] text-white shadow-xs'
              : 'text-[#6B7280] hover:text-[#111827]'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-[#22C55E]' : 'bg-[#9CA3AF]'}`} />
          <span>Sensor 1 (50 cm)</span>
        </button>

        <button
          onClick={() => setActiveSensorKey('sensor_2')}
          className={`py-1.5 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSensorKey === 'sensor_2'
              ? 'bg-[#144230] text-white shadow-xs'
              : 'text-[#6B7280] hover:text-[#111827]'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-[#22C55E]' : 'bg-[#9CA3AF]'}`} />
          <span>Sensor 2 (90 cm)</span>
        </button>
      </div>

      {/* STATE 1: API NOT CONNECTED (Unmistakable Error View) */}
      {isDisconnected && (
        <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] space-y-2.5 text-xs">
          <div className="flex items-start gap-2 text-[#991B1B]">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold block">API NOT CONNECTED</span>
              <p className="text-[11px] text-[#7F1D1D] mt-0.5">
                The frontend cannot reach the local JalDrishti backend API at <code className="bg-white/60 px-1 py-0.5 rounded text-[10px]">/api/telemetry/latest</code>.
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white/80 border border-[#FECACA] text-[10px] text-[#4B5563] space-y-1">
            <span className="font-bold text-[#991B1B] block uppercase tracking-wide">
              Troubleshooting Checklist:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              <span>1. Verify local MQTT broker is running on port 1883</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              <span>2. Verify backend server is running on port 5001</span>
            </div>
          </div>

          <div className="text-[9px] text-[#991B1B] font-semibold flex items-center gap-1">
            <span>● REAL MODE strictly displays live physical telemetry. No fake data generated.</span>
          </div>
        </div>
      )}

      {/* STATE 2: STALE / NO LIVE DATA (Backend Reachable but No Fresh Packets) */}
      {isStale && !latestTelemetry && (
        <div className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] space-y-2.5 text-xs">
          <div className="flex items-start gap-2 text-[#92400E]">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#F59E0B]" />
            <div>
              <span className="font-bold block">STALE / WAITING FOR HARDWARE PACKETS</span>
              <p className="text-[11px] text-[#78350F] mt-0.5">
                Backend API is active, but no telemetry has arrived from the physical ESP32 dual ADXL345 node yet.
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white/80 border border-[#FDE68A] text-[10px] text-[#4B5563] space-y-1">
            <span className="font-bold text-[#92400E] block uppercase tracking-wide">
              Hardware Verification:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span>Verify ESP32 is powered on and publishing to topic: <code className="font-bold text-[#111827]">{backendHealth?.mqtt?.topic || 'jaldrishti/node01/vibration'}</code></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span>Ensure ESP32 payload includes <code className="font-bold text-[#111827]">sensor_1</code> and <code className="font-bold text-[#111827]">sensor_2</code></span>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE DATA VIEW (Rendered for LIVE and STALE with previous real reading) */}
      {(isLive || (isStale && latestTelemetry)) && latestTelemetry && currentSensorData && (
        <div className="space-y-3">
          {/* Stale Warning Banner if displaying previous reading */}
          {isStale && (
            <div className="p-2 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-[10px] text-[#92400E] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 shrink-0 text-[#F59E0B]" />
                <span>Stream inactive ({ageSeconds ? `${ageSeconds}s ago` : 'stale'}). Showing last verified hardware reading.</span>
              </span>
              <span className="font-bold uppercase tracking-wider">STALE</span>
            </div>
          )}

          {/* Active Sensor Identity Banner */}
          <div className="p-2.5 rounded-xl bg-[#E8F7EE]/60 border border-[#B7E4C7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="font-display font-bold text-xs text-[#144230]">
                {sensorName}
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#B7E4C7] text-[#144230]">
              PIPELINE POSITION: {sensorPositionCm} CM
            </span>
          </div>

          {/* Primary Metrics 4-Grid for Active Sensor */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            {/* 1. Vibration Magnitude Card */}
            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <div className="flex items-center justify-between text-[#6B7280] text-[10px] font-bold mb-1">
                <span>VIBRATION</span>
                <Activity className="w-3.5 h-3.5 text-[#144230]" />
              </div>
              <div className={`font-display font-black text-lg ${
                evaluatedCondition === 'POTENTIAL LEAK'
                  ? 'text-[#DC2626]'
                  : evaluatedCondition === 'ANOMALY DETECTED'
                  ? 'text-[#D97706]'
                  : 'text-[#111827]'
              }`}>
                {currentSensorData.vibration.toFixed(3)}{' '}
                <span className="text-xs font-normal text-[#6B7280]">m/s²</span>
              </div>
              <div className="text-[9px] text-[#144230] font-semibold mt-0.5">
                Dynamic magnitude
              </div>
            </div>

            {/* 2. Current Status Card */}
            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <div className="flex items-center justify-between text-[#6B7280] text-[10px] font-bold mb-1">
                <span>CURRENT STATUS</span>
                <CheckCircle2 className={`w-3.5 h-3.5 ${
                  evaluatedCondition === 'POTENTIAL LEAK' ? 'text-[#EF4444]' : evaluatedCondition === 'ANOMALY DETECTED' ? 'text-[#F59E0B]' : 'text-[#22C55E]'
                }`} />
              </div>
              <div className={`font-display font-bold text-xs truncate mt-1 ${
                evaluatedCondition === 'POTENTIAL LEAK'
                  ? 'text-[#DC2626]'
                  : evaluatedCondition === 'ANOMALY DETECTED'
                  ? 'text-[#D97706]'
                  : 'text-[#047857]'
              }`}>
                {evaluatedCondition}
              </div>
              <div className="text-[9px] text-[#6B7280] mt-1 truncate">
                {evaluatedCondition === 'NORMAL' ? 'Stationary baseline' : 'Active condition'}
              </div>
            </div>

            {/* 3. Event Status Card */}
            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <div className="flex items-center justify-between text-[#6B7280] text-[10px] font-bold mb-1">
                <span>EVENT STATUS</span>
                <AlertCircle className={`w-3.5 h-3.5 ${
                  evaluatedCondition === 'POTENTIAL LEAK' ? 'text-[#EF4444]' : evaluatedCondition === 'ANOMALY DETECTED' ? 'text-[#F59E0B]' : 'text-[#9CA3AF]'
                }`} />
              </div>
              <div className={`font-display font-bold text-xs truncate mt-1 ${
                evaluatedCondition === 'POTENTIAL LEAK'
                  ? 'text-[#DC2626]'
                  : evaluatedCondition === 'ANOMALY DETECTED'
                  ? 'text-[#D97706]'
                  : 'text-[#144230]'
              }`}>
                {eventStatusText}
              </div>
              <div className="text-[9px] text-[#6B7280] mt-1 truncate">
                Rule-based event
              </div>
            </div>

            {/* 4. Pipeline Position Card */}
            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <div className="flex items-center justify-between text-[#6B7280] text-[10px] font-bold mb-1">
                <span>POSITION</span>
                <span className="text-[9px] font-mono-tech font-bold text-[#144230]">100 CM</span>
              </div>
              <div className="font-display font-black text-lg text-[#144230]">
                {sensorPositionCm}.0{' '}
                <span className="text-xs font-normal text-[#6B7280]">cm</span>
              </div>
              <div className="text-[9px] text-[#6B7280] mt-0.5 truncate">
                Mount: {sensorPositionCm === 50 ? 'Midpoint' : 'Downstream'}
              </div>
            </div>
          </div>

          {/* 3-Axis ADXL345 Acceleration Details for Active Sensor (in m/s²) */}
          <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#4B5563]">
              <span>3-AXIS ACCELERATION ({activeSensorKey.toUpperCase()})</span>
              <span className="text-[#144230] font-semibold">UNIT: m/s²</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {/* X Axis */}
              <div className="p-2 rounded-lg bg-white border border-[#E5E7EB]">
                <div className="text-[9px] font-bold text-[#6B7280]">X-AXIS</div>
                <div className="font-bold text-sm text-[#111827]">
                  {currentSensorData.x >= 0 ? `+${currentSensorData.x.toFixed(3)}` : currentSensorData.x.toFixed(3)}
                </div>
                <div className="text-[8px] text-[#9CA3AF]">m/s²</div>
              </div>

              {/* Y Axis */}
              <div className="p-2 rounded-lg bg-white border border-[#E5E7EB]">
                <div className="text-[9px] font-bold text-[#6B7280]">Y-AXIS</div>
                <div className="font-bold text-sm text-[#111827]">
                  {currentSensorData.y >= 0 ? `+${currentSensorData.y.toFixed(3)}` : currentSensorData.y.toFixed(3)}
                </div>
                <div className="text-[8px] text-[#9CA3AF]">m/s²</div>
              </div>

              {/* Z Axis */}
              <div className="p-2 rounded-lg bg-white border border-[#E5E7EB]">
                <div className="text-[9px] font-bold text-[#6B7280]">Z-AXIS</div>
                <div className="font-bold text-sm text-[#111827]">
                  {currentSensorData.z >= 0 ? `+${currentSensorData.z.toFixed(3)}` : currentSensorData.z.toFixed(3)}
                </div>
                <div className="text-[8px] text-[#9CA3AF]">m/s² (gravity)</div>
              </div>
            </div>
          </div>

          {/* Dual Sensor Quick Comparison Ribbon */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className={`p-2 rounded-xl border ${
              activeSensorKey === 'sensor_1' ? 'bg-[#E8F7EE] border-[#144230]' : 'bg-white border-[#E5E7EB]'
            }`}>
              <div className="font-bold text-[#144230]">SENSOR 1 (50 cm)</div>
              <div className="text-[#4B5563] mt-0.5">
                Vib: <span className="font-bold text-[#111827]">{latestTelemetry.sensor_1.vibration.toFixed(3)}</span> m/s²
              </div>
            </div>

            <div className={`p-2 rounded-xl border ${
              activeSensorKey === 'sensor_2' ? 'bg-[#E8F7EE] border-[#144230]' : 'bg-white border-[#E5E7EB]'
            }`}>
              <div className="font-bold text-[#144230]">SENSOR 2 (90 cm)</div>
              <div className="text-[#4B5563] mt-0.5">
                Vib: <span className="font-bold text-[#111827]">{latestTelemetry.sensor_2.vibration.toFixed(3)}</span> m/s²
              </div>
            </div>
          </div>

          {/* Timestamps & Freshness Meta */}
          <div className="p-2.5 rounded-xl bg-[#F4F5F7] border border-[#E5E7EB] text-[10px] space-y-1 text-[#4B5563]">
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280]">Hardware Millis:</span>
              <span className="font-bold text-[#111827]">{latestTelemetry.timestamp_ms} ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280]">Backend Received:</span>
              <span className="font-bold text-[#111827]">
                {new Date(latestTelemetry.received_at).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280]">Age / Latency:</span>
              <span className={`font-bold ${isLive ? 'text-[#144230]' : 'text-[#D97706]'}`}>
                {ageSeconds !== null ? `${ageSeconds}s ago` : 'Just now'}
              </span>
            </div>
          </div>

          {/* Real SQLite Telemetry History Sparkline / Table */}
          {recentHistory.length > 0 && (
            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#ECEEF2] space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-[#4B5563]">
                <span className="flex items-center gap-1">
                  <Database className="w-3 h-3 text-[#144230]" />
                  <span>LOCAL SQLITE HISTORY ({recentHistory.length} REAL READINGS)</span>
                </span>
                <span className="text-[9px] text-[#6B7280]">NEWEST → OLDEST</span>
              </div>

              {/* Mini Sparkline Bar Chart of Real Vibration Readings */}
              <div className="h-8 w-full bg-white rounded-lg border border-[#E5E7EB] p-1 flex items-end justify-between gap-1 overflow-hidden">
                {recentHistory.slice(0, 16).reverse().map((item, idx) => {
                  const vibVal = item.vibration ?? item.sensor_1?.vibration ?? 0;
                  const barHeight = Math.max(15, Math.min(100, (vibVal / 1.5) * 100));
                  const isWarn = item.status === 'WARNING';
                  return (
                    <div
                      key={idx}
                      title={`Time: ${new Date(item.received_at).toLocaleTimeString()} | Vib: ${vibVal.toFixed(3)} m/s²`}
                      className="flex-1 rounded-xs transition-all relative group cursor-pointer"
                      style={{ height: `${barHeight}%` }}
                    >
                      <div className={`w-full h-full rounded-xs ${
                        isWarn ? 'bg-[#F59E0B]' : 'bg-[#144230]'
                      } opacity-80 group-hover:opacity-100`} />
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[8.5px] text-[#6B7280]">
                <span>Topic: <code className="text-[#111827]">{backendHealth?.mqtt?.topic || 'jaldrishti/node01/vibration'}</code></span>
                <span>Broker: <code className="text-[#111827]">{backendHealth?.mqtt?.broker_host || '127.0.0.1'}:1883</code></span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveHardwareTelemetryPanel;
