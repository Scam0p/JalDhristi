import React from 'react';
import { SensorNode } from '../../types/simulation';
import { Droplets, ChevronRight, Gauge, Battery, Wifi, Activity } from 'lucide-react';

interface FleetOverviewProps {
  trains: SensorNode[];
  onSelectTrain: (sensor: SensorNode) => void;
  selectedTrain: SensorNode | null;
}

export const FleetOverview: React.FC<FleetOverviewProps> = ({
  trains: sensors,
  onSelectTrain,
  selectedTrain
}) => {
  const getStatusBadge = (status: SensorNode['status']) => {
    switch (status) {
      case 'NORMAL':
        return { text: 'HEALTHY NOMINAL', bg: 'bg-[#E8F7EE] text-[#144230] border-[#B7E4C7]' };
      case 'WARNING':
        return { text: 'RESIDUAL WARNING', bg: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]' };
      case 'CRITICAL':
        return { text: 'LEAK ANOMALY', bg: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]' };
      case 'CALIBRATING':
        return { text: 'CALIBRATION MODE', bg: 'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]' };
      default:
        return { text: status, bg: 'bg-[#F4F5F7] text-[#4B5563] border-[#E5E7EB]' };
    }
  };

  return (
    <div className="donezo-card p-6 select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-[#F0F2F5]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#E8F7EE] text-[#144230]">
            <Droplets className="w-5 h-5 text-[#22C55E]" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base md:text-lg text-[#111827]">
              Pipeline Network & Sensor Fleet Inventory
            </h2>
            <p className="text-xs text-[#6B7280]">
              8 Distributed Smart Sensor Nodes • LoRaWAN / NB-IoT / Modbus-RTU Telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-tech text-[#4B5563]">
          <div className="bg-[#F4F5F7] px-3 py-1 rounded-full border border-[#E5E7EB]">
            <span className="text-[#9CA3AF]">ONLINE NODES: </span>
            <span className="text-[#144230] font-bold">
              {sensors.filter(t => t.status === 'NORMAL' || t.status === 'WARNING').length} / {sensors.length}
            </span>
          </div>
          <div className="bg-[#F4F5F7] px-3 py-1 rounded-full border border-[#E5E7EB]">
            <span className="text-[#9CA3AF]">ANOMALIES: </span>
            <span className="text-[#EF4444] font-bold">
              {sensors.filter(t => t.status === 'WARNING' || t.status === 'CRITICAL').length}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 8 Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sensors.map((sensor) => {
          const isSelected = selectedTrain?.id === sensor.id;
          const badge = getStatusBadge(sensor.status);

          return (
            <div
              key={sensor.id}
              onClick={() => onSelectTrain(sensor)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#E8F7EE]/50 border-2 border-[#144230] shadow-sm'
                  : 'bg-white hover:bg-[#F9FAFB] border-[#ECEEF2] hover:border-[#D1D5DB]'
              }`}
            >
              {/* Top: Sensor ID & Status Badge */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech font-black text-xl text-[#111827]">
                      {sensor.id}
                    </span>
                    <span className="text-[10px] font-mono-tech text-[#6B7280]">
                      {sensor.sensorType.split('_')[0]}
                    </span>
                  </div>
                  <span className={`text-[8px] font-mono-tech font-bold px-2 py-0.5 rounded-full border uppercase ${badge.bg}`}>
                    {badge.text}
                  </span>
                </div>

                {/* Sensor Name & Location */}
                <h4 className="font-display font-bold text-xs text-[#111827] mb-0.5 line-clamp-1">
                  {sensor.name}
                </h4>
                <p className="text-[10px] font-mono-tech text-[#6B7280] mb-3 line-clamp-1">
                  {sensor.location}
                </p>

                {/* Primary Telemetry Values Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="p-2 rounded-xl bg-[#F4F5F7] text-center border border-[#E5E7EB]">
                    <span className="text-[9px] text-[#9CA3AF] block font-mono-tech uppercase">PRESSURE</span>
                    <span className="font-mono-tech font-bold text-sm text-[#111827]">
                      {sensor.pressureBar.toFixed(2)} <span className="text-[9px] font-normal text-[#6B7280]">bar</span>
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#F4F5F7] text-center border border-[#E5E7EB]">
                    <span className="text-[9px] text-[#9CA3AF] block font-mono-tech uppercase">FLOW RATE</span>
                    <span className="font-mono-tech font-bold text-sm text-[#111827]">
                      {sensor.flowRateM3h} <span className="text-[9px] font-normal text-[#6B7280]">m³/h</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Diagnostics Row */}
              <div className="pt-2 border-t border-[#F0F2F5] flex items-center justify-between text-[10px] font-mono-tech text-[#6B7280]">
                <span className="flex items-center gap-1">
                  <Battery className="w-3 h-3 text-[#144230]" /> {sensor.batteryPct}%
                </span>
                <span className="flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-[#144230]" /> {sensor.protocol}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
