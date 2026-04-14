# ratan-fdc3-app-directory — Project Overview

> Parent: [Monorepo AGENTS.md](../../../AGENTS.md)

| Field  | Value                                   |
| ------ | --------------------------------------- |
| Type   | NPM Package (FDC3 App Directory Client) |
| Status | Active Development                      |

## Purpose

TypeScript client for querying the FDC3 App Directory service. Includes an HTTP client (`AppDirectoryClientImpl`) and an in-memory mock (`MockAppDirectoryService`) for development and testing.

## Key Features

- **AppDirectoryClientImpl** — HTTP client using Fetch API with Bearer token auth and timeout support
- **MockAppDirectoryService** — In-memory implementation for local development and tests
- **Three modes** — remote-only (default, HTTP), local-only (mock), local-first (mock with HTTP fallback)
- **Bearer token auth** — Configurable `getAuthToken()` function
- **Timeout support** — Configurable request timeout

## Monorepo Dependencies

None — this package is standalone within the monorepo.

## Quick Start

```bash
# Development
cd packages/fdc3-app-directory && npm run dev

# Build
npm run build

# Test
npm test
```
