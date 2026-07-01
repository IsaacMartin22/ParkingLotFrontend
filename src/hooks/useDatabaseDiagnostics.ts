import { useQuery } from '@tanstack/react-query';
import {API_URL} from "../types/constants";
import {DatabaseDiagnostics} from "../types/databaseDiagnostics";

function validateDatabaseDiagnostics(diagnostics: unknown): DatabaseDiagnostics {
  if (!diagnostics || typeof diagnostics !== 'object') {
    throw new Error(`Invalid Database diagnostics data: ${JSON.stringify(diagnostics)}`);
  }

  const parsed = diagnostics as DatabaseDiagnostics;

  return {
    ...parsed,
    longRunningQueries: Array.isArray(parsed.longRunningQueries)
      ? parsed.longRunningQueries
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
  return useQuery(['databaseDiagnostics'], fetchDatabaseDiagnostics, {
    staleTime: 30_000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
