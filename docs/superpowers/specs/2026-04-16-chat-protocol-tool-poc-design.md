# Chat Protocol Tool POC Design

Date: 2026-04-16

## Goal

Define the smallest protocol-first proof of concept that proves one chat run can coordinate:

- multiple MCP tools from different providers
- frontend tools aligned with `assistant-ui` `Tools()` expectations
- human tools for HITL aligned with `assistant-ui` human tool expectations
- backend tools, frontend tools, human tools, and MCP tools in the same run
- request-level dynamic tool registration

This design is intentionally narrow. It excludes `apps/base` production integration and avoids long-term platform abstractions. The goal is to get the path working with the least code in the existing protocol track backed by the LangChain4j chatbot-backend.

## Scope Constraints

This design follows four explicit constraints:

1. Build the minimum design needed for the POC.
2. Exclude `apps/base` existing implementation and focus only on protocol packages, demo app, and chatbot-backend.
3. Prefer the smallest amount of code that proves the flow end-to-end before any optimization.
4. No Node.js demo server. The backend is the Java/Spring Boot `services/chatbot-backend` with LangChain4j.

## Success Criteria

The POC is successful when the isolated protocol demo can show one conversation that:

1. exposes frontend, human, backend, and MCP tools through one unified tool list
2. executes at least one frontend tool locally in the browser/runtime
3. pauses for at least one human tool and resumes with user input
4. executes backend logic and at least two MCP tools from different `providerId` values
5. changes the available tool set between runs without restarting the demo stack

## Non-Goals

Do not design or build any of the following in this POC:

- `apps/base` integration
- independent registry services
- provider health scoring or routing policies
- tool conflict resolution framework
- session-wide registry sync or broadcast
- long-term plugin architecture
- production-grade orchestration engine
- advanced planning DAGs or capability graphs
- Node.js demo server or demo-support package

## Context

The repo already contains a protocol-oriented track:

- `packages/chat-protocol-contract` — TypeScript types, Zod schemas, validation, fixtures
- `packages/chat-protocol-frontend` — Stream adapter, local runtime, message renderer
- `apps/chat-protocol-demo-web` — Vite+React demo app with SSE streaming to backend
- `services/chatbot-backend` — Spring Boot service (port 8080) with LangChain4j, MCP, and the existing `/api/chat/runs` SSE endpoint

The chatbot-backend already contains:

- `ProtocolChatController` serving SSE at `/api/chat/runs`
- `ProtocolChatService` orchestrating LangChain4j agent streaming
- `AgentService` for LLM calls with tool execution
- `ToolRegistry` with local and MCP tool registration
- `McpProviderRegistryService` for dynamic MCP provider management
- `ExecutionOrchestrator`, `CapabilityResolver`, `ExecutionPlanner` for agent orchestration

The existing protocol work carries concepts that are close but need updating:

- `ToolCall.ExecutionTarget` uses `FRONTEND | BACKEND` instead of the unified `source` model
- `ProtocolFrontendTool` uses `interactionMode` instead of `source: frontend | backend | human | mcp`
- `ProtocolRunContext` exposes `frontendTools` as a separate list instead of a unified `tools` array
- SSE frames emit `executionTarget` for tool calls instead of `source`

This POC aligns these to the smallest set of concepts that can still support the required tool combinations.

## Design Principles

1. **One unified tool model**
   All tools are described with one protocol descriptor regardless of where they execute.

2. **Request-level registration**
   Dynamic registration is implemented by passing the currently visible tools in each run request, not by introducing a live registry service.

3. **One tool lifecycle**
   Frontend, human, backend, and MCP tools all use the same `tool-call` message part shape with minimal state differences.

4. **Assistant UI compatibility at the edge**
   The protocol does not embed assistant-ui internals, but it must carry enough information for a frontend runtime to construct `Tools()`-compatible toolkits and human tool UIs.

5. **LangChain4j-first verification**
   The first proof happens through the existing LangChain4j chatbot-backend serving real LLM-driven tool orchestration, not through a scripted mock server.

6. **Incremental migration from `executionTarget` to `source`**
   The backend already emits `executionTarget` on tool-call frames. The POC adds `source` as the primary field and keeps `executionTarget` as a backward-compatible fallback until the frontend fully migrates.

## Minimal Protocol Model

The POC keeps only four core objects.

### 1. `ChatToolDescriptor`

One descriptor type represents every tool.

Required fields:

- `name`
- `source`: `frontend | backend | human | mcp`
- `description`
- `parameters`

Optional fields:

- `providerId` for MCP tools
- `requiresConfirmation` for human or confirm-before-run flows
- `ui` for frontend rendering hints when needed by the demo

