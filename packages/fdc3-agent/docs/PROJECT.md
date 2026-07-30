# ratan-fdc3-agent — Project Overview

> Parent: [Monorepo AGENTS.md](../../../AGENTS.md)

| Field  | Value                             |
| ------ | --------------------------------- |
| Type   | NPM Package (FDC3 2.2 Client API) |
| Status | Active Development                |

## Purpose

Client-side FDC3 Agent that tiles use to interact with FDC3 operations. Acts as a proxy/delegate forwarding all calls to the central Broker running in the base MFE.

## Key Features

- **AgentProvider** — React context that creates a `ScopedDesktopAgent` for one explicit child identity
- **useFDC3** — Hook returning the scoped `DesktopAgent`
- **useIntentListener** / **useContextListener** — Hooks for registering FDC3 listeners that auto-cleanup
- **useCurrentChannel** / **useUserChannels** / **useAppIdentifier** — Channel & identity hooks
- **ScopedDesktopAgent** — Wraps every FDC3 call to inject the tile's `AppIdentifier` as `source`
- **ErrorBoundary** — Re-exported from `ratan-fdc3-broker` with `theme="agent"`
- **Auto-retry** — Polls every 100 ms until the broker becomes available
- **Concurrent child isolation** — No mutable global "current tile" identity

## Peer Dependencies

- `react` >=16.9.0

## Workspace Dependencies

- `ratan-fdc3-broker`

## Quick Start

```bash
# Development
cd packages/fdc3-agent && npm run dev

# Build
npm run build

# Test
npm test
```
