import React from 'react';
import { Link } from 'react-router-dom';
import { ParkingLot } from '../types/parking';

function percentFull(lot: ParkingLot): number {
  if (lot.totalCapacity === 0) return 0;
  const occupied = lot.totalCapacity - lot.totalFreeSpaces;
  return Math.round((occupied / lot.totalCapacity) * 100);
}

interface ParkingLotCardProps {
  lot: ParkingLot;
}

export default function Floors({ lot }: ParkingLotCardProps) {
  const pct = percentFull(lot);

  return (
    <Link to={`/parking-lots/${lot.id}`} className="parking-card lot-link">
      <div className="parking-card-header">
        <h4>{lot.name}</h4>
        <span className="parking-status">{lot.type}</span>
      </div>

      <div className="parking-body">
        <p><strong>Capacity:</strong> {lot.totalCapacity}</p>
        <p><strong>Available:</strong> {lot.totalFreeSpaces}</p>
        {pct != null && (
          <div className="progress" aria-hidden>
            <div className="progress-bar" style={{ width: `${pct}%` }} />
            <div className="progress-label">{pct}% full</div>
          </div>
        )}
        {lot.levelIds && lot.levelIds.length > 0 && (
          <p><strong>Levels:</strong> {lot.levelIds.length}</p>
        )}
      </div>
    </Link>
  );
}

