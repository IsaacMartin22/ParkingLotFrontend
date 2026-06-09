import React from 'react';
import { Link } from 'react-router-dom';
import ServiceDiagnostics from '../components/ServiceDiagnostics';
import '../styles/ServicePage.css';

function ServiceDatabase() {
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
  ];

  return (
    <>
      <header className="service-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Database Service Dashboard</h1>
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
          <p>The Database Service manages all persistent data storage and retrieval operations. It handles user data, application state, and provides ACID compliance for critical transactions.</p>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 React Application. All rights reserved.</p>
      </footer>
    </>
  );
}

export default ServiceDatabase;

