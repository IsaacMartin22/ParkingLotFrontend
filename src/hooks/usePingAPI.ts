import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { PAGE_VIEW_PING_URL, PAGE_PING_CACHE_TIME_MS } from '../types/constants';

async function sendPagePing(url: string): Promise<void> {
  await fetch(url, {
    method: 'GET',
    keepalive: true,
  });
}

export default function usePingAPI(pingUrl: string = PAGE_VIEW_PING_URL): void {
  const location = useLocation();
  const locationSignature = `${location.pathname}${location.search}${location.hash}`;

  useQuery({
    queryKey: ['page-navigation-ping', pingUrl, locationSignature],
    enabled: Boolean(pingUrl),
    queryFn: async () => {
      await sendPagePing(pingUrl);

      return locationSignature;
    },
    staleTime: PAGE_PING_CACHE_TIME_MS,
    cacheTime: PAGE_PING_CACHE_TIME_MS,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
}

