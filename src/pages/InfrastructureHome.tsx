import React, { JSX, useMemo } from 'react';
import PortfolioFooter from '../components/PortfolioFooter';
import TopNav from '../components/TopNav';
import useAPIDiagnostics from '../network/useAPIDiagnostics';
import useAnalyticsEvents from '../network/useAnalyticsEvents';
import useBuildkiteInfo from '../network/useBuildkiteInfo';
import useDatabaseDiagnostics from '../network/useDatabaseDiagnostics';
import useDeploymentInfo from '../network/useDeploymentInfo';
import useAnalyticsErrorReporter from '../network/useAnalyticsErrorReporter';
import useMongoDBDiagnostics from '../network/useMongoDBDiagnostics';
import { formatDuration } from '../formattingUtils';
import '../styles/ServicePageStyles.css';

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;

  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function getBuildStatusLabel(state: string | null, blocked: boolean): string {
  if (blocked) return 'Blocked';

  const normalizedState = (state ?? '').toLowerCase();
  if (['passed', 'finished', 'success'].includes(normalizedState)) return 'Passed';
  if (['running', 'scheduled', 'creating'].includes(normalizedState)) return 'In progress';
  if (['failed', 'canceled', 'canceling'].includes(normalizedState)) return 'Failed';
  return state ?? 'Unknown';
}

