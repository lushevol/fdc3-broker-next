# mf_lib — Rules & Conventions

> Parent rules: [Monorepo AGENTS.md](../../AGENTS.md) · [Monorepo rules](../../docs/rules.md)

## Module Federation

- This package is a **remote provider**. Add new exposes in `module-federation.config.ts` under the `exposes` key.
- Each exposed path maps a public name to a local source file: `exposes: { "./ComponentName": "./src/ComponentName.tsx" }`

## Output Formats

- Always build **all three formats** (ESM, CJS, MF) for maximum compatibility. Do not remove a format from `rslib.config.ts` without explicit requirement.
- The ESM output is the primary npm consumption target. The MF output is for runtime federation.

## Shared Dependencies

- `react` and `react-dom` are **peer dependencies** and are shared as **singletons** in the Module Federation config. Never bundle them — always declare as external/shared.
- When adding a new shared dependency, update both `package.json` (peerDependencies) and `module-federation.config.ts` (shared).

## Adding New Components

1. Create the component file in `src/` (e.g., `src/Button.tsx`)
2. Export from `src/index.tsx`
3. Use `React.FC` type pattern with named exports
4. Add companion CSS in `src/` if needed
5. Add the component to `exposes` in `module-federation.config.ts`
6. Rebuild (`npm run build`) before consumers can pick it up

## Type Declarations

- DTS is configured with `bundle: false` — individual `.d.ts` files are emitted per source file, not a single bundled declaration file.
- Do not change this setting unless consumers specifically need bundled types.

## Consumption by Hosts

- `mf_container` and `mf_tile` reference this package as a remote:
  ```
  mf_lib@http://localhost:3002/mf-manifest.json
  ```
- The import map must be updated when new exposes are added.

## Production Asset Prefix

- Set via `NODE_ENV=production` in `rslib.config.ts` to `https://unpkg.com/mf_lib@latest/dist/mf/`
- For local development, no asset prefix is applied — assets are served from the dev server.
- Deployed assets must be published to npm for the unpkg CDN to serve them.
