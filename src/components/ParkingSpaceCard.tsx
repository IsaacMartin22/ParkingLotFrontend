import React from 'react';

import { ParkingSpaceResponse } from '../types/parking';

const CAR_COLOR_HEX: Record<string, string> = {
  Red: '#ef4444',
  Blue: '#3b82f6',
  Black: '#111827',
  White: '#f3f4f6',
  Silver: '#9ca3af',
  Green: '#10b981',
};

export default function ParkingSpaceCard({ parkingSpace }: { parkingSpace: ParkingSpaceResponse }) {
  const colorHex = parkingSpace?.color ? CAR_COLOR_HEX[parkingSpace.color] || '#64748b' : '#cbd5e1';
  const isOccupied = parkingSpace.occupied;

  return (
    <div
      className={`section-card ${isOccupied ? 'section-card-occupied' : 'section-card-free'}`}
      style={{
        borderColor: colorHex,
        backgroundColor: isOccupied ? `${colorHex}22` : '#f8fafc',
      }}
    >
      {isOccupied ? (
        <>
          <span>{parkingSpace.color} {parkingSpace.manufacturingYear} {parkingSpace.make} {parkingSpace.model}</span>
        </>
      ) : isOccupied ? (
        <span>Occupied</span>
      ) : (
        <span>Open</span>
      )}
    </div>
  );
}
