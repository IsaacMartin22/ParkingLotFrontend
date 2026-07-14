import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../types/constants';
import { DatabaseDiagnostics, LongRunningQuery } from '../types/databaseDiagnostics';
import usePostAnalyticsRequest from './usePostAnalyticsRequest';
import { buildNetworkSuccessAnalyticsRequest } from './analyticsNetwork';

function isLongRunningQuery(value: unknown): value is LongRunningQuery {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<LongRunningQuery>;

  return (
    typeof candidate.timeRunningMillis === 'number' &&
    Number.isFinite(candidate.timeRunningMillis) &&
    typeof candidate.queryText === 'string'
  );
}

function validateDatabaseDiagnostics(diagnostics: unknown): DatabaseDiagnostics {
  if (!diagnostics || typeof diagnostics !== 'object') {
    throw new Error(`Invalid database diagnostics data: ${JSON.stringify(diagnostics)}`);
  }

  const parsed = diagnostics as Partial<DatabaseDiagnostics>;

  return {
    connectivity: Boolean(parsed.connectivity),
    latency: typeof parsed.latency === 'number' ? parsed.latency : 0,
    uptimeMillis: typeof parsed.uptimeMillis === 'number' ? parsed.uptimeMillis : 0,
    activeConnections: typeof parsed.activeConnections === 'number' ? parsed.activeConnections : 0,
    maxConnections: typeof parsed.maxConnections === 'number' ? parsed.maxConnections : 0,
    databaseSize: typeof parsed.databaseSize === 'number' ? parsed.databaseSize : 0,
    longRunningQueries: Array.isArray(parsed.longRunningQueries)
      ? parsed.longRunningQueries.filter(isLongRunningQuery)
      : [],
  };
}

async function fetchDatabaseDiagnostics(): Promise<DatabaseDiagnostics> {
  const res = await fetch(`${API_URL}/diagnostics/database`);
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  const data: unknown = await res.json();

  return validateDatabaseDiagnostics(data);
}

export default function useDatabaseDiagnostics() {
  const { mutate: postAnalyticsRequest } = usePostAnalyticsRequest();

  async function fetchDatabaseDiagnosticsWithAnalytics(): Promise<DatabaseDiagnostics> {
    const startedAt = Date.now();
    const result = await fetchDatabaseDiagnostics();
    postAnalyticsRequest(buildNetworkSuccessAnalyticsRequest(Date.now() - startedAt));
    return result;
  }

  return useQuery(['databaseDiagnostics'], fetchDatabaseDiagnosticsWithAnalytics, {
    staleTime: 30_000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
