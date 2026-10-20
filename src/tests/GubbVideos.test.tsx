import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GubbVideos from '../components/GubbVideos';
import { deleteGubbVideo, fetchGubbVideos } from '../hooks/useGubbVideos';
import { API_URL } from '../types/constants';
import { AdminVideo } from '../types/gubb';

const video: AdminVideo = {
  jobId: 'job-1',
  url: 'https://example.com/api/gubb/videos/job-1',
  statusUrl: null,
  path: '/videos/job-1.mp4',
  sizeBytes: 1024,
  storedAt: '2026-10-19T12:00:00Z',
  expiresAt: null,
  expired: false,
  jobStatus: null,
  jobUpdatedAt: null,
};

describe('stored Gubb videos', () => {
  const originalFetch = global.fetch;
  const actEnvironment = globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean };
  const originalActEnvironment = actEnvironment.IS_REACT_ACT_ENVIRONMENT;
  const fetchMock = jest.fn();
  let container: HTMLDivElement;
  let root: Root;
  let queryClient: QueryClient;

  beforeAll(() => {
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterAll(() => {
    if (originalActEnvironment === undefined) {
      delete actEnvironment.IS_REACT_ACT_ENVIRONMENT;
    } else {
      actEnvironment.IS_REACT_ACT_ENVIRONMENT = originalActEnvironment;
    }
  });

  function respond(body: unknown, status = 200) {
    fetchMock.mockResolvedValueOnce({
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
    });
  }

  async function waitFor(assertion: () => void) {
    for (let attempt = 0; attempt < 50; attempt++) {
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });
      try {
        assertion();
        return;
      } catch (error) {
        if (attempt === 49) throw error;
      }
    }
  }

  function renderVideos(latestJobId: string | null = video.jobId) {
    act(() => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <GubbVideos latestJobId={latestJobId} />
        </QueryClientProvider>
      );
    });
  }

  beforeEach(() => {
    global.fetch = fetchMock;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      logger: { log: console.log, warn: console.warn, error: () => {} },
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    queryClient.clear();
    global.fetch = originalFetch;
    fetchMock.mockReset();
    jest.restoreAllMocks();
  });

  it('filters unstreamable entries before limiting the list to 20 videos', async () => {
    const available = Array.from({ length: 25 }, (_, index) => ({
      ...video,
      jobId: `job-${index}`,
    }));
    respond([
      { ...video, expired: true },
      { ...video, url: ' ' },
      ...available,
    ]);

    await expect(fetchGubbVideos()).resolves.toEqual(available.slice(0, 20));
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/gubb/admin/videos`, { cache: 'no-store' });
  });

  it('rejects list failures and malformed list responses', async () => {
    respond(null, 403);
    await expect(fetchGubbVideos()).rejects.toThrow('HTTP 403');
    respond({});
    await expect(fetchGubbVideos()).rejects.toThrow('Invalid stored videos response');
  });

  it('encodes the video ID and accepts a bodyless deletion response', async () => {
    respond(undefined, 204);
    await expect(deleteGubbVideo('job/1')).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/gubb/admin/videos/job%2F1`, {
      method: 'DELETE',
    });
    respond(undefined, 500);
    await expect(deleteGubbVideo('job-1')).rejects.toThrow('HTTP 500');
  });

  it('embeds a player above the metadata without a UUID heading', async () => {
    respond([video]);
    renderVideos();
    await waitFor(() => expect(container.querySelectorAll('.gubb-video')).toHaveLength(1));

    const card = container.querySelector('.gubb-video')!;
    const player = card.querySelector('video')!;
    expect(card.firstElementChild).toBe(player);
    expect(player.className).toBe('gubb-video-player');
    expect(player.src).toBe(video.url);
    expect(player.controls).toBe(true);
    expect(player.playsInline).toBe(true);
    expect(player.preload).toBe('metadata');
    expect(card.querySelector('h3')).toBeNull();
    expect(card.textContent).not.toContain(video.jobId);
    expect(player.nextElementSibling?.tagName).toBe('DL');
    expect(card.querySelector('.gubb-video-actions')).not.toBeNull();
  });

  it('shows only the latest converted video until all videos are requested', async () => {
    const olderVideo = { ...video, jobId: 'job-0', url: 'https://example.com/older.mp4' };
    respond([olderVideo, video]);
    renderVideos(video.jobId);
    await waitFor(() => expect(container.querySelectorAll('.gubb-video')).toHaveLength(1));
    expect(container.querySelector('video')?.src).toBe(video.url);

    act(() => container.querySelector<HTMLButtonElement>('[aria-label="Toggle other videos"]')!.click());
    expect(container.querySelectorAll('.gubb-video')).toHaveLength(2);

    act(() => container.querySelector<HTMLButtonElement>('[aria-label="Toggle other videos"]')!.click());
    expect(container.querySelectorAll('.gubb-video')).toHaveLength(1);
    expect(container.querySelector('video')?.src).toBe(video.url);

    renderVideos(olderVideo.jobId);
    expect(container.querySelectorAll('.gubb-video')).toHaveLength(1);
    expect(container.querySelector('video')?.src).toBe(olderVideo.url);
  });

  it('hides stored videos until a conversion is selected, with an option to show all', async () => {
    respond([video]);
    renderVideos(null);
    await waitFor(() => expect(container.textContent).toContain('No stored video matches the latest conversion.'));
    expect(container.querySelectorAll('.gubb-video')).toHaveLength(0);

    act(() => container.querySelector<HTMLButtonElement>('[aria-label="Toggle other videos"]')!.click());
    expect(container.querySelectorAll('.gubb-video')).toHaveLength(1);
  });

  it('shows video metadata and refreshes the list after a confirmed deletion', async () => {
    respond([video]);
    renderVideos();
    await waitFor(() => expect(container.querySelectorAll('.gubb-video')).toHaveLength(1));
    expect(container.textContent).not.toContain(video.path);
    expect(container.textContent).not.toContain('Job details');
    expect(container.textContent).toContain('1,024 bytes');
    expect(container.querySelector('a')?.href).toBe(video.url);

    jest.spyOn(window, 'confirm').mockReturnValue(true);
    respond(undefined, 204);
    respond([]);
    act(() => container.querySelector<HTMLButtonElement>('[aria-label="Delete video job-1"]')!.click());

    await waitFor(() => expect(container.textContent).toContain('No streamable videos on disk.'));
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[1]).toEqual([
      `${API_URL}/gubb/admin/videos/job-1`,
      { method: 'DELETE' },
    ]);
  });

  it('does not delete when confirmation is cancelled', async () => {
    respond([video]);
    renderVideos();
    await waitFor(() => expect(container.querySelectorAll('.gubb-video')).toHaveLength(1));
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    act(() => container.querySelector<HTMLButtonElement>('[aria-label="Delete video job-1"]')!.click());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(container.querySelectorAll('.gubb-video')).toHaveLength(1);
  });

  it('shows a load error and allows a manual refresh', async () => {
    respond(undefined, 403);
    renderVideos();
    await waitFor(() => expect(container.querySelector('[role="alert"]')?.textContent).toContain('HTTP 403'));

    respond([video]);
    act(() => container.querySelector<HTMLButtonElement>('[aria-label="Refresh stored videos"]')!.click());
    await waitFor(() => expect(container.querySelectorAll('.gubb-video')).toHaveLength(1));
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  it('keeps the video visible and surfaces a failed deletion', async () => {
    respond([video]);
    renderVideos();
    await waitFor(() => expect(container.querySelectorAll('.gubb-video')).toHaveLength(1));
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    respond(undefined, 403);
    act(() => container.querySelector<HTMLButtonElement>('[aria-label="Delete video job-1"]')!.click());

    await waitFor(() => expect(container.querySelector('[role="alert"]')?.textContent).toContain('HTTP 403'));
    expect(container.querySelectorAll('.gubb-video')).toHaveLength(1);
  });
});
