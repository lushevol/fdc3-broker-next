# Chatbot Backend Spring AI Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fully migrate `services/chatbot-backend` from LangChain4j to Spring AI `1.1.6` with no mixed runtime, no placeholder approval flow, no protocol regressions, and no remaining LangChain4j dependencies or code paths in production.

**Architecture:** Replace direct LangChain4j coupling with a Spring AI adapter layer centered on `ChatModel`, `Prompt`, `ChatResponse`, `ToolCallingChatOptions`, `ToolCallingManager`, and Spring AI MCP client integration. The protocol/runtime path must use manual tool-loop control, not transparent framework-managed tool execution, so tool lifecycle events, approval pauses, frontend continuation, and resume semantics remain fully under application control.

**Tech Stack:** Spring Boot `3.5.x`, Spring AI `1.1.6`, Java 17, Spring WebFlux, SSE, Spring AI MCP Client, OpenAI-compatible chat model, Anthropic chat model.

---

### Task 1: Lock migration target and baseline compatibility

**Files:**
- Modify: `services/chatbot-backend/pom.xml`
- Modify: `services/chatbot-backend/README.md`
- Modify: `services/chatbot-backend/docs/PROJECT.md`
- Modify: `services/chatbot-backend/docs/ARCHITECTURE.md`

- [ ] Confirm migration target as Spring AI `1.1.6` and reject Spring AI `2.0.0-M6` because it is a milestone release.
- [ ] Upgrade Spring Boot from `3.2.0` to a compatible `3.5.x` line before introducing Spring AI `1.1.6`.
- [ ] Remove LangChain4j dependencies:
  - `dev.langchain4j:langchain4j`
  - `dev.langchain4j:langchain4j-open-ai`
  - `dev.langchain4j:langchain4j-anthropic`
  - `dev.langchain4j:langchain4j-mcp`
- [ ] Add Spring AI BOM and starters:
  - `org.springframework.ai:spring-ai-bom:1.1.6`
  - `org.springframework.ai:spring-ai-starter-model-openai`
  - `org.springframework.ai:spring-ai-starter-model-anthropic`
  - `org.springframework.ai:spring-ai-starter-mcp-client`
- [ ] Do not leave any optional or fallback LangChain4j dependency in the final build.
- [ ] Choose the exact Spring AI MCP client transport dependency during implementation and make it mandatory in the final state.
- [ ] Remove the `spring-milestone` repository from Maven because Spring AI `1.1.6` is in Maven Central.
- [ ] Update repo docs so the service no longer claims LangChain4j usage.

### Task 2: Introduce an internal Spring-AI-facing model adapter boundary

**Files:**
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/ai/`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentDecisionService.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/ResultSynthesisService.java`

- [ ] Create internal adapter interfaces so orchestration code no longer imports provider-specific model classes directly.
- [ ] Split responsibilities into:
  - prompt/message mapping
  - chat invocation
  - streaming token emission
  - tool-call loop control
- [ ] Keep `AgentService`, `AgentDecisionService`, and `ResultSynthesisService` focused on business behavior rather than library-specific message classes.
- [ ] Standardize on `ChatModel` for runtime orchestration and protocol flows.
- [ ] Do not use `ChatClient` in the protocol/runtime execution path because it adds abstraction where the application needs exact control over tool-call and resume semantics.
- [ ] Make the adapter layer responsible for translating:
  - existing `ChatMessage`
  - existing `ToolCall`
  - existing `ToolResult`
  - Spring AI `Prompt` / `Message`
  - Spring AI `ChatResponse`

### Task 3: Replace manual LangChain4j model construction with Spring bean configuration

**Files:**
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/config/AiModelConfig.java`
- Modify: `services/chatbot-backend/src/main/resources/application.yml`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`

- [ ] Remove `@PostConstruct` creation of `OpenAiChatModel` and `OpenAiStreamingChatModel` from `AgentService`.
- [ ] Inject Spring-managed model beans instead.
- [ ] Decide and document provider selection strategy:
  - default provider remains OpenAI-compatible endpoint
  - Anthropic support becomes explicit and testable, instead of being declared only in config/docs
- [ ] Introduce typed configuration properties for:
  - provider selection
  - model name
  - temperature
  - max tokens
  - base URL for OpenAI-compatible deployments
- [ ] Ensure DashScope-style OpenAI-compatible base URLs continue to work after migration.
- [ ] Finalize one runtime provider strategy for production:
  - one configured active provider per deployment, selected by config
  - no silent fallback between providers
  - no half-wired provider declarations that are not exercised by tests

### Task 4: Rebuild synchronous decision and synthesis flows on Spring AI Prompt/ChatResponse

