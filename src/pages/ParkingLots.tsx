import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ServicePage.css';
import '../styles/ParkingLots.css';
import useParkingLots from '../hooks/useParkingLots';
import Floors from '../components/Floors';

function ParkingLots() {
  const { data: lots = [], isLoading: loading, isError } = useParkingLots();

  return (
    <>
      <header className="service-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Parking Lots</h1>
      </header>
      <main className="service-container">
        <div className="service-details parking-container">
          <h3>Parking Lots Overview</h3>
          {loading && <p>Loading parking lot data...</p>}
          {isError && <p className="error">Error: {'Error fetching parking lot data'}</p>}

          {!loading && !isError && (
            <div className="parking-grid">
              {lots.length === 0 && <p>No parking lots found.</p>}
              {lots.map((lot) => (
                <Floors lot={lot} />
              ))}
            </div>
          )}
        </div>
      </main>
      <footer>
        <p>&copy; 2025 React Application. All rights reserved.</p>
      </footer>
    </>
  );
}

export default ParkingLots;

