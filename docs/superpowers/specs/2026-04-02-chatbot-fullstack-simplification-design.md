# Chatbot Full-Stack Simplification Design

## Goal

Reduce the chatbot frontend and backend implementation to a smaller, more maintainable shape without breaking the primary chat workflow:

- open the assistant modal
- send a user message
- stream assistant text
- handle backend and frontend tool calls
- render tool and generative UI content
- continue the conversation after tool execution

Small cleanup to non-core UX and internal APIs is allowed if it materially simplifies the architecture and does not break the main functions above.

## Current Problems

### Frontend

- Frontend tool registration is split across multiple places:
  - built-in toolkits inside `AssistantUIRuntimeProvider`
  - page-level registration components
  - demo/example toolkit paths
- Demo and example code is mixed into the production chatbot surface.
- `AssistantUIRuntimeProvider` contains multiple responsibilities:
  - tool assembly
  - tool manifest serialization
  - thread-to-conversation bookkeeping
  - frontend tool continuation handling
  - SSE streaming orchestration
- The SSE adapter repeats the same "find or create assistant message" logic across several event branches.
- Some wrapper components and exports provide little value relative to their maintenance cost.

### Backend

- `ChatService` has many overloaded `processMessageStreaming` variants that all forward to the same implementation.
- `AgentService` also contains repeated streaming overloads and mixed responsibilities around frontend tool manifest handling and prompt/tool setup.
- The controller contains minor duplication around SSE event emission and stream setup.

## Decisions

### Decision: Centralize frontend tool registration in a single registry module

Create one central frontend tool registry for the chatbot surface. This becomes the only production assembly point for frontend toolkits.

Responsibilities:

- include backend render-only tool UIs
- include business frontend tools
- exclude demo tools when covered by business tools
- expose a narrow configuration input for runtime-dependent tools
- return a single merged toolkit plus metadata/manifest helpers

### Decision: Remove demo/example registration paths from the production chatbot surface

Remove demo-only and example-only code from the main chatbot path where it does not serve business behavior.

Candidates:

- `demoToolkit`
- `demoToolLogic`
- demo tool UI components
- `WorkspaceSummaryToolRegistrationExample`
- wrapper-only registration components that exist only to inject a toolkit into the provider

Keep debug-only surfaces only if they provide active value to the main app and can be supported without duplicate registration paths.

### Decision: Keep the frontend/backend manifest contract stable

The backend still receives `frontendTools` manifest data and still supports frontend tool continuation through `toolContext`.

This preserves:

- frontend tool discovery by the backend agent
- frontend tool execution resumption
- current SSE event contract

### Decision: Collapse repeated assistant message update logic into shared helpers

The SSE adapter should own one shared helper for locating or creating the current assistant message, and event handlers should use it instead of duplicating array/index mutation logic in each branch.

### Decision: Reduce overloaded backend entry points

Refactor service/controller code so there is one canonical streaming implementation per layer, with convenience overloads removed or minimized.

This should reduce code size and cognitive overhead without changing public HTTP behavior.

## Architecture

### Frontend

Add a new central tool registry module under `apps/base/src/components/ChatbotSidebar/tools/`:

- accepts runtime business context needed by frontend tools
- assembles the production toolkit set
- returns:
  - merged toolkit
  - tool metadata
  - frontend manifest

`AssistantUIRuntimeProvider` consumes this module instead of directly building and merging multiple toolkit sources.

`Home/index.tsx` stops mounting example registration components and instead passes the minimal business context required for production frontend tools directly to the provider.

### Backend

`ChatService` keeps one main `processMessageStreaming(...)` implementation and lightweight helpers only where needed.

`AgentService` keeps one main streaming path that:

- resolves tool availability
- resolves frontend tool manifests
- handles frontend tool continuation
- drives model streaming and tool lifecycle callbacks

Repeated overload scaffolding is removed.

## Testing

Frontend:

- central registry composition tests
- runtime provider tests for manifest creation and tool registration behavior
- SSE adapter tests for message/tool/data event updates
- tool UI tests for surviving business tool rendering
- export tests updated to match removed APIs

Backend:

- `ChatServiceTest` for streaming persistence and tool/generative UI callback flow
- `ChatControllerTest` for stream endpoint behavior
- `AgentServiceTest` for frontend tool manifest and continuation behavior

## Risks

- External code may rely on exported demo/debug/example APIs.
- Frontend tool continuation is sensitive to message content shape.
- Over-aggressive cleanup in the provider could break assistant-ui runtime expectations.

## Mitigations

- Preserve the manifest and continuation payload contract.
- Keep business tool names stable.
- Verify with targeted frontend and backend test suites.
- Run app-level UI verification after frontend changes.
