# Parking Lot Frontend

A React + TypeScript frontend for Isaac Martin's parking lot and developer portfolio experience. The app combines parking lot browsing with several diagnostic dashboards for API, database, analytics, build, deployment, and development notes.

## Tech Stack

- React 18
- TypeScript
- React Router v6
- TanStack React Query v4

## Features

- Portfolio landing page and blog section
- Parking lot overview, lot details, and floor details
- Live floor updates powered by server-sent events
- API diagnostics dashboard
- Database diagnostics dashboard
- Analytics dashboard
- Build status dashboard
- Deployment status dashboard
- Developer notes dashboard
- SDK dashboard

## Requirements

- Node.js 20.18.3
- npm 10.8.2
- The parking lot backend API must be running for the parking and diagnostic pages to work correctly

## Getting Started

```bash
npm install
npm run dev
```

App available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm test` - run the test suite
- `npm run start` - serve the production build from `build/`
- `npm run deploy` - run by me locally - build the app and deploy to my github.io page

## Routes

- `/` - portfolio home
- `/dashboards` - dashboard home
- `/api` - API diagnostics
- `/database` - database diagnostics
- `/sdk` - SDK dashboard
- `/analytics` - analytics dashboard
- `/builds` - build dashboard
- `/deployments` - deployment dashboard
- `/dev-notes` - developer notes
- `/parking-lots` - parking lot overview
- `/parking-lots/:lotId` - parking lot details
- `/parking-lots/:lotId/floors/:floorId` - parking lot floor details

## Deployment

The app is built as a static site. `npm run deploy` is run by me locally to create the production build and publish it using the repository's deployment script.

