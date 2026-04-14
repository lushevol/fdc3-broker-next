# @fm/base — Rules & Conventions

> Parent rules: [../../docs/rules.md](../../docs/rules.md) | [Monorepo AGENTS.md](../../AGENTS.md)

## Module Format

- Output **must** be SystemJS (`library.type: 'system'`).
- React, ReactDOM, and single-spa are **externals** — resolved at runtime via import map, never bundled.
- `html: false` — this app produces a JS module, not an HTML page.
- Chunk splitting and runtime chunks are **disabled** — Single-SPA manages loading.

## Import Conventions

- `@fm/base` is the **shared shell** — other MFEs import from it via `System.import('@fm/base')`.
- All public APIs are re-exported from `root.tsx` using `export * as Name from './path'`.
- To add a new export:
  1. Create the component/hook in `src/components/` or `src/hooks/`
  2. Add `export * as Name from './path'` in `root.tsx`
  3. Consumers use `System.import('@fm/base').then(mfe => mfe.Name)`
- Never import from `@fm/base` internals — only from the public re-exports.

## Environment Handling

| File          | Command                    | Mechanism                                                       |
| ------------- | -------------------------- | --------------------------------------------------------------- |
| `.env.local`  | `npm run dev`, `npm start` | `env-cmd -f .env.local`                                         |
| `.env.server` | `npm run build:app`        | `env-cmd -f .env.server`                                        |
| `.env.mfe`    | All builds                 | `readMfeEnv()` in `rsbuild.config.ts` → `process.env.*` defines |

- `.env.mfe` variables are injected at **build time** via Rsbuild `source.define`, not available at runtime.
- `.env.local` and `.env.server` are loaded by `env-cmd` at **process start**.
- Never commit secrets to `.env.*` files — use CI/CD secrets or vault.

## Component Organization

| Location                                     | Purpose                                                       |
| -------------------------------------------- | ------------------------------------------------------------- |
| `src/pages/`                                 | Route-level page components (Home, Login)                     |
| `src/components/`                            | Reusable UI components (AppBar, Drawer, Button, Dialog, etc.) |
| `src/next-packages/components/ui/`           | Next-gen shared UI components                                 |
| `src/next-packages/components/assistant-ui/` | Assistant-UI primitives (modal, thread)                       |
| `src/next-packages/hooks/`                   | Next-gen shared hooks                                         |
| `src/next-packages/lib/`                     | Shared utility libraries                                      |

- Pages belong in `pages/`. Shared components belong in `components/`.
- "Next-gen" components (aliased as `@/`) live in `next-packages/` and represent the evolving design system.

## State Management

- Use `AppContext`/`useContext` pattern from `hooks/provider/`.
- The app uses **React Context + useReducer** — do not introduce Redux, Zustand, or other external state libraries without team approval.
- Reducers and action types live in `hooks/reducer/`.
- Service hooks for data fetching live in `hooks/service/`.

## FDC3 Rules

- Always use `ratan-fdc3-agent` hooks: `useFDC3`, `useIntentListener`, `useUserChannels`, `AgentProvider`.
- **Never** access the FDC3 Broker directly from tiles — go through the agent hooks exposed via `FDC3Agent` namespace.
- FDC3 configuration lives in `FDC3Integration.tsx` — broker, resolver, and app directory are initialized there.
- To register a new intent: add a listener in `FDC3Integration` or a tile using `useIntentListener`.

## Chatbot Rules

- Tool routes **must** be registered in `AssistantUIRuntimeProvider` via `useRegisterAssistantTools`.
- SSE streaming uses the `fetchSSE` adapter — this is the canonical stream handler. Do not use `fetch` directly for chat endpoints.
- Frontend tools use `createFrontendToolRegistry` to compose toolkits (`createFdc3IntentToolkit`, `createWorkspaceSummaryToolkit`).
- Generative UI components must be registered via `useRegisterGenerativeComponent` inside `GenerativeUIProvider`.

## Testing

- Use **Jest** with `babel-jest` transform and `jsdom` environment.
- Mock `System.import` in tests — tiles load modules dynamically at runtime.
- `moduleNameMapper` maps `@/` → `src/next-packages/` in Jest. Use this alias in imports.
- `@assistant-ui/react` is mocked via `__mocks__/@assistant-ui/react.tsx`.
- `transformIgnorePatterns` whitelists `@assistant-ui`, `ai`, `zustand`, `nanoid`, `assistant-stream`.
- Run: `npm run test` (coverage + CI mode) or `npm run watch-tests` (watch mode).

## Path Aliases

| Alias                 | Resolves To                         | Config                                                    |
| --------------------- | ----------------------------------- | --------------------------------------------------------- |
| `@/`                  | `src/next-packages/`                | `tsconfig.json` paths + `jest.config.ts` moduleNameMapper |
| `@assistant-ui/react` | `__mocks__/@assistant-ui/react.tsx` | `jest.config.ts` moduleNameMapper (test only)             |

- In source code: use `@/components/ui/...` to import from `next-packages/components/ui/`.
- In tests: the same `@/` alias resolves correctly via Jest's `moduleNameMapper`.

## Pre-commit / Pre-push

- Husky hooks are **currently disabled** (commented out in `.husky/`).
- `lint-staged` config exists in root `package.json` but is not invoked.
- Run `npm run lint` and `npm run test` manually before pushing.
