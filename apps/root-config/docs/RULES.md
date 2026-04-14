# @fm/root-config — Development Rules

> **Parent rules:** [../../docs/rules.md](../../docs/rules.md) | **Monorepo conventions:** [../../../AGENTS.md](../../../AGENTS.md)

## Module Format

- Output MUST be **SystemJS** (`library.type: 'system'`, `externalsType: 'system'`)
- React, ReactDOM, and single-spa MUST be externals resolved via import map
- No code splitting (`chunkSplit: false`, `runtimeChunk: false`, `splitChunks: false`)

## Import Map

- Adding a new MFE requires updating **both** `public/importmaplocal.json` and `public/importmap.json`
- Dev uses absolute localhost URLs; prod uses relative paths
- The import map key must match the MFE's `uniqueName` in its rsbuild config

## Environment Files

- `.env.local` is for `npm run dev` (read by `env-cmd`)
- `.env.server` is for `npm run build` (production build)
- **Never modify** `useBackendAuth` in `.env.local` to `false` for production

## Dev Server

- `dev-server.ts` contains all proxy and mock middleware
- When modifying mock data, update files in the workspace root (`login-resp.mock.json`, `fdc3-declaration.mock.json`, `category.mock.json`)
- The mock JWT signer uses a hardcoded RSA key for local dev only — **never use in production**

## HTML Template

- `src/index.ejs` uses EJS template parameters (`<%=publicUrl%>`, `<%=importmap%>`, `<%=isLocal%>`)
- Template has `inject: false` in rsbuild config — manual injection only
- Do not add inline scripts that depend on MFE modules (they may not be loaded yet)

## Layout

- `src/microfrontend-layout.html` declares which MFEs activate on which routes
- Currently only `@fm/base` is registered in the layout — all other MFEs are loaded dynamically by `@fm/base`

## File Naming

- Source files: `kebab-case` for config, `PascalCase` for components, `camelCase` for utilities
- Import map JSON keys: `@fm/<name>` for SystemJS modules, plain names for Module Federation ones

## Testing

- Run `npm test` before changes to ensure dev server middleware tests pass
- The `System.import` mock in `jest.setup.ts` is required for any test involving MFE loading
