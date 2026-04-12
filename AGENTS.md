# mfe-next Monorepo

Single-SPA micro-frontend platform. React 18 + TypeScript apps composed at runtime via SystemJS import maps.

**Engineering standards & AI workflow:** See [docs/rules.md](docs/rules.md) for TDD methodology, design system rules, code quality standards, security policies, and the AI implementation workflow protocol.

## Architecture

```
root-config (port 8001)        ← Single-SPA orchestrator, loads import map
├── @fm/base (port 8002)       ← Shell UI: login, nav, FDC3, chatbot, shared components
├── containers                  ← Business micro-apps (grids, dashboards)
│   ├── @fm/template_container (port 8007)
│   ├── mf_container  (port 3000)  ← Module Federation host
│   └── ...external containers loaded via import map
└── tiles                        ← Small widget micro-apps
    ├── @fm/template (port 8006)
    ├── mf_tile (port 3001)         ← Module Federation host
    └── ...external tiles loaded via import map
```

**Packages** (shared libraries, consumed by apps):

- `mf_lib` – Rslib-built shared React component library (Module Federation remote)
- `ratan-design` – Design system (Ant Design + Emotion + tokens, Vitest + Storybook)
- `fdc3-agent`, `fdc3-app-directory`, `fdc3-broker`, `fdc3-resolver-ui` – FDC3 2.2 interop

**Services** (backends):

- `backend` – Spring Boot (Java), port 8088, in-memory H2 for local dev
- `chatbot-backend` – Spring Boot (Java), port 8080, OpenAI/Anthropic chat
- `auth-server` – Spring Boot (Java), port 8082, LDAP/Redis/JWT auth
- `elasticsearch-mcp-service` – Spring Boot (Java), port 8090

**Proxy** (WebSocket gateways):

- `ws-gateway-server` – NestJS Socket.IO relay
- `local-llm-ws-client` – Socket.IO client for local LLM

## Commands

```bash
npm run dev              # Start UI apps + backend services concurrently
npm run dev:ui            # Start only UI apps (root-config, base, container, tile)
npm run dev:services      # Start only backend + chatbot-backend
npm run stop              # Kill all processes on ports 8001,8002,8006,8007,3000,3001,8088,8080
npm run build             # Turbo build all workspaces (continues on error)
npm run build:packages    # Build only packages/*
npm run test              # Turbo test all workspaces
npm run test:packages     # Test only packages/*
npm run lint              # Turbo lint all workspaces (continues on error)
npm run format            # Prettier write all
npm run test:e2e:systemjs # Playwright e2e tests (requires dev server running)
```

### Single-workspace commands

Run from within the workspace directory:

```bash
npm test                  # Run tests (Jest for apps, Vitest for packages)
npm run lint              # ESLint
npm run build             # Build (env-specific: .env.local for dev, .env.server for prod)
npm run dev               # Start dev server
```

## Key Conventions

### Environment files (per app)

- `.env.local` – local dev (used by `npm run dev/dev:ui`)
- `.env.server` – production build overrides
- `.env.mfe` – MFE-specific vars injected at build time via `readMfeEnv()` in rsbuild configs

**Order matters for env:** `npm run dev` reads `.env.local`. Build reads `.env.server`.

### Single-SPA module format

All apps except `mf_container`/`mf_tile` output **SystemJS** modules (`library.type: 'system'`). `mf_container`/`mf_tile` use **Module Federation** (Rspack plugin).

### External dependencies

React, ReactDOM, and single-spa are **externals** resolved at runtime via the import map, not bundled.

### Import map

- `root-config/public/importmaplocal.json` – maps all MFE names to localhost URLs for dev
- `root-config/public/importmap.json` – production mapping
- Adding a new tile/container requires updating both import maps

### Turbo pipeline

- `build` has `dependsOn: ["^build"]` – packages must build before apps
- `test` has `dependsOn: ["build"]` – tests run after build
- `dev` is persistent (long-running), not cached

### Linting

Root `eslint.config.mjs` applies to `**/*.{ts,tsx}` across workspaces. Rules:

- `@typescript-eslint/no-explicit-any`: warn (not error)
- `@typescript-eslint/no-unused-vars`: warn, args starting with `_` ignored

### Pre-commit / Pre-push hooks

Currently **disabled** (commented out in `.husky/`). Lint-staged config exists in root `package.json` but is not invoked.

### Testing

- Apps use **Jest** with `babel-jest` transform, `@testing-library/react`, `jest-environment-jsdom`
- Packages (`ratan-design`, `fdc3-*`) use **Vitest** with `happy-dom` or `jsdom`
- E2E tests use **Playwright** (`tests/e2e/` at root), target `http://127.0.0.1:8001`
- `jest.config.ts` in apps sets `moduleNameMapper` for `@/` → `src/next-packages/`

## Verification

After UI changes, always verify at http://localhost:8001:

1. Click "login" on the login screen
2. Click "New Tile" on the top nav bar → menu drawer opens
3. Click a tile app → it renders in the workspace
4. Click delete icon on a workspace tab to remove it

## Chatbot-backend env

Requires these env vars (see `services/chatbot-backend/.env.example`):

- `CHATBOT_OPENAI_API_KEY`, `CHATBOT_OPENAI_BASE_URL`, `CHATBOT_OPENAI_MODEL`, `CHATBOT_OPENAI_TEMPERATURE`
- `CHATBOT_ANTHROPIC_API_KEY`, `CHATBOT_ANTHROPIC_MODEL`

These are also declared in `turbo.json` `globalEnv`.

## Backend dev

Both `backend` and `chatbot-backend` use Maven. `backend` runs with embedded H2 (in-memory) by default:

```bash
cd services/backend && npm run dev
# Equivalent to: mvn spring-boot:run -Dspring-boot.run.jvmArguments='-Dserver.port=8088 -Dspring.profiles.active=local'
```

## Container/Tile templates

- `apps/container` and `apps/tile` are **templates** for creating new MFE apps. Copy and rename to scaffold new business tiles/containers.
- `apps/mf_container` and `apps/mf_tile` are Module Federation variants (simpler setup, no SystemJS).
