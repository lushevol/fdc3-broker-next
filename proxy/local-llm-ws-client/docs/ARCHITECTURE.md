# local-llm-ws-client — Architecture

← [PROJECT.md](./PROJECT.md)

## Tech Stack

| Component | Technology           |
| --------- | -------------------- |
| Runtime   | Node.js              |
| Transport | socket.io-client 4.8 |
| Language  | TypeScript           |
| Build     | `tsc`                |
| Test      | Jest + ts-jest       |

## Directory Structure

```
src/
├── main.ts                  # Entry point — reads env, creates client, starts
├── index.ts                 # Factory function — creates ClientOptions from env vars
├── client.ts                # LocalLlmWsClient class — Socket.IO lifecycle + task handling
├── local-api-adapter.ts     # HTTP client for local LLM API (sync/stream/retry)
├── logger.ts                # Structured JSON logger
├── types.ts                 # TypeScript interfaces (ClientOptions, TaskCreatePayload, etc.)
└── __tests__/
    ├── bootstrap.test.ts
    ├── client-protocol.test.ts
    ├── local-api-adapter.test.ts
    └── main.test.ts
```

## Client Flow

```
main.ts
  │
  ▼ index.ts — createClientOptionsFromEnv()
  │
  ▼ new LocalLlmWsClient(options)
  │
  ▼ client.start()
  │
  ├─ socket.on('connect') ──→ emit 'client:register'
  │                              │
  │                              └─ Start heartbeat timer (30s interval)
  │
  ├─ socket.on('task:create') ──→ delegate to LocalApiAdapter
  │       │
  │       ├─ responseMode === 'stream' ──→ adapter.executeStream(task, onChunk)
  │       │       │
  │       │       ├─ Each chunk ──→ emit 'task:chunk'
  │       │       └─ Final result ──→ emit 'task:complete'
  │       │
  │       └─ responseMode === 'sync' ──→ adapter.executeSync(task) ──→ emit 'task:complete'
  │
  ├─ socket.on('models:request') ──→ adapter.fetchModels() ──→ emit 'models:response'
  │
  ├─ socket.on('disconnect') ──→ Stop heartbeat timer
  │
  └─ socket.on('connect_error' / 'reconnect_attempt' / 'reconnect') ──→ Log
```

## Local API Mapping

| Task Type                     | Local Endpoint                       |
| ----------------------------- | ------------------------------------ |
| `openai.chat`                 | `POST {baseUrl}/v1/chat/completions` |
| `openai.embeddings`           | `POST {baseUrl}/v1/embeddings`       |
| `claude.messages`             | `POST {baseUrl}/v1/messages`         |
| `openai.models` (fetchModels) | `GET {baseUrl}/v1/models`            |

## Retry Logic

`LocalApiAdapter.fetchWithRetry` implements exponential backoff:

- **Max retries**: 2 (configurable via `localApiMaxRetries`)
- **Base delay**: 250ms (configurable via `localApiRetryBaseDelayMs`)
- **Max delay**: 2000ms (configurable via `localApiRetryMaxDelayMs`)
- **Retry on**: HTTP 429 (rate limit) or 5xx (server error)
- **No retry on**: 4xx client errors (except 429)

## Streaming

For `openai.chat` stream tasks:

1. Send request to local API with `stream: true`
2. Parse SSE response lines (`data: {json}\n\n`)
3. Extract `choices[0].delta.content` from each chunk
4. Emit each chunk via `task:chunk` with incrementing `chunkIndex`
5. Emit final `task:complete` with consolidated result

For `claude.messages` stream tasks:

1. Parse SSE events with `event:` and `data:` lines
2. Forward as `{ event, data }` chunks
3. Emit final `task:complete` with `{ content: '' }`

## Capabilities

Advertised on `client:register`:

```typescript
['openai.chat', 'openai.embeddings', 'openai.models', 'claude.messages'];
```
