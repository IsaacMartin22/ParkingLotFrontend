import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import AppFooter from '../components/AppFooter';
import '../styles/IntroHome.css';
import {API_GITHUB, SDK_GITHUB, FRONTEND_GITHUB, GITHUB_IO} from "../types/constants";

const technologies = [
  'React',
  'Java',
  'Spring Boot',
  'PostgreSQL',
  'TypeScript',
  'Java SDK',
  'Github Copilot'
];

const infrastructure = [
  'Docker',
  'Maven',
  'Sumologic',
  'Buildkite',
  'Render',
  'Trello',
];

const systemContributions = [
  {
    title: 'Frontend app',
    description:
      'Contains this site, the Parking frontend, and diagnostic dashboards for the Parking app\'s services.',
    link: FRONTEND_GITHUB,
  },
  {
    title: 'Java API backend',
    description:
      'CRUD Java API layer which provides parking info and diagnostics. Emits SSE events to keep client(s) up to date.',
    link: API_GITHUB,
  },
  {
    title: 'SDK',
    description:
      'Barebones Java application wrapping an SDK for the API. Used to programmatically interact with the API.',
    link: SDK_GITHUB,
  },
];

function PortfolioHome(): JSX.Element {
  return (
    <div className="intro-home">
      <header className="intro-hero">
        <div className="container intro-hero-content">
          <p className="intro-eyebrow">Software Engineer Portfolio</p>
          <h1>Hi, I am Isaac.</h1>
          <p className="intro-copy">
            This site hosts my development portfolio. It contains a sample parking lot app and
            hosts dashboard pages for functionality relevant to this site. The developer notes
            explains my thought process for each dashboard. All code for the project
            is open source and available on my GitHub profile.
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
        <section className="intro-grid intro-support-grid" aria-label="Project references and technologies">
          <article className="intro-card">
            <h3>Repositories</h3>
            <div className="intro-architecture-list">
              {systemContributions.map((contribution) => (
                <div key={contribution.title} className="intro-architecture-item">
                  <h4>{contribution.title}</h4>
                  <p>{contribution.description}</p>
                  <a href={contribution.link} target="_blank" rel="noreferrer" className="text-link">View on GitHub</a>
                </div>
              ))}
            </div>
          </article>

          <article className="intro-card">
            <h3>Experience</h3>
            <p>
              Fullstack software engineer with 5 years of experience working with SAAS web apps and services.
              Responsible for debugging improving, and modifying software serving thousands of businesses and millions of
              end users. Billions of requests and events worth of traffic generated daily. Experience addressing
              strain and pain points of distributed systems with global scale.
            </p>

            <br /> <br />

            <h3>Technologies</h3>
            <ul className="intro-tech-list">
              {technologies.map((technology) => (
                  <li key={technology} className="intro-tech-pill">{technology}</li>
              ))}
            </ul>

            <br/> <br />

            <h3>Infrastructure</h3>
            <ul className="intro-tech-list">
              {infrastructure.map((item) => (
                  <li key={item} className="intro-tech-pill">{item}</li>
              ))}
            </ul>
          </article>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}

export default PortfolioHome;
