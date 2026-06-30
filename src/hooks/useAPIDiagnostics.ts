import { useQuery } from '@tanstack/react-query';
import { APIDiagnostics } from '../types/apiDiagnostics';
import {API_URL} from "../types/constants";

function validateAPIDiagnostics(diagnostics: unknown): APIDiagnostics {
  if (!diagnostics || typeof diagnostics !== 'object') {
    throw new Error(`Invalid API diagnostics data: ${JSON.stringify(diagnostics)}`);
  }

  const parsed = diagnostics as APIDiagnostics;

  return {
    ...parsed,
    recentLogs: Array.isArray(parsed.recentLogs) ? parsed.recentLogs : [],
  };
}

async function fetchAPIDiagnostics(): Promise<APIDiagnostics> {
  const res = await fetch(`${API_URL}/diagnostics`);
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  const data: unknown = await res.json();

  return validateAPIDiagnostics(data);
}

export default function useAPIDiagnostics() {
  return useQuery(['apiDiagnostics'], fetchAPIDiagnostics, {
    staleTime: 30_000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
