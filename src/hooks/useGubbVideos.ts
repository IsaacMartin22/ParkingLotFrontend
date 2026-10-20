import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../types/constants';
import { AdminVideo } from '../types/gubb';

export const gubbVideosQueryKey = ['gubbVideos'];

export async function fetchGubbVideos(): Promise<AdminVideo[]> {
  const res = await fetch(`${API_URL}/gubb/admin/videos`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Could not load stored videos: HTTP ${res.status}`);
  }

  const videos: AdminVideo[] = await res.json();
  if (!Array.isArray(videos)) {
    throw new Error('Invalid stored videos response.');
  }

  return videos.filter((video) => !video.expired && video.url?.trim()).slice(0, 20);
}

export async function deleteGubbVideo(jobId: string): Promise<void> {
  const res = await fetch(`${API_URL}/gubb/admin/videos/${encodeURIComponent(jobId)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Could not delete video: HTTP ${res.status}`);
  }
}

export default function useGubbVideos() {
  const queryClient = useQueryClient();
  const videos = useQuery(gubbVideosQueryKey, fetchGubbVideos);
  const deletion = useMutation(deleteGubbVideo, {
    onSuccess: () => queryClient.invalidateQueries(gubbVideosQueryKey),
  });

  return { videos, deletion };
}
