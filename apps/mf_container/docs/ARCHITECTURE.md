# mf_container — Architecture

> Parent: [Monorepo AGENTS.md](../../AGENTS.md)

## Tech Stack

| Layer        | Technology                                 |
| ------------ | ------------------------------------------ |
| UI Framework | React 18.3                                 |
| Build Tool   | Rsbuild (Rspack-based)                     |
| Federation   | `@module-federation/rsbuild-plugin` ^2.0.1 |
| Language     | TypeScript 5.9 (strict mode)               |

## Directory Structure

```
mf_container/
├── .env                    # port=3000
├── @mf-types/              # Auto-generated remote type stubs
├── module-federation.config.ts
├── rsbuild.config.ts
├── tsconfig.json
├── public/
└── src/
    ├── App.tsx             # Root component — renders <MfTile>
    ├── index.tsx           # Re-exports App (federation entry)
    └── env.d.ts            # Rsbuild type reference
```

## Module Federation Config

Defined in `module-federation.config.ts` using `createModuleFederationConfig`:

| Option       | Value                                                                        |
| ------------ | ---------------------------------------------------------------------------- |
| **name**     | `mf_container` (from `package.json`)                                         |
| **filename** | `mf_container.js`                                                            |
| **exposes**  | `./src/index.tsx` as `'.'`                                                   |
| **remotes**  | `mf_tile` → `mf_tile@http://localhost:3001/mf-manifest.json`                 |
| **shared**   | `react` (singleton, eager, ^18.3.1), `react-dom` (singleton, eager, ^18.3.1) |

## Build Config

`rsbuild.config.ts`:

- **Plugins**: `pluginReact()` + `pluginModuleFederation(config)`
- **Server port**: read from `process.env.port` (`.env`)
- **Asset prefix**: `http://localhost:${port}/` — hardcoded for dev, must be parameterized for production

## TypeScript

- **Strict mode** enabled (`strict`, `noUnusedLocals`, `noUnusedParameters`)
- **Module resolution**: Bundler mode
- **Path mapping**: `@mf-types/*` for auto-generated remote type stubs
- **Target**: ES2020 + DOM

## No Tests

No test framework is configured. Add Jest or Vitest if needed.

## Key Difference from SystemJS Containers

| Concern       | SystemJS Container                       | Module Federation Container       |
| ------------- | ---------------------------------------- | --------------------------------- |
| Module format | SystemJS (`library.type: 'system'`)      | Module Federation (Rspack plugin) |
| Entry file    | `system-entry.ts` with public path setup | `src/index.tsx` (plain re-export) |
| Import map    | `importmaplocal.json` required           | Not needed — remotes in config    |
| Lifecycle     | single-SPA `bootstrap/mount/unmount`     | None — plain React app            |
| Shared deps   | Import map externals                     | `shared` in federation config     |
