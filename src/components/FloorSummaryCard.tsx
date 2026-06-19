import React from 'react';
import { Link } from 'react-router-dom';
import useFloorForParkingLot from '../hooks/useFloorForParkingLot';
import { Floor } from '../types/parking';

interface FloorSummaryCardProps {
  lotId: string;
  floorId: number;
  fallbackIndex: number;
}

function floorCapacityInfo(floor?: Floor) {
  const capacity = floor?.capacity ?? 0;
  const available = floor?.available ?? 0;
  const occupied = Math.max(0, capacity - available);
  const percentFull = capacity === 0 ? 0 : Math.round((occupied / capacity) * 100);

  return {
    capacity,
    occupied,
    available,
    percentFull,
  };
}

export default function FloorSummaryCard({ lotId, floorId, fallbackIndex }: FloorSummaryCardProps) {
  const { data: floor, isLoading, isError } = useFloorForParkingLot(lotId, String(floorId));
  const { capacity, occupied, available, percentFull } = floorCapacityInfo(floor);

  return (
    <Link
      to={`/parking-lots/${lotId}/floors/${floorId}`}
      className="parking-card lot-link floor-summary-card"
    >
      <div className="parking-card-header">
        <h4>{floor?.name || `Floor ${fallbackIndex + 1}`}</h4>
        <span className="parking-status">Floor {fallbackIndex + 1}</span>
      </div>

      <div className="parking-body">
        {isLoading && <p>Loading floor capacity...</p>}
        {isError && <p className="error">Could not load floor capacity.</p>}

        {!isLoading && !isError && (
          <>
            <p><strong>Current Capacity:</strong> {occupied}</p>
            <p><strong>Total Capacity:</strong> {capacity}</p>
            <p><strong>Available:</strong> {available}</p>

            <div className="progress" aria-hidden>
              <div className="progress-bar" style={{ width: `${percentFull}%` }} />
            </div>
            <div className="progress-label">{percentFull}% full</div>
          </>
        )}
      </div>
    </Link>
  );
}
