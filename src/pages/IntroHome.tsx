import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import '../styles/IntroHome.css';

const poweredByTechnologies = [
  'React 18',
  'TypeScript',
  'TanStack Query',
  'CSS Components',
  'Java Spring Boot API',
  'PostgreSQL Database',
  'RabbitMQ',
  'Buildkite',
  'Docker',
  'Jest',
  'Playwright',
  'Grafana',
  'Render',
];

const systemContributions = [
  {
    title: 'Frontend application',
    description:
      'This repository hosts this site along with the Parking app frontend: routing, app frontend, data hooks, and diagnostic dashboards.',
    link: 'https://github.com/IsaacMartin22/ParkingLotFrontend',
  },
  {
    title: 'Java API backend',
    description:
      'A CRUD Java API layer which provides the parking lot and diagnostics endpoints that power the app\'s product and operational views.',
    link: 'https://github.com/IsaacMartin22/ParkingLotAPI',
  },
  {
    title: 'Event generation project',
    description:
      'A Java repository which uses a Maven published SDK and RabbitMQ to generate events that simulate expected parking lot behavior.',
    link: 'https://github.com/IsaacMartin22/ParkingLotEventGenerator',
  },
];

function IntroHome(): JSX.Element {
  return (
    <div className="intro-home">
      <header className="intro-hero">
        <div className="container intro-hero-content">
          <p className="intro-eyebrow">Software Engineer Portfolio</p>
          <h1>Hi, I am Isaac.</h1>
          <p className="intro-copy">
            This website's purpose is to show my competency as a Software Engineer.
            This site hosts my development portfolio which includes the frontend of a parking
            lot application themed for the LAS (Las Vegas) airport, which is where I live.
            It also hosts diagnostic pages for backend services this site relies on. Code
            for the backend services is open source and can be found on my GitHub profile.
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
            at an economy lot entrance. Despite the sign, several parking spaces were still available. The
            sign placement being a manual task meant the information was not trustworthy because it
            could quickly become outdated.
          </p>
          <p>
            I realized a simple auto-updating website would be a better solution. LAS employees wouldn't have to manually
            place or update the sign and the information would be more reliable, which is a win-win for both customers and
            the airport. Because I have the skills I decided to attempt to take on this project and document my process to
            essentially be a more practical resume for hiring managers to assess.
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
              A non-exhaustive list of technologies that power this site and the application, and others used for
              development infrastructure
            </p>
            <ul className="intro-tech-list">
              {poweredByTechnologies.map((technology) => (
                <li key={technology} className="intro-tech-pill">{technology}</li>
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

export default IntroHome;

