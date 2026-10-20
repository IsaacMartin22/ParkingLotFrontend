import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gubbVideosQueryKey } from '../hooks/useGubbVideos';
import { API_URL } from '../types/constants';
import { GubbResponse } from '../types/gubb';

export async function fetchGubb(url: string): Promise<GubbResponse> {
  let requestUrl = `${API_URL}/gubb?url=${encodeURIComponent(url.trim())}`;

  while (true) {
    const res = await fetch(requestUrl, {
      signal: AbortSignal.timeout(120_000),
    });
    const body = await res.text();

    if (res.status !== 200 && res.status !== 202) {
      throw new Error(`Gubb API responded with ${res.status}${body ? `: ${body}` : ''}`);
    }

    const data: GubbResponse = JSON.parse(body);
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid Gubb response.');
    }
    if (data.error) {
      throw new Error(data.error);
    }
    if (res.status === 200) {
      if (typeof data.url !== 'string' || !data.url.trim()) {
        throw new Error('Gubb completed without a result URL.');
      }
      return data;
    }
    if (typeof data.statusUrl !== 'string' || !data.statusUrl.trim()) {
      throw new Error('Gubb pending response is missing statusUrl.');
    }

    requestUrl = new URL(data.statusUrl, requestUrl).href;
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  }
}

export default function useGubb() {
  const queryClient = useQueryClient();
  return useMutation((url: string) => fetchGubb(url), {
    onSuccess: () => queryClient.invalidateQueries(gubbVideosQueryKey),
  });
}
