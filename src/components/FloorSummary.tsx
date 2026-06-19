import React from 'react';
import { Link } from 'react-router-dom';
import {Floor} from '../types/parking';
import { getCapacityInfo } from "../formattingUtils";

export default function FloorSummaryCard({ lotId, floor }: { lotId: string; floor: Floor }) {
    const { capacity, available, percentFull } = getCapacityInfo(floor.capacity, floor.totalFreeSpaces);

    return (
        <Link to={`/parking-lots/${lotId}/floors/${floor.id}`} className="parking-card lot-link lot-summary-card floor-summary-card">
            <div className="parking-card-header">
                <h4>{floor.name}</h4>
            </div>

            <div className="parking-body">
                <p><strong>Capacity:</strong> {capacity}</p>
                <p><strong>Available:</strong> {available}</p>

                <div className="progress" aria-hidden>
                    <div className="progress-bar" style={{ width: `${percentFull}%` }} />
                </div>
                <div className="progress-label">{percentFull}% full</div>
            </div>
        </Link>
    );
}