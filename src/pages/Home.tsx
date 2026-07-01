import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomeHeroStyles.css';

function Home(): JSX.Element {
  return (
    <div className="app-home">
      <header className="home-hero">
        <div className="service-header-nav">
          <Link to="/" className="back-link">← Isaac Home</Link>
        </div>
        <div className="container hero-content">
          <p className="eyebrow">Project Demo · Parking Experience</p>
          <h1>Parking App Home</h1>
          <p className="hero-copy">
            Explore the core product workflow with live parking lot and floor availability, then jump to
            service dashboards for system-level diagnostics.
          </p>

          <div className="hero-actions">
            <Link to="/parking-lots" className="primary-action-link">Open parking explorer</Link>
            <Link to="/services" className="secondary-action-link">Open services dashboard</Link>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="airport-status-strip" aria-label="Airport parking status highlights">
          <div>
            <span className="status-label">Role</span>
            <strong>Frontend Demo</strong>
          </div>
          <div>
            <span className="status-label">Primary flow</span>
            <strong>Parking Explorer</strong>
          </div>
          <div>
            <span className="status-label">Supporting flow</span>
            <strong>Service Diagnostics</strong>
          </div>
        </section>

        <section className="page-section">
          <div className="section-heading">
            <div>
              <h2>Parking Application</h2>
              <p className="section-copy">
                This area demonstrates the product-facing experience. Visit Isaac's intro page for context,
                then use this home to evaluate the parking user journey end to end.
              </p>
            </div>
            <Link to="/parking-lots" className="text-link">Browse parking lots →</Link>
          </div>

          <div className="services-grid home-feature-grid">
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
