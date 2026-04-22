# Chat Protocol Standalone Packages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build isolated frontend and backend chat protocol packages plus a minimal demo web/server pair that verify structured message parts, streamed tool flow, cards, and approval pauses without touching the production chatbot integration first.

**Architecture:** The implementation is split into a shared contract package, a frontend assistant-ui runtime adapter package, a backend protocol emitter/resume package, and two small demo apps. The demo server emits deterministic protocol frames for weather/tool/approval scenarios, and the demo web app consumes them through `assistant-ui` `LocalRuntime` so protocol behavior can be verified in isolation before integrating with `apps/base` and `services/chatbot-backend`.

**Tech Stack:** TypeScript, npm workspaces, Turbo, tsup, Vitest, React 18, Vite, assistant-ui `LocalRuntime`, Node HTTP server with SSE, JSON Schema, Zod.

---

### Task 1: Scaffold the shared protocol contract package

**Files:**

- Create: `packages/chat-protocol-contract/package.json`
- Create: `packages/chat-protocol-contract/tsconfig.json`
- Create: `packages/chat-protocol-contract/tsup.config.ts`
- Create: `packages/chat-protocol-contract/vitest.config.ts`
- Create: `packages/chat-protocol-contract/README.md`
- Create: `packages/chat-protocol-contract/src/index.ts`
- Create: `packages/chat-protocol-contract/src/types.ts`
- Create: `packages/chat-protocol-contract/src/schemas.ts`
- Create: `packages/chat-protocol-contract/src/validation.ts`
- Create: `packages/chat-protocol-contract/src/fixtures.ts`
- Test: `packages/chat-protocol-contract/test/validation.test.ts`

- [ ] **Step 1: Write the failing contract validation tests**

```ts
import { describe, expect, it } from 'vitest';
import {
  createWeatherRunRequestFixture,
  createToolPauseFrameFixture,
  validateRunRequest,
  validateStreamFrame,
} from '../src';

describe('chat-protocol-contract validation', () => {
  it('accepts a valid run request fixture', () => {
    const result = validateRunRequest(createWeatherRunRequestFixture());
    expect(result.success).toBe(true);
  });

  it('rejects a run request without messages', () => {
    const result = validateRunRequest({
      conversationId: 'conv_1',
      trigger: 'submit-message',
      messages: [],
    });

    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain('messages');
  });

  it('accepts a valid tool pause frame fixture', () => {
    const result = validateStreamFrame(createToolPauseFrameFixture());
    expect(result.success).toBe(true);
  });

  it('rejects a finish frame without finishReason', () => {
    const result = validateStreamFrame({
      type: 'finish',
      runId: 'run_1',
      conversationId: 'conv_1',
      payload: {},
    });

    expect(result.success).toBe(false);
    expect(result.errors[0]).toContain('finishReason');
  });
});
```

- [ ] **Step 2: Run the package test to verify it fails**

Run: `npm --workspace packages/chat-protocol-contract test`

Expected: FAIL with missing workspace files and/or missing exports such as `validateRunRequest`.

- [ ] **Step 3: Create the package manifest and build config**

```json
{
  "name": "chat-protocol-contract",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist", "README.md"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "lint": "eslint .",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^25.0.3",
    "@vitest/coverage-v8": "^4.0.16",
    "tsup": "^8.5.1",
    "typescript": "^5.9.3",
    "vitest": "^4.0.16"
  }
}
```

```ts
// packages/chat-protocol-contract/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
});
```

- [ ] **Step 4: Implement the core protocol types and validation surface**

