## Why

The current chatbot sidebar uses custom-built UI components and state management hooks that require ongoing maintenance and lack the polish of modern AI chat interfaces. [assistant-ui](https://www.assistant-ui.com/) is a production-ready React library specifically designed for AI chat interfaces, providing battle-tested hooks, accessible components, streaming support, and a better developer experience. Migrating to assistant-ui will reduce maintenance burden while delivering a superior user experience.

## What Changes

- **BREAKING**: Replace custom `useChatbotController` hook with assistant-ui's `useChatRuntime` and provider pattern
- Replace custom message list rendering with assistant-ui's `Thread` and `Message` components
- Replace custom input field with assistant-ui's `Composer` component
- Replace custom typing indicators with assistant-ui's built-in loading states
- Add assistant-ui as a dependency to `apps/base/package.json`
- Update `ChatbotSidebar` component to use assistant-ui's context providers
- Remove custom message handling logic in favor of assistant-ui's `ThreadRuntime` API
- Maintain backward compatibility with existing `apiUrl` prop and backend service
- Export assistant-ui hooks alongside existing exports for consuming MFEs

## Capabilities

### New Capabilities

- `assistant-ui-integration`: Integration of assistant-ui library with MFE architecture, including runtime configuration and Module Federation exports

### Modified Capabilities

<!-- No spec-level behavior changes - purely implementation migration -->

## Impact

- **apps/base/src/components/ChatbotSidebar/**: Complete refactor of component architecture
- **apps/base/package.json**: Add `@assistant-ui/react` dependency
- **apps/base/module-federation.config.ts**: Export assistant-ui hooks/types if needed
- **API Compatibility**: Backend service remains unchanged, maintains existing REST/streaming API contract
- **Consuming MFEs**: No changes required for MFEs importing ChatbotSidebar (interface remains compatible)
- **Dependencies**: New dependency on `@assistant-ui/react` and related packages
