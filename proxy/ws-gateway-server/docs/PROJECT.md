# @ai-gateway/ws-gateway-server — Project Overview

← [Monorepo AGENTS.md](../../../AGENTS.md)

## Type

NestJS WebSocket Gateway (Port 1212)

## Purpose

WebSocket relay server that exposes OpenAI/Claude-compatible HTTP REST/SSE endpoints and delegates actual LLM inference to connected Socket.IO client workers. Receives HTTP requests from upstream consumers, selects an available client via round-robin, dispatches the task over Socket.IO, and streams results back to the original HTTP caller.

## Status

Active Development

## Key Features

- **OpenAI-compatible REST API**: `POST /v1/chat/completions`, `POST /v1/embeddings`, `GET /v1/models`
- **Claude-compatible REST API**: `POST /v1/messages`
- **Socket.IO task protocol**: Polling-only transport (`allowUpgrades: false`) on `/llm-proxy` namespace
- **Round-robin load balancing**: `ClientRegistryService` selects next available client
- **SSE streaming**: Streaming responses forwarded chunk-by-chunk via SSE
- **E2E testing harness**: Process-based E2E test infrastructure in `e2e/`

## Quick Start

```bash
# From workspace directory
cd proxy/ws-gateway-server

npm run dev      # Start with ts-node-dev (hot reload)
npm run build    # Compile TypeScript
npm run test     # Jest unit tests
```

Port defaults to 1212, configurable via `PORT` env var.

Not started by default in root `npm run dev` or `npm run dev:services`. Start manually when WebSocket relay features are needed.
