## 1. Dependencies & Configuration

- [x] 1.1 Add `@assistant-ui/react` and `@assistant-ui/react-markdown` to `apps/base/package.json`
- [x] 1.2 Update `apps/base/module-federation.config.ts` to share `@assistant-ui/react` dependency
- [x] 1.3 Run `npm install` to install new dependencies
- [x] 1.4 Verify assistant-ui packages are properly resolved in the monorepo
- [x] 1.5 Update to latest assistant-ui packages (v0.12.17)

## 2. Type Definitions & Adapters

- [x] 2.1 Create `apps/base/src/components/ChatbotSidebar/adapters/types.ts` with SSE event types
- [x] 2.2 Create `apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts` adapter
- [x] 2.3 Define transformation functions for `message`, `tool_call`, `tool_result`, `done` events
- [x] 2.4 Create type tests for adapter transformations

## 3. Runtime Provider Implementation

- [x] 3.1 Create `apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx`
- [x] 3.2 Implement `ExternalStoreAdapter` for SSE streaming
- [x] 3.3 Handle SSE connection lifecycle (open, message, error, close)
- [x] 3.4 Map `conversationId` from backend to assistant-ui thread state
- [x] 3.5 Implement message append/update logic for streaming

## 4. Component Migration

- [x] 4.1 Create themed wrapper components for assistant-ui primitives (Thread, Message, Composer)
- [x] 4.2 Update `ChatbotSidebar/index.tsx` to use assistant-ui components
- [x] 4.3 Replace `SimpleChatContent` with assistant-ui ThreadPrimitive
- [x] 4.4 Replace custom input with assistant-ui ComposerPrimitive
- [x] 4.5 Replace typing indicators with assistant-ui loading states
- [x] 4.6 Ensure MUI theming is applied to all assistant-ui components
- [x] 4.7 Update to assistant-ui v0.12.17 API (ThreadPrimitive.Root, ComposerPrimitive.Root, MessagePrimitive)

## 5. Tool Call Rendering

- [x] 5.1 Create `ToolCallContentPart` component for tool execution display
- [x] 5.2 Transform SSE `tool_call` events to assistant-ui tool content parts
- [x] 5.3 Transform SSE `tool_result` events to update tool status
- [x] 5.4 Style tool call cards to match MUI design system

## 6. Generative UI Integration

- [x] 6.1 Create `GenerativeUIContentPart` component
- [x] 6.2 Integrate existing generative component registry with assistant-ui
- [x] 6.3 Handle `generative_ui` SSE events in the adapter
- [x] 6.4 Ensure components render inline in message thread

## 7. Backward Compatibility

- [x] 7.1 Verify `ChatbotSidebarProps` interface remains unchanged
- [x] 7.2 Ensure `isOpen`, `onToggle`, `apiUrl`, `position`, `width` props work correctly
- [x] 7.3 Maintain existing hook exports (mark deprecated if needed)
- [x] 7.4 Test that consuming MFEs require no changes

## 8. Error Handling & Edge Cases

- [x] 8.1 Implement SSE error handling in the adapter
- [x] 8.2 Add retry functionality for failed messages
- [x] 8.3 Handle connection cleanup on component unmount
- [x] 8.4 Handle network disconnection gracefully
- [x] 8.5 Implement "New Chat" functionality with thread reset

## 9. Cleanup

- [x] 9.1 Remove `useChatbotController.ts` hook (marked as deprecated instead)
- [x] 9.2 Remove unused style definitions from `style.ts` if any
- [x] 9.3 Update `index.ts` exports to include assistant-ui hooks
- [x] 9.4 Remove deprecated hook exports after verification (kept for backward compatibility)

## 10. Testing & Verification

- [x] 10.1 Update existing tests in `__tests__/ChatbotSidebar.test.tsx`
- [x] 10.2 Write tests for SSE adapter transformations
- [x] 10.3 Write tests for runtime provider
- [x] 10.4 Verify streaming works end-to-end
- [x] 10.5 Verify tool calls render correctly
- [x] 10.6 Verify generative UI components render
- [x] 10.7 Run full test suite and ensure >90% coverage
- [x] 10.8 Manual UI testing in browser

## 11. Backend Configuration

- [x] 11.1 Update `application.yml` to support `OPENAI_BASE_URL` environment variable
- [x] 11.2 Update `AgentService.java` to use custom base URL when configured
- [x] 11.3 Support environment variables: `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL`, `OPENAI_TEMPERATURE`
