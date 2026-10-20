import React, { JSX, useState } from 'react';
import TopNav from '../components/TopNav';
import GubbVideos from '../components/GubbVideos';
import GubbVideoCard from '../components/GubbVideoCard';
import useGubb from '../network/useGubb';
import useGubbVideos from '../hooks/useGubbVideos';
import '../styles/IntroHome.css';
import '../styles/Gubb.css';

function Gubb(): JSX.Element {
  const [url, setUrl] = useState('');
  const { mutate, data, error, isError, isLoading } = useGubb();
  const { videos, deletion } = useGubbVideos();

  const previewJobId = data?.jobId ?? null;
  const storedPreview = previewJobId ? videos.data?.find((video) => video.jobId === previewJobId) : undefined;
  const previewDeleted = deletion.isSuccess && deletion.variables === previewJobId;
  const previewUrl = storedPreview?.url ?? data?.url ?? null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (url.trim()) {
      deletion.reset();
      mutate(url);
    }
  };

  return (
    <div className="intro-home">
      <TopNav />
      <main className="container intro-main">
        <h1>Gubb</h1>
        <section aria-label="About Gubb">
          <p>
            Gubb is a video downloading and sharing tool that uses yt-dlp to download videos. It currently only supports TikTok. Converted
            videos delete automatically after 48 hours.
            It's for people whose names sound similar to Gubb who are too lazy to create a TikTok account to see the funny videos I send
          </p>
          <p className="gubb-muted">Sample URL: https://www.tiktok.com/@hunainn/video/7696938907090439444</p>
        </section>

        <section className="gubb-section" aria-labelledby="gubb-convert-heading">
          <h2 id="gubb-convert-heading">Convert a video</h2>
          <form className="gubb-form" onSubmit={handleSubmit}>
            <input
              type="url"
              placeholder="Enter a video URL"
              aria-label="Video URL"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Converting...' : 'Submit'}
            </button>
          </form>
          {isError && (
            <p role="alert">{error instanceof Error ? error.message : 'Request failed.'}</p>
          )}
        </section>

        <section className="gubb-section" aria-labelledby="gubb-preview-heading">
          <h2 id="gubb-preview-heading">Preview</h2>
          {isLoading && <p role="status">Downloading video, this can take a minute...</p>}
          {!isLoading && !previewUrl && <p className="gubb-muted">Submit a URL to preview the video here.</p>}
          {!isLoading && previewDeleted && <p>Video deleted.</p>}
          {!isLoading && previewUrl && !previewDeleted && (
            <>
              {deletion.isError && (
                <p role="alert">
                  {deletion.error instanceof Error ? deletion.error.message : 'Could not delete video.'}
                </p>
              )}
              <div className="gubb-preview">
                <GubbVideoCard
                  url={previewUrl}
                  jobId={storedPreview?.jobId}
                  sizeBytes={storedPreview?.sizeBytes}
                  storedAt={storedPreview?.storedAt}
                  expiresAt={storedPreview?.expiresAt}
                  deleteDisabled={deletion.isLoading}
                  isDeleting={deletion.isLoading}
                  onDelete={storedPreview ? () => deletion.mutate(storedPreview.jobId) : undefined}
                />
              </div>
            </>
          )}
        </section>

        <GubbVideos />
      </main>
    </div>
  );
}

export default Gubb;
