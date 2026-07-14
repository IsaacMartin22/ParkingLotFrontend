import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomeHeroStyles.css';
import '../styles/ServicePageStyles.css';

function ParkingHome(): JSX.Element {
  return (
    <div className="settings-dashboard">
      <header className="service-header">
        <div className="service-header-nav">
          <Link to="/" className="back-link" data-analytics-id={"back-to-portfolio-from-parking"}>← Home</Link>
        </div>
        <p className="service-eyebrow">Project demo · parking experience</p>
        <h1>Parking App Home</h1>
        <p className="service-subtitle">
          Explore the main user-facing application with live parking lot information or view
          service dashboards for infrastructure diagnostics.
        </p>
      </header>

      <main className="service-container">
        <section className="service-details service-dashboard-panel">
          <div className="section-heading service-dashboard-heading">
            <div>
              <h2>Parking Application</h2>
              <p className="section-copy">
                The Parking Explorer is the end user experience. Service dashboards display diagnostic metrics.
                The non-database dashboards contain external URLs for comprehensive information.
              </p>
            </div>
          </div>

          <div className="services-grid service-dashboard-grid">
            <Link to="/parking-lots" className="service-card primary-service-card" data-analytics-id={"parking-explorer-link"}>
              <div className="service-card-icon">🅿️</div>
              <span className="service-card-kicker">Primary experience</span>
              <h3>Parking Explorer</h3>
              <p>View real-time section and space availability for lots and floors.</p>
            </Link>

            <Link to="/api" className="service-card" data-analytics-id={"api-link"}>
              <div className="service-card-icon">🛫</div>
              <span className="service-card-kicker">Traffic</span>
              <h3>API Service</h3>
              <p>Check endpoint activity, uptime, and performance for the parking API.</p>
            </Link>

            <Link to="/database" className="service-card" data-analytics-id={"database-link"}>
              <div className="service-card-icon">🗄️</div>
              <span className="service-card-kicker">Persistence</span>
              <h3>Database</h3>
              <p>Review latency, retrieval metrics, connection info, and storage health.</p>
            </Link>

            <Link to="/analytics" className="service-card" data-analytics-id="analytics-link">
              <div className="service-card-icon">📊</div>
              <span className="service-card-kicker">Insights</span>
              <h3>Analytics</h3>
              <p>View an anonymized history of user interaction with this site.</p>
            </Link>

            <Link to="/sdk" className="service-card" data-analytics-id={"sdk-link"}>
              <div className="service-card-icon">🧩</div>
              <span className="service-card-kicker">Automate</span>
              <h3>SDK</h3>
              <p>Use a Maven published SDK to programatically interact with the API.</p>
            </Link>

            <Link to="/deployments" className="service-card" data-analytics-id="deployments-link">
              <div className="service-card-icon">🚀</div>
              <span className="service-card-kicker">Release</span>
              <h3>Deployments</h3>
              <p>Track recent build and deployment status and activity.</p>
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
