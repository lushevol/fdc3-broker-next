# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a **Micro-Frontend (MFE)** monorepo using:

- **Single-SPA** for micro-frontend orchestration
- **Webpack Module Federation** for legacy MFEs
- **Rsbuild + @module-federation/rsbuild-plugin** for modern MFEs
- **npm** as package manager with workspace support
- **Turbo** for build orchestration and caching

### Workspace Structure

```
apps/           # Micro-frontend applications
├── base/           # Shared MFE with components, hooks, services (Webpack)
├── container/      # Container MFE (Webpack)
├── tile/           # Tile MFE example (Webpack)
├── root-config/    # Single-SPA root config (orchestrator)
├── mf_container/   # Container MFE (Rsbuild-based)
└── mf_tile/        # Tile MFE (Rsbuild-based)

packages/        # Shared libraries
├── fdc3-agent/       # FDC3 agent API
├── fdc3-app-directory/ # FDC3 app directory
├── fdc3-broker/      # FDC3 broker
├── fdc3-resolver-ui/ # FDC3 resolver UI
└── mf_lib/          # Modern library (Rslib)
```

### Key Concepts

**Root Config (`root-config`)**: Entry point using `single-spa-layout` to register and mount MFEs via `microfrontend-layout.html`.

**Base MFE (`base`)**: Utility-rich MFE exporting components, hooks, and services. Uses Webpack with `@module-federation/enhanced`.

**Rsbuild MFEs (`mf_container`, `mf_tile`)**: Modern MFEs using Rsbuild with `@module-federation/rsbuild-plugin` for Module Federation.

**Workspace Packages (`packages/*`)**: Shared libraries built with tsup (FDC3 packages) or Rslib (mf_lib).

**Single-SPA Lifecycle**: Each MFE exports `bootstrap`, `mount`, and `unmount` lifecycles via `single-spa-react`.

## Development Commands

### Root-level commands

```bash
# Run all apps in development mode
npm run dev

# Build all apps and packages
npm run build

# Run all tests
npm run test

# Lint all apps
npm run lint

# Clean all build artifacts
npm run clean

# Code formatting with Biome
npm run check

# Stop all dev servers
npm run stop
```

### Webpack MFEs (base, container, tile, root-config)

```bash
cd apps/<app-name>

# Development with federation debug
npm run dev

# Standalone dev (no federation)
npm run start:standalone

# Build
npm run build

# Test (Jest)
npm run test
npm run watch-tests    # Watch mode

# Storybook (base only)
npm run storybook
```

### Rsbuild MFEs (mf_container, mf_tile)

```bash
cd apps/<app-name>

# Development
npm run dev

# Development with federation debug
npm run dev:debug

# Build
npm run build
```

### Workspace Packages

```bash
cd packages/<package-name>

# Development with watch
npm run dev

# Build with tsup
npm run build

# Test (Vitest)
npm run test
npm run test:coverage
```

## Module Federation Configuration

- **Webpack MFEs**: `apps/*/module-federation.config.{js,ts}`
- **Rsbuild MFEs**: `apps/*/module-federation.config.ts` (uses `createModuleFederationConfig()`)
- **Rslib packages**: `packages/*/module-federation.config.ts`

Remote format:

```javascript
remotes: {
  remoteName: 'remoteName@http://localhost:PORT/mf-manifest.json',
}
```

## Important Files

- **Root layout**: `apps/root-config/src/microfrontend-layout.html`
- **Entry points**: `apps/*/src/root.{ts,tsx}` (Single-SPA lifecycles)
- **Build config**: `turbo.json`

## Testing

- **Webpack MFEs**: Jest with `@testing-library/react`
- **Packages**: Vitest

## Package Management

Always run `npm run install` from root. Some apps have `resolutions` in package.json to pin dependency versions (webpack, glob, ws) for compatibility.