This replaces the narrower `ProtocolFrontendTool.interactionMode` concept for the POC path.

### 2. `RunContext`

Every run request carries the currently visible tool list.

Minimal shape:

```json
{
  "context": {
    "tools": [
      {
        "name": "location.resolve",
        "source": "frontend",
        "description": "Resolve a location from browser-side context",
        "parameters": {
          "type": "object",
          "properties": {
            "query": { "type": "string" }
          },
          "required": ["query"]
        }
      }
    ]
  }
}
```

For this POC, dynamic registration means the `tools` array may differ on every `POST /runs` request. The existing `frontendTools` and `workspace` fields on `ProtocolRunContext` remain supported for backward compatibility and are merged into the unified `tools` list at request processing time.

### 3. `ToolCallPart`

All tool activity uses one tool-call part shape.

Required fields:

- `toolCallId`
- `toolName`
- `source`
- `state`
- `input`

Optional fields:

- `providerId`
- `output`
- `error`

Minimal state set:

- `input-available`
- `awaiting-execution`
- `awaiting-human`
- `output-available`
- `output-error`

The POC adds `source` to `ProtocolPart` frames. During the transition, `executionTarget` is also emitted as a fallback derived from `source`:

| source    | executionTarget |
|-----------|----------------|
| frontend  | frontend        |
| human     | frontend        |
| backend   | backend         |
| mcp       | backend         |

### 4. `ResumeSubmission`

The POC treats any user- or frontend-driven continuation as resuming the current run with a new request payload.

It does not introduce a separate continuation service. Instead:

- frontend tool completion appends the resolved tool result into messages and submits the next run
- human tool completion appends the user-approved or user-entered result into messages and submits the next run

This keeps the POC aligned with state-based resume without adding extra backend infrastructure.

## Protocol Behavior by Tool Source

### Frontend Tools

- Declared in `context.tools` with `source: "frontend"`
- Executed by the protocol frontend runtime
- Represent the browser/runtime side of `assistant-ui` `Tools()`
- When the LLM calls a frontend tool, the backend emits `tool-input-available` with `source: "frontend"` and finishes with `finishReason: "tool-calls"`
- The frontend resolves the tool locally, appends the result, and resumes the run
- The backend receives the resumed request with the tool result and continues the LLM session

### Human Tools

- Declared in `context.tools` with `source: "human"`
- Rendered by the frontend as HITL UI
- Represent `assistant-ui` human-in-the-loop tools
- When the LLM calls a human tool, the backend emits `tool-input-available` with `source: "human"` and `state: "awaiting-human"`, finishes with `finishReason: "action-required"`
- The frontend pauses, the user approves or enters input, then resumes the run
- The backend receives the resumed request with the human decision and continues the LLM session

### Backend Tools

- Declared with `source: "backend"`
- Registered with LangChain4j as `@Tool`-annotated methods on the backend
- Executed directly by the chatbot-backend through the agent
- The LLM calls the tool, the backend executes it via LangChain4j, and streams the result
- Frontend only renders status

### MCP Tools

- Declared with `source: "mcp"` and `providerId`
- Retrieved from the `McpProviderRegistryService` and registered with the LangChain4j agent dynamically
- Executed by the chatbot-backend through LangChain4j's MCP client
- Multiple MCP tools may coexist in one run as long as each tool name is unique
- Frontend only renders status

For the POC, tool names must be globally unique. No conflict-resolution layer is introduced.

## LangChain4j Tool Dispatch

The chatbot-backend uses LangChain4j to orchestrate tool calling. The POC adds `source`-aware dispatch:

1. **Request processing**: When a `ChatRunRequest` arrives with `context.tools`, the backend:
   - Separates tools by `source`
   - Registers `backend` tools as LangChain4j `@Tool`-annotated methods
   - Resolves `mcp` tools from the `McpProviderRegistryService` by `providerId`
   - Includes `frontend` and `human` tools in the LLM's tool schema but marks them for delegation

2. **LLM session**: The agent includes all declared tools in the LLM's available functions. When the LLM calls a tool:
   - If `source: "backend"` or `source: "mcp"`: execute on the server and stream the result
   - If `source: "frontend"`: emit `tool-input-available` with `source: "frontend"` and pause the run
   - If `source: "human"`: emit `tool-input-available` with `source: "human"` and pause the run

3. **Tool result handling**: For frontend and human tools, the client resumes the run with the tool result appended. The backend feeds this result back into the LangChain4j session and continues.

This reuses the existing `AgentService.processProtocolMessageStreaming` flow with an added `source` dimension on tool dispatch.

## Multi-MCP POC Rule

