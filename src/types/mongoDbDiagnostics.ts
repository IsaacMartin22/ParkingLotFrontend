export type LongRunningOperation = {
  timeRunningMillis: number;
  queryText: string;
};

export type MongoDBDiagnostics = {
  connectivity: boolean;
  latency: number;
  uptimeMillis: number;
  activeConnections: number;
  maxConnections: number;
  databaseSize: number;
  longRunningOperations: LongRunningOperation[];
};
