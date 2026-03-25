# Chatbot Modal Tool UI Unification Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify assistant modal tool and generative UI rendering while moving frontend tool routing under backend LLM control, so frontend and backend tools both participate in the same multi-step agent loop.

**Architecture:** Keep the modal shell unchanged, submit a dynamic frontend tool manifest with each turn, let the backend LLM choose both backend and frontend tools, execute frontend tools in the browser only after backend requests them, and render all tool-associated UI through assistant-ui `tool-call` parts. Reserve `data/generative-ui` for non-tool directives only.

**Tech Stack:** React, assistant-ui `LocalRuntime`, custom SSE adapter, TypeScript, Jest, Spring Boot SSE backend

---

### Task 1: Lock the new agent-loop contract in tests

**Files:**

- Modify: `apps/base/src/next-packages/components/assistant-ui/thread.test.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/service/ChatServiceTest.java`

- [ ] **Step 1: Write failing frontend tests proving production chat no longer triggers frontend tools from local prompt matching**
- [ ] **Step 2: Write failing frontend tests for backend-driven `frontend_tool_call -> execute -> continuation`**
- [ ] **Step 3: Write failing adapter tests for reasoning/tool/reasoning interleaving**
- [ ] **Step 4: Write failing backend tests for frontend tool manifest parsing and frontend tool loop continuation**
- [ ] **Step 5: Run focused tests and confirm expected failures**

### Task 2: Add frontend tool manifest serialization

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/tools/toolRouting.ts`
- Modify: `apps/base/src/components/ChatbotSidebar/adapters/types.ts`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`

- [ ] **Step 1: Define a safe serializable manifest shape for registered frontend tools**
- [ ] **Step 2: Serialize the current effective frontend tool catalog on every turn and continuation**
- [ ] **Step 3: Keep `matchPrompt` out of the production routing path while preserving dev-only diagnostics**
- [ ] **Step 4: Run focused provider tests**

### Task 3: Teach the backend agent about frontend tools

**Files:**

- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ChatController.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/service/ChatService.java`
- Create or Modify: backend request/response model classes for frontend tool manifests and tool calls
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/service/ChatServiceTest.java`

- [ ] **Step 1: Accept frontend tool manifests in chat and continuation requests**
- [ ] **Step 2: Reconstruct frontend tool specs into the LLM-visible tool catalog**
- [ ] **Step 3: Emit structured frontend tool call events instead of trying to execute those tools on the server**
- [ ] **Step 4: Resume the same agent loop when frontend tool results return**
- [ ] **Step 5: Run focused backend tests**

### Task 4: Execute backend-driven frontend tool calls in the browser

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts`
- Modify: `apps/base/src/components/ChatbotSidebar/adapters/types.ts`
- Modify: `apps/base/src/components/ChatbotSidebar/tools/demoToolUi.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/demoToolkit.test.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts`

- [ ] **Step 1: Map backend `frontend_tool_call` events to assistant-ui `tool-call` parts**
- [ ] **Step 2: Execute registered frontend tools only when those events arrive**
- [ ] **Step 3: Send structured tool results back to the backend continuation endpoint**
- [ ] **Step 4: Preserve HITL behavior for frontend tools under the new flow**
- [ ] **Step 5: Run focused frontend tests**

### Task 5: Keep the thread rendering thin and ordered

**Files:**

- Modify: `apps/base/src/next-packages/components/assistant-ui/thread.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts`
- Test: `apps/base/src/next-packages/components/assistant-ui/thread.test.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts`

- [ ] **Step 1: Keep `tool-call` as the primary rich render path**
- [ ] **Step 2: Preserve reasoning/tool/reasoning ordering instead of appending all tool UI at the bottom**
- [ ] **Step 3: Keep tool-associated generative UI attached to the tool-call render path**
- [ ] **Step 4: Run thread and adapter tests**

### Task 6: Verify the multi-step loop end to end

**Files:**

- Modify: `services/chatbot-backend/docs/API.md` if protocol notes change
- Modify: `services/chatbot-backend/docs/MFE_INTEGRATION.md` if frontend expectations change

- [ ] **Step 1: Run focused frontend Jest tests**
- [ ] **Step 2: Run `tsc` and `eslint` on touched frontend files**
- [ ] **Step 3: Run backend tests or compile the backend module**
- [ ] **Step 4: Start the app with `npm run dev`**
- [ ] **Step 5: Verify in Chrome that the modal shows backend-driven frontend tool calls inline with reasoning text**
- [ ] **Step 6: Verify at least one multi-step conversation where the model reasons, calls a tool, reasons again, and then answers**
- [ ] **Step 7: Stop services with `npm run stop`**

### Task 7: Instrument silent tool turns

**Files:**

- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentServiceTest.java`

- [ ] **Step 1: Add failing backend tests for silent tool-call and empty-continuation diagnostics**
- [ ] **Step 2: Classify turn completion by phase, tool names, and visible-text presence**
- [ ] **Step 3: Log structured warnings for silent tool turns without changing the SSE protocol**
- [ ] **Step 4: Run focused backend tests and compile**
