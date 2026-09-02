import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import AppFooter from '../components/AppFooter';
import Chatbot from '../components/Chatbot';
import { ISAAC_EMAIL, ISAAC_GITHUB, ISAAC_LINKEDIN } from '../types/constants';
import '../styles/IntroHome.css';

function PortfolioHome(): JSX.Element {
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
      <section className="intro-header-bar" aria-label="Portfolio introduction"/>
      <main className="container intro-main">
        <div className="intro-content-layout">
          <section className="intro-copy-block">
            <h1>Isaac Martin</h1>
            <h2>Software Engineer</h2>
            <p><b>Las Vegas, NV - Office/Hybrid/Remote - Open to relocation</b></p>
            <p></p>
            <p>
              I am a full-stack software engineer with experience building web applications, services, APIs, and infrastructure.
              I am familiar with microservices architecture and a variety of AWS services. I have used AWS SQS for event messaging
              when working with distributed systems, which has similarities with Kafka. Java is my preferred backend language,
              TypeScript and React are my preferred frontend, and SQL is my preferred database query language. I have experience working
              with all of the technologies listed in the adjacent column.
            </p>
            <p>
              I've been on the front lines of debugging critical, "all-hands-on-deck" production outages and have implemented hotfixes
              to stabilize product functionality. I've also resolved thousands of lower-severity defects and worked cross-functionally
              with product and support teams to implement new features and improve existing functionality. In one instance, I single-handedly
              eliminated a manual support process by implementing self-service functionality.
            </p>
            <p>
              I work with GitHub Copilot both professionally and personally to improve my productivity. Below is a RAG chatbot that I built
              using OpenAI. I understand, endorse, and use AI when it is well suited to the task at hand. Synthesizing known information is
              one such task, so I've equipped the chatbot with my resume and a collection of hand-written answers to common
              behavioral questions (e.g., "What project are you most proud of?") via a MongoDB vector database.
            </p>
            <p>
            </p>
          </section>
          <aside className="intro-sidebar">
            <section className="intro-experience-column" aria-label="Work experience">
              <div className="intro-experience-list">
                <article className="intro-experience-item">
                  <h3>Software Engineer</h3>
                  <p className="intro-experience-company">Widen, an Acquia Company</p>
                  <p className="intro-experience-years">Mar 2024 - Jun 2026 (2.25 years)</p>
                </article>
                <article className="intro-experience-item">
                  <h3>Associate Software Engineer</h3>
                  <p className="intro-experience-company">Widen, an Acquia Company</p>
                  <p className="intro-experience-years">Nov 2021 - Mar 2024 (2.33 years)</p>
                </article>
              </div>
            </section>
            <section className="intro-experience-column" aria-label="Education">
              <div className="intro-experience-list">
                <article className="intro-experience-item">
                  <h3>B.S. in Computer Science</h3>
                  <p className="intro-experience-company">Oregon State University</p>
                  <p className="intro-experience-years">Sep 2018 - Jun 2021</p>
                </article>
              </div>
            </section>
            <div className="intro-skills-grid" aria-label="Skills">
              {[
                'Java',
                'TypeScript',
                'React',
                'Python',
                'C++',
                'Rust',
                'Spring Boot',
                'Node.js',
                'SQL',
                'NoSQL',
                'YAML',
                'Groovy',
                'AWS',
                'AWS SQS',
                'AWS S3',
                'DynamoDB',
                'Playwright',
                'Docker',
                'Kubernetes',
                'Git',
                'Buildkite',
                'REST APIs',
                'RAG',
                'Sumologic',
                'Jest',
                'JUnit',
                'HTML',
                'CSS',
                'JavaScript',
                'Grafana',
              ].map((skill) => (
                <span key={skill} className="intro-skill-box">{skill}</span>
              ))}
            </div>
          </aside>
        </div>
      </main>
      <Chatbot />
      <AppFooter
        links={[
          {
            href: ISAAC_GITHUB,
            label: '',
            ariaLabel: 'Open GitHub repository',
            icon: (
              <svg viewBox="0 0 16 16" width="64" height="64" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M8 0C3.58 0 0 3.65 0 8.15c0 3.6 2.29 6.64 5.47 7.72.4.08.55-.18.55-.39 0-.2-.01-.84-.01-1.53-2.23.49-2.7-.97-2.7-.97-.36-.95-.9-1.2-.9-1.2-.73-.51.06-.5.06-.5.81.06 1.24.85 1.24.85.72 1.26 1.88.9 2.34.69.07-.53.28-.9.5-1.1-1.78-.21-3.65-.91-3.65-4.05 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84a7.45 7.45 0 0 1 4 0c1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.3.82 2.19 0 3.15-1.88 3.83-3.67 4.04.29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.14.48.55.39A8.17 8.17 0 0 0 16 8.15C16 3.65 12.42 0 8 0Z"
                />
              </svg>
            ),
          },
          {
            href: ISAAC_LINKEDIN,
            label: '',
            ariaLabel: 'Open LinkedIn',
            icon: (
              <svg viewBox="0 0 24 24" width="64" height="64" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.48 1h.02C3.87 1 4.98 2.12 4.98 3.5ZM.5 8h4V23h-4V8Zm7 0h3.84v2.05h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14V23h-4v-7.66c0-1.83-.03-4.19-2.55-4.19-2.56 0-2.95 2-2.95 4.06V23h-3.98V8Z"
                />
              </svg>
            ),
          },
          {
            href: ISAAC_EMAIL,
            label: '',
            ariaLabel: 'Send email to Isaac Martin',
            icon: (
              <svg viewBox="0 0 32 24" width="64" height="64" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M3.5 4.5A2.5 2.5 0 0 1 6 2h20a2.5 2.5 0 0 1 2.5 2.5v15A2.5 2.5 0 0 1 26 22H6a2.5 2.5 0 0 1-2.5-2.5v-15Zm2.73.5L16 12.02 25.77 5H6.23Zm19.27 1.82-8.63 6.2a1.5 1.5 0 0 1-1.74 0L6.5 6.82V19h19V6.82Z"
                />
              </svg>
            ),
          },
        ]}
      />
    </div>
  );
}

export default PortfolioHome;
