import React, {JSX} from 'react';
import { Link } from 'react-router-dom';
import ServiceDiagnostics from '../components/ServiceDiagnostics';
import '../styles/ServicePageStyles.css';

function ServiceCache(): JSX.Element {
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
          <Link to="/services" className="back-link">← Services Dashboard</Link>
          <Link to="/parking" className="header-action-link">Parking Home</Link>
        </div>
        <p className="service-eyebrow">Settings & diagnostics</p>
        <h1>Cache Service Dashboard</h1>
        <p className="service-subtitle">
          Monitor cached parking availability data and the in-memory service performance that supports fast reads.
        </p>
      </header>
      <main className="service-container">
        <ServiceDiagnostics
          serviceName="Redis Cache Service"
          status="Healthy"
          statusColor="healthy"
          metrics={metrics}
          logs={logs}
        />
        <div className="service-details">
          <h3>Service Overview</h3>
          <p>The cache service keeps frequently requested parking availability data close to the frontend experience so lot and floor views load quickly while reducing pressure on the database.</p>
        </div>
      </main>
      <footer>
        <p>&copy; 2026 LAS Parking Operations Dashboard.</p>
      </footer>
    </>
  );
}

export default ServiceCache;
