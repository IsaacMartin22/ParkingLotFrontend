import React from 'react';
import { Link } from 'react-router-dom';
import ServiceDiagnostics from '../components/ServiceDiagnostics';
import '../styles/ServicePage.css';

function ServiceCache() {
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
  ];

  return (
    <>
      <header className="service-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Cache Service Dashboard</h1>
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
          <p>The Cache Service provides in-memory data caching to improve application performance and reduce database load. It stores frequently accessed data and session information for fast retrieval.</p>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 React Application. All rights reserved.</p>
      </footer>
    </>
  );
}

export default ServiceCache;

