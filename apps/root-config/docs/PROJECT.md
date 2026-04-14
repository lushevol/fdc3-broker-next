# @fm/root-config — Project Overview

> **Parent:** [mfe-next Monorepo](../../../AGENTS.md) | **Type:** Single-SPA Orchestrator App | **Port:** 8001

## Purpose

`@fm/root-config` is the top-level host application that bootstraps the entire micro-frontend platform. It serves the master HTML page, loads the SystemJS import map, parses the micro-frontend layout, registers all MFE applications with single-spa, and starts the routing engine. It does **not** render any UI itself — it is purely the orchestration shell.

## Status

Production — core infrastructure app. Must be running for any MFE to load.

## Key Features

- **Import map loading** — Reads `importmaplocal.json` (dev) or `importmap.json` (prod) to resolve MFE modules at runtime
- **Single-SPA lifecycle orchestration** — Registers MFEs and calls `single-spa.start()`
- **Layout-driven routing** — Parses `microfrontend-layout.html` to determine which MFEs activate on which routes
- **Dev proxy server** — Proxies API calls to backend services (auth, BFF, chat, analytics, SSE) during local development
- **Mock middleware** — Provides mock auth and FDC3 endpoints when `useBackendAuth=false`
- **JWT token generation** — Local RS512 JWT signing for dev auth mock

## Quick Start

```bash
# From workspace root
npm run dev:ui        # Starts all UI apps including root-config

# From this workspace
npm run dev           # Starts dev server with .env.local
npm run build         # Production build with .env.server
npm test              # Jest with coverage
```

## Monorepo Dependencies

- No workspace package dependencies — this is the root orchestrator
- All MFE apps (`@fm/base`, `@fm/template_container`, `@fm/template`, `mf_container`, `mf_tile`) are loaded via import map at runtime

## Environment Files

| File          | Mode | Key Variables                                                                                      |
| ------------- | ---- | -------------------------------------------------------------------------------------------------- |
| `.env.local`  | Dev  | `orgName=fm`, `isLocal=true`, `importmap=/importmaplocal.json`, `port=8001`, `useBackendAuth=true` |
| `.env.server` | Prod | `orgName=fm`, `isLocal=false`, `importmap=/importmap.json`, `devtool=false`                        |
