import React, { useState } from 'react';
import GubbVideoCard from './GubbVideoCard';
import useGubbVideos from '../hooks/useGubbVideos';
import '../styles/Gubb.css';

export default function GubbVideos() {
  const { videos, deletion } = useGubbVideos();
  const [expanded, setExpanded] = useState(false);
  const count = videos.data?.length ?? 0;

  return (
    <section className="gubb-section" aria-labelledby="gubb-videos-heading">
      <div className="gubb-section-header">
        <h2 id="gubb-videos-heading">All videos{videos.isSuccess ? ` (${count})` : ''}</h2>
        <button
          type="button"
          aria-label="Toggle all videos"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Hide' : 'Show all videos'}
        </button>
        {expanded && (
          <button
            type="button"
            aria-label="Refresh stored videos"
            disabled={videos.isFetching}
            onClick={() => videos.refetch()}
          >
            {videos.isFetching ? 'Refreshing...' : 'Refresh'}
          </button>
        )}
      </div>
      <p className="gubb-muted">Up to 20 non-expired videos available to stream.</p>
      {expanded && (
        <>
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
          {videos.isSuccess && count === 0 && <p>No streamable videos on disk.</p>}
          <ul className="gubb-video-grid">
            {videos.data?.map((video) => (
              <li key={video.jobId}>
                <GubbVideoCard
                  url={video.url}
                  jobId={video.jobId}
                  sizeBytes={video.sizeBytes}
                  storedAt={video.storedAt}
                  expiresAt={video.expiresAt}
                  deleteDisabled={deletion.isLoading}
                  isDeleting={deletion.isLoading && deletion.variables === video.jobId}
                  onDelete={() => deletion.mutate(video.jobId)}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
