# Chatbot Assistant-UI Modal Cutover Design

## Context

The chatbot frontend is partially migrated to `assistant-ui`, but the current user-facing shell is still the old sidebar implementation in [apps/base/src/components/ChatbotSidebar/index.tsx](/Users/taissa/lushuai/code/mfe/mfe-next/apps/base/src/components/ChatbotSidebar/index.tsx). The repo already contains a local `assistant-ui` component set under [apps/base/src/next-packages/components/assistant-ui](/Users/taissa/lushuai/code/mfe/mfe-next/apps/base/src/next-packages/components/assistant-ui), including an `assistant-modal` implementation modeled on the official example.

The new requirement changes the contract materially:

- do a total migration to `assistant-ui`
- replace the sidebar experience with the assistant-ui modal pattern
- remove legacy compatibility surfaces instead of retaining shims
- keep Chrome-based end-to-end verification as a required completion step

The runtime cutover work already established `AssistantUIRuntimeProvider` as the intended single runtime path. This change finishes the UI shell cutover and removes the remaining sidebar-oriented architecture.

## Goals

- Replace the current chatbot sidebar UI with an assistant-ui modal experience.
- Keep `AssistantUIRuntimeProvider` as the only production chat runtime.
- Render messages, composer, modal trigger, and modal content through assistant-ui-native components.
- Remove legacy controller/service/provider exports that only exist for the old sidebar model.
- Preserve current chat backend integration through the existing SSE adapter and runtime.
- Verify the final experience through browser E2E in Chrome at `http://localhost:8001`.

## Non-Goals

- Do not preserve sidebar semantics such as slide-in behavior, left/right placement, or configurable width.
- Do not keep deprecated compatibility APIs for the old sidebar architecture.
- Do not redesign backend SSE semantics beyond what is necessary to keep the assistant-ui modal working.
- Do not broaden this change into unrelated UI refactors outside the chatbot surface.

## Chosen Approach

This change performs a full in-place cutover:

- `ChatbotSidebar` stops being a sidebar concept.
- The production chatbot entry point becomes an assistant-ui modal trigger and modal content shell.
- Local assistant-ui components in `apps/base/src/next-packages/components/assistant-ui` become the UI source of truth.
- The legacy runtime/controller/service compatibility layer is removed.

This approach was chosen because the user explicitly requested a total migration, not a hybrid or alias-based transition.

## Architecture

### Runtime

`AssistantUIRuntimeProvider` remains the single owner of:

- message state
- stream lifecycle
- retry behavior
- clear conversation behavior
- loading state
- error state
- conversation identifier state

No other frontend module may create an alternate runtime path or duplicate stream orchestration.

### UI Shell

The old sidebar shell is removed. The new shell is an assistant-ui modal with:

- a floating trigger button
- assistant-ui modal content
- assistant-ui thread rendering
- assistant-ui composer rendering

The implementation should follow the structure and interaction model of the official assistant-ui modal example, adapted to local project conventions and the existing runtime provider.

### Rendering

The assistant thread should be rendered through the local assistant-ui thread stack rather than the old `ThemedThread` and `ThemedComposer` components.

If tool calls or generative UI rendering need custom behavior, those integrations should be wired into the assistant-ui thread/message part system rather than preserved as a separate parallel message UI.

### Host Integration

The application host should continue mounting the runtime near the app root, as it does today in [apps/base/src/pages/Home/index.tsx](/Users/taissa/lushuai/code/mfe/mfe-next/apps/base/src/pages/Home/index.tsx). The page-level chatbot entry point should render only the assistant-ui modal surface.

## API and Public Surface Decisions

### Remove

Remove legacy APIs that only exist to support the old sidebar/runtime model:

- sidebar-oriented props such as `position` and `width`
- deprecated controller hook exports
- legacy chat service exports that duplicate assistant-ui runtime responsibilities
- compatibility projections that preserve the old sidebar contract

### Keep

Keep only the public pieces that are still justified after the modal cutover:

- the modal entry component, if still exported from the chatbot module
- `AssistantUIRuntimeProvider`
- runtime hooks that directly represent the assistant-ui runtime
- generative UI and tool-rendering utilities that are still used by the assistant-ui path

If `ChatbotSidebar` remains as a component name for source compatibility, it should represent the assistant-ui modal directly and expose no sidebar-specific contract.

## Error Handling

- Stream errors should surface through the runtime and remain visible in the modal experience.
- Retry should route through `AssistantUIRuntimeProvider` only.
- Clear conversation should reset the active thread and conversation identity through the single runtime path.
- Modal open and close behavior must not corrupt message state or leave the runtime in a stale loading state.

## Testing Strategy

Follow test-driven development for the cutover.

### Frontend Tests

Write failing tests first for:

- modal trigger rendering
- open and close behavior of the assistant-ui modal
- thread and composer rendering through the assistant-ui path
- retry and clear conversation behavior through `AssistantUIRuntimeProvider`
- removal or narrowing of legacy exports

Update or remove tests that assert old sidebar semantics or legacy runtime/service behavior.

### Verification

After implementation and package-level verification, run browser verification in Chrome:

1. Start the app if needed.
2. Navigate to `http://localhost:8001`.
3. Log in if the login screen is shown.
4. Open the assistant modal.
5. Confirm the modal renders correctly and can close/reopen.
6. Send at least one message and confirm the thread updates correctly.
7. Confirm the main workspace still behaves correctly after the UI cutover.

## Success Criteria

The change is complete when all of the following are true:

- the old sidebar shell is gone from production code
- the chatbot experience is rendered as an assistant-ui modal
- `AssistantUIRuntimeProvider` is the only runtime path
- old sidebar-specific compatibility APIs are removed
- tests cover the new modal contract
- Chrome E2E verification passes against the running app
