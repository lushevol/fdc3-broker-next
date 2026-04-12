# ratan-fdc3-resolver-ui

FDC3 intent resolver UI component. See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

React component that renders the FDC3 intent resolution UI – the dialog where users choose which app should handle an intent.

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
- Peer dependencies: `@emotion/react` ^11, `@emotion/styled` ^11, `@mui/material` ^5, `react` >=16.9.0, `react-dom` >=16.9.0
- Depends on `@finos/fdc3` and `ratan-fdc3-broker`

## Important

- Requires MUI and Emotion as peer dependencies – the consuming app must provide these
- Must be built before apps that import it
