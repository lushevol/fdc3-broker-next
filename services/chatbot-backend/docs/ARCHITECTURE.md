# chatbot-backend — Architecture

← [PROJECT.md](./PROJECT.md)

## Tech Stack

| Component     | Technology                            |
| ------------- | ------------------------------------- |
| Framework     | Spring Boot 3.5.14                    |
| Language      | Java 17                               |
| AI            | Spring AI 2.0.0-M6 (OpenAI-compatible/Anthropic) |
| Reactive      | Spring WebFlux                        |
| Security      | Spring Security (disabled by default) |
| Rate Limiting | Bucket4j 8.7                          |
| Build         | Maven                                 |

## Directory Structure

```
src/main/java/com/fdc3/chatbot/
├── agent/
│   ├── AgentService.java                 # Core streaming + agentic orchestration
│   ├── AgentDecisionService.java         # LLM-based RESPOND/CLARIFY/PLAN routing
│   ├── PlanValidationService.java        # Policy-gated plan validation
│   ├── ExecutionOrchestrator.java         # Multi-step tool execution
│   ├── ResultSynthesisService.java        # Final answer streaming synthesis
│   ├── model/
│   │   ├── AgentDecision.java            # Decision record (type, text, plan)
│   │   ├── AgentDecisionType.java        # RESPOND, CLARIFY, PLAN
│   │   ├── AgentPlan.java
│   │   ├── AgentPlanStep.java
│   │   ├── ValidatedExecutionPlan.java
│   │   ├── ValidatedExecutionStep.java
│   │   └── ExecutionTranscript.java
│   └── prompt/
│       ├── AgentDecisionPromptFactory.java
│       └── ResultSynthesisPromptFactory.java
├── config/
│   ├── RateLimitConfig.java              # Bucket4j 60 req/min
│   ├── SecurityConfig.java               # Spring Security (disabled by default)
│   └── WebConfig.java                     # CORS configuration
├── controlplane/
│   ├── CapabilityRegistryService.java     # Loads from JSON capability definitions
│   ├── CapabilityResolver.java            # Resolves capabilities by context + tools
│   ├── model/
│   │   ├── CapabilityDefinition.java
│   │   ├── ResolvedCapability.java
│   │   ├── ExecutionPlan.java
│   │   ├── ExecutionStep.java
│   │   └── WorkspaceContextSnapshot.java
│   ├── planning/
│   │   └── ExecutionPlanner.java
│   └── policy/
│       ├── PolicyEvaluator.java          # ALLOW / REVIEW_REQUIRED / DENY
│       ├── PolicyDecision.java
│       └── PolicyDecisionType.java
├── controller/
│   ├── ChatController.java                # /api/chat endpoints
│   └── McpProviderController.java         # MCP provider CRUD
├── mcp/
│   ├── McpBootstrapRegistrar.java        # Auto-register from application.yml
│   ├── McpBootstrapProperties.java
│   ├── McpClientFactory.java             # Creates MCP client sessions
│   ├── LangChain4jMcpClientFactory.java  # MCP client factory backed by the Spring AI MCP SDK stack
│   ├── McpProviderRegistrationRequest.java
│   ├── McpProviderRegistryService.java    # Register/list/unregister MCP providers
│   ├── McpToolDescriptor.java
│   ├── McpTransportType.java             # STREAMABLE_HTTP, HTTP_SSE
│   └── RegisteredMcpProvider.java
├── model/
│   ├── ChatRequest.java
│   ├── ChatResponse.java
│   ├── ChatMessage.java
│   ├── ToolCall.java
│   ├── ToolResult.java
│   ├── ExecutionPlanEvent.java
│   ├── ExecutionStepEvent.java
│   ├── GenerativeUIDirective.java
│   ├── FrontendToolManifestEntry.java
│   ├── FrontendToolContinuation.java
│   └── UserCapabilityContext.java
├── security/
│   └── UserCapabilityContextResolver.java  # Extracts profiles from JWT
├── service/
│   └── ChatService.java                   # Conversation management + streaming dispatch
└── tool/
    ├── ToolDefinition.java                 # Interface: getName, getDescription, getParameters, execute
    ├── ToolRegistry.java                  # Tool lookup by capability context
    ├── CalculatorTool.java
    ├── TimeTool.java
    └── WeatherTool.java                   # Mock weather
```

