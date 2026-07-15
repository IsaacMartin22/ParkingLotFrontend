import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../types/constants';
import { DeploymentResponse } from '../types/deploymentInfo';
import usePostAnalyticsRequest from './usePostAnalyticsRequest';
import { buildNetworkSuccessAnalyticsRequest } from './analyticsNetwork';

function validateDeploymentInfo(response: unknown): DeploymentResponse[] {
  if (!Array.isArray(response)) {
    throw new Error(`Invalid deployment info data: ${JSON.stringify(response)}`);
  }

  return response.map((item) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Invalid deployment item: ${JSON.stringify(item)}`);
    }

    const parsed = item as Partial<DeploymentResponse>;

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
