import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PAGE_VIEW_PING_URL } from '../types/constants';

const recentPings = new Map<string, number>();
const DEDUPE_WINDOW_MS = 1500;

function shouldSkipPing(signature: string): boolean {
  const now = Date.now();
  const lastPingAt = recentPings.get(signature);

  if (lastPingAt !== undefined && now - lastPingAt < DEDUPE_WINDOW_MS) {
    return true;
  }

  recentPings.set(signature, now);
  return false;
}

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

  useEffect(() => {
    if (!pingUrl) {
      return;
    }

    const signature = `${location.pathname}${location.search}${location.hash}`;

    if (shouldSkipPing(signature)) {
      return;
    }

    void sendPagePing(pingUrl, {
      path: location.pathname,
      search: location.search,
      hash: location.hash,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      timestamp: new Date().toISOString(),
    }).catch((error) => {
      console.warn('Page navigation ping failed', error);
    });
  }, [location.hash, location.pathname, location.search, pingUrl]);
}

