import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomeHeroStyles.css';
import '../styles/ServicePageStyles.css';

function ParkingHome(): JSX.Element {
  return (
    <div className="settings-dashboard">
      <header className="service-header">
        <div className="service-header-nav">
          <Link to="/" className="back-link">← Home</Link>
        </div>
        <p className="service-eyebrow">Project demo · parking experience</p>
        <h1>Parking App Home</h1>
        <p className="service-subtitle">
          Explore the core product workflow with live parking lot and floor availability, then jump to
          service dashboards for system-level diagnostics.
        </p>
      </header>

      <main className="service-container">
        <section className="service-details service-dashboard-panel">
          <div className="section-heading service-dashboard-heading">
            <div>
              <h2>Parking Application</h2>
              <p className="section-copy">
                The Parking Explorer demonstrates the product-facing experience. The service dashboards display diagnostic
                information relevant to each service. The non-database dashboards contain external URLs that
                demonstrate their intended use.
              </p>
            </div>
          </div>

          <div className="services-grid service-dashboard-grid">
            <Link to="/parking-lots" className="service-card primary-service-card">
              <div className="service-card-icon">🅿️</div>
              <span className="service-card-kicker">Primary experience</span>
              <h3>Parking Explorer</h3>
              <p>View real-time section and space availability for lots and floors.</p>
            </Link>

            <Link to="/services/api" className="service-card">
              <div className="service-card-icon">🛫</div>
              <span className="service-card-kicker">Traffic</span>
              <h3>API Service</h3>
              <p>Check request handling, endpoint activity, uptime, and availability for the parking API.</p>
            </Link>

            <Link to="/services/generator" className="service-card">
              <div className="service-card-icon">⚡</div>
              <span className="service-card-kicker">Update</span>
              <h3>Event Generator</h3>
              <p>Use a Maven published SDK to trigger a stream of Parking Lot events. The site updates in real time.</p>
            </Link>

            <Link to="/services/database" className="service-card">
              <div className="service-card-icon">🗄️</div>
              <span className="service-card-kicker">Persistence</span>
              <h3>Database</h3>
              <p>Review the health of stored parking data for lots, floors, sections, vehicles, and spaces.</p>
            </Link>
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Isaac - Parking App Demo.</p>
      </footer>
    </div>
  );
}

export default ParkingHome;
