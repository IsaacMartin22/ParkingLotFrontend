import React from 'react';
import { Car } from '../types/parking';

interface CarCardProps {
  car?: Car | null;
  occupied?: boolean;
}

const CAR_COLOR_HEX: Record<string, string> = {
  Red: '#ef4444',
  Blue: '#3b82f6',
  Black: '#111827',
  White: '#f3f4f6',
  Silver: '#9ca3af',
  Green: '#10b981',
};

export default function CarCard({ car, occupied = false }: CarCardProps) {
  const colorHex = car?.color ? CAR_COLOR_HEX[car.color] || '#64748b' : '#cbd5e1';
  const isOccupied = occupied || car !== null;

  return (
    <div
      className={`section-card ${isOccupied ? 'section-card-occupied' : 'section-card-free'}`}
      style={{
        borderColor: colorHex,
        backgroundColor: isOccupied ? `${colorHex}22` : '#f8fafc',
      }}
    >
      {car ? (
        <>
          <span>{car.color} {car.manufacturingYear} {car.make} {car.model}</span>
        </>
      ) : isOccupied ? (
        <span>Occupied</span>
      ) : (
        <span>Open</span>
      )}
    </div>
  );
}
