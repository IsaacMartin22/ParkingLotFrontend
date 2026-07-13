import React, {JSX} from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ServicePageStyles.css';
import { SDK_GITHUB } from "../../types/constants";

function SDK(): JSX.Element {
  return (
    <>
      <header className="service-header">
        <div className="service-header-nav">
          <Link to="/parking" className="back-link">← Parking Home</Link>
          <a
                href={SDK_GITHUB}
              className="header-action-link"
              target="_blank"
              rel="noreferrer"
          >
            Clone the SDK ↗
          </a>
        </div>
        <p className="service-eyebrow">Settings & diagnostics</p>
        <h1>SDK Dashboard</h1>
        <p className="service-subtitle">
          No diagnostics for SDK. Visit GitHub to clone and use the published SDK for the API.
        </p>
      </header>
      <main className="service-container">
        <div className="service-details">
          <h3>Overview</h3>
          <p>
            SDKs are not hosted, there are no diagnostics. It is intended to be cloned and run locally.
            Visit GitHub to clone and use the SDK.
          </p>
        </div>
      </main>
      <footer>
          <p>&copy; 2026 Isaac - Parking App Demo.</p>
      </footer>
    </>
  );
}

export default SDK;