The POC definition of "multi-MCP coexist and collaboration" is intentionally narrow:

- the visible tool list may contain tools from multiple `providerId` values
- one run may invoke more than one MCP tool
- those MCP tools may come from different providers
- the final assistant response may synthesize their combined outputs

This proves coexistence and cooperation without building a generic provider routing system.

## Dynamic Registration Rule

Dynamic registration is implemented at request scope only.

That means:

- frontend tools can appear or disappear between runs depending on what the client sends
- backend and MCP tools can appear or disappear between runs depending on what the server merges into the available set and what `McpProviderRegistryService` provides
- no live push or registry delta channel is required

The `McpProviderRegistryService` already supports dynamic provider registration at runtime via its REST API. The POC leverages this without building new infrastructure.

## Assistant-UI Alignment

This design must stay compatible with `assistant-ui` guidance without baking assistant-ui-specific objects into the protocol contract.

The protocol must support a frontend runtime that can derive:

- `frontend` tools into `Tools({ toolkit })` executable entries
- `human` tools into HITL tool entries
- `backend` and `mcp` tools into render-only tool UI entries

The contract therefore carries descriptor-level semantics, while the actual `assistant-ui` mapping remains in the protocol frontend package.

## Minimal End-to-End Flow

The POC should prove one LLM-driven conversation like this:

1. user submits a message with `context.tools` containing all four source types
2. backend registers backend and MCP tools with LangChain4j, includes frontend and human tools in the schema
3. LLM calls a frontend tool (e.g., `location.resolve`)
4. backend emits `tool-input-available` with `source: "frontend"`, finishes with `finishReason: "tool-calls"`
5. frontend executes the tool locally, appends the result, and resumes the run
6. backend feeds the result back to the LLM session
7. LLM calls a human tool (e.g., `approval.confirm`)
8. backend emits `tool-input-available` with `source: "human"`, finishes with `finishReason: "action-required"`
9. user approves, frontend appends the result, and resumes the run
10. LLM calls backend tool (e.g., `summary.compose`) — backend executes via `@Tool` and streams result
11. LLM calls MCP tools from different providers (e.g., `analytics.lookup` from `analytics-mcp`, `profile.lookup` from `profile-mcp`) — backend executes via LangChain4j MCP client
12. LLM returns a final assistant summary synthesizing all outputs

This single scenario covers all five requested capabilities.

## Files In Scope

Primary implementation targets:

- `packages/chat-protocol-contract` — TypeScript types, Zod schemas, validation, fixtures
- `packages/chat-protocol-frontend` — Stream adapter, local runtime, resume helpers
- `apps/chat-protocol-demo-web` — React demo app
- `services/chatbot-backend` — Java/Spring Boot backend with LangChain4j (extend existing)

Key Java files to modify:

- `protocol/model/ProtocolRunContext.java` — add `tools` field
- `protocol/model/ProtocolPart.java` — add `source` and `providerId` fields
- `protocol/model/ProtocolFrontendTool.java` — keep for backward compatibility, add mapping from unified descriptor
- Add new `protocol/model/ProtocolToolDescriptor.java` — unified tool descriptor
- `protocol/ProtocolChatService.java` — source-aware tool dispatch
- `agent/AgentService.java` — register frontend/human tools as delegatable
- `model/ToolCall.java` — add `source` and `providerId` fields

Explicitly out of scope for this POC design:

- `apps/base`
- `services/chatbot-backend` production path (AdvancedCapabilityControlPlane, planning DAGs, etc.)
- `packages/chat-protocol-demo-support` (removed)
- `apps/chat-protocol-demo-server` (removed)

## Implementation Plan

### Phase 1: Contract Unification

Goal:

- extend the protocol contract to describe all tool sources through one descriptor

Changes:

- verify `ChatToolDescriptor` type and schema in the contract package
- verify `context.tools` support in the run request schema
- verify `source` and `providerId` on tool-call parts
- verify fixtures covering frontend, human, backend, and multiple MCP tools

Acceptance:

- contract validation passes
- fixtures express all four tool sources

### Phase 2: Backend Unified Tool Model

Goal:

- extend the chatbot-backend protocol models to accept and dispatch the unified tool model

Changes:

- add `ProtocolToolDescriptor` Java record with `name`, `source`, `description`, `parameters`, `providerId`, `requiresConfirmation`, `ui`
- add `ChatToolSource` Java enum with `FRONTEND`, `BACKEND`, `HUMAN`, `MCP` values
- update `ProtocolRunContext` to include `tools` list alongside existing `frontendTools`
- update `ProtocolPart` to include `source` and `providerId` fields
- update `ProtocolChatService.streamRun()` to:
  - merge `context.tools` with `context.frontendTools` into a unified tool list
  - emit `source` on `tool-input-available` frames
  - derive `executionTarget` from `source` for backward compatibility
  - route `human` tool calls to `action-required` finish reason

