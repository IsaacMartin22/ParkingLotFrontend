import { useMutation } from '@tanstack/react-query';
import { API_URL } from '../types/constants';
import { AnalyticsRequest } from '../types/analytics';

async function postAnalyticsRequest(request: AnalyticsRequest): Promise<void> {
  const res = await fetch(`${API_URL}/analytics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    throw new Error(`Failed to post analytics request: API responded with ${res.status}`);
  }
}

export default function usePostAnalyticsRequest() {
  return useMutation((request: AnalyticsRequest) => postAnalyticsRequest(request));
}
