import React from 'react';

import { ParkingSpaceResponse } from '../types/parking';
import '../styles/ParkingSpaceCard.css';
import { useAddCar, useRemoveCar } from '../network/useParkingSpace';

const CAR_COLOR_HEX: Record<string, string> = {
  Red: '#ef4444',
  Blue: '#3b82f6',
  Black: '#111827',
  White: '#f3f4f6',
  Silver: '#9ca3af',
  Green: '#10b981',
};

export default function ParkingSpaceCard({ parkingSpace }: { parkingSpace: ParkingSpaceResponse }) {
  const addCar = useAddCar();
  const removeCar = useRemoveCar();
  const isLoading = addCar.isLoading || removeCar.isLoading;
  const colorHex = parkingSpace?.color ? CAR_COLOR_HEX[parkingSpace.color] || '#64748b' : '#cbd5e1';
  const isOccupied = parkingSpace.occupied;

  const handleAddCar = () => addCar.mutate(parkingSpace.id);
  const handleRemoveCar = () => removeCar.mutate(parkingSpace.id);

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
      ) : (
        <span>Open</span>
      )}
      <div className="space-action-buttons">
        <button
          onClick={handleAddCar}
          disabled={isOccupied || isLoading}
          aria-label="Add car"
          title="Add car"
          className="space-action-btn space-action-btn--add"
        >
          +
        </button>
        <button
          onClick={handleRemoveCar}
          disabled={!isOccupied || isLoading}
          aria-label="Remove car"
          title="Remove car"
          className="space-action-btn space-action-btn--remove"
        >
          -
        </button>
      </div>
    </div>
  );
}
