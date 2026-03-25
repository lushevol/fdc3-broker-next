# Chatbot Modal Tool UI Unification Design

## Goal

Unify tool-call, tool-result, generative UI, and agent continuation behavior in the assistant modal around assistant-ui's `tool-call` part contract so:

- frontend and backend tools are both selected by the backend LLM
- frontend tools are executed in the browser only after the backend requests them
- reasoning and tool calls can interleave across multiple rounds
- tool-associated UI renders inline with the tool-call part instead of being appended as an unrelated card at the bottom

## Problem

The current implementation still splits responsibility across incompatible paths:

- frontend tools registered through `Tools({ toolkit })`, but triggered locally via `matchPrompt`
- backend SSE `tool_call` / `tool_result` events transformed into assistant-ui parts
- backend `generative_ui` SSE events rendered via a separate data-part registry

That produces the wrong control flow for frontend tools:

- `user prompt -> frontend prompt matcher -> frontend tool execution -> LLM continuation`

instead of the desired agent flow:

- `user prompt -> LLM reasoning -> LLM chooses tool -> tool executes -> LLM reasons again -> ... -> final answer`

The result is that frontend tools are not truly part of the model's reasoning chain, and the modal cannot show the same reasoning/tool interleaving that assistant-ui examples demonstrate.

## Decisions

### Keep the modal shell unchanged

`AssistantModal` remains a pure container. No modal-specific branching should be introduced for tools or generative UI.

### Make the backend LLM the only production tool router

Production chat flow must not let the frontend decide when to call a tool based on local prompt matching.

- backend tools are selected by the backend LLM and executed server-side
- frontend tools are selected by the backend LLM and executed client-side
- frontend `matchPrompt` remains dev/demo only and must not participate in production tool routing

### Use a dynamic frontend tool manifest on every request

The frontend must serialize the currently registered frontend tools and submit them with each chat turn and tool continuation.

The manifest is dynamic because this codebase supports subtree registration and MFE composition. The backend must not rely on a static hardcoded catalog of frontend tools.

### Make `tool-call` the primary rich-rendering path

Any assistant behavior that is semantically a tool invocation should be represented and rendered as a `tool-call` part with a stable `toolCallId`. Both frontend and backend tools should flow through this same path.

### Restrict `data: generative-ui` to non-tool directives

The custom `generative_ui` data-part rendering path should remain only for UI that is not semantically a tool result. It must not be the main way to render tool-generated cards.

### Support backend tools with UI-only toolkit entries

Backend-owned tools should be able to render custom UI in the modal by registering UI-only tool definitions in the toolkit layer. This aligns with assistant-ui's recommended tool model and avoids custom branch logic in the thread renderer.

### Keep the SSE adapter responsibility narrow

The SSE adapter should accumulate and normalize assistant-ui message parts, but it should not make higher-level UI decisions beyond mapping backend protocol events to the agreed part shapes.

### Add agent-loop diagnostics for silent tool turns

The backend should emit structured diagnostics in logs whenever a turn completes with:

- tool requests but no visible assistant text before the tool call, or
- a completed continuation with no visible assistant text at all

These diagnostics should identify the phase (`initial`, `tool-loop`, `frontend-continuation`), the requested tool names, and whether any visible text reached the client. This is required to distinguish protocol bugs from model-behavior gaps.

### Keep frontend tool execution in-browser

When the backend LLM chooses a frontend tool:

- the backend emits a frontend tool call event
- the frontend executes the selected tool locally
- the frontend returns the structured result to the backend continuation endpoint
- the backend restores that tool result into the same model reasoning chain

The frontend must not fabricate the continuation prompt or decide whether another tool is needed next. That decision remains with the LLM.

## Target Architecture

### Modal rendering contract

`Thread` should render in this order:

- `text` parts through markdown rendering
- `tool-call` parts through `part.toolUI ?? <ToolFallback />`
- `data/generative-ui` parts only for non-tool directives

