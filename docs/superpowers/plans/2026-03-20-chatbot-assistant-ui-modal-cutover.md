# Chatbot Assistant-UI Modal Cutover Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy chatbot sidebar with an assistant-ui modal, remove obsolete sidebar compatibility surfaces, and verify the final experience in Chrome.

**Architecture:** `AssistantUIRuntimeProvider` remains the single runtime and SSE boundary. The UI shell is rebuilt around the local assistant-ui modal and thread components under `apps/base/src/next-packages/components/assistant-ui`, while the old sidebar-oriented exports, props, and compatibility helpers are removed.

**Tech Stack:** React 18, TypeScript, Jest, Testing Library, assistant-ui, Chrome DevTools MCP

---

## File Structure

| File                                                                                    | Purpose                                                                |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `apps/base/src/components/ChatbotSidebar/index.tsx`                                     | Replace the sidebar shell with the assistant-ui modal entry point      |
| `apps/base/src/components/ChatbotSidebar/common/interface.ts`                           | Remove sidebar-specific props/types that no longer apply               |
| `apps/base/src/components/ChatbotSidebar/exports.ts`                                    | Narrow the public surface to the modal-era assistant-ui API            |
| `apps/base/src/components/ChatbotSidebar/components/ThemedThread.tsx`                   | Delete if fully replaced by the assistant-ui thread stack              |
| `apps/base/src/components/ChatbotSidebar/common/useController.ts`                       | Delete or stop exporting if only legacy sidebar compatibility remains  |
| `apps/base/src/components/ChatbotSidebar/common/ChatService.ts`                         | Delete or stop exporting if it only preserves legacy runtime surface   |
| `apps/base/src/components/ChatbotSidebar/common/ChatbotProvider.tsx`                    | Remove if no longer needed after compatibility cleanup                 |
| `apps/base/src/next-packages/components/assistant-ui/assistant-modal.tsx`               | Adapt local assistant-ui modal shell to the app’s runtime and UX needs |
| `apps/base/src/next-packages/components/assistant-ui/thread.tsx`                        | Serve as the canonical thread/composer/message surface                 |
| `apps/base/src/pages/Home/index.tsx`                                                    | Keep app-level runtime mounting and render the modal entry point       |
| `apps/base/src/components/ChatbotSidebar/__tests__/ChatbotSidebar.test.tsx`             | Define the new modal contract first                                    |
| `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx` | Protect runtime behavior used by the modal                             |
| `apps/base/src/components/ChatbotSidebar/__tests__/ChatbotProvider.test.tsx`            | Delete or rewrite based on removed compatibility surface               |
| `apps/base/src/components/ChatbotSidebar/__tests__/useChatbotController.test.ts`        | Delete or rewrite based on removed compatibility surface               |
| `apps/base/src/components/ChatbotSidebar/__tests__/ChatService.test.ts`                 | Delete or rewrite based on removed compatibility surface               |
| `docs/superpowers/specs/2026-03-20-chatbot-assistant-ui-modal-cutover-design.md`        | Approved design reference                                              |

