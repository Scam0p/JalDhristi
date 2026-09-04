import React from 'react';
import { SensorNode } from '../../types/simulation';
import { 
  X, 
  Gauge, 
  Droplets, 
  Battery, 
  Wifi, 
  Thermometer, 
  Clock, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { LiveHardwareTelemetryPanel } from './LiveHardwareTelemetryPanel';

interface TrainDetailDrawerProps {
  train: SensorNode | null;
  onClose: () => void;
}

export const TrainDetailDrawer: React.FC<TrainDetailDrawerProps> = ({ train: sensor, onClose }) => {
  if (!sensor) return null;

  const isWarning = sensor.status === 'WARNING';
  const isCritical = sensor.status === 'CRITICAL';
  const isPhysicalNode = 
    sensor.sensorType === 'VIBRATION_SENSOR' || 
    sensor.id === 'sensor_1' || 
    sensor.id === 'sensor_2' || 
    sensor.hardwareSensorKey !== undefined || 
    sensor.id === 'VB-04' || 
    sensor.id === 'jaldrishti-node-01';

  const sensorKey: 'sensor_1' | 'sensor_2' = 
    sensor.hardwareSensorKey || 
    (sensor.id === 'sensor_2' || sensor.id === 'FS-02' ? 'sensor_2' : 'sensor_1');

  // Pressure history sparkline points
  const pressurePoints = sensor.history?.map(h => h.pressure) || [
    sensor.pressureBar - 0.05,
    sensor.pressureBar - 0.02,
    sensor.pressureBar + 0.03,
    sensor.pressureBar
  ];

  // Flow history sparkline points
  const flowPoints = sensor.history?.map(h => h.flow) || [
    sensor.flowRateM3h + 15,
    sensor.flowRateM3h + 8,
    sensor.flowRateM3h - 5,
    sensor.flowRateM3h
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Semi-transparent backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-2xs animate-in fade-in duration-200" 
      />

      <div className="relative z-10 w-full max-w-md bg-white h-full border-l border-[#E5E7EB] shadow-2xl p-5 flex flex-col justify-between font-mono-tech select-none overflow-y-auto animate-in slide-in-from-right duration-300">
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-4">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded flex items-center justify-center text-white font-mono-tech font-bold text-xs ${
                isCritical ? 'bg-[#EF4444]' : isWarning ? 'bg-[#F59E0B]' : 'bg-[#144230]'
              }`}>
                {sensor.id === 'sensor_1' ? 'S1' : sensor.id === 'sensor_2' ? 'S2' : sensor.id}
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase text-[#111827]">
                  {sensor.name}
                </h3>
                <span className="text-[10px] text-[#6B7280]">
                  {sensor.physicalPositionCm ? `100 cm Rig • Position ${sensor.physicalPositionCm} cm` : `${sensor.sensorType.replace(/_/g, ' ')} • ${sensor.protocol}`}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded bg-[#F4F5F7] hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer border border-[#E5E7EB]"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Operational Status Highlight Banner */}
          <div className={`p-3 rounded border mb-4 flex items-center justify-between ${
            isCritical 
              ? 'bg-[#FEF2F2] border-[#FECACA]' 
              : isWarning 
              ? 'bg-[#FFFBEB] border-[#FDE68A]' 
              : 'bg-[#F9FAFB] border-[#E5E7EB]'
          }`}>
            <div>
              <span className="text-[9px] text-[#6B7280] uppercase block font-bold">OPERATIONAL STATUS</span>
              <span className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 ${
                isCritical ? 'text-[#DC2626]' : isWarning ? 'text-[#D97706]' : 'text-[#144230]'
              }`}>
                {isCritical ? <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626]" /> : <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />}
                <span>{sensor.status}</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-[#6B7280] uppercase block font-bold">SIGNAL TELEMETRY</span>
              <span className="text-xs font-bold text-[#111827] flex items-center gap-1 justify-end">
                <Wifi className="w-3.5 h-3.5 text-[#144230]" />
                <span>{sensor.signalStrength} ({sensor.rssiDbm} dBm)</span>
              </span>
            </div>
          </div>

          {/* Location & Physical Pipeline Position Info */}
          <div className="p-3 rounded bg-[#F9FAFB] border border-[#E5E7EB] mb-4 text-xs">
            <span className="text-[9px] text-[#6B7280] font-bold block uppercase mb-0.5">
              PIPELINE MOUNTING LOCATION
            </span>
            <div className="font-bold text-[#111827]">{sensor.location}</div>
            <div className="text-[10px] text-[#144230] font-bold mt-1 flex items-center justify-between">
              <span>PHYSICAL POSITION: {sensor.physicalPositionCm ? `${sensor.physicalPositionCm}.0 cm` : 'Ch. 12+480m'}</span>
              <span className="text-[#6B7280] font-normal">Firmware: {sensor.firmwareVersion}</span>
            </div>
          </div>

          {/* If physical ESP32 vibration node, display Real ESP32 Telemetry immediately at the top */}
          {isPhysicalNode ? (
            <LiveHardwareTelemetryPanel sensorId={sensor.id} sensorKey={sensorKey} />
          ) : (
            <>
              {/* Real-Time Telemetry Metrics Grid (Hydraulic Sensors) */}
              <div className="space-y-2 mb-4">
                <span className="text-[9px] uppercase tracking-wider text-[#6B7280] block font-bold">
                  LIVE SENSOR TELEMETRY
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Pressure Card */}
                  <div className="p-2.5 rounded bg-[#F9FAFB] border border-[#E5E7EB]">
                    <div className="flex items-center gap-1 text-[#6B7280] text-[9px] mb-0.5 font-bold uppercase">
                      <Gauge className="w-3 h-3 text-[#144230]" />
                      <span>PRESSURE</span>
                    </div>
                    <span className="font-bold text-lg text-[#111827]">
                      {sensor.pressureBar.toFixed(2)} <span className="text-xs font-normal text-[#6B7280]">bar</span>
                    </span>
                    <div className="text-[9px] text-[#144230] font-semibold mt-0.5">
                      Nominal: 4.80 bar
                    </div>
                  </div>

                  {/* Flow Rate Card */}
                  <div className="p-2.5 rounded bg-[#F9FAFB] border border-[#E5E7EB]">
                    <div className="flex items-center gap-1 text-[#6B7280] text-[9px] mb-0.5 font-bold uppercase">
                      <Droplets className="w-3 h-3 text-[#22C55E]" />
                      <span>FLOW RATE</span>
                    </div>
                    <span className={`font-bold text-lg ${
                      sensor.flowRateM3h < 900 ? 'text-[#D97706]' : 'text-[#111827]'
                    }`}>
                      {sensor.flowRateM3h} <span className="text-xs font-normal text-[#6B7280]">m³/h</span>
                    </span>
                    <div className="text-[9px] text-[#6B7280] font-medium mt-0.5">
                      Expected: 930 m³/h
                    </div>
                  </div>

                  {/* Battery Level Card */}
                  <div className="p-2.5 rounded bg-[#F9FAFB] border border-[#E5E7EB]">
                    <div className="flex items-center gap-1 text-[#6B7280] text-[9px] mb-0.5 font-bold uppercase">
                      <Battery className="w-3 h-3 text-[#144230]" />
                      <span>BATTERY</span>
                    </div>
                    <span className="font-bold text-lg text-[#111827]">
                      {sensor.batteryPct}%
                    </span>
                    <div className="text-[9px] text-[#144230] font-semibold mt-0.5">
                      Internal LiFePO4
                    </div>
                  </div>

                  {/* Fluid Temperature Card */}
                  <div className="p-2.5 rounded bg-[#F9FAFB] border border-[#E5E7EB]">
                    <div className="flex items-center gap-1 text-[#6B7280] text-[9px] mb-0.5 font-bold uppercase">
                      <Thermometer className="w-3 h-3 text-[#144230]" />
                      <span>TEMP</span>
                    </div>
                    <span className="font-bold text-lg text-[#111827]">
                      {sensor.temperatureC}° <span className="text-xs font-normal text-[#6B7280]">C</span>
                    </span>
                    <div className="text-[9px] text-[#6B7280] font-medium mt-0.5">
                      Ambient Nominal
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Sparkline Telemetry Trend Charts */}
              <div className="p-3 rounded bg-[#F9FAFB] border border-[#E5E7EB] mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-[#111827] uppercase">
                    TELEMETRY TRENDS (60 MIN)
                  </span>
                  <span className="text-[9px] text-[#6B7280]">1Hz SAMPLING</span>
                </div>

                {/* Pressure Trend Sparkline */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px] text-[#4B5563]">
                    <span>Pressure Gradient</span>
                    <span className="font-bold text-[#144230]">{sensor.pressureBar} bar</span>
                  </div>
                  <div className="h-8 w-full bg-white rounded border border-[#E5E7EB] p-1 flex items-end justify-between gap-1">
                    {pressurePoints.map((val, idx) => {
                      const hPct = Math.max(20, Math.min(100, ((val - 3.5) / 2.0) * 100));
                      return (
                        <div key={idx} className="flex-1 bg-[#E8F7EE] rounded-none relative group" style={{ height: `${hPct}%` }}>
                          <div className="w-full h-full bg-[#144230] rounded-none opacity-80 group-hover:opacity-100" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Flow Trend Sparkline */}
                <div className="space-y-0.5 pt-1">
                  <div className="flex justify-between text-[10px] text-[#4B5563]">
                    <span>Flow Volume</span>
                    <span className="font-bold text-[#144230]">{sensor.flowRateM3h} m³/h</span>
                  </div>
                  <div className="h-8 w-full bg-white rounded border border-[#E5E7EB] p-1 flex items-end justify-between gap-1">
                    {flowPoints.map((val, idx) => {
                      const hPct = Math.max(20, Math.min(100, ((val - 700) / 300) * 100));
                      return (
                        <div key={idx} className="flex-1 bg-[#E8F7EE] rounded-none relative group" style={{ height: `${hPct}%` }}>
                          <div className="w-full h-full bg-[#22C55E] rounded-none opacity-80 group-hover:opacity-100" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Drawer Actions */}
        <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
          <div className="flex items-center justify-between text-[10px] text-[#6B7280]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#144230]" /> Polled: {sensor.lastUpdated}
            </span>
            <span className="text-[#144230] font-bold">Health: {sensor.healthScorePct}%</span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 px-3 rounded bg-[#144230] hover:bg-[#1A543E] text-white font-mono-tech font-bold text-xs uppercase tracking-wider transition-colors border border-[#0F3224] cursor-pointer text-center"
          >
            CLOSE SENSOR TELEMETRY
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainDetailDrawer;
