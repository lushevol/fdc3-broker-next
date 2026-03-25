# Chatbot LocalRuntime Tools Cutover Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut over the chatbot to assistant-ui `LocalRuntime`, ship browser-executed frontend tools with demo tool UI, and verify the full flow in Chrome.

**Architecture:** Replace the custom SSE bridge in `ChatbotSidebar` with a `LocalRuntime` provider that registers a demo assistant-ui toolkit through `Tools({ toolkit })`. Keep the existing modal/thread shell, adapt backend chat calls inside a model adapter, and let frontend tools execute directly in the browser with assistant-ui-managed tool UI.

**Tech Stack:** React 18, TypeScript, assistant-ui `@assistant-ui/react`, Jest, Chrome DevTools MCP

---

### Task 1: Lock the runtime/provider contract with failing tests

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`
- Create: `apps/base/src/components/ChatbotSidebar/__tests__/demoToolkit.test.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/demoToolkit.test.tsx`

- [ ] **Step 1: Write the failing runtime/provider tests**

Add tests that assert:

- the provider creates a `LocalRuntime`
- the demo toolkit is registered
- a tool render path is available through assistant-ui

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --runInBand apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx apps/base/src/components/ChatbotSidebar/__tests__/demoToolkit.test.tsx`
Expected: FAIL because the current provider still uses the custom SSE bridge and no demo toolkit module exists.

- [ ] **Step 3: Commit after green**

```bash
git add apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx apps/base/src/components/ChatbotSidebar/__tests__/demoToolkit.test.tsx
git commit -m "test: define local runtime tool cutover behavior"
```

### Task 2: Build the demo frontend toolkit

**Files:**

- Create: `apps/base/src/components/ChatbotSidebar/tools/demoToolkit.tsx`
- Create: `apps/base/src/components/ChatbotSidebar/tools/demoToolUi.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/exports.ts`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/demoToolkit.test.tsx`

- [ ] **Step 1: Write the failing demo toolkit tests**

Add tests for:

- tool metadata/schema exposure
- browser-side execution results
- inline tool UI rendering

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --runInBand apps/base/src/components/ChatbotSidebar/__tests__/demoToolkit.test.tsx`
Expected: FAIL because toolkit files do not exist yet.

- [ ] **Step 3: Write the minimal toolkit implementation**

Implement the demo tools and their `render` functions with strict types and no backend dependency.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- --runInBand apps/base/src/components/ChatbotSidebar/__tests__/demoToolkit.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/base/src/components/ChatbotSidebar/tools/demoToolkit.tsx apps/base/src/components/ChatbotSidebar/tools/demoToolUi.tsx apps/base/src/components/ChatbotSidebar/exports.ts apps/base/src/components/ChatbotSidebar/__tests__/demoToolkit.test.tsx
git commit -m "feat: add demo frontend assistant tools"
```

### Task 3: Cut over the runtime provider to `LocalRuntime`

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/index.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`

- [ ] **Step 1: Write the failing runtime adapter assertions**

Add tests that assert the provider uses the backend through the model adapter and exposes expected runtime actions after the cutover.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --runInBand apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`
Expected: FAIL because the provider still uses the custom SSE/EventSource path.

- [ ] **Step 3: Write the minimal `LocalRuntime` implementation**

Replace the EventSource-based runtime with `useLocalRuntime(...)`, register tools with `useAui(...)`, and preserve the provider-facing API used by the shell.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- --runInBand apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx apps/base/src/components/ChatbotSidebar/index.tsx apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx
git commit -m "feat: cut chatbot runtime to assistant-ui local runtime"
```

### Task 4: Retire the old SSE adapter path

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts`
- Modify: `apps/base/src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts`
- Modify: `apps/base/src/components/ChatbotSidebar/components/GenerativeUIRenderer.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/components/ToolCallRenderer.tsx`

- [ ] **Step 1: Write failing cleanup-oriented tests or adjust coverage targets**

Define whether the old adapter remains only as compatibility code or is fully removed from the main path.

- [ ] **Step 2: Run tests to verify the current assumptions fail**

Run: `npm test -- --runInBand apps/base/src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts`
Expected: FAIL or require updates because the cutover changes the primary runtime contract.

- [ ] **Step 3: Remove or isolate obsolete runtime dependencies**

Keep only code still required after the cutover. Avoid leaving dead runtime branches in production code.

- [ ] **Step 4: Run relevant tests**

Run: `npm test -- --runInBand apps/base/src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts apps/base/src/components/ChatbotSidebar/__tests__/ToolCallRenderer.test.tsx apps/base/src/components/ChatbotSidebar/__tests__/GenerativeUI.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts apps/base/src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts apps/base/src/components/ChatbotSidebar/components/GenerativeUIRenderer.tsx apps/base/src/components/ChatbotSidebar/components/ToolCallRenderer.tsx
git commit -m "refactor: retire custom chatbot sse runtime path"
```

### Task 5: Verify, lint, and run Chrome E2E

**Files:**

- Modify if needed based on verification findings

- [ ] **Step 1: Run targeted frontend tests**

Run: `npm test -- --runInBand apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx apps/base/src/components/ChatbotSidebar/__tests__/demoToolkit.test.tsx apps/base/src/components/ChatbotSidebar/__tests__/ChatbotSidebar.test.tsx`
Expected: PASS

- [ ] **Step 2: Run lint for the touched package**

Run: `npm run lint`
Expected: PASS with zero warnings

- [ ] **Step 3: Start the app**

Run: `npm run dev`
Expected: container app available at `http://localhost:8001`

- [ ] **Step 4: Verify in Chrome**

Verify:

- login if needed
- open the assistant modal
- submit a prompt that triggers a demo frontend tool
- confirm inline tool UI renders in the thread
- confirm normal chat still works after tool execution

- [ ] **Step 5: Commit final fixes**

```bash
git add <touched files>
git commit -m "test: verify local runtime chatbot tools end to end"
```
