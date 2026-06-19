import React, {JSX} from 'react';
import { Link } from 'react-router-dom';
import ServiceDiagnostics from '../components/ServiceDiagnostics';
import useAPIDiagnostics from '../hooks/useAPIDiagnostics';
import '../styles/ServicePage.css';
import {formatTimestamp, formatDuration} from "../formattingUtils";

function ServiceAPIDashboard(): JSX.Element {
  const { data: diagnostics, isLoading, isError, error } = useAPIDiagnostics();

  const failedRequests = diagnostics?.failedRequests ?? 0;
  const totalRequests = diagnostics?.totalRequests ?? 0;
  const successfulRequests = diagnostics?.successfulRequests ?? 0;
  const errorRate = totalRequests > 0 ? (failedRequests / totalRequests) * 100 : 0;
  const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100;

  const metrics = diagnostics
      ? [
        { label: 'Uptime', value: formatDuration(diagnostics.uptimeMillis) },
        { label: 'Total Requests', value: diagnostics.totalRequests.toLocaleString() },
        { label: 'Success Rate', value: `${successRate.toFixed(2)}%` },
        { label: 'Error Rate', value: `${errorRate.toFixed(2)}%` },
      ]
      : [
        { label: 'Uptime', value: isLoading ? 'Loading...' : 'Unavailable' },
        { label: 'Total Requests', value: isLoading ? 'Loading...' : 'Unavailable' },
        { label: 'Success Rate', value: isLoading ? 'Loading...' : 'Unavailable' },
        { label: 'Error Rate', value: isLoading ? 'Loading...' : 'Unavailable' },
      ];

  const endpointLogs = diagnostics
      ? Object.entries(diagnostics.endpoints).map(([endpoint, endpointDiagnostics]) => {
        const endpointFailedRequests =
            typeof endpointDiagnostics.failedRequests === 'number'
                ? endpointDiagnostics.failedRequests
                : 0;

        return {
          timestamp:
              typeof endpointDiagnostics.lastRequestAt === 'string'
                  ? formatTimestamp(endpointDiagnostics.lastRequestAt)
                  : formatTimestamp(diagnostics.startedAt),
          message: `${endpoint}: ${endpointDiagnostics.totalRequests ?? 0} requests, ${endpointFailedRequests} failures`,
          type: endpointFailedRequests > 0 ? 'warning' : 'success',
        } as const;
      })
      : [];

  const logs = isError
      ? [
        {
          timestamp: new Date().toLocaleTimeString(),
          message: error instanceof Error ? error.message : 'Failed to load API diagnostics',
          type: 'error',
        },
      ] as const
      : endpointLogs.length > 0
          ? endpointLogs
          : [
            {
              timestamp: new Date().toLocaleTimeString(),
              message: isLoading ? 'Loading API diagnostics...' : 'No endpoint diagnostics available',
              type: isLoading ? 'info' : 'warning',
            },
          ] as const;

  const status = isError ? 'Unavailable' : failedRequests > 0 ? 'Warning' : 'Healthy';
  const statusColor = isError ? 'critical' : failedRequests > 0 ? 'warning' : 'healthy';

  return (
      <>
        <header className="service-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>API Service Dashboard</h1>
        </header>
        <main className="service-container">
          <ServiceDiagnostics
              serviceName="REST API Service"
              status={status}
              statusColor={statusColor}
              metrics={metrics}
              logs={logs}
          />
          <div className="service-details">
            <h3>Service Overview</h3>
            <p>The REST API Service handles all incoming API requests and provides data endpoints for the frontend application. It processes requests, manages authentication, and communicates with the database.</p>
            {diagnostics && (
                <p>
                  Service started at {new Date(diagnostics.startedAt).toLocaleString()} and is currently tracking{' '}
                  {Object.keys(diagnostics.endpoints).length} endpoint
                  {Object.keys(diagnostics.endpoints).length === 1 ? '' : 's'}.
                </p>
            )}
          </div>
        </main>
        <footer>
          <p>&copy; 2025 React Application. All rights reserved.</p>
        </footer>
      </>
  );
}

export default ServiceAPIDashboard;