# Smart Dev Launcher Design

## Goal

Provide one root-level launcher that starts any selected combination of UI apps and all services in `services/`, while aligning every service behind an npm workspace `dev` command.

## Requirements

- The launcher must expose each service as an independent boolean flag.
- The launcher must include all service directories:
  - `backend`
  - `auth-server`
  - `chatbot-backend`
  - `elasticsearch-mcp-service`
  - `flowzero-designer-service`
  - `flowzero-mcp-service`
  - `flowzero-orchestration-service`
  - `memory-service`
  - `rag-knowledge-base-service`
- The launcher must also expose UI apps as a selectable component.
- The launcher must support named presets for common demos.
- The launcher must preserve existing root scripts while allowing them to delegate to the smart launcher over time.
- Services that already have npm workspace scripts must keep their existing behavior unless the launcher explicitly chooses a variant, such as chatbot `dev:local`.
- Services without npm workspace scripts must gain aligned package wrappers with `dev`, `test`, and `build` scripts where Maven supports them.
- Chatbot demos must be able to validate real model configuration before launching.
- Chatbot can wait for selected MCP/memory dependencies before starting, avoiding race conditions during demos.
- The launcher must support dry-run output for tests and command inspection without starting long-running services.

## Service Registry

| Component | Directory | Port | Health URL | Default command |
| --- | --- | ---: | --- | --- |
| `ui` | root | `8001` | `http://127.0.0.1:8001/` | `npm run dev:ui` |
| `backend` | `services/backend` | `8088` | `http://127.0.0.1:8088/actuator/health` | `npm --workspace services/backend run dev` |
| `auth` | `services/auth-server` | `8082` | `http://127.0.0.1:8082/actuator/health` | `npm --workspace services/auth-server run dev` |
| `chatbot` | `services/chatbot-backend` | `8080` | `http://127.0.0.1:8080/actuator/health` | `npm --workspace services/chatbot-backend run dev:local` |
| `memory` | `services/memory-service` | `8084` | `http://127.0.0.1:8084/actuator/health` | `npm --workspace services/memory-service run dev` |
| `elasticsearch-mcp` | `services/elasticsearch-mcp-service` | `8090` | `http://127.0.0.1:8090/actuator/health` | `npm --workspace services/elasticsearch-mcp-service run dev` |
| `rag` | `services/rag-knowledge-base-service` | `8091` | `http://127.0.0.1:8091/actuator/health` | `npm --workspace services/rag-knowledge-base-service run dev` |
| `flowzero-mcp` | `services/flowzero-mcp-service` | `8092` | `http://127.0.0.1:8092/actuator/health` | `npm --workspace services/flowzero-mcp-service run dev` |
| `flowzero-designer` | `services/flowzero-designer-service` | `11611` | `http://127.0.0.1:11611/actuator/health` | `npm --workspace services/flowzero-designer-service run dev` |
| `flowzero-orchestration` | `services/flowzero-orchestration-service` | `11210` | `http://127.0.0.1:11210/actuator/health` | `npm --workspace services/flowzero-orchestration-service run dev` |

## CLI Contract

Examples:

```bash
npm run dev:smart -- --chatbot --flowzero-mcp
npm run dev:smart -- --chatbot --memory --elasticsearch-mcp
npm run dev:smart -- --ui --chatbot --flowzero-mcp
npm run dev:smart -- --preset flowzero-chatbot
npm run dev:smart -- --all
npm run dev:smart -- --dry-run --chatbot --memory
```

Flags:

- `--profile <name>` sets `ACTIVE_ENV`, defaulting to the preset profile or `dev`.
- `--preset <name>` expands to a known component set.
- `--all` selects UI plus every service.
- `--dry-run` prints the selected profile, components, ports, and command list without spawning.
- `--no-stop` skips `npm run stop`.
- `--validate-chatbot-model` runs `scripts/validate-chatbot-model-env.js` before launching.

Component flags:

- `--ui`
- `--backend`
- `--auth`
- `--chatbot`
- `--memory`
- `--elasticsearch-mcp`
- `--rag`
- `--flowzero-mcp`
- `--flowzero-designer`
- `--flowzero-orchestration`

Presets:

- `flowzero-chatbot`: `ui`, `chatbot`, `flowzero-mcp`; profile `flowzero-chatbot`; validates chatbot model.
- `chatbot-memory-elasticsearch`: `chatbot`, `memory`, `elasticsearch-mcp`; profile `dev`.
- `services`: all services except UI; profile `dev`.
- `services-stub`: all services except UI; profile `stub`.
- `full`: UI plus all services; profile `dev`.

## Command Composition

The launcher builds a `concurrently` command. Non-chatbot selected components start directly. When chatbot is selected with dependency components, the chatbot command is prefixed with `node scripts/wait-for-url.js <health> 60000 &&` for each selected dependency that has a health URL.

The launcher sets `ACTIVE_ENV` for the entire process using `cross-env ACTIVE_ENV=<profile>`.

## Testing Strategy

Use Node's built-in `node:test` runner. Test only pure command planning logic:

- flag selection maps to the expected components
- presets expand to expected components/profile/model validation
- `--all` includes UI and all services
- chatbot commands wait for selected dependencies
- dry-run returns command metadata without spawning
- unknown component or preset fails with a clear error

