# mf_tile — Architecture

> Parent: [Monorepo AGENTS.md](../../AGENTS.md)

## Tech Stack

| Layer        | Technology                                 |
| ------------ | ------------------------------------------ |
| UI Framework | React 18.3                                 |
| Build Tool   | Rsbuild (Rspack-based)                     |
| Federation   | `@module-federation/rsbuild-plugin` ^2.6.0 |
| Language     | TypeScript 5.9 (strict mode)               |

## Directory Structure

```
mf_tile/
├── .env                    # port=3001
├── @mf-types/              # Auto-generated type stubs (gitignored)
├── module-federation.config.ts
├── rsbuild.config.ts
├── tsconfig.json
├── public/
└── src/
    ├── App.tsx             # SimpleErrorBoundary + <h1>mf_tile</h1>
    ├── index.tsx           # Re-exports App (federation entry)
    └── env.d.ts            # Rsbuild type reference
```

## Module Federation Config

Defined in `module-federation.config.ts` using `createModuleFederationConfig`:

| Option       | Value                                                          |
| ------------ | -------------------------------------------------------------- |
| **name**     | `mf_tile` (from `package.json`)                                |
| **filename** | `mf_tile.js`                                                   |
| **exposes**  | `./src/index.tsx` as `'.'` (exports `App` component)           |
| **remotes**  | None — this is a remote provider only                          |
| **shared**   | `react` (singleton, ^18.3.1), `react-dom` (singleton, ^18.3.1) |

## Source Components

### `App.tsx`

- `SimpleErrorBoundary` — class-based error boundary that catches render errors and displays stack trace
- `App` — default export, renders children inside `SimpleErrorBoundary`

### `index.tsx`

- Re-exports `App` as the default — this is the Module Federation entry point

## Build Config

`rsbuild.config.ts`:

- **Plugins**: `pluginReact()` + `pluginModuleFederation(config)`
- **Server port**: read from `process.env.port` (`.env`)
- **Asset prefix**: `http://localhost:${port}/` — same pattern as `mf_container`

## TypeScript

- **Strict mode** enabled
- **Path mapping**: `@mf-types/*` for remote type resolution
- **Target**: ES2020 + DOM

## No Tests

No test framework is configured. Add Vitest or Jest if needed.
