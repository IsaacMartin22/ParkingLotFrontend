# GitHub Copilot Instructions

## Project Overview
This is a React + TypeScript frontend application for a Parking Lot management system. It uses:
- **React 18** with **TypeScript**
- **React Router v6** for routing
- **TanStack React Query v4** for data fetching and caching
- **react-scripts** (Create React App) as the build toolchain
- **npm** as the package manager (v10.8.2, Node 20.18.3)

## Agent Behavior

### Command Execution
- **Do NOT ask the user to run commands** unless it is strictly necessary (e.g., a required manual step that cannot be automated, or a destructive operation that requires explicit user confirmation).
- Prefer making code and file changes directly rather than instructing the user to run CLI commands.
- The only exception is if a new dependency needs to be added and the user needs to run npm install. In that case prompt the user

### Code Style & Conventions
- Use **functional React components** with hooks only — no class components.
- Use **TypeScript** throughout; avoid `any` types.
- Co-locate types in `src/types/` and reuse existing types from `src/types/parking.ts`, `src/types/apiDiagnostics.ts`, and `src/types/constants.ts`.
- Place reusable UI components in `src/components/`, page-level components in `src/pages/`, and data-fetching logic in `src/hooks/`.
- Keep styles in `src/styles/` and import them at the component or page level.
- Follow existing naming conventions: `PascalCase` for components/pages, `camelCase` for hooks (prefixed with `use`).

### File Structure
- New pages go in `src/pages/` (subdirectories are fine for feature groupings, e.g., `src/pages/parking/`).
- New hooks go in `src/hooks/` and should use TanStack React Query (`useQuery`, `useMutation`) for API calls.
- New components go in `src/components/`.
- New types go in `src/types/`.

