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
            <Link to="/dev-notes" className="intro-secondary-link">Developer Notes</Link>
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
              <h3>Ask about this project</h3>
              <p style={{ marginTop: 12, marginBottom: 16, color: 'var(--las-muted)' }}>
                Have questions for Isaac? Try asking what Isaac's proudest accomplishment is or what technologies are used in this project below.
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
