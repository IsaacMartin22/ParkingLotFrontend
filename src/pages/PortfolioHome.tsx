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
              I'm a full stack software engineer with experience building out web apps, services, APIs, and infrastructure.
              I'm familiar with microservices architecture, AWS, and a variety of AWS services. I've used AWS SQS
              for event messaging when working with microservices - it's something like Kafka. I'm best with Java for the backend
              and Typescript for the frontend but I have worked with many other languages and frameworks - Python, C++, React,
              Angular, Node.js, and Spring Boot to name a few. I am experienced in both relational and non-relational databases.
            </p>
            <p>
              I have experience with Docker containerization, Kubernetes, version control, CI/CD pipelines, automated testing, logging,
              and monitoring. I've scaled services both vertically and horizontally to adjust to increased loads, analyzed performance
              bottlenecks for struggling services and databases and made targeted improvements.
            </p>
            <p>
              I've been on the front line for debugging critical "All hands on deck" production outages and been the one to implement
              a hotfix to stabilize product functionality. I've also resolved thousands of lower severity defects and worked cross
              collaboratively with product and support to implement new features and improve existing features. In one instance
              I single handedly automated a manual support process by implementing self service functionality for end users.
            </p>
            <p>
              I work with Github Copilot both professionally and personally to improve my productivity. The bottom of this page
              provides a RAG chatbot integrating with OpenAI built by me - I know and endorse AI's capabilities when there are tasks in
              which it can shine. Synthesizing known information is one of those tasks so I've prepped it with my resume and a good
              chunk of hand written answers for common recruiter questions, it should be able to answer common questions.
            </p>
            <p>

            </p>
          </section>
          <aside className="intro-sidebar">
            <section className="intro-experience-column" aria-label="Work experience">
              <h2>Work Experience</h2>
              <div className="intro-experience-list">
                <article className="intro-experience-item">
                  <h3>Software Engineer</h3>
                  <p className="intro-experience-company">Widen, an Acquia Company</p>
                  <p className="intro-experience-years">March 2024 - June 2026</p>
                  <p>Improve system performance, extend service API functionality, implement new features</p>
                </article>
                <article className="intro-experience-item">
                  <h3>Associate Software Engineer</h3>
                  <p className="intro-experience-company">Widen, an Acquia Company</p>
                  <p className="intro-experience-years">November 2021 - March 2024</p>
                  <p>Debug customer reported issues</p>
                </article>
              </div>
            </section>
            <section className="intro-experience-column" aria-label="Education">
              <h2>Education</h2>
              <div className="intro-experience-list">
                <article className="intro-experience-item">
                  <h3>B.S. in Computer Science</h3>
                  <p className="intro-experience-company">Oregon State University</p>
                  <p className="intro-experience-years">September 2018 - June 2021</p>
                  <p>3.68 GPA</p>
                </article>
              </div>
            </section>
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
