# @fm/template — Project Overview

> Parent: [Monorepo AGENTS.md](../../../AGENTS.md)

## Type

Single-SPA Template Tile App | Port 8006

## Purpose

Template/scaffold for creating new **tile** micro-frontend apps. Tiles are small widget MFEs displayed inside containers or workspaces (e.g., FDC3 listeners, dashboards, trade panels).

## Status

**Template** — copy and rename to scaffold new tiles. Not a production app itself.

## Key Features

- **SystemJS module output** — loaded at runtime by `root-config` via import map
- **FDC3 integration demo** — `ExampleFDC3Tile.tsx` demonstrates intent raising/listening, context broadcasting, and channel management using `ratan-fdc3-agent`
- **@fm/base shared shell import pattern** — `Root/import/index.ts` destructures 40+ exports from `@fm/base`
- **OpenFin desktop container support** — `@openfin/core` dependency for desktop integration
- **MUI v5** + **Emotion** — UI components and styling
- **Multiple sub-tiles** — `Tile1`, `FDC3Tile1`, `FDC3Tile2` demonstrating tile routing patterns
- **TileProps interface** — standardized props for tiles embedded in containers (`id`, `container`, `module`, `tile`, `title`, `subtitle`, `parameters`, `emailSupport`, `panelId`, `tabId`)

## Quick Start

```bash
# Development (uses .env.local, port 8006)
npm run dev

# Production build (uses .env.server)
npm run build

# Run tests (Jest, --passWithNoTests)
npm run test

# Lint
npm run lint
```

## Monorepo Dependencies

| Package            | Type                          | Usage                                                     |
| ------------------ | ----------------------------- | --------------------------------------------------------- |
| `ratan-fdc3-agent` | Runtime dependency            | FDC3 2.2 interop hooks (useFDC3, useIntentListener, etc.) |
| `@fm/base`         | Runtime external (import map) | Shared shell UI, routing, providers, utilities            |

`react`, `react-dom`, and `single-spa` are externals resolved at runtime.

## Environment Files

| File          | Purpose                      | Key Vars                                                                         |
| ------------- | ---------------------------- | -------------------------------------------------------------------------------- |
| `.env.local`  | Local dev server             | `port=8006`, `mode=development`, `devtool=source-map`                            |
| `.env.server` | Production build             | `port=8006`, `mode=production`, `devtool=false`, `DEFAULT_TIMEOUT`, `FILE_LIMIT` |
| `.env.mfe`    | MFE-specific build-time vars | `MFE_APP_TARGET_ROOT='MicroWebUI_template'`, `MFE_APP_PREFIX_STYLE='MicroWebUI'` |

Environment loading uses `env-cmd`: dev commands read `.env.local`, build commands read `.env.server`. MFE vars in `.env.mfe` are injected at build time.
