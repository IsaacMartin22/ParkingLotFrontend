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
            label: 'GitHub',
            ariaLabel: 'Open GitHub profile',
          },
          {
            href: ISAAC_LINKEDIN,
            label: 'LinkedIn',
            ariaLabel: 'Open LinkedIn profile',
          },
          {
            href: ISAAC_EMAIL,
            label: 'Email',
            ariaLabel: 'Send email to Isaac Martin',
          },
        ]}
      />
    </div>
  );
}

export default PortfolioHome;
