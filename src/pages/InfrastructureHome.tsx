import React, { ChangeEvent, JSX, MouseEvent as ReactMouseEvent, useMemo, useState } from 'react';
import PortfolioFooter from '../components/PortfolioFooter';
import TopNav from '../components/TopNav';
import useAPIDiagnostics from '../network/useAPIDiagnostics';
import useBuildkiteInfo from '../network/useBuildkiteInfo';
import useDatabaseDiagnostics from '../network/useDatabaseDiagnostics';
import useDeploymentInfo from '../network/useDeploymentInfo';
import useAnalyticsErrorReporter from '../network/useAnalyticsErrorReporter';
import useAnalyticsEvents from '../network/useAnalyticsEvents';
import useMongoDBDiagnostics from '../network/useMongoDBDiagnostics';
import useRecentChatbotInteractions from '../network/useRecentChatbotInteractions';
import { formatDuration } from '../formattingUtils';
import {
  ANALYTICS_EVENT_TYPES,
  AnalyticsQuery,
  AnalyticsQueryField,
  AnalyticsQuerySortDirection,
} from '../types/analytics';
import '../styles/ServicePageStyles.css';
import '../styles/Interactions.css';

const defaultAnalyticsQuery: AnalyticsQuery = {
  filters: [{ field: 'eventType', operator: 'eq', value: 'PAGE_VIEW' }],
  sortField: 'timestamp',
  sortDirection: 'desc',
  page: 1,
};

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

  if (['healthy', 'live', 'passed', 'success', 'ok', 'get', 'deactivated'].includes(normalized)) {
    return 'success';
  }

  if (['warning', 'blocked', 'build_in_progress', 'queued', 'post', 'update_in_progress'].includes(normalized)) {
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

function formatHeapMemoryUsage(used: number | null | undefined, max: number | null | undefined): string {
  if (used == null || max == null || !Number.isFinite(used) || !Number.isFinite(max) || used < 0 || max <= 0) {
    return 'N/A';
  }

  const usagePercent = (used / max) * 100;
  return `${formatBytes(used)} / ${formatBytes(max)} (${usagePercent.toFixed(1)}%)`;
}

export function getHeapUsageTone(used: number | null | undefined, max: number | null | undefined): 'success' | 'warning' | 'danger' {
  if (used == null || max == null || !Number.isFinite(used) || !Number.isFinite(max) || used < 0 || max <= 0) {
    return 'warning';
  }

  const usagePercent = (used / max) * 100;

  if (usagePercent < 50) {
    return 'success';
  }

  if (usagePercent <= 80) {
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

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleString();
}

function InfrastructureHome(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'infrastructure' | 'analytics' | 'chatbot'>('infrastructure');
  const [analyticsColumnWidths, setAnalyticsColumnWidths] = useState<number[]>([8, 12, 12, 18, 12, 12, 12, 14]);
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('PAGE_VIEW');
  const [sessionFilter, setSessionFilter] = useState<string>('');
  const [analyticsQuery, setAnalyticsQuery] = useState<AnalyticsQuery>(defaultAnalyticsQuery);
  const [visibleAnalyticsColumns, setVisibleAnalyticsColumns] = useState({
    index: true,
    eventType: true,
    sessionId: true,
    currentUrl: true,
    browser: false,
    operatingSystem: false,
    ipAddress: false,
    timestamp: true,
  });
  const { data: apiDiagnostics, isLoading: apiLoading, isError: apiError, error: apiErrorObject } = useAPIDiagnostics();
  const { data: databaseDiagnostics, isLoading: databaseLoading, isError: databaseError, error: databaseErrorObject } = useDatabaseDiagnostics();
  const { data: mongoDBDiagnostics, isLoading: mongoDBLoading, isError: mongoDBError, error: mongoDBErrorObject } = useMongoDBDiagnostics();
  const { data: buildInfo = [], error: buildsErrorObject } = useBuildkiteInfo();
  const { data: deploymentInfo = [], error: deploymentsErrorObject } = useDeploymentInfo();
  const {
    data: analyticsEvents,
    isLoading: analyticsLoading,
    isError: analyticsError,
  } = useAnalyticsEvents({ query: analyticsQuery });
  const {
    data: recentChatbotInteractions,
    isLoading: chatbotInteractionsLoading,
    isError: chatbotInteractionsError,
  } = useRecentChatbotInteractions();
  useAnalyticsErrorReporter(apiErrorObject, 'Failed to load API diagnostics');
  useAnalyticsErrorReporter(databaseErrorObject, 'Failed to load database diagnostics');
  useAnalyticsErrorReporter(mongoDBErrorObject, 'Failed to load MongoDB diagnostics');
  useAnalyticsErrorReporter(buildsErrorObject, 'Failed to load build information');
  useAnalyticsErrorReporter(deploymentsErrorObject, 'Failed to load deployment information');

  const apiStatus = apiError ? 'Unavailable' : !apiDiagnostics ? (apiLoading ? 'Loading' : 'Unavailable') : apiDiagnostics.failedRequests > 0 ? 'Warning' : 'Healthy';
  const databaseStatus = databaseError ? 'Unavailable' : !databaseDiagnostics ? (databaseLoading ? 'Loading' : 'Unavailable') : !databaseDiagnostics.connectivity ? 'Critical' : databaseDiagnostics.longRunningQueries.length > 0 ? 'Warning' : 'Healthy';
  const mongoDBStatus = mongoDBError ? 'Unavailable' : !mongoDBDiagnostics ? (mongoDBLoading ? 'Loading' : 'Unavailable') : !mongoDBDiagnostics.connectivity ? 'Critical' : mongoDBDiagnostics.longRunningOperations.length > 0 ? 'Warning' : 'Healthy';

  const mostRecentBuild = useMemo(
    () =>
      [...buildInfo].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())[0] ?? null,
    [buildInfo]
  );

  const mostRecentDeployment = deploymentInfo[0] ?? null;

  const buildsForDisplay = useMemo(() => {
    const sortedBuilds = [...buildInfo].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
    const pipelineCounts = new Map<string, number>();

    return sortedBuilds
      .filter((build) => {
        const pipelineName = build.pipeline?.name ?? 'Pipeline';
        const currentCount = pipelineCounts.get(pipelineName) ?? 0;

        if (currentCount >= 3) {
          return false;
        }

        pipelineCounts.set(pipelineName, currentCount + 1);
        return true;
      })
      .slice(0, 5);
  }, [buildInfo]);

  const recentDeployments = useMemo(
    () => deploymentInfo.slice(0, 5),
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

  const analyticsTotalPages = analyticsEvents?.totalPages ?? 1;

  const analyticsColumns = useMemo(
    () => [
      { key: 'index', label: '#', sortField: 'timestamp' as AnalyticsQueryField },
      { key: 'eventType', label: 'Event', sortField: 'eventType' as AnalyticsQueryField },
      { key: 'sessionId', label: 'Session', sortField: 'sessionId' as AnalyticsQueryField },
      { key: 'currentUrl', label: 'URL', sortField: 'currentUrl' as AnalyticsQueryField },
      { key: 'browser', label: 'Browser', sortField: 'browser' as AnalyticsQueryField },
      { key: 'operatingSystem', label: 'OS', sortField: 'operatingSystem' as AnalyticsQueryField },
      { key: 'ipAddress', label: 'IP', sortField: 'ipAddress' as AnalyticsQueryField },
      { key: 'timestamp', label: 'Timestamp', sortField: 'timestamp' as AnalyticsQueryField },
    ],
    []
  );

  const activeAnalyticsColumns = analyticsColumns.filter(
    (column) => visibleAnalyticsColumns[column.key as keyof typeof visibleAnalyticsColumns]
  );

  const activeColumnCount = activeAnalyticsColumns.length;

  const analyticsSortArrow = (field: AnalyticsQueryField): string => {
    if (analyticsQuery.sortField !== field) {
      return '';
    }

    return analyticsQuery.sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  const analyticsSummary = useMemo(() => {
    if (!analyticsEvents) {
      return 'No analytics loaded.';
    }

    return `Showing page ${analyticsQuery.page} of ${analyticsEvents.totalPages} (${analyticsEvents.totalCount} total events)`;
  }, [analyticsEvents, analyticsQuery.page]);

  const handleAnalyticsColumnResizeMouseDown = (
    event: ReactMouseEvent<HTMLDivElement>,
    columnIndex: number
  ): void => {
    event.preventDefault();
    const table = event.currentTarget.closest('table');
    if (!table) {
      return;
    }

    const tableRect = table.getBoundingClientRect();
    const startX = event.clientX;
    const startWidths = [...analyticsColumnWidths];

    const handleMouseMove = (moveEvent: MouseEvent): void => {
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / tableRect.width) * 100;
      const leftWidth = startWidths[columnIndex] + deltaPercent;
      const rightWidth = startWidths[columnIndex + 1] - deltaPercent;
      const minWidth = 8;

      if (leftWidth < minWidth || rightWidth < minWidth) {
        return;
      }

      const nextWidths = [...startWidths];
      nextWidths[columnIndex] = leftWidth;
      nextWidths[columnIndex + 1] = rightWidth;
      setAnalyticsColumnWidths(nextWidths);
    };

    const handleMouseUp = (): void => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const applyAnalyticsFilters = (): void => {
    const filters = [];

    if (eventTypeFilter !== 'ALL') {
      filters.push({
        field: 'eventType' as const,
        operator: 'eq' as const,
        value: eventTypeFilter,
      });
    }

    if (sessionFilter.trim()) {
      filters.push({
        field: 'sessionId' as const,
        operator: 'has' as const,
        value: sessionFilter.trim(),
      });
    }

    setAnalyticsQuery((prevQuery) => ({
      ...prevQuery,
      filters,
      page: 1,
    }));
  };

  const resetAnalyticsFilters = (): void => {
    setEventTypeFilter('PAGE_VIEW');
    setSessionFilter('');
    setAnalyticsQuery(defaultAnalyticsQuery);
  };

  const handleSortChange = (field: AnalyticsQueryField): void => {
    setAnalyticsQuery((prevQuery) => {
      const nextDirection: AnalyticsQuerySortDirection =
        prevQuery.sortField === field && prevQuery.sortDirection === 'asc' ? 'desc' : 'asc';

      return {
        ...prevQuery,
        sortField: field,
        sortDirection: nextDirection,
        page: 1,
      };
    });
  };

  const goToPreviousAnalyticsPage = (): void => {
    setAnalyticsQuery((prevQuery) => ({
      ...prevQuery,
      page: Math.max(1, prevQuery.page - 1),
    }));
  };

  const goToNextAnalyticsPage = (): void => {
    setAnalyticsQuery((prevQuery) => ({
      ...prevQuery,
      page: Math.min(analyticsTotalPages, prevQuery.page + 1),
    }));
  };

  const analyticsPaginationControls = (
    <>
      <button type="button" onClick={goToPreviousAnalyticsPage} disabled={analyticsQuery.page <= 1}>
        Previous
      </button>
      <button
        type="button"
        onClick={goToNextAnalyticsPage}
        disabled={analyticsQuery.page >= analyticsTotalPages}
      >
        Next
      </button>
    </>
  );

  const handleAnalyticsColumnToggle = (columnKey: keyof typeof visibleAnalyticsColumns): void => {
    setVisibleAnalyticsColumns((prevColumns) => {
      const enabledCount = Object.values(prevColumns).filter(Boolean).length;
      if (prevColumns[columnKey] && enabledCount === 1) {
        return prevColumns;
      }

      return {
        ...prevColumns,
        [columnKey]: !prevColumns[columnKey],
      };
    });
  };

  return (
    <>
      <main className="infrastructure-compact-shell">
        <TopNav className="infrastructure-top-nav" />

        <div className="infrastructure-header-divider" aria-hidden="true" />

        <div className="infrastructure-tabs-shell">
          <div className="interactions-tabs infrastructure-tabs" role="tablist" aria-label="Infrastructure views">
           <button
             type="button"
             role="tab"
             aria-selected={activeTab === 'infrastructure'}
             className={`interactions-tab ${activeTab === 'infrastructure' ? 'is-active' : ''}`}
             onClick={() => setActiveTab('infrastructure')}
           >
             Infrastructure
           </button>
           <button
             type="button"
             role="tab"
             aria-selected={activeTab === 'analytics'}
             className={`interactions-tab ${activeTab === 'analytics' ? 'is-active' : ''}`}
             onClick={() => setActiveTab('analytics')}
           >
             Analytics
           </button>
           <button
             type="button"
             role="tab"
             aria-selected={activeTab === 'chatbot'}
             className={`interactions-tab ${activeTab === 'chatbot' ? 'is-active' : ''}`}
             onClick={() => setActiveTab('chatbot')}
           >
             Chat Interactions
           </button>
          </div>

          {activeTab === 'infrastructure' && (
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
              <div className="infrastructure-mini-stat-row">
                <span>Heap memory</span>
                <strong>
                  {apiDiagnostics?.heapMemoryUsage ? (
                    <StatusBadge
                      label={formatHeapMemoryUsage(apiDiagnostics.heapMemoryUsage.used, apiDiagnostics.heapMemoryUsage.max)}
                      tone={getHeapUsageTone(apiDiagnostics.heapMemoryUsage.used, apiDiagnostics.heapMemoryUsage.max)}
                    />
                  ) : apiLoading ? 'Loading...' : 'N/A'}
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
        </section>

          <section className="infrastructure-compact-panel">
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
              {[...recentDeployments].length > 0 ? [...recentDeployments].map((deploymentResponse) => (
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
         )}

         {activeTab === 'analytics' && (
           <section className="interactions-table-card interactions-panel infrastructure-tab-panel" aria-labelledby="analytics-table-heading">
             <h1 id="analytics-table-heading">Analytics</h1>
             <div className="analytics-controls">
               <label htmlFor="analytics-event-filter">
                 Event Type
                 <select
                   id="analytics-event-filter"
                   value={eventTypeFilter}
                   onChange={(event: ChangeEvent<HTMLSelectElement>) => setEventTypeFilter(event.target.value)}
                 >
                   <option value="ALL">All events</option>
                   {ANALYTICS_EVENT_TYPES.map((eventType) => (
                     <option key={eventType} value={eventType}>
                       {eventType}
                     </option>
                   ))}
                 </select>
               </label>
               <label htmlFor="analytics-session-filter">
                 Session Contains
                 <input
                   id="analytics-session-filter"
                   type="text"
                   value={sessionFilter}
                   onChange={(event: ChangeEvent<HTMLInputElement>) => setSessionFilter(event.target.value)}
                 />
               </label>
               <button type="button" onClick={applyAnalyticsFilters}>
                 Apply Filters
               </button>
               <button type="button" onClick={resetAnalyticsFilters}>
                 Reset
               </button>
             </div>
             <div className="analytics-column-toggles" role="group" aria-label="Toggle analytics columns">
               {analyticsColumns.map((column) => (
                 <label key={column.key} htmlFor={`analytics-column-${column.key}`}>
                   <input
                     id={`analytics-column-${column.key}`}
                     type="checkbox"
                     checked={visibleAnalyticsColumns[column.key as keyof typeof visibleAnalyticsColumns]}
                     onChange={() =>
                       handleAnalyticsColumnToggle(column.key as keyof typeof visibleAnalyticsColumns)
                     }
                   />
                   {column.label}
                 </label>
               ))}
             </div>
             <div className="analytics-pagination analytics-pagination-top">
               <span>{analyticsSummary}</span>
               <div className="analytics-pagination-buttons">{analyticsPaginationControls}</div>
             </div>
             <div className="interactions-table-scroll-shell">
               <table className="interactions-table interactions-table-analytics">
                 <colgroup>
                   {activeAnalyticsColumns.map((column, index) => (
                     <col key={column.key} style={{ width: `${analyticsColumnWidths[index]}%` }} />
                   ))}
                 </colgroup>
                 <thead>
                   <tr>
                     {activeAnalyticsColumns.map((column, index) => (
                       <th key={column.key} scope="col">
                         <div className="analytics-header-cell">
                           <button
                             type="button"
                             className="analytics-sort-button"
                             onClick={() => handleSortChange(column.sortField)}
                           >
                             {column.label}
                             {analyticsSortArrow(column.sortField)}
                           </button>
                           {index < activeAnalyticsColumns.length - 1 && (
                             <div
                               className="analytics-column-divider"
                               role="separator"
                               aria-orientation="vertical"
                               aria-label={`Resize ${column.label} and ${activeAnalyticsColumns[index + 1].label} columns`}
                               onMouseDown={(event) => handleAnalyticsColumnResizeMouseDown(event, index)}
                             />
                           )}
                         </div>
                       </th>
                     ))}
                   </tr>
                 </thead>
                 <tbody>
                   {analyticsLoading && (
                     <tr>
                       <td colSpan={activeColumnCount + 1}>Loading analytics events...</td>
                     </tr>
                   )}
                   {analyticsError && (
                     <tr>
                       <td colSpan={activeColumnCount + 1}>Failed to load analytics events.</td>
                     </tr>
                   )}
                   {!analyticsLoading && !analyticsError && analyticsEvents?.results.length === 0 && (
                     <tr>
                       <td colSpan={activeColumnCount + 1}>No analytics events available.</td>
                     </tr>
                   )}
                   {!analyticsLoading &&
                     !analyticsError &&
                     analyticsEvents?.results.map((event, index) => (
                       <tr key={event.id}>
                         {visibleAnalyticsColumns.index && <td>{(analyticsEvents.results.length > 0 ? (analyticsQuery.page - 1) * analyticsEvents.results.length : 0) + index + 1}</td>}
                         {visibleAnalyticsColumns.eventType && <td>{event.eventType}</td>}
                         {visibleAnalyticsColumns.sessionId && <td>{event.sessionId}</td>}
                         {visibleAnalyticsColumns.currentUrl && <td>{event.currentUrl}</td>}
                         {visibleAnalyticsColumns.browser && <td>{event.browser}</td>}
                         {visibleAnalyticsColumns.operatingSystem && <td>{event.operatingSystem}</td>}
                         {visibleAnalyticsColumns.ipAddress && <td>{event.ipAddress}</td>}
                         {visibleAnalyticsColumns.timestamp && <td>{formatTimestamp(event.timestamp)}</td>}
                       </tr>
                     ))}
                 </tbody>
               </table>
             </div>
             <div className="analytics-pagination">
               <span>{analyticsSummary}</span>
               <div className="analytics-pagination-buttons">{analyticsPaginationControls}</div>
             </div>
           </section>
         )}

         {activeTab === 'chatbot' && (
           <section className="interactions-table-card interactions-panel infrastructure-tab-panel" aria-labelledby="chatbot-table-heading">
             <h1 id="chatbot-table-heading">Chatbot Interactions</h1>
             <div className="interactions-table-scroll-shell">
               <table className="interactions-table">
                 <thead>
                   <tr>
                     <th scope="col">#</th>
                     <th scope="col">Timestamp</th>
                     <th scope="col">User Message</th>
                     <th scope="col">Assistant Response</th>
                   </tr>
                 </thead>
                 <tbody>
                   {chatbotInteractionsLoading && (
                     <tr>
                       <td colSpan={4}>Loading chatbot interactions...</td>
                     </tr>
                   )}
                   {chatbotInteractionsError && (
                     <tr>
                       <td colSpan={4}>Failed to load chatbot interactions.</td>
                     </tr>
                   )}
                   {!chatbotInteractionsLoading &&
                     !chatbotInteractionsError &&
                     recentChatbotInteractions?.interactions.length === 0 && (
                       <tr>
                         <td colSpan={4}>No chatbot interactions available.</td>
                       </tr>
                     )}
                   {!chatbotInteractionsLoading &&
                     !chatbotInteractionsError &&
                     recentChatbotInteractions?.interactions.map((interaction, index) => (
                       <tr key={`${interaction.timestamp}-${index}`}>
                         <td>{index + 1}</td>
                         <td>{formatTimestamp(interaction.timestamp)}</td>
                         <td>{interaction.question}</td>
                         <td>{interaction.response}</td>
                       </tr>
                     ))}
                 </tbody>
               </table>
             </div>
           </section>
         )}
        </div>
      </main>
      <PortfolioFooter />
    </>
  );
}

export default InfrastructureHome;
