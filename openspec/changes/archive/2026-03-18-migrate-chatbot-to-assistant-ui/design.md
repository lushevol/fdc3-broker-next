## Context

The chatbot sidebar in `apps/base/src/components/ChatbotSidebar/` currently uses custom React hooks (`useChatbotController`) and Material-UI components for message rendering, input handling, and streaming state management. The backend service (`chatbot-backend`) uses SSE (Server-Sent Events) for streaming responses with a custom event protocol.

assistant-ui is a React library specifically designed for AI chat interfaces that provides:

- `useChatRuntime` hook for managing chat state
- `<Thread />`, `<Message />`, `<Composer />` components for UI
- Built-in streaming support with standard protocols
- Tool call/rendering support
- Thread management (branches, edit, reload)

The challenge is integrating assistant-ui's opinionated patterns with our existing SSE-based backend while maintaining the current `ChatbotSidebarProps` interface for backward compatibility.

## Goals / Non-Goals

**Goals:**

- Replace custom `useChatbotController` with assistant-ui's runtime API
- Maintain SSE streaming compatibility with existing backend
- Preserve `ChatbotSidebarProps` interface (backward compatible for consuming MFEs)
- Support tool calls and generative UI components
- Achieve feature parity with current implementation
- Follow MFE Module Federation patterns for exports

**Non-Goals:**

- No backend API changes
- No changes to consuming MFEs
- No migration of conversation history storage
- No new generative UI components (keep existing registry)

## Decisions

### DECISION: Use assistant-ui's ExternalStoreAdapter for SSE compatibility

**Rationale:** assistant-ui expects specific message formats and streaming patterns. Our backend uses custom SSE events (`message`, `tool_call`, `tool_result`, `done`). The `ExternalStoreAdapter` allows us to bridge our custom backend to assistant-ui's runtime without modifying the backend.

**Alternative considered:** Modify backend to use assistant-ui's expected format. **Rejected** - violates "no backend changes" constraint.

### DECISION: Wrap assistant-ui Thread in Material-UI themed container

**Rationale:** The existing UI uses Material-UI theming that matches the rest of the application. assistant-ui provides unstyled primitives that we can theme to match our design system using MUI's `styled` or sx props.

**Alternative considered:** Use assistant-ui's default styles. **Rejected** - would create visual inconsistency with the rest of the app.

### DECISION: Export assistant-ui hooks via Module Federation

**Rationale:** Consuming MFEs may want to use assistant-ui's hooks directly (e.g., `useThreadRuntime`). Exporting these through the base MFE's Module Federation config allows other MFEs to access them without duplicating dependencies.

**Configuration:** Add `@assistant-ui/react` to `module-federation.config.ts` shared dependencies and explicit exports.

### DECISION: Keep existing `ChatbotSidebarProps` interface

**Rationale:** The interface (`isOpen`, `onToggle`, `apiUrl`, `position`, `width`) is already consumed by other MFEs. Changing it would require coordination across teams.

**Implementation:** Wrap assistant-ui's `<ThreadRuntimeProvider>` internally and map props to runtime configuration.

### DECISION: Map custom tool events to assistant-ui tool format

**Rationale:** Current backend sends `tool_call` and `tool_result` SSE events. assistant-ui expects tool calls embedded in assistant messages per the OpenAI/Anthropic format.

**Implementation:** Transform incoming SSE tool events into assistant-ui's expected `ToolContentPart` format before appending to the thread.

## Risks / Trade-offs

| Risk                                 | Mitigation                                                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| SSE event format mismatch            | Implement adapter layer in runtime configuration to transform events                                          |
| Bundle size increase                 | Tree-shake assistant-ui imports; monitor with bundle analyzer                                                 |
| Breaking change in assistant-ui APIs | Pin exact version in package.json; plan for upgrade path                                                      |
| Thread state persistence mismatch    | Document that conversationId is managed by backend; thread state is ephemeral                                 |
| Generative UI component rendering    | Custom `MessageContent` component that handles both assistant-ui content parts and our generative UI registry |

## Migration Plan

1. **Phase 1: Dependency & Types**
   - Add `@assistant-ui/react` to `apps/base/package.json`
   - Create type adapters (SSE event → assistant-ui message)

2. **Phase 2: Runtime Implementation**
   - Create `AssistantUIRuntimeProvider` wrapping assistant-ui's providers
   - Implement SSE-to-assistant-ui adapter using `ExternalStoreAdapter`
   - Map existing `ChatbotSidebarProps` to runtime config

3. **Phase 3: Component Migration**
   - Replace `SimpleChatContent` with assistant-ui's `<Thread />`
   - Replace input with `<Composer />`
   - Theme components to match MUI design system

4. **Phase 4: Cleanup**
   - Remove `useChatbotController` hook
   - Remove custom message components
   - Update exports

5. **Phase 5: Verification**
   - Run existing tests
   - Manual testing of streaming, tool calls, error states

**Rollback:** Revert to previous commit; no data migration required.

## Open Questions

1. Should we export assistant-ui's CSS variables or stick to MUI theming exclusively?
2. Do we need to support thread branching (edit message and retry) or keep simple linear history?
3. How should we handle the generative UI component registry with assistant-ui's content part system?
