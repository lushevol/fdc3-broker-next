# Chatbot Assistant-UI Cutover Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the chatbot migration by removing the legacy frontend runtime path and making `assistant-ui` the only production chat runtime, while keeping the current SSE backend contract usable.

**Architecture:** `AssistantUIRuntimeProvider` and the SSE adapter become the only real transport/state path. `ChatbotSidebar` and any retained compatibility exports project assistant-ui runtime state instead of owning duplicate stream logic. Backend changes are limited to keeping the existing SSE contract predictable for the frontend cutover.

**Tech Stack:** React 18, TypeScript, `@assistant-ui/react`, Jest, Spring Boot 3, LangChain4j, SSE

---

## File Structure

| File                                                                                         | Purpose                                                                                                      |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx`                     | MODIFY: make assistant-ui runtime the only chat state/stream owner                                           |
| `apps/base/src/components/ChatbotSidebar/index.tsx`                                          | MODIFY: render sidebar directly against the single runtime path                                              |
| `apps/base/src/components/ChatbotSidebar/common/useController.ts`                            | MODIFY or DELETE: remove independent SSE/state logic; leave only a thin compatibility projection if required |
| `apps/base/src/components/ChatbotSidebar/common/ChatbotProvider.tsx`                         | MODIFY: stop behaving like an alternate chat runtime; keep only sidebar/open-state context responsibilities  |
| `apps/base/src/components/ChatbotSidebar/common/ChatService.ts`                              | MODIFY or STOP EXPORTING: remove legacy runtime coupling if it is no longer needed                           |
| `apps/base/src/components/ChatbotSidebar/exports.ts`                                         | MODIFY: narrow public surface to the single-runtime architecture                                             |
| `apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts`                       | MODIFY: ensure adapter remains the only SSE event translation layer                                          |
| `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`      | MODIFY: cover streaming, retry, clear conversation, error handling                                           |
| `apps/base/src/components/ChatbotSidebar/__tests__/ChatbotSidebar.test.tsx`                  | MODIFY: verify sidebar behavior through assistant-ui path only                                               |
| `apps/base/src/components/ChatbotSidebar/__tests__/ChatbotProvider.test.tsx`                 | MODIFY: verify reduced provider behavior or delete obsolete coverage                                         |
| `apps/base/src/components/ChatbotSidebar/__tests__/useChatbotController.test.ts`             | MODIFY: verify compatibility projection only, or delete if hook is removed                                   |
| `apps/base/src/components/ChatbotSidebar/__tests__/ChatService.test.ts`                      | MODIFY or DELETE: match the post-cutover service surface                                                     |
| `services/chatbot-backend/src/main/java/com/fdc3/chatbot/service/ChatService.java`           | MODIFY: keep assistant message completion/tool event semantics stable if needed                              |
| `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`            | MODIFY: keep explicit live-tool-confirmation limitation and stable tool event flow                           |
| `services/chatbot-backend/src/test/java/com/fdc3/chatbot/service/ChatServiceTest.java`       | MODIFY: validate stream/history behavior expected by frontend                                                |
| `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java` | MODIFY: validate SSE event contract stability                                                                |
| `docs/superpowers/specs/2026-03-18-chatbot-assistant-ui-cutover-design.md`                   | REFERENCE: approved design for this plan                                                                     |

## Task 1: Lock the Public Frontend Cutover Surface

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebar/exports.ts`
- Modify: `apps/base/src/components/ChatbotSidebar/common/useController.ts`
- Modify: `apps/base/src/components/ChatbotSidebar/common/ChatbotProvider.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/useChatbotController.test.ts`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/ChatbotProvider.test.tsx`

- [ ] **Step 1: Write failing tests that describe the post-cutover contract**

Add or update tests so they assert:

```typescript
it('projects runtime state instead of opening its own stream', () => {
  // render hook inside AssistantUIRuntimeProvider mock
  // expect returned messages/loading/error to come from runtime
  // expect no EventSource construction in useChatbotController
});

it('keeps provider responsibilities limited to sidebar/open state and runtime projection', () => {
  // render ChatbotProvider with mocked runtime
  // expect sendMessage/clearConversation/retryLastMessage to delegate
  // expect provider not to create an independent runtime path
});
```

- [ ] **Step 2: Run the targeted frontend tests to see the current failure shape**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/apps/base
npm test -- --runInBand --runTestsByPath \
  src/components/ChatbotSidebar/__tests__/useChatbotController.test.ts \
  src/components/ChatbotSidebar/__tests__/ChatbotProvider.test.tsx
```

Expected: failures or mismatches that prove the old contract still exposes duplicate runtime behavior.

- [ ] **Step 3: Remove independent runtime behavior from `useChatbotController`**

Implement one of these only:

```typescript
// Preferred
export function useChatbotController(...) {
  const runtime = useAssistantUIRuntime();
  return projectRuntimeToLegacyShape(runtime, chatbotContext);
}
```

Or, if the hook is being removed entirely:

