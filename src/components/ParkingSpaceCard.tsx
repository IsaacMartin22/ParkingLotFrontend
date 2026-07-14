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
  const vehicleName = `${parkingSpace.manufacturingYear || ''} ${parkingSpace.make || ''} ${parkingSpace.model || ''}`.trim();
  const cardStyle: React.CSSProperties & { '--space-car-color': string } = {
    '--space-car-color': colorHex,
    backgroundColor: isOccupied ? `${colorHex}1f` : '#f8fafc',
  };

  const handleAddCar = () => addCar.mutate(parkingSpace.id);
  const handleRemoveCar = () => removeCar.mutate(parkingSpace.id);

  return (
    <div
      className={`section-card space-card ${isOccupied ? 'section-card-occupied' : 'section-card-free'}`}
      style={cardStyle}
    >
      <div className="space-card-header">
        <strong className="space-card-number">Space {parkingSpace.number}</strong>
        <span className={`space-card-status ${isOccupied ? 'space-card-status--occupied' : 'space-card-status--open'}`}>
          {isOccupied ? 'Occupied' : 'Open'}
        </span>
      </div>

      {isOccupied ? (
        <>
          <p className="space-card-vehicle">{vehicleName || 'Vehicle details unavailable'}</p>
          <dl className="space-card-meta">
            <div>
              <dt>Color</dt>
              <dd className="space-card-color-value">{parkingSpace.color || 'Unknown'}</dd>
            </div>
            <div>
              <dt>Plate</dt>
              <dd>{parkingSpace.licensePlate || 'Unknown'}</dd>
            </div>
          </dl>
        </>
      ) : (
        <p className="space-card-open-note">Empty</p>
      )}

      <div className="space-action-buttons">
        <button
          data-analytics-id={"add-car-"+parkingSpace.id}
          onClick={handleAddCar}
          disabled={isOccupied || isLoading}
          aria-label="Add car"
          title="Add car"
          className="space-action-btn space-action-btn--add"
        >
          +
        </button>
        <button
          data-analytics-id={"remove-car-"+parkingSpace.id}
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
