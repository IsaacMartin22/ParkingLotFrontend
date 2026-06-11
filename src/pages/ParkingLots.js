import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ServicePage.css';
import '../styles/ParkingLots.css';
import useParkingLots from '../hooks/useParkingLots';

function ParkingLots() {
  const { data: lots = [], isLoading: loading, isError, error } = useParkingLots();

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
          {isError && <p className="error">Error: {error?.message || error}</p>}

          {!loading && !isError && (
            <div className="parking-grid">
              {lots.length === 0 && <p>No parking lots found.</p>}
              {lots.map((lot, idx) => (
                <div className="parking-card" key={lot.id || idx}>
                  <div className="parking-card-header">
                    <h4>{lot.name || lot.title || `Lot ${idx + 1}`}</h4>
                    <span className="parking-status">{lot.status || 'Unknown'}</span>
                  </div>
                  <div className="parking-body">
                    <p><strong>Capacity:</strong> {lot.capacity ?? '—'}</p>
                    <p><strong>Available:</strong> {lot.available ?? '—'}</p>
                    {lot.address && <p><strong>Address:</strong> {lot.address}</p>}
                    {lot.coordinates && <p><strong>Coordinates:</strong> {lot.coordinates.lat}, {lot.coordinates.lng}</p>}
                  </div>
                </div>
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

