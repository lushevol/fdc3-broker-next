# ratan-fdc3-resolver-ui — Project Overview

> Parent: [Monorepo AGENTS.md](../../../AGENTS.md)

| Field  | Value                                 |
| ------ | ------------------------------------- |
| Type   | NPM Package (FDC3 Intent Resolver UI) |
| Status | Active Development                    |

## Purpose

React components for the FDC3 intent resolution dialog. When multiple apps can handle an intent, this dialog lets users select which app should receive it. WCAG 2.1 AA accessible.

## Key Features

- **ResolverDialog** — Modal dialog presenting intent resolution choices
- **AppCard** — Target selector card for each resolving app
- **ContextPreview** — JSON display of the context being broadcast
- **Keyboard navigation** — Arrow keys, Home/End, Enter, Escape
- **Lazy loading utilities** — `lazyResolverDialog()`, `lazyAppCard()`, `lazyContextPreview()`
- **Error boundary integration** — `ResolverErrorBoundary`

## Peer Dependencies

- `react` >=16.9.0
- `@emotion/react` ^11
- `@emotion/styled` ^11
- `@mui/material` ^5

## Workspace Dependencies

- `ratan-fdc3-broker`

## Quick Start

```bash
# Development
cd packages/fdc3-resolver-ui && npm run dev

# Build
npm run build

# Test
npm test
```
