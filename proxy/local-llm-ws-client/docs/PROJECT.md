# @ai-gateway/local-llm-ws-client — Project Overview

← [Monorepo AGENTS.md](../../../AGENTS.md)

## Type

Socket.IO Client Worker (Node.js)

## Purpose

Connects to `ws-gateway-server` and acts as a worker node, receiving `task:create` events, calling local LLM API endpoints, and returning results via the Socket.IO protocol. Supports OpenAI chat/embeddings/models and Claude messages providers.

## Status

Active Development

## Key Features

- **Socket.IO client with auto-reconnect**: Configurable reconnection with exponential backoff
- **Heartbeat mechanism**: Emits `client:heartbeat` every 30s (configurable)
- **Exponential backoff retry**: `fetchWithRetry` for local API calls — 2 retries, 250ms base delay, 2000ms max
- **Multi-provider support**: `openai.chat`, `openai.embeddings`, `openai.models`, `claude.messages`
- **Streaming and sync modes**: Handles both `stream` and `sync` task response modes

## Quick Start

```bash
# From workspace directory
cd proxy/local-llm-ws-client

npm run dev      # Start with ts-node-dev (hot reload)
npm run build    # Compile TypeScript
npm run test     # Jest unit tests
```

Must have `ws-gateway-server` running first. Not started by root `npm run dev` or `npm run dev:services`.

## Environment Variables

| Variable                 | Default                  | Description                |
| ------------------------ | ------------------------ | -------------------------- |
| `GATEWAY_WS_URL`         | `http://localhost:1212`  | Gateway WebSocket URL      |
| `GATEWAY_NAMESPACE`      | `/llm-proxy`             | Socket.IO namespace        |
| `LOCAL_LLM_BASE_URL`     | `http://localhost:11434` | Local LLM API base URL     |
| `CLIENT_NAME`            | `local-client`           | Client identifier          |
| `VERSION`                | `0.1.0`                  | Client version             |
| `HEARTBEAT_INTERVAL_MS`  | `30000`                  | Heartbeat interval         |
| `RECONNECT_ATTEMPTS`     | `Infinity`               | Max reconnection attempts  |
| `RECONNECT_DELAY_MS`     | `1000`                   | Initial reconnection delay |
| `RECONNECT_DELAY_MAX_MS` | `10000`                  | Max reconnection delay     |
