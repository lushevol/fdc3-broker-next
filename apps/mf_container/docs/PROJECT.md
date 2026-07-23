# mf_container — Project Overview

> Parent: [Monorepo AGENTS.md](../../../AGENTS.md)

| Field      | Value                           |
| ---------- | ------------------------------- |
| **Type**   | Module Federation Container App |
| **Port**   | 3000                            |
| **Status** | Demo/Scaffold                   |

## Purpose

Module Federation variant of a container micro-frontend. Simpler alternative to SystemJS containers — no single-SPA lifecycle, no import map, no public path setup.

The container acts as a **host** that consumes remote micro-frontends (currently `mf_tile`) at runtime via Module Federation's declarative remote configuration.

## Key Features

- **Module Federation host** consuming `mf_tile` remote
- **No single-SPA dependency** — plain React app with federation
- **Shared React singletons** — `react` and `react-dom` loaded once across all remotes
- **Auto-generated type stubs** for remotes in `@mf-types/`

## Quick Start

```bash
cd apps/mf_container

npm run dev          # Start dev server on port 3000
npm run dev:debug    # Start with FEDERATION_DEBUG=true for MF debug logs
npm run build        # Production build via Rsbuild
npm run preview      # Serve production build locally
npm run lint         # ESLint
npm run format       # Prettier (write)
```

## Environment

Single `.env` file with `port=3000`. No `env-cmd`, no `.env.local`/`.env.server` split.