Acceptance:

- backend accepts run requests with `context.tools` containing all four source types
- SSE frames include `source` field on tool-call events
- backward compatibility: requests using only `frontendTools` still work

### Phase 3: Frontend Runtime Source-Based Dispatch

Goal:

- make the demo frontend dispatch tool behavior by `source`

Changes:

- verify `createProtocolStreamAdapter` maps `source` correctly on incoming frames
- verify `human` source maps to `awaiting-human` state
- verify `backend` and `mcp` sources map to `awaiting-execution` state
- verify `frontend` source maps to `input-available` state
- verify resume handling for frontend and human tools works
- update `ChatProtocolApp.tsx` default API URL to `http://127.0.0.1:8080/api/chat/runs`

Acceptance:

- frontend tool execution resumes the run
- human tool pause/resume works
- backend and MCP tool status render correctly
- demo app connects to chatbot-backend on port 8080

### Phase 4: Request-Level Dynamic Registration

Goal:

- prove tool availability can change between runs

Changes:

- verify the demo app toggles between minimal and full tool presets
- verify the backend merges client-sent `context.tools` with server-side backend/MCP tools
- verify MCP tools from different providers can be invoked in the same run
- run two conversations with different tool presets and verify different tool sets are active

Acceptance:

- run A and run B can expose different tool sets
- the demo adapts without restart
- multi-provider MCP tool calls appear in the same conversation

## Test Strategy

Keep testing minimal and directly tied to the POC goals.

### Contract Tests

- descriptor schema validation for all four source types
- run context with mixed tool sources
- tool-call part validation for each source
- MCP tool requires `providerId`

### Backend Tests (JUnit 5)

- `ProtocolRunContext` deserialization with `context.tools` containing mixed sources
- `ProtocolChatService` emits `source` on tool-call frames
- `ProtocolChatService` maps `source` to correct `executionTarget` and `finishReason`
- Backward compatibility: requests with only `frontendTools` still work

### Frontend Runtime Tests

- frontend tool execution path
- human tool wait/resume path
- backend/MCP render-only path
- source mapping on incoming SSE frames

### End-to-End Demo Test

- one conversation covers frontend -> human -> backend -> MCP -> MCP -> final answer
- different tool presets produce different visible tools
- all tool sources can coexist in one run

## Risks

### Risk 1: Over-design returns through "registry" work

Mitigation:

- keep dynamic registration request-scoped only
- leverage existing `McpProviderRegistryService` for MCP provider management

### Risk 2: Human tool becomes a parallel action system

Mitigation:

- model HITL as a tool source, not as a separate protocol subsystem
- reuse the existing `action-required` finish reason for human tools

### Risk 3: MCP ambition expands into provider management

Mitigation:

- define multi-MCP success narrowly as same-run coexistence and invocation across two `providerId` values
- use existing `McpProviderRegistryService` REST API for provider registration

### Risk 4: LangChain4j tool delegation for frontend/human tools is complex

Mitigation:

- for the POC, register frontend and human tools as LangChain4j `@Tool` methods that return a "delegation required" signal
- the backend then emits the tool call to the client and pauses the run
- on resume, the backend injects the tool result into the LangChain4j session

### Risk 5: Backward compatibility breakage

Mitigation:

- keep `executionTarget` as a derived field on SSE frames (frontend maps to frontend, everything else maps to backend)
- keep `frontendTools` on `ProtocolRunContext` alongside the new `tools` field
- the backend merges both into the unified tool list

## Open Decisions

Two decisions remain for implementation, both should be settled pragmatically:

1. Should resumed tool results be appended as assistant tool-call output parts only, or also as explicit tool messages in the conversation array?

   Recommendation: use assistant message tool-call output parts only for the POC. The backend already has `ResumableToolContext` that extracts tool results from assistant message parts. Stick with this pattern.

2. Should the backend register all four source types as LangChain4j tools, or only backend and MCP?

   Recommendation: register all four source types as LangChain4j tools. Frontend and human tools are registered as delegating `@Tool` methods that immediately signal "needs client interaction." This lets the LLM decide when to call each tool type, and the dispatch layer handles the routing.

## Recommended Next Step

Write the implementation plan only for the isolated POC path:

- contract package verification
- chatbot-backend model and service updates
- frontend runtime verification
- demo web app integration with chatbot-backend

Do not expand the plan to production integration until the isolated POC is proven.
