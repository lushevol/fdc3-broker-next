# Chat Protocol Package Split Design

Date: 2026-04-17

## Goal

Split the current protocol-native demo stack into two reusable standalone packages:

- `chat-protocol-runtime` for protocol transport, runtime orchestration, tool continuation, and assistant-ui runtime adaptation
- `chat-protocol-ui` for reusable React UI and provider composition on top of the runtime package

This work should ignore the existing `apps/base` chatbot implementation as a design source. `apps/base` is only a future consumer of the new toolkit.

## Desired End State

The new toolkit should be complete enough that a consumer app can mount it directly with protocol-native tools and UI.

Target usage should look roughly like:

```tsx
<ChatProtocolProvider apiUrl={apiUrl} tools={toolkit} toolContext={toolContext}>
  <ChatProtocolModal />
</ChatProtocolProvider>
```

`apps/chat-protocol-demo-web` should become a thin proving client of these packages and should no longer own the canonical protocol runtime or shell UI.

`apps/base` may adopt the toolkit later, but that adoption is explicitly out of scope for this design.

## Context

The current protocol-native implementation is split across two places:

1. `packages/chat-protocol-frontend`
   - owns low-level protocol frame adaptation and protocol-native local runtime helpers
2. `apps/chat-protocol-demo-web`
   - owns demo-specific orchestration, protocol request shaping, frontend tool auto-resolution, tool preset wiring, and protocol-facing UI composition

This split creates two problems:

- the runtime package does not yet own enough protocol orchestration for another app to adopt it directly
- the reusable UI exists only inside the demo app and cannot be consumed as a standalone toolkit

## Non-Goals

- extracting or preserving `apps/base` chatbot implementation details
- migrating the backend protocol in the same change
- redesigning the protocol contract
- packaging FM-specific business tools or workspace logic
- building compatibility layers around older `apps/base` SSE behavior

## Design Principles

1. Demo-first, protocol-native extraction
   The source of truth for this toolkit is the protocol-native demo stack, not the older `apps/base` implementation.

2. Runtime and UI are separate concerns
   Transport, continuation, and assistant-ui runtime assembly belong in one package; modal/thread/provider UI belongs in another.

3. Shared packages own generic behavior only
   Packages should expose extension points for tool registration and rendering, but should not embed app-specific business logic.

4. The demo becomes a proving client
   After extraction, `apps/chat-protocol-demo-web` should primarily demonstrate and validate package APIs rather than define architecture.

5. Consumer adoption comes later
   `apps/base` and any other app should be treated as downstream adopters after the toolkit is stable.

## Package Boundaries

### `chat-protocol-runtime`

Purpose:

- own the protocol-native frontend runtime
- convert protocol requests and stream frames into assistant-ui runtime behavior
- manage frontend and human tool continuation
- expose generic extension points for tool registration and context

Responsibilities:

- request builders for submit-message and resume flows
- SSE transport and frame parsing for `/api/chat/runs`
- protocol frame to assistant-ui content adaptation
- conversation and thread bookkeeping
- frontend tool execution and resume submission
- human-in-the-loop pause and resume wiring
- generic tool manifest and runtime registration contracts

Owns code currently spread across:

- `packages/chat-protocol-frontend/src/runtime/*`
- protocol-specific orchestration portions of `apps/chat-protocol-demo-web/src/ChatProtocolApp.tsx`

Does not own:

- modal, thread, or shell UI
- demo-only preset switchers and explanatory panels
- app-specific business tools

### `chat-protocol-ui`

Purpose:

- provide reusable React UI on top of `chat-protocol-runtime`
- package the provider and assistant shell for direct reuse by consumer apps

Responsibilities:

- `ChatProtocolProvider`
- `ChatProtocolModal`
- `ChatProtocolThread`
- default tool-call rendering
- generic protocol message rendering
- generative UI component registry/context
- reusable assistant shell composition

Owns code currently spread across:

- generic protocol-facing UI from `apps/chat-protocol-demo-web`
- reusable assistant shell components extracted or adapted from the demo stack

Does not own:

- demo-only explanatory copy and preset controls
- app-specific business cards or business tool UIs

### `apps/chat-protocol-demo-web`

After migration, the demo app keeps only:

- demo-only tool presets
- demo-only sample tools
- demo-only debug or explanatory panels
- app bootstrap wiring

It should stop owning the core runtime flow and shell UI.

## API Shape

### Runtime package

Expected primary exports:

- `createChatProtocolRuntime`
- `createChatProtocolTransport`
- `createProtocolStreamAdapter`
- `buildChatProtocolRequest`
- `buildChatProtocolResumeRequest`
- `createToolManifest`
- runtime tool and context types

The runtime package may also expose React hooks if they stay runtime-focused, but it should not require the full UI package just to create the assistant runtime.

### UI package

Expected primary exports:

- `ChatProtocolProvider`
- `ChatProtocolModal`
- `ChatProtocolThread`
- `createGenerativeComponentRegistry`
- default protocol tool/message renderers

The provider should accept runtime inputs from the consumer app and should not assume demo-specific state.

## Migration Strategy

### Phase 1: Expand the existing frontend package into the runtime package

Start from `packages/chat-protocol-frontend` rather than creating a second runtime implementation. Keep the folder temporarily, but evolve the package API toward `chat-protocol-runtime`.

This phase should absorb:

- protocol request submission helpers from the demo app
- frontend tool auto-resolution and resume loop logic
- generic thread/conversation bookkeeping currently in the demo app

### Phase 2: Create the UI package from demo-owned protocol UI

Extract reusable protocol-facing UI from `apps/chat-protocol-demo-web` into `chat-protocol-ui`, then add provider composition that consumes the runtime package.

This phase should move generic modal, thread, tool rendering, and shell composition code into the package while leaving demo-specific panels outside.

### Phase 3: Refactor the demo app onto the packages

`apps/chat-protocol-demo-web` should consume both packages and keep only:

- demo-only presets
- demo-only sample tools
- demo-only explanatory panels

It should no longer own the core runtime flow or shell UI.

### Phase 4: Publish a stable consumer surface

The package APIs should then be stable enough that a separate app such as `apps/base` can adopt them later without depending on demo-local files.

That later adoption is not part of this change.

## Compatibility Decision

The new packages should use the protocol-native `/api/chat/runs` contract as the primary interface.

No compatibility abstraction should be added for the older `apps/base` SSE adapter or earlier app-local chatbot runtime behavior. If a future consumer needs adaptation, that should happen in the consumer app, not inside the toolkit.

This keeps the toolkit aligned with the protocol work instead of inheriting older transport semantics.

## Testing Strategy

### Runtime package

- unit tests for frame parsing and request builders
- unit tests for resume logic after frontend tool execution
- unit tests for HITL pause/resume handling
- unit tests for conversation/thread state handling

### UI package

- React tests for provider and modal/thread composition
- tests for generative component registry behavior
- tests for default tool and message rendering

### Demo app

- smoke tests proving the package APIs work end-to-end in the protocol demo

## Risks

- package extraction can accidentally leave critical orchestration stranded in the demo app
- UI extraction can keep hidden demo assumptions in supposedly reusable components
- package naming may drift from folder naming while the temporary folder remains in place

## Mitigations

- treat `chat-protocol-demo-web` as a source to be mined until only demo-only code remains
- require package APIs to cover all current demo runtime needs before deleting app-local code
- keep the folder temporarily, but change the package surface deliberately toward runtime ownership

## Decision Summary

Proceed with a demo-first two-package split:

- `chat-protocol-runtime` built from `packages/chat-protocol-frontend` plus protocol-native orchestration extracted from `apps/chat-protocol-demo-web`
- `chat-protocol-ui` built from reusable protocol-facing UI extracted from `apps/chat-protocol-demo-web`

`apps/base` is not part of the extraction scope and is only a future consumer.