function formatCompactDateTime(value: string | null | undefined): string {
  if (!value) {
    return 'N/A';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  const diffMs = Math.max(0, Date.now() - date.getTime());
  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  let elapsedLabel = 'just now';
  if (days > 0) {
    elapsedLabel = `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (hours > 0) {
    elapsedLabel = `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (minutes > 0) {
    elapsedLabel = `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }

  return `${date.toLocaleString(undefined, {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })} (${elapsedLabel})`;
}

function getStatusTone(value: string): 'success' | 'warning' | 'danger' {
  const normalized = value.toLowerCase();

  if (['healthy', 'live', 'passed', 'success', 'ok', 'get'].includes(normalized)) {
    return 'success';
  }

  if (['warning', 'blocked', 'in progress', 'queued', 'post'].includes(normalized)) {
    return 'warning';
  }

  return 'danger';
}

function StatusBadge({ label, tone }: { label: string; tone: 'success' | 'warning' | 'danger' | 'orange' }): JSX.Element {
  return <span className={`infrastructure-status-badge status-${tone}`}>{label}</span>;
}

function getLatencyTone(latencyMs: number | null | undefined): 'success' | 'warning' | 'danger' {
  if (latencyMs == null || Number.isNaN(latencyMs)) {
    return 'warning';
  }

  if (latencyMs < 100) {
    return 'success';
  }

  if (latencyMs <= 500) {
    return 'warning';
  }

  return 'danger';
}

function getStorageTone(bytes: number | null | undefined): 'success' | 'warning' | 'danger' {
  if (bytes == null || Number.isNaN(bytes)) {
    return 'warning';
  }

  const megabytes = bytes / (1024 * 1024);

  if (megabytes < 500) {
    return 'success';
  }

  if (megabytes <= 800) {
    return 'warning';
  }

  return 'danger';
}

function getConnectionTone(activeConnections: number | null | undefined, maxConnections: number | null | undefined): 'success' | 'warning' | 'danger' {
  if (activeConnections == null || maxConnections == null || maxConnections <= 0 || Number.isNaN(activeConnections) || Number.isNaN(maxConnections)) {
    return 'warning';
  }

  const utilization = (activeConnections / maxConnections) * 100;

  if (utilization < 50) {
    return 'success';
  }

  if (utilization < 80) {
    return 'warning';
  }

  return 'danger';
}

function getUptimeTone(uptimeMillis: number | null | undefined): 'success' | 'warning' | 'danger' {
  if (uptimeMillis == null || Number.isNaN(uptimeMillis)) {
    return 'warning';
  }

  if (uptimeMillis >= 24 * 60 * 60 * 1000) {
    return 'success';
  }

  if (uptimeMillis >= 60 * 60 * 1000) {
    return 'warning';
  }

  return 'danger';
}

function getMethodToneFromEndpoint(endpoint: string): 'success' | 'warning' | 'orange' | 'danger' {
  const normalized = endpoint.trim().toUpperCase();

  if (normalized.includes('DELETE')) {
    return 'danger';
  }

  if (normalized.includes('POST') || normalized.includes('PUT')) {
    return normalized.includes('PUT') ? 'orange' : 'warning';
  }

  return 'success';
}

function getFailureTone(failureCount: number | null | undefined): 'success' | 'warning' | 'danger' {
  if (failureCount == null || Number.isNaN(failureCount)) {
    return 'warning';
  }

  if (failureCount === 0) {
    return 'success';
  }

  if (failureCount < 10) {
    return 'warning';
  }

  return 'danger';
}

function getRecencyTone(dateValue: string | null | undefined): 'success' | 'warning' | 'danger' {
  if (!dateValue) {
    return 'warning';
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return 'warning';
  }

  const diffMs = Date.now() - date.getTime();
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;

  if (diffMs > oneDay) {
    return 'success';
  }

  if (diffMs >= oneHour) {
    return 'warning';
  }

  return 'danger';
}

function getRequestLabel(endpoint: string): string {
  const normalized = endpoint.trim().toUpperCase();

  if (normalized.includes('DELETE')) {
    return 'DELETE';
  }

  if (normalized.includes('PUT')) {
    return 'PUT';
  }

  if (normalized.includes('POST')) {
    return 'POST';
  }

  return 'GET';
}

function getLastUrlPathSegment(url: string | null | undefined): string {
  if (!url) {
    return 'No URL';
  }

  try {
    const parsedUrl = new URL(url);
    const segments = parsedUrl.pathname.split('/').filter(Boolean);
    return segments[segments.length - 1] ?? '/';
  } catch {
    const segments = url.split('/').filter(Boolean);
    return segments[segments.length - 1] ?? url;
  }
}

function InfrastructureHome(): JSX.Element {
  const { data: apiDiagnostics, isLoading: apiLoading, isError: apiError, error: apiErrorObject } = useAPIDiagnostics();
  const { data: databaseDiagnostics, isLoading: databaseLoading, isError: databaseError, error: databaseErrorObject } = useDatabaseDiagnostics();
  const { data: mongoDBDiagnostics, isLoading: mongoDBLoading, isError: mongoDBError, error: mongoDBErrorObject } = useMongoDBDiagnostics();
  const { data: buildInfo = [], error: buildsErrorObject } = useBuildkiteInfo();
  const { data: deploymentInfo = [], error: deploymentsErrorObject } = useDeploymentInfo();
  const analyticsQuery = useMemo(
    () => ({
      filters: [],
      sortField: 'timestamp',
      sortDirection: 'desc' as const,
      page: 1,
    }),
    []
  );
  const {
    data: analyticsResponse,
    error: analyticsErrorObject,
  } = useAnalyticsEvents({ query: analyticsQuery });

  useAnalyticsErrorReporter(apiErrorObject, 'Failed to load API diagnostics');
  useAnalyticsErrorReporter(databaseErrorObject, 'Failed to load database diagnostics');
  useAnalyticsErrorReporter(mongoDBErrorObject, 'Failed to load MongoDB diagnostics');
  useAnalyticsErrorReporter(buildsErrorObject, 'Failed to load build information');
  useAnalyticsErrorReporter(deploymentsErrorObject, 'Failed to load deployment information');
  useAnalyticsErrorReporter(analyticsErrorObject, 'Failed to load analytics summary');

  const totalAnalyticsEvents = analyticsResponse?.totalCount ?? 0;
  const analyticsResults = useMemo(() => analyticsResponse?.results ?? [], [analyticsResponse?.results]);
  const uniqueSessions = new Set(analyticsResults.map((event) => event.sessionId)).size;
  const last24HoursEvents = useMemo(() => {
    const cutoffTime = Date.now() - 24 * 60 * 60 * 1000;
    return analyticsResults.filter((event) => new Date(event.timestamp).getTime() >= cutoffTime).length;
  }, [analyticsResults]);

  const apiStatus = apiError ? 'Unavailable' : !apiDiagnostics ? (apiLoading ? 'Loading' : 'Unavailable') : apiDiagnostics.failedRequests > 0 ? 'Warning' : 'Healthy';
  const databaseStatus = databaseError ? 'Unavailable' : !databaseDiagnostics ? (databaseLoading ? 'Loading' : 'Unavailable') : !databaseDiagnostics.connectivity ? 'Critical' : databaseDiagnostics.longRunningQueries.length > 0 ? 'Warning' : 'Healthy';
  const mongoDBStatus = mongoDBError ? 'Unavailable' : !mongoDBDiagnostics ? (mongoDBLoading ? 'Loading' : 'Unavailable') : !mongoDBDiagnostics.connectivity ? 'Critical' : mongoDBDiagnostics.longRunningOperations.length > 0 ? 'Warning' : 'Healthy';

  const mostRecentBuild = useMemo(
    () =>
      [...buildInfo].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())[0] ?? null,
    [buildInfo]
  );

  const mostRecentDeployment = deploymentInfo[0] ?? null;

  const displayAnalyticsEvents = useMemo(() => {
    const sortedResults = [...analyticsResults].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const cutoffTime = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentSevenDays = sortedResults.filter((event) => new Date(event.timestamp).getTime() >= cutoffTime);

    return recentSevenDays.length > 0 ? recentSevenDays : sortedResults.slice(0, 5);
  }, [analyticsResults]);

  const buildsForDisplay = useMemo(() => {
    const sortedBuilds = [...buildInfo].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
    const pipelineCounts = new Map<string, number>();

    return sortedBuilds.filter((build) => {
      const pipelineName = build.pipeline?.name ?? 'Pipeline';
      const currentCount = pipelineCounts.get(pipelineName) ?? 0;

      if (currentCount >= 3) {
        return false;
      }

      pipelineCounts.set(pipelineName, currentCount + 1);
      return true;
    });
  }, [buildInfo]);

  const recentDeployments = useMemo(
    () => deploymentInfo.slice(0, 4),
    [deploymentInfo]
  );

  const olderDeployments = useMemo(
    () => deploymentInfo.slice(4, 8),
    [deploymentInfo]
  );

  const recentApiEndpoints = useMemo(
    () => {
      if (!apiDiagnostics) {
        return [];
      }

      return Object.entries(apiDiagnostics.endpoints)
        .sort(([, a], [, b]) => (b.totalRequests ?? 0) - (a.totalRequests ?? 0))
        .slice(0, 4);
    },
    [apiDiagnostics]
  );

  const olderApiEndpoints = useMemo(
    () => {
      if (!apiDiagnostics) {
        return [];
      }

      return Object.entries(apiDiagnostics.endpoints)
        .sort(([, a], [, b]) => (b.totalRequests ?? 0) - (a.totalRequests ?? 0))
        .slice(4, 8);
    },
    [apiDiagnostics]
  );

  return (
    <>
      <main className="infrastructure-compact-shell">
        <TopNav className="infrastructure-top-nav" />

        <div className="infrastructure-header-divider" aria-hidden="true" />

        <div className="infrastructure-compact-grid">
          <section className="infrastructure-compact-panel">
          <h3>Backend</h3>
          <div className="infrastructure-column-stack">
            <div className="infrastructure-column-group">
              <div className="infrastructure-mini-stat-row">
                <span>Status</span>
                <strong><StatusBadge label={apiStatus} tone={getStatusTone(apiStatus)} /></strong>
              </div>
              <div className="infrastructure-mini-stat-row">
                <span>Uptime</span>
                <strong>
                  {apiDiagnostics ? (
                    <StatusBadge
                      label={formatDuration(apiDiagnostics.uptimeMillis)}
                      tone={getUptimeTone(apiDiagnostics.uptimeMillis)}
                    />
                  ) : apiLoading ? 'Loading...' : 'Unavailable'}
                </strong>
              </div>
              <div className="infrastructure-mini-stat-row">
                <span>Requests</span>
                <strong>{apiDiagnostics ? apiDiagnostics.totalRequests.toLocaleString() : apiLoading ? 'Loading...' : 'N/A'}</strong>
              </div>
              <div className="infrastructure-mini-stat-row">
                <span>Failures</span>
                <strong>
                  {apiDiagnostics ? (
                    <StatusBadge
                      label={apiDiagnostics.failedRequests.toLocaleString()}
                      tone={getFailureTone(apiDiagnostics.failedRequests)}
                    />
                  ) : 'N/A'}
                </strong>
              </div>
            </div>

            <div className="infrastructure-column-group">
              <span className="infrastructure-column-label">Endpoints</span>
              {[...recentApiEndpoints, ...olderApiEndpoints].length > 0 ? [...recentApiEndpoints, ...olderApiEndpoints].map(([endpoint, endpointData], index) => (
                <div className="infrastructure-entry" key={`${endpoint}-${index}`}>
                  <div className="infrastructure-entry-header">
                    <span>
                      <StatusBadge label={getRequestLabel(endpoint)} tone={getMethodToneFromEndpoint(endpoint)} />
                      {' '}{endpoint}
                    </span>
                    <strong>{index < recentApiEndpoints.length ? (endpointData.totalRequests ?? 0) : (endpointData.successfulRequests ?? 0)}</strong>
                  </div>
                  <small>
                    {index < recentApiEndpoints.length
                      ? `${endpointData.failedRequests ?? 0} failures · ${endpointData.averageResponseTimeMillis ?? 0} ms`
                      : (endpointData.lastRequestAt ? formatCompactDateTime(endpointData.lastRequestAt) : 'No recent call')}
                  </small>
                </div>
              )) : <div className="infrastructure-entry empty">No endpoint data available.</div>}
            </div>
          </div>
        </section>

        <section className="infrastructure-compact-panel">
          <h3>PostgreSQL</h3>
          <div className="infrastructure-column-stack">
            <div className="infrastructure-column-group">
              <div className="infrastructure-mini-stat-row">
                <span>Status</span>
                <strong><StatusBadge label={databaseStatus} tone={getStatusTone(databaseStatus)} /></strong>
              </div>
              <div className="infrastructure-mini-stat-row">
                <span>Uptime</span>
                <strong>
                  {databaseDiagnostics ? (
                    <StatusBadge
                      label={formatDuration(databaseDiagnostics.uptimeMillis)}
                      tone={getUptimeTone(databaseDiagnostics.uptimeMillis)}
                    />
                  ) : databaseLoading ? 'Loading...' : 'N/A'}
                </strong>
              </div>
              <div className="infrastructure-mini-stat-row">
                <span>Latency</span>
                <strong>
                  {databaseDiagnostics ? (
                    <StatusBadge
                      label={`${databaseDiagnostics.latency.toLocaleString()} ms`}
                      tone={getLatencyTone(databaseDiagnostics.latency)}
                    />
                  ) : databaseLoading ? 'Loading...' : 'N/A'}
                </strong>
              </div>
              <div className="infrastructure-mini-stat-row">
                <span>Storage</span>
                <strong>
                  {databaseDiagnostics ? (
                    <StatusBadge
                      label={formatBytes(databaseDiagnostics.databaseSize)}
                      tone={getStorageTone(databaseDiagnostics.databaseSize)}
                    />
                  ) : databaseLoading ? 'Loading...' : 'N/A'}
                </strong>
              </div>
              <div className="infrastructure-mini-stat-row">
                <span>Connections</span>
                <strong>
                  {databaseDiagnostics ? (
                    <StatusBadge
                      label={`${databaseDiagnostics.activeConnections.toLocaleString()} / ${databaseDiagnostics.maxConnections.toLocaleString()}`}
                      tone={getConnectionTone(databaseDiagnostics.activeConnections, databaseDiagnostics.maxConnections)}
                    />
                  ) : 'N/A'}
                </strong>
              </div>
            </div>

            <div className="infrastructure-column-group">
              <span className="infrastructure-column-label">Long queries</span>
              {databaseDiagnostics && databaseDiagnostics.longRunningQueries.length > 0 ? databaseDiagnostics.longRunningQueries.slice(0, 5).map((query, index) => (
                <div className="infrastructure-entry" key={`${query.queryText}-${index}`}>
                  <div className="infrastructure-entry-header">
                    <span>{query.timeRunningMillis} ms</span>
                    <strong>{index + 1}</strong>
                  </div>
                  <small>{query.queryText.length > 80 ? `${query.queryText.slice(0, 80)}…` : query.queryText}</small>
                </div>
              )) : <div className="infrastructure-entry empty">No long-running queries.</div>}
            </div>

            <div className="infrastructure-database-divider" aria-hidden="true" />
            <h3>MongoDB</h3>
            <div className="infrastructure-column-group">
              <div className="infrastructure-mini-stat-row">
                <span>Status</span>
                <strong><StatusBadge label={mongoDBStatus} tone={getStatusTone(mongoDBStatus)} /></strong>
              </div>
              <div className="infrastructure-mini-stat-row">
                <span>Uptime</span>
                <strong>
                  {mongoDBDiagnostics ? (
                    <StatusBadge
                      label={formatDuration(mongoDBDiagnostics.uptimeMillis)}
                      tone={getUptimeTone(mongoDBDiagnostics.uptimeMillis)}
                    />
                  ) : mongoDBLoading ? 'Loading...' : 'N/A'}
                </strong>
              </div>
              <div className="infrastructure-mini-stat-row">
                <span>Latency</span>
                <strong>
                  {mongoDBDiagnostics ? (
                    <StatusBadge
                      label={`${mongoDBDiagnostics.latency.toLocaleString()} ms`}
                      tone={getLatencyTone(mongoDBDiagnostics.latency)}
                    />
                  ) : mongoDBLoading ? 'Loading...' : 'N/A'}
                </strong>
              </div>
              <div className="infrastructure-mini-stat-row">
                <span>Storage</span>
                <strong>
                  {mongoDBDiagnostics ? (
                    <StatusBadge
                      label={formatBytes(mongoDBDiagnostics.databaseSize)}
                      tone={getStorageTone(mongoDBDiagnostics.databaseSize)}
                    />
                  ) : mongoDBLoading ? 'Loading...' : 'N/A'}
                </strong>
              </div>
              <div className="infrastructure-mini-stat-row">
                <span>Connections</span>
                <strong>
                  {mongoDBDiagnostics ? (
                    <StatusBadge
                      label={`${mongoDBDiagnostics.activeConnections.toLocaleString()} / ${mongoDBDiagnostics.maxConnections.toLocaleString()}`}
                      tone={getConnectionTone(mongoDBDiagnostics.activeConnections, mongoDBDiagnostics.maxConnections)}
                    />
                  ) : 'N/A'}
                </strong>
              </div>
            </div>

            <div className="infrastructure-column-group">
              <span className="infrastructure-column-label">MongoDB long-running operations</span>
              {mongoDBDiagnostics && mongoDBDiagnostics.longRunningOperations.length > 0 ? mongoDBDiagnostics.longRunningOperations.slice(0, 5).map((operation, index) => (
                <div className="infrastructure-entry" key={`${operation.queryText}-${index}`}>
                  <div className="infrastructure-entry-header">
                    <span>{operation.timeRunningMillis} ms</span>
                    <strong>{index + 1}</strong>
                  </div>
                  <small>{operation.queryText.length > 80 ? `${operation.queryText.slice(0, 80)}…` : operation.queryText}</small>
                </div>
              )) : <div className="infrastructure-entry empty">No long-running operations.</div>}
            </div>
          </div>
        </section>

        <section className="infrastructure-compact-panel">
          <h3>Analytics</h3>
          <div className="infrastructure-column-stack">
            <div className="infrastructure-column-group">
              <div className="infrastructure-mini-stat-row">
                <span>Last 24 hours</span>
                <strong>{last24HoursEvents.toLocaleString()}</strong>
              </div>
              <div className="infrastructure-mini-stat-row">
                <span>Events</span>
                <strong>{totalAnalyticsEvents.toLocaleString()}</strong>
              </div>
              <div className="infrastructure-mini-stat-row">
                <span>Sessions</span>
                <strong>{uniqueSessions.toLocaleString()}</strong>
              </div>
              <div className="infrastructure-mini-stat-row">
                <span>State</span>
                <strong><StatusBadge label={analyticsResponse ? 'Live' : 'Unavailable'} tone={analyticsResponse ? 'success' : 'danger'} /></strong>
              </div>
            </div>

            <div className="infrastructure-column-group">
              <span className="infrastructure-column-label">Recent Activity</span>
              {displayAnalyticsEvents.length > 0 ? displayAnalyticsEvents.map((event) => (
                <div className="infrastructure-entry" key={`${event.id}-${event.sessionId}`}>
                  <div className="infrastructure-entry-header">
                    <span>{event.eventType}</span>
                    <strong>{event.sessionId.slice(-12)}</strong>
                  </div>
                  <div className="infrastructure-entry-meta-row">
                    <span>{getLastUrlPathSegment(event.currentUrl)}</span>
                  </div>
                  <div className="infrastructure-entry-meta-row">
                    <span>{formatCompactDateTime(event.timestamp)}</span>
                  </div>
                </div>
              )) : <div className="infrastructure-entry empty">No recent analytics activity.</div>}
            </div>
          </div>
        </section>

        <section className="infrastructure-compact-panel">
          <h3>Builds (Buildkite)</h3>
          <div className="infrastructure-column-stack">
            <div className="infrastructure-column-group">
              <div className="infrastructure-mini-stat-row">
                <span>Latest</span>
                <strong>{mostRecentBuild ? mostRecentBuild.pipeline?.name ?? 'Pipeline' : 'N/A'}</strong>
              </div>
              <div className="infrastructure-mini-stat-row">
                <span>Status</span>
                <strong>{mostRecentBuild ? <StatusBadge label={getBuildStatusLabel(mostRecentBuild.state, mostRecentBuild.blocked)} tone={getStatusTone(getBuildStatusLabel(mostRecentBuild.state, mostRecentBuild.blocked))} /> : 'N/A'}</strong>
              </div>
              <div className="infrastructure-mini-stat-row">
                <span>Updated</span>
                <strong>
                  {mostRecentBuild ? (
                    <StatusBadge
                      label={formatCompactDateTime(mostRecentBuild.created_at ?? undefined)}
                      tone={getRecencyTone(mostRecentBuild.created_at ?? undefined)}
                    />
                  ) : 'N/A'}
                </strong>
              </div>
            </div>

            <div className="infrastructure-column-group">
              <span className="infrastructure-column-label">Recent Builds</span>
              {buildsForDisplay.length > 0 ? buildsForDisplay.map((build) => (
                <div className="infrastructure-entry" key={`${build.id}-build`}>
                  <div className="infrastructure-entry-header">
                    <span>{build.pipeline?.name ?? 'Pipeline'}</span>
                   <strong><StatusBadge label={getBuildStatusLabel(build.state, build.blocked)} tone={getStatusTone(getBuildStatusLabel(build.state, build.blocked))} /></strong>
                  </div>
                  <small>{build.message ?? build.branch ?? 'No message'} · {formatCompactDateTime(build.created_at ?? undefined)}</small>
                </div>
              )) : <div className="infrastructure-entry empty">No recent builds.</div>}
            </div>
          </div>
        </section>

        <section className="infrastructure-compact-panel">
          <h3>Deploy (Render)</h3>
          <div className="infrastructure-column-stack">
            <div className="infrastructure-column-group">
              <div className="infrastructure-mini-stat-row">
                <span>Latest</span>
                <strong>
                  {mostRecentDeployment ? (
                    <StatusBadge
                      label={formatCompactDateTime(mostRecentDeployment.deploy.createdAt)}
                      tone={getRecencyTone(mostRecentDeployment.deploy.createdAt)}
                    />
                  ) : 'N/A'}
                </strong>
              </div>
              <div className="infrastructure-mini-stat-row">
                <span>Status</span>
                <strong>{mostRecentDeployment ? <StatusBadge label={mostRecentDeployment.deploy.status} tone={getStatusTone(mostRecentDeployment.deploy.status)} /> : 'N/A'}</strong>
              </div>
            </div>

            <div className="infrastructure-column-group">
              <span className="infrastructure-column-label">Earlier Deployments</span>
              {[...recentDeployments, ...olderDeployments].length > 0 ? [...recentDeployments, ...olderDeployments].map((deploymentResponse) => (
                <div className="infrastructure-entry" key={`${deploymentResponse.deploy.id}-deployment`}>
                  <div className="infrastructure-entry-header">
                    <span>{formatCompactDateTime(deploymentResponse.deploy.createdAt)}</span>
                    <strong><StatusBadge label={deploymentResponse.deploy.status} tone={getStatusTone(deploymentResponse.deploy.status)} /></strong>
                  </div>
                  <small>{deploymentResponse.deploy.commit?.message ?? 'No commit message'}</small>
                </div>
              )) : <div className="infrastructure-entry empty">No deployments.</div>}
            </div>
          </div>
        </section>
        </div>
      </main>
      <PortfolioFooter />
    </>
  );
}

export default InfrastructureHome;
