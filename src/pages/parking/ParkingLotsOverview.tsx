import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ServicePageStyles.css';
import '../../styles/ParkingLots.css';
import useListParkingLots from '../../network/useListParkingLots';
import LotSummaryCard from "../../components/LotSummaryCard";

function ParkingLotsOverview() {
  const { data: lots = [], isLoading: loading, isError } = useListParkingLots();

  return (
    <>
      <header className="service-header parking-page--lots">
        <div className="service-header-nav">
          <Link to="/parking" className="back-link">← Parking Home</Link>
        </div>
        <p className="parking-page-path">Hierarchy: Lots</p>
        <p className="service-eyebrow">Parking lot app</p>
        <div className="parking-page-level">
          <span className="parking-level-pill parking-level-pill--lots">Level 1 - Lots</span>
        </div>
        <h1>Parking Lots</h1>
        <p className="service-subtitle">
          Browse live parking lots and drill down into floors, sections, and current space availability.
        </p>
      </header>
      <main className="service-container">
        <div className="service-details parking-container parking-content--lots">
          <h3>Parking Lots Overview</h3>
          {loading && <p>Loading parking lot data...</p>}
          {isError && <p className="error">Error: {'Error fetching parking lot data'}</p>}

          {!loading && !isError && (
            <div className="parking-grid">
              {lots.length === 0 && <p>No parking lots found.</p>}
              {lots.sort((a, b) => a.name.localeCompare(b.name)).map((lot) => (
                <LotSummaryCard key={lot.id} lot={lot} />
              ))}
            </div>
          )}
        </div>
      </main>
      <footer>
        <p>&copy; 2026 LAS Parking Operations Dashboard.</p>
      </footer>
    </>
  );
}

export default ParkingLotsOverview;

