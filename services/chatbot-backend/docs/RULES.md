# chatbot-backend - Rules

<- [PROJECT.md](./PROJECT.md) - [Monorepo rules](../../../docs/rules.md)

## Protocol

- New clients use `POST /api/chat/runs`.
- Request messages must use `parts`, not `content`.
- Keep frame names aligned with `packages/chat-protocol-contract`.
- Always emit `finish` exactly once for a run unless the connection is cancelled.
- Preserve `/api/chat/stream` as compatibility unless all callers are migrated.

## Model Integration

- Use Spring AI abstractions and configured provider beans.
- Do not call OpenAI, Anthropic, or provider-specific chat completions directly from controllers.
- Per-run model override goes through `ProtocolRunRequest.config.modelName`.

## Tools

- Implement local Java tools through `ToolDefinition`.
- Register local tools through Spring beans; `ToolRegistry` discovers them.
- MCP tools must be registered through `McpProviderRegistryService`.
- Frontend tools come from protocol `context.tools` or compatibility `context.frontendTools`.
- Human/approval tools must finish with `action-required` until a valid continuation is submitted.

## Memory

- `memory-service` lookup is best-effort and scoped by user id.
- Never share AutoMemoryTools directories across users.
- Do not log memory bodies or full operator context.

## Security

- Profile-gated tools must remain profile-gated.
- Do not hard-code user profiles in source; use JWT claims or `CHATBOT_SECURITY_ADDITIONAL_PROFILES`.
- Keep rate limiting enabled for production.

## Observability

- Keep spans around protocol entry points, model calls, tool execution, and MCP provider calls.
- Keep `chatbot.request.active` registered.
- Do not log secrets, provider API keys, raw prompts containing private data, or full tool outputs.

## Tests

```bash
cd services/chatbot-backend
mvn test
```

Add or update tests for protocol frames, MCP registration, tool execution, memory context, and controller behavior before changing those paths.
