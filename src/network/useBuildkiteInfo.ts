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

function validateBuildkiteInfo(response: unknown): BuildkiteBuildResponse[] {
  if (!Array.isArray(response)) {
    throw new Error(`Invalid buildkite info data: ${JSON.stringify(response)}`);
  }

  return response.map((item) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Invalid buildkite build item: ${JSON.stringify(item)}`);
    }

    const parsed = item as Partial<BuildkiteBuildResponse>;

    if (typeof parsed.id !== 'string') {
      throw new Error(`Invalid buildkite build item id: ${JSON.stringify(parsed)}`);
    }

    return {
      id: parsed.id,
      number: typeof parsed.number === 'number' && Number.isFinite(parsed.number) ? parsed.number : null,
      state: toNullableString(parsed.state),
      blocked: Boolean(parsed.blocked),
      cancel_reason: toNullableString(parsed.cancel_reason),
      message: toNullableString(parsed.message),
      commit: toNullableString(parsed.commit),
      branch: toNullableString(parsed.branch),
      source: toNullableString(parsed.source),
      pipeline: isBuildkitePipeline(parsed.pipeline) ? parsed.pipeline : null,
      created_at: toNullableString(parsed.created_at),
      scheduled_at: toNullableString(parsed.scheduled_at),
      started_at: toNullableString(parsed.started_at),
      finished_at: toNullableString(parsed.finished_at),
    };
  });
}

async function fetchBuildkiteInfo(): Promise<BuildkiteBuildResponse[]> {
  const res = await fetch(`${API_URL}/integrations/bk`);
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