```ts
// packages/chat-protocol-contract/src/types.ts
export type ChatRole = 'system' | 'user' | 'assistant';

export type ChatFinishReason = 'stop' | 'tool-calls' | 'action-required' | 'error';

export type ChatPart =
  | { type: 'text'; text: string }
  | { type: 'reasoning-summary'; text: string }
  | { type: 'plan'; planId: string; summary: string }
  | { type: 'step-start'; stepId: string; title: string }
  | {
      type: 'tool-call';
      toolCallId: string;
      toolName: string;
      executionTarget?: 'backend' | 'frontend';
      state:
        | 'input-streaming'
        | 'input-available'
        | 'awaiting-frontend'
        | 'awaiting-approval'
        | 'output-available'
        | 'output-error';
      input?: Record<string, unknown>;
      output?: unknown;
      errorText?: string;
    }
  | {
      type: 'card';
      cardType: string;
      props: Record<string, unknown>;
    }
  | {
      type: 'action';
      actionId: string;
      actionType: 'tool-approval';
      status: 'pending' | 'resolved';
      toolCallId: string;
      title: string;
      description: string;
      options: Array<{ id: 'approve' | 'reject'; label: string }>;
    }
  | { type: 'error'; message: string };

export interface ChatMessage {
  id: string;
  role: ChatRole;
  parts: ChatPart[];
  metadata?: Record<string, unknown>;
}

export interface ChatRunRequest {
  conversationId?: string;
  runId?: string | null;
  trigger: 'submit-message' | 'submit-tool-result' | 'submit-action';
  config?: {
    modelName?: string;
    reasoningVisibility?: 'summary';
  };
  context?: {
    workspace?: Record<string, unknown>;
    frontendTools?: Array<{
      name: string;
      description: string;
      parameters: Record<string, unknown>;
      interactionMode: 'auto' | 'approval-required';
    }>;
  };
  messages: ChatMessage[];
  metadata?: Record<string, unknown>;
}

export interface ChatStreamFrame {
  type:
    | 'start'
    | 'message-start'
    | 'message-metadata'
    | 'start-step'
    | 'reasoning-summary'
    | 'plan-available'
    | 'step-status'
    | 'finish-step'
    | 'text-start'
    | 'text-delta'
    | 'text-end'
    | 'tool-input-start'
    | 'tool-input-delta'
    | 'tool-input-available'
    | 'tool-output-available'
    | 'tool-output-error'
    | 'ui-part-available'
    | 'action-required'
    | 'action-resolved'
    | 'finish'
    | 'error';
  runId: string;
  conversationId: string;
  messageId?: string;
  payload?: Record<string, unknown>;
}
```

```ts
// packages/chat-protocol-contract/src/validation.ts
import { z } from 'zod';
import type { ChatRunRequest, ChatStreamFrame } from './types';

const partSchema = z.object({ type: z.string() }).passthrough();
const messageSchema = z.object({
  id: z.string().min(1),
  role: z.enum(['system', 'user', 'assistant']),
  parts: z.array(partSchema).min(1),
  metadata: z.record(z.unknown()).optional(),
});

const runRequestSchema = z.object({
  conversationId: z.string().optional(),
  runId: z.string().nullable().optional(),
  trigger: z.enum(['submit-message', 'submit-tool-result', 'submit-action']),
  config: z
    .object({
      modelName: z.string().optional(),
      reasoningVisibility: z.literal('summary').optional(),
    })
    .optional(),
  context: z.record(z.unknown()).optional(),
  messages: z.array(messageSchema).min(1),
  metadata: z.record(z.unknown()).optional(),
});

const streamFrameSchema = z
  .object({
    type: z.string().min(1),
    runId: z.string().min(1),
    conversationId: z.string().min(1),
    messageId: z.string().optional(),
    payload: z.record(z.unknown()).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.type === 'finish' && value.payload?.finishReason == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'finish payload.finishReason is required',
      });
    }
  });

export function validateRunRequest(
  input: unknown,
): { success: true; data: ChatRunRequest } | { success: false; errors: string[] } {
  const result = runRequestSchema.safeParse(input);
  return result.success
    ? { success: true, data: result.data as ChatRunRequest }
    : { success: false, errors: result.error.issues.map((issue) => issue.message) };
}

export function validateStreamFrame(
  input: unknown,
): { success: true; data: ChatStreamFrame } | { success: false; errors: string[] } {
  const result = streamFrameSchema.safeParse(input);
  return result.success
    ? { success: true, data: result.data as ChatStreamFrame }
    : { success: false, errors: result.error.issues.map((issue) => issue.message) };
}
```

- [ ] **Step 5: Add fixtures and package exports**

```ts
// packages/chat-protocol-contract/src/fixtures.ts
import type { ChatRunRequest, ChatStreamFrame } from './types';

export function createWeatherRunRequestFixture(): ChatRunRequest {
  return {
    conversationId: 'conv_weather_demo',
    runId: null,
    trigger: 'submit-message',
    config: { modelName: 'demo/weather', reasoningVisibility: 'summary' },
    messages: [
      {
        id: 'msg_user_weather',
        role: 'user',
        parts: [{ type: 'text', text: 'how is the weather in Beijing yesterday?' }],
      },
    ],
  };
}

export function createToolPauseFrameFixture(): ChatStreamFrame {
  return {
    type: 'finish',
    runId: 'run_weather_demo',
    conversationId: 'conv_weather_demo',
    messageId: 'msg_asst_weather',
    payload: {
      finishReason: 'tool-calls',
    },
  };
}
```

