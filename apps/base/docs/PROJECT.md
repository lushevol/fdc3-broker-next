# @fm/base — Project Overview

> Parent: [Monorepo AGENTS.md](../../../AGENTS.md)

| Field       | Value                                                  |
| ----------- | ------------------------------------------------------ |
| **Type**    | Single-SPA Shell UI App                                |
| **Port**    | 8002 (dev)                                             |
| **Status**  | Production                                             |
| **Package** | `@fm/base`                                             |
| **Entry**   | `src/system-entry.ts` → `src/root.tsx` → `src/App.tsx` |

## Purpose

The always-mounted shell UI micro-frontend providing login, navigation, FDC3 interop, chatbot/AI assistant, and shared component re-exports for all other MFEs in the platform.

## Key Features

- **Login/SSO Authentication** — Login page with SSO integration and session management
- **Navigation** — AppBar, Drawer, workspace tab management with dynamic tile loading
- **FDC3 2.2 Interop** — Broker initialization, resolver, app directory, and intent routing via `FDC3Integration.tsx`
- **AI Chatbot** — SSE streaming via `AssistantUIRuntimeProvider`, tool routing, frontend tool registry, generative UI
- **Shared Re-exports** — `root.tsx` exports 40+ components, hooks, services, and utilities for consumption by other MFEs via `System.import('@fm/base')`
- **Admin Module** — CRUD for tiles, categories, import maps, and FDC3 declarations
- **Workspace Management** — Dynamic tile loading and tab lifecycle

## Quick Start

```bash
# Dev server (reads .env.local, port 8002)
npm run dev

# Production build (reads .env.server)
npm run build:app

# Type checking only
npm run build:types

# Run tests with coverage
npm run test

# Watch tests
npm run watch-tests

# Lint
npm run lint

# Storybook (port 6006)
npm run storybook
```

## Monorepo Dependencies

| Package                    | Purpose                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `ratan-fdc3-agent`         | FDC3 Agent hooks (`useFDC3`, `useIntentListener`, `useUserChannels`, `AgentProvider`) |
| `ratan-fdc3-broker`        | FDC3 Broker runtime                                                                   |
| `ratan-fdc3-app-directory` | FDC3 App Directory service                                                            |
| `ratan-fdc3-resolver-ui`   | FDC3 intent resolver UI                                                               |
| `ratan-design`             | Design system (MUI + Emotion + tokens)                                                |

## Environment Files

| File          | Purpose                                                                        | Used By                               |
| ------------- | ------------------------------------------------------------------------------ | ------------------------------------- |
| `.env.local`  | Local dev overrides (`orgName`, `mode=development`, `port=8002`)               | `npm run dev`, `npm start`            |
| `.env.server` | Production build overrides (`mode=production`, `port=8001`)                    | `npm run build:app`                   |
| `.env.mfe`    | Build-time MFE vars (`MFE_APP_TARGET_ROOT`, `MFE_APP_PREFIX_STYLE`, `orgName`) | `readMfeEnv()` in `rsbuild.config.ts` |

**Load order:** `npm run dev` uses `env-cmd -f .env.local`. `npm run build:app` uses `env-cmd -f .env.server`. `.env.mfe` is always read by `readMfeEnv()` and merged into `process.env.*` defines.
