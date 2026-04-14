# local-llm-ws-client — Rules

← [PROJECT.md](./PROJECT.md) · [Monorepo rules](../../docs/rules.md)

## Reconnection

- Always use `socket.io-client` reconnection with exponential backoff
- Never disable reconnection — the client is designed to recover from gateway restarts
- Default reconnection delay: 1000ms, max: 10000ms, attempts: Infinity

## Heartbeat

- Client emits `client:heartbeat` every 30s by default (configurable via `HEARTBEAT_INTERVAL_MS`)
- Heartbeat timer starts on `connect` event, stops on `disconnect`
- Adjust `HEARTBEAT_INTERVAL_MS` if the gateway timeout is shorter than the heartbeat interval

## Error Handling

- Never crash on API errors — use `task:error` event to report failures back to the gateway
- `LocalApiAdapter.fetchWithRetry` handles retries for 429 and 5xx errors
- Connection errors and disconnects are logged but never cause process exit

## Capabilities

- Advertise `['openai.chat', 'openai.embeddings', 'openai.models', 'claude.messages']` on registration
- Add new capabilities to the `capabilities` array in `client.ts` when adding provider support
- The gateway uses capabilities for routing — missing capabilities cause task routing failures

## Environment

- All configuration via environment variables with sensible defaults (see `index.ts`)
- `GATEWAY_WS_URL` must point to a running `ws-gateway-server` instance
- `LOCAL_LLM_BASE_URL` must point to a local LLM API (e.g., Ollama at `http://localhost:11434`)
- Never hard-code URLs or configuration values
