# @fm/template

Template tile MFE. See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

Template/scaffold for creating new **tile** micro-frontend apps. Tiles are smaller, modular UI widgets (e.g., for dashboards or OpenFin windows).

## Key Files

- `src/system-entry.ts` – Sets `__webpack_public_path__`, exports root module
- `.env.local` / `.env.server` / `.env.mfe` – Environment configs

## Conventions

- Outputs a **SystemJS** module (`library.type: 'system'`)
- React, ReactDOM, single-spa are **externals** resolved at runtime
- Uses `env-cmd -f .env.local` for dev, `env-cmd -f .env.server` for production builds
- `.env.mfe` vars are injected at build time
- Port: 8006 (from `.env.local`)

## Commands

```bash
npm run dev       # Dev server (env-cmd -f .env.local)
npm run build     # Build app + types
npm run test      # Jest with coverage (passWithNoTests)
npm run lint      # ESLint
```

## Creating a new tile from this template

1. Copy `apps/tile` to `apps/<your_tile_name>`
2. Update `package.json` name, port in `.env.local`
3. Update rsbuild config `output.uniqueName` and entry name
4. Add entry to `root-config/public/importmaplocal.json` and `importmap.json`
5. Register in base app's tile menu