The thread should not need to know whether a tool came from the frontend runtime or backend SSE.

### Toolkit layers

The effective toolkit in `AssistantUIRuntimeProvider` should contain:

- frontend executable tools that may also expose `render` for generative UI
- UI-only tool entries for backend tool names that need custom rendering

This ensures backend tool calls can use the same assistant-ui tool UI path without browser-side execution.

### Request contract

Every chat turn and continuation request should include:

- `message`
- `conversationId`
- optional `toolContext` when resuming after a tool result
- `frontendTools` manifest describing the currently registered executable frontend tools

The manifest should contain only safe, serializable data. It must not include executable code or raw React components.

### Backend tool selection contract

The backend agent constructs one effective tool catalog from:

- backend tool definitions from the server registry
- frontend tool definitions reconstructed from the request manifest

The backend LLM chooses from that single catalog. Frontend tools and backend tools are peers in the LLM-visible tool list.

### Frontend tool execution contract

When the backend chooses a frontend tool, the frontend receives a structured tool call with:

- `toolCallId`
- `toolName`
- `args`
- optional human-in-the-loop metadata

The frontend executes the matching registered tool locally and sends a structured result back. The backend then restores:

- the original user message
- the model's tool request
- the tool execution result

into the same agent reasoning chain before asking the LLM what to do next.

### Streaming behavior and ordering

Backend `tool_call` and `tool_result` events must preserve:

- stable `toolCallId`
- stable `toolName`
- arguments on the initial tool call
- result/error merged back into the same logical tool-call part

The adapter must keep this state accumulated across stream chunks to avoid UI flicker or disappearing tool cards.

Reasoning text must remain ordered around tool parts:

- text before a tool call stays before the tool part
- text after a tool result becomes a new text part after that tool part
- tool-associated generative UI stays attached to the tool-call render path

This should make the modal feel like assistant-ui's expected reasoning/tool interleaving instead of a transcript with all cards appended afterward.

## Implementation Phases

### Phase 1: Remove frontend-side production routing

- keep frontend tool registration and rendering
- remove frontend `matchPrompt` from the production routing path
- add frontend tool manifest serialization to every chat turn

### Phase 2: Add backend-driven frontend tool calls

- let the backend reconstruct frontend tool specs from the manifest
- let the LLM select frontend tools in the same loop as backend tools
- emit structured frontend tool call events from the backend
- execute those tools in the browser and resume the backend with structured results

### Phase 3: Keep tool-associated UI unified

- keep `tool-call` as the main rendering path
- keep generative UI attached to the tool render path where it belongs
- reserve `data/generative-ui` for genuinely non-tool directives

## Testing

Required coverage:

- provider tests proving frontend manifest generation and backend-driven frontend tool execution
- adapter tests proving reasoning text and tool parts remain interleaved in arrival order
- backend tests proving frontend tool manifests become LLM-visible tools
- backend tests proving a frontend tool result resumes the same reasoning loop
- backend tests proving silent tool-turn diagnostics are classified correctly
- thread rendering tests for frontend tool UI, backend tool UI, and non-tool data UI
- Chrome verification for multi-step loops that include:
  - backend tool only
  - frontend tool only
  - frontend tool followed by more reasoning or another tool call

## Acceptance Criteria

- Production frontend tools are triggered only by the backend LLM, not by local prompt matching.
- The backend LLM can choose both backend and frontend tools within the same multi-step reasoning loop.
- Frontend tool calls render through the same `tool-call` UI path as backend tools.
- If a frontend tool has registered tool UI or generative UI, that UI renders inline with the tool-call part.
- Reasoning text and tool cards appear in arrival order rather than all tool cards accumulating at the bottom.
- `ToolFallback` only appears when no custom tool UI is registered.
- Non-tool `generative_ui` data still renders, but tool-like cards no longer depend on it.
