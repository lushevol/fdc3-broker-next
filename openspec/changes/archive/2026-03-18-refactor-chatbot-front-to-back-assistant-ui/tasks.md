## 1. Frontend Runtime Consolidation

- [x] 1.1 Audit `ChatbotSidebar`, `AssistantUIRuntimeProvider`, `ChatbotProvider`, and `useChatbotController` to identify duplicated runtime and EventSource responsibilities.
- [x] 1.2 Refactor the assistant-ui runtime path so one provider owns thread state, loading state, retry, and conversation lifecycle.
- [x] 1.3 Rework SSE adapter logic to handle the canonical event set (`conversation_id`, `message`, `tool_call`, `tool_result`, `generative_ui`, `error`, `done`) consistently.
- [x] 1.4 Update sidebar presentation components to rely on assistant-ui composer/thread primitives and keep Material-UI themed tool and generative UI renderers working.

## 2. Compatibility Surface

- [x] 2.1 Preserve `ChatbotSidebarProps` behavior while routing internal behavior through the assistant-ui runtime.
- [x] 2.2 Convert exported chatbot hooks/providers into compatibility wrappers or deprecations backed by the assistant-ui runtime.
- [x] 2.3 Update Module Federation exports and public typings so consuming MFEs keep working without integration changes.

## 3. Backend Streaming and Conversation Contract

- [x] 3.1 Refactor backend streaming orchestration so `ChatController` and `ChatService` emit the canonical SSE event contract for assistant-ui clients.
- [x] 3.2 Persist assistant turn output and conversation state updates so streaming and history endpoints stay consistent.
- [x] 3.3 Implement stable tool lifecycle payloads, including tool call IDs, result mapping, and confirmation-state handling.
- [x] 3.4 Ensure stream cancellation, error handling, and completion semantics release resources without corrupting conversation history.

## 4. Verification and Documentation

- [x] 4.1 Add or update frontend tests for adapter transformations, runtime behavior, retry/new chat flows, and inline tool/generative UI rendering.
- [x] 4.2 Add or update backend tests for SSE event sequencing, tool lifecycle behavior, confirmation flows, and conversation history persistence.
- [x] 4.3 Update chatbot integration and API documentation to reflect the assistant-ui runtime architecture and canonical SSE contract.
- [x] 4.4 Run the relevant frontend and backend verification suites and capture any follow-up cleanup needed before implementation is considered complete.
