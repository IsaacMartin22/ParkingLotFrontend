import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AboutMe.css';

function AboutMe(): JSX.Element {
  return (
    <div className="about-page">
      <header className="about-hero">
        <div className="container about-hero-content">
          <p className="about-eyebrow">Personal</p>
          <h1>About me</h1>
          <p className="about-copy">
            This is a miscellaneous autobiographical page for those who want a more general sense of my life.
            I'll put things like hobbies, interests, groups, and other personal information here.
          </p>
          <Link to="/" className="about-home-link">Back to portfolio home</Link>
        </div>
      </header>

      <main className="container about-main">
        <section className="about-section" aria-label="About me details">
          <h2>Overview</h2>
          <article className="about-card">
            <p>
              I run. I ran cross country in high school and running has been my preferred form of exercise ever since. I have a goal of being able to
              run under the "Elite" category for a larger city half marathon race, which would require a half marathon time of ~1:10 or better depending
              on the race. My current PR is 1:27:17 from the 2026 Eugene half marathon so I do still have a long way to go, but there's no penalty for
              shooting for the moon so I'm aiming high. <a href="https://results.laurelt.com/eug/results?pk=8792715" target="_blank" rel="noopener noreferrer">My 2026 Eugene Results</a>.
            </p>
            <p>
              I play flute. I played in middle school and high school but stopped in college. After moving to Las Vegas in 2023 I joined the UNLV Community
              Concert Band which has been around since 1987. The members of the band span many ages and nationalities, there are over 90 of us as of last
              term and the instructors and members are fantastic. We have one set performance per term but we additionally perform at various other charitable
              or community events members hear of or organize. It's a great way to be involved, it's a great skill to learn, it's affordable, and I look forward
              to practice every week.
            </p>
            <p>
              I read. Growing up I read almost exclusively fantasy and sci-fi,
            </p>
            <p>
              I play video games.
            </p>
          </article>
          <h2>Links</h2>
          <article className="about-card">
            <p>
              LinkedIn: <a href="https://www.linkedin.com/in/isaac-martin-22/" target="_blank" rel="noopener noreferrer">https://www.linkedin.com/in/isaac-martin-22/</a>
            </p>
            <p>
              GitHub: <a href="https://github.com/isaac-martin-22" target="_blank" rel="noopener noreferrer">https://github.com/isaac-martin-22</a>
            </p>
            <p>
              UNLV Community Concert band: <a href="https://www.unlv.edu/music/community-concert-band" target="_blank" rel="noopener noreferrer">https://www.unlv.edu/music/community-concert-band</a>
            </p>
          </article>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Isaac - Software Engineering Portfolio.</p>
      </footer>
    </div>
  );
}

export default AboutMe;
