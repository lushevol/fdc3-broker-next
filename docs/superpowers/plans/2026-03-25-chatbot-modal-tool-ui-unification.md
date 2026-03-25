# Chatbot Modal Tool UI Unification Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify assistant modal tool and generative UI rendering so tool-driven content uses assistant-ui `tool-call` rendering consistently for both frontend and backend tools.

**Architecture:** Keep the modal shell unchanged, move backend rich tool rendering onto UI-only toolkit entries, and reserve `data/generative-ui` for non-tool directives only. The SSE adapter remains responsible for stable tool-call accumulation, while the thread stays a thin renderer over assistant-ui parts.

**Tech Stack:** React, assistant-ui `LocalRuntime`, custom SSE adapter, TypeScript, Jest, Spring Boot SSE backend

---

### Task 1: Write and lock the contract in tests

**Files:**

- Modify: `apps/base/src/next-packages/components/assistant-ui/thread.test.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts`

- [ ] **Step 1: Write failing thread tests for backend tool-call UI resolution**
- [ ] **Step 2: Run those tests and confirm they fail for the expected missing unified path**
- [ ] **Step 3: Write failing adapter tests for stable backend tool-call/result accumulation**
- [ ] **Step 4: Run those tests and confirm they fail**

### Task 2: Add backend UI-only tool definitions

**Files:**

- Create: `apps/base/src/components/ChatbotSidebar/tools/backendToolUiToolkit.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`

- [ ] **Step 1: Add a UI-only toolkit for backend tool names that need modal rendering**
- [ ] **Step 2: Merge it into the effective toolkit without introducing duplicate runtime registration**
- [ ] **Step 3: Run focused provider tests**

### Task 3: Keep thread rendering thin and unified

**Files:**

- Modify: `apps/base/src/next-packages/components/assistant-ui/thread.tsx`
- Test: `apps/base/src/next-packages/components/assistant-ui/thread.test.tsx`

- [ ] **Step 1: Keep `tool-call` as the primary rich render path**
- [ ] **Step 2: Keep `data/generative-ui` only as a non-tool fallback path**
- [ ] **Step 3: Run thread tests**

### Task 4: Harden the SSE adapter around the contract

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts`
- Modify: `apps/base/src/components/ChatbotSidebar/adapters/types.ts`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts`

- [ ] **Step 1: Ensure backend tool results always merge into the existing tool-call part with stable `toolName`**
- [ ] **Step 2: Ensure adapter does not create tool-like `data/generative-ui` parts when a real tool-call part is the correct model**
- [ ] **Step 3: Run adapter tests**

### Task 5: Verify the modal end to end

**Files:**

- Modify: `services/chatbot-backend/docs/API.md` if protocol notes change
- Modify: `services/chatbot-backend/docs/MFE_INTEGRATION.md` if frontend expectations change

- [ ] **Step 1: Run focused frontend Jest tests**
- [ ] **Step 2: Run `tsc` and `eslint` on touched frontend files**
- [ ] **Step 3: Compile `services/chatbot-backend`**
- [ ] **Step 4: Start the app with `npm run dev`**
- [ ] **Step 5: Verify in Chrome that the modal renders frontend tool UI, backend tool UI, and a non-tool generative UI case correctly**
- [ ] **Step 6: Stop services with `npm run stop`**
