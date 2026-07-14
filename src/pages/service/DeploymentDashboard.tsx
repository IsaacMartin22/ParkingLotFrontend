import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import ServiceDiagnostics from '../../components/ServiceDiagnostics';
import useBuildkiteInfo from '../../network/useBuildkiteInfo';
import { formatDuration, formatTimestamp } from '../../formattingUtils';
import '../../styles/ServicePageStyles.css';

type ServiceLog = {
  timestamp: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
};

function getCommitPreview(commit: string): string {
  if (!commit.trim()) {
    return 'N/A';
  }

  return commit.slice(0, 7);
}

function getBuildStatus(state: string, blocked: boolean): {
  label: string;
  color: 'healthy' | 'warning' | 'critical';
} {
  if (blocked) {
    return {
      label: 'Blocked',
      color: 'warning',
    };
  }

  const normalizedState = state.toLowerCase();

  if (normalizedState === 'passed' || normalizedState === 'finished' || normalizedState === 'success') {
    return {
      label: 'Healthy',
      color: 'healthy',
    };
  }

  if (normalizedState === 'running' || normalizedState === 'scheduled' || normalizedState === 'creating') {
    return {
      label: 'In Progress',
      color: 'warning',
    };
  }

  if (normalizedState === 'failed' || normalizedState === 'canceled' || normalizedState === 'canceling') {
    return {
      label: 'Failed',
      color: 'critical',
    };
  }

  return {
    label: state || 'Unknown',
    color: 'warning',
  };
}

function getBuildDuration(startedAt: string | null, finishedAt: string | null): string {
  if (!startedAt) {
    return 'N/A';
  }

  const startedDate = new Date(startedAt);
  if (Number.isNaN(startedDate.getTime())) {
    return 'N/A';
  }

  const finishedDate = finishedAt ? new Date(finishedAt) : new Date();
  if (Number.isNaN(finishedDate.getTime())) {
    return 'N/A';
  }

  return formatDuration(Math.max(0, finishedDate.getTime() - startedDate.getTime()));
}

function DeploymentDashboard(): JSX.Element {
  const { data: buildInfo, isLoading, isError, error } = useBuildkiteInfo();

  const buildStatus = buildInfo ? getBuildStatus(buildInfo.state, buildInfo.blocked) : null;
  const status = isError ? 'Unavailable' : buildStatus?.label ?? (isLoading ? 'Loading' : 'Unknown');
  const statusColor: 'healthy' | 'warning' | 'critical' = isError ? 'critical' : buildStatus?.color ?? 'warning';

  const metrics = buildInfo
    ? [
        { label: 'Pipeline', value: buildInfo.pipeline?.name ?? 'Unavailable' },
        { label: 'Build #', value: buildInfo.number !== null ? buildInfo.number.toString() : 'N/A' },
        { label: 'Branch', value: buildInfo.branch || 'N/A' },
        { label: 'Commit', value: getCommitPreview(buildInfo.commit) },
        { label: 'State', value: buildInfo.state || 'Unknown' },
        { label: 'Duration', value: getBuildDuration(buildInfo.startedAt, buildInfo.finishedAt) },
      ]
    : [
        { label: 'Pipeline', value: isLoading ? 'Loading...' : 'Unavailable' },
        { label: 'Build #', value: isLoading ? 'Loading...' : 'Unavailable' },
        { label: 'Branch', value: isLoading ? 'Loading...' : 'Unavailable' },
        { label: 'Commit', value: isLoading ? 'Loading...' : 'Unavailable' },
        { label: 'State', value: isLoading ? 'Loading...' : 'Unavailable' },
        { label: 'Duration', value: isLoading ? 'Loading...' : 'Unavailable' },
      ];

  const logs: ServiceLog[] = isError
    ? [
        {
          timestamp: new Date().toLocaleTimeString(),
          message: error instanceof Error ? error.message : 'Failed to load build information',
          type: 'error',
        },
      ]
    : buildInfo
      ? [
          {
            timestamp: buildInfo.createdAt ? formatTimestamp(buildInfo.createdAt) : 'N/A',
            message: `Build created${buildInfo.source ? ` via ${buildInfo.source}` : ''}.`,
            type: 'info',
          },
          {
            timestamp: buildInfo.startedAt ? formatTimestamp(buildInfo.startedAt) : 'N/A',
            message: buildInfo.startedAt ? 'Build started.' : 'Build has not started yet.',
            type: buildInfo.startedAt ? 'info' : 'warning',
          },
          {
            timestamp: buildInfo.finishedAt ? formatTimestamp(buildInfo.finishedAt) : 'N/A',
            message: buildInfo.finishedAt
              ? `Build finished with state "${buildInfo.state}".`
              : 'Build is still in progress.',
            type: buildInfo.finishedAt ? 'success' : 'info',
          },
          ...(buildInfo.message.trim()
            ? [
                {
                  timestamp: new Date().toLocaleTimeString(),
                  message: buildInfo.message,
                  type: 'info' as const,
                },
              ]
            : []),
        ]
      : [
          {
            timestamp: new Date().toLocaleTimeString(),
            message: isLoading ? 'Loading build information...' : 'No build information available.',
            type: isLoading ? 'info' : 'warning',
          },
        ];

  return (
    <>
      <header className="service-header">
        <div className="service-header-nav">
          <Link to="/parking" className="back-link" data-analytics-id="back-to-parking-home-deployment">
            ← Parking Home
          </Link>
        </div>
        <p className="service-eyebrow">Settings & diagnostics</p>
        <h1>Deployment Dashboard</h1>
        <p className="service-subtitle">
          Build status is live from Buildkite. Deployment details are scaffolded below for your upcoming deployment
          diagnostics hook.
        </p>
      </header>

      <main className="service-container">
        <ServiceDiagnostics
          serviceName="Build Information"
          status={status}
          statusColor={statusColor}
          metrics={metrics}
          logs={logs}
        />

        <section className="service-details">
          <h3>Build Details</h3>
          <p>
            Pipeline: {buildInfo?.pipeline?.name ?? 'Unavailable'} ({buildInfo?.pipeline?.slug ?? 'N/A'})
          </p>
          <p>
            Build ID: {buildInfo?.id ?? 'N/A'} · Cancel reason: {buildInfo?.cancelReason ?? 'None'}
          </p>
          <p>
            Scheduled at: {buildInfo?.scheduledAt ? formatTimestamp(buildInfo.scheduledAt) : 'N/A'} · Started at:{' '}
            {buildInfo?.startedAt ? formatTimestamp(buildInfo.startedAt) : 'N/A'} · Finished at:{' '}
            {buildInfo?.finishedAt ? formatTimestamp(buildInfo.finishedAt) : 'N/A'}
          </p>
        </section>

        <section className="service-details">
          <h3>Deployment Information (Coming Soon)</h3>
          <p>
            This section is intentionally scaffolded so you can plug in deployment diagnostics once your deployment hook
            is ready.
          </p>
          <div className="database-snapshot-grid">
            <div>
              <span className="service-card-kicker">Environment</span>
              <p>Not connected yet</p>
            </div>
            <div>
              <span className="service-card-kicker">Latest Deploy</span>
              <p>Not connected yet</p>
            </div>
            <div>
              <span className="service-card-kicker">Release Version</span>
              <p>Not connected yet</p>
            </div>
            <div>
              <span className="service-card-kicker">Deploy Duration</span>
              <p>Not connected yet</p>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2026 Isaac - Parking App Demo.</p>
      </footer>
    </>
  );
}

export default DeploymentDashboard;
