import React, { useState } from 'react';

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
  const [isLoading, setIsLoading] = useState(false);
  const colorHex = parkingSpace?.color ? CAR_COLOR_HEX[parkingSpace.color] || '#64748b' : '#cbd5e1';
  const isOccupied = parkingSpace.occupied;

  const handleAddCar = async () => {
    setIsLoading(true);
    try {
      // TODO: Add API call to add a car to this parking space
      // Example: await addCarToParkingSpace(parkingSpace.id, sectionId);
    } catch (error) {
      console.error('Failed to add car:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCar = async () => {
    setIsLoading(true);
    try {
      // TODO: Add API call to remove a car from this parking space
      // Example: await removeCarFromParkingSpace(parkingSpace.id, sectionId);
    } catch (error) {
      console.error('Failed to remove car:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button
          onClick={handleAddCar}
          disabled={isOccupied || isLoading}
          style={{
            padding: '6px 12px',
            fontSize: '14px',
            backgroundColor: isOccupied || isLoading ? '#d1d5db' : '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isOccupied || isLoading ? 'not-allowed' : 'pointer',
            opacity: isOccupied || isLoading ? 0.6 : 1,
          }}
        >
          Add
        </button>
        <button
          onClick={handleRemoveCar}
          disabled={!isOccupied || isLoading}
          style={{
            padding: '6px 12px',
            fontSize: '14px',
            backgroundColor: !isOccupied || isLoading ? '#d1d5db' : '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: !isOccupied || isLoading ? 'not-allowed' : 'pointer',
            opacity: !isOccupied || isLoading ? 0.6 : 1,
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
