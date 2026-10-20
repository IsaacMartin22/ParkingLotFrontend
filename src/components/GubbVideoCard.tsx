import React from 'react';
import '../styles/Gubb.css';

function formatDate(value: string | null | undefined): string {
  return value ? new Date(value).toLocaleString() : 'Not available';
}

type GubbVideoCardProps = {
  url: string;
  jobId?: string;
  sizeBytes?: number;
  storedAt?: string;
  expiresAt?: string | null;
  isDeleting?: boolean;
  deleteDisabled?: boolean;
  onDelete?: () => void;
};

export default function GubbVideoCard({
  url,
  jobId,
  sizeBytes,
  storedAt,
  expiresAt,
  isDeleting = false,
  deleteDisabled = false,
  onDelete,
}: GubbVideoCardProps) {
  const hasMetadata = sizeBytes !== undefined || storedAt !== undefined || expiresAt !== undefined;

  return (
    <article className="gubb-video">
      <video
        className="gubb-video-player"
        src={url}
        controls
        playsInline
        preload="metadata"
        aria-label="Video player"
      />
      {hasMetadata && (
        <dl>
          {sizeBytes !== undefined && (
            <>
              <dt>Size</dt>
              <dd>{sizeBytes.toLocaleString()} bytes</dd>
            </>
          )}
          {storedAt !== undefined && (
            <>
              <dt>Stored</dt>
              <dd>{formatDate(storedAt)}</dd>
            </>
          )}
          {expiresAt !== undefined && (
            <>
              <dt>Expires</dt>
              <dd>{formatDate(expiresAt)}</dd>
            </>
          )}
        </dl>
      )}
      <div className="gubb-video-actions">
        <a href={url} target="_blank" rel="noopener noreferrer">
          Link
        </a>
        {onDelete && jobId && (
          <button
            type="button"
            aria-label={`Delete video ${jobId}`}
            disabled={deleteDisabled}
            onClick={() => {
              if (window.confirm(`Delete video ${jobId} from disk? This cannot be undone.`)) {
                onDelete();
              }
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
    </article>
  );
}
