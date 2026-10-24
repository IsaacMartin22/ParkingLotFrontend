import React, { JSX } from 'react';
import { useQuery } from '@tanstack/react-query';
import Chatbot from '../components/Chatbot';
import PortfolioFooter from '../components/PortfolioFooter';
import TopNav from '../components/TopNav';
import { fetchAvailableChatTools } from '../network/useSendChatMessage';
import '../styles/IntroHome.css';

function PortfolioHome(): JSX.Element {
  const availableTools = useQuery(['chatTools'], fetchAvailableChatTools, {
    staleTime: 5 * 60 * 1000,
  });

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
              Digital Asset Management industry - web applications, APIs, backend services, and cloud infrastructure. Java is my primary backend language,
              TypeScript and React are my preferred frontend technologies. I have extensive practical experience with AWS,
              including SQS and other services used to build and operate distributed systems, as well as Docker, Kubernetes, CI/CD, and SQL.
            </p>
            <p>
              I work with GitHub Copilot both professionally and personally to improve my productivity. Below is a RAG chatbot that I built
              using OpenAI. I understand, endorse, and use AI when it is well suited to the task at hand, and MCPs are a great way of integrating
              LLMs and restricting them to tasks they can handle well. My backend hosts an MCP server I have built, it provides the chatbot with
              access to the tools described below.
            </p>
            <p>
              <a href={`${process.env.PUBLIC_URL}/resume.pdf`} className="resume-link" download>
                Download my resume
              </a>
            </p>
            <section className="intro-tools" aria-labelledby="intro-tools-heading">
              <h2 id="intro-tools-heading">Tools the chatbot can use</h2>
              {availableTools.isLoading && <p role="status">Loading available tools...</p>}
              {availableTools.isError && <p role="alert">Available tools could not be loaded.</p>}
              {availableTools.data?.tools.length === 0 && <p>No tools are currently available.</p>}
              {availableTools.data && availableTools.data.tools.length > 0 && (
                <ul className="intro-tools-list">
                  {availableTools.data.tools.map((tool) => (
                    <li key={tool.name}>
                      <strong>{tool.name}</strong>
                      {tool.description && <p>{tool.description}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </section>

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
                'Playwright',
                'Docker',
                'Kubernetes',
                'Git',
                'CI/CD',
                'REST APIs',
                'RAG/MCPs',
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