```ts
// packages/chat-protocol-contract/src/index.ts
export * from './types';
export * from './validation';
export * from './fixtures';
```

- [ ] **Step 6: Run tests to verify the package passes**

Run: `npm --workspace packages/chat-protocol-contract test`

Expected: PASS with 4 passing tests.

- [ ] **Step 7: Commit the contract package**

```bash
git add packages/chat-protocol-contract
git commit -m "feat: add standalone chat protocol contract package"
```

### Task 2: Build the frontend protocol runtime package

**Files:**

- Create: `packages/chat-protocol-frontend/package.json`
- Create: `packages/chat-protocol-frontend/tsconfig.json`
- Create: `packages/chat-protocol-frontend/tsup.config.ts`
- Create: `packages/chat-protocol-frontend/vitest.config.ts`
- Create: `packages/chat-protocol-frontend/src/index.ts`
- Create: `packages/chat-protocol-frontend/src/runtime/createProtocolLocalRuntime.ts`
- Create: `packages/chat-protocol-frontend/src/runtime/createProtocolStreamAdapter.ts`
- Create: `packages/chat-protocol-frontend/src/runtime/resume.ts`
- Create: `packages/chat-protocol-frontend/src/render/ProtocolMessageRenderer.tsx`
- Create: `packages/chat-protocol-frontend/src/render/defaultCardRegistry.tsx`
- Test: `packages/chat-protocol-frontend/test/stream-adapter.test.tsx`

- [ ] **Step 1: Write the failing frontend stream adapter tests**

```tsx
import { describe, expect, it } from 'vitest';
import { applyFrameSequenceToMessage } from '../src/runtime/createProtocolStreamAdapter';

describe('protocol frontend stream adapter', () => {
  it('builds assistant text from text delta frames', () => {
    const message = applyFrameSequenceToMessage(
      [],
      [
        { type: 'message-start', runId: 'run_1', conversationId: 'conv_1', messageId: 'msg_1' },
        { type: 'text-start', runId: 'run_1', conversationId: 'conv_1', messageId: 'msg_1' },
        {
          type: 'text-delta',
          runId: 'run_1',
          conversationId: 'conv_1',
          messageId: 'msg_1',
          payload: { text: 'Hello' },
        },
      ],
    );

    expect(message[0]?.parts).toEqual([{ type: 'text', text: 'Hello' }]);
  });

  it('records tool pauses as tool-call parts', () => {
    const message = applyFrameSequenceToMessage(
      [],
      [
        { type: 'message-start', runId: 'run_1', conversationId: 'conv_1', messageId: 'msg_1' },
        {
          type: 'tool-input-available',
          runId: 'run_1',
          conversationId: 'conv_1',
          messageId: 'msg_1',
          payload: {
            toolCallId: 'tc_1',
            toolName: 'location.resolve',
            executionTarget: 'frontend',
            input: { query: 'Beijing' },
          },
        },
      ],
    );

    expect(message[0]?.parts[0]).toMatchObject({
      type: 'tool-call',
      toolCallId: 'tc_1',
      toolName: 'location.resolve',
    });
  });
});
```

- [ ] **Step 2: Run the frontend package test to verify it fails**

Run: `npm --workspace packages/chat-protocol-frontend test`

Expected: FAIL with missing workspace files or missing `applyFrameSequenceToMessage`.

- [ ] **Step 3: Create the frontend package manifest**

```json
{
  "name": "@fm/chat-protocol-frontend",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "lint": "eslint .",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@assistant-ui/react": "^0.12.19",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "chat-protocol-contract": "*"
  },
  "devDependencies": {
    "@testing-library/react": "^16.3.1",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^5.1.2",
    "happy-dom": "^20.5.0",
    "tsup": "^8.5.1",
    "typescript": "^5.9.3",
    "vite": "^7.3.0",
    "vitest": "^4.0.16"
  }
}
```

- [ ] **Step 4: Implement the frame-to-message adapter**

