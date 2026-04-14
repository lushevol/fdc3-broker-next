# mf_tile — Rules & Conventions

> Parent rules: [Monorepo docs/rules.md](../../../docs/rules.md) · [Monorepo AGENTS.md](../../../AGENTS.md)

## Module Format

This workspace is a **Module Federation remote provider** (NOT SystemJS). It exposes components for hosts to consume at runtime. No import map, no single-SPA.

## Exposing Modules

Currently exposes only `./src/index.tsx` as the default export (`'.'`). To expose additional modules:

```ts
// module-federation.config.ts
exposes: {
  '.': './src/index.tsx',
  './ComponentName': './src/components/ComponentName.tsx',
},
```

## Shared Dependencies

Always share `react` and `react-dom` as **singletons** to prevent duplicate React instances across host and remote:

```ts
shared: {
  react:      { singleton: true, requiredVersion: '...' },
  'react-dom': { singleton: true, requiredVersion: '...' },
},
```

Note: `eager: true` is **not** set on the remote side — only the host sets eager loading.

## Environment

Single `.env` file with `port=3001`. No `env-cmd`, no `.env.local`/`.env.server` split, no `readMfeEnv()`.

## No Single-SPA

No lifecycle methods, no SystemJS, no import map. This is a plain React component exposed via Module Federation. Do not add single-SPA wrappers or import map entries.

## Adding Components

New components should follow the `React.FC` pattern. Keep them in `src/` and import types from `@mf-types/` for remote reference.

## Error Boundary

Wrap all remote-loaded content in `SimpleErrorBoundary` as demonstrated in `src/App.tsx`. This prevents a failing remote from crashing the host application.

## Asset Prefix

`assetPrefix` in `rsbuild.config.ts` is hardcoded to `http://localhost:${port}/`. Must be parameterized before production deployment.
