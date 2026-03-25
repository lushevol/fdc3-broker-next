# Chatbot Modal Tool UI Unification Design

## Goal

Unify tool-call, tool-result, and generative UI rendering in the assistant modal around assistant-ui's `tool-call` part contract so modal behavior is driven by runtime state, not by multiple competing rendering paths.

## Problem

The current modal implementation mixes three rendering paths:

- frontend tools registered through `Tools({ toolkit })` and rendered via `part.toolUI`
- backend SSE `tool_call` / `tool_result` events transformed into assistant-ui parts
- backend `generative_ui` SSE events rendered via a separate data-part registry

This makes the modal behavior hard to reason about and diverges from assistant-ui's recommended model, where tool UI is primarily attached to `tool-call` parts and `ToolFallback` acts as the default fallback.

## Decisions

### Keep the modal shell unchanged

`AssistantModal` remains a pure container. No modal-specific branching should be introduced for tools or generative UI.

### Make `tool-call` the primary rich-rendering path

Any assistant behavior that is semantically a tool invocation should be represented and rendered as a `tool-call` part with a stable `toolCallId`. Both frontend and backend tools should flow through this same path.

### Restrict `data: generative-ui` to non-tool directives

The custom `generative_ui` data-part rendering path should remain only for UI that is not semantically a tool result. It must not be the main way to render tool-generated cards.

### Support backend tools with UI-only toolkit entries

Backend-owned tools should be able to render custom UI in the modal by registering UI-only tool definitions in the toolkit layer. This aligns with assistant-ui's recommended tool model and avoids custom branch logic in the thread renderer.

### Keep SSE adapter responsibility narrow

The SSE adapter should accumulate and normalize assistant-ui message parts, but it should not make higher-level UI decisions beyond mapping backend protocol events to the agreed part shapes.

## Target Architecture

### Modal rendering contract

`Thread` should render in this order:

- `text` parts through markdown rendering
- `tool-call` parts through `part.toolUI ?? <ToolFallback />`
- `data/generative-ui` parts only for non-tool directives

The thread should not need to know whether a tool came from the frontend runtime or backend SSE.

### Toolkit layers

The effective toolkit in `AssistantUIRuntimeProvider` should contain:

- frontend executable tools
- UI-only tool entries for backend tool names that need custom rendering

This ensures backend tool calls can use the same assistant-ui tool UI path without browser-side execution.

### SSE behavior

Backend `tool_call` and `tool_result` events must preserve:

- stable `toolCallId`
- stable `toolName`
- arguments on the initial tool call
- result/error merged back into the same logical tool-call part

The adapter must keep this state accumulated across stream chunks to avoid UI flicker or disappearing tool cards.

## Implementation Phases

### Phase 1: Unify modal tool rendering

- add a backend tool UI registry layer backed by UI-only toolkit entries
- ensure backend SSE tool calls can resolve to `part.toolUI`
- keep `ToolFallback` as fallback only

### Phase 2: Narrow the generative UI path

- document which backend directives are allowed to stay as `data/generative-ui`
- migrate tool-like generative cards to tool UI where applicable

### Phase 3: Revisit agent continuation

- keep frontend tool continuation structured
- separately improve how backend LLMs consume completed client-side tool results

## Testing

Required coverage:

- thread rendering tests for frontend tool UI, backend tool UI, and non-tool data UI
- adapter tests proving tool state is accumulated and resolved into a single stable tool-call part
- provider tests proving backend UI-only tool entries are present in the effective toolkit
- Chrome verification in the modal for frontend tool UI, backend tool UI, and a non-tool generative UI case

## Acceptance Criteria

- The modal renders frontend and backend tools through the same `tool-call` UI path.
- `ToolFallback` only appears when no custom tool UI is registered.
- Non-tool `generative_ui` data still renders, but tool-like cards no longer depend on it.
- Streaming does not drop or flicker tool UI as chunks arrive.
