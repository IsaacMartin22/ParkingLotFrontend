import React, {JSX} from 'react';
import { Link } from 'react-router-dom';
import ServiceDiagnostics from '../components/ServiceDiagnostics';
import '../styles/ServicePageStyles.css';
import {API_WEBPAGE, EVENT_GENERATOR_WEBPAGE} from "../types/constants";

function EventGenerator(): JSX.Element {
  const metrics = [
    { label: 'Uptime', value: '99.99%' },
    { label: 'Hit Rate', value: '94.2%' },
    { label: 'Memory Used', value: '8.7 GB' },
    { label: 'Operations/sec', value: '15,890' },
  ];

  const logs = [
    { timestamp: '14:35:40', message: 'Cache hit for key: user:1024', type: 'success' },
    { timestamp: '14:35:35', message: 'Memory optimization completed', type: 'info' },
    { timestamp: '14:35:25', message: 'Stale entries evicted: 523', type: 'success' },
    { timestamp: '14:35:15', message: 'Cache performance optimal', type: 'success' },
    { timestamp: '14:35:00', message: 'TTL refresh executed for 1,240 keys', type: 'info' },
  ] as const;

  return (
    <>
      <header className="service-header">
        <div className="service-header-nav">
          <Link to="/parking" className="back-link">← Parking Home</Link>
          <a
              href={EVENT_GENERATOR_WEBPAGE}
              className="header-action-link"
              target="_blank"
              rel="noreferrer"
          >
            Configure Generator ↗
          </a>
        </div>
        <p className="service-eyebrow">Settings & diagnostics</p>
        <h1>Event Generator Dashboard</h1>
        <p className="service-subtitle">
          Diagnostics page for the Event Generator service. Visit the service page to configure and run events.
        </p>
      </header>
      <main className="service-container">
        <ServiceDiagnostics
          serviceName="Event Generator Service"
          status="Healthy"
          statusColor="healthy"
          metrics={metrics}
          logs={logs}
        />
        <div className="service-details">
          <h3>Service Overview</h3>
          <p>The event generator service simulates parking events to test the system's response and performance under various conditions.</p>
        </div>
      </main>
      <footer>
        <p>&copy; 2026 LAS Parking Operations Dashboard.</p>
      </footer>
    </>
  );
}

export default EventGenerator;
