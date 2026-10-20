import React, { JSX } from 'react';
import PortfolioFooter from '../components/PortfolioFooter';
import TopNav from '../components/TopNav';
import {
  API_GITHUB,
  CARD_GAME_GITHUB,
  FRONTEND_GITHUB,
  ISAAC_GITHUB,
  SDK_GITHUB
} from '../types/constants';
import '../styles/IntroHome.css';

function Projects(): JSX.Element {
  return (
    <div className="intro-home projects-page">
      <TopNav />
      <section className="intro-header-bar" aria-label="Projects overview" />
      <main className="container intro-main">
        <div className="intro-content-layout">
          <section className="intro-copy-block">
            <h1>Projects</h1>
            <h2>Selected Work</h2>
            <p>
              Work responsibilities often take priority over what I would like to work on. I use personal projects
              to explore technologies and engineering problems that interest me.
              These projects give me an opportunity to independently make architectural decisions, experiment
              with new technologies, and build systems from initial design through deployment and operation.
            </p>

            <div className="projects-list">
              <article className="projects-item">
                <div className="projects-item-header">
                  <h3>Gubb</h3>
                  <a href={FRONTEND_GITHUB} target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
                <p className="projects-item-timeline">Java, yt-dlp</p>
                <ul className="projects-item-list">
                  <li>Video downloading and streaming tool. Currently supporting only TikTok, support for additional sites TBD</li>
                </ul>
              </article>

              <article className="projects-item">
                <div className="projects-item-header">
                  <h3>Portfolio Site</h3>
                  <a href={FRONTEND_GITHUB} target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
                <p className="projects-item-timeline">Java, Typescript, React</p>
                <ul className="projects-item-list">
                  <li>Full-stack system built from the ground up - <a href={FRONTEND_GITHUB} target="_blank" rel="noopener noreferrer">Frontend</a>, <a href={API_GITHUB} target="_blank" rel="noopener noreferrer">Backend</a>, <a href={SDK_GITHUB} target="_blank" rel="noopener noreferrer">SDK</a>,
                    PostgreSQL relational database, NoSQL MongoDB database
                  </li>
                  <li>Analytics to evaluate user interaction with the site</li>
                  <li>RAG-powered portfolio chatbot that uses vector search to facilitate recruiter information retrieval</li>
                  <li>Internal MCP for the RAG chatbot to access site analytics</li>
                  <li>API integrations with Render, Buildkite, and OpenAI</li>
                  <li>Established common module shared between the service and SDK and published artifacts to Maven using semantic versioning</li>
                </ul>
              </article>

              <article className="projects-item">
                <div className="projects-item-header">
                  <h3>libGDX Card Game</h3>
                  <a href={CARD_GAME_GITHUB} target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
                <p className="projects-item-timeline">Java</p>
                <ul className="projects-item-list">
                  <li>
                    A desktop card game inspired by Slay the Spire I built using Java and libGDX. Relevant concepts include
                    game state, UI interactions, dynamic asset loading and unloading, and 2d and 3d rendering.
                  </li>
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
                  <li>Worked on Hiring-agent, HackerRank's open-source AI resume parser and evaluator using PyMuPDF</li>
                  <li>Contributed to video.js, an open-source HTML5 video player</li>
                  <li>Open-sourced my other projects, including Portfolio Frontend, Portfolio Backend, Portfolio SDK, and the libGDX card game</li>
                </ul>
              </article>

            </div>
          </section>
        </div>
      </main>
      <PortfolioFooter />
    </div>
  );
}

export default Projects;
