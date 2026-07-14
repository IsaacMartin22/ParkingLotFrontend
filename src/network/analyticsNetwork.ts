import type { AnalyticsRequest, NetworkSuccessPayload } from '../types/analytics';

export function buildNetworkSuccessAnalyticsRequest(durationMillis: number): Omit<
  AnalyticsRequest<NetworkSuccessPayload>,
  'sessionId'
> {
  return {
    eventType: 'NETWORK_SUCCESS',
    currentUrl: window.location.href,
    browser: window.navigator.userAgent,
    operatingSystem: window.navigator.platform,
    ipAddress: 'unknown',
    timestamp: new Date().toISOString(),
    payload: {
      durationMillis,
    },
  };
}