**Files:**
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentDecisionService.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/ResultSynthesisService.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentDecisionServiceTest.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/ResultSynthesisServiceTest.java`

- [ ] Replace LangChain4j message/request classes with Spring AI `Prompt`, `SystemMessage`, `UserMessage`, and `AssistantMessage` equivalents.
- [ ] Preserve current decision parsing semantics:
  - fenced JSON responses
  - wrapped `response` objects
  - `text` / `message` / `response` fallback fields
  - case-insensitive decision type handling
- [ ] Preserve synthesis fallback behavior when the model is unavailable or returns unusable content.
- [ ] Port tests so they assert prompt composition and output parsing against Spring AI request/response types.

### Task 5: Rebuild streaming chat path with user-controlled tool execution

**Files:**
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/ai/SpringAiStreamingConversationRunner.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentServiceTest.java`

- [ ] Do not rely on Spring AI’s default transparent tool execution for the protocol path because current behavior requires visible `tool_call` and `tool_result` events.
- [ ] Use `ToolCallingChatOptions` with `internalToolExecutionEnabled(false)` for protocol/tool-observable flows.
- [ ] Implement a manual tool-call loop that:
  - sends the prompt
  - inspects `ChatResponse` for tool calls
  - emits existing SSE/tool events
  - executes backend tools or pauses for frontend confirmation
  - appends tool results back into conversation history
  - resumes the model until final assistant text is produced
- [ ] Preserve cancellation semantics from `processMessageStreaming`.
- [ ] Preserve final streamed assistant text behavior for:
  - ordinary responses
  - planner responses
  - tool-resume responses
  - mock mode fallback

### Task 6: Make approval-required backend tools fully resumable in production

**Files:**
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/ai/PendingToolExecutionStore.java`
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/ai/model/`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ProtocolChatController.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentServiceTest.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/protocol/ProtocolChatServiceTest.java`

- [ ] Replace the current live-path placeholder approval behavior with a real production flow.
- [ ] Persist enough pending execution state to resume an approval-required backend tool after user confirmation:
  - conversation ID
  - tool call ID
  - tool name
  - arguments
  - pre-tool conversation history
  - post-approval continuation context
  - execution target and provider metadata
- [ ] Implement both approve and reject paths for live Spring AI tool calls.
- [ ] After approval, execute the backend tool, append the tool result into the Spring AI conversation history, and continue the model loop to completion.
- [ ] After rejection, emit the correct tool-result error and continue or finish according to the protocol contract.
- [ ] Remove the current `UnsupportedOperationException` live-path dead end and remove the placeholder semantics from `confirmToolCall()`.
- [ ] If the protocol requires a submit-action endpoint in addition to resumed chat runs, implement it as part of this migration instead of leaving action handling implicit.

### Task 7: Adapt existing tool registry to Spring AI ToolCallback contracts

**Files:**
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/ai/tool/`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/tool/ToolDefinition.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/tool/ToolRegistry.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentServiceTest.java`

- [ ] Keep the existing `ToolDefinition` and `ToolRegistry` surface stable for the rest of the application.
- [ ] Add an adapter from local `ToolDefinition` to Spring AI `ToolCallback`.
- [ ] Ensure JSON schema translation preserves:
  - required fields
  - nested objects
  - arrays
  - enums
  - passthrough raw schema shapes
- [ ] Preserve confirmation-required tools by carrying existing metadata through the adapter and into the pending-execution store.
- [ ] Preserve backend/frontend execution target distinctions so the protocol layer still knows which tool calls are resumable or confirmable.

### Task 8: Replace LangChain4j MCP client implementation with Spring AI MCP client integration

**Files:**
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/mcp/McpClientFactory.java`
- Replace: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/mcp/LangChain4jMcpClientFactory.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/mcp/McpProviderRegistryService.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/mcp/LangChain4jMcpClientFactoryTest.java`
- Rename/Test: Spring AI MCP client factory test replacement

- [ ] Re-implement the MCP client session factory using Spring AI MCP client starter facilities or underlying Spring AI MCP client APIs.
- [ ] Preserve support for:
  - `STREAMABLE_HTTP`
  - `HTTP_SSE`
  - multiple registered providers
  - provider lifecycle cleanup
  - tool schema discovery
  - async tool execution via `CompletableFuture`
- [ ] Preserve current normalization of tool results into plain Java `Map` / `List` / scalar values.
- [ ] Preserve provider metadata propagation into `RegisteredMcpProvider` and downstream protocol frames.
- [ ] Rename tests to reflect Spring AI ownership instead of LangChain4j ownership.

### Task 9: Preserve frontend tool continuation and protocol compatibility

**Files:**
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/protocol/ProtocolChatService.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ProtocolChatController.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/protocol/ProtocolChatServiceTest.java`

- [ ] Preserve the current frontend tool continuation contract:
  - historical tool-call replay
  - tool-result replay
  - resume prompt injection
  - blocked repeated frontend tool invocation
- [ ] Preserve legacy `context.frontendTools` compatibility until the separate protocol cleanup plan removes it.
- [ ] Keep emitted protocol frames stable:
  - `tool_call`
  - `tool_result`
  - `execution_plan`
  - `execution_step`
  - `message`
  - `done`
  - `error`
