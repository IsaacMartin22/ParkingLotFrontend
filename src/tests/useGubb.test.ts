import { fetchGubb } from '../network/useGubb';
import { API_URL } from '../types/constants';
import { GubbResponse } from '../types/gubb';

const pending: GubbResponse = {
  url: null,
  jobId: 'job-1',
  status: 'pending',
  statusUrl: '/api/gubb/jobs/job-1',
  error: null,
};
const completed: GubbResponse = {
  ...pending,
  url: 'https://example.com/video.mp4',
  status: 'completed',
};

describe('Gubb polling', () => {
  const originalFetch = global.fetch;
  const realSetTimeout = setTimeout;
  const originalTimeout = Object.getOwnPropertyDescriptor(AbortSignal, 'timeout');
  const fetchMock = jest.fn();

  async function advancePoll() {
    await new Promise<void>((resolve) => realSetTimeout(resolve, 0));
    jest.advanceTimersByTime(1000);
  }

  function respond(status: number, data: unknown) {
    fetchMock.mockResolvedValueOnce({
      status,
      text: async () => JSON.stringify(data),
    });
  }

  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = fetchMock;
    Object.defineProperty(AbortSignal, 'timeout', {
      configurable: true,
      value: jest.fn(() => new AbortController().signal),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalTimeout) {
      Object.defineProperty(AbortSignal, 'timeout', originalTimeout);
    } else {
      Reflect.deleteProperty(AbortSignal, 'timeout');
    }
    fetchMock.mockReset();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('preserves the initial query and follows status URLs until HTTP 200', async () => {
    const nextStatusUrl = 'https://status.example.com/jobs/job-1';
    respond(202, pending);
    respond(202, { ...pending, statusUrl: nextStatusUrl });
    respond(200, completed);

    const result = fetchGubb(' https://example.com/watch?v=1&x=2 ');
    await advancePoll();
    await advancePoll();

    await expect(result).resolves.toEqual(completed);
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      `${API_URL}/gubb?url=${encodeURIComponent('https://example.com/watch?v=1&x=2')}`,
      new URL(pending.statusUrl, API_URL).href,
      nextStatusUrl,
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('returns an immediate HTTP 200 response without polling', async () => {
    respond(200, completed);

    await expect(fetchGubb('https://example.com')).resolves.toEqual(completed);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('surfaces backend failures during polling', async () => {
    respond(202, pending);
    respond(500, { message: 'Job failed' });

    const result = expect(fetchGubb('https://example.com')).rejects.toThrow('Gubb API responded with 500');
    await advancePoll();
    await result;
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('rejects pending responses without a polling URL', async () => {
    respond(202, { ...pending, statusUrl: null });

    await expect(fetchGubb('https://example.com')).rejects.toThrow('missing statusUrl');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('surfaces malformed JSON instead of returning success', async () => {
    fetchMock.mockResolvedValueOnce({ status: 202, text: async () => 'invalid JSON' });

    await expect(fetchGubb('https://example.com')).rejects.toThrow(SyntaxError);
  });

  it('rejects completed responses without a result URL', async () => {
    respond(200, { ...completed, url: null });

    await expect(fetchGubb('https://example.com')).rejects.toThrow('without a result URL');
  });

  it('surfaces response error details', async () => {
    respond(200, { ...completed, error: 'Download failed' });

    await expect(fetchGubb('https://example.com')).rejects.toThrow('Download failed');
  });
});
