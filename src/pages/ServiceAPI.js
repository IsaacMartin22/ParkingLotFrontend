import React from 'react';
import { Link } from 'react-router-dom';
import ServiceDiagnostics from '../components/ServiceDiagnostics';
import '../styles/ServicePage.css';

function ServiceAPI() {
  const metrics = [
    { label: 'Uptime', value: '99.98%' },
    { label: 'Response Time', value: '45ms' },
    { label: 'Requests/sec', value: '1,250' },
    { label: 'Error Rate', value: '0.02%' },
  ];

  const logs = [
    { timestamp: '14:35:22', message: 'Request processed successfully', type: 'success' },
    { timestamp: '14:35:15', message: 'API endpoint /v1/users called', type: 'info' },
    { timestamp: '14:35:08', message: 'Database connection established', type: 'success' },
    { timestamp: '14:34:55', message: 'Cache hit ratio: 92%', type: 'info' },
    { timestamp: '14:34:42', message: 'All health checks passed', type: 'success' },
  ];

  return (
    <>
      <header className="service-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>API Service Dashboard</h1>
      </header>
      <main className="service-container">
        <ServiceDiagnostics
          serviceName="REST API Service"
          status="Healthy"
          statusColor="healthy"
          metrics={metrics}
          logs={logs}
        />
        <div className="service-details">
          <h3>Service Overview</h3>
          <p>The REST API Service handles all incoming API requests and provides data endpoints for the frontend application. It processes requests, manages authentication, and communicates with the database.</p>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 React Application. All rights reserved.</p>
      </footer>
    </>
  );
}

export default ServiceAPI;

