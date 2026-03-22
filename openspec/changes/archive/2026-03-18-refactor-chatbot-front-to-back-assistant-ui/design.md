## Context

The repo already contains a partial `assistant-ui` migration in [`apps/base/src/components/ChatbotSidebar`](/Users/taissa/lushuai/code/mfe/mfe-next/apps/base/src/components/ChatbotSidebar), including `AssistantUIRuntimeProvider`, themed thread/composer wrappers, SSE adapter utilities, and legacy exports that still expose `useChatbotController` and `ChatbotProvider`. The result is two overlapping runtime paths: the old custom controller/provider flow and the newer assistant-ui-based flow. That duplication leaves message state, retry behavior, tool rendering, and host-MFE integration split across incompatible abstractions.

On the backend, [`services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ChatController.java`](/Users/taissa/lushuai/code/mfe/mfe-next/services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ChatController.java) and [`services/chatbot-backend/src/main/java/com/fdc3/chatbot/service/ChatService.java`](/Users/taissa/lushuai/code/mfe/mfe-next/services/chatbot-backend/src/main/java/com/fdc3/chatbot/service/ChatService.java) already expose SSE streaming, but the current implementation mostly streams text tokens and leaves tool confirmation, assistant message persistence, and richer event orchestration either minimal or placeholder. This change needs a single end-to-end contract so the frontend can fully adopt assistant-ui hooks and primitives without carrying legacy state management forward.

Constraints:

- Preserve `ChatbotSidebarProps` and the existing base-MFE import surface for consumers.
- Keep Material-UI theming and generative UI support.
- Avoid a flag-day rewrite by migrating behind the current export boundary.
- Align frontend and backend on a canonical event model for text, tool calls, tool results, completion, and failures.

## Goals / Non-Goals

**Goals:**

- Consolidate the chatbot frontend onto a single assistant-ui runtime/provider path.
- Replace legacy custom controller/provider usage with assistant-ui hooks, thread primitives, and runtime APIs.
- Define a stable backend SSE contract that fully supports streaming text, tool lifecycle updates, conversation IDs, completion, and errors.
- Preserve the existing embedding API for consuming MFEs while updating internal implementation details.
- Keep generative UI rendering and tool-call cards working within assistant-ui message content.
- Make retry, clear conversation, and conversation history behavior consistent across frontend and backend.

**Non-Goals:**

- Redesign the external sidebar placement or host-MFE embedding contract.
- Introduce persistent conversation storage beyond the current in-memory/backend history design.
- Add new end-user chatbot capabilities unrelated to the runtime migration.
- Replace Material-UI with assistant-ui default styling.

## Decisions

### DECISION: Treat `AssistantUIRuntimeProvider` as the only supported runtime path

The assistant-ui provider becomes the single source of truth for thread state, streaming state, retry, and conversation lifecycle. Legacy `useChatbotController` and `ChatbotProvider` remain only as compatibility wrappers or are deprecated behind the export surface until consumers can be cut over.

Rationale:

- The repo already has assistant-ui-specific adapters and themed components.
- Maintaining both runtime paths guarantees drift in retry/error/tool behavior.
- Consolidation reduces duplicated EventSource logic and duplicated tests.

Alternatives considered:

- Keep both runtimes and choose at render time. Rejected because it preserves the current divergence and doubles maintenance.
- Revert to the legacy custom runtime. Rejected because it blocks full assistant-ui adoption and duplicates features the library already provides.

### DECISION: Introduce a canonical chatbot stream event contract and adapt both ends to it

The backend stream remains SSE-based, but the contract is tightened around a small fixed set of events:

- `conversation_id`
- `message`
- `tool_call`
- `tool_result`
- `generative_ui`
- `error`
- `done`

The frontend adapter layer owns transformation of those events into assistant-ui thread messages and content parts. The backend owns emitting valid payloads, stable tool-call IDs, and completion/error semantics.

Rationale:

- The current frontend already expects these events.
- assistant-ui should not leak into the backend transport layer; only the adapter should know both models.
- A strict stream contract allows frontend and backend tests to validate compatibility independently.

Alternatives considered:

- Change the backend to emit assistant-ui-native payloads directly. Rejected because it couples the backend to a frontend library and makes future UI swaps harder.
- Leave the current payloads loosely defined. Rejected because tool rendering and retries become fragile.

### DECISION: Collapse duplicated frontend chat orchestration into layered responsibilities

Frontend responsibilities are split into three layers:

- Transport/adapter layer: SSE connection, event parsing, assistant-ui message transformation.
- Runtime/provider layer: thread state, mutations, retry/new-chat actions, error/loading state.
- Presentation layer: `ChatbotSidebar`, themed assistant-ui primitives, tool renderers, generative UI renderers.

