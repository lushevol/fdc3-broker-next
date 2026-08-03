# ratan-fdc3-broker — Project Overview

> Parent: [Monorepo AGENTS.md](../../../AGENTS.md)

| Field  | Value                                                     |
| ------ | --------------------------------------------------------- |
| Type   | NPM Package (FDC3 2.2 DesktopAgent Broker Implementation) |
| Status | Active Development (core DesktopAgent surface implemented) |

## Purpose

Core server-side FDC3 2.2 `DesktopAgent` implementation managing intent routing, context broadcasting, channel management, tile lifecycle, entitlement validation, OpenFin bridging, and PostMessage bridging.

## Key Features

- **Full FDC3 2.2 DesktopAgent** — All 17 methods implemented
- **Intent routing** with resolver UI
- **Context broadcasting** via user, app, and private channels
- **Tile registration / lifecycle** — `registerTile` / `unregisterTile` tracks mounting state
- **Entitlement validation** — All operations checked through `EntitlementValidator`
- **Intent queuing** for pre-login tiles (localStorage-backed)
- **OpenFin bridge** — Auto-detects and bridges to OpenFin FDC3
- **PostMessage bridge** — Bridges FDC3 calls from iframe tiles
- **ErrorBoundary** — React component with agent/broker/resolver themes
- **Performance tracking** — Built-in timing for FDC3 operations

## Workspace Dependencies

- `ratan-fdc3-app-directory`

## Quick Start

```bash
# Development
cd packages/fdc3-broker && npm run dev

# Build
npm run build

# Test
npm test
```
