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

export interface APIDiagnostics {
  startedAt: string;
  uptimeMillis: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  endpoints: Record<string, EndpointDiagnostics>;
}
