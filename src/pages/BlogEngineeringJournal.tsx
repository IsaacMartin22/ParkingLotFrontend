import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import '../styles/BlogStyles.css';

function Blog(): JSX.Element {
  return (
    <div className="blog-page">
      <header className="blog-hero">
        <div className="container blog-hero-content">
          <p className="blog-eyebrow">Engineering Journal</p>
          <h1>Developer Blog</h1>
          <p className="blog-copy">
            My development blog. Whenever I sit down to work on this site or the parking app I'm going to try
            to make an entry here. With AI becoming as
            sophisticated as it is documenting my development process could very well just wind up getting copy-pasted
            as AI prompt instructions. Who knows. Even if it doesn't I believe it will still help me become a
            developer by making my development decisions more intentional.
          </p>
          <Link to="/" className="blog-home-link">Back to portfolio home</Link>
        </div>
      </header>

      <main className="container blog-main">
        <section className="blog-entry-placeholder" aria-label="Future blog entries">
          <h2>Entries</h2>
          <article className="blog-entry-card">
            <p className="blog-entry-date">June 28th 2026</p>
            <h3>Day 3</h3>
            <p>
              Added html page for API service that documents how to use the endpoints. Added agent instructions for
              all 3 repos and added dockerfile that doesn't work yet to Event Generator service. Need to update RabbitMQ
              on generator service because it was hardcoded to localhost.
            </p>
            <p>
              Had some tentative ideas for a new project involving AI, looked into RAGs and Redis vector database but I think
              Copilot's existing tool is already pretty good and sounds like it uses RAG already. I don't want to remake the wheel.
              Eventually want to come up with some other sort of project, ideally AI related because that's what companies are going
              crazy for at the moment.
            </p>
          </article>
          <article className="blog-entry-card">
            <p className="blog-entry-date">June 27th 2026</p>
            <h3>Day 2</h3>
            <p>
              Had a pretty busy day today, made mostly just spelling and grammar changes and fixed some of the Powered By technologies on the Intro page.
              Added links for the Github Projects
            </p>
          </article>
          <article className="blog-entry-card">
            <p className="blog-entry-date">June 26th 2026</p>
            <h3>First engineering note</h3>
            <p>
              First blog day. Today I'm switching from having the website just host the parking application to
              more generally being my portfolio website. It already wasn't strictly the parking app, it also has
              some service dashboard pages, and I was going to have to add some sort of introduction/navigation
              guide for the site so I figure why not just make it my portfolio website anyways.
            </p>
            <p>
              Most of today was just typing up things, putting my thoughts into text on the website and refactoring
              the navigation to accommodate the new structure as a portfolio site. As a sort of snapshot of where things are
              when I'm starting this blog the frontend (Including the portfolio site) is hosted on Render, the Java API backend
              is also hosted on render via Docker image, and the PostgreSQL database is also on Render. The event generation is not,
              I've just been running it locally on my machine.
            </p>
            <p>
              The next things to do on my Trello board are to add a migration to make the DB closer to what Harry Reid (The LAS airport)
              actually has, I'll have to figure out some sort of process for implementing database migrations because they're going to be inevitable.
              Realistically the airport might add more floors or sections or even another lot so I should figure out how that process should be handled.
              I did remove those endpoints from the API for those entities because end users shouldn't be able to do that stuff. Alright going to call
              it for the first blog post. Until next time
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

export default Blog;