```ts
// packages/chat-protocol-frontend/src/runtime/createProtocolStreamAdapter.ts
import type { ChatMessage, ChatPart, ChatStreamFrame } from 'chat-protocol-contract';

function ensureAssistantMessage(messages: ChatMessage[], messageId: string): ChatMessage[] {
  if (messages.some((message) => message.id === messageId)) return messages;
  return [...messages, { id: messageId, role: 'assistant', parts: [] }];
}

export function applyFrameSequenceToMessage(
  initialMessages: ChatMessage[],
  frames: ChatStreamFrame[],
): ChatMessage[] {
  let messages = [...initialMessages];

  for (const frame of frames) {
    if (!frame.messageId) continue;
    messages = ensureAssistantMessage(messages, frame.messageId);
    const index = messages.findIndex((message) => message.id === frame.messageId);
    const current = messages[index]!;

    let nextParts: ChatPart[] = current.parts;

    if (frame.type === 'text-delta') {
      const delta = String(frame.payload?.text ?? '');
      const previous = nextParts[nextParts.length - 1];
      if (previous?.type === 'text') {
        nextParts = [...nextParts.slice(0, -1), { type: 'text', text: previous.text + delta }];
      } else {
        nextParts = [...nextParts, { type: 'text', text: delta }];
      }
    }

    if (frame.type === 'reasoning-summary') {
      nextParts = [
        ...nextParts,
        { type: 'reasoning-summary', text: String(frame.payload?.text ?? '') },
      ];
    }

    if (frame.type === 'tool-input-available') {
      nextParts = [
        ...nextParts,
        {
          type: 'tool-call',
          toolCallId: String(frame.payload?.toolCallId ?? ''),
          toolName: String(frame.payload?.toolName ?? ''),
          executionTarget:
            (frame.payload?.executionTarget as 'backend' | 'frontend' | undefined) ?? 'backend',
          state: 'input-available',
          input: (frame.payload?.input as Record<string, unknown> | undefined) ?? {},
        },
      ];
    }

    if (frame.type === 'ui-part-available') {
      nextParts = [
        ...nextParts,
        {
          type: 'card',
          cardType: String(frame.payload?.cardType ?? 'unknown-card'),
          props: (frame.payload?.props as Record<string, unknown> | undefined) ?? {},
        },
      ];
    }

    messages[index] = { ...current, parts: nextParts };
  }

  return messages;
}
```

- [ ] **Step 5: Implement resume helpers and a minimal renderer**

```ts
// packages/chat-protocol-frontend/src/runtime/resume.ts
import type { ChatMessage } from 'chat-protocol-contract';

export interface ResumeRequest {
  conversationId: string;
  runId: string;
  trigger: 'submit-tool-result' | 'submit-action';
  messages: ChatMessage[];
}

export function buildToolResumeRequest(args: {
  conversationId: string;
  runId: string;
  messages: ChatMessage[];
}): ResumeRequest {
  return {
    conversationId: args.conversationId,
    runId: args.runId,
    trigger: 'submit-tool-result',
    messages: args.messages,
  };
}
```

```tsx
// packages/chat-protocol-frontend/src/render/ProtocolMessageRenderer.tsx
import type { ChatMessage } from 'chat-protocol-contract';
import React from 'react';

export function ProtocolMessageRenderer({ message }: { message: ChatMessage }): JSX.Element {
  return (
    <div data-testid={`message-${message.id}`}>
      {message.parts.map((part, index) => {
        if (part.type === 'text') return <p key={index}>{part.text}</p>;
        if (part.type === 'reasoning-summary') return <div key={index}>Thinking: {part.text}</div>;
        if (part.type === 'card') return <div key={index}>{part.cardType}</div>;
        if (part.type === 'tool-call') return <div key={index}>{part.toolName}</div>;
        if (part.type === 'action') return <div key={index}>{part.title}</div>;
        return <div key={index}>{part.type}</div>;
      })}
    </div>
  );
}
```

- [ ] **Step 6: Run tests to verify the frontend package passes**

Run: `npm --workspace packages/chat-protocol-frontend test`

Expected: PASS with 2 passing tests.

- [ ] **Step 7: Commit the frontend package**

```bash
git add packages/chat-protocol-frontend
git commit -m "feat: add standalone chat protocol frontend runtime"
```

### Task 3: Build the demo server with deterministic SSE scenarios

**Files:**

- Create: `apps/chat-protocol-demo-server/package.json`
- Create: `apps/chat-protocol-demo-server/tsconfig.json`
- Create: `apps/chat-protocol-demo-server/src/server.ts`
- Create: `apps/chat-protocol-demo-server/src/scenarios/weatherBasic.ts`
- Create: `apps/chat-protocol-demo-server/src/scenarios/weatherFrontendLocation.ts`
- Create: `apps/chat-protocol-demo-server/src/scenarios/approvalRequired.ts`
- Create: `apps/chat-protocol-demo-server/src/scenarios/failureRecovery.ts`
- Test: `apps/chat-protocol-demo-server/test/scenario.test.ts`

