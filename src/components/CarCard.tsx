import React from 'react';
import { Car } from '../types/parking';

interface CarCardProps {
  car?: Car | null;
}

const CAR_COLOR_HEX: Record<string, string> = {
  Red: '#ef4444',
  Blue: '#3b82f6',
  Black: '#111827',
  White: '#f3f4f6',
  Silver: '#9ca3af',
  Green: '#10b981',
};

export default function CarCard({ car }: CarCardProps) {
  const colorHex = car?.color ? CAR_COLOR_HEX[car.color] || '#64748b' : '#cbd5e1';

  return (
    <div
      className={`section-card ${car ? 'section-card-occupied' : 'section-card-free'}`}
      style={{
        borderColor: colorHex,
        backgroundColor: car ? `${colorHex}22` : '#f8fafc',
      }}
    >
      {car ? (
        <>
          <span>{car.color} {car.manufacturingYear} {car.make} {car.model}</span>
        </>
      ) : (
        <span>Open</span>
      )}
    </div>
  );
}
