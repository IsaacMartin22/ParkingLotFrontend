import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/BlogStyles.css';

function DevNotesDashboard(): JSX.Element {
    return (
        <div className="blog-page">
            <header className="blog-hero">
                <div className="container blog-hero-content">
                    <p className="blog-eyebrow">Service Architecture</p>
                    <h1>Developer Notes</h1>
                    <p className="blog-copy">
                        I've got 7 dashboard pages on this site, they all do different things. This page is for
                        me to describe the engineering considerations that crossed my mind for each.
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
                            The parking explorer was the first thing I decided to build. I wanted to solve a real world problem and I had seen a hand
                            placed sign at the LAS airport where I live saying a lot was full. It was not full. I figured a website would provide more
                            up-to-date information and be more reliable than a sign, so I started this application.
                        </p>
                        <p>
                            It's a simple and lame application. Not very impressive. But it is a start, I figured I could add features and
                            improve it over time, which I did. The server sent events are what's keeping me from taking it down. The idea is that
                            some airport sensor would trigger API requests, which would update server state. It could be a pressure plate under the car,
                            a photo taken by a drone and processed, or a human on a computer. Something makes an API request, after the API updates the
                            database it sends a server sent event to update all subscribed clients. A pretty good use case for SSE.
                        </p>
                        <p>
                            I used React and Typescript because I'm most familiar with them for the frontend. Reusable component libraries are good
                            practice so I did that, and tanstack query is a great library for making network calls.
                        </p>
                    </article>
                    <article className="blog-entry-card">
                        <p className="blog-entry-date">Backend</p>
                        <h3>API Service</h3>
                        <p>
                            The frontend shouldn't directly query a database. I also wanted to build a distributed system, that's the kind of
                            thing AI can't do holistically and it's also pretty standard nowadays. I'm most familiar with Java for the backend
                            so I created a pretty basic CRUD API for the parking database entities. I removed many update/delete endpoints
                            because I just didn't see any use case for end users updating or deleting floors or lots, those changes are best done
                            via migrations in my mind.
                        </p>
                        <p>
                            I later expanded the API past just a CRUD wrapper around parking lot entities. It's my core backend application,
                            any functionality I don't want to route from the frontend goes through this service. It now makes
                            requests with API tokens and persists analytics data emitted from the frontend.
                        </p>
                    </article>
                    <article className="blog-entry-card">
                        <p className="blog-entry-date">API Java SDK</p>
                        <h3>SDK</h3>
                        <p>
                            I created the API and was going to have a separate "Event Generator" service that automatically made a
                            constant stream of API calls to update the site to really showcase the server sent events. The impetus
                            for the SDK was to use it in the Event Generator service.
                        </p>
                        <p>
                            At some point I changed my mind, I scrapped the Event Generator service idea. In my mind there really isn't
                            any point, it's just some background worker artificially creating random traffic. I decided to instead
                            allow the user to create a random car in a parking space or remove a car via the frontend, they could just
                            open another tab to see the SSE effect. Another entire service seemed like overkill and I'd also have to
                            find a way to run it 24/7 and it would take up API bandwidth and resources. So I scrapped it and left it as
                            just an SDK.
                        </p>
                    </article>
                    <article className="blog-entry-card">
                        <p className="blog-entry-date">Storage</p>
                        <h3>Database</h3>
                        <p>
                            I need to store information, so I need a database. Very standard decision. I'm familiar with SQL, both
                            PostgreSQL and MySQL, I used PostgreSQL. I didn't need anything fancy, just a simple way to store data.
                            Originally this only stored parking lot entities, the API ran several flyway migrations to adjust the
                            entities and also add an analytics table. Analytics would be something better off as a separate database
                            starting out because its nature is very different. It gets a lot more traffic so it should scale hard
                            and also data integrity isn't as important. There are just different considerations there so if I
                            thought this site would get huge I would have it be its own independent thing.
                        </p>
                    </article>
                    <article className="blog-entry-card">
                        <p className="blog-entry-date">Useful Feature</p>
                        <h3>Analytics</h3>
                        <p>
                            This was a "I need to make this better somehow" feature. Analytics is pretty useful, figuring out how
                            users are using the product is helpful to know. What they like, what they don't like, what they're
                            spending time on and looking into when, these kinds of things are really important to product people,
                            so being able to build that kind of thing out on my site seems incredibly useful.
                        </p>
                        <p>
                            As mentioned in the database segment if I expected my site to get a ton of traffic I would have
                            a separate service and database just for analytics because it scales much differently and isn't
                            a truly core customer experience.
                        </p>
                        <p>
                            I didn't want to have to worry about PII so the closest this does to identify a user is generate a random
                            id and persist it to session storage. This is not secure, theoretically someone could copy the value and
                            give it to someone else and they could spoof data, but it should be safe to assume that most users aren't
                            doing that and therefore that most events sharing the same session id were done by the same end user.
                        </p>
                    </article>
                    <article className="blog-entry-card">
                        <p className="blog-entry-date">Integration - Buildkite</p>
                        <h3>Builds</h3>
                        <p>
                            I found myself trying to come up with ways to demonstrate that I'm following good development practice.
                            Automated testing is important to have. I originally just had buildkite listed as one of the technologies
                            on the home page until I realized I was a developer, I could just create an API key and display build
                            information on my actual site. The key is secure of course and not publicly available. The builds page
                            uses my API key to query my recent builds organized by pipeline.
                        </p>
                        <p>
                            I only have very minimal unit tests, ideally I'd add integration tests, end to end tests, and smoke tests
                            eventually. I'd use playwright for the frontend, I've used it before, and the backend I'd want to set up
                            some hard data that doesn't change in a staging environment to test.
                        </p>
                    </article>
                    <article className="blog-entry-card">
                        <p className="blog-entry-date">Integration - Render</p>
                        <h3>Deployments</h3>
                        <p>
                            My frontend is a statically built site on github pages, my API service and database are hosted on Render.
                            This page currently only shows deployments for the API service because it's the only thing being
                            regularly deployed on Render. The database doesn't change much. This was just another aspect of the
                            development process I wanted to show my familiarity with.
                        </p>
                    </article>
                    <article className="blog-entry-card">
                        <p className="blog-entry-date">Misc</p>
                        <h3>Logging and Project Management</h3>
                        <p>
                            I was originally just keeping API logs in memory and exposing them via a diagnostic endpoint. After I
                            started using API keys for buildkite and render and using environment variables I realized there was
                            a good chance one of those might get exposed via that method, so I probably shouldn't make all service
                            logs publicly available. It also wasn't very scalable or standard.
                        </p>
                        <p>
                            So I decided to start using Sumologic for logs. I can access all logs for the API service in Sumo,
                            it's really the only service that has logs. The frontend will emit analytics events for errors and
                            post those errors to the API for me to check out if desired so I don't feel the need to have separate
                            logging for the frontend. And then I use a Trello board for Project Management. I thought about exposing
                            some sort of feature request functionality on my site but I think I'm just going to work on what I
                            work on. Trello is already good enough standalone, I don't feel the need to add an API wrapper and
                            have a separate dashboard for it. It should already be clear I know how to integrate with APIs so
                            another API integration seems redundant.
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

export default DevNotesDashboard;
