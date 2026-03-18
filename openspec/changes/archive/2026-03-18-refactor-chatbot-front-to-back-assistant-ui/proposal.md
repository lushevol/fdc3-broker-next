## Why

The current chatbot flow is split between custom sidebar UI, bespoke frontend state hooks, and backend streaming/tool conventions that do not align cleanly with `assistant-ui`'s runtime model. A coordinated refactor is needed now so the frontend can fully adopt `assistant-ui` primitives, hooks, streaming semantics, and tool rendering while the backend exposes a stable event model that supports that integration end to end.

## What Changes

- **BREAKING**: Replace the current custom chatbot runtime and controller flow with an `assistant-ui`-driven thread runtime and composer/thread primitives.
- Update the chatbot sidebar UX to use `assistant-ui` components and interaction patterns while preserving the host MFE embedding contract.
- Refactor frontend message, streaming, retry, and tool-call handling to use `assistant-ui` hooks and runtime adapters rather than bespoke state wiring.
- Modify backend chat streaming and tool execution behavior so frontend runtime integration is consistent for message chunks, tool calls, tool results, completion, and error states.
- Preserve support for existing chatbot entry points, authentication, and conversation lifecycle while tightening the contract between frontend and backend for streaming sessions.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `assistant-ui-integration`: Expand the runtime adapter and component requirements to support full assistant-ui adoption, including hooks, streaming lifecycle, and tool-call rendering semantics.
- `chatbot-backend`: Update chat streaming and tool execution requirements so backend events, conversation state, and error handling support the assistant-ui runtime contract.
- `chatbot-sidebar`: Update sidebar behavior and exported hook/component requirements to reflect the new assistant-ui-driven UX and interaction model.

## Impact

- **Frontend**: `apps/base/src/components/ChatbotSidebar/`, chatbot hooks/runtime adapters, assistant-ui exports, and related tests.
- **Backend**: chat streaming endpoints, SSE event shaping, tool-call execution flow, and any adapter code that builds the assistant conversation stream.
- **Dependencies**: assistant-ui packages and any supporting runtime utilities required for the new thread/composer/tool rendering flow.
- **Consumers**: MFEs embedding the chatbot should keep the existing integration entry points, but internal chatbot hook behavior and runtime contracts will change.