```typescript
/** @deprecated assistant-ui runtime owns chat state now */
export function useChatbotController() {
  throw new Error('useChatbotController is no longer supported outside AssistantUIRuntimeProvider');
}
```

Pick one approach and make the tests explicit about it.

- [ ] **Step 4: Reduce `ChatbotProvider` to non-runtime responsibilities**

Keep only what still makes sense:

```typescript
const value = {
  messages: runtime.messages.map(toChatMessage),
  isLoading: runtime.isLoading,
  error: runtime.error,
  conversationId: runtime.conversationId,
  isOpen,
  sendMessage: runtime.sendMessage,
  clearConversation: runtime.clearConversation,
  retryLastMessage: async () => runtime.retryLastMessage(),
  toggleSidebar,
};
```

Do not allow provider-owned transport or duplicate stream state to remain.

- [ ] **Step 5: Narrow the public exports**

Update `exports.ts` so the export surface matches the chosen cutover:

```typescript
export { ChatbotSidebar } from './index';
export { AssistantUIRuntimeProvider, useAssistantUIRuntime } from './AssistantUIRuntimeProvider';
export { ChatbotProvider, useChatbot } from './common/ChatbotProvider';
// remove or explicitly deprecate legacy runtime exports
```

- [ ] **Step 6: Re-run the targeted frontend tests**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/apps/base
npm test -- --runInBand --runTestsByPath \
  src/components/ChatbotSidebar/__tests__/useChatbotController.test.ts \
  src/components/ChatbotSidebar/__tests__/ChatbotProvider.test.tsx
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add \
  apps/base/src/components/ChatbotSidebar/exports.ts \
  apps/base/src/components/ChatbotSidebar/common/useController.ts \
  apps/base/src/components/ChatbotSidebar/common/ChatbotProvider.tsx \
  apps/base/src/components/ChatbotSidebar/__tests__/useChatbotController.test.ts \
  apps/base/src/components/ChatbotSidebar/__tests__/ChatbotProvider.test.tsx
git commit -m "refactor: remove legacy chatbot runtime surface"
```

## Task 2: Make the Sidebar Use Only the Assistant-UI Runtime Path

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebar/index.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/ChatbotSidebar.test.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts`

- [ ] **Step 1: Write failing tests for single-runtime sidebar behavior**

Add or update tests that assert:

```typescript
it('mounts one assistant-ui runtime for the sidebar flow', () => {
  // render ChatbotSidebar closed -> open
  // expect assistant-ui runtime provider path only
});

it('retries and clears conversation through runtime state', () => {
  // simulate error + retry
  // simulate new chat
});
```

- [ ] **Step 2: Run the targeted assistant-ui/sidebar test suite**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/apps/base
npm test -- --runInBand --runTestsByPath \
  src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx \
  src/components/ChatbotSidebar/__tests__/ChatbotSidebar.test.tsx \
  src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts
```

Expected: failures that show the remaining conditional runtime logic or stale adapter assumptions.

- [ ] **Step 3: Simplify `ChatbotSidebar`**

Restructure the component so it always renders through the assistant-ui path. Prefer a shape like:

```tsx
<GenerativeUIProvider initialComponents={defaultGenerativeComponents}>
  <AssistantUIRuntimeProvider apiUrl={apiUrl}>
    <SidebarShell ...>
      <ChatbotContent onToggle={handleToggle} />
    </SidebarShell>
  </AssistantUIRuntimeProvider>
</GenerativeUIProvider>
```

If existing-runtime nesting still needs to be supported, keep it only as a context-bridging guard, not a second runtime implementation path.

- [ ] **Step 4: Harden `AssistantUIRuntimeProvider` for the single path**

Ensure it owns:

```typescript
closeEventSource();
setIsLoading(false);
setError(null);
streamingStateRef.current = createInitialStreamingState();
```

for retry/clear/reset behavior, and that it does not rely on legacy controller state.

- [ ] **Step 5: Keep SSE translation centralized**

Refactor `adapters/sseToAssistantUi.ts` as needed so all event parsing and message mutation stays there. Do not move event translation back into UI components.

- [ ] **Step 6: Re-run the assistant-ui/sidebar test suite**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/apps/base
npm test -- --runInBand --runTestsByPath \
  src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx \
  src/components/ChatbotSidebar/__tests__/ChatbotSidebar.test.tsx \
  src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add \
  apps/base/src/components/ChatbotSidebar/index.tsx \
  apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx \
  apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts \
  apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx \
  apps/base/src/components/ChatbotSidebar/__tests__/ChatbotSidebar.test.tsx \
  apps/base/src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts
git commit -m "refactor: route chatbot sidebar through assistant-ui runtime"
```

## Task 3: Delete or Narrow Legacy Service Layer Pieces

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebar/common/ChatService.ts`
- Modify: `apps/base/src/components/ChatbotSidebar/exports.ts`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/ChatService.test.ts`

- [ ] **Step 1: Write the failing test for the remaining service contract**

Decide whether `ChatService` still belongs in the public surface. Add a test that proves the remaining contract only covers still-supported responsibilities, for example:

