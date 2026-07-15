import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import AppFooter from '../../components/AppFooter';
import '../../styles/BlogStyles.css';

function DevNotesDashboard(): JSX.Element {
    return (
        <div className="blog-page">
            <header className="blog-hero">
                <div className="container blog-hero-content">
                    <p className="blog-eyebrow">Service Architecture</p>
                    <h1>Developer Notes</h1>
                    <p className="blog-copy">
                        This site contains 7 dashboard pages, they all do different things. This page is for
                        me to describe my considerations for each.
                    </p>
                    <Link to="/" className="blog-home-link">Back to portfolio home</Link>
                </div>
            </header>

            <main className="container blog-main">
                <section className="blog-entry-placeholder" aria-label="Future blog entries">
                    <h2>About the Dashboards</h2>
                    <article className="blog-entry-card">
                        <p className="blog-entry-date">Starter Application</p>
                        <h3>Parking Explorer</h3>
                        <p>
                            The parking explorer was the first thing I decided to build. I wanted to solve a real world problem. I had seen a hand
                            placed sign at the LAS airport where I live saying a lot was full. It was not full. I figured a website would provide more
                            up-to-date information and be more reliable than a sign, so I started building the Parking Lot app.
                        </p>
                        <p>
                            It's a simple application, not very impressive. But it is a real world problem and I had to start somewhere. I figured I
                            could add features and improve it over time if it proved too simple a task, which I did. The server sent events are the
                            best aspect. My idea is that something would trigger API requests, which would update server state. The trigger could be a
                            pressure plate under the parking space, a drone taking a photo and having it be processed, or a human on a computer.
                            Something makes an API request and then after the API updates the database it sends a server sent event to update all
                            subscribed clients. A pretty good use case for SSE. I could make more improvements but I wanted to spend time elsewhere.
                        </p>
                        <p>
                            I used React and Typescript because I'm most familiar with them for frontend work. Reusable component libraries are good
                            practice so I have resuable components, and tanstack query is a great library for making network calls so I used tanstack.
                        </p>
                    </article>
                    <article className="blog-entry-card">
                        <p className="blog-entry-date">Backend</p>
                        <h3>API Service</h3>
                        <p>
                            I made the frontend and needed a way to store the data. Frontends shouldn't directly query databases. I also wanted
                            to build a distributed system because that's the kind of thing someone with years of dev experience can do better than
                            a junior dev. Also, it's more difficult to vibe code distributed systems, and I want to make the case that developers
                            are still useful with the growing competence of AI. I'm most familiar with Java for the backend so I created a pretty
                            basic CRUD API for the parking database entities. I removed many update/delete endpoints because I just didn't see any
                            use case for end users updating or deleting floors or lots, those changes are best done via migrations. So I removed
                            those, and when I did want to remove some floors at a later point I did write a migration using flyway, which worked
                            well.
                        </p>
                        <p>
                            I later expanded the API past just a CRUD wrapper around parking lot entities. It's now my core backend application,
                            any functionality I don't want to route from the frontend goes through this service. So it now makes requests with
                            API tokens for the build and deploy dashboards and persists analytics data emitted from the frontend for the analytics
                            dashboard.
                        </p>
                    </article>
                    <article className="blog-entry-card">
                        <p className="blog-entry-date">API Java SDK</p>
                        <h3>SDK</h3>
                        <p>
                            The SDK was 3rd. I created the API and was going to have a separate "Event Generator" service that automatically made a
                            constant stream of API calls to update the site. My goal was to showcase the server sent events by having the generator
                            constantly be updating the frontend so whenever anyone viewed floor data they'd see it updating live. I also wanted to
                            create an SDK, knowledge of how to create and publish an SDK could be something companies are looking for. Those were
                            my reasons, functionally though in terms of the app the impetus for the SDK was to use it in the Event Generator service.
                        </p>
                        <p>
                            At some point I changed my mind, I scrapped the Event Generator service idea. In my mind it would be way overkill.
                            It would just be some background worker artificially creating random traffic. It would cost me money to host, it would
                            slow down my site by using up the API's bandwidth and memory, and it would also just be confusing for site viewers.
                            They wouldn't know where the events were coming from until they read about the generator service. So I decided to instead
                            allow the user to create a random car in a parking space or remove a car via the frontend, they could just
                            open another tab to see the SSE effect. So I scrapped the generator service idea and left the project as just an SDK.
                        </p>
                    </article>
                    <article className="blog-entry-card">
                        <p className="blog-entry-date">Storage</p>
                        <h3>Database</h3>
                        <p>
                            4th - The need for a database should be self explanatory. For a while I was using an H2 in-memory database hosted by
                            the API service. That worked for initial development but I wanted the app to eventually be accessible to the general
                            public so I would eventually need to host an actual database and it would also be good to separate it from the API
                            service.
                        </p>
                        <p>
                            So the database was born. A very standard decision. I'm familiar with SQL, both
                            PostgreSQL and MySQL, so I used PostgreSQL. I didn't need anything fancy, just a simple way to store data.
                            Originally this only stored parking lot entities, the API ran several flyway migrations to adjust the
                            entities and also add an analytics table. Analytics could end up being something better off as a separate database
                            because its nature is very different. If I expected my site to get more than a hundred daily users I would separate
                            out analytics into its own service and dashboard. I would do that because I expect analytics to get a lot more traffic
                            so it should scale hard, also I don't think data integrity is as important relative to other functionality. If an
                            analytics request fails it's not a huge deal, the customer doesn't get frustrated, there's no immediate error. It's
                            obviously still worth investigating if something does go wrong but it's not a huge deal if events are dropped. So those
                            considerations for analytics would orient me towards having it be its own independent thing for scalability.
                        </p>
                    </article>
                    <article className="blog-entry-card">
                        <p className="blog-entry-date">Useful Feature</p>
                        <h3>Analytics</h3>
                        <p>
                            This was a "I need to make this better somehow" feature. Analytics is pretty useful, figuring out how
                            users are using the product is helpful to know. It lets product make data driven decisions. What users like,
                            what they don't like, what they're spending time on and clicking and viewing, these kinds of things are really
                            important to product. Being able to build that kind of thing out on my site seems incredibly useful.
                        </p>
                        <p>
                            As mentioned in the database segment if I expected my site to get a ton of traffic I would have
                            a separate service and database just for analytics because it scales much differently and isn't
                            a truly core customer experience.
                        </p>
                        <p>
                            I wanted all my code to be publicly available so I didn't want any PII. The closest the site does to identify
                            a user is generate a random id and persist it to session storage. The logic is not secure. Someone could easily
                            copy the value and give it to someone else to spoof data, but it should be safe to assume that most users
                            aren't doing that and therefore that most events sharing the same session id were done by the same end user.
                        </p>
                    </article>
                    <article className="blog-entry-card">
                        <p className="blog-entry-date">Integration - Buildkite</p>
                        <h3>Builds</h3>
                        <p>
                            I found myself trying to come up with ways to demonstrate that I'm following good development practice. At
                            this point I had implemented pipelines and deployed my services publicly, so there were more things involved
                            than was immediately visible on the site. Infrastructure is incredibly relevant for developers and my site
                            tries to showcase my development skills so I wanted to provide insight into my CI pipelines somehow. I had
                            automated pipelines at this point, I just needed to find a way to make the pipelines publicly available without
                            letting someone modify or break anything.
                        </p>
                        <p>
                            I originally just had buildkite listed as one of the technologies on the home page. I didn't like that, to me
                            it wasn't enough visual insight. I had written tests and created multiple pipelines, it seemed like too much
                            effort I had gone through to just leave as a dumb text oval in a list. I then remembered I was a developer, I
                            could just create a buildkite API token and use it. I assumed correctly that buildkite would have an API, I
                            looked at the documentation and found I could run a simple GET builds request to get all the information I wanted.
                            It showed my pipelines, build status, build duration, dates, it was perfect. So that was the builds dashboard.
                        </p>
                        <p>
                            I only have very minimal unit tests, ideally I'd add integration tests, end to end tests, and smoke tests.
                            I'd use playwright for the frontend, I've used it before, and the backend I'd want to set up
                            some hard data that doesn't change in a staging environment to test. It's just me though, tests seem much
                            less important with less developers because there aren't other people who aren't as familiar with my code
                            trying to change it. Usually those situations are when bugs happen so the automated tests are to prevent it,
                            but being a solo dev lowers that priority for me.
                        </p>
                    </article>
                    <article className="blog-entry-card">
                        <p className="blog-entry-date">Integration - Render</p>
                        <h3>Deployments</h3>
                        <p>
                            This was pretty much the same as the build dashboard but instead of Buildkite it was Render. I wanted
                            visibility into deployment activity so I did the same thing - checked if Render had an API, generated
                            a key, used the key in the one request I wanted, and now it displays Deployment information.
                        </p>
                        <p>
                            Render actually had an outage when I was testing which made me think I had wired it up wrong,
                            eventually I verified with Postman that it just wasn't up and checked the status page and it
                            was having issues. So out of that now both the Deployments and Builds pages link to their
                            respective status pages while loading in case they're down. Not much I can do in that case.
                        </p>
                    </article>
                    <article className="blog-entry-card">
                        <p className="blog-entry-date">Misc</p>
                        <h3>Logging and Project Management</h3>
                        <p>
                            I was originally just keeping API logs in memory and exposing them via a diagnostic endpoint. After I
                            started using API keys for buildkite and render and using environment variables I realized there was
                            a good chance one of those might accidentally get exposed via that method, so I probably shouldn't make
                            all service logs publicly available. It also wasn't scalable or standard of me to do that.
                        </p>
                        <p>
                            So I decided to start using Sumologic for logs. I can access all logs for the API service in Sumo.
                            The API is really the only service that has logs. The frontend will emit analytics events for errors and
                            post those errors to the API for me to check out if desired so I don't feel the need to have separate
                            logging for the frontend. I use a Trello board for Project Management. I thought about exposing
                            some sort of feature request functionality on my site but I think I'm just going to work on what I
                            work on. Trello is already good enough standalone, I don't feel the need to add an API wrapper and
                            have a separate dashboard for it. It should already be clear I know how to integrate with APIs so
                            another API integration seems redundant in terms of expressing knowledge of development concepts.
                            I also have my portfolio linked to friends, I wouldn't put it past them to put something undesired
                            on a feature request board if I built that feature.
                        </p>
                    </article>
                </section>
            </main>

            <AppFooter />
        </div>
    );
}

export default DevNotesDashboard;
