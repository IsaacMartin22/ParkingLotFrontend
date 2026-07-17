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

export type AnalyticsQuerySortDirection = 'asc' | 'desc';
export type AnalyticsQueryField =
  | 'eventType'
  | 'currentUrl'
  | 'browser'
  | 'operatingSystem'
  | 'sessionId'
  | 'ipAddress'
  | 'timestamp';

export type AnalyticsQueryFilterOperator = 'eq' | 'neq' | 'has' | 'lt' | 'lte' | 'gt' | 'gte';

export interface AnalyticsQueryFilter {
  field: AnalyticsQueryField;
  operator: AnalyticsQueryFilterOperator;
  value: string;
}

export interface AnalyticsQuery {
  filters: AnalyticsQueryFilter[];
  sortField: string;
  sortDirection: AnalyticsQuerySortDirection;
  page: number;
}
