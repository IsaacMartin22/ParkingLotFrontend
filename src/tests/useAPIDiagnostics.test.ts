import { validateAPIDiagnostics } from '../network/useAPIDiagnostics';
import { getHeapUsageTone } from '../pages/InfrastructureHome';

describe('API heap diagnostics', () => {
  it('retains valid heap memory usage', () => {
    expect(validateAPIDiagnostics({
      startedAt: '2026-09-03T00:00:00Z',
      uptimeMillis: 86_400_000,
      totalRequests: 10,
      successfulRequests: 10,
      failedRequests: 0,
      endpoints: {},
      recentLogs: [],
      heapMemoryUsage: {
        used: 268_435_456,
        max: 536_870_912,
      },
    }).heapMemoryUsage).toEqual({
      used: 268_435_456,
      max: 536_870_912,
    });
  });

  it('omits malformed heap memory usage without rejecting the diagnostics response', () => {
    expect(validateAPIDiagnostics({
      startedAt: '2026-09-03T00:00:00Z',
      uptimeMillis: 86_400_000,
      totalRequests: 10,
      successfulRequests: 10,
      failedRequests: 0,
      endpoints: {},
      recentLogs: [],
      heapMemoryUsage: {
        used: 100,
        max: 0,
      },
    }).heapMemoryUsage).toBeUndefined();
  });

  it.each([
    [49.9, 'success'],
    [50, 'warning'],
    [80, 'warning'],
    [80.1, 'danger'],
  ] as const)('assigns the expected heap status tone at %s%% usage', (usagePercent, expectedTone) => {
    expect(getHeapUsageTone(usagePercent, 100)).toBe(expectedTone);
  });
});
