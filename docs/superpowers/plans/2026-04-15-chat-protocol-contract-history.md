# Chat Protocol Contract History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the chat protocol contract with our intended multi-tool conversation flow by allowing assistant and tool history in run requests while keeping our richer internal `parts`-based model.

**Architecture:** Extend the request message union with a dedicated `tool` role for prior tool outputs, preserve the existing assistant/tool streaming model, and document trigger-aware history expectations in the package docs and capture example. Validation and fixtures stay in the package so downstream consumers get a single canonical contract.

**Tech Stack:** TypeScript, Zod, Vitest

---

### Task 1: Add failing validation coverage for continuation history

**Files:**

- Modify: `packages/chat-protocol-contract/test/validation.test.ts`
- Test: `packages/chat-protocol-contract/test/validation.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
it('validates continuation requests with assistant and tool history', () => {
  const result = validateRunRequest({
    conversationId: 'conv_123',
    trigger: 'submit-tool-result',
    messages: [
      {
        id: 'msg_user_1',
        role: 'user',
        parts: [{ type: 'text', text: 'weather in san francisco' }],
      },
      {
        id: 'msg_assistant_1',
        role: 'assistant',
        parts: [
          {
            type: 'tool-call',
            toolCallId: 'call_1',
            toolName: 'geocode_location',
            executionTarget: 'backend',
            state: 'input-available',
            input: { query: 'San Francisco, CA' },
          },
        ],
      },
      {
        id: 'msg_tool_1',
        role: 'tool',
        toolCallId: 'call_1',
        toolName: 'geocode_location',
        parts: [
          {
            type: 'tool-result',
            toolCallId: 'call_1',
            output: { latitude: 37.7749, longitude: -122.4194 },
          },
        ],
      },
    ],
  });

  expect(result.success).toBe(true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run packages/chat-protocol-contract/test/validation.test.ts`
Expected: FAIL because `role: 'tool'` is rejected by the current schema.

- [ ] **Step 3: Write minimal implementation**

```ts
export type ChatRole = 'system' | 'user' | 'assistant' | 'tool';

export type ChatToolMessage = {
  id: string;
  role: 'tool';
  toolCallId: string;
  toolName: string;
  parts: ChatToolResultPart[];
  metadata?: ChatMessageMetadata;
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run packages/chat-protocol-contract/test/validation.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/chat-protocol-contract/src/types.ts packages/chat-protocol-contract/src/schemas.ts packages/chat-protocol-contract/test/validation.test.ts
git commit -m "feat: support tool messages in chat history"
```

### Task 2: Update fixtures and docs to reflect our multi-tool contract

**Files:**

- Modify: `packages/chat-protocol-contract/src/fixtures.ts`
- Modify: `packages/chat-protocol-contract/docs/ai-chatbot-api-capture.md`
- Modify: `packages/chat-protocol-contract/README.md`

- [ ] **Step 1: Write the failing test**

```ts
it('provides a continuation fixture with assistant and tool history', () => {
  const request = createWeatherRunRequestFixture();
  expect(request.messages.some((message) => message.role === 'assistant')).toBe(true);
  expect(request.messages.some((message) => message.role === 'tool')).toBe(true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run packages/chat-protocol-contract/test/validation.test.ts`
Expected: FAIL because the fixture only contains a single user message.

- [ ] **Step 3: Write minimal implementation**

```ts
export function createWeatherContinuationRunRequestFixture(): ChatRunRequest {
  return {
    conversationId: 'conv_123',
    trigger: 'submit-tool-result',
    messages: [
      /* user, assistant tool-call, tool result, assistant tool-call, tool result */
    ],
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run packages/chat-protocol-contract/test/validation.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/chat-protocol-contract/src/fixtures.ts packages/chat-protocol-contract/docs/ai-chatbot-api-capture.md packages/chat-protocol-contract/README.md packages/chat-protocol-contract/test/validation.test.ts
git commit -m "docs: clarify chat history for multi-tool runs"
```
