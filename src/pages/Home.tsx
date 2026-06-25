import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomeHeroStyles.css';

function Home(): JSX.Element {
  return (
    <div className="app-home">
      <header className="home-hero">
        <div className="container hero-toolbar">
          <span className="hero-brand-chip">Parking Lot App</span>
        </div>

        <div className="container hero-content">
          <p className="eyebrow">Harry Reid International Airport · LAS</p>
          <h1>Parking Lot App</h1>
          <p className="hero-copy">
            Start from one central home page to explore airport parking lots, inspect floor availability,
            and keep the operational parking experience front and center.
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
            <span className="status-label">Airport</span>
            <strong>LAS</strong>
          </div>
          <div>
            <span className="status-label">Mode</span>
            <strong>Live Parking</strong>
          </div>
          <div>
            <span className="status-label">Services</span>
            <strong>Settings Dashboard</strong>
          </div>
        </section>

        <section className="page-section">
          <div className="section-heading">
            <div>
              <h2>Parking Operations Home</h2>
              <p className="section-copy">
                Keep the main user experience focused on parking workflows. Service health and diagnostics now live behind the
                settings entry point so the app has one clear primary home page.
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
        <p>&copy; 2026 LAS Parking Operations Dashboard.</p>
      </footer>
    </div>
  );
}

export default Home;
