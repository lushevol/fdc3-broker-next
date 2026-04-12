# mf_lib

Shared React component library (Module Federation remote). See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

Rslib-built shared React component library. Exposes components via Module Federation for consumption by `mf_container` and `mf_tile`.

## Key Files

- `src/index.tsx` – Main entry, exports all shared components
- `src/index.css` – Shared styles
- `rslib.config.ts` – Rslib build configuration with MF plugin

## Conventions

- Built with **Rslib** (not Rsbuild) – outputs ES module format
- Peer dependencies: `react` >=16.9.0, `react-dom` >=16.9.0
- `npm run dev` runs `rslib build --watch` (watch mode, not a dev server)
- Has `.env` file for build-time variables

## Commands

```bash
npm run build    # Rslib production build
npm run dev      # Rslib watch mode (build on change)
npm run mf-dev   # Rslib Module Federation dev mode
```

## Important

- No tests or lint configured yet (add as needed)
- Must be built before apps that depend on it (Turbo `^build` dependency handles this)
- Output goes to `dist/` – `index.js` and `index.d.ts`