- [ ] **Step 1: Write the failing demo server scenario test**

```ts
import { describe, expect, it } from 'vitest';
import { createWeatherFrontendLocationFrames } from '../src/scenarios/weatherFrontendLocation';

describe('chat protocol demo server scenarios', () => {
  it('emits a tool-calls finish reason for the frontend location scenario', () => {
    const frames = createWeatherFrontendLocationFrames();
    expect(frames.at(-1)?.type).toBe('finish');
    expect(frames.at(-1)?.payload?.finishReason).toBe('tool-calls');
  });
});
```

- [ ] **Step 2: Run the scenario test to verify it fails**

Run: `npm --workspace apps/chat-protocol-demo-server test`

Expected: FAIL with missing scenario implementation.

- [ ] **Step 3: Create the demo server package manifest**

```json
{
  "name": "@fm/chat-protocol-demo-server",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc -p tsconfig.json",
    "test": "vitest run",
    "lint": "eslint ."
  },
  "dependencies": {
    "chat-protocol-contract": "*",
    "cors": "^2.8.5",
    "express": "^4.21.2"
  },
  "devDependencies": {
    "@types/express": "^5.0.3",
    "@types/node": "^25.0.3",
    "tsx": "^4.20.6",
    "typescript": "^5.9.3",
    "vitest": "^4.0.16"
  }
}
```

- [ ] **Step 4: Implement deterministic weather and approval scenarios**

```ts
// apps/chat-protocol-demo-server/src/scenarios/weatherFrontendLocation.ts
import type { ChatStreamFrame } from 'chat-protocol-contract';

export function createWeatherFrontendLocationFrames(): ChatStreamFrame[] {
  return [
    { type: 'start', runId: 'run_weather_frontend', conversationId: 'conv_weather_frontend' },
    {
      type: 'message-start',
      runId: 'run_weather_frontend',
      conversationId: 'conv_weather_frontend',
      messageId: 'msg_asst_weather_frontend',
    },
    {
      type: 'reasoning-summary',
      runId: 'run_weather_frontend',
      conversationId: 'conv_weather_frontend',
      messageId: 'msg_asst_weather_frontend',
      payload: { text: 'I need the date first, then the location, then the weather.' },
    },
    {
      type: 'tool-input-available',
      runId: 'run_weather_frontend',
      conversationId: 'conv_weather_frontend',
      messageId: 'msg_asst_weather_frontend',
      payload: {
        toolCallId: 'tc_frontend_location',
        toolName: 'location.resolve',
        executionTarget: 'frontend',
        input: { query: 'Beijing' },
      },
    },
    {
      type: 'finish',
      runId: 'run_weather_frontend',
      conversationId: 'conv_weather_frontend',
      messageId: 'msg_asst_weather_frontend',
      payload: { finishReason: 'tool-calls' },
    },
  ];
}
```

```ts
// apps/chat-protocol-demo-server/src/scenarios/approvalRequired.ts
import type { ChatStreamFrame } from 'chat-protocol-contract';

export function createApprovalRequiredFrames(): ChatStreamFrame[] {
  return [
    { type: 'start', runId: 'run_approval', conversationId: 'conv_approval' },
    {
      type: 'message-start',
      runId: 'run_approval',
      conversationId: 'conv_approval',
      messageId: 'msg_asst_approval',
    },
    {
      type: 'action-required',
      runId: 'run_approval',
      conversationId: 'conv_approval',
      messageId: 'msg_asst_approval',
      payload: {
        actionId: 'act_approve_trade',
        title: 'Approve tool execution',
        description: 'This tool performs a side-effecting action.',
      },
    },
    {
      type: 'finish',
      runId: 'run_approval',
      conversationId: 'conv_approval',
      messageId: 'msg_asst_approval',
      payload: { finishReason: 'action-required' },
    },
  ];
}
```

- [ ] **Step 5: Implement the SSE server endpoints**

```ts
// apps/chat-protocol-demo-server/src/server.ts
import express from 'express';
import cors from 'cors';
import { createWeatherFrontendLocationFrames } from './scenarios/weatherFrontendLocation';
import { createApprovalRequiredFrames } from './scenarios/approvalRequired';

const app = express();
app.use(cors());
app.use(express.json());

function writeFrame(res: express.Response, frame: unknown) {
  res.write(`data: ${JSON.stringify(frame)}\n\n`);
}

app.post('/api/chat/runs', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const scenario = req.query.scenario ?? 'weather-frontend-location';
  const frames =
    scenario === 'approval-required'
      ? createApprovalRequiredFrames()
      : createWeatherFrontendLocationFrames();

  frames.forEach((frame) => writeFrame(res, frame));
  res.end();
});

app.post('/api/chat/runs/:runId/actions/:actionId', (_req, res) => {
  res.json({ ok: true });
});

app.listen(4111, () => {
  console.log('chat protocol demo server listening on http://localhost:4111');
});
```

