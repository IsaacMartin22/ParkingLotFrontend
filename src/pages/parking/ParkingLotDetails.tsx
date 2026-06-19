import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ParkingLot } from '../../types/parking';
import '../../styles/ServicePage.css';
import '../../styles/ParkingLots.css';
import useParkingLot from "../../hooks/useParkingLot";
import FloorSummaryCard from "../../components/FloorSummaryCard";

function pctFor(lot: ParkingLot): number {
  if (lot.totalCapacity === 0) return 0;
  const occupied = Math.max(0, lot.totalCapacity - lot.totalFreeSpaces);
  return Math.round((occupied / lot.totalCapacity) * 100);
}

interface RouteParams {
  lotId: string;
}

export default function ParkingLotDetails() {
  // @ts-ignore
  const { lotId } = useParams<RouteParams>();
  const { data: lot, isLoading: loading, isError } = useParkingLot(lotId);

  if (loading) return <p>Loading...</p>;
  if (isError) return <p className="error">Error: {'Unknown error'}</p>;

  if (!lot) {
    return (
      <div className="service-container">
        <header className="service-header">
          <Link to="/parking-lots" className="back-link">← Back to Parking Lots</Link>
          <h1>Parking Lot</h1>
        </header>
        <main className="service-details parking-container">
          <p>Parking lot not found.</p>
        </main>
      </div>
    );
  }

  const overallPct = pctFor(lot);

  return (
    <>
      <header className="service-header">
        <Link to="/parking-lots" className="back-link">← Back to Parking Lots</Link>
        <h1>{lot.name}</h1>
      </header>
      <main className="service-container">
        <div className="service-details parking-container">
          <div className="parking-card">
            <div className="parking-body">
              <p><strong>Address:</strong> {lot.address}</p>
              <p><strong>Type:</strong> {lot.type}</p>
              <p><strong>Capacity:</strong> {lot.totalCapacity}</p>
              <p><strong>Available:</strong> {lot.totalFreeSpaces}</p>
              {overallPct != null && (
                <div className="progress" aria-hidden>
                  <div className="progress-bar" style={{ width: `${overallPct}%` }} />
                  <div className="progress-label">{overallPct}% full</div>
                </div>
              )}
            </div>
          </div>

          <section className="floor-list">
            <h3>Floors ({lot.floorIds.length})</h3>
            {lot.floorIds.length === 0 && <p>No floor data available.</p>}

            {lot.floorIds.length > 0 && (
              <div className="floor-diagram">
                {lot.floorIds.sort().map((floorId, index) => (
                  <FloorSummaryCard
                    key={floorId}
                    lotId={lotId}
                    floorId={String(floorId)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

