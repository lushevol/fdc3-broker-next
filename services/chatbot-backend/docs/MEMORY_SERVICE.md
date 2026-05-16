# Chatbot Memory Service Integration

The chatbot reads operator memory from the standalone `memory-service` before building the system prompt.

## Configuration

```yaml
chatbot:
  memory:
    enabled: true
    base-url: http://localhost:8084
    tenant-id: default
    request-timeout: 2s
    context-limit: 8
```

`MemoryContextBuilder` performs a best-effort lookup for active entries scoped to the current `UserCapabilityContext.userId`. If the service is unavailable, the request continues without injected memory.

The legacy AutoMemoryTools file memory wiring is still present for compatibility while the SQL service takes over durable BAU preferences and workflow context.