- [ ] Regression-test the confirm/continue path specifically, because it is the least compatible with framework-managed tool execution.
- [ ] Preserve exact finish-reason semantics now used by the protocol stream:
  - `stop`
  - `tool-calls`
  - `action-required`
  - `error`
- [ ] Preserve exact action frame semantics for approval-required tools:
  - `action-required`
  - `actionType=tool-approval`
  - stable option IDs for approve/reject
- [ ] Ensure the final implementation supports both protocol entry points:
  - `POST /api/chat/runs`
  - `POST /api/chat/stream`
- [ ] Fix the `/api/chat/stream` request-to-protocol adapter so it preserves protocol-relevant context rather than dropping it during conversion:
  - `frontendTools`
  - `toolContext` or resumed tool context equivalent
  - workspace context
  - message history semantics

### Task 10: Tighten provider selection and multi-model strategy

**Files:**
- Create: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/config/ChatbotAiProperties.java`
- Modify: `services/chatbot-backend/src/main/resources/application.yml`
- Modify: `services/chatbot-backend/docs/PROJECT.md`

- [ ] Make provider selection explicit instead of silently hard-coding OpenAI-compatible behavior while claiming Anthropic support.
- [ ] Use one active provider per deployment, selected explicitly by config.
- [ ] Allow runtime switching only through deployment configuration, not per-request hidden branching.
- [ ] Defer cross-provider fallback logic unless a concrete business requirement exists.
- [ ] Update env documentation so supported providers match actual runtime behavior.

### Task 11: Rebuild tests around behavioral invariants and protocol contracts

**Files:**
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentServiceTest.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentDecisionServiceTest.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/ResultSynthesisServiceTest.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/protocol/ProtocolChatServiceTest.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/mcp/*`

- [ ] Replace direct assertions on LangChain4j types with assertions on:
  - emitted domain events
  - prompt contents
  - tool schemas
  - tool loop behavior
  - protocol frame stability
- [ ] Add regression coverage for:
  - streamed partial tokens plus final completion
  - confirmation-required tools
  - cancelled confirmations
  - frontend tool resume
  - MCP tool discovery and execution result normalization
  - planner validation and synthesis on Spring AI-backed models
- [ ] Add protocol golden tests with exact frame sequences and payload keys for:
  - plain assistant response
  - backend tool call and result
  - frontend tool call and resumed completion
  - approval-required backend tool pause and approval resume
  - approval-required backend tool rejection
  - MCP-backed backend tool call
  - planner execution with `execution_plan` and `execution_step` frames
- [ ] Add endpoint-parity tests proving `/api/chat/runs` and `/api/chat/stream` produce equivalent protocol-visible behavior for the same conversation turn.

### Task 12: Verification and rollout

**Files:**
- Modify: `services/chatbot-backend/README.md`
- Modify: `services/chatbot-backend/docs/ARCHITECTURE.md`

- [ ] Run service-local verification:
  - `cd services/chatbot-backend && npm run test`
  - `cd services/chatbot-backend && npm run build`
- [ ] Run relevant monorepo verification:
  - `npm run test -- --filter=chatbot-backend` if supported
  - otherwise targeted Maven/Node commands already used by this workspace
- [ ] Perform live smoke checks against `/api/chat/stream` and protocol endpoints:
  - plain response
  - planner response
  - backend tool execution
  - frontend confirmation pause/resume
  - MCP-backed tool execution
- [ ] Perform live approval tests for production Spring AI path:
  - approval-required backend tool emits `action-required`
  - approval submit resumes the exact pending tool call
  - rejection produces the expected tool error contract
- [ ] Verify `/api/chat/runs` and `/api/chat/stream` both preserve chat protocol behavior end-to-end.
- [ ] Validate no contract drift at `http://localhost:8001` for the chat frontend integration after backend swap.
- [ ] Remove all remaining LangChain4j imports, dependencies, logging categories, and implementation references before calling the migration complete.

## Migration-specific risks to manage

- Spring AI `1.1.6` requires a newer Spring Boot baseline than the current `3.2.0`; this is the first hard prerequisite.
- Default Spring AI tool execution hides internal tool-call messages; current protocol behavior requires manual control.
- MCP migration is not just a dependency swap because the current code hand-translates tool schemas and result payloads.
- The codebase currently documents Anthropic support, but runtime initialization in `AgentService` is OpenAI-only; migration should fix or explicitly narrow that discrepancy.
- Tests currently mock LangChain4j request/response types heavily, so test churn will be substantial even if runtime behavior remains the same.
- The current live backend approval flow is not production-complete today; the migration must close that gap rather than preserve it.
- The final state must not depend on an implied UI behavior to resolve approvals; the backend protocol contract has to be explicit and test-covered.

## Recommended execution order

1. Boot/Spring AI dependency upgrade and config cleanup.
2. Internal adapter layer introduction.
3. Decision/synthesis port to Spring AI.
4. Streaming/tool loop port with manual tool execution.
5. Production approval/resume implementation for backend tools.
6. MCP client replacement.
7. Protocol/frontend continuation hardening.
8. Full golden-contract test rewrite and live smoke verification.
