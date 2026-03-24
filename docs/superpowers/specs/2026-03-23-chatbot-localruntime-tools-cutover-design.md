# Chatbot LocalRuntime Tools Cutover Design

## Goal

Cut over the chatbot frontend from the custom SSE-to-assistant-ui bridge to assistant-ui's `LocalRuntime` architecture, with frontend-defined tools executed in the browser and rendered through assistant-ui tool UI. Ship the capability with a built-in demo toolkit and keep the existing assistant modal/thread shell.

## Decisions

### Use `LocalRuntime` as the primary assistant-ui runtime

The current runtime in `apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx` manually adapts backend SSE events into assistant-ui message parts. This should be replaced with `useLocalRuntime(...)` so chat state, reloading, editing, and tool execution follow assistant-ui's supported runtime model.

### Register frontend tools with `Tools({ toolkit })`

Frontend-defined tools are first-class assistant-ui tools, not custom metadata. The runtime provider should register a demo `Toolkit` using `useAui({ tools: Tools({ toolkit }) })`. These tools execute in the browser.

### Use assistant-ui tool UI as the generative UI path

Tool result rendering should flow through assistant-ui tool UI (`render`) instead of the current custom `generative_ui` SSE event and custom registry-based rendering path. Existing shell components like `AssistantModal` and `Thread` remain in place.

### Keep the backend as the assistant response source

No BFF or extra service is introduced. The frontend model adapter talks directly to the existing chatbot backend. Frontend tools execute in-browser by default and do not require backend mediation.

## Architecture

### Frontend runtime

`AssistantUIRuntimeProvider` will:

- define a demo toolkit with browser-executed tools
- create an assistant-ui `aui` instance with `Tools({ toolkit })`
- create a `LocalRuntime` model adapter that sends thread messages to the existing backend
- provide both `aui` and `runtime` through `AssistantRuntimeProvider`

### Demo toolkit

The initial toolkit should include a small but representative set of tools:

- a time tool that returns the current browser-local time
- a summary/status tool that returns structured data and renders an inline card
- a workspace/demo tool that returns a list-like UI payload and renders richer inline content

At least one tool must render a visible tool UI block in the thread to prove the generative UI path works.

### Backend interaction

The backend remains responsible for assistant response generation. The frontend adapter will convert current assistant-ui thread messages into the backend request format and map the backend response stream into assistant-ui message updates.

The old custom SSE events for `tool_call`, `tool_result`, and `generative_ui` are no longer the main frontend runtime contract after the cutover.

## Testing

Follow TDD:

1. Add failing frontend tests for runtime creation, toolkit registration, and tool UI rendering.
2. Add failing tests for the backend adapter contract used by `LocalRuntime`.
3. Implement the minimal runtime/provider/toolkit changes to make tests pass.
4. Verify with Jest, then verify the UI flow in Chrome against the running app.

## Risks

- assistant-ui runtime API mismatch with the current installed package version
- regressions in the assistant modal if the provider contract changes
- stale tests tied to the old SSE adapter path

## Mitigations

- implement against the installed package surface in `node_modules`
- keep `AssistantModal` and `Thread` stable while swapping only the provider/runtime layer
- remove or isolate old SSE runtime tests as the new runtime takes ownership
