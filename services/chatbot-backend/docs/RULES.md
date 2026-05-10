# chatbot-backend — Rules

← [PROJECT.md](./PROJECT.md) · [Monorepo rules](../../docs/rules.md)

## LLM Integration

- Always use Spring AI abstractions (`ChatModel`, `Prompt`, Spring-managed provider model beans)
- Never call OpenAI/Anthropic APIs directly — route through `AgentService`
- Configure model via `spring.ai.openai.*` properties or `CHATBOT_*` env vars

## SSE Streaming

- Use `SseEmitter` for all streaming responses — never return blocking responses from streaming endpoints
- Emit event types in order: `conversation_id` → `message`/`tool_call`/`tool_result`/`generative_ui`/`execution_plan`/`execution_step` → `done`
- Always emit `done` as the final event to signal stream completion
- Always emit `conversation_id` as the first event

## MCP Providers

- Register via `POST /api/chat/mcp/providers` or bootstrap config in `application.yml`
- Use `STREAMABLE_HTTP` transport type for new providers (preferred over `HTTP_SSE`)
- Never call MCP tool endpoints directly — route through `ToolRegistry`

## Agentic Loop

- When `CapabilityResolver` is available and no `toolContext` is provided, the agentic control loop is used
- Otherwise, the direct model streaming path is used
- Do not bypass `PlanValidationService` — all plans must be validated before execution
- `PolicyEvaluator` decisions (DENY, REVIEW_REQUIRED) must be respected

## Tool Implementation

- Implement `ToolDefinition` interface: `getName()`, `getDescription()`, `getParameters()`, `execute()`
- Register tools via `ToolRegistry`
- Built-in tools (`CalculatorTool`, `TimeTool`, `WeatherTool`) are always available

## Security Profiles

- Use `CHATBOT_SECURITY_ADDITIONAL_PROFILES` env var to enable tool access profiles (e.g., `advisor` for analytics)
- Never hard-code security profiles in source code

## Conversation Storage

- Currently in-memory (`ConcurrentHashMap`) — not production-safe
- Must migrate to Redis or database for production deployments
- Conversation data is lost on service restart

## Rate Limiting

- 60 req/min per client — do not remove or loosen for production
- Health endpoint (`/api/chat/health`) is excluded from rate limiting
- Configurable via `chatbot.rate-limit.requests-per-minute`
