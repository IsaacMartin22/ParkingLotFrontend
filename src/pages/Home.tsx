import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomeHeroStyles.css';
import '../styles/ServicePageStyles.css';

function Home(): JSX.Element {
  return (
    <div className="settings-dashboard">
      <header className="service-header">
        <div className="service-header-nav">
          <Link to="/" className="back-link">← Home</Link>
          <Link to="/services" className="header-action-link">Services Dashboard</Link>
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
                This area demonstrates the product-facing experience. Visit Isaac's intro page for context,
                then use this home to evaluate the parking user journey end to end.
              </p>
            </div>
          </div>

          <div className="services-grid service-dashboard-grid">
            <Link to="/parking-lots" className="service-card primary-service-card">
              <div className="service-card-icon">🅿️</div>
              <span className="service-card-kicker">Primary experience</span>
              <h3>Terminal Parking Explorer</h3>
              <p>View real-time section and space availability for lots and floors.</p>
            </Link>

            <Link to="/services" className="service-card">
              <div className="service-card-icon">⚙️</div>
              <span className="service-card-kicker">Diagnostics</span>
              <h3>Services Dashboard</h3>
              <p>View the health of the services this site depends on.</p>
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

export default Home;
