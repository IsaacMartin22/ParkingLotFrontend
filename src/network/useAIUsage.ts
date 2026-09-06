import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../types/constants';
import usePostAnalyticsRequest from './usePostAnalyticsRequest';
import { buildNetworkSuccessAnalyticsRequest } from './analyticsNetwork';
import { AIUsageRecord, AIUsageResponse, AIUsageSummary, AIUsageTokenBreakdown } from '../types/aiUsage';

const mockAIUsageResponse: AIUsageResponse = {
  summary: {
    workflowTitle: 'Resolve production auth failure and prepare safe rollout',
    totalRequests: 6,
    totalTokens: 36840,
    totalCost: 0.4182,
    activeRequests: 1,
    providers: 3,
    humanCheckpointCount: 2,
    lastUpdatedAt: '2026-09-05T22:44:00.000Z',
  },
  records: [
    {
      id: 'task-root-incident-triage',
      parentTaskId: null,
      dependencyTaskIds: [],
      provider: 'OpenAI',
      model: 'gpt-5.4',
      feature: 'Incident triage',
      requestType: 'Root analysis',
      title: 'Investigate elevated 500 errors on production API',
      checkpointLabel: null,
      selectedByHuman: false,
      startedAt: '2026-09-05T22:12:00.000Z',
      completedAt: '2026-09-05T22:14:12.000Z',
      status: 'SUCCESS',
      tokens: { input: 3200, output: 1400, total: 4600 },
      cost: 0.0612,
      latencyMillis: 18400,
      source: 'Infrastructure Home',
      metadata: {},
    },
    {
      id: 'task-query-render-logs',
      parentTaskId: 'task-root-incident-triage',
      dependencyTaskIds: ['task-root-incident-triage'],
      provider: 'Anthropic',
      model: 'claude-sonnet-5',
      feature: 'Log review',
      requestType: 'Dependency task',
      title: 'Inspect Render application logs for matching exception spikes',
      checkpointLabel: 'Checkpoint A - inspect runtime logs',
      selectedByHuman: true,
      startedAt: '2026-09-05T22:15:00.000Z',
      completedAt: '2026-09-05T22:18:24.000Z',
      status: 'SUCCESS',
      tokens: { input: 4100, output: 1200, total: 5300 },
      cost: 0.0884,
      latencyMillis: 21900,
      source: 'Manual approval',
      metadata: {},
    },
    {
      id: 'task-database-compare',
      parentTaskId: 'task-root-incident-triage',
      dependencyTaskIds: ['task-root-incident-triage'],
      provider: 'Google',
      model: 'gemini-3.6-flash',
      feature: 'Database diagnostics',
      requestType: 'Dependency task',
      title: 'Compare PostgreSQL connection saturation against request failures',
      checkpointLabel: null,
      selectedByHuman: false,
      startedAt: '2026-09-05T22:15:20.000Z',
      completedAt: '2026-09-05T22:16:11.000Z',
      status: 'SUCCESS',
      tokens: { input: 2200, output: 860, total: 3060 },
      cost: 0.0245,
      latencyMillis: 8400,
      source: 'Auto fan-out',
      metadata: {},
    },
    {
      id: 'task-replay-failing-request',
      parentTaskId: 'task-query-render-logs',
      dependencyTaskIds: ['task-root-incident-triage', 'task-query-render-logs'],
      provider: 'OpenAI',
      model: 'gpt-5.4-mini',
      feature: 'Failure reproduction',
      requestType: 'Checkpoint branch',
      title: 'Replay failing request path with suspect auth payload',
      checkpointLabel: 'Checkpoint B - reproduce with narrowed payload',
      selectedByHuman: true,
      startedAt: '2026-09-05T22:19:10.000Z',
      completedAt: '2026-09-05T22:21:40.000Z',
      status: 'SUCCESS',
      tokens: { input: 3600, output: 980, total: 4580 },
      cost: 0.0721,
      latencyMillis: 16400,
      source: 'Manual approval',
      metadata: {},
    },
    {
      id: 'task-propose-fix',
      parentTaskId: 'task-replay-failing-request',
      dependencyTaskIds: ['task-replay-failing-request', 'task-database-compare'],
      provider: 'Anthropic',
      model: 'claude-sonnet-5',
      feature: 'Fix planning',
      requestType: 'Synthesis task',
      title: 'Draft fix options for null session token handling in auth middleware',
      checkpointLabel: null,
      selectedByHuman: false,
      startedAt: '2026-09-05T22:22:00.000Z',
      completedAt: '2026-09-05T22:24:58.000Z',
      status: 'SUCCESS',
      tokens: { input: 5400, output: 2100, total: 7500 },
      cost: 0.119,
      latencyMillis: 20100,
      source: 'Auto fan-in',
      metadata: {},
    },
    {
      id: 'task-validate-rollout',
      parentTaskId: 'task-propose-fix',
      dependencyTaskIds: ['task-propose-fix'],
      provider: 'Google',
      model: 'gemini-3.6-flash',
      feature: 'Rollout validation',
      requestType: 'Verification task',
      title: 'Prepare rollout checklist and smoke test coverage for the auth fix',
      checkpointLabel: null,
      selectedByHuman: false,
      startedAt: '2026-09-05T22:26:00.000Z',
      completedAt: null,
      status: 'IN_PROGRESS',
      tokens: { input: 6400, output: 5400, total: 11800 },
      cost: 0.053,
      latencyMillis: 45200,
      source: 'Auto continuation',
      metadata: {},
    },
  ],
};

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function normalizeString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function normalizeTokens(value: unknown): AIUsageTokenBreakdown {
  if (!isObjectRecord(value)) {
    return { input: 0, output: 0, total: 0 };
  }

  const input = normalizeNumber(value.input);
  const output = normalizeNumber(value.output);
  const total = normalizeNumber(value.total) || input + output;

  return {
    input,
    output,
    total,
  };
}