### Task 1: Lock The New Modal Contract In Tests

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebar/__tests__/ChatbotSidebar.test.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`
- Modify/Delete: `apps/base/src/components/ChatbotSidebar/__tests__/ChatbotProvider.test.tsx`
- Modify/Delete: `apps/base/src/components/ChatbotSidebar/__tests__/useChatbotController.test.ts`
- Modify/Delete: `apps/base/src/components/ChatbotSidebar/__tests__/ChatService.test.ts`

- [ ] **Step 1: Write the failing modal shell tests**

```tsx
it('renders a floating assistant trigger and opens modal content', async () => {
  render(<ChatbotSidebar />);

  await user.click(screen.getByRole('button', { name: /open assistant/i }));

  expect(screen.getByRole('button', { name: /close assistant/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/message composer/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Write the failing runtime interaction tests**

```tsx
it('clears and retries through AssistantUIRuntimeProvider only', async () => {
  // render runtime + chatbot modal
  // inject error state
  // assert retry/clear delegate through runtime actions
});
```

- [ ] **Step 3: Delete or rewrite tests that only protect removed compatibility APIs**

```tsx
it('does not export legacy sidebar compatibility helpers', async () => {
  expect(exports.useChatbotController).toBeUndefined();
  expect(exports.ChatService).toBeUndefined();
});
```

- [ ] **Step 4: Run the targeted tests to capture the failure shape**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/apps/base
npm test -- --runInBand --runTestsByPath \
  src/components/ChatbotSidebar/__tests__/ChatbotSidebar.test.tsx \
  src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx
```

Expected: FAIL because the production UI is still a sidebar and legacy exports still exist.

### Task 2: Replace The Sidebar Shell With Assistant-UI Modal Components

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebar/index.tsx`
- Modify: `apps/base/src/next-packages/components/assistant-ui/assistant-modal.tsx`
- Modify: `apps/base/src/next-packages/components/assistant-ui/thread.tsx`
- Modify/Delete: `apps/base/src/components/ChatbotSidebar/components/ThemedThread.tsx`

- [ ] **Step 1: Implement the minimal modal entry point**

```tsx
export const ChatbotSidebar = (): JSX.Element => {
  return (
    <GenerativeUIProvider initialComponents={defaultGenerativeComponents}>
      <AssistantModal />
    </GenerativeUIProvider>
  );
};
```

- [ ] **Step 2: Adapt the local assistant-ui modal to the app runtime**

```tsx
<AssistantModalPrimitive.Root>
  <AssistantModalPrimitive.Anchor ...>
    <AssistantModalPrimitive.Trigger asChild>
      <AssistantModalButton />
    </AssistantModalPrimitive.Trigger>
  </AssistantModalPrimitive.Anchor>
  <AssistantModalPrimitive.Content ...>
    <Thread />
  </AssistantModalPrimitive.Content>
</AssistantModalPrimitive.Root>
```

- [ ] **Step 3: Move remaining message/composer customization into the assistant-ui thread stack**

```tsx
<ThreadPrimitive.Root>
  <ThreadPrimitive.Viewport>
    <ThreadPrimitive.Messages components={...} />
  </ThreadPrimitive.Viewport>
  <ComposerPrimitive.Root>
    ...
  </ComposerPrimitive.Root>
</ThreadPrimitive.Root>
```

- [ ] **Step 4: Run the targeted UI tests**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/apps/base
npm test -- --runInBand --runTestsByPath \
  src/components/ChatbotSidebar/__tests__/ChatbotSidebar.test.tsx
```

Expected: PASS

### Task 3: Remove Legacy Public Surface And Sidebar-Oriented Types

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebar/common/interface.ts`
- Modify: `apps/base/src/components/ChatbotSidebar/exports.ts`
- Modify/Delete: `apps/base/src/components/ChatbotSidebar/common/useController.ts`
- Modify/Delete: `apps/base/src/components/ChatbotSidebar/common/ChatService.ts`
- Modify/Delete: `apps/base/src/components/ChatbotSidebar/common/ChatbotProvider.tsx`
- Modify: `apps/base/src/pages/Home/index.tsx`

- [ ] **Step 1: Remove sidebar-specific props from the public type**

```ts
export interface ChatbotSidebarProps {}
```

- [ ] **Step 2: Narrow exports to the modal-era API**

```ts
export { ChatbotSidebar } from './index';
export { AssistantUIRuntimeProvider, useAssistantUIRuntime } from './AssistantUIRuntimeProvider';
```

- [ ] **Step 3: Delete or stop exporting obsolete compatibility modules**

```ts
// remove useChatbotController
// remove legacy ChatService exports
// remove provider compatibility exports if unused
```

- [ ] **Step 4: Update `Home` to render only the modal-era chatbot entry point**

```tsx
<AssistantUIRuntimeProvider apiUrl="/api/chat">
  <Root ...>
    ...
    <ChatbotSidebar />
  </Root>
</AssistantUIRuntimeProvider>
```

- [ ] **Step 5: Run the affected chatbot test suite**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/apps/base
npm test -- --runInBand --runTestsByPath \
  src/components/ChatbotSidebar/__tests__/ChatbotSidebar.test.tsx \
  src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx
```

Expected: PASS

### Task 4: Verify And Harden

**Files:**

- Verify only

- [ ] **Step 1: Run the broader base package checks**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/apps/base
npm test -- --runInBand
```

Expected: PASS

- [ ] **Step 2: Run lint/type checks available for the package**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next/apps/base
npm run lint
```

Expected: PASS

- [ ] **Step 3: Start the app for browser verification if it is not already running**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next
npm run dev
```

- [ ] **Step 4: Run Chrome verification**

Verify:

1. open `http://localhost:8001`
2. log in if prompted
3. open the assistant modal
4. close and reopen it
5. send a message
6. confirm the workspace still behaves normally

- [ ] **Step 5: Stop the app if this session started it solely for verification**

Run:

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next
npm run stop
```
