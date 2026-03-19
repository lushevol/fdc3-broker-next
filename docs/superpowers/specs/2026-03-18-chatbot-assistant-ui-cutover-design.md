# Chatbot Assistant-UI Cutover Design

## Context

The chatbot codebase is partially migrated to `assistant-ui`, but the current implementation still carries two runtime paths. The newer path lives in [`apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx`](/Users/taissa/lushuai/code/mfe/mfe-next/apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx), while the legacy controller path still owns separate transport and state logic in [`apps/base/src/components/ChatbotSidebar/common/useController.ts`](/Users/taissa/lushuai/code/mfe/mfe-next/apps/base/src/components/ChatbotSidebar/common/useController.ts) and related provider code.

That duplication is the main blocker to optimization. It keeps streaming, retry, error handling, conversation identity, and tool rendering split across incompatible abstractions. The backend already exposes SSE streaming via [`services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ChatController.java`](/Users/taissa/lushuai/code/mfe/mfe-next/services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ChatController.java), [`services/chatbot-backend/src/main/java/com/fdc3/chatbot/service/ChatService.java`](/Users/taissa/lushuai/code/mfe/mfe-next/services/chatbot-backend/src/main/java/com/fdc3/chatbot/service/ChatService.java), and [`services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`](/Users/taissa/lushuai/code/mfe/mfe-next/services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java), but live tool confirmation is still incomplete and should not block the initial cutover.

The user’s priority for this effort is:

1. Complete the migration first.
2. Then address performance and cleanup.
3. Then address correctness and stability.

The user selected an aggressive migration strategy: remove the legacy runtime path instead of preserving it as a real fallback.

## Goals

- Make `AssistantUIRuntimeProvider` the only real chatbot runtime on the frontend.
- Remove duplicate frontend SSE/state orchestration from the legacy controller/provider path.
- Keep the host embedding surface stable where possible, especially `ChatbotSidebarProps`.
- Preserve tool-call rendering and generative UI rendering on top of assistant-ui message parts.
- Keep the backend SSE contract working for current assistant-ui needs without blocking on full live tool confirmation.

## Non-Goals

- Do not redesign the sidebar placement or overall visual shell during this phase.
- Do not block migration on full backend tool confirmation support for the live model path.
- Do not introduce durable persistence beyond the current in-memory conversation approach.
- Do not optimize bundles or perform broad cleanup until the migration path is singular.

## Chosen Approach

The chosen approach is the most aggressive frontend cutover:

- Remove the legacy runtime as an implementation path.
- Make `AssistantUIRuntimeProvider` the only owner of message state, loading state, retry behavior, error state, and conversation identity.
- Retain only minimal compatibility exports if needed for compile-time stability, but those exports must not own transport or independent state.

This approach was chosen over a thin compatibility cutover because the user wants the migration completed first, not prolonged by keeping old architecture alive.

## Architecture

### Frontend Runtime

`AssistantUIRuntimeProvider` becomes the single runtime for:

- thread messages
- stream lifecycle
- retry behavior
- clear conversation behavior
- conversation identifier propagation
- error/loading state

`ChatbotSidebar` renders only against that runtime and themed assistant-ui primitives.

### Frontend Boundaries

The frontend will be split into three responsibilities:

- `AssistantUIRuntimeProvider` and related runtime hooks own state and stream lifecycle.
- `adapters/sseToAssistantUi.ts` remains the only layer that understands the backend SSE event contract and translates it into assistant-ui-compatible message content.
- Presentation components such as `ChatbotSidebar`, `ThemedThread`, `ToolCallRenderer`, and `GenerativeUIRenderer` stay focused on UI behavior and rendering.

The legacy controller/provider files should either be deleted or reduced to explicit shims with no independent EventSource, no duplicate state machine, and no parallel retry logic.

### Backend Contract

The backend remains SSE-based for this cut. The frontend adapter continues relying on the canonical event set:

- `conversation_id`
- `message`
- `tool_call`
- `tool_result`
- `generative_ui`
- `error`
- `done`

The backend must keep these events consistent enough for the assistant-ui adapter to function, but the migration does not wait for full live-model tool confirmation support. That limitation should remain explicit and predictable instead of being papered over by frontend complexity.

## API and Component Decisions

### Keep Stable

- `ChatbotSidebarProps` should remain stable for embedding MFEs.
- Existing sidebar open/close and mount behavior should remain stable from the host application’s perspective.
- Tool-call cards and generative UI rendering should remain visible within assistant responses.

### Remove or Narrow

- Remove duplicated SSE orchestration from `useChatbotController`.
- Remove or reduce `ChatbotProvider` so it no longer owns an independent chat runtime.
- Eliminate duplicate `EventSource` lifecycle management outside the assistant-ui runtime path.
- Remove tests that assert a separate legacy transport implementation and replace them with assistant-ui-centric coverage.

## Error Handling

- SSE transport or parse failures should surface through assistant-ui runtime error state.
- Failed streams should close cleanly and leave retry in a deterministic state.
- Retry should resend the last user message through the single runtime path.
- Clear conversation should reset local thread state and conversation identity through the same runtime path.
- Backend limitations, especially unsupported live tool confirmation, should fail explicitly instead of silently degrading behavior.

## Testing Strategy

Frontend tests should focus on the assistant-ui path as the only production runtime:

- adapter tests for SSE-to-assistant-ui event translation
- runtime provider tests for streaming state, retry, clear conversation, and error handling
- sidebar tests for rendering, controls, and tool/generative UI presentation
- thin-wrapper or deletion tests only where compatibility exports still exist

Backend tests should validate the stream contract and conversation behavior:

- conversation ID propagation
- streaming text accumulation
- tool-call emission
- tool-result emission
- completion signaling
- error signaling

## Success Criteria

The migration is complete when all of the following are true:

- There is only one real chatbot runtime path in production code.
- The frontend no longer carries duplicate EventSource/state orchestration.
- `ChatbotSidebar` still works for host MFEs without requiring embedding changes.
- The assistant-ui adapter path handles current SSE events end to end.
- The existing backend limitation around live tool confirmation is explicit and non-blocking.

## Follow-On Work

Once the runtime cutover is complete, the next passes should target:

1. Performance and cleanup
2. Correctness and stability hardening

Those passes should happen on top of the simplified single-runtime architecture, not alongside the migration itself.
