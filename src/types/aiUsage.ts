export interface AIUsageTokenBreakdown {
  input: number;
  output: number;
  total: number;
}

export interface AIUsageRecord {
  id: string;
  parentTaskId: string | null;
  dependencyTaskIds: string[];
  provider: string;
  model: string;
  feature: string;
  requestType: string;
  title: string;
  checkpointLabel: string | null;
  selectedByHuman: boolean;
  startedAt: string;
  completedAt: string | null;
  status: string;
  tokens: AIUsageTokenBreakdown;
  cost: number;
  latencyMillis: number;
  source: string;
  metadata: Record<string, unknown>;
}

export interface AIUsageSummary {
  workflowTitle: string;
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  activeRequests: number;
  providers: number;
  humanCheckpointCount: number;
  lastUpdatedAt: string | null;
}

export interface AIUsageResponse {
  summary: AIUsageSummary;
  records: AIUsageRecord[];
}

export type AIUsageSseEventType = 'SNAPSHOT' | 'UPSERT' | 'DELETE';

export interface AIUsageSseEvent {
  type: AIUsageSseEventType;
  timestamp: string;
  summary?: Partial<AIUsageSummary>;
  record?: AIUsageRecord;
  recordId?: string;
}
