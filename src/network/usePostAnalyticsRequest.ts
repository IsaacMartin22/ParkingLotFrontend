import { useMutation } from '@tanstack/react-query';
import { API_URL } from '../types/constants';
import { AnalyticsRequest } from '../types/analytics';

async function postAnalyticsRequest(request: AnalyticsRequest): Promise<void> {
  if (request.currentUrl?.includes('localhost')) {
    //return;
  }

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
  return useMutation((request: Omit<AnalyticsRequest, 'sessionId'>) =>
    postAnalyticsRequest({
      ...request,
      sessionId: getOrCreateAnalyticsSessionId(),
    })
  );
}

const ANALYTICS_SESSION_STORAGE_KEY = 'parking-analytics-session-id';

function generateAnalyticsSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const result: string[] = [];

  for (let index = 0; index < 24; index += 1) {
    result.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }

  return result.join('');
}

function getOrCreateAnalyticsSessionId(): string {
  const existingSessionId = window.sessionStorage.getItem(ANALYTICS_SESSION_STORAGE_KEY);
  if (existingSessionId) {
    return existingSessionId;
  }

  const sessionId = generateAnalyticsSessionId();
  window.sessionStorage.setItem(ANALYTICS_SESSION_STORAGE_KEY, sessionId);
  return sessionId;
}
