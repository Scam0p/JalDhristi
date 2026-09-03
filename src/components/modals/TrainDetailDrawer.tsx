import React from 'react';
import { SensorNode } from '../../types/simulation';
import { 
  X, 
  Gauge, 
  Droplets, 
  Battery, 
  Wifi, 
  ShieldCheck, 
  Activity, 
  Thermometer, 
  Clock, 
  Layers,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface TrainDetailDrawerProps {
  train: SensorNode | null;
  onClose: () => void;
}

export const TrainDetailDrawer: React.FC<TrainDetailDrawerProps> = ({ train: sensor, onClose }) => {
  if (!sensor) return null;

  const isWarning = sensor.status === 'WARNING';
  const isCritical = sensor.status === 'CRITICAL';

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

      <div className="relative z-10 w-full max-w-md bg-white h-full border-l border-[#ECEEF2] shadow-2xl p-6 flex flex-col justify-between font-mono-tech select-none overflow-y-auto animate-in slide-in-from-right duration-300">
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F0F2F5] mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-mono-tech font-black text-lg shadow-sm ${
                isCritical ? 'bg-[#EF4444]' : isWarning ? 'bg-[#F59E0B]' : 'bg-[#144230]'
              }`}>
                {sensor.id}
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-[#111827]">
                  {sensor.name}
                </h3>
                <span className="text-xs text-[#6B7280]">
                  {sensor.sensorType.replace(/_/g, ' ')} • {sensor.protocol}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#F4F5F7] hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Operational Status Highlight Banner */}
          <div className={`p-4 rounded-2xl border mb-6 flex items-center justify-between ${
            isCritical 
              ? 'bg-[#FEF2F2] border-[#FECACA]' 
              : isWarning 
              ? 'bg-[#FFFBEB] border-[#FDE68A]' 
              : 'bg-[#F9FAFB] border-[#ECEEF2]'
          }`}>
            <div>
              <span className="text-[10px] text-[#9CA3AF] uppercase block font-bold">OPERATIONAL STATUS</span>
              <span className={`text-sm font-bold uppercase tracking-wide flex items-center gap-1.5 ${
                isCritical ? 'text-[#EF4444]' : isWarning ? 'text-[#D97706]' : 'text-[#144230]'
              }`}>
                {isCritical ? <AlertTriangle className="w-4 h-4 text-[#EF4444]" /> : <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />}
                <span>{sensor.status}</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#9CA3AF] uppercase block font-bold">SIGNAL TELEMETRY</span>
              <span className="text-xs font-bold text-[#111827] flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-[#144230]" />
                <span>{sensor.signalStrength} ({sensor.rssiDbm} dBm)</span>
              </span>
            </div>
          </div>

          {/* Location & Chainage Info */}
          <div className="p-3.5 rounded-2xl bg-[#F4F5F7] border border-[#E5E7EB] mb-6 text-xs">
            <span className="text-[10px] text-[#6B7280] font-bold block uppercase mb-1">
              PIPELINE MOUNTING LOCATION
            </span>
            <div className="font-bold text-[#111827]">{sensor.location}</div>
            <div className="text-[10px] text-[#6B7280] mt-0.5">
              Chainage: KM {sensor.chainageKm.toFixed(2)} • Firmware: {sensor.firmwareVersion}
            </div>
          </div>

          {/* Real-Time Telemetry Metrics Grid */}
          <div className="space-y-4 mb-6">
            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] block font-bold">
              LIVE HYDRAULIC SENSOR TELEMETRY
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* Pressure Card */}
              <div className="p-3.5 rounded-2xl bg-[#F4F5F7] border border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 text-[#6B7280] text-[10px] mb-1 font-bold">
                  <Gauge className="w-3.5 h-3.5 text-[#144230]" />
                  <span>LINE PRESSURE</span>
                </div>
                <span className="font-display font-bold text-2xl text-[#111827]">
                  {sensor.pressureBar.toFixed(2)} <span className="text-xs font-normal text-[#6B7280]">bar</span>
                </span>
                <div className="text-[9px] text-[#144230] font-semibold mt-1">
                  Nominal: 4.80 bar
                </div>
              </div>

              {/* Flow Rate Card */}
              <div className="p-3.5 rounded-2xl bg-[#F4F5F7] border border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 text-[#6B7280] text-[10px] mb-1 font-bold">
                  <Droplets className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>FLOW VELOCITY</span>
                </div>
                <span className={`font-display font-bold text-2xl ${
                  sensor.flowRateM3h < 900 ? 'text-[#D97706]' : 'text-[#111827]'
                }`}>
                  {sensor.flowRateM3h} <span className="text-xs font-normal text-[#6B7280]">m³/h</span>
                </span>
                <div className="text-[9px] text-[#6B7280] font-medium mt-1">
                  Expected: 930 m³/h
                </div>
              </div>

              {/* Battery Level Card */}
              <div className="p-3.5 rounded-2xl bg-[#F4F5F7] border border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 text-[#6B7280] text-[10px] mb-1 font-bold">
                  <Battery className="w-3.5 h-3.5 text-[#144230]" />
                  <span>BATTERY LEVEL</span>
                </div>
                <span className="font-display font-bold text-2xl text-[#111827]">
                  {sensor.batteryPct}%
                </span>
                <div className="text-[9px] text-[#144230] font-semibold mt-1">
                  LiFePO4 Internal Pack
                </div>
              </div>

              {/* Fluid Temperature Card */}
              <div className="p-3.5 rounded-2xl bg-[#F4F5F7] border border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 text-[#6B7280] text-[10px] mb-1 font-bold">
                  <Thermometer className="w-3.5 h-3.5 text-[#144230]" />
                  <span>TEMPERATURE</span>
                </div>
                <span className="font-display font-bold text-2xl text-[#111827]">
                  {sensor.temperatureC}° <span className="text-xs font-normal text-[#6B7280]">C</span>
                </span>
                <div className="text-[9px] text-[#6B7280] font-medium mt-1">
                  Ambient Stable
                </div>
              </div>
            </div>
          </div>

          {/* Mini Sparkline Telemetry Trend Charts */}
          <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#ECEEF2] mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#111827] uppercase">
                TELEMETRY ACTIVITY TRENDS
              </span>
              <span className="text-[9px] text-[#6B7280]">PAST 60 MINUTES</span>
            </div>

            {/* Pressure Trend Sparkline */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#4B5563]">
                <span>Pressure Gradient (bar)</span>
                <span className="font-bold text-[#144230]">{sensor.pressureBar} bar</span>
              </div>
              <div className="h-9 w-full bg-white rounded-xl border border-[#E5E7EB] p-1.5 flex items-end justify-between gap-1">
                {pressurePoints.map((val, idx) => {
                  const hPct = Math.max(20, Math.min(100, ((val - 3.5) / 2.0) * 100));
                  return (
                    <div key={idx} className="flex-1 bg-[#E8F7EE] rounded-sm relative group" style={{ height: `${hPct}%` }}>
                      <div className="w-full h-full bg-[#144230] rounded-sm opacity-80 group-hover:opacity-100" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Flow Trend Sparkline */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] text-[#4B5563]">
                <span>Flow Volume (m³/h)</span>
                <span className="font-bold text-[#144230]">{sensor.flowRateM3h} m³/h</span>
              </div>
              <div className="h-9 w-full bg-white rounded-xl border border-[#E5E7EB] p-1.5 flex items-end justify-between gap-1">
                {flowPoints.map((val, idx) => {
                  const hPct = Math.max(20, Math.min(100, ((val - 700) / 300) * 100));
                  return (
                    <div key={idx} className="flex-1 bg-[#E8F7EE] rounded-sm relative group" style={{ height: `${hPct}%` }}>
                      <div className="w-full h-full bg-[#22C55E] rounded-sm opacity-80 group-hover:opacity-100" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="pt-4 border-t border-[#F0F2F5] space-y-2">
          <div className="flex items-center justify-between text-[10px] text-[#6B7280] mb-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#144230]" /> Last polled: {sensor.lastUpdated}
            </span>
            <span className="text-[#144230] font-bold">Health: {sensor.healthScorePct}%</span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-full bg-[#144230] hover:bg-[#1A543E] text-white font-display font-bold text-xs tracking-wide transition-all shadow-sm cursor-pointer text-center"
          >
            Close Telemetry View
          </button>
        </div>
      </div>
    </div>
  );
};
