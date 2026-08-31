import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import AppFooter from '../components/AppFooter';
import Chatbot from '../components/Chatbot';
import '../styles/IntroHome.css';

function PortfolioHome(): JSX.Element {
  return (
    <div className="intro-home">
      <header className="intro-hero">
        <div className="container intro-hero-content">
          <p className="intro-eyebrow">Software Engineer Portfolio</p>
          <h1>Hi, I am Isaac.</h1>
          <p className="intro-copy">
            This site hosts my development portfolio. It contains a sample parking lot app,
            dashboard pages for functionality relevant to this site, and a RAG chatbot service
            trained on my information and background. All code for this project is open source
            and available on my GitHub profile.
          </p>
          <div className="intro-actions">
            <Link to="/dashboards" className="intro-primary-link">Dashboard Home</Link>
            <a
              data-analytics-id={"portfolio-resume-download"}
              href={`${process.env.PUBLIC_URL}/resume.pdf`}
              className="intro-secondary-link"
              download
            >
              Download resume
            </a>
            <a
              data-analytics-id={"portfolio-github-link"}
              href="https://github.com/IsaacMartin22"
              className="intro-secondary-link"
              target="_blank"
              rel="noreferrer"
            >
              View GitHub profile
            </a>
          </div>
        </div>
      </header>

      <main className="container intro-main">
          <section className="intro-grid intro-support-grid" aria-label="Chat">
            <article className="intro-card">
              <h3>Ask IsaacGPT</h3>
              <p style={{ marginTop: 12, marginBottom: 16, color: 'var(--las-muted)' }}>
                IsaacGPT answers recruiter and hiring-manager style questions using only Isaac's supplied context. You can ask about Isaac, this project, or more general recruiter questions (E.g. "What project is Isaac most proud of?"), and it will say when the needed context was not provided.
              </p>
              <Chatbot />
            </article>
          </section>
      </main>

      <AppFooter />
    </div>
  );
}

export default PortfolioHome;
