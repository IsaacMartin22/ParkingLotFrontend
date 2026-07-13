import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import '../styles/IntroHome.css';
import { API_GITHUB, SDK_GITHUB, FRONTEND_GITHUB } from "../types/constants";

const technologies = [
  'React',
  'TypeScript',
  'Java',
  'Spring Boot',
  'PostgreSQL',
  'Buildkite',
  'Docker',
  'Sumologic',
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
            This site hosts my development portfolio which includes the frontend of a parking
            lot application themed for the LAS airport, which is where I live. It also
            hosts diagnostic pages for services the parking app relies on. The services can be
            accessed from the diagnostics pages on this site. All my code for the project
            is open source and available on my GitHub profile.
          </p>
          <div className="intro-actions">
            <Link to="/parking" className="intro-primary-link" data-analytics-id={"portfolio-parking-link"}>Explore Parking Lots</Link>
            <Link to="/analytics" className="intro-secondary-link" data-analytics-id={"portfolio-analytics-link"}>View Site Analytics</Link>
            <Link to="/blog" className="intro-secondary-link" data-analytics-id={"portfolio-blog-link"}>Development Blog</Link>
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
        <section className="intro-panel" aria-label="About Isaac">
          <h2>Problem Statement</h2>
          <p>
            While visiting the LAS airport, I noticed a handmade wooden "Parking Lot Full" sign displayed
            at a parking lot entrance. Despite the sign, several parking spaces were still available. Cars
            park and leave rapidly in airports so such signs quickly become outdated.
          </p>
          <p>
            A simple auto-updating website would be a better solution for LAS. Employees wouldn't have to
            manually place the sign and the information would be reliable, which is a win-win for customers and
            the airport. Updates are also instantaneously reflected on the website. Because I have the skills I decided
            to take on this project. My blog on this site documents my process. This site should serve as a more
            practical resume for hiring managers assessing my competency as a developer.
          </p>
        </section>

        <section className="intro-grid intro-support-grid" aria-label="Project references and technologies">
          <article className="intro-card">
            <h3>System architecture</h3>
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
