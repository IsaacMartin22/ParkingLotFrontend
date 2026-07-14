import { useQuery } from '@tanstack/react-query';
import { BuildkiteBuildResponse, BuildkitePipeline } from '../types/buildkiteInfo';
import { API_URL } from '../types/constants';

function isBuildkitePipeline(value: unknown): value is BuildkitePipeline {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<BuildkitePipeline>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.slug === 'string'
  );
}

function toNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function validateBuildkiteInfo(response: unknown): BuildkiteBuildResponse {
  if (!response || typeof response !== 'object') {
    throw new Error(`Invalid buildkite info data: ${JSON.stringify(response)}`);
  }

  const parsed = response as Partial<BuildkiteBuildResponse>;

  if (typeof parsed.id !== 'string' || typeof parsed.state !== 'string') {
    throw new Error(`Invalid buildkite info data: ${JSON.stringify(response)}`);
  }

  return {
    id: parsed.id,
    number: typeof parsed.number === 'number' && Number.isFinite(parsed.number) ? parsed.number : null,
    state: parsed.state,
    blocked: Boolean(parsed.blocked),
    cancelReason: toNullableString(parsed.cancelReason),
    message: typeof parsed.message === 'string' ? parsed.message : '',
    commit: typeof parsed.commit === 'string' ? parsed.commit : '',
    branch: typeof parsed.branch === 'string' ? parsed.branch : '',
    source: typeof parsed.source === 'string' ? parsed.source : '',
    pipeline: isBuildkitePipeline(parsed.pipeline) ? parsed.pipeline : null,
    createdAt: toNullableString(parsed.createdAt),
    scheduledAt: toNullableString(parsed.scheduledAt),
    startedAt: toNullableString(parsed.startedAt),
    finishedAt: toNullableString(parsed.finishedAt),
  };
}

async function fetchBuildkiteInfo(): Promise<BuildkiteBuildResponse> {
  const res = await fetch(`${API_URL}/diagnostics/buildkite`);
  if (!res.ok) throw new Error(`API responded with ${res.status}`);

  const data: unknown = await res.json();
  return validateBuildkiteInfo(data);
}

export default function useBuildkiteInfo() {
  return useQuery(['buildkiteInfo'], fetchBuildkiteInfo, {
    staleTime: 30_000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
