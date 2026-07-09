# Parking Lot Frontend

A React + TypeScript developer portfolio website for Isaac Martin that contains a parking lot application and diagnostic information for services powering the app.

## Features

- Parking lot informational pages
- Randomly generate cars for parking spaces via the UI
- Make manual API calls or clone the event generator SDK project to tailor updates to parking data
- API diagnostic dashboard
- Database diagnostic dashboard
- Server-state management with TanStack React Query
- Server sent events from a backend API keeps floor detail information live
- Information relevant to Isaac Martin's development portfolio

## Getting Started

Clone the repository and install dependencies, then start the local development server:
```
npm install
npm run dev
```
Runs on [http://localhost:3000](http://localhost:3000)

## Backend API

The parking application and service diagnostic pages require the backend API to be running. See Parking Lot API repository also on my Github

## Deployment

This application is statically built and then deployed to my github.io page at isaacmartin22.github.io. 
Run npm run deploy to statically build this site, then copy the build directory to my github.io repository and publish the github page to update the site