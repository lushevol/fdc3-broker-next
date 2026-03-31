# Chatbot Transport And Thread Hardening Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the chatbot frontend/backend integration safe and correct by replacing query-string SSE transport with authenticated POST streaming, aligning backend conversation routing with assistant-ui thread lifecycle, and preserving the current renderer contract.

**Architecture:** Keep the current custom SSE event names and assistant-ui rendering pipeline, but replace transport and state ownership at the runtime boundary. The backend gains a canonical POST streaming endpoint, and the frontend runtime gains a fetch-based SSE client plus thread-aware conversation mapping.

**Tech Stack:** React 18, TypeScript, `@assistant-ui/react`, Jest, Spring Boot, Java, SSE

---

### Task 1: Lock Down The Current Contract With Tests

**Files:**
- Modify: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts`
- Modify: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java`

- [ ] **Step 1: Write failing frontend tests for the current broken assumptions**

Add tests that assert:
- streaming requests should not rely on query params for `message`, `toolContext`, or `frontendTools`
- new thread state should not reuse an old backend conversation
- retry/reload should use active thread routing, not a stale global id

- [ ] **Step 2: Run targeted frontend tests and verify they fail**

Run: `npm test -- --runInBand AssistantUIRuntimeProvider.test.tsx sseAdapter.types.test.ts`
Expected: FAIL on request-building and conversation lifecycle assertions

- [ ] **Step 3: Write failing backend tests for canonical POST streaming**

Add tests that assert:
- `POST /api/chat/stream` accepts JSON and returns `text/event-stream`
- `message` SSE payload is plain text, not wrapped JSON

- [ ] **Step 4: Run targeted backend tests and verify they fail**

Run: `cd services/chatbot-backend && ./mvnw -Dtest=ChatControllerTest test`
Expected: FAIL because POST stream endpoint and normalized payload are not implemented yet

- [ ] **Step 5: Commit**

```bash
git add apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx apps/base/src/components/ChatbotSidebar/__tests__/sseAdapter.types.test.ts services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java
git commit -m "test: cover chatbot transport and thread lifecycle"
```

### Task 2: Add Canonical POST Streaming Endpoint On The Backend

**Files:**
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ChatController.java`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/model/ChatRequest.java`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java`

- [ ] **Step 1: Extend the request model for streaming**

Ensure `ChatRequest` can represent:
- `message`
- `conversationId`
- `toolContext`
- `frontendTools`

- [ ] **Step 2: Implement `POST /api/chat/stream`**

Add a controller method that:
- accepts `ChatRequest`
- creates or reuses a conversation id
- streams using the existing service callbacks
- emits the existing SSE event names

- [ ] **Step 3: Normalize `message` SSE event payloads to plain text**

Change the stream emitter so `message` events send the token string directly.

- [ ] **Step 4: Keep `GET /stream` temporarily or delegate it**

Either:
- keep it for compatibility and route it through the same internal implementation, or
- mark it as compatibility-only while frontend migration happens

- [ ] **Step 5: Run targeted backend tests**

Run: `cd services/chatbot-backend && ./mvnw -Dtest=ChatControllerTest test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ChatController.java services/chatbot-backend/src/main/java/com/fdc3/chatbot/model/ChatRequest.java services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java
git commit -m "feat: add canonical chatbot post stream endpoint"
```

### Task 3: Build A Fetch-Based SSE Client For The Frontend Runtime

**Files:**
- Create: `apps/base/src/components/ChatbotSidebar/adapters/fetchSSE.ts`
- Modify: `apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts`
- Modify: `apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`

- [ ] **Step 1: Write the failing test for POST request transport**

Add a test that asserts runtime streaming uses fetch with:
- method `POST`
- JSON body
- no message-bearing query params

- [ ] **Step 2: Implement a small fetch-based SSE frame reader**

Create a focused helper that:
- accepts URL, headers, body, abort signal
- reads the response stream
- parses `event:` and `data:` frames
- invokes the same event handling callbacks used today

- [ ] **Step 3: Switch runtime transport from `EventSource` to the new fetch adapter**

Update `streamResponsesWithToolContext` to call the fetch-based helper instead of `new EventSource(...)`.

- [ ] **Step 4: Keep `handleSSEEvent` as the rendering reducer**

Do not change the renderer contract in this task. Only adapt the transport source.

- [ ] **Step 5: Run targeted frontend tests**

Run: `npm test -- --runInBand AssistantUIRuntimeProvider.test.tsx sseAdapter.types.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/base/src/components/ChatbotSidebar/adapters/fetchSSE.ts apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx
git commit -m "feat: migrate chatbot stream transport to fetch sse"
```

### Task 4: Introduce Thread-Aware Backend Conversation Mapping

**Files:**
- Modify: `apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`

- [ ] **Step 1: Write failing tests for thread reset and retry behavior**

Add tests that assert:
- a fresh thread does not reuse a previous backend conversation id
- retry/reload uses the current thread’s mapped conversation
- continuation requests still target the correct conversation

- [ ] **Step 2: Replace the single `conversationIdRef` with per-thread transport state**

Implement an internal mapping keyed by assistant-ui thread identity or equivalent runtime handle.

- [ ] **Step 3: Reset mapping on new thread lifecycle**

Ensure the next send after a new thread starts omits backend `conversationId`.

- [ ] **Step 4: Preserve mapping across normal turns in the same thread**

When `conversation_id` is received, update only the active thread mapping.

- [ ] **Step 5: Run targeted frontend tests**

Run: `npm test -- --runInBand AssistantUIRuntimeProvider.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx
git commit -m "fix: align chatbot backend conversations with assistant-ui threads"
```

### Task 5: Move Tool Continuation And Manifest Payloads Into The Request Body

**Files:**
- Modify: `apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts`
- Modify: `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ChatController.java`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`
- Test: `services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java`

