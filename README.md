# MFE Next

MFE Next is a Single-SPA micro-frontend platform. React 18 applications are composed at runtime through SystemJS import maps, while selected hosts use Module Federation. The monorepo also contains shared UI and FDC3 libraries, chat-protocol packages, Spring Boot services, and WebSocket gateways.

> Status: documentation refreshed against the repository on 2026-07-10.

## Prerequisites

- Node.js 20 or later
- npm 10.9.2 (declared by the root package)
- Java 21 and Maven for current platform services; the Flowzero designer and orchestration services currently target Java 17

## Install

```bash
npm install
```

## Common commands

| Command                              | Purpose                                                                      |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| `npm run dev`                        | Start the UI, core services, and RAG stack with the `dev` profile            |
| `npm run dev:stub`                   | Start the UI and service stack with stub integrations                        |
| `npm run dev:smart`                  | Start the interactive dependency-aware development launcher                  |
| `npm run dev:ui`                     | Start the root config, shell, template MFEs, and Ratan/Flowzero MFEs         |
| `npm run dev:services`               | Start backend, Elasticsearch MCP, Flowzero MCP, memory, and chatbot services |
| `npm run dev:rag`                    | Start the RAG knowledge-base service and chatbot backend                     |
| `npm run dev:flowzero-chatbot`       | Start the focused Flowzero workflow-generation stack                         |
| `npm run dev:chat-protocol-demo-web` | Start the standalone chat-protocol demo                                      |
| `npm run stop`                       | Stop known local development ports                                           |
| `npm run build`                      | Build all workspaces through Turbo                                           |
| `npm run test`                       | Build dependencies and run workspace tests                                   |
| `npm run lint`                       | Run workspace lint tasks                                                     |
| `npm run test:e2e`                   | Run Chromium Playwright tests against the portal                             |
| `npm run test:e2e:chat-protocol`     | Run the standalone chat-protocol demo E2E suite                              |

## Runtime architecture

| Layer                      | Current workspaces                                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Portal                     | `apps/root-config` (8001), `apps/base` (8002)                                                                                                                      |
| SystemJS templates         | `apps/container` (8007), `apps/tile` (8006)                                                                                                                        |
| Module Federation examples | `apps/mf_container` (3000), `apps/mf_tile` (3001)                                                                                                                  |
| Business MFEs              | `apps/mfe-ratan-container` (8009), `apps/mfe-cashflow-blotter` (8015), `apps/mfe-flowzero` (8016)                                                                  |
| Standalone demos           | `apps/fdc3-demo`, `apps/chat-protocol-demo-web` (4173)                                                                                                             |
| Shared packages            | `mf_lib`, `ratan-design`, `chat-protocol-*`, and `fdc3-*`                                                                                                          |
| Spring services            | backend (8088), chatbot (8080), auth (8082), memory (8084), Elasticsearch MCP (8090), RAG MCP (8091), Flowzero MCP (8092), orchestration (11210), designer (11611) |
| WebSocket proxy            | `proxy/ws-gateway-server`, `proxy/local-llm-ws-client`                                                                                                             |

The development import map is [apps/root-config/public/importmaplocal.json](apps/root-config/public/importmaplocal.json). Production mappings are in [apps/root-config/public/importmap.json](apps/root-config/public/importmap.json).

## Focused development flows

### Portal UI

```bash
npm run dev:ui
```

Open `http://localhost:8001`, click **login**, open **New Tile**, select an application, and use the workspace tab delete action to remove it.

### Flowzero chatbot workflow generation

```bash
npm run env:check:flowzero-chatbot
npm run dev:flowzero-chatbot
```

This launcher starts the UI, Flowzero MFE, `chatbot-backend`, and `flowzero-mcp-service` with the `.env.profile.flowzero-chatbot` profile. It requires `CHATBOT_OPENAI_API_KEY`, `CHATBOT_OPENAI_BASE_URL`, and `CHATBOT_OPENAI_MODEL`; supply secrets through exported environment variables or the ignored local profile file.

### Chat-protocol demo

```bash
npm run dev:chat-protocol-demo-web
```

The demo runs at `http://127.0.0.1:4173` and expects the chatbot run endpoint at `http://127.0.0.1:8080/api/chat/runs` unless overridden by its environment configuration.

## Environment profiles

Root launchers load `.env.profile.${ACTIVE_ENV}`. Common profiles are `dev`, `stub`, `copilot`, and `flowzero-chatbot`. Individual MFEs also use `.env.local`, `.env.server`, and `.env.mfe` according to their build scripts. Never commit secrets.

## Workspace development

Run a script in one workspace with npm's workspace selector:

```bash
npm --workspace packages/chat-protocol-contract run test
npm --workspace services/flowzero-mcp-service run dev
```

List detected workspaces with:

```bash
npm query ".workspace"
```

## Documentation

- [AGENTS.md](AGENTS.md) — architecture, conventions, commands, and AI workflow context
- [docs/rules.md](docs/rules.md) — engineering standards
- `apps/*/docs/`, `packages/*/docs/`, `services/*/docs/`, and `proxy/*/docs/` — workspace project, architecture, and rules references where maintained
- `docs/superpowers/specs/` and `docs/superpowers/plans/` — dated design and implementation records; these are historical snapshots after completion
- `openspec/specs/` — synchronized product specifications; `openspec/changes/archive/` is historical

## Platform notes

Core npm scripts use `cross-env` and the Node-based port stopper for macOS, Linux, and Windows. Deployment-oriented scripts such as CentOS bundle verification may require Bash or a Linux environment.
