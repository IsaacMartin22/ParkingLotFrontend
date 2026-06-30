export interface EndpointDiagnostics {
  totalRequests?: number;
  successfulRequests?: number;
  failedRequests?: number;
  averageResponseTimeMillis?: number;
  minResponseTimeMillis?: number;
  maxResponseTimeMillis?: number;
  lastRequestAt?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  logger: string;
  thread: string;
  message: string;
  throwable?: string | null;
}

export interface APIDiagnostics {
  startedAt: string;
  uptimeMillis: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  endpoints: Record<string, EndpointDiagnostics>;
  recentLogs: LogEntry[];
}
