import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import AppFooter from '../components/AppFooter';
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
            <p className="blog-entry-date">July 8th 2026</p>
            <h3>Parking Lot Project Summary</h3>
            <p>
              I'm considering the parking lot project complete. I'll link it to some people, if they find anything glaring I'll fix it, but
              I'm going to move on to my next project so I'm not going to be working on feature work for the parking lot project or any sort
              of improvements to the apps or services. That said, I'll talk about how the project went from start to finish.
            </p>
            <p>
              Starting way, way at the start, the first thing was that I decided I wanted a software development job. The job market isn't great
              right now, there are AI layoffs and a lot of offshoring. I've used AI, I used it in this project a lot, and given how useful it is
              I did spend a lot of time considering how (and if) I can still be useful as a developer when someone who knows what they want can just
              ask AI to do it for them.
            </p>
            <p>
              My conclusion was that yes, I can still be useful as a developer. AI is still a tool, even if it is an incredibly useful tool that
              dramatically speeds up what used to take hours. AI doesn't manage distributed systems well, it doesn't do configuration stuff well,
              there are a bunch of resiliency and infrastructure setup and environment and maintenance steps AI doesn't do well.
            </p>
            <p>
              After considering those things, I decided that the best way for me to get hired is to actually showcase some of those things AI
              would struggle with. I decided I'd make multiple services and link them together and then have a frontend that uses the services.
              I decided I'd play to my strengths, I don't see any reason to reinvent the wheel so I decided I'd use react and typescript for the
              frontend, Java for the backend, and a PostgreSQL database, all of which I've used at my previous job.
            </p>
            <p>
              I created a Trello board and filled it with some basic tasks - build barebones UI, build barebones API, get a database running,
              download all the old tools (Database accessor, Docker, Postman). I did build those out, added some tests for the API, had a barebones
              frontend running. Then I added SSE from the API, which was the first bigger step. I originally was going to have an event generator
              service that continually generated random updates for the parking lot while it ran, and I was using RabbitMQ in the generator service.
              But then I realized that it really shouldn't be running as its own separate thing, that's just needless complexity. I could just make
              requests from the frontend if I really wanted to, so I added the option for users to create/remove cars from the frontend.
            </p>
            <p>
              I also at some point decided to make an SDK for the API. I made that decision back when I still wanted the event generator as its
              own service, that was kind of the reason I wanted an SDK. I wanted to publish it from the API repo and then add it as a dependency
              to the generator service. I published the first version, which didn't work, I had a bunch of duplicate files so at some point I
              decided to add a separate common module for the Request and Response files which were shared with the actual API itself. That was
              a great decision, I then published an SDK version that worked after publishing the common module.
            </p>
            <p>
              I also knew I wanted to have some sort of visibility into the infrastructure as part of my frontend. I wanted some sort of developer
              page where a dev could check out various metrics of things - for the api things like latency, requests per minute, uptime, failed vs
              successful requests, those sorts of things. So I added diagnostic pages to the frontend, one for each service. The event generator
              diagnostic page isn't great because I was originally intending for it to be its own service, but because it's not there really isn't
              any diagnostic information to display for that page. Not much I can do about that, I don't want to delete the page because there still
              is an SDK that can be used, which I do want to show that I know how to do.
            </p>
            <p>
              There were many changes to styling as well. A lot of editing text too because I expanded the parking app frontend to also be my
              portfolio site. But yeah a lot of css changes just to make things look clean, I eventually decided on making the parking app pages
              have a slightly different styling so it's visually clearer that the user is in a sort of "Demo mode" when they navigate to the parking
              app.
            </p>
            <p>
              All in all the project was pretty straightforward, the only real setbacks were the event generator thing and the other setback was
              I ended up removing the Car table from the database because I decided the database doesn't care about car entities. If I wanted
              that to be the case I'd have to create a new car entity for every new license plate and then search up that a car didn't already
              exist when updating the database, which would negatively affect performance and also the app doesn't really care about cars. It
              only cares about what's in the parking spaces. So I migrated the car to basically be a subset of the parking space entity which
              was a big refactor and also broke the frontend's expected API response so I had to do a lot of refactoring there as well. I also
              had Grafana wired up to the API when I was running it locally but that broke when I started hosting the API and I decided not to
              fix it because I was adding the diagnostics pages anyways. Mostly the project was pretty straightforward, there isn't anything too
              fancy going on, it was mostly to check that I can get things hosted, build docker files, run multiple independent services, and regularly
              deploy and create CI pipelines for things, which I did. So I'd say it's pretty successful.
            </p>
            <p>
              My next project is going to be an Internal Developer tool SAAS thing. Initially I plan on only supporting integrations with the
              technologies I use (Github, Buildkite, Grafana, Docker, Github Copilot), but ideally I would expand to other technologies as well so I could
              learn about other technologies and the pros/cons associated with them. The base level project is just going to display data for those things
              - are any builds going on? Any PRs open for branches? What are the latest created images? How many tokens do I have left? That kind of thing.
              But eventually I'd like to be able to actually do things from the UI, I haven't gotten that far yet though.
            </p>
          </article>
          <article className="blog-entry-card">
            <p className="blog-entry-date">July 8th 2026</p>
            <h3>Day 10</h3>
            <p>
              I'm about done with the Parking Lot project. My Trello todo list has been completely cleared and I do have something in mind for my
              next project. I could keep going here, there are always things to improve, but it's in a good spot right now and I know what I want
              to work on next. I guess I'll blog about what I did today and kind of summarize the project and I'll do a separate blog post
              summarizing the Parking Lot project.
            </p>
            <p>
              Today made the Parking Lot App pages look better visually. The information displayed across the lots, floors, and sections pages are
              now more consistent. The Parking Lot app pages are now also styled differently from the rest of the portfolio site. I wanted the user
              to have a better understanding that when they land on the Parking Home page they have now transitioned somewhat into demo mode. It's
              not exactly demo mode because there are still the diagnostic pages they can navigate to/from but from the Parking Lot pages everything
              in there is specifically for the Parking Lot app, not my portfolio site.
            </p>
            <p>
              So I made the styling for those pages slightly different, it looks good. I also added visual distinctions between the lot, floor, and
              section pages. All of those pages were really just white cards in a grid with info on them, the pages are now color coded and there are
              hierarchical indications of which entities the user is looking at. It's still not great, I could probably do something better, but I'm a
              software engineer not UX. So I'm happy with what's there for now, it's good enough. I'm likely going to bump this Render deploy up to a
              non-free version so it doesn't take time to access and the performance is better and use a custom domain then show some people. Should
              only cost 20$/month, and I'll scale it back down to the free version after I'm hired which should hopefully only be a few months max.
            </p>
          </article>
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

      <AppFooter />
    </div>
  );
}

export default Blog;