Rationale:

- The current code mixes transport and state updates inside both `useChatbotController` and `AssistantUIRuntimeProvider`.
- Layering makes adapter behavior testable without rendering the full sidebar.
- Presentation components can evolve without touching stream orchestration.

Alternatives considered:

- Keep all orchestration in `ChatbotSidebar/index.tsx`. Rejected because it would continue coupling UI rendering to stream state.

### DECISION: Keep the host-MFE API stable via compatibility exports

`ChatbotSidebar` continues accepting `isOpen`, `onToggle`, `apiUrl`, `position`, and `width`. Existing exported hooks remain available, but their implementation is redirected to the assistant-ui runtime where possible, with explicit deprecation for legacy names that no longer represent the internal architecture.

Rationale:

- Host MFEs should not absorb the migration cost.
- The current integration docs already assume these entry points.
- A stable outer contract lets the refactor stay internal to the base MFE.

Alternatives considered:

- Introduce a new exported assistant-ui-only component and retire the old one immediately. Rejected because it forces coordinated client changes and duplicates integration surfaces.

### DECISION: Move backend streaming orchestration closer to conversation state and tool lifecycle

`ChatService` should own conversation lifecycle and persisted history updates, while `AgentService` focuses on model/tool orchestration. Tool call requests, confirmation state, tool results, and final assistant messages should flow through explicit domain objects rather than ad hoc callbacks that only stream text.

Rationale:

- The current backend stores user messages but does not reliably record streamed assistant output or a durable tool lifecycle.
- `confirmToolCall` is explicitly placeholder behavior today.
- A stronger orchestration boundary is required for frontend retry/history consistency.

Alternatives considered:

- Leave tool orchestration embedded in `AgentService` callbacks only. Rejected because it makes history and confirmation behavior hard to reason about and test.

### DECISION: Preserve Material-UI theming and custom renderers on top of assistant-ui primitives

assistant-ui primitives remain wrapped by project-specific themed components such as `ThemedThread`, `ToolCallRenderer`, and `GenerativeUIRenderer`. Styling, spacing, and iconography stay aligned with the existing Material-UI design language.

Rationale:

- The chatbot must fit the rest of the MFE visually.
- assistant-ui primitives provide behavior; MUI provides the repo’s established presentation system.

Alternatives considered:

- Use assistant-ui stock styling. Rejected because it would create a visual mismatch and duplicate theme logic outside the MUI system.

## Risks / Trade-offs

- Dual runtime code lingers during migration → Gate legacy exports behind wrappers/deprecation and remove duplicate EventSource logic early.
- Backend/frontend stream payload mismatch breaks tool rendering → Add contract tests around representative SSE payloads and adapter transformations.
- Retry and new-chat semantics diverge from existing behavior → Define those flows explicitly in specs and cover them with component and adapter tests.
- Assistant message persistence remains incomplete in backend history → Store completed assistant output and tool events as part of conversation updates before shipping.
- Tool confirmation remains partially implemented → Model pending tool executions explicitly and document the fallback behavior if confirmation is not yet completed in the first rollout.
- Bundle size grows with assistant-ui usage → Reuse existing dependency footprint, tree-shake imports, and avoid shipping both old and new runtimes long-term.

## Migration Plan

1. Finalize specs for `assistant-ui-integration`, `chatbot-backend`, and `chatbot-sidebar` so the event contract and exported behaviors are explicit.
2. Refactor the frontend to route all sidebar interactions through `AssistantUIRuntimeProvider`, with compatibility wrappers for legacy exports.
3. Remove duplicate stream-handling logic from `useChatbotController`/`ChatbotProvider` or reimplement them as thin adapters over the assistant-ui runtime.
4. Strengthen backend streaming so `ChatController` and `ChatService` emit the full event contract with stable tool call/result payloads and conversation updates.
5. Implement or harden tool confirmation and assistant history persistence in backend orchestration.
6. Update integration and API docs to reflect the new canonical runtime and event contract.
7. Verify with adapter tests, sidebar integration tests, and backend endpoint tests before removing remaining legacy code.

Rollback strategy:

- Because the public embedding props remain stable, rollback can revert the internal runtime/provider and backend event-shaping changes without requiring host-MFE changes.
- Keep legacy wrapper exports available until the new runtime path passes verification.

## Open Questions

- Should `useChatbotController` remain as a supported compatibility hook, or should it become a deprecated alias with a narrowed behavior surface?
- Do we need backend history endpoints to return tool calls and generative UI artifacts as first-class message content, or is text-plus-conversation continuity sufficient for the first rollout?
- Is tool confirmation required in the first implementation slice, or can it stay behind a follow-up change if the stream contract already carries the necessary identifiers and statuses?
