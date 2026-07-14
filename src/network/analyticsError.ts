import type { AnalyticsRequest, ErrorPayload } from '../types/analytics';

export function buildErrorAnalyticsRequest(errorMessage: string): Omit<AnalyticsRequest<ErrorPayload>, 'sessionId'> {
  return {
    eventType: 'ERROR',
    currentUrl: window.location.href,
    browser: window.navigator.userAgent,
    operatingSystem: window.navigator.platform,
    ipAddress: 'unknown',
    timestamp: new Date().toISOString(),
    payload: {
      errorMessage,
    },
  };
}
