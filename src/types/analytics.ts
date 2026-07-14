export type AnalyticsEventType =
  | 'CLICK'
  | 'ERROR'
  | 'NETWORK_SUCCESS'
  | 'NETWORK_FAILURE'
  | 'PAGE_VIEW'
  | 'CLIENT_SSE_RECEIVED';

export const ANALYTICS_EVENT_TYPES: readonly AnalyticsEventType[] = [
  'CLICK',
  'ERROR',
  'NETWORK_SUCCESS',
  'NETWORK_FAILURE',
  'PAGE_VIEW',
  'CLIENT_SSE_RECEIVED',
];

export interface ClickPayload {
  buttonId: string;
}

export interface ErrorPayload {
  errorMessage: string;
}

export interface NetworkSuccessPayload {}

export interface NetworkFailurePayload {}

export interface PageViewPayload {
  referrerUrl: string;
}

export interface ClientSSEReceivedPayload {
  spaceId: number;
  add: boolean;
}

export type AnalyticsPayload =
  | ClickPayload
  | ErrorPayload
  | NetworkSuccessPayload
  | NetworkFailurePayload
  | PageViewPayload
  | ClientSSEReceivedPayload;

export interface AnalyticsRequest<TPayload extends AnalyticsPayload = AnalyticsPayload> {
  eventType: AnalyticsEventType;
  currentUrl: string;
  browser: string;
  operatingSystem: string;
  sessionId: string;
  ipAddress: string;
  timestamp: string;
  payload: TPayload;
}
