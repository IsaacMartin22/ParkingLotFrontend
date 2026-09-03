import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import AppFooter from '../components/AppFooter';
import {
  API_GITHUB,
  CARD_GAME_GITHUB,
  FRONTEND_GITHUB,
  ISAAC_EMAIL,
  ISAAC_GITHUB,
  ISAAC_LINKEDIN, SDK_GITHUB
} from '../types/constants';
import '../styles/IntroHome.css';

function Projects(): JSX.Element {
  return (
    <div className="intro-home">
      <nav className="intro-top-nav" aria-label="Portfolio sections">
        <Link to="/" className="intro-top-nav-link intro-top-nav-brand">Isaac Martin</Link>
        <div className="intro-top-nav-links">
          <Link to="/projects" className="intro-top-nav-link">Projects</Link>
          <Link to="/infrastructure" className="intro-top-nav-link">Infrastructure</Link>
          <a href={`${process.env.PUBLIC_URL}/resume.pdf`} className="intro-top-nav-link" download>
            Resume
          </a>
        </div>
      </nav>
      <section className="intro-header-bar" aria-label="Projects overview" />
      <main className="container intro-main">
        <div className="intro-content-layout">
          <section className="intro-copy-block">
            <h1>Projects</h1>
            <h2>Selected Work</h2>
            <div className="projects-list">
              <article className="projects-item">
                <div className="projects-item-header">
                  <h3>Portfolio Site</h3>
                  <a href={FRONTEND_GITHUB} target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
                <p className="projects-item-timeline">Java, Typescript, React</p>
                <ul className="projects-item-list">
                  <li>Built multiple services and repositories from the ground up - <a href={FRONTEND_GITHUB} target="_blank" rel="noopener noreferrer">Frontend</a>, <a href={API_GITHUB} target="_blank" rel="noopener noreferrer">Backend</a>, <a href={SDK_GITHUB} target="_blank" rel="noopener noreferrer">SDK</a>,
                    relational database, NoSQL vector search database, and integrations</li>
                  <li>Built a parking lot application that pushes live updates to clients with server-sent events - <a href={`${process.env.PUBLIC_URL}/parking-lots`} target="_blank" rel="noopener noreferrer">Interactive Demo</a></li>
                  <li>Collected analytics to evaluate user interaction with the site</li>
                  <li>Created an RAG-powered portfolio chatbot that used vector search to facilitate recruiter information retrieval</li>
                  <li>Integrated external APIs and technologies including Render, Buildkite, Sumologic, OpenAI, PostgreSQL, and MongoDB</li>
                  <li>Established common artifacts shared between the service and SDK and published modules to Maven using semantic versioning</li>
                  <li>Released a public SDK for programmatic interaction with backend endpoints</li>
                </ul>
              </article>

              <article className="projects-item">
                <div className="projects-item-header">
                  <h3>libGDX Card Game</h3>
                  <a href={CARD_GAME_GITHUB} target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
                <p className="projects-item-timeline">Java</p>
                <ul className="projects-item-list">
                  <li>Built a playable card-battle prototype in libGDX with a focus on clean game-state flow, turn logic, and player interactions</li>
                  <li>Explored 2D and 3D rendering and scene composition to create a more polished game presentation</li>
                  <li>Designed gameplay systems for cards, effects, and decision-making while keeping the architecture maintainable</li>
                  <li>Implemented dynamic asset loading and unloading to keep the game responsive</li>
                  <li>Optimized memory usage and screen transitions to improve stability and reduce jank</li>
                </ul>
              </article>

              <article className="projects-item">
                <div className="projects-item-header">
                  <h3>Work</h3>
                  <p>Private</p>
                </div>
                <p className="projects-item-timeline">Java</p>
                <ul className="projects-item-list">
                  <li>Automated a manual support process by implementing full-stack self-service functionality for end users</li>
                  <li>Added snackbar error messaging to reduce database load and improve the user experience</li>
                  <li>Expanded API coverage for internal and external APIs and SDKs by creating new Spring Boot endpoints</li>
                  <li>Resolved several critical defects and thousands of lower-severity defects over my tenure at Widen</li>
                </ul>
              </article>

              <article className="projects-item">
                <div className="projects-item-header">
                  <h3>Open Source Contributions</h3>
                  <a href={ISAAC_GITHUB} target="_blank" rel="noopener noreferrer">GitHub (Forks)</a>
                </div>
                <p className="projects-item-timeline">CSS, Typescript</p>
                <ul className="projects-item-list">
                  <li>Contributed to Lichess, the community-driven chess website</li>
                  <li>Worked on Hiring-agent, HackerRank's open-source AI resume evaluator</li>
                  <li>Open-sourced my other projects, including Portfolio Frontend, Portfolio Backend, Portfolio SDK, and the libGDX card game</li>
                </ul>
              </article>


            </div>
          </section>
        </div>
      </main>
      <AppFooter
        links={[
          {
            href: ISAAC_GITHUB,
            label: '',
            ariaLabel: 'Open GitHub repository',
          },
          {
            href: ISAAC_LINKEDIN,
            label: '',
            ariaLabel: 'Open LinkedIn',
          },
          {
            href: ISAAC_EMAIL,
            label: '',
            ariaLabel: 'Send email to Isaac Martin',
          },
        ]}
      />
    </div>
  );
}

export default Projects;
