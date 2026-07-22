import React from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../styles/ServicePageStyles.css';
import '../../styles/ParkingLots.css';
import useParkingLot from "../../network/useParkingLot";
import useAnalyticsErrorReporter from '../../network/useAnalyticsErrorReporter';
import FloorSummary from "../../components/FloorSummary";

interface RouteParams {
  lotId: string;
}

export default function ParkingLotDetails() {
  // @ts-ignore
  const { lotId } = useParams<RouteParams>();
  const { data: lot, isLoading: loading, isError, error } = useParkingLot(lotId);
  useAnalyticsErrorReporter(error, 'Unknown error');

  if (loading) return <p>Loading...</p>;
  if (isError) return <p className="error">Error: {'Unknown error'}</p>;

  if (!lot) {
    return (
      <div className="service-container">
        <header className="service-header parking-page--lot-details">
          <div className="service-header-nav">
            <Link to="/parking-lots" className="back-link" data-analytics-id="back-parking-lot-not-found">← Parking Lots</Link>
          </div>
          <p className="parking-page-path">Hierarchy: Lots {'>'} Floors</p>
          <p className="service-eyebrow">Parking lot app</p>
          <div className="parking-page-level">
            <span className="parking-level-pill parking-level-pill--lot">Level 2 - Lot Floors</span>
          </div>
          <h1>Parking Lot</h1>
          <p className="service-subtitle">Return to the parking lots overview to choose another lot.</p>
        </header>
        <main className="service-details parking-container parking-content--lot">
          <p>Parking lot not found.</p>
        </main>
      </div>
    );
  }

  return (
    <>
      <header className="service-header parking-page--lot-details">
        <div className="service-header-nav">
          <Link to="/parking-lots" className="back-link">← Parking Lots</Link>
        </div>
        <p className="parking-page-path">Hierarchy: Lots {'>'} Floors</p>
        <p className="service-eyebrow">Parking lot app</p>
        <div className="parking-page-level">
          <span className="parking-level-pill parking-level-pill--lot">Level 2 - Lot Floors</span>
        </div>
        <h1>{lot.name}</h1>
        <p className="service-subtitle">
          Review lot capacity, current availability, and the floors available for deeper inspection.
        </p>
      </header>
      <main className="service-container">
        <div className="service-details parking-container parking-content--lot">
          <section className="floor-list">
            <h3>Floors ({lot.floorIds.length})</h3>
            {lot.floorIds.length === 0 && <p>No floor data available.</p>}

            {lot.floorIds.length > 0 && (
                <div className="floor-summary-grid">
                  {lot.floors.sort((a, b) => a.name.localeCompare(b.name)).map((floor) => (
                      <FloorSummary
                          key={floor.id}
                          lotId={lotId}
                          floor={floor}
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
