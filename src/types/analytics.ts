export type AnalyticsEventType =
  | 'CLICK'
  | 'ERROR'
  | 'NETWORK_SUCCESS'
  | 'PAGE_VIEW';

export const ANALYTICS_EVENT_TYPES: readonly AnalyticsEventType[] = [
  'CLICK',
  'ERROR',
  'NETWORK_SUCCESS',
  'PAGE_VIEW',
];

export interface ClickPayload {
  buttonId: string;
}

export interface ErrorPayload {
  errorMessage: string;
}

export interface NetworkSuccessPayload {
  requestName: string;
  durationMillis: number;
}

export interface PageViewPayload {}

export type AnalyticsPayload =
  | ClickPayload
  | ErrorPayload
  | NetworkSuccessPayload
  | PageViewPayload;

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
