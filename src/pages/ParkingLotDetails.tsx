import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useParkingLots from '../hooks/useParkingLots';
import { ParkingLot } from '../types/parking';
import '../styles/ServicePage.css';
import '../styles/ParkingLots.css';

function pctFor(lot: ParkingLot): number {
  if (lot.totalCapacity === 0) return 0;
  const occupied = Math.max(0, lot.totalCapacity - lot.totalFreeSpaces);
  return Math.round((occupied / lot.totalCapacity) * 100);
}

interface RouteParams {
  id: string;
}

export default function ParkingLotDetails() {
  // @ts-ignore
  const { id } = useParams<RouteParams>();
  const { data: lots = [], isLoading: loading, isError } = useParkingLots();

  if (loading) return <p>Loading...</p>;
  if (isError) return <p className="error">Error: {'Unknown error'}</p>;

  // find by id (string/number)
  const lot = lots.find(l => String(l.id) === String(id));

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

          <section className="level-list">
            <h3>Levels ({lot.levelIds.length})</h3>
            {lot.levelIds.length === 0 && <p>No level data available.</p>}
            <p>Fetch and map level data</p>
            {/*{lot.levelIds.map((level, i) => {*/}
            {/*  const pct = pctFor(level);*/}
            {/*  const levelLabel = level.name || `Level ${i + 1}`;*/}
            {/*  return (*/}
            {/*    <div className="level-item" key={level.id}>*/}
            {/*      <div className="level-meta">*/}
            {/*        <strong>{levelLabel}</strong>*/}
            {/*        {level.totalCapacity !== undefined && <span className="level-cap">{level.capacity} cap</span>}*/}
            {/*      </div>*/}
            {/*      {level.available !== undefined && <p>Available: {level.available}</p>}*/}
            {/*      {level.capacity !== undefined && level.available !== undefined && pct != null && (*/}
            {/*        <div className="progress" aria-hidden>*/}
            {/*          <div className="progress-bar" style={{ width: `${pct}%` }} />*/}
            {/*          <div className="progress-label">{pct}% full</div>*/}
            {/*        </div>*/}
            {/*      )}*/}
            {/*    </div>*/}
            {/*  );*/}
            {/*})}*/}
          </section>
        </div>
      </main>
    </>
  );
}

