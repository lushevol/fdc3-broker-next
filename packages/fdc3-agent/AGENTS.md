# ratan-fdc3-agent

FDC3 2.2 Agent API for MFE tiles. See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

Provides the FDC3 agent interface that tiles use to communicate via FDC3 intents and contexts. Depends on `ratan-fdc3-broker`.

## Commands

```bash
npm run build    # tsup production build
npm run dev      # tsup --watch
npm run test     # Vitest run
npm run lint     # ESLint
npm run format   # Prettier write
npm run clean    # rm -rf dist
```

## Conventions

- Built with **tsup** (bundles to ESM)
- Output: `dist/index.js` + `dist/index.d.ts`
- Testing with **Vitest** (`happy-dom`)
- Peer dependencies: `react` >=16.9.0, `react-dom` >=16.9.0
- Depends on `@finos/fdc3` and `ratan-fdc3-broker`

## Important

- Must be built before apps that import it (Turbo `^build` dependency)
- `clean` script removes `dist/` – useful before fresh builds
