import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomeHeroStyles.css';
import '../styles/ServicePageStyles.css';

function ServicesHome(): JSX.Element {
  return (
    <div className="settings-dashboard">
      <header className="service-header">
        <div className="service-header-nav">
          <Link to="/" className="back-link">← Isaac Home</Link>
          <Link to="/parking" className="header-action-link">Parking Home</Link>
        </div>
        <p className="service-eyebrow">Settings & diagnostics</p>
        <h1>Services Dashboard</h1>
        <p className="service-subtitle">
          Use this dashboard to navigate to the service health pages that support the parking lot app.
        </p>
      </header>

      <main className="service-container">
        <section className="service-details service-dashboard-panel">
          <div className="section-heading service-dashboard-heading">
            <div>
              <h2>Service Health Pages</h2>
              <p className="section-copy">
                Review API, database, and cache health from one place without competing with the main parking experience on the home page.
              </p>
            </div>
          </div>

          <div className="services-grid service-dashboard-grid">
            <Link to="/services/api" className="service-card">
              <div className="service-card-icon">🛫</div>
              <span className="service-card-kicker">Traffic & uptime</span>
              <h3>API Service</h3>
              <p>Check request handling, endpoint activity, uptime, and availability for the parking API.</p>
            </Link>

            <Link to="/services/database" className="service-card">
              <div className="service-card-icon">🗄️</div>
              <span className="service-card-kicker">Persistence</span>
              <h3>Database</h3>
              <p>Review the health of stored parking data for lots, floors, sections, vehicles, and spaces.</p>
            </Link>

            <Link to="/services/cache" className="service-card">
              <div className="service-card-icon">⚡</div>
              <span className="service-card-kicker">Performance</span>
              <h3>Cache Service - Not implemented yet</h3>
              <p>Monitor cache behavior that speeds up occupancy lookups and parking availability reads.</p>
            </Link>
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 LAS Parking Operations Dashboard.</p>
      </footer>
    </div>
  );
}

export default ServicesHome;
