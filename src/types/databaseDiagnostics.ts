export interface LongRunningQuery {
  timeRunningMillis: number;
  queryText: string;
}

export interface DatabaseDiagnostics {
  connectivity: boolean;
  latency: number;
  uptimeMillis: number;
  activeConnections: number;
  maxConnections: number;
  databaseSize: number;
  longRunningQueries: LongRunningQuery[];
}
