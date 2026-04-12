# @fm/base

Shell UI micro-frontend. See [root AGENTS.md](../../AGENTS.md) for monorepo-wide context.

## Purpose

The main application shell that is always mounted. Provides login, navigation, FDC3 interop, chatbot sidebar, and re-exports shared components/hooks/utilities for consumption by other MFEs.

## Key Files

- `src/system-entry.ts` – Sets `__webpack_public_path__` from SystemJS context, then re-exports `root.tsx`
- `src/root.tsx` – Single-SPA lifecycle (`bootstrap`, `mount`, `unmount`), standalone rendering, and **all public re-exports** (components, hooks, services, theme, utils, FDC3)
- `src/App.tsx` – Root React component
- `src/services/index.ts` – API service layer
- `src/fdc3/` – FDC3 integration and agent exposure
- `src/next-packages/` – Internal shared code (components, hooks, utils); aliased as `@/` in Jest via `moduleNameMapper`
- `src/components/ChatbotSidebar/` – Chatbot UI (uses `@assistant-ui/react`)

## Conventions

- Outputs a **SystemJS** module (`library.type: 'system'`)
- React, ReactDOM, single-spa are **externals** resolved at runtime via import map
- `readMfeEnv()` in rsbuild config reads `.env.mfe` and injects vars as `process.env.*` at build time
- Env loading order: `npm run dev` → `.env.local`; `npm run build` → `.env.server`
- Has Storybook (`npm run build:storybook`)
- `.env.local` port: 8002

## Commands

```bash
npm run dev              # Dev server (env-cmd -f .env.local)
npm run build            # Build app + types
npm run build:app        # Build app only (env-cmd -f .env.server)
npm run test             # Jest with coverage
npm run watch-tests      # Jest --watch
npm run storybook        # Start Storybook dev server (port 6006)
npm run lint             # ESLint
```

## Re-exports (from `root.tsx`)

Other MFEs import from `@fm/base` at runtime. Major export namespaces:

- `ReactRouterDom`, `Analytics`, `Button`, `Dialog`, `Loader`, `Select`, `Snackbar`, `Splash`, etc.
- `Hooks`, `Dispatcher`, `Provider`, `Service`
- `FDC3Agent`, `Chatbot`
- `ThemeConfig`, `ThemeProvider`

## Jest Quirks

- `moduleNameMapper`: `@/` → `src/next-packages/`
- `@assistant-ui/react` is mocked via `__mocks__/@assistant-ui/react.tsx`
- `transformIgnorePatterns` explicitly allows `@assistant-ui`, `ai`, `zustand`, `nanoid`, `assistant-stream`
- Has `eslint-plugin-storybook` in devDeps

## Adding a new export

1. Add the component/hook in `src/components/` or `src/hooks/`
2. Add a re-export line in `src/root.tsx` using `export * as Name from './path'`
3. Other MFEs can then `System.import('@fm/base').then(mfe => mfe.Name)`
