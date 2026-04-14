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

## Workspace Documentation

Each workspace has unified context docs under its `docs/` directory:

| Workspace                            | PROJECT.md                                                    | ARCHITECTURE.md                                                 | RULES.md                                                  |
| ------------------------------------ | ------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------- |
| **Apps**                             |                                                               |                                                                 |                                                           |
| `apps/root-config`                   | [PROJECT](apps/root-config/docs/PROJECT.md)                   | [ARCH](apps/root-config/docs/ARCHITECTURE.md)                   | [RULES](apps/root-config/docs/RULES.md)                   |
| `apps/base`                          | [PROJECT](apps/base/docs/PROJECT.md)                          | [ARCH](apps/base/docs/ARCHITECTURE.md)                          | [RULES](apps/base/docs/RULES.md)                          |
| `apps/container`                     | [PROJECT](apps/container/docs/PROJECT.md)                     | [ARCH](apps/container/docs/ARCHITECTURE.md)                     | [RULES](apps/container/docs/RULES.md)                     |
| `apps/tile`                          | [PROJECT](apps/tile/docs/PROJECT.md)                          | [ARCH](apps/tile/docs/ARCHITECTURE.md)                          | [RULES](apps/tile/docs/RULES.md)                          |
| `apps/mf_container`                  | [PROJECT](apps/mf_container/docs/PROJECT.md)                  | [ARCH](apps/mf_container/docs/ARCHITECTURE.md)                  | [RULES](apps/mf_container/docs/RULES.md)                  |
| `apps/mf_tile`                       | [PROJECT](apps/mf_tile/docs/PROJECT.md)                       | [ARCH](apps/mf_tile/docs/ARCHITECTURE.md)                       | [RULES](apps/mf_tile/docs/RULES.md)                       |
| **Packages**                         |                                                               |                                                                 |                                                           |
| `packages/mf_lib`                    | [PROJECT](packages/mf_lib/docs/PROJECT.md)                    | [ARCH](packages/mf_lib/docs/ARCHITECTURE.md)                    | [RULES](packages/mf_lib/docs/RULES.md)                    |
| `packages/ratan-design`              | [PROJECT](packages/ratan-design/docs/PROJECT.md)              | [ARCH](packages/ratan-design/docs/ARCHITECTURE.md)              | [RULES](packages/ratan-design/docs/RULES.md)              |
| `packages/fdc3-agent`                | [PROJECT](packages/fdc3-agent/docs/PROJECT.md)                | [ARCH](packages/fdc3-agent/docs/ARCHITECTURE.md)                | [RULES](packages/fdc3-agent/docs/RULES.md)                |
| `packages/fdc3-app-directory`        | [PROJECT](packages/fdc3-app-directory/docs/PROJECT.md)        | [ARCH](packages/fdc3-app-directory/docs/ARCHITECTURE.md)        | [RULES](packages/fdc3-app-directory/docs/RULES.md)        |
| `packages/fdc3-broker`               | [PROJECT](packages/fdc3-broker/docs/PROJECT.md)               | [ARCH](packages/fdc3-broker/docs/ARCHITECTURE.md)               | [RULES](packages/fdc3-broker/docs/RULES.md)               |
| `packages/fdc3-resolver-ui`          | [PROJECT](packages/fdc3-resolver-ui/docs/PROJECT.md)          | [ARCH](packages/fdc3-resolver-ui/docs/ARCHITECTURE.md)          | [RULES](packages/fdc3-resolver-ui/docs/RULES.md)          |
| **Services**                         |                                                               |                                                                 |                                                           |
| `services/backend`                   | [PROJECT](services/backend/docs/PROJECT.md)                   | [ARCH](services/backend/docs/ARCHITECTURE.md)                   | [RULES](services/backend/docs/RULES.md)                   |
| `services/chatbot-backend`           | [PROJECT](services/chatbot-backend/docs/PROJECT.md)           | [ARCH](services/chatbot-backend/docs/ARCHITECTURE.md)           | [RULES](services/chatbot-backend/docs/RULES.md)           |
| `services/elasticsearch-mcp-service` | [PROJECT](services/elasticsearch-mcp-service/docs/PROJECT.md) | [ARCH](services/elasticsearch-mcp-service/docs/ARCHITECTURE.md) | [RULES](services/elasticsearch-mcp-service/docs/RULES.md) |
| **Proxy**                            |                                                               |                                                                 |                                                           |
| `proxy/ws-gateway-server`            | [PROJECT](proxy/ws-gateway-server/docs/PROJECT.md)            | [ARCH](proxy/ws-gateway-server/docs/ARCHITECTURE.md)            | [RULES](proxy/ws-gateway-server/docs/RULES.md)            |
| `proxy/local-llm-ws-client`          | [PROJECT](proxy/local-llm-ws-client/docs/PROJECT.md)          | [ARCH](proxy/local-llm-ws-client/docs/ARCHITECTURE.md)          | [RULES](proxy/local-llm-ws-client/docs/RULES.md)          |

Each `docs/` directory follows the same structure:

- **PROJECT.md** — Purpose, key features, quick start, environment, dependencies
- **ARCHITECTURE.md** — Tech stack, directory structure, data flow, build config, testing
- **RULES.md** — Development conventions, naming, patterns, module format, testing requirements
