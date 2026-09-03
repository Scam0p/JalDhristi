import React from 'react';
import { SensorNode } from '../../types/simulation';

interface TrainVehicleProps {
  train: SensorNode;
  onClick: (sensor: SensorNode) => void;
  isSelected?: boolean;
}

export const TrainVehicle: React.FC<TrainVehicleProps> = ({ train: sensor, onClick, isSelected }) => {
  return (
    <g
      onClick={() => onClick(sensor)}
      className="cursor-pointer group"
      transform={`translate(${sensor.chainageKm * 30}, 200)`}
    >
      <circle
        cx="0"
        cy="0"
        r={isSelected ? "14" : "10"}
        fill={sensor.status === 'CRITICAL' ? '#EF4444' : sensor.status === 'WARNING' ? '#F59E0B' : '#144230'}
        stroke="#FFFFFF"
        strokeWidth="2"
      />
      <text
        x="0"
        y="18"
        textAnchor="middle"
        fill="#111827"
        fontSize="8"
        fontFamily="JetBrains Mono"
        fontWeight="bold"
      >
        {sensor.id}
      </text>
    </g>
  );
};
