import React, {JSX} from 'react';
import { Link } from 'react-router-dom';
import ServiceDiagnostics from '../components/ServiceDiagnostics';
import '../styles/ServicePageStyles.css';

function ServiceDatabase(): JSX.Element {
  const metrics = [
    { label: 'Uptime', value: '99.95%' },
    { label: 'Query Time', value: '12ms' },
    { label: 'Connections', value: '248/500' },
    { label: 'Storage Used', value: '45.2 GB' },
  ];

  const logs = [
    { timestamp: '14:35:30', message: 'Query executed: SELECT * FROM users', type: 'success' },
    { timestamp: '14:35:20', message: 'Database backup completed', type: 'success' },
    { timestamp: '14:35:10', message: 'Connection pool at 49% capacity', type: 'info' },
    { timestamp: '14:34:50', message: 'Slow query detected: 245ms', type: 'warning' },
    { timestamp: '14:34:35', message: 'Index rebuild completed successfully', type: 'success' },
  ] as const;

  return (
    <>
      <header className="service-header">
        <div className="service-header-nav">
          <Link to="/services" className="back-link">← Services Dashboard</Link>
          <Link to="/parking" className="header-action-link">Parking Home</Link>
        </div>
        <p className="service-eyebrow">Settings & diagnostics</p>
        <h1>Database Service Dashboard</h1>
        <p className="service-subtitle">
          Review persistence health, storage behavior, and database capacity behind the parking lot app.
        </p>
      </header>
      <main className="service-container">
        <ServiceDiagnostics
          serviceName="PostgreSQL Database"
          status="Healthy"
          statusColor="healthy"
          metrics={metrics}
          logs={logs}
        />
        <div className="service-details">
          <h3>Service Overview</h3>
          <p>The database service stores parking lot, floor, section, and occupancy data so the frontend can render live availability with dependable historical and transactional consistency.</p>
        </div>
      </main>
      <footer>
        <p>&copy; 2026 LAS Parking Operations Dashboard.</p>
      </footer>
    </>
  );
}

export default ServiceDatabase;
