import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import '../styles/IntroHome.css';

const poweredByTechnologies = [
  'React 18',
  'TypeScript',
  'TanStack Query',
  'Java Spring Boot API',
  'PostgreSQL Database',
  'RabbitMQ',
  'Component-based CSS architecture',
  '',
];

const systemContributions = [
  {
    title: 'Frontend application',
    description:
      'This repository delivers the evaluator-facing experience: routing, UI composition, data hooks, and dashboard workflows.',
    link: 'https://github.com/IsaacMartin22/ParkingLotFrontend',
  },
  {
    title: 'Java API backend',
    description:
      'A separate Java service provides the parking lot and diagnostics endpoints that power the app\'s product and operational views.',
    link: 'https://github.com/IsaacMartin22/ParkingLotAPI',
  },
  {
    title: 'Event generation project',
    description:
      'Another Java repository contributes event generation that helps simulate or drive changes across the parking system lifecycle.',
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
            This is my website. Its purpose is to show my competency as a Software Engineer.
            This site hosts the frontend of a parking lot application themed for the LAS (Las Vegas) airport, which is where I live.

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
          <h2>Parking Lot App</h2>
          <p>
            I encountered an issue my development skills allow me to solve. At the airport
            a handmade wooden "Parking Lot Full" sign was up. The sign was placed by hand and was not accurate,
            there were multiple parking spaces open. The task of placing the sign could be eliminated
            by the creation of a simple website with live updates.
          </p>
          <p>
            The result would be time and cost savings for the airport because an employee no longer has to place signs and it would
            also improve the customer experience by providing reliably up to date parking lot information.
          </p>
        </section>

        <section className="intro-grid" aria-label="Project highlights">
          <article className="intro-card">
            <h3>Parking lot application</h3>
            <p>
              Navigate lots, floors, sections, and occupancy details with API-backed pages and reusable components.
            </p>
            <Link to="/parking" className="intro-card-link">Open parking experience</Link>
          </article>

          <article className="intro-card">
            <h3>System perspective</h3>
            <p>
              The experience is intentionally presented as a connected system, showing how frontend, backend,
              persistence, and supporting services work together to deliver the parking application.
            </p>
          </article>

          <article className="intro-card">
            <h3>Engineering focus</h3>
            <p>
              Emphasis on readable code, typed contracts, practical UX, service integration, and maintainable
              patterns that scale from reusable UI components to diagnostic and infrastructure-oriented views.
            </p>
          </article>
        </section>

        <section className="intro-grid intro-support-grid" aria-label="Project references and technologies">
          <article className="intro-card">
            <h3>System architecture</h3>
            <p>
              The parking lot application reflects contributions across product UI, service APIs, persistence, and
              generated operational events.
            </p>
            <div className="intro-architecture-list">
              {systemContributions.map((contribution) => (
                <div key={contribution.title} className="intro-architecture-item">
                  <h4>{contribution.title}</h4>
                  <p>{contribution.description}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="intro-card">
            <h3>Powered by</h3>
            <p>
              The site and the larger application rely on a blend of frontend, backend, and data technologies that
              support routing, typed client code, API integration, persistence, and event-driven workflows.
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

