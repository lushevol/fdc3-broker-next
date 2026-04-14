# mf_tile — Project Overview

> Parent: [Monorepo AGENTS.md](../../AGENTS.md)

| Field      | Value                      |
| ---------- | -------------------------- |
| **Type**   | Module Federation Tile App |
| **Port**   | 3001                       |
| **Status** | Demo/Scaffold              |

## Purpose

Module Federation variant of a tile micro-frontend. Simpler alternative to SystemJS tiles — no single-SPA lifecycle, no import map.

The tile acts as a **remote** that exposes its `App` component for consumption by a Module Federation host (e.g., `mf_container`).

## Key Features

- **Module Federation remote** exposing `App` component
- **No single-SPA** — plain React component, no lifecycle wrappers
- **No FDC3 integration yet** (planned — see comment in `src/App.tsx`)
- **Error boundary** — `SimpleErrorBoundary` wraps all rendered content

## Quick Start

```bash
cd apps/mf_tile

npm run dev          # Start dev server on port 3001
npm run dev:debug    # Start with FEDERATION_DEBUG=true for MF debug logs
npm run build        # Production build via Rsbuild
npm run preview      # Serve production build locally
npm run lint         # ESLint
npm run format       # Prettier (write)
```

## Environment

Single `.env` file with `port=3001`. No `env-cmd`, no `.env.local`/`.env.server` split.