- [ ] **Step 1: Write failing continuation tests**

Assert that:
- `toolContext` is serialized into JSON body
- `frontendTools` is serialized into JSON body
- continuation no longer depends on URL search params

- [ ] **Step 2: Update frontend request builder**

Construct a JSON request body with:
- `message`
- `conversationId`
- `toolContext`
- `frontendTools`

- [ ] **Step 3: Update backend controller to read those fields from the request body**

Route the body fields through the existing service pipeline.

- [ ] **Step 4: Run targeted tests**

Run: `npm test -- --runInBand AssistantUIRuntimeProvider.test.tsx`
Expected: PASS

Run: `cd services/chatbot-backend && ./mvnw -Dtest=ChatControllerTest test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ChatController.java apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx services/chatbot-backend/src/test/java/com/fdc3/chatbot/controller/ChatControllerTest.java
git commit -m "fix: send chatbot continuation payloads in request body"
```

### Task 6: Update Docs And Run Final Verification

**Files:**
- Modify: `services/chatbot-backend/docs/API.md`
- Modify: `openspec/specs/assistant-ui-integration/spec.md`
- Modify: `openspec/specs/chatbot-backend/spec.md`

- [ ] **Step 1: Update API docs**

Document:
- canonical `POST /api/chat/stream`
- request body schema
- plain-text `message` chunks
- current event names as compatibility contract

- [ ] **Step 2: Update OpenSpec docs**

Reflect:
- POST stream transport
- auth-capable streaming
- thread-aware conversation lifecycle

- [ ] **Step 3: Run frontend tests**

Run: `npm test -- --runInBand AssistantUIRuntimeProvider.test.tsx sseAdapter.types.test.ts thread.test.tsx`
Expected: PASS

- [ ] **Step 4: Run backend tests**

Run: `cd services/chatbot-backend && ./mvnw test`
Expected: PASS

- [ ] **Step 5: Run lint if frontend files changed materially**

Run: `npm run lint`
Expected: PASS with zero warnings

- [ ] **Step 6: Perform manual verification**

Run:
```bash
npm run stop
npm run dev
```

Then verify:
- open `http://localhost:8001`
- login if needed
- open the assistant UI
- send a normal prompt
- trigger a backend tool
- trigger a frontend tool continuation path if available
- retry a message
- start a fresh thread and confirm it does not reuse previous conversation context

- [ ] **Step 7: Commit**

```bash
git add services/chatbot-backend/docs/API.md openspec/specs/assistant-ui-integration/spec.md openspec/specs/chatbot-backend/spec.md
git commit -m "docs: align chatbot transport and runtime contract"
```
