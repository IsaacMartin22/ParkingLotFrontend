import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { PAGE_VIEW_PING_URL, PAGE_PING_CACHE_TIME_MS } from '../types/constants';

async function sendPagePing(url: string, payload: Record<string, unknown>): Promise<void> {
  const body = JSON.stringify(payload);

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const beaconSent = navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));

    if (beaconSent) {
      return;
    }
  }

  await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
    keepalive: true,
  });
}

export default function usePageNavigationPing(pingUrl: string = PAGE_VIEW_PING_URL): void {
  const location = useLocation();
  const locationSignature = `${location.pathname}${location.search}${location.hash}`;

  useQuery({
    queryKey: ['page-navigation-ping', pingUrl, locationSignature],
    enabled: Boolean(pingUrl),
    queryFn: async () => {
      await sendPagePing(pingUrl, {
        path: location.pathname,
        search: location.search,
        hash: location.hash,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        timestamp: new Date().toISOString(),
      });

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

