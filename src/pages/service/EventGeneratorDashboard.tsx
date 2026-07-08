import React, {JSX} from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ServicePageStyles.css';
import {EVENT_GENERATOR_GITHUB} from "../../types/constants";

function EventGenerator(): JSX.Element {
  return (
    <>
      <header className="service-header">
        <div className="service-header-nav">
          <Link to="/parking" className="back-link">← Parking Home</Link>
          <a
                href={EVENT_GENERATOR_GITHUB}
              className="header-action-link"
              target="_blank"
              rel="noreferrer"
          >
            Clone and Run ↗
          </a>
        </div>
        <p className="service-eyebrow">Settings & diagnostics</p>
        <h1>Event Generator Dashboard</h1>
        <p className="service-subtitle">
          No diagnostics for the Event Generator service. Visit GitHub to clone and run the event generator.
        </p>
      </header>
      <main className="service-container">
        <div className="service-details">
          <h3>Overview</h3>
          <p>
            This service isn't hosted, there are no diagnostics. It is intended to be cloned and run locally.
            Visit GitHub to clone and run the event generator.
          </p>
        </div>
      </main>
      <footer>
        <p>&copy; 2026 LAS Parking Operations Dashboard.</p>
      </footer>
    </>
  );
}

export default EventGenerator;
