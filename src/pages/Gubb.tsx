import React, { JSX, useState } from 'react';
import TopNav from '../components/TopNav';
import GubbVideos from '../components/GubbVideos';
import useGubb from '../network/useGubb';
import '../styles/IntroHome.css';

function Gubb(): JSX.Element {
  const [url, setUrl] = useState('');
  const { mutate, data, error, isError, isSuccess, isLoading } = useGubb();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (url.trim()) {
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
            Gubb is a video downloading and sharing tool that uses yt-dlp to download videos. It currently only supports TikTok.
            It's for people whose names sound similar to Gubb who
          are too lazy to create a TikTok account to see the funny videos I send
          </p>
          <br/>
          <p>Sample URL: https://www.tiktok.com/@hunainn/video/7696938907090439444</p>
        </section>
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            placeholder="Enter a video URL"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            style={{ width: '100%', maxWidth: 500, padding: 8 }}
          />
          <button type="submit" disabled={isLoading} style={{ marginLeft: 8, padding: 8 }}>
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </form>
        {isSuccess && <pre style={{ whiteSpace: 'pre-wrap', marginTop: 16 }}>{data.url}</pre>}
        {isError && (
          <p style={{ color: 'red', marginTop: 16 }}>
            {error instanceof Error ? error.message : 'Request failed.'}
          </p>
        )}
        <GubbVideos latestJobId={data?.jobId ?? null} />
      </main>
    </div>
  );
}

export default Gubb;
