# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a **Micro-Frontend (MFE)** monorepo using:

- **Single-SPA** for micro-frontend orchestration
- **Webpack Module Federation** for legacy MFEs
- **Rsbuild + @module-federation/rsbuild-plugin** for modern MFEs
- **pnpm** as package manager with workspace support
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
pnpm dev

# Build all apps and packages
pnpm build

# Run all tests
pnpm test

# Lint all apps
pnpm lint

# Clean all build artifacts
pnpm clean

# Code formatting with Biome
pnpm check

# Stop all dev servers
pnpm stop
```

### Webpack MFEs (base, container, tile, root-config)

```bash
cd apps/<app-name>

# Development with federation debug
pnpm dev

# Standalone dev (no federation)
pnpm start:standalone

# Build
pnpm build

# Test (Jest)
pnpm test
pnpm watch-tests    # Watch mode

# Storybook (base only)
pnpm storybook
```

### Rsbuild MFEs (mf_container, mf_tile)

```bash
cd apps/<app-name>

# Development
pnpm dev

# Development with federation debug
pnpm dev:debug

# Build
pnpm build
```

### Workspace Packages

```bash
cd packages/<package-name>

# Development with watch
pnpm dev

# Build with tsup
pnpm build

# Test (Vitest)
pnpm test
pnpm test:coverage
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

Always run `pnpm install` from root. Some apps have `resolutions` in package.json to pin dependency versions (webpack, glob, ws) for compatibility.
