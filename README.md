# Isaac Martin Portfolio Frontend

This repository is the public-facing frontend for my portfolio and engineering projects. It serves as the landing page for the broader portfolio ecosystem, which includes a backend API repository and an SDK repository working together to power the full experience.

The app combines:
- a personal portfolio and project showcase
- interactive parking lot demos and live fleet state views
- infrastructure and diagnostics dashboards
- analytics and AI-assisted information retrieval
- a developer-facing view into the supporting backend services and tooling

## Overview

This frontend is the entry point for the portfolio ecosystem. It is designed to present the work as a cohesive product experience while also exposing technical depth through dashboards, live simulations, and project details.

The full portfolio ecosystem includes:
- Frontend repository: this project
- Backend API repository: the service layer for parking data, analytics, dashboards, and integrations
- SDK repository: reusable client libraries and shared contracts for interacting with backend endpoints

## What this app includes

- Portfolio home and project pages
- Infrastructure dashboard for builds, deployments, and service health
- Interactive parking lot overview and floor detail pages
- Real-time updates using server-sent events
- Analytics capture and reporting for page views and interactions
- AI-powered portfolio chatbot using retrieval patterns and vector search
- Project and technology overview pages
- Custom domain deployment for the public portfolio site

## Tech Stack

- React 18
- TypeScript
- React Router v6
- TanStack React Query v4
- CRA / react-scripts
- GitHub Pages deployment workflow

## Requirements

- Node.js 20.18.3
- npm 10.8.2

## Local Development

```bash
npm install
npm run dev
```

Then open:
- http://localhost:3000

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm test` - run the test suite
- `npm run start` - serve the production build locally
- `npm run deploy` - build the app and publish the static site using the project deployment script

## Routes

- `/` - portfolio home
- `/projects` - selected work and project history
- `/infrastructure` - service dashboards and operational views
- `/parking-lots` - parking lot overview
- `/parking-lots/:lotId` - parking lot details
- `/parking-lots/:lotId/floors/:floorId` - floor detail view
- `*` - not found / fallback route

## Deployment

This project is built as a static site and deployed to GitHub Pages using a custom deployment script. The repository also contains a `public/CNAME` file so the site can continue to use the configured custom domain after deployment.

The standard deployment flow is:

```bash
npm run deploy
```

This runs the production build and then copies the generated static output into the target GitHub Pages repository for publishing.

## Repository Relationship

This repository is intentionally designed as the public front door to the broader portfolio project. The frontend is not standalone in spirit—it sits alongside the backend and SDK repositories that provide the supporting data, service contracts, and developer tooling.

If you are exploring the full system, treat this frontend as the presentation layer and the backend + SDK repos as the operational and reusable components behind it.
