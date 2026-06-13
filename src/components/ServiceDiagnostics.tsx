import React from 'react';
import '../styles/ServiceDiagnostics.css';

interface Metric {
  label: string;
  value: string;
}

interface Log {
  timestamp: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

interface ServiceDiagnosticsProps {
  serviceName: string;
  status: string;
  statusColor: 'healthy' | 'warning' | 'critical';
  metrics: Metric[];
  logs: readonly Log[];
}

function ServiceDiagnostics({
  serviceName,
  status,
  statusColor,
  metrics,
  logs,
}: ServiceDiagnosticsProps) {
  return (
    <div className="service-diagnostics">
      <div className="diagnostics-header">
        <h2>{serviceName}</h2>
        <div className={`status-badge ${statusColor}`}>
          <span className="status-dot"></span>
          {status}
        </div>
      </div>

      <div className="diagnostics-grid">
        <div className="metrics-section">
          <h3>Health Metrics</h3>
          <div className="metrics-container">
            {metrics.map((metric, index) => (
              <div key={index} className="metric">
                <span className="metric-label">{metric.label}</span>
                <span className="metric-value">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="logs-section">
          <h3>Recent Activity</h3>
          <div className="logs-container">
            {logs.map((log, index) => (
              <div key={index} className={`log-entry log-${log.type}`}>
                <span className="log-time">{log.timestamp}</span>
                <span className="log-message">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDiagnostics;

