import { useQuery } from '@tanstack/react-query';
import { APIDiagnostics } from '../types/apiDiagnostics';

const API_URL = 'http://localhost:8080/api';

function validateAPIDiagnostics(diagnostics: unknown): APIDiagnostics {
  if (!diagnostics || typeof diagnostics !== 'object') {
    throw new Error(`Invalid API diagnostics data: ${JSON.stringify(diagnostics)}`);
  }

  return diagnostics as APIDiagnostics;
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
