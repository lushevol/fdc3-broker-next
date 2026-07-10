# mf_lib — Project Overview

> Parent: [Monorepo AGENTS.md](../../../AGENTS.md)

## Type

Shared React Component Library (Module Federation Remote), Port 3002

## Purpose

Built with Rslib, exposes React components at runtime via Module Federation for consumption by `mf_container` and `mf_tile`. Acts as a shared dependency host that provides UI components to micro-frontend consumers without bundling duplication.

## Status

Scaffold — currently contains a single demo `Provider` component. Not yet production-ready.

## Key Features

- **Triple output format** — ESM (`dist/esm`), CJS (`dist/cjs`), Module Federation (`dist/mf`) for maximum consumer compatibility
- **Design system token generation** — Integrated with ratan-design token system for consistent theming
- **Module Federation remote hosting** — Serves components at runtime for federated micro-frontends

## Quick Start

```bash
npm run dev       # Rslib watch mode (build on change)
npm run mf-dev    # Module Federation dev server (port from .env)
npm run build     # Production build (all three formats)
npm run lint      # ESLint (not yet configured)
npm run format    # Prettier (not yet configured)
```

## Package Version

0.0.0 (pre-release)

## Production CDN

When built with `NODE_ENV=production`, Module Federation assets are prefixed to:
`https://unpkg.com/mf_lib@latest/dist/mf/`
