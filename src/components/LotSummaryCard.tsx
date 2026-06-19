import React from 'react';
import { Link } from 'react-router-dom';
import { ParkingLotResponse } from '../types/parking';
import { getCapacityInfo } from "../formattingUtils";

interface LotSummaryCardProps {
  lot: ParkingLotResponse;
}

export default function LotSummaryCard({ lot }: LotSummaryCardProps) {
  const { capacity, occupied, available, percentFull } = getCapacityInfo(lot.totalCapacity, lot.totalFreeSpaces);

  return (
    <Link to={`/parking-lots/${lot.id}`} className="parking-card lot-link lot-summary-card">
      <div className="parking-card-header">
        <h4>{lot.name}</h4>
        <span className="parking-status">{lot.type}</span>
      </div>

      <div className="parking-body">
        <p><strong>Current Capacity:</strong> {occupied}</p>
        <p><strong>Total Capacity:</strong> {capacity}</p>
        <p><strong>Available:</strong> {available}</p>
        <p><strong>Floors:</strong> {lot.floorIds.length}</p>

        <div className="progress" aria-hidden>
          <div className="progress-bar" style={{ width: `${percentFull}%` }} />
        </div>
        <div className="progress-label">{percentFull}% full</div>
      </div>
    </Link>
  );
}
