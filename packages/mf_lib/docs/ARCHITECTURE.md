# mf_lib — Architecture

> Parent: [Monorepo AGENTS.md](../../AGENTS.md)

## Tech Stack

| Layer      | Technology                                |
| ---------- | ----------------------------------------- |
| UI         | React 18.3                                |
| Build      | Rslib 0.19.x                              |
| Federation | Module Federation (rsbuild plugin 0.22.x) |
| Language   | TypeScript 5.9                            |
| Styling    | CSS (index.css)                           |

## Directory Structure

```
mf_lib/
├── src/
│   ├── index.tsx        # Main entry — Provider component (default export)
│   └── index.css        # Shared styles (gradient background, animations)
├── dist/
│   ├── esm/             # ESM output
│   ├── cjs/             # CommonJS output
│   └── mf/              # Module Federation remote output
├── rslib.config.ts      # Build config (three formats)
├── module-federation.config.ts  # MF exposes & shared deps
├── package.json         # Exports point to ESM dist
├── tsconfig.json
└── .env                 # Build-time variables (port, etc.)
```

## Build Configuration (`rslib.config.ts`)

Three library output formats:

1. **ESM** — `format: 'esm'`, output to `dist/esm/`
2. **CJS** — `format: 'cjs'`, output to `dist/cjs/`
3. **MF** — `format: 'mf'`, output to `dist/mf/`, with conditional `assetPrefix`:
   - Production: `https://unpkg.com/mf_lib@latest/dist/mf/`
   - Development: no prefix (served locally)

All formats share `dts: { bundle: false }` — individual `.d.ts` files are emitted, not bundled.

Plugins: `pluginReact()`, `pluginModuleFederation(moduleFederationConfig)` using the current `@module-federation/*` release line

## Module Federation Configuration (`module-federation.config.ts`)

```
name:    "mf_lib"
exposes: { ".": "./src/index.tsx" }
shared:  { react: { singleton: true }, react-dom: { singleton: true } }
```

Created via `createModuleFederationConfig()`.

## Package Exports

```json
{
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js"
  }
}
```

The `module` field also points to `./dist/index.js` for legacy ESM consumers.

## Peer Dependencies

- `react` >=16.9.0
- `react-dom` >=16.9.0

These are also declared as `shared: { singleton: true }` in the Module Federation config to prevent duplicate React instances at runtime.

## Current Component: Provider

A demo placeholder that renders:

- A `div.container` with animated gradient background (`linear-gradient(45deg, #3a65f2, #6a5acd, #8a2be2, #023cfc)`)
- Module Federation logo (`https://module-federation.io/svg.svg`)
- Heading: "Hello Module Federation 2.0"

Exported as `default` from `src/index.tsx`.

## Testing

No test framework configured. No lint or format scripts defined beyond Rslib defaults.