```typescript
it('does not act as the primary streaming runtime anymore', () => {
  // assert only low-level request/health helpers remain, or assert export removal
});
```

- [ ] **Step 2: Run the targeted ChatService test**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/apps/base
npm test -- --runInBand --runTestsByPath \
  src/components/ChatbotSidebar/__tests__/ChatService.test.ts
```

Expected: FAIL until the service surface matches the cutover architecture.

- [ ] **Step 3: Remove runtime-oriented responsibilities from `ChatService` or stop exporting it**

If it remains:

```typescript
export class ChatService {
  async healthCheck(): Promise<boolean> { ... }
  async getConversationHistory(conversationId: string): Promise<ChatMessage[]> { ... }
}
```

If it no longer belongs:

```typescript
// stop exporting ChatService from exports.ts
```

Do not leave a second streaming abstraction in the public API.

- [ ] **Step 4: Re-run the targeted ChatService test**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/apps/base
npm test -- --runInBand --runTestsByPath \
  src/components/ChatbotSidebar/__tests__/ChatService.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add \
  apps/base/src/components/ChatbotSidebar/common/ChatService.ts \
  apps/base/src/components/ChatbotSidebar/exports.ts \
  apps/base/src/components/ChatbotSidebar/__tests__/ChatService.test.ts
git commit -m "refactor: narrow legacy chatbot service surface"
```

## Task 4: Keep the Backend SSE Contract Predictable for the Cutover

**Files:**

- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/service/ChatService.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/service/ChatServiceTest.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java`

- [ ] **Step 1: Add failing backend tests for current frontend expectations**

Add or update tests to assert:

```java
@Test
void storesCompletedAssistantMessageAfterStreamingFinishes() { ... }

@Test
void emitsToolCallAndToolResultEventsWithoutHidingUnsupportedConfirmation() { ... }
```

- [ ] **Step 2: Run the focused backend tests**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/services/chatbot-backend
gradle test --tests com.fdc3.chatbot.service.ChatServiceTest --tests com.fdc3.chatbot.controller.ChatControllerTest
```

Expected: FAIL where stream semantics are incomplete or ambiguous.

- [ ] **Step 3: Tighten `ChatService` completion/history behavior**

Make sure the completed assistant message is always recorded from the streamed response path:

```java
history.add(ChatMessage.builder()
    .role(ChatMessage.Role.ASSISTANT)
    .content(assistantResponse.toString())
    .toolCalls(...)
    .toolResults(...)
    .build());
```

and that cancellation/error behavior does not silently append partial garbage.

- [ ] **Step 4: Keep `AgentService` explicit about unsupported live confirmation**

Preserve the limitation, but make it deterministic:

```java
if (requiresConfirmation) {
    onError.accept(new UnsupportedOperationException(...));
    return;
}
```

Do not introduce frontend-specific workarounds here during the cutover.

- [ ] **Step 5: Re-run the focused backend tests**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/services/chatbot-backend
gradle test --tests com.fdc3.chatbot.service.ChatServiceTest --tests com.fdc3.chatbot.controller.ChatControllerTest
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/service/ChatService.java \
  services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java \
  services/chatbot-backend/src/test/java/com/fdc3/chatbot/service/ChatServiceTest.java \
  services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java
git commit -m "test: lock chatbot streaming contract for assistant-ui cutover"
```

## Task 5: Run End-to-End Verification for the Cutover

**Files:**

- Modify as needed: any files above based on final integration failures
- Reference: `docs/superpowers/specs/2026-03-18-chatbot-assistant-ui-cutover-design.md`

- [ ] **Step 1: Run the full chatbot-focused frontend suite**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/apps/base
npm test -- --runInBand --runTestsByPath \
  src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx \
  src/components/ChatbotSidebar/__tests__/ChatbotProvider.test.tsx \
  src/components/ChatbotSidebar/__tests__/ChatbotSidebar.test.tsx \
  src/components/ChatbotSidebar/__tests__/ChatService.test.ts \
  src/components/ChatbotSidebar/__tests__/useChatbotController.test.ts \
  src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts
```

Expected: PASS

- [ ] **Step 2: Run frontend lint for the touched package**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/apps/base
npm run lint
```

Expected: PASS

- [ ] **Step 3: Run the backend contract tests again**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/services/chatbot-backend
gradle test --tests com.fdc3.chatbot.service.ChatServiceTest --tests com.fdc3.chatbot.controller.ChatControllerTest
```

Expected: PASS

- [ ] **Step 4: Run one final targeted build sanity check**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/apps/base
npm run build:types
```

Expected: PASS

- [ ] **Step 5: Update the plan/spec references if implementation differed**

If any execution choice changed the cutover contract, update:

```text
docs/superpowers/specs/2026-03-18-chatbot-assistant-ui-cutover-design.md
```

before closing the work.

- [ ] **Step 6: Commit**

```bash
git add apps/base services/chatbot-backend docs/superpowers/specs/2026-03-18-chatbot-assistant-ui-cutover-design.md
git commit -m "refactor: complete assistant-ui chatbot cutover"
```
