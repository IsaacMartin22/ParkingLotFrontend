import React, { useState } from 'react';
import useGubbVideos from '../hooks/useGubbVideos';
import '../styles/Gubb.css';

function formatDate(value: string | null): string {
  return value ? new Date(value).toLocaleString() : 'Not available';
}

type GubbVideosProps = {
  latestJobId: string | null;
};

export default function GubbVideos({ latestJobId }: GubbVideosProps) {
  const { videos, deletion } = useGubbVideos();
  const [showAllForJobId, setShowAllForJobId] = useState<string | null>(null);
  const currentJobKey = latestJobId ?? '';
  const showAll = showAllForJobId === currentJobKey;
  const latestVideo = videos.data?.filter((video) => video.jobId === latestJobId) ?? [];
  const displayedVideos = showAll ? videos.data : latestVideo;
  const hasHiddenVideos = (videos.data?.length ?? 0) > latestVideo.length;

  return (
    <section className="gubb-videos" aria-labelledby="gubb-videos-heading">
      <div className="gubb-videos-header">
        <h2 id="gubb-videos-heading">Stored videos</h2>
        <button
          type="button"
          aria-label="Refresh stored videos"
          disabled={videos.isFetching}
          onClick={() => videos.refetch()}
        >
          Refresh
        </button>
        {hasHiddenVideos && (
          <button
            type="button"
            aria-label="Toggle other videos"
            onClick={() => setShowAllForJobId(showAll ? null : currentJobKey)}
          >
            {showAll ? 'Hide other videos' : 'Show all videos'}
          </button>
        )}
      </div>
      <p>Up to 20 non-expired videos available to stream.</p>
      {videos.isLoading && <p role="status">Loading stored videos...</p>}
      {videos.isError && (
        <p role="alert">
          {videos.error instanceof Error ? videos.error.message : 'Could not load stored videos.'}
        </p>
      )}
      {deletion.isError && (
        <p role="alert">
          {deletion.error instanceof Error ? deletion.error.message : 'Could not delete video.'}
        </p>
      )}
      {videos.isSuccess && videos.data.length === 0 && <p>No streamable videos on disk.</p>}
      {videos.isSuccess && videos.data.length > 0 && latestVideo.length === 0 && !showAll && (
        <p>No stored video matches the latest conversion.</p>
      )}
      <ul className="gubb-video-list">
        {displayedVideos?.map((video) => (
          <li key={video.jobId} className="gubb-video">
            <video
              className="gubb-video-player"
              src={video.url}
              controls
              playsInline
              preload="metadata"
              aria-label="Stored video player"
            />
            <dl>
              <dt>Size</dt><dd>{video.sizeBytes.toLocaleString()} bytes</dd>
              <dt>Stored</dt><dd>{formatDate(video.storedAt)}</dd>
              <dt>Expires</dt><dd>{formatDate(video.expiresAt)}</dd>
            </dl>
            <div className="gubb-video-actions">
              <a href={video.url} target="_blank" rel="noopener noreferrer">
                Link
              </a>
              <button
                type="button"
                aria-label={`Delete video ${video.jobId}`}
                disabled={deletion.isLoading}
                onClick={() => {
                  if (window.confirm(`Delete video ${video.jobId} from disk? This cannot be undone.`)) {
                    deletion.mutate(video.jobId);
                  }
                }}
              >
                {deletion.isLoading && deletion.variables === video.jobId ? 'Deleting...' : 'Delete video'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
