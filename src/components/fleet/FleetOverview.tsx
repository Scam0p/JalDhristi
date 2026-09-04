import React from 'react';
import { SensorNode } from '../../types/simulation';
import { Droplets, ChevronRight, Battery, Wifi } from 'lucide-react';

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
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 select-none shadow-none">
      {/* SCADA Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-[#F4F5F7] border border-[#E5E7EB] text-[#144230]">
            <Droplets className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div>
            <h2 className="font-mono-tech font-bold text-xs md:text-sm uppercase tracking-wider text-[#111827]">
              PIPELINE NETWORK &amp; SENSOR FLEET INVENTORY
            </h2>
            <p className="text-[11px] font-mono-tech text-[#6B7280]">
              8 Distributed Sensor Transducers • LoRaWAN / NB-IoT / Modbus-RTU Telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-tech text-[#4B5563]">
          <div className="bg-[#F4F5F7] px-2.5 py-1 rounded border border-[#E5E7EB]">
            <span className="text-[#6B7280]">ONLINE NODES: </span>
            <span className="text-[#144230] font-bold">
              {sensors.filter(t => t.status === 'NORMAL' || t.status === 'WARNING').length} / {sensors.length}
            </span>
          </div>
          <div className="bg-[#F4F5F7] px-2.5 py-1 rounded border border-[#E5E7EB]">
            <span className="text-[#6B7280]">ANOMALIES: </span>
            <span className="text-[#DC2626] font-bold">
              {sensors.filter(t => t.status === 'WARNING' || t.status === 'CRITICAL').length}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 8 Sensor Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono-tech">
        {sensors.map((sensor) => {
          const isSelected = selectedTrain?.id === sensor.id;
          const badge = getStatusBadge(sensor.status);

          return (
            <div
              key={sensor.id}
              onClick={() => onSelectTrain(sensor)}
              className={`p-3.5 rounded border transition-colors cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#E8F7EE]/40 border-[#144230]'
                  : 'bg-white hover:bg-[#F9FAFB] border-[#E5E7EB] hover:border-[#D1D5DB]'
              }`}
            >
              {/* Top: Sensor ID & Status Badge */}
              <div>
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#F3F4F6]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-base text-[#111827]">
                      {sensor.id}
                    </span>
                    <span className="text-[9px] text-[#6B7280] bg-[#F4F5F7] px-1 rounded border border-[#E5E7EB]">
                      {sensor.sensorType.split('_')[0]}
                    </span>
                  </div>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${badge.bg}`}>
                    {badge.text}
                  </span>
                </div>

                {/* Sensor Name & Location */}
                <h4 className="font-bold text-xs text-[#111827] mb-0.5 truncate">
                  {sensor.name}
                </h4>
                <p className="text-[10px] text-[#6B7280] mb-2.5 truncate">
                  {sensor.location}
                </p>

                {/* Primary Telemetry Values Grid */}
                <div className="grid grid-cols-2 gap-2 mb-2.5">
                  <div className="p-2 rounded bg-[#F9FAFB] text-center border border-[#E5E7EB]">
                    <span className="text-[8px] text-[#6B7280] block uppercase font-bold">PRESSURE</span>
                    <span className="font-bold text-xs text-[#111827]">
                      {sensor.pressureBar.toFixed(2)} <span className="text-[9px] font-normal text-[#6B7280]">bar</span>
                    </span>
                  </div>

                  <div className="p-2 rounded bg-[#F9FAFB] text-center border border-[#E5E7EB]">
                    <span className="text-[8px] text-[#6B7280] block uppercase font-bold">FLOW RATE</span>
                    <span className="font-bold text-xs text-[#111827]">
                      {sensor.flowRateM3h} <span className="text-[9px] font-normal text-[#6B7280]">m³/h</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Diagnostics Row */}
              <div className="pt-2 border-t border-[#F0F2F5] flex items-center justify-between text-[10px] text-[#6B7280]">
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

export default FleetOverview;
