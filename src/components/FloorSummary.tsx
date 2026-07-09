import React from 'react';
import { Link } from 'react-router-dom';
import {Floor} from '../types/parking';
import { getCapacityInfo } from "../formattingUtils";

export default function FloorSummaryCard({ lotId, floor }: { lotId: string; floor: Floor }) {
    const { capacity, occupied, available, percentFull } = getCapacityInfo(floor.capacity, floor.totalFreeSpaces);

    return (
        <Link to={`/parking-lots/${lotId}/floors/${floor.id}`} className="parking-card lot-link lot-summary-card floor-summary-card">
            <div className="parking-card-header">
                <h4>{floor.name}</h4>
            </div>

            <div className="parking-body">
                <div className="parking-stat-grid parking-stat-grid--two-col">
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
                </div>

                <div className="progress" aria-hidden>
                    <div className="progress-bar" style={{ width: `${percentFull}%` }} />
                </div>
                <div className="progress-label">{percentFull}% full</div>
            </div>
        </Link>
    );
}