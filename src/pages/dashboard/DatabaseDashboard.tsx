import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import ServiceDiagnostics from '../../components/ServiceDiagnostics';
import useDatabaseDiagnostics from '../../network/useDatabaseDiagnostics';
import useAnalyticsErrorReporter from '../../network/useAnalyticsErrorReporter';
import { formatDuration } from '../../formattingUtils';
import '../../styles/ServicePageStyles.css';

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;

  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function DatabaseDashboard(): JSX.Element {
  const { data: diagnostics, isLoading, isError, error } = useDatabaseDiagnostics();
  useAnalyticsErrorReporter(error, 'Failed to load database diagnostics');
  const longRunningQueries = diagnostics?.longRunningQueries ?? [];
  const queryCount = longRunningQueries.length;

  const metrics = diagnostics
    ? [
        { label: 'Connectivity', value: diagnostics.connectivity ? 'Connected' : 'Disconnected' },
        { label: 'Latency', value: `${diagnostics.latency.toLocaleString()} ms` },
        { label: 'Uptime', value: formatDuration(diagnostics.uptimeMillis) },
        {
          label: 'Connections',
          value: `${diagnostics.activeConnections.toLocaleString()}/${diagnostics.maxConnections.toLocaleString()}`,
        },
        { label: 'Storage Used', value: formatBytes(diagnostics.databaseSize) },
        { label: 'Long-running Queries', value: queryCount.toLocaleString() },
      ]
    : [
        { label: 'Connectivity', value: isLoading ? 'Loading...' : 'Unavailable' },
        { label: 'Latency', value: isLoading ? 'Loading...' : 'Unavailable' },
        { label: 'Uptime', value: isLoading ? 'Loading...' : 'Unavailable' },
        { label: 'Connections', value: isLoading ? 'Loading...' : 'Unavailable' },
        { label: 'Storage Used', value: isLoading ? 'Loading...' : 'Unavailable' },
        { label: 'Long-running Queries', value: isLoading ? 'Loading...' : 'Unavailable' },
      ];

  const longRunningQueryLogs = diagnostics
    ? diagnostics.longRunningQueries.map((query) => ({
        timestamp: `${formatDuration(query.timeRunningMillis)} ago`,
        message: query.queryText,
        type: query.timeRunningMillis >= 30_000 ? 'warning' : 'info',
      } as const))
    : [];

  const logs = isError
    ? [
        {
          timestamp: new Date().toLocaleTimeString(),
          message: error instanceof Error ? error.message : 'Failed to load database diagnostics',
          type: 'error',
        },
      ] as const
    : longRunningQueryLogs.length > 0
      ? longRunningQueryLogs
      : [
          {
            timestamp: new Date().toLocaleTimeString(),
              message: isLoading
                  ? 'Loading database diagnostics...'
                  : 'No long-running queries reported by the database service.',
            type: isLoading ? 'info' : 'success',
          },
        ] as const;

  const status = isError
    ? 'Unavailable'
    : !diagnostics
      ? 'Loading'
      : !diagnostics.connectivity
        ? 'Disconnected'
        : diagnostics.longRunningQueries.length > 0
          ? 'Warning'
          : 'Healthy';

  const statusColor: 'healthy' | 'warning' | 'critical' = isError
    ? 'critical'
    : !diagnostics
      ? 'warning'
      : !diagnostics.connectivity
        ? 'critical'
        : diagnostics.longRunningQueries.length > 0
          ? 'warning'
          : 'healthy';

  return (
    <>
      <header className="service-header">
        <div className="service-header-nav">
            <Link to="/parking" className="back-link" data-analytics-id="back-to-parking-home-database">← Parking Home</Link>
        </div>
        <p className="service-eyebrow">Settings & diagnostics</p>
        <h1>Database Dashboard</h1>
        <p className="service-subtitle">
          Review persistence health, storage behavior, and database capacity behind the parking lot app.
        </p>
      </header>
      <main className="service-container">
        <ServiceDiagnostics
          serviceName="PostgreSQL Database"
          status={status}
          statusColor={statusColor}
          metrics={metrics}
          logs={logs}
        />

        <section className="service-details">
          <h3>Long Running Queries</h3>
          {longRunningQueries.length > 0 ? (
            <div className="database-query-list">
              {longRunningQueries.map((query, index) => (
                <article key={`${query.timeRunningMillis}-${index}`} className="database-query-card">
                  <p className="database-query-time">{formatDuration(query.timeRunningMillis)} running</p>
                  <pre>{query.queryText}</pre>
                </article>
              ))}
            </div>
          ) : (
            <p>
              {isLoading
                ? 'Loading long-running query data...'
                : 'No long-running queries were reported by the database.'}
            </p>
          )}
        </section>

        <section className="service-details">
          <h3>Database Overview</h3>
          <p>
            The database stores parking lot, floor, section, and occupancy data so the frontend can
            render live availability with dependable historical and transactional consistency.
          </p>
          {diagnostics && (
            <p>
              Current latency is {diagnostics.latency.toLocaleString()} ms with{' '}
              {diagnostics.activeConnections.toLocaleString()} active connection
              {diagnostics.activeConnections === 1 ? '' : 's'} and {queryCount.toLocaleString()} long-running{' '}
              {queryCount === 1 ? 'query' : 'queries'} observed.
            </p>
          )}
          {isError && (
            <p className="error">
              {error instanceof Error ? error.message : 'Failed to load database diagnostics'}
            </p>
          )}
        </section>
      </main>
      <footer>
          <p>&copy; 2026 Isaac - Parking App Demo.</p>
      </footer>
    </>
  );
}

export default DatabaseDashboard;
