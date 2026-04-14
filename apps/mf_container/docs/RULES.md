# mf_container — Rules & Conventions

> Parent rules: [Monorepo docs/rules.md](../../../docs/rules.md) · [Monorepo AGENTS.md](../../../AGENTS.md)

## Module Format

This workspace uses **Module Federation** (NOT SystemJS). No `importmaplocal.json`, no `system-entry.ts`, no public path setup.

## Remote Consumption

Add remotes in `module-federation.config.ts` using the manifest URL pattern:

```ts
remotes: {
  remote_name: 'remote_name@http://localhost:{port}/mf-manifest.json',
},
```

Type stubs are auto-generated in `@mf-types/` — the `tsconfig.json` paths mapping resolves `mf_tile/*` imports to these stubs.

## Shared Dependencies

Always share `react` and `react-dom` as **singletons with `eager: true`**:

```ts
shared: {
  react:      { singleton: true, eager: true, requiredVersion: '...' },
  'react-dom': { singleton: true, eager: true, requiredVersion: '...' },
},
```

This prevents duplicate React instances across host and remotes.

## Environment

Single `.env` file. No `env-cmd`, no `.env.local`/`.env.server` split, no `readMfeEnv()`. Port defaults to 3000.

## No Single-SPA

This is a plain React app that consumes Module Federation remotes. Do not add:

- single-SPA lifecycle methods (`bootstrap`, `mount`, `unmount`)
- `system-entry.ts` or `__system_context__`
- Import map entries in `root-config/public/importmaplocal.json`

## Adding New Remotes

1. Add the remote to `remotes` in `module-federation.config.ts`
2. Import the remote component in `src/App.tsx` (or a new component)
3. Type stubs in `@mf-types/` will generate automatically on next build

## Asset Prefix

`assetPrefix` in `rsbuild.config.ts` is currently hardcoded to `http://localhost:${port}/`. This **must be parameterized** for production deployment via an environment variable or build-time configuration.
