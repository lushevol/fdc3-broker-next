# Chatbot Transport And Thread Hardening Design

## Goal

Fix the current chatbot UI-to-backend integration issues without doing a full AG-UI protocol migration. The immediate objective is to make the existing `assistant-ui` runtime usage correct and durable by fixing transport, authentication, thread lifecycle, retry behavior, and backend contract drift.

## Scope

This design covers:

- frontend runtime transport from `assistant-ui` to chatbot backend
- backend streaming endpoint shape and request model
- mapping between `assistant-ui` thread state and backend conversation state
- retry, reload, tool continuation, and new-thread lifecycle behavior
- test coverage for the transport and runtime boundary

This design does not cover:

- full AG-UI event adoption on the wire
- assistant cloud or remote thread-list persistence
- redesigning existing tool renderer visuals

## Current Problems

### 1. Transport is incompatible with authenticated streaming

The frontend uses native `EventSource` and encodes the user message, continuation payload, and frontend tool manifest into query parameters. This prevents sending bearer headers when backend auth is enabled and leaks large or sensitive payloads into URLs.

### 2. Backend conversation state is not aligned with assistant-ui thread state

The runtime receives the full `assistant-ui` thread state in `run()`, but only sends the latest user text plus a mutable `conversationIdRef` to the backend. This means retry, reload, edit, and future thread switching can drift from the backend’s actual conversation context.

### 3. Runtime semantics depend on a single global conversation handle

The current provider keeps one backend conversation id for the whole runtime instance. That is not safe once the runtime clears a thread, retries a branch, or uses thread-list primitives.

### 4. Wire contract is internally inconsistent

The backend docs describe plain-text `message` chunks, while the controller currently emits `{"text": token}`. The frontend compensates for both forms. This works, but it is a drift signal that should be removed.

## Requirements

### Requirement: authenticated streaming must work

The frontend SHALL be able to stream chat responses while sending authentication headers and without placing message content in the URL.

### Requirement: assistant-ui thread lifecycle must remain authoritative

The frontend SHALL derive backend conversation routing from the active assistant-ui thread lifecycle, not from one process-global mutable id.

### Requirement: current renderer contract stays stable

The backend SHALL continue to emit the current custom SSE event names during this phase:

- `conversation_id`
- `message`
- `tool_call`
- `tool_result`
- `generative_ui`
- `error`
- `done`

The event payloads MAY be tightened, but event names SHALL remain stable during this remediation phase.

### Requirement: retries and reloads must target the correct backend context

Retry and reload actions in `assistant-ui` SHALL reuse or reconstruct the correct backend conversation for the active thread turn. A fresh thread SHALL not silently reuse a previous backend conversation.

### Requirement: tool continuation must use request body payloads

Frontend tool continuation payloads and frontend tool manifests SHALL be sent in the request body, not query parameters.

## Proposed Architecture

### Frontend

Replace native `EventSource` usage with a fetch-based SSE stream adapter inside `AssistantUIRuntimeProvider`.

The adapter will:

- `POST` to a streaming endpoint using `fetch`
- send JSON request bodies
- include headers, including authorization when available
- parse SSE frames from the response stream
- continue to feed the existing `handleSSEEvent` reducer so the rendering layer stays stable

Introduce a thread-aware conversation mapping inside the runtime provider:

- maintain a mapping from active assistant-ui thread identity to backend conversation id
- use that mapping when creating a stream request
- clear the mapping when a new thread is created
- keep retry/reload attached to the correct backend conversation

The runtime provider will continue to use `useLocalRuntime`, but backend transport state will be represented as per-thread transport metadata rather than a single mutable `conversationIdRef`.

### Backend

Add a canonical streaming endpoint:

- `POST /api/chat/stream`
- consumes `application/json`
- produces `text/event-stream`

Request body fields:

- `message: string`
- `conversationId?: string`
- `toolContext?: string`
- `frontendTools?: string`
- optional client metadata for debugging and traceability

The backend will keep the current custom SSE event names for this phase. `message` events will be normalized to plain text chunk payloads.

The existing `GET /api/chat/stream` endpoint can remain temporarily for compatibility, but the new POST endpoint becomes the only path used by the current frontend.

## Data Flow

### Standard turn

1. `assistant-ui` invokes `ChatModelAdapter.run()` with full thread state.
2. The runtime resolves the active backend conversation id for the current assistant-ui thread.
3. The frontend POSTs a JSON stream request.
4. The backend returns SSE events using the existing event names.
5. The frontend parser converts those events into assistant-ui content updates.
6. When `conversation_id` arrives, the frontend updates the thread-to-conversation mapping.

### New thread

1. User creates a new thread or clears the current thread.
2. The frontend resets the backend conversation mapping for that thread.
3. The next send omits `conversationId`.
4. The backend creates a new conversation and emits a new `conversation_id`.

### Retry or reload

1. User retries a failed or prior turn.
2. The runtime uses the active thread’s mapped backend conversation id.
3. If the retry semantics require a fresh branch, the runtime explicitly resets the mapping before reissue.
4. The request is sent with explicit transport metadata rather than inheriting stale global state.

### Frontend tool continuation

1. Backend emits a frontend `tool_call`.
2. Frontend executes the tool locally.
3. Frontend issues a follow-up POST stream request with `toolContext` in the JSON body.
4. Backend resumes the same conversation using the provided continuation payload.

## Error Handling

### Transport errors

- failed fetch or broken stream with no assistant content becomes a surfaced runtime error
- broken stream after partial assistant content becomes a terminal partial completion, matching current UX expectations

### Authentication errors

- unauthorized or forbidden streaming responses SHALL be surfaced as explicit error states
- tests SHALL verify that authenticated requests can carry headers

### Thread mismatch protection

If the runtime detects that a new thread is being started while a stale backend conversation is still attached, it SHALL drop the stale mapping before the next request.

## Testing Strategy

### Frontend unit tests

- request builder uses POST body, not URL params
- headers are attached to streaming request
- new thread clears backend conversation mapping
- retry and reload use the correct mapped conversation
- frontend tool continuation serializes into request body
- SSE parser still handles the current event names and normalized payloads

### Backend tests

- POST stream endpoint returns `text/event-stream`
- request body is accepted with and without `conversationId`
- `message` events emit plain text chunks
- tool and generative UI events remain unchanged in shape

### Integration checks

- end-to-end stream works with auth enabled
- new thread creates a new backend conversation
- reload retries against the correct conversation

## Rollout

### Phase 1

- add POST streaming endpoint
- normalize backend `message` event payload
- add tests

### Phase 2

- replace frontend `EventSource` with fetch-based SSE reader
- move payloads into request body
- add auth-aware request construction

### Phase 3

- replace global conversation ref with thread-aware mapping
- fix new thread, reload, and retry semantics
- expand tests

### Phase 4

- update docs to match the actual transport contract
- keep AG-UI wire migration as a separate future change

## Future Work

After the current issues are fixed, the next logical follow-up is a separate protocol standardization change that maps the custom SSE contract to AG-UI event semantics.
