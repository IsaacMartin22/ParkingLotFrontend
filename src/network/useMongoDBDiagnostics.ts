import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../types/constants';
import { LongRunningOperation, MongoDBDiagnostics } from '../types/mongoDbDiagnostics';
import usePostAnalyticsRequest from './usePostAnalyticsRequest';
import { buildNetworkSuccessAnalyticsRequest } from './analyticsNetwork';

function isLongRunningOperation(value: unknown): value is LongRunningOperation {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<LongRunningOperation>;

  return (
    typeof candidate.timeRunningMillis === 'number' &&
    Number.isFinite(candidate.timeRunningMillis) &&
    typeof candidate.queryText === 'string'
  );
}

export function validateMongoDBDiagnostics(diagnostics: unknown): MongoDBDiagnostics {
  if (!diagnostics || typeof diagnostics !== 'object') {
    throw new Error(`Invalid MongoDB diagnostics data: ${JSON.stringify(diagnostics)}`);
  }

  const parsed = diagnostics as Partial<MongoDBDiagnostics>;

  return {
    connectivity: Boolean(parsed.connectivity),
    latency: typeof parsed.latency === 'number' ? parsed.latency : 0,
    uptimeMillis: typeof parsed.uptimeMillis === 'number' ? parsed.uptimeMillis : 0,
    activeConnections: typeof parsed.activeConnections === 'number' ? parsed.activeConnections : 0,
    maxConnections: typeof parsed.maxConnections === 'number' ? parsed.maxConnections : 0,
    databaseSize: typeof parsed.databaseSize === 'number' ? parsed.databaseSize : 0,
    longRunningOperations: Array.isArray(parsed.longRunningOperations)
      ? parsed.longRunningOperations.filter(isLongRunningOperation)
      : [],
  };
}

async function fetchMongoDBDiagnostics(): Promise<MongoDBDiagnostics> {
  const res = await fetch(`${API_URL}/diagnostics/mongodb`);
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  const data: unknown = await res.json();

  return validateMongoDBDiagnostics(data);
}

export default function useMongoDBDiagnostics() {
  const { mutate: postAnalyticsRequest } = usePostAnalyticsRequest();
  const requestName = 'mongoDBDiagnostics';

  async function fetchMongoDBDiagnosticsWithAnalytics(): Promise<MongoDBDiagnostics> {
    const startedAt = Date.now();
    const result = await fetchMongoDBDiagnostics();
    postAnalyticsRequest(buildNetworkSuccessAnalyticsRequest(Date.now() - startedAt, requestName));
    return result;
  }

  return useQuery([requestName], fetchMongoDBDiagnosticsWithAnalytics, {
    staleTime: 30_000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
