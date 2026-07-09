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
        <div className="parking-stat-grid">
          <div className="parking-stat">
            <span className="parking-stat-label">Occupied</span>
            <strong className="parking-stat-value">{occupied}</strong>
          </div>
          <div className="parking-stat">
            <span className="parking-stat-label">Capacity</span>
            <strong className="parking-stat-value">{capacity}</strong>
          </div>
          <div className="parking-stat">
            <span className="parking-stat-label">Available</span>
            <strong className="parking-stat-value">{available}</strong>
          </div>
          <div className="parking-stat">
            <span className="parking-stat-label">Floors</span>
            <strong className="parking-stat-value">{lot.floorIds.length}</strong>
          </div>
        </div>

        <div className="progress" aria-hidden>
          <div className="progress-bar" style={{ width: `${percentFull}%` }} />
        </div>
        <div className="progress-label">{percentFull}% full</div>
      </div>
    </Link>
  );
}
