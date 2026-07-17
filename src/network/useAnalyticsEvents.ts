import { useQuery } from '@tanstack/react-query';
import { ANALYTICS_EVENT_TYPES, AnalyticsEventType, AnalyticsQuery } from '../types/analytics';
import { API_URL } from '../types/constants';

export const ANALYTICS_EVENTS_PAGE_SIZE = 1000;

export interface AnalyticsEventRecord {
  id: string;
  eventType: AnalyticsEventType;
  currentUrl: string;
  browser: string;
  operatingSystem: string;
  sessionId: string;
  ipAddress: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isAnalyticsEventType(value: unknown): value is AnalyticsEventType {
  return typeof value === 'string' && ANALYTICS_EVENT_TYPES.includes(value as AnalyticsEventType);
}

function normalizeAnalyticsEvent(event: unknown, index: number): AnalyticsEventRecord | null {
  if (!isObjectRecord(event)) {
    return null;
  }

  const eventType = event.eventType;
  if (!isAnalyticsEventType(eventType)) {
    return null;
  }

  const normalizedTimestamp =
    typeof event.timestamp === 'string' ? event.timestamp : new Date(0).toISOString();
  const normalizedSessionId = typeof event.sessionId === 'string' ? event.sessionId : 'unknown';
  const rawId = event.id;
  const normalizedId =
    typeof rawId === 'string'
      ? rawId
      : typeof rawId === 'number'
        ? String(rawId)
        : `${eventType}-${normalizedTimestamp}-${normalizedSessionId}-${index}`;

  return {
    id: normalizedId,
    eventType,
    currentUrl: typeof event.currentUrl === 'string' ? event.currentUrl : 'unknown',
    browser: typeof event.browser === 'string' ? event.browser : 'unknown',
    operatingSystem: typeof event.operatingSystem === 'string' ? event.operatingSystem : 'unknown',
    sessionId: normalizedSessionId,
    ipAddress: typeof event.ipAddress === 'string' ? event.ipAddress : 'unknown',
    timestamp: normalizedTimestamp,
    payload: isObjectRecord(event.payload) ? event.payload : {},
  };
}

function normalizeAnalyticsEvents(data: unknown): AnalyticsEventRecord[] {
  const candidateEvents = Array.isArray(data)
    ? data
    : isObjectRecord(data) && Array.isArray(data.events)
      ? data.events
      : [];

  return candidateEvents
    .map((event, index) => normalizeAnalyticsEvent(event, index))
    .filter((event): event is AnalyticsEventRecord => event !== null);
}

export type AnalyticsEventsQueryOptions = {
  query: AnalyticsQuery;
};

async function fetchAnalyticsEvents(query: AnalyticsQuery): Promise<AnalyticsEventRecord[]> {
  const response = await fetch(`${API_URL}/analytics/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  });
  if (!response.ok) {
    throw new Error(`Failed to load analytics events: API responded with ${response.status}`);
  }

  const data: unknown = await response.json();
  return normalizeAnalyticsEvents(data);
}

export default function useAnalyticsEvents({ query }: AnalyticsEventsQueryOptions) {
  return useQuery(['analyticsEvents', query], () => fetchAnalyticsEvents(query), {
    staleTime: 30_000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
