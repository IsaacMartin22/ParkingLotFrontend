import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import AppFooter from '../components/AppFooter';
import {
  API_GITHUB,
  CARD_GAME_GITHUB,
  FRONTEND_GITHUB,
  ISAAC_EMAIL,
  ISAAC_GITHUB,
  ISAAC_LINKEDIN
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
                  <li>Parking lot application using server sent events to keep update clients in real time - <a href={`${process.env.PUBLIC_URL}/parking-lots`} target="_blank" rel="noopener noreferrer">Interactive Demo</a></li>
                  <li>Analytics collection for analyzing user interaction with the site</li>
                  <li>RAG portfolio chatbot with vector searching to facilitate information retrieval for recruiters</li>
                  <li>Integrations with external APIs and technologies - Render, Buildkite, Sumologic, OpenAI, PostgreSQL, MongoDB</li>
                  <li>Maven published common artifacts</li>
                  <li>Public SDK for programmatic interaction with backend endpoints</li>
                </ul>
              </article>

              <article className="projects-item">
                <div className="projects-item-header">
                  <h3>libGDX Card Game</h3>
                  <a href={CARD_GAME_GITHUB} target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
                <p className="projects-item-timeline">Java</p>
                <ul className="projects-item-list">
                  <li>2d and 3d rendering and modeling</li>
                  <li>Dynamic asset loading and unloading</li>
                  <li>Memory management, screen management</li>
                </ul>
              </article>

              {/*<article className="projects-item">*/}
              {/*  <div className="projects-item-header">*/}
              {/*    <h3>Minecraft Mod</h3>*/}
              {/*    <a href={CARD_GAME_GITHUB} target="_blank" rel="noopener noreferrer">GitHub</a>*/}
              {/*  </div>*/}
              {/*  <p className="projects-item-timeline">Java</p>*/}
              {/*  <ul className="projects-item-list">*/}
              {/*    <li>2d and 3d rendering and modeling</li>*/}
              {/*    <li>Dynamic asset loading and unloading</li>*/}
              {/*    <li>Memory management, screen management</li>*/}
              {/*  </ul>*/}
              {/*</article>*/}

              <article className="projects-item">
                <div className="projects-item-header">
                  <h3>Open Source Contributions</h3>
                  <a href={ISAAC_GITHUB} target="_blank" rel="noopener noreferrer">GitHub (Forks)</a>
                </div>
                <p className="projects-item-timeline">CSS, Typescript</p>
                <ul className="projects-item-list">
                  <li>Lichess - Community driven Chess website</li>
                  <li>Hiring-agent - HackerRank's open source AI Resume evaluator</li>
                </ul>
              </article>
            </div>
          </section>
          <aside className="intro-sidebar">
            <section className="intro-experience-column" aria-label="Project details">
              <h2>Project Fields</h2>
              <div className="intro-experience-list">
                <article className="intro-experience-item">
                  <h3>Description</h3>
                  <p>Short summary of the project.</p>
                </article>
                <article className="intro-experience-item">
                  <h3>GitHub</h3>
                  <p>Link to the repository.</p>
                </article>
                <article className="intro-experience-item">
                  <h3>Timeline</h3>
                  <p>Start and end dates.</p>
                </article>
              </div>
            </section>
          </aside>
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
