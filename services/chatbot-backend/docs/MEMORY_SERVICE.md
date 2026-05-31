# Chatbot Memory Service Integration

`chatbot-backend` reads active operator memory from the standalone `memory-service` before building the model prompt.

## Configuration

```yaml
chatbot:
  memory:
    enabled: true
    base-url: http://localhost:8084
    tenant-id: default
    request-timeout: 2s
    context-limit: 8
    directory: ./data/memories
```

Environment variables:

- `CHATBOT_MEMORY_ENABLED`
- `CHATBOT_MEMORY_BASE_URL`
- `CHATBOT_MEMORY_TENANT_ID`
- `CHATBOT_MEMORY_REQUEST_TIMEOUT`
- `CHATBOT_MEMORY_CONTEXT_LIMIT`
- `CHATBOT_MEMORY_DIRECTORY`

## Runtime Behavior

`MemoryContextBuilder` searches active entries for the current `UserCapabilityContext.userId`. It injects a compact block:

```text
Operator memory:
- [PREFERENCE] ...
- [BAU_WORKFLOW] ...
```

The lookup is best-effort. If `memory-service` is unavailable or times out, the chat request continues without injected memory.

## Compatibility

AutoMemoryTools file-backed memory remains enabled through `MemoryToolsFactory`. The base directory is `chatbot.memory.directory`; tool instances are created per user to avoid shared memory directories.
