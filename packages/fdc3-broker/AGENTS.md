# ratan-fdc3-broker

FDC3 2.2 broker implementation. See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

Core FDC3 2.2 broker that manages intent routing and context broadcasting between MFE tiles. Central to the FDC3 interop architecture.

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
- Depends on `@finos/fdc3` and `ratan-fdc3-app-directory`

## Important

- This is a core dependency for `ratan-fdc3-agent` and `ratan-fdc3-resolver-ui`
- Must be built before downstream packages (Turbo `^build` handles this)
- Contains React dependency as a `devDependency` for testing (not a peer dep runtime dependency)
