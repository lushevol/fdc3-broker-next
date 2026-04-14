# ws-gateway-server — Architecture

← [PROJECT.md](./PROJECT.md)

## Tech Stack

| Component | Technology     |
| --------- | -------------- |
| Framework | NestJS 11      |
| Transport | Socket.IO 4.8  |
| Reactive  | RxJS           |
| Language  | TypeScript     |
| Build     | `tsc`          |
| Test      | Jest + ts-jest |

## Architecture

```
HTTP Client (OpenAI/Claude format)
  │
  ▼
Controllers (OpenAIController, ClaudeController)
  │
  ▼
ProxyTaskService (pending task lifecycle, 120s timeout)
  │
  ▼
ClientRegistryService (round-robin client selection)
  │
  ▼
ProxyGateway (Socket.IO /llm-proxy namespace, polling-only)
  │
  ▼ Socket.IO
  │
Local LLM Client (local-llm-ws-client)
```

## Directory Structure

```
src/
├── main.ts                              # NestJS bootstrap, PORT=1212
├── app.module.ts                        # Module wiring
├── controllers/
│   ├── openai.controller.ts             # POST /v1/chat/completions, /v1/embeddings, GET /v1/models
│   └── claude.controller.ts             # POST /v1/messages
├── gateways/
│   └── proxy.gateway.ts                 # Socket.IO @WebSocketGateway
├── services/
│   ├── client-registry.service.ts       # Connected clients + round-robin
│   ├── proxy-task.service.ts            # Pending task lifecycle (120s timeout)
│   ├── provider-adapter.service.ts      # OpenAI/Claude format conversion
│   └── models-aggregation.service.ts     # Collect models from all connected clients
├── types/
│   └── proxy-protocol.ts               # Socket.IO event type definitions
└── __tests__/
    ├── bootstrap.test.ts
    ├── client-registry.service.test.ts
    ├── controller-dispatch-guard.test.ts
    ├── openai.controller.test.ts
    ├── openai.adapter.test.ts
    ├── claude-streaming.test.ts
    ├── proxy-task.service.test.ts
    ├── proxy.gateway.test.ts
    └── stream-error-frame.test.ts
```

## API Endpoints

### OpenAI Compatible

| Method | Path                   | Description                            |
| ------ | ---------------------- | -------------------------------------- |
| POST   | `/v1/chat/completions` | Chat completion (sync or SSE stream)   |
| POST   | `/v1/embeddings`       | Text embeddings                        |
| GET    | `/v1/models`           | List available models from all clients |

### Claude Compatible

| Method | Path           | Description                          |
| ------ | -------------- | ------------------------------------ |
| POST   | `/v1/messages` | Claude messages (sync or SSE stream) |

## Socket.IO Protocol

- **Namespace**: `/llm-proxy`
- **Transport**: Polling only (`transports: ['polling']`, `allowUpgrades: false`)

### Client → Gateway Events

| Event              | Payload                 | Description                                                       |
| ------------------ | ----------------------- | ----------------------------------------------------------------- |
| `client:register`  | `RegisterPayload`       | Client announces itself with name, version, baseUrl, capabilities |
| `client:heartbeat` | `HeartbeatPayload`      | Keep-alive ping                                                   |
| `task:chunk`       | `TaskChunkPayload`      | Streaming chunk from client                                       |
| `task:complete`    | `TaskCompletePayload`   | Task finished successfully                                        |
| `task:error`       | `TaskErrorPayload`      | Task failed                                                       |
| `models:response`  | `ModelsResponsePayload` | Model list response                                               |

### Gateway → Client Events

| Event            | Payload             | Description                    |
| ---------------- | ------------------- | ------------------------------ |
| `task:create`    | `TaskCreatePayload` | Dispatch task to client        |
| `models:request` | `{ requestId }`     | Request model list from client |

## Services

### ClientRegistryService

- Maintains `Map<string, ConnectedClient>` of connected Socket.IO clients
- Round-robin selection via `selectNextClient()`
- Tracks `lastSeenAt` via heartbeat updates
- Removes clients on disconnect

### ProxyTaskService

- Manages pending task lifecycle with `Promise`-based resolve/reject
- 120-second timeout for each task
- Validates that task results come from the same socket that received the task (socket affinity)
- Appends chunks for streaming responses

### ProviderAdapterService

- Converts between OpenAI and Claude request/response formats
- Wraps streaming chunks into SSE frames

### ModelsAggregationService

- Broadcasts `models:request` to all connected clients
- Aggregates `models:response` results with a configurable timeout

## Testing

- **Unit tests**: 9 test files in `src/__tests__/` (Jest + ts-jest)
- **E2E tests**: Process harness in `e2e/` with separate `tsconfig.json`
