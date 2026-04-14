# @fm/template_container — Project Overview

> Parent: [Monorepo AGENTS.md](../../AGENTS.md)

## Type

Single-SPA Template Container App | Port 8007

## Purpose

Template/scaffold for creating new **container** micro-frontend apps. Containers host business logic, grids, and dashboards (e.g., trade blotters, cashflow grids, authorization limits).

## Status

**Template** — copy and rename to scaffold new containers. Not a production app itself.

## Key Features

- **SystemJS module output** — loaded at runtime by `root-config` via import map
- **Single-SPA lifecycle** — `system-entry.ts` sets public path and exports bootstrap/mount/unmount
- **@fm/base shared shell import pattern** — `Root/import/index.ts` destructures 20+ exports from `@fm/base` (ErrorBoundry, Provider, ReactRouterDom, Service, Hooks, etc.)
- **Dynamic tile loading** — `React.lazy` + `System.import('@fm/template')` to embed tiles inside containers
- **AG Grid Enterprise** — `ag-grid-community` + `ag-grid-enterprise` for data grids
- **Redux Toolkit** — state management via `@reduxjs/toolkit`
- **Apollo/Relay GraphQL** — `@apollo/client` and `relay-runtime` for data fetching
- **WebSocket support** — `sockjs-client` + `stompjs` for real-time messaging
- **MUI v5** + **Ant Design** — UI component libraries

## Quick Start

```bash
# Development (uses .env.local, port 8007)
npm run dev

# Production build (uses .env.server)
npm run build

# Run tests (Jest, --passWithNoTests)
npm run test

# Lint
npm run lint

# Bundle analysis
npm run analyze
```

## Monorepo Dependencies

No direct workspace package dependencies. All shared code is loaded at runtime via the import map:

- `react`, `react-dom` — externals resolved by SystemJS
- `@fm/base` — external resolved by SystemJS, provides shared shell UI and utilities

## Environment Files

| File          | Purpose                      | Key Vars                                                                                                |
| ------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| `.env.local`  | Local dev server             | `port=8007`, `mode=development`, `devtool=source-map`                                                   |
| `.env.server` | Production build             | `port=8007`, `mode=production`, `devtool=false`, `DEFAULT_TIMEOUT`, `FILE_LIMIT`                        |
| `.env.mfe`    | MFE-specific build-time vars | `MFE_APP_TARGET_ROOT='MicroWebUI_ratan_container'`, `MFE_APP_PREFIX_STYLE='MicroWebUI_ratan_container'` |

Environment loading uses `env-cmd`: dev commands read `.env.local`, build commands read `.env.server`. MFE vars in `.env.mfe` are injected at build time via `readMfeEnv()` in rsbuild config.
