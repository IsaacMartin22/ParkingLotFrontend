import React, { JSX } from 'react';
import AppFooter from '../components/AppFooter';
import Chatbot from '../components/Chatbot';
import { ISAAC_EMAIL, ISAAC_GITHUB, ISAAC_LINKEDIN } from '../types/constants';
import '../styles/IntroHome.css';

function PortfolioHome(): JSX.Element {
  return (
    <div className="intro-home">
      <nav className="intro-top-nav" aria-label="Portfolio sections">
        <a href="#projects" className="intro-top-nav-link">Projects</a>
        <a href="#infrastructure" className="intro-top-nav-link">Infrastructure</a>
        <a href={`${process.env.PUBLIC_URL}/resume.pdf`} className="intro-top-nav-link" download>
          Resume
        </a>
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
              My primary tech stack is Java, Typescript, React, and Spring Boot. I'm most familiar with AWS as a
              cloud provider, with AWS SQS as messaging and AWS RDS SQL as a relational database.
            </p>
            <p>

            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut aliquam sollicitudin leo. Cras iaculis
              ultricies nulla. Donec quis dui at dolor tempor interdum. Vivamus molestie gravida turpis. Fusce
              lobortis lorem at ipsum semper sagittis. Nam convallis pellentesque nisl.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer malesuada. In in enim a arcu
              imperdiet malesuada. Sed vel lectus. Donec odio urna, tempus molestie, porttitor ut, iaculis quis,
              sem. Phasellus rhoncus. Aenean id metus id velit ullamcorper pulvinar.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum fermentum tortor id mi.
              Pellentesque ipsum. Nulla non arcu lacinia neque faucibus fringilla. Nulla facilisi. Aenean nec
              eros. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.
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
