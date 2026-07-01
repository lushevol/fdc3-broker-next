# @fm/root-config

Single-SPA root config orchestrator. See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

Mounts the single-spa layout, loads the import map, and registers/starts all micro-frontend apps. Does not render UI itself.

## Key Files

- `src/root.ts` – Entry: parses `microfrontend-layout.html`, registers apps, starts single-spa
- `src/microfrontend-layout.html` – Defines which MFEs load on which routes
- `public/importmaplocal.json` – Dev import map (localhost URLs for all MFEs)
- `public/importmap.json` – Production import map
- `src/index.ejs` – HTML template (EJS, not standard HTML)
- `dev-server.ts` – Dev proxy and middleware setup

## Conventions

- Outputs a **SystemJS** module (`library.type: 'system'` in rsbuild)
- `single-spa` is an external, resolved at runtime via import map
- Uses EJS templating for HTML (not standard rsbuild HTML handling)
- Build produces `config.js` as the output bundle (see `output.filename.js` in rsbuild)
- Dev server uses `env-cmd -f .env.local` for local dev
- Port from `.env.local` (default: 8001)

## Commands

```bash
npm run dev       # Start dev server (reads .env.local)
npm run build     # Build app + types for production
npm run test      # Jest (passWithNoTests)
npm run lint      # ESLint
```

## Important

- When adding a new MFE, update **both** `importmaplocal.json` and `importmap.json` with the app name and URL
- The `dev-server.ts` file contains proxy setup and cross-MFE local API mock behavior – modifying this changes how dev traffic routes
- Add captured-response/mock API behavior here in root-config, with payloads under `mock/`; do **not** put overall local devserver mocks in individual MFE `server/` folders
- `isLocal` and `importmap` env vars control whether dev or prod import map is used
