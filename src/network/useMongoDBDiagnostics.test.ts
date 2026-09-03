import { validateMongoDBDiagnostics } from './useMongoDBDiagnostics';

describe('validateMongoDBDiagnostics', () => {
  it('retains valid MongoDB metrics and long-running operations', () => {
    expect(validateMongoDBDiagnostics({
      connectivity: true,
      latency: 12,
      uptimeMillis: 86_400_000,
      activeConnections: 4,
      maxConnections: 100,
      databaseSize: 2_048,
      longRunningOperations: [
        { timeRunningMillis: 600, queryText: 'db.tickets.find({ status: "open" })' },
      ],
    })).toEqual({
      connectivity: true,
      latency: 12,
      uptimeMillis: 86_400_000,
      activeConnections: 4,
      maxConnections: 100,
      databaseSize: 2_048,
      longRunningOperations: [
        { timeRunningMillis: 600, queryText: 'db.tickets.find({ status: "open" })' },
      ],
    });
  });

  it('normalizes missing metrics and excludes invalid operations', () => {
    expect(validateMongoDBDiagnostics({
      connectivity: false,
      longRunningOperations: [
        { timeRunningMillis: 600, queryText: 'valid operation' },
        { timeRunningMillis: '600', queryText: 'invalid operation' },
      ],
    })).toEqual({
      connectivity: false,
      latency: 0,
      uptimeMillis: 0,
      activeConnections: 0,
      maxConnections: 0,
      databaseSize: 0,
      longRunningOperations: [
        { timeRunningMillis: 600, queryText: 'valid operation' },
      ],
    });
  });

  it('rejects a non-object response', () => {
    expect(() => validateMongoDBDiagnostics(null)).toThrow('Invalid MongoDB diagnostics data');
  });
});
