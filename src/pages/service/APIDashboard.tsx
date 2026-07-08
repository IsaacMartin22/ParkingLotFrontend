import React, {JSX} from 'react';
import { Link } from 'react-router-dom';
import ServiceDiagnostics from '../../components/ServiceDiagnostics';
import ServiceLogViewer from '../../components/ServiceLogViewer';
import useAPIDiagnostics from '../../network/useAPIDiagnostics';
import '../../styles/ServicePageStyles.css';
import {formatTimestamp, formatDuration} from "../../formattingUtils";
import { API_WEBPAGE } from '../../types/constants';

function APIDashboard(): JSX.Element {
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
          <div className="service-header-nav">
            <Link to="/parking" className="back-link">← Parking Home</Link>
            <a
                href={API_WEBPAGE}
                className="header-action-link"
                target="_blank"
                rel="noreferrer"
            >
              API Documentation ↗
            </a>
          </div>
          <p className="service-eyebrow">Settings & diagnostics</p>
          <h1>API Service Dashboard</h1>
          <p className="service-subtitle">
            Inspect API uptime, request volume, error rate, and endpoint activity for the parking lot application.
          </p>
        </header>
        <main className="service-container">
          <ServiceDiagnostics
              serviceName="REST API Service"
              status={status}
              statusColor={statusColor}
              metrics={metrics}
              logs={logs}
          />
          {diagnostics && <ServiceLogViewer logs={diagnostics.recentLogs} />}
          <div className="service-details">
            <h3>Service Overview</h3>
            <p>The REST API service handles parking application requests, serves lot and floor data to the frontend, and coordinates with downstream services to keep occupancy views current.</p>
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
          <p>&copy; 2026 LAS Parking Operations Dashboard.</p>
        </footer>
      </>
  );
}

export default APIDashboard;