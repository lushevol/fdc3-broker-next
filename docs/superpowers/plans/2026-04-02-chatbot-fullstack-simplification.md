# Chatbot Full-Stack Simplification Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centralize frontend tool registration, remove redundant chatbot code paths, and simplify frontend/backend streaming logic without breaking the main assistant workflow.

**Architecture:** Move frontend tool composition into one production registry, remove demo/example registrations from app wiring, collapse repeated SSE assistant-message mutations into shared helpers, and reduce backend streaming overload duplication while preserving the existing HTTP/SSE/tool continuation contract.

**Tech Stack:** React 18, TypeScript, assistant-ui, Jest, Spring Boot, Java, LangChain4j

---

### Task 1: Centralize Frontend Tool Registration

**Files:**
- Create: `apps/base/src/components/ChatbotSidebar/tools/createFrontendToolRegistry.ts`
- Modify: `apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx`
- Modify: `apps/base/src/pages/Home/index.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`

- [ ] **Step 1: Write/update failing registry composition tests**
- [ ] **Step 2: Implement one production registry factory for frontend tools**
- [ ] **Step 3: Update runtime provider to consume the central registry**
- [ ] **Step 4: Remove page-level duplicate registration wiring**
- [ ] **Step 5: Run targeted frontend tests**

### Task 2: Remove Demo and Example Chatbot Tool Paths

**Files:**
- Delete: `apps/base/src/components/ChatbotSidebar/tools/demoToolkit.tsx`
- Delete: `apps/base/src/components/ChatbotSidebar/tools/demoToolLogic.ts`
- Delete: `apps/base/src/components/ChatbotSidebar/tools/demoToolUi.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/exports.ts`
- Modify: chatbot tests referencing demo/example code

- [ ] **Step 1: Identify all production and test references to demo/example tools**
- [ ] **Step 2: Remove demo/example exports and registrations that are no longer supported**
- [ ] **Step 3: Update tests to reflect supported business tool surface**
- [ ] **Step 4: Run targeted frontend tests**

### Task 3: Simplify Frontend Runtime and SSE Handling

**Files:**
- Modify: `apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts`
- Modify: `apps/base/src/components/ChatbotSidebar/components/GenerativeUIRenderer.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/tools/backendToolUiToolkit.tsx`
- Modify: `apps/base/src/next-packages/components/assistant-ui/thread.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/fetchSSE.test.ts`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/GenerativeUIRenderer.test.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/backendToolUiToolkit.test.tsx`

- [ ] **Step 1: Write/update tests for shared assistant-message mutation helpers**
- [ ] **Step 2: Collapse repeated event-branch message creation/update logic**
- [ ] **Step 3: Merge duplicate generative UI fallback/render behavior where possible**
- [ ] **Step 4: Remove dead wrappers that no longer add value**
- [ ] **Step 5: Run targeted frontend tests**

### Task 4: Simplify Backend Streaming Layers

**Files:**
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/service/ChatService.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ChatController.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/service/ChatServiceTest.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/agent/AgentServiceTest.java`

- [ ] **Step 1: Reduce repeated overloads to one canonical streaming entry path per layer**
- [ ] **Step 2: Preserve existing frontend tool manifest and continuation behavior**
- [ ] **Step 3: Keep SSE response semantics stable**
- [ ] **Step 4: Run targeted backend tests**

### Task 5: Final Verification

**Files:**
- Modify: any snapshots or tests affected by supported API cleanup

- [ ] **Step 1: Run focused frontend chatbot test suite**
- [ ] **Step 2: Run focused backend chatbot test suite**
- [ ] **Step 3: Start the app and verify the main chat flow in the browser**
- [ ] **Step 4: Confirm no removed code paths are still referenced**
