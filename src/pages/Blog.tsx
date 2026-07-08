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
            My development blog. Trying to make an entry once per day. The blog will probably mainly document
            what I'm trying to do, what I got done, and what to do next. I'm going to keep contributing to this
            site or the projects hosted in this site until I'm hired. I'm nearing the point where I feel I can
            link this site in my resume.
          </p>
          <Link to="/" className="blog-home-link">Back to portfolio home</Link>
        </div>
      </header>

      <main className="container blog-main">
        <section className="blog-entry-placeholder" aria-label="Future blog entries">
          <h2>Entries</h2>
          <article className="blog-entry-card">
            <p className="blog-entry-date">July 7th 2026</p>
            <h3>Day 9</h3>
            <p>
              Fixed the SDK, it now works entirely. Separated the common JAR elements into its own module and published that to Maven
              as well. Added an add/remove button to the parking space card that does a put/delete request to the api to add or remove
              a car. Completely gutted the 3rd event generator service, just made it an SDK wrapper, it just doesn't make sense to have
              as its own service. The most it should be is maybe a component on the frontend to automatically generate some random events
              but I don't want to clutter up my page so I'm just going to leave it gutted.
            </p>
            <p>
              I'm really happy with having the new common module for the API, it made syncing the SDK and API way easier, and it will
              also be way easier to maintain if I ever change anything about the API. Seems unlikely I'll change anything but having a
              separate common module is definitely something I would do if I create an SDK again, which could happen.
            </p>
          </article>
          <article className="blog-entry-card">
            <p className="blog-entry-date">July 6th 2026</p>
            <h3>Day 8</h3>
            <p>
              Was gone for 4th of July weekend, happy 250th USA. Decided on my idea for next project, going to be a SAAS style
              internal dev tool thing. Going to integrate with a lot of common tools used for devs, such as CI, deploying, monitoring,
              logging, those kinds of things. Ideally devs could centralize all their internal tools there, might need a lot of support
              for different options but I'll start with one per category.
            </p>
          </article>
          <article className="blog-entry-card">
            <p className="blog-entry-date">July 2nd 2026</p>
            <h3>Day 7</h3>
            <p>
              Another late, quick entry. Was sick today so didn't do much. Added template html page for event generator service, need to
              check that the configuration adjustments live update the requests going out. SDK isn't working still yet
            </p>
          </article>
          <article className="blog-entry-card">
            <p className="blog-entry-date">July 1st 2026</p>
            <h3>Day 6</h3>
            <p>
              It's late, going to make this quick. Another productive day. Fixed a lot of bugs, made site look better, switched over to
              having the event generator service be the 3rd service instead of caching service. Expanded API to include a health ping
              check, will use in frontend to wake up API service. Refactored API to remove car entity, it really didn't make much sense
              and had a lot of overlap with parking space. The Parking app doesn't really car about car entities, it only cares about what's
              in parking spaces, so I adjusted the database.
            </p>
            <p>
              Did other work I'm probably forgetting. Cached API check for 10 minutes, added external links to service pages from the
              diagnostic pages. Removed About Me, just doesn't fit in well. Eliminated Service home page and fixed navigation there.
              Need to work on fixing SDK, just published a new SDK version so I'll import that and figure out what's broken. A lot of
              the AI code was suspicious and I removed it, the Event Generator service looks a lot cleaner now. Paying the price for
              the AI tech debt in the form of refactoring.
            </p>
          </article>
          <article className="blog-entry-card">
            <p className="blog-entry-date">June 30th 2026</p>
            <h3>Day 5</h3>
            <p>
              Got maven central publishing buildkite step to work, successfully imported the API SDK into the event generator service.
              The event generator no longer works with the SDK, still need to figure that out, but did publish and import the SDK successfully.
              Also expanded the API service to add logs so I can display them in the diagnostics page. Not very secure but it's good to show that
              logs are something that should be displayed on a diagnostic page for a service.
            </p>
            <p>
              Separated out the diagnostics hook into its own API-specific thing and split off a separate diagnostics hook for different
              database diagnostics. Database doesn't really have logs and endpoints so its diagnostics page looks different and the info I'm
              fetching will be different so it is its own thing.
            </p>
            <p>
              Also want to fix random unnecessary bubbles on frontend and mark the Cache Service as not implemented yet.
            </p>
          </article>
          <article className="blog-entry-card">
            <p className="blog-entry-date">June 29th 2026</p>
            <h3>Day 4</h3>
            <p>
              Did a lot today. API had bug where PUT parking space requests could change its section so I fixed that bug and
              added validation checks. Floors sections and parking spaces are now only certain amount per parent entity, enforced
              at java service level and database level. Also fixed the actual logic and adjusted so PUT requests will fetch and
              then modify the existing entity first rather than just blindly saving the user's raw request. Also added intermediate
              entities for PUT/POST endpoints so user isn't putting raw database entities as request bodies.
            </p>
            <p>
              At that point I realized I had to update the event generator, which I did by just copy pasting the new JSON bodies
              into AI and having it update stuff automatically. But I realized I could publish an SDK for the API project and then
              use the API SDK http client along with the request bodies as models to make those updates more seamless and help
              me pay attention to when I'm going to make a breaking change to the API, it does affect the frontend service and
              event generator service as well.
            </p>
            <p>
              Maven Central credentials have been created and a buildkite release/publish step has been added to the API service but
              it doesn't work yet. Haven't set that kind of thing up yet so it's a learning process, once it's done though I should
              be able to publish a new SDK version from buildkite whenever I want by unblocking the release step.
            </p>
          </article>
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
              I've already been working on this project for a couple weeks, I just realized after I decided to have this
              website be more of a portfolio that I could add a blog page. That might be something hiring managers are interested
              in. So I'm starting a blog as of today despite already being a couple weeks into the project.
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
