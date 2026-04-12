# ratan-fdc3-app-directory

FDC3 App Directory client. See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

Client library for the FDC3 App Directory – resolves app metadata and directory entries for the FDC3 interop layer.

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
- Two entry points: `.` (main) and `./mock` (mock implementations for testing)
- Output: `dist/index.js` + `dist/index.d.ts` and `dist/mock.js` + `dist/mock.d.ts`
- Testing with **Vitest** (`happy-dom`)
- Peer dependencies: `react` >=16.9.0, `react-dom` >=16.9.0
- Depends on `@finos/fdc3`

## Important

- The `./mock` export provides test doubles – use it in test environments:
  ```ts
  import { something } from 'ratan-fdc3-app-directory/mock';
  ```
- Must be built before apps that import it