- [ ] **Step 6: Run tests to verify the demo server passes**

Run: `npm --workspace apps/chat-protocol-demo-server test`

Expected: PASS with 1 passing test.

- [ ] **Step 7: Manually run the demo server**

Run: `npm --workspace apps/chat-protocol-demo-server run dev`

Expected: `chat protocol demo server listening on http://localhost:4111`

- [ ] **Step 8: Commit the demo server**

```bash
git add apps/chat-protocol-demo-server
git commit -m "feat: add deterministic chat protocol demo server"
```

### Task 4: Build the minimal demo web app

**Files:**

- Create: `apps/chat-protocol-demo-web/package.json`
- Create: `apps/chat-protocol-demo-web/tsconfig.json`
- Create: `apps/chat-protocol-demo-web/vite.config.ts`
- Create: `apps/chat-protocol-demo-web/index.html`
- Create: `apps/chat-protocol-demo-web/src/main.tsx`
- Create: `apps/chat-protocol-demo-web/src/App.tsx`
- Create: `apps/chat-protocol-demo-web/src/cards/WeatherSummaryCard.tsx`
- Create: `apps/chat-protocol-demo-web/src/cards/ApprovalCard.tsx`
- Create: `apps/chat-protocol-demo-web/src/tools/locationResolveTool.ts`
- Test: `apps/chat-protocol-demo-web/src/App.test.tsx`

