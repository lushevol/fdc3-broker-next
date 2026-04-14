# ws-gateway-server — Rules

← [PROJECT.md](./PROJECT.md) · [Monorepo rules](../../docs/rules.md)

## Protocol

- Polling-only transport (`allowUpgrades: false`). Do not enable WebSocket transport
- Socket.IO namespace is `/llm-proxy` — do not change without updating all clients

## Socket Affinity

- Task results must come from the same socket that received the task
- `ProxyTaskService` validates socket ID on `task:complete` and `task:chunk` events
- Never modify this security check — it prevents task hijacking between clients

## Round-Robin

- `ClientRegistryService` selects clients via round-robin (`selectNextClient()`)
- Do not change to random or least-connections without performance testing
- Round-robin ensures even distribution across connected workers

## SSE Format

- **OpenAI**: `data: {json}\n\n`, terminated by `data: [DONE]\n\n`
- **Claude**: `event: ...\ndata: ...\n\n`, terminated by `data: [DONE]\n\n`
- Both providers end with `data: [DONE]\n\n`

## Error Handling

- Streaming errors must write SSE error frames — never throw or let the connection hang
- Use `ServiceUnavailableException` when no clients are connected (503 response)
- Task timeout is 120 seconds — configurable in `ProxyTaskService`

## Port

- Default 1212, configurable via `PORT` env var
- Not started by root `npm run dev` — start manually when needed
