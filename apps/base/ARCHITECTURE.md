# Architecture: @fm/base

## Tech Stack

- **Framework**: React 18
- **Microfrontend Framework**: Single-SPA (via `single-spa-react`)
- **Build Tool**: Webpack 5
- **Language**: TypeScript
- **UI Library**: Material UI (MUI) v5
- **State/streams**: RxJS

## Folder Structure

- `src/components`: Reusable UI components.
- `src/hooks`: Custom React hooks (e.g., `useServices`).
- `src/pages`: Page-level components (if any specific routes are handled here).
- `src/routing`: Routing configuration.
- `src/services`: API service integration (Auth, etc.).
- `src/theme`: Theme configuration.
- `src/utils`: Helper functions.

## Key Concepts

- **Root Component**: `root.tsx` serves as the entry point for the single-spa lifecycle (bootstrap, mount, unmount).
- **Service Layer**: `services/index.ts` exposes critical functions like `login`, `logout`, and `ssePublish` for real-time updates.