## Agentic Architecture

```
AgentService.processMessageStreaming()
  │
  ├─ toolContext present or legacy flow? ──→ Direct model streaming path
  │
  └─ Agentic control loop active? ──→ AgentDecisionService.decide()
       │
       ├─ RESPOND ──→ streamAssistantReply(draft)
       ├─ CLARIFY ──→ streamAssistantReply(clarification)
       └─ PLAN ──→ PlanValidationService.validate()
                     │
                     ├─ Invalid ──→ streamAssistantReply(rejection)
                     ├─ REVIEW_REQUIRED ──→ streamAssistantReply(pending approval)
                     └─ Valid ──→ ExecutionOrchestrator.execute()
                                    │
                                    └─ ResultSynthesisService.synthesizeStreaming()
                                         │
                                         ├─ SSE: execution_plan events
                                         ├─ SSE: execution_step events
                                         ├─ SSE: tool_call / tool_result events
                                         └─ SSE: message tokens → done
```

## Control Plane

- **CapabilityRegistryService**: Loads capability definitions from JSON resources
- **CapabilityResolver**: Resolves capabilities based on user context and available tools
- **PolicyEvaluator**: Evaluates each resolved capability — ALLOW, REVIEW_REQUIRED, or DENY

## MCP Integration

Dynamic MCP provider registration via:

1. **REST API**: `POST /api/chat/mcp/providers` with `McpProviderRegistrationRequest`
2. **Bootstrap config**: `chatbot.mcp.providers` in `application.yml`

Supports `STREAMABLE_HTTP` and `HTTP_SSE` transport types. `McpClientFactory` creates MCP client sessions for registered providers.

## API Endpoints

| Method | Path                                        | Description                              |
| ------ | ------------------------------------------- | ---------------------------------------- |
| POST   | `/api/chat`                                 | Synchronous chat (blocks until complete) |
| POST   | `/api/chat/stream`                          | SSE streaming chat (JSON body)           |
| GET    | `/api/chat/stream`                          | SSE streaming chat (query params)        |
| GET    | `/api/chat/{id}/history`                    | Conversation history                     |
| DELETE | `/api/chat/{id}`                            | Clear conversation                       |
| GET    | `/api/chat/health`                          | Health check (excluded from rate limit)  |
| POST   | `/api/chat/{id}/tools/{toolCallId}/confirm` | Confirm/cancel tool execution            |
| POST   | `/api/chat/mcp/providers`                   | Register MCP provider                    |
| GET    | `/api/chat/mcp/providers`                   | List registered MCP providers            |
| DELETE | `/api/chat/mcp/providers/{providerId}`      | Unregister MCP provider                  |

## SSE Event Types

| Event             | Data                          | Description                            |
| ----------------- | ----------------------------- | -------------------------------------- |
| `conversation_id` | `{ "conversationId": "..." }` | Assigned conversation ID               |
| `message`         | `{ "text": "..." }`           | Streaming token                        |
| `tool_call`       | `ToolCall` object             | Tool execution request                 |
| `tool_result`     | `ToolResult` object           | Tool execution result                  |
| `generative_ui`   | `GenerativeUIDirective`       | Frontend UI rendering instruction      |
| `execution_plan`  | `ExecutionPlanEvent`          | Plan status (running/completed/failed) |
| `execution_step`  | `ExecutionStepEvent`          | Individual step status                 |
| `error`           | Error message                 | Streaming error                        |
| `done`            | `""`                          | Stream complete                        |

## Rate Limiting

- 60 requests/minute per client (by Bearer token or IP)
- Health endpoint (`/api/chat/health`) excluded
- Configurable via `chatbot.rate-limit.requests-per-minute`

## Security

- Spring Security disabled by default (`SecurityConfig` permits all requests)
- When enabled, requires Bearer token in `Authorization` header
- `UserCapabilityContextResolver` extracts user profiles from JWT claims
