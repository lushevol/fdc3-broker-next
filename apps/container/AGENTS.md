# @fm/template_container

Template container MFE. See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

Template/scaffold for creating new **container** micro-frontend apps. Containers host business logic, grids, and dashboards (e.g., trade blotters, cashflow grids).

## Key Files

- `src/system-entry.ts` – Sets `__webpack_public_path__`, exports `root.tsx`
- `src/root.tsx` – Re-exports from `App.tsx`
- `src/App.tsx` – Root React component
- `src/Root/routing/` – Routing setup for workspace tabs
- `src/Root/import/` – Dynamic imports for child tiles

## Conventions

- Outputs a **SystemJS** module (`library.type: 'system'`)
- React, ReactDOM, single-spa are **externals** resolved at runtime
- Uses `env-cmd -f .env.local` for dev, `env-cmd -f .env.server` for production builds
- Port: `.env.local` specifies (expected: 8007)
- Uses Less (via `@rsbuild/plugin-less`)
- Dependencies include `ag-grid-community`/`ag-grid-enterprise` and `antd` (Ant Design) for data grids

## Commands

```bash
npm run dev       # Dev server (env-cmd -f .env.local)
npm run build     # Build app + types
npm run test      # Jest with coverage (passWithNoTests)
npm run lint      # ESLint
```

## Creating a new container from this template

1. Copy `apps/container` to `apps/<your_container_name>`
2. Update `package.json` name, port in `.env.local`
3. Update rsbuild config `output.uniqueName` and entry name
4. Add entry to `root-config/public/importmaplocal.json` and `importmap.json`
5. Add the MFE to `root-config/src/microfrontend-layout.html` if needed
