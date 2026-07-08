import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import '../styles/IntroHome.css';
import { API_GITHUB, EVENT_GENERATOR_GITHUB, FRONTEND_GITHUB } from "../types/constants";

const technologies = [
  'React',
  'TypeScript',
  'Java',
  'Spring Boot',
  'PostgreSQL',
  'Buildkite',
  'Docker',
  'Maven',
  'Java SDK',
  'Render',
  'Github Copilot'
];

const libraries = [
  'TanStack Query',
  'Lombok',
  'Micrometer',
  'Jest',
  'Flyway',
];

const systemContributions = [
  {
    title: 'Frontend app',
    description:
      'This repository hosts this site along with the Parking app frontend: routing, app frontend, data hooks, and diagnostic dashboards.',
    link: FRONTEND_GITHUB,
  },
  {
    title: 'Java API backend',
    description:
      'A CRUD Java API layer which provides parking info and diagnostics. Emits SSE events on parking lot changes to keep the frontend up to date in real time.',
    link: API_GITHUB,
  },
  {
    title: 'Event generation',
    description:
      'A barebones Java application that wraps an SDK for the API. Can be cloned and run to simulate parking lot events.',
    link: EVENT_GENERATOR_GITHUB,
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
            This site's purpose is to show my competency as a Software Engineer.
            It hosts my development portfolio which includes the frontend of a parking
            lot application themed for the LAS airport, which is where I live. It also
            hosts diagnostic pages for services this site relies on. The services can be
            accessed from the diagnostics pages on this site. All my code for this project
            is open source and available on my GitHub profile.
          </p>
          <div className="intro-actions">
            <Link to="/parking" className="intro-primary-link">Explore parking lot app</Link>
            <Link to="/blog" className="intro-secondary-link">Read my Development Blog</Link>
            <a
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
        <section className="intro-panel" aria-label="About Isaac">
          <h2>Parking Lot App Solution</h2>
          <p>
            While visiting the LAS airport, I noticed a handmade wooden "Parking Lot Full" sign displayed
            at a parking lot entrance. Despite the sign, several parking spaces were still available. Cars
            park and leave rapidly in an airport as large as LAS so such a sign will quickly become outdated.
          </p>
          <p>
            I realized a simple auto-updating website would be a better solution. LAS employees wouldn't have to manually
            place or update the sign and the information would be more reliable, which is a win-win for both customers and
            the airport. Updates will also be instantaneously reflected on the website. Because I have the skills I decided
            to attempt to take on this project. I documented my process in a blog, also on this site. I hope for this site
            to be a more practical resume for hiring managers to assess my competency as a developer.
          </p>
        </section>

        <section className="intro-grid intro-support-grid" aria-label="Project references and technologies">
          <article className="intro-card">
            <h3>System architecture</h3>
            <p>
              Other tools are involved with the hosting this site but there are 3 main apps/services responsible for the core functionality.
              All are created by me and are open source.
            </p>
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
            <h3>Powered by</h3>
            <p>
              A non-exhaustive list of technologies used in this project
            </p>
            <ul className="intro-tech-list">
              {technologies.map((technology) => (
                <li key={technology} className="intro-tech-pill">{technology}</li>
              ))}
            </ul>

            <br/><br/>

            <h3>Libraries</h3>
            <ul className="intro-tech-list">
              {libraries.map((library) => (
                  <li key={library} className="intro-tech-pill">{library}</li>
              ))}
            </ul>
          </article>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Isaac - Software Engineering Portfolio.</p>
      </footer>
    </div>
  );
}

export default PortfolioHome;

