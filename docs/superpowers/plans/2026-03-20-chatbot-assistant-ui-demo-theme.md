# Assistant UI Demo Theme Alignment Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the chatbot modal match the assistant-ui modal demo in both light and dark themes while keeping the pure assistant-ui component import graph intact.

**Architecture:** Add a scoped `aui-root` token layer in the shared Tailwind stylesheet, then tune the existing assistant-ui modal, thread, attachment, and markdown classes to consume those tokens. Preserve the current runtime and component composition; only styling, scoped theme plumbing, and small test coverage for theme-bearing UI contracts change.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v4, assistant-ui, Jest, Playwright

---

### Task 1: Document The Scoped Theme Contract

**Files:**

- Modify: `docs/superpowers/plans/2026-03-20-chatbot-assistant-ui-modal-cutover.md`
- Modify: `apps/base/src/styles/tailwind.css`

- [ ] **Step 1: Update the existing plan with the approved 1:1 demo-theme follow-up**
- [ ] **Step 2: Define scoped assistant-ui light and dark tokens under `.aui-root` and `html.dark .aui-root`**
- [ ] **Step 3: Add helper surface styles for markdown, code, dialog chrome, and scrollbars without changing assistant-ui imports**
- [ ] **Step 4: Run targeted lint/type checks on the stylesheet-touching surface**

### Task 2: Add Failing Theme Contract Tests

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebar/__tests__/ChatbotSidebar.test.tsx`
- Test: `apps/base/src/next-packages/components/ui/__tests__/button.test.tsx`

- [ ] **Step 1: Write a failing assertion that the assistant trigger/content preserve the `aui-root`-scoped modal shell contract needed for demo theming**
- [ ] **Step 2: Run the focused Jest path and verify the new assertion fails for the expected reason**
- [ ] **Step 3: Keep the existing ref-forwarding button regression test as the Radix/assistant-ui contract guard**

### Task 3: Implement Demo-Faithful Modal And Thread Styling

**Files:**

- Modify: `apps/base/src/next-packages/components/assistant-ui/assistant-modal.tsx`
- Modify: `apps/base/src/next-packages/components/assistant-ui/thread.tsx`
- Modify: `apps/base/src/next-packages/components/assistant-ui/markdown-text.tsx`
- Modify: `apps/base/src/next-packages/components/assistant-ui/attachment.tsx`
- Modify: `apps/base/src/next-packages/components/assistant-ui/tooltip-icon-button.tsx`

- [ ] **Step 1: Update modal trigger and content classes to match the assistant-ui demo proportions, borders, shadows, and transitions**
- [ ] **Step 2: Update thread spacing, welcome state, message rhythm, composer chrome, and action controls to align with the demo**
- [ ] **Step 3: Update markdown/code/attachment surfaces so light and dark modes both match the demo visual language**
- [ ] **Step 4: Run the focused Jest path and verify the themed modal tests pass**

### Task 4: Verify In Browser

**Files:**

- Verify only: `http://localhost:8001`

- [ ] **Step 1: Run `npm run build:types` in `apps/base`**
- [ ] **Step 2: Run targeted ESLint on the touched assistant-ui files**
- [ ] **Step 3: Verify light theme modal appearance, open/close behavior, and message flow in the browser**
- [ ] **Step 4: Switch to dark theme and verify the same modal/thread/composer surfaces remain aligned with the demo**
- [ ] **Step 5: Record any remaining non-assistant-ui console noise separately from this cutover**
