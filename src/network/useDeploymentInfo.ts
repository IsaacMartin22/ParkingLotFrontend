import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../types/constants';
import { Commit, Deploy, DeploymentResponse } from '../types/deploymentInfo';
import usePostAnalyticsRequest from './usePostAnalyticsRequest';
import { buildNetworkSuccessAnalyticsRequest } from './analyticsNetwork';

function isCommit(value: unknown): value is Commit {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<Commit>;

  return typeof candidate.id === 'string' && typeof candidate.message === 'string' && typeof candidate.createdAt === 'string';
}

function isDeploy(value: unknown): value is Deploy {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<Deploy>;

  return (
    typeof candidate.id === 'string' &&
    isCommit(candidate.commit) &&
    typeof candidate.status === 'string' &&
    typeof candidate.trigger === 'string' &&
    typeof candidate.startedAt === 'string' &&
    typeof candidate.finishedAt === 'string' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.updatedAt === 'string'
  );
}

function validateDeploymentInfo(response: unknown): DeploymentResponse[] {
  if (!Array.isArray(response)) {
    throw new Error(`Invalid deployment info data: ${JSON.stringify(response)}`);
  }

  return response.map((item) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Invalid deployment item: ${JSON.stringify(item)}`);
    }

    const parsed = item as Partial<DeploymentResponse>;

    if (!isDeploy(parsed.deploy)) {
      throw new Error(`Invalid deployment item deploy: ${JSON.stringify(parsed)}`);
    }

    if (typeof parsed.cursor !== 'string') {
      throw new Error(`Invalid deployment item cursor: ${JSON.stringify(parsed)}`);
    }

    return {
      deploy: parsed.deploy,
      cursor: parsed.cursor,
    };
  });
}

async function fetchDeploymentInfo(): Promise<DeploymentResponse[]> {
  const res = await fetch(`${API_URL}/integrations/deploy`);
  if (!res.ok) throw new Error(`API responded with ${res.status}`);

  const data: unknown = await res.json();
  return validateDeploymentInfo(data);
}

export default function useDeploymentInfo() {
  const { mutate: postAnalyticsRequest } = usePostAnalyticsRequest();
  const requestName = 'deploymentInfo';

  async function fetchDeploymentInfoWithAnalytics(): Promise<DeploymentResponse[]> {
    const startedAt = Date.now();
    const result = await fetchDeploymentInfo();
    postAnalyticsRequest(buildNetworkSuccessAnalyticsRequest(Date.now() - startedAt, requestName));
    return result;
  }

  return useQuery([requestName], fetchDeploymentInfoWithAnalytics, {
    staleTime: 30_000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
