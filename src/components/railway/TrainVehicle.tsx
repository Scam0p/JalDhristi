import React from 'react';
import { Train } from '../../types/simulation';

interface TrainVehicleProps {
  train: Train;
  onClick: (train: Train) => void;
  isSelected: boolean;
}

export const TrainVehicle: React.FC<TrainVehicleProps> = ({ train, onClick, isSelected }) => {
  let statusColor = '#144230'; // Dark forest green for in service
  let label = 'IN SERVICE';

  if (train.status === 'INDUCTING') {
    statusColor = '#22C55E'; // Emerald green
    label = 'INDUCTING';
  } else if (train.status === 'READY_INDUCTION') {
    statusColor = '#059669';
    label = 'READY';
  } else if (train.status === 'STANDBY') {
    statusColor = '#D97706'; // Amber
    label = 'STANDBY';
  } else if (train.status === 'MAINTENANCE') {
    statusColor = '#DC2626'; // Red
    label = 'FAULT';
  }

  // Calculated SVG coordinates on the 1200x480 canvas
  let posX = 200;
  let posY = 290;

  if (train.status === 'STANDBY' || train.status === 'READY_INDUCTION') {
    if (train.id === 'T02') {
      posX = 70;
      posY = 95;
    } else if (train.id === 'T06') {
      posX = 120;
      posY = 95;
    } else if (train.id === 'T08') {
      posX = 170;
      posY = 95;
    } else {
      posX = 110;
      posY = 95;
    }
  } else if (train.status === 'MAINTENANCE') {
    posX = 390;
    posY = 210; // Kalamassery emergency siding
  } else if (train.status === 'INDUCTING') {
    // Siding transition from depot (140, 100) to Aluva mainline (200, 290)
    const t = Math.min(1, train.trackProgress / 20);
    posX = 140 + t * 60;
    posY = 100 + t * 190;
  } else {
    // Mainline track progress: 18% (Aluva) to 96% (Tripunithura) -> X: 200 to 1120
    const normalized = (train.trackProgress - 18) / (96 - 18);
    const clamped = Math.max(0, Math.min(1, normalized));
    posX = 200 + clamped * 920;
    posY = train.direction === 'DOWN' ? 272 : 308; // Down / Up track separation
  }

  const loadPercentage = Math.round((train.passengerLoad / train.capacity) * 100);

  return (
    <g
      onClick={() => onClick(train)}
      className="cursor-pointer select-none transition-transform duration-300"
      style={{
        transform: `translate(${posX}px, ${posY}px)`
      }}
    >
      {/* Subtle selection ring */}
      {isSelected && (
        <circle
          cx="0"
          cy="0"
          r="26"
          fill="none"
          stroke="#144230"
          strokeWidth="2"
          strokeDasharray="4 2"
        />
      )}

      {/* Stylized Metro Train Carriage (High Contrast & Crisp) */}
      <g transform="translate(-28, -13)">
        {/* Main Body */}
        <rect
          x="0"
          y="0"
          width="56"
          height="26"
          rx="6"
          fill="#FFFFFF"
          stroke={isSelected ? '#144230' : statusColor}
          strokeWidth={isSelected ? '2.5' : '1.8'}
          className="drop-shadow-xs"
        />

        {/* Metro Nose Accent */}
        {train.direction === 'DOWN' ? (
          <path
            d="M 50 4 Q 55 13 50 22 L 55 13 Z"
            fill={statusColor}
          />
        ) : (
          <path
            d="M 6 4 Q 1 13 6 22 L 1 13 Z"
            fill={statusColor}
          />
        )}

        {/* Windows */}
        <rect x="9" y="6" width="7" height="6" rx="1.5" fill="#144230" opacity="0.85" />
        <rect x="20" y="6" width="7" height="6" rx="1.5" fill="#144230" opacity="0.85" />
        <rect x="31" y="6" width="7" height="6" rx="1.5" fill="#144230" opacity="0.85" />
        <rect x="42" y="6" width="5" height="6" rx="1.5" fill="#144230" opacity="0.85" />

        {/* Load Bar */}
        <rect x="8" y="17" width="40" height="3.5" rx="1" fill="#E5E7EB" />
        <rect
          x="8"
          y="17"
          width={Math.max(2, (loadPercentage / 100) * 40)}
          height="3.5"
          rx="1"
          fill={loadPercentage > 85 ? '#EF4444' : loadPercentage > 65 ? '#F59E0B' : '#22C55E'}
        />
      </g>

      {/* Train ID Badge (Top) */}
      <rect
        x="-16"
        y="-27"
        width="32"
        height="13"
        rx="4"
        fill="#144230"
        stroke="#FFFFFF"
        strokeWidth="1"
      />
      <text
        x="0"
        y="-18"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="8.5"
        fontWeight="bold"
        fontFamily="JetBrains Mono"
      >
        {train.id}
      </text>

      {/* Speed / Status Pill (Bottom) */}
      <rect
        x="-22"
        y="16"
        width="44"
        height="12"
        rx="3"
        fill="#FFFFFF"
        stroke="#E5E7EB"
        strokeWidth="1"
      />
      <text
        x="0"
        y="25"
        textAnchor="middle"
        fill={statusColor}
        fontSize="7.5"
        fontWeight="bold"
        fontFamily="JetBrains Mono"
      >
        {train.speedKmh > 0 ? `${train.speedKmh} km/h` : label}
      </text>
    </g>
  );
};
