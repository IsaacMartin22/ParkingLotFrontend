export type LongRunningQuery = {
  timeRunningMillis: number;
  queryText: string;
};

export type DatabaseDiagnostics = {
  connectivity: boolean;
  latency: number;
  uptimeMillis: number;
  activeConnections: number;
  maxConnections: number;
  databaseSize: number;
  longRunningQueries: LongRunningQuery[];
};