function normalizeRecord(record: unknown, index: number): AIUsageRecord | null {
  if (!isObjectRecord(record)) {
    return null;
  }

  const startedAt = normalizeString(record.startedAt, new Date(0).toISOString());
  const provider = normalizeString(record.provider, 'Unknown');
  const model = normalizeString(record.model, 'Unknown');

  return {
    id: normalizeString(record.id, `${provider}-${model}-${startedAt}-${index}`),
    parentTaskId: typeof record.parentTaskId === 'string' ? record.parentTaskId : null,
    dependencyTaskIds: Array.isArray(record.dependencyTaskIds)
      ? record.dependencyTaskIds.filter((dependencyId): dependencyId is string => typeof dependencyId === 'string')
      : [],
    provider,
    model,
    feature: normalizeString(record.feature, 'Unknown'),
    requestType: normalizeString(record.requestType, 'Unknown'),
    title: normalizeString(record.title, normalizeString(record.feature, 'AI task')),
    checkpointLabel: typeof record.checkpointLabel === 'string' ? record.checkpointLabel : null,
    selectedByHuman: Boolean(record.selectedByHuman),
    startedAt,
    completedAt: typeof record.completedAt === 'string' ? record.completedAt : null,
    status: normalizeString(record.status, 'UNKNOWN'),
    tokens: normalizeTokens(record.tokens),
    cost: normalizeNumber(record.cost),
    latencyMillis: normalizeNumber(record.latencyMillis),
    source: normalizeString(record.source, 'Unknown'),
    metadata: isObjectRecord(record.metadata) ? record.metadata : {},
  };
}

function buildSummaryFromRecords(records: AIUsageRecord[]): AIUsageSummary {
  const providerCount = new Set(records.map((record) => record.provider.trim()).filter(Boolean)).size;
  const lastUpdatedAt = records
    .map((record) => record.completedAt ?? record.startedAt)
    .filter(Boolean)
    .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0] ?? null;

  return {
    workflowTitle: 'AI workflow',
    totalRequests: records.length,
    totalTokens: records.reduce((sum, record) => sum + record.tokens.total, 0),
    totalCost: records.reduce((sum, record) => sum + record.cost, 0),
    activeRequests: records.filter((record) => {
      const normalizedStatus = record.status.toUpperCase();
      return normalizedStatus === 'RUNNING' || normalizedStatus === 'IN_PROGRESS' || normalizedStatus === 'PENDING';
    }).length,
    providers: providerCount,
    humanCheckpointCount: records.filter((record) => record.selectedByHuman).length,
    lastUpdatedAt,
  };
}

function normalizeSummary(summary: unknown, records: AIUsageRecord[]): AIUsageSummary {
  const fallbackSummary = buildSummaryFromRecords(records);

  if (!isObjectRecord(summary)) {
    return fallbackSummary;
  }

  return {
    workflowTitle: normalizeString(summary.workflowTitle, fallbackSummary.workflowTitle),
    totalRequests: normalizeNumber(summary.totalRequests) || fallbackSummary.totalRequests,
    totalTokens: normalizeNumber(summary.totalTokens) || fallbackSummary.totalTokens,
    totalCost: normalizeNumber(summary.totalCost) || fallbackSummary.totalCost,
    activeRequests: normalizeNumber(summary.activeRequests) || fallbackSummary.activeRequests,
    providers: normalizeNumber(summary.providers) || fallbackSummary.providers,
    humanCheckpointCount: normalizeNumber(summary.humanCheckpointCount) || fallbackSummary.humanCheckpointCount,
    lastUpdatedAt: typeof summary.lastUpdatedAt === 'string' ? summary.lastUpdatedAt : fallbackSummary.lastUpdatedAt,
  };
}

export function normalizeAIUsageResponse(data: unknown): AIUsageResponse {
  if (!isObjectRecord(data)) {
    return {
      summary: buildSummaryFromRecords([]),
      records: [],
    };
  }

  const records = Array.isArray(data.records)
    ? data.records.map((record, index) => normalizeRecord(record, index)).filter((record): record is AIUsageRecord => record !== null)
    : [];

  return {
    summary: normalizeSummary(data.summary, records),
    records,
  };
}

async function fetchAIUsage(): Promise<AIUsageResponse> {
  const response = await fetch(`${API_URL}/ai-usage`);
  if (!response.ok) {
    if (response.status === 404 || response.status >= 500) {
      return mockAIUsageResponse;
    }

    throw new Error(`Failed to load AI usage: API responded with ${response.status}`);
  }

  const data: unknown = await response.json();
  return normalizeAIUsageResponse(data);
}

export default function useAIUsage() {
  const { mutate: postAnalyticsRequest } = usePostAnalyticsRequest();
  const requestName = 'aiUsage';

  async function fetchAIUsageWithAnalytics(): Promise<AIUsageResponse> {
    const startedAt = Date.now();
    const result = await fetchAIUsage();
    postAnalyticsRequest(buildNetworkSuccessAnalyticsRequest(Date.now() - startedAt, requestName));
    return result;
  }

  return useQuery([requestName], fetchAIUsageWithAnalytics, {
    staleTime: 30_000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
