# chatbot-backend - Architecture

<- [PROJECT.md](./PROJECT.md)

## Tech Stack

| Component       | Technology                                               |
| --------------- | -------------------------------------------------------- |
| Framework       | Spring Boot 4.0.6                                        |
| Language        | Java 21                                                  |
| AI              | Spring AI 2.0.0-M6                                       |
| Agent utilities | `spring-ai-agent-utils` 0.7.0                            |
| API             | Spring Web MVC `SseEmitter`                              |
| Security        | Spring Security                                          |
| Rate limiting   | Bucket4j 8.7                                             |
| Observability   | OpenTelemetry 1.48.0, instrumentation 2.14.0, Micrometer |
| Build           | Maven                                                    |

## Directory Structure

```text
src/main/java/com/fdc3/chatbot/
├── agent/          # Model orchestration, plans, execution, synthesis, memory tools
├── config/         # Spring AI, security, rate limit, observability, memory, agent-utils config
├── controller/     # Protocol, MCP provider, models, health, question endpoints
├── controlplane/   # Capability resolution and policy evaluation
├── files/          # Uploaded file registry and prompt context
├── mcp/            # MCP provider registration and remote tool wrapping
├── memory/         # memory-service HTTP client and context builder
├── model/          # Legacy request models, events, tool calls/results
├── protocol/       # Protocol request conversion and SSE frame mapping
├── security/       # JWT/profile capability context resolver
└── tool/           # Local tools, ToolRegistry, agent-utils bridge
```

## Request Flow

```text
ProtocolChatController
  -> ProtocolChatService
     -> AgentService
        ├─ MemoryContextBuilder -> memory-service (best effort)
        ├─ ToolRegistry -> local tools, MCP tools, agent-utils tools
        ├─ AgentDecisionService -> RESPOND / CLARIFY / PLAN
        ├─ PlanValidationService -> policy validation
        ├─ ExecutionOrchestrator -> backend/MCP execution
        └─ ResultSynthesisService -> final streamed answer
```

`ProtocolChatService` maps internal events into chat protocol frames such as `text-delta`, `tool-input-available`, `tool-output-available`, `plan-available`, and `finish`.

## APIs

| Method | Path                                                      | Purpose                                 |
| ------ | --------------------------------------------------------- | --------------------------------------- |
| POST   | `/api/chat/runs`                                          | Canonical protocol SSE endpoint         |
| POST   | `/api/chat/stream`                                        | Compatibility stream endpoint           |
| GET    | `/api/chat/health`                                        | Health check                            |
| GET    | `/api/chat/models`                                        | Provider model list                     |
| POST   | `/api/chat/mcp/providers`                                 | Register MCP provider                   |
| GET    | `/api/chat/mcp/providers`                                 | List MCP providers                      |
| GET    | `/api/chat/mcp/providers/status`                          | MCP status summary                      |
| DELETE | `/api/chat/mcp/providers/{providerId}`                    | Unregister MCP provider                 |
| POST   | `/api/chat/question/answer`                               | Submit user-question answers            |
| POST   | `/api/chat/question/{batchId}/answer`                     | Submit user-question answers by path id |
| POST   | `/api/chat/{conversationId}/question/{questionId}/answer` | Legacy user-question answer             |

## Tool Sources

| Source     | Execution target | Origin                                            |
| ---------- | ---------------- | ------------------------------------------------- |
| `backend`  | Backend          | Local `ToolDefinition` or agent-utils callback    |
| `mcp`      | Backend          | Registered MCP provider                           |
| `frontend` | Frontend         | Request `context.tools` or legacy `frontendTools` |
| `human`    | Frontend/user    | Manual approval or AskUserQuestionTool-style flow |

## MCP Integration

Providers can be bootstrapped from `chatbot.mcp.providers` or registered with `POST /api/chat/mcp/providers`. Current profile files use:

- Elasticsearch analytics MCP at `http://localhost:8090/api/mcp`.
- RAG knowledge base MCP at `http://localhost:8091/api/mcp`.

Provider access is gated by user profiles, commonly `advisor`.

## Memory

When `chatbot.memory.enabled=true`, the service:

1. Reads active entries from `memory-service`.
2. Injects a compact "Operator memory" block into the prompt.
3. Adds per-user AutoMemoryTools callbacks for compatibility.

Memory lookup is best-effort and must not fail the chat request.

## Observability

- `@WithSpan` is applied to protocol controller/service entry points and agent internals.
- `chatbot.request.active` gauge tracks active streaming requests.
- Actuator exposes health, metrics, and prometheus.
- `logback-spring.xml` writes console logs and rolling file logs.
