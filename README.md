# Parking Lot Frontend

A React + TypeScript frontend for viewing parking lot information, service health, and operational diagnostics.

This application provides pages for browsing parking lots, viewing lot/floor details, and checking dashboard-style service status information for API, database, and cache layers.

## Features

- Parking lot overview page
- Parking lot detail pages
- Floor-level parking space details
- API diagnostics dashboard
- Database service dashboard
- Cache service dashboard
- Client-side routing with React Router
- Server-state management with TanStack React Query
- TypeScript-based data models
- Create React App build tooling

## Tech Stack

- React
- TypeScript
- TanStack React Query 4
- Npm

## Prerequisites

Install the following before running the project:

- Node.js
- npm

This project uses npm as its package manager.

## Getting Started

Clone the repository and install dependencies, then start the local development server:
```
npm install
bash npm start
```
Runs on [http://localhost:3000](http://localhost:3000)

## Backend API

The frontend requires the backend API to be available locally at:
http://localhost:8080/api

The diagnostics endpoint is expected at:
[http://localhost:8080/api/diagnostics](http://localhost:8080/api/diagnostics)

Parking lot data is also loaded from the backend API through the app’s custom React Query hooks.

Make sure the backend service is running before using pages that load live data.

## Application Routes

| Route | Description |
| --- | --- |
| `/` | Home page |
| `/services/api` | API diagnostics dashboard |
| `/services/database` | Database service dashboard |
| `/services/cache` | Cache service dashboard |
| `/parking-lots` | Parking lots overview |
| `/parking-lots/:lotId` | Parking lot details |
| `/parking-lots/:lotId/floors/:floorId` | Parking lot floor details |
| `*` | Not found page |

No tests yet