- [ ] **Step 1: Write the failing demo web test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('chat protocol demo web', () => {
  it('renders the protocol demo heading', () => {
    render(<App />);
    expect(screen.getByText('Chat Protocol Demo')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the web app test to verify it fails**

Run: `npm --workspace apps/chat-protocol-demo-web test`

Expected: FAIL with missing app files or missing heading.

- [ ] **Step 3: Create the demo web package manifest**

```json
{
  "name": "@fm/chat-protocol-demo-web",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run",
    "lint": "eslint ."
  },
  "dependencies": {
    "@assistant-ui/react": "^0.12.19",
    "chat-protocol-contract": "*",
    "@fm/chat-protocol-frontend": "*",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/react": "^16.3.1",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^5.1.2",
    "happy-dom": "^20.5.0",
    "typescript": "^5.9.3",
    "vite": "^7.3.0",
    "vitest": "^4.0.16"
  }
}
```

- [ ] **Step 4: Implement the minimal app shell and cards**

```tsx
// apps/chat-protocol-demo-web/src/App.tsx
import React from 'react';

export default function App(): JSX.Element {
  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Chat Protocol Demo</h1>
      <p>
        Use this app to verify structured chat protocol streaming, tool pauses, cards, and
        approvals.
      </p>
      <button type="button">Run Weather Frontend Tool Scenario</button>
      <button type="button">Run Approval Scenario</button>
      <section aria-label="thread-output" />
    </main>
  );
}
```

```tsx
// apps/chat-protocol-demo-web/src/cards/WeatherSummaryCard.tsx
import React from 'react';

export function WeatherSummaryCard(props: {
  location: string;
  date: string;
  condition: string;
  high: number;
  low: number;
}): JSX.Element {
  return (
    <article>
      <h2>{props.location}</h2>
      <p>{props.date}</p>
      <p>{props.condition}</p>
      <p>
        High {props.high} / Low {props.low}
      </p>
    </article>
  );
}
```

- [ ] **Step 5: Wire the app to the demo server and frontend package**

```tsx
// apps/chat-protocol-demo-web/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

Add a small fetch helper in `App.tsx`:

```tsx
async function runScenario(scenario: 'weather-frontend-location' | 'approval-required') {
  const response = await fetch(`http://localhost:4111/api/chat/runs?scenario=${scenario}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      trigger: 'submit-message',
      messages: [
        {
          id: 'msg_user_demo',
          role: 'user',
          parts: [{ type: 'text', text: 'demo message' }],
        },
      ],
    }),
  });

  return response;
}
```

- [ ] **Step 6: Run tests to verify the demo web app passes**

Run: `npm --workspace apps/chat-protocol-demo-web test`

Expected: PASS with 1 passing test.

- [ ] **Step 7: Manually run the demo web app**

Run: `npm --workspace apps/chat-protocol-demo-web run dev`

Expected: Vite dev server starts and shows the `Chat Protocol Demo` heading at the provided localhost URL.

- [ ] **Step 8: Commit the demo web app**

```bash
git add apps/chat-protocol-demo-web
git commit -m "feat: add standalone chat protocol demo web app"
```

### Task 5: Build the backend adapter package boundary

**Files:**

- Create: `packages/chat-protocol-backend/package.json`
- Create: `packages/chat-protocol-backend/README.md`
- Create: `packages/chat-protocol-backend/src/index.ts`
- Create: `packages/chat-protocol-backend/src/ProtocolFrameEmitter.ts`
- Create: `packages/chat-protocol-backend/src/ProtocolResumeService.ts`
- Create: `packages/chat-protocol-backend/src/ProtocolScenarioBridge.ts`
- Test: `packages/chat-protocol-backend/test/emitter.test.ts`

- [ ] **Step 1: Write the failing backend adapter test**

```ts
import { describe, expect, it } from 'vitest';
import { ProtocolFrameEmitter } from '../src/ProtocolFrameEmitter';

describe('chat protocol backend emitter', () => {
  it('builds a finish frame with a finish reason', () => {
    const emitter = new ProtocolFrameEmitter('run_1', 'conv_1');
    const frame = emitter.finish('tool-calls', 'msg_asst_1');
    expect(frame.payload?.finishReason).toBe('tool-calls');
  });
});
```

- [ ] **Step 2: Run the backend adapter test to verify it fails**

Run: `npm --workspace packages/chat-protocol-backend test`

Expected: FAIL with missing emitter class.

- [ ] **Step 3: Implement the package boundary and emitter**

```ts
// packages/chat-protocol-backend/src/ProtocolFrameEmitter.ts
import type { ChatFinishReason, ChatStreamFrame } from 'chat-protocol-contract';

export class ProtocolFrameEmitter {
  constructor(
    private readonly runId: string,
    private readonly conversationId: string,
  ) {}

  start(): ChatStreamFrame {
    return { type: 'start', runId: this.runId, conversationId: this.conversationId };
  }

  finish(finishReason: ChatFinishReason, messageId?: string): ChatStreamFrame {
    return {
      type: 'finish',
      runId: this.runId,
      conversationId: this.conversationId,
      ...(messageId ? { messageId } : {}),
      payload: { finishReason },
    };
  }
}
```

```ts
// packages/chat-protocol-backend/src/index.ts
export * from './ProtocolFrameEmitter';
```

- [ ] **Step 4: Run tests to verify the backend adapter package passes**

Run: `npm --workspace packages/chat-protocol-backend test`

Expected: PASS with 1 passing test.

- [ ] **Step 5: Commit the backend adapter package**

```bash
git add packages/chat-protocol-backend
git commit -m "feat: add standalone chat protocol backend adapter boundary"
```

### Task 6: Verify the isolated stack end to end and document usage

**Files:**

- Modify: `docs/superpowers/specs/2026-04-14-chat-protocol-design.md`
- Create: `apps/chat-protocol-demo-web/README.md`
- Create: `apps/chat-protocol-demo-server/README.md`

- [ ] **Step 1: Add explicit demo run instructions**

````md
# Chat Protocol Demo Web

## Run

```bash
npm --workspace apps/chat-protocol-demo-server run dev
npm --workspace apps/chat-protocol-demo-web run dev
```
````

## Verify

1. Open the demo web URL.
2. Run the weather frontend-tool scenario.
3. Verify the assistant shows reasoning, tool pause, and final card output.
4. Run the approval scenario.
5. Verify the assistant pauses for approve/reject and resumes after a decision.

```

```

- [ ] **Step 2: Run the focused package and app test suite**

Run:

```bash
npm --workspace packages/chat-protocol-contract test
npm --workspace packages/chat-protocol-frontend test
npm --workspace packages/chat-protocol-backend test
npm --workspace apps/chat-protocol-demo-server test
npm --workspace apps/chat-protocol-demo-web test
```

Expected: all five commands PASS.

- [ ] **Step 3: Run the isolated demo manually**

Run:

```bash
npm --workspace apps/chat-protocol-demo-server run dev
npm --workspace apps/chat-protocol-demo-web run dev
```

Expected:

- server prints a localhost URL on port `4111`
- web app prints a localhost Vite URL
- weather scenario visibly pauses on frontend tool flow
- approval scenario visibly pauses on approve/reject flow

- [ ] **Step 4: Commit the verification and README updates**

```bash
git add apps/chat-protocol-demo-web/README.md apps/chat-protocol-demo-server/README.md docs/superpowers/specs/2026-04-14-chat-protocol-design.md
git commit -m "docs: add chat protocol demo verification guide"
```

### Task 7: Add isolated Playwright E2E coverage for the demo protocol flow

**Files:**

- Create: `tests/e2e/chat-protocol-demo.spec.ts`
- Modify: `playwright.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Write the failing Playwright spec for the demo**

```ts
import { expect, test } from '@playwright/test';

test.describe('chat protocol demo', () => {
  test('completes the weather frontend tool scenario', async ({ page }) => {
    await page.goto('http://127.0.0.1:4173');

    await page.getByRole('button', { name: 'Run Weather Frontend Tool Scenario' }).click();

    await expect(page.getByText('Thinking:')).toBeVisible();
    await expect(page.getByText('location.resolve')).toBeVisible();
    await expect(page.getByText('weather-summary')).toBeVisible();
  });

  test('pauses for approval in the approval scenario', async ({ page }) => {
    await page.goto('http://127.0.0.1:4173');

    await page.getByRole('button', { name: 'Run Approval Scenario' }).click();

    await expect(page.getByText('Approve tool execution')).toBeVisible();
  });
});
```

- [ ] **Step 2: Run the Playwright spec to verify it fails**

Run: `npx playwright test tests/e2e/chat-protocol-demo.spec.ts --project=chromium`

Expected: FAIL because the demo web app and controls are not implemented yet.

- [ ] **Step 3: Add an isolated Playwright project for the protocol demo**

Update `playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:8001',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
    {
      name: 'chat-protocol-demo',
      use: {
        browserName: 'chromium',
        baseURL: 'http://127.0.0.1:4173',
      },
      testMatch: /chat-protocol-demo\.spec\.ts/,
    },
  ],
});
```

- [ ] **Step 4: Add a root helper script for the isolated E2E run**

Update `package.json` scripts:

```json
{
  "scripts": {
    "test:e2e:chat-protocol": "playwright test tests/e2e/chat-protocol-demo.spec.ts --project=chat-protocol-demo"
  }
}
```

- [ ] **Step 5: Make the demo apps E2E-friendly**

Ensure the demo implementation from Tasks 3 and 4 exposes stable selectors/text:

```tsx
// apps/chat-protocol-demo-web/src/App.tsx
<button type="button">Run Weather Frontend Tool Scenario</button>
<button type="button">Run Approval Scenario</button>
<section aria-label="thread-output" />
```

And ensure the rendered protocol content includes:

- visible `Thinking:` reasoning summary text
- visible `location.resolve` tool label
- visible `weather-summary` card marker or weather card heading
- visible `Approve tool execution` action title

- [ ] **Step 6: Run the isolated Playwright scenario**

Run these in separate terminals:

```bash
npm --workspace apps/chat-protocol-demo-server run dev
npm --workspace apps/chat-protocol-demo-web run dev -- --host 127.0.0.1 --port 4173
```

Then run:

```bash
npm run test:e2e:chat-protocol
```

Expected: PASS with 2 passing tests in the `chat-protocol-demo` Playwright project.

- [ ] **Step 7: Commit the E2E coverage**

```bash
git add tests/e2e/chat-protocol-demo.spec.ts playwright.config.ts package.json
git commit -m "test: add chat protocol demo e2e coverage"
```

## Self-Review

### Spec coverage

- standalone contract package: covered in Task 1
- standalone frontend runtime package: covered in Task 2
- standalone backend adapter package: covered in Task 5
- minimal demo server: covered in Task 3
- minimal demo web app: covered in Task 4
- verification without production noise: covered in Task 6
- isolated end-to-end browser verification: covered in Task 7

### Placeholder scan

- no `TODO`, `TBD`, or deferred implementation markers remain
- every task names exact files
- every code-bearing step includes concrete code snippets
- every verification step includes exact commands and expected results

### Type consistency

- request trigger values are consistent across tasks:
  - `submit-message`
  - `submit-tool-result`
  - `submit-action`
- finish reasons are consistent across tasks:
  - `stop`
  - `tool-calls`
  - `action-required`
  - `error`
- assistant part names are consistent with the design doc:
  - `text`
  - `reasoning-summary`
  - `tool-call`
  - `card`
  - `action`
