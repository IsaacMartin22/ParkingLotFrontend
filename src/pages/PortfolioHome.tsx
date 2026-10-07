import React, { JSX } from 'react';
import Chatbot from '../components/Chatbot';
import PortfolioFooter from '../components/PortfolioFooter';
import TopNav from '../components/TopNav';
import '../styles/IntroHome.css';

function PortfolioHome(): JSX.Element {
  return (
    <div className="intro-home">
      <TopNav />
      <section className="intro-header-bar" aria-label="Portfolio introduction"/>
      <main className="container intro-main">
        <div className="intro-content-layout">
          <section className="intro-copy-block">
            <h1>Isaac Martin</h1>
            <h2>Software Engineer</h2>
            <p><b>Las Vegas, NV - Office/Hybrid/Remote - Open to relocation</b></p>
            <p></p>
            <p>
              I am a full-stack software engineer with nearly five years of experience working on real-world production systems in the
              Digital Asset Management industry - web applications, APIs, backend services, cloud infrastructure, and media distribution services
              to name a few. Java is my primary backend language,
              TypeScript and React are my preferred frontend technologies. I have extensive practical experience with AWS,
              including SQS and other services used to build and operate distributed systems, as well as Docker, Kubernetes, CI/CD, and SQL.
            </p>
            <p>
              Most of my professional experience has been focused on understanding and improving existing production systems rather
              than simply building new features. I have investigated thousands of software defects (~IT-5000-IT-9000 in Jira during
              my time with Widen), participated in on-call rotations,
              responded to critical production incidents, implemented emergency fixes, and worked across the stack to diagnose problems
              involving application code, APIs, databases, infrastructure, and distributed systems. I have also designed and implemented
              new functionality when needed; for example, I independently built a
              full-stack self-service system that completely eliminated a manual support process.
            </p>
            <p>
              I work with GitHub Copilot both professionally and personally to improve my productivity. Below is a RAG chatbot that I built
              using OpenAI. I understand, endorse, and use AI when it is well suited to the task at hand. Synthesizing known information is
              one such task, so I've equipped the chatbot with my resume and a collection of hand-written answers to common
              behavioral questions (e.g., "What project are you most proud of?") via a MongoDB vector database.
            </p>
            <p>
              <a href={`${process.env.PUBLIC_URL}/resume.pdf`} className="resume-link" download>
                Download my resume
              </a>
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
                'Spring Boot',
                'Node.js',
                'SQL',
                'DAM',
                'AWS SQS',
                'AWS S3',
                'DynamoDB',
                'Playwright',
                'Docker',
                'Kubernetes',
                'Git',
                'CI/CD',
                'REST APIs',
                'RAG',
                'Sumologic',
                'Jest',
                'JUnit',
                'Grafana',
              ].map((skill) => (
                <span key={skill} className="intro-skill-box">{skill}</span>
              ))}
            </div>
          </aside>
        </div>
      </main>
      <Chatbot />
      <PortfolioFooter />
    </div>
  );
}

export default PortfolioHome;
