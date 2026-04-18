# Unified Tool Execution Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate from dual-path frontend tool execution (`resolveFrontendTool` + toolkit `execute`) to a unified approach using only toolkit `execute`.

**Architecture:** Create a `ToolkitBridge` interface that allows the chat-protocol runtime to delegate frontend tool execution to the app-layer toolkit. This eliminates the need for `resolveFrontendTool` while maintaining the protocol's ability to pause/resume streaming runs.

**Tech Stack:** TypeScript, React, @assistant-ui/react, @fm/chat-protocol-runtime, @fm/chat-protocol-ui

---

## File Structure

### New Files

- `packages/chat-protocol-runtime/src/runtime/toolkitBridge.ts` - ToolkitBridge interface definition
- `apps/chat-protocol-demo-web/src/lib/toolkitBridge.ts` - App-specific bridge implementation

### Modified Files

- `packages/chat-protocol-runtime/src/runtime/client.ts` - Add toolkitBridge support, deprecate resolveFrontendTool
- `packages/chat-protocol-runtime/src/index.ts` - Export new types
- `packages/chat-protocol-ui/src/provider.tsx` - Accept and pass toolkitBridge
- `apps/chat-protocol-demo-web/src/App.tsx` - Use toolkitBridge instead of resolveFrontendTool

---

## Task 1: Create ToolkitBridge Interface

**Files:**

- Create: `packages/chat-protocol-runtime/src/runtime/toolkitBridge.ts`
- Modify: `packages/chat-protocol-runtime/src/index.ts`

- [ ] **Step 1: Write the ToolkitBridge interface**

````typescript
/**
 * ToolkitBridge provides a bridge between the chat-protocol runtime
 * and the application-layer toolkit for unified frontend tool execution.
 *
 * @example
 * ```typescript
 * const bridge: ToolkitBridge = {
 *   executeTool: async (toolName, input) => {
 *     const tool = toolkit[toolName];
 *     return tool.execute(input);
 *   },
 *   hasFrontendTool: (toolName) => toolkit[toolName]?.type === 'frontend',
 * };
 * ```
 */
export interface ToolkitBridge {
  /**
   * Execute a frontend tool by name with the given input.
   * This delegates to the toolkit's execute function.
   *
   * @param toolName - The name of the tool to execute
   * @param input - The input parameters for the tool
   * @returns The tool execution result as a Record
   * @throws Error if the tool is not found or execution fails
   */
  executeTool(toolName: string, input: unknown): Promise<Record<string, unknown>>;

  /**
   * Check if a tool exists in the toolkit and is a frontend tool.
   * Used to determine if a tool call should be handled by the bridge.
   *
   * @param toolName - The name of the tool to check
   * @returns True if the tool exists and is a frontend tool
   */
  hasFrontendTool(toolName: string): boolean;
}

/**
 * Helper type guard to check if a value is a ToolkitBridge.
 */
export function isToolkitBridge(value: unknown): value is ToolkitBridge {
  return (
    typeof value === 'object' &&
    value !== null &&
    'executeTool' in value &&
    typeof (value as ToolkitBridge).executeTool === 'function' &&
    'hasFrontendTool' in value &&
    typeof (value as ToolkitBridge).hasFrontendTool === 'function'
  );
}
````

- [ ] **Step 2: Export from index.ts**

Modify `packages/chat-protocol-runtime/src/index.ts`:

```typescript
// Add to existing exports
export { type ToolkitBridge, isToolkitBridge } from './runtime/toolkitBridge';
```

- [ ] **Step 3: Run type check to ensure no errors**

```bash
cd packages/chat-protocol-runtime && npm run typecheck
```

Expected: No TypeScript errors

- [ ] **Step 4: Commit**

```bash
git add packages/chat-protocol-runtime/src/runtime/toolkitBridge.ts

git add packages/chat-protocol-runtime/src/index.ts
git commit -m "feat(runtime): add ToolkitBridge interface for unified tool execution

- Create ToolkitBridge interface with executeTool and hasFrontendTool
- Add isToolkitBridge type guard
- Export from main index

Refs: #unified-tool-execution"
```

---

## Task 2: Update streamProtocolRun to Support ToolkitBridge

**Files:**

- Modify: `packages/chat-protocol-runtime/src/runtime/client.ts`

- [ ] **Step 1: Update StreamProtocolRunOptions type**

Find the `StreamProtocolRunOptions` type definition (around line 42-51) and modify it:

````typescript
export type StreamProtocolRunOptions = {
  request: ChatRunRequest;
  url: string;
  fetch?: typeof globalThis.fetch;
  onFrame?: (frame: ChatStreamFrame) => void;

/**
    * @deprecated Use toolkitBridge instead for unified tool execution.
    * This will be removed in v3.0.0.
    * @see packages/chat-protocol-runtime/README.md
    */
  resolveFrontendTool?: (
    toolCall: ChatToolCallPart,
    request: ChatRunRequest,
  ) => Promise<Record<string, unknown>> | Record<string, unknown>;

  /**
   * Toolkit bridge for unified frontend tool execution.
   * This allows the protocol to execute tools using the app's toolkit,
   * eliminating the need for a separate resolveFrontendTool callback.
   *
   * @example
   * ```typescript
   * const toolkitBridge = createToolkitBridge(toolkit);
   * yield* streamProtocolRun({ request, url, toolkitBridge });
   * ```
   */
  toolkitBridge?: ToolkitBridge;
};
````

- [ ] **Step 2: Add import for ToolkitBridge**

At the top of the file, add to existing imports:

```typescript
import type { ToolkitBridge } from './toolkitBridge';
```

- [ ] **Step 3: Update streamProtocolRun function signature**

Find the `streamProtocolRun` function definition (around line 396) and update it:

```typescript
export async function* streamProtocolRun({
  request,
  url,
  fetch = globalThis.fetch,
  onFrame,
  resolveFrontendTool,  // DEPRECATED
  toolkitBridge,  // NEW
}: StreamProtocolRunOptions): AsyncGenerator<ChatStreamFrame, void> {
  // ... rest of function
```

- [ ] **Step 4: Add deprecation warning**

At the beginning of the function (after the fetch check), add:

```typescript
// Deprecation warning for resolveFrontendTool
if (resolveFrontendTool && !toolkitBridge) {
  console.warn(
    '[@fm/chat-protocol-runtime] Deprecation Warning: ' +
      'resolveFrontendTool is deprecated and will be removed in v3.0.0. ' +
      'Use toolkitBridge for unified tool execution. ' +
      'See migration guide in chat-protocol-runtime/README.md',
  );
}
```

- [ ] **Step 5: Update frontend tool execution logic**

Find the section where `resolveFrontendTool` is called (around line 443-449) and update it to support both mechanisms:

```typescript
if (finishReason !== 'tool-calls') {
  break;
}

const assistantMessage = adapter.getMessage();
const pendingFrontendTool = findPendingToolBySource(assistantMessage.content, 'frontend');

if (!pendingFrontendTool) {
  break;
}

let output: Record<string, unknown>;

// NEW: Prefer toolkitBridge over resolveFrontendTool
if (toolkitBridge) {
  try {
    output = await toolkitBridge.executeTool(
      pendingFrontendTool.toolName,
      pendingFrontendTool.input
    );
  } catch (error) {
    // Yield error frame and break
    yield {
      type: 'tool-output-error',
      toolCallId: pendingFrontendTool.toolCallId,
      error: error instanceof Error ? error.message : String(error),
      source: 'frontend',
    } as ChatStreamFrame;
    break;
  }
}
// DEPRECATED: Fallback to resolveFrontendTool
else if (resolveFrontendTool) {
  output = await resolveFrontendTool(pendingFrontendTool, nextRequest);
}
else {
  // Neither mechanism available - error
  throw new Error(
    'Frontend tool detected but no execution mechanism available. ' +
    'Provide either toolkitBridge (recommended) or resolveFrontendTool (deprecated).'
  );
}

// Continue with existing logic to create resolvedTool, yield frames, etc.
const resolvedTool: ChatToolCallPart = {
  ...pendingFrontendTool,
  state: 'output-available',
  output,
};

// ... rest of existing logic
```

- [ ] **Step 6: Run type check and tests**

```bash
cd packages/chat-protocol-runtime && npm run typecheck
npm run test
```

Expected: All type checks pass, existing tests may need updates

- [ ] **Step 7: Commit**

```bash
git add packages/chat-protocol-runtime/src/runtime/client.ts
git commit -m "feat(runtime): add toolkitBridge support to streamProtocolRun

- Add ToolkitBridge parameter to StreamProtocolRunOptions
- Add deprecation warning for resolveFrontendTool
- Update frontend tool execution to prefer toolkitBridge
- Maintain backward compatibility with resolveFrontendTool

Refs: #unified-tool-execution"
```

---

## Task 3: Create App-Layer Toolkit Bridge Implementation

**Files:**

- Create: `apps/chat-protocol-demo-web/src/lib/toolkitBridge.ts`

- [ ] **Step 1: Create the toolkit bridge implementation**

> **Note:** Before implementing, verify the `Toolkit` type exists in `@fm/chat-protocol-ui` by checking the package exports. If it doesn't exist, use a generic `Record<string, unknown>` type and adjust accordingly.

```typescript
/**
 * Application-layer ToolkitBridge implementation.
 *
 * This bridge connects the chat-protocol runtime to the app's assistant-ui toolkit,
 * allowing the protocol to execute frontend tools through the toolkit's execute functions.
 *
 * @example
 * ```typescript
 * import { createToolkitBridge } from '@/lib/toolkitBridge';
 * import { toolkit } from '@/components/toolkit/tools';
 *
 * const toolkitBridge = createToolkitBridge(toolkit);
 *
 * <ChatProtocolProvider
 *   toolkitBridge={toolkitBridge}
 * >
 * ```
 */

import type { ToolkitBridge } from '@fm/chat-protocol-runtime';

/**
 * Error thrown when a tool is not found or cannot be executed.
 */
export class ToolkitBridgeError extends Error {
  constructor(
    message: string,
    public readonly toolName: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'ToolkitBridgeError';
  }
}

/**
 * Creates a ToolkitBridge that wraps an assistant-ui toolkit.
 *
 * @param toolkit - The assistant-ui toolkit containing frontend tool definitions
 * @returns A ToolkitBridge implementation
 * @throws ToolkitBridgeError if toolkit is invalid
 */
export function createToolkitBridge(
  toolkit: Record<string, unknown>,
): ToolkitBridge {
  if (!toolkit || typeof toolkit !== 'object') {
    throw new ToolkitBridgeError('Invalid toolkit: expected object', 'unknown');
  }

  const entries = Object.entries(toolkit);
  if (entries.length === 0) {
    throw new ToolkitBridgeError('Invalid toolkit: empty object', 'unknown');
  }

  return {
    executeTool: async (toolName: string, input: unknown): Promise<Record<string, unknown>> => {
      const tool = toolkit[toolName];

      if (!tool) {
        throw new ToolkitBridgeError(`Tool "${toolName}" not found in toolkit`, toolName);
      }

      if (tool.type !== 'frontend') {
        throw new ToolkitBridgeError(
          `Tool "${toolName}" is not a frontend tool (type: ${tool.type})`,
          toolName,
        );
      }

      if (!tool.execute) {
        throw new ToolkitBridgeError(
          `Tool "${toolName}" does not have an execute function`,
          toolName,
        );
      }

      try {
        const result = await tool.execute(input);
        return result as Record<string, unknown>;
      } catch (error) {
        throw new ToolkitBridgeError(
          `Tool "${toolName}" execution failed: ${error instanceof Error ? error.message : String(error)}`,
          toolName,
          error instanceof Error ? error : undefined,
        );
      }
    },

    hasFrontendTool: (toolName: string): boolean => {
      const tool = toolkit[toolName];
      return tool?.type === 'frontend' && typeof tool.execute === 'function';
    },
  };
}

/**
 * Creates a ToolkitBridge with logging for debugging purposes.
 *
 * @param toolkit - The assistant-ui toolkit
 * @param options - Logging options
 * @returns A ToolkitBridge with logging
 */
export function createLoggingToolkitBridge(
  toolkit: Record<string, unknown>,
  options: {
    logPrefix?: string;
    logInput?: boolean;
    logOutput?: boolean;
    logErrors?: boolean;
  } = {},
): ToolkitBridge & { getExecutionLog(): string[] } {
  const {
    logPrefix = '[ToolkitBridge]',
    logInput = true,
    logOutput = true,
    logErrors = true,
  } = options;

  const executionLog: string[] = [];

  const log = (message: string) => {
    const entry = `${logPrefix} ${message}`;
    executionLog.push(entry);
    // eslint-disable-next-line no-console
    console.log(entry);
  };

  const baseBridge = createToolkitBridge(toolkit);

  return {
    executeTool: async (toolName: string, input: unknown) => {
      const startTime = Date.now();

      if (logInput) {
        log(`Executing tool "${toolName}" with input: ${JSON.stringify(input)}`);
      }

      try {
        const result = await baseBridge.executeTool(toolName, input);
        const duration = Date.now() - startTime;

        if (logOutput) {
          log(
            `Tool "${toolName}" completed in ${duration}ms with result: ${JSON.stringify(result)}`,
          );
        }

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        if (logErrors) {
          log(
            `Tool "${toolName}" failed after ${duration}ms: ${error instanceof Error ? error.message : String(error)}`,
          );
        }

        throw error;
      }
    },

    hasFrontendTool: baseBridge.hasFrontendTool,

    getExecutionLog: () => [...executionLog],
  };
}
````

- [ ] **Step 2: Write unit tests for the bridge**

> **Note:** In tests, the `parameters` field type depends on the tool's Zod schema. Use `z.input<typeof tool.parameters>` or `object` as appropriate for your test tools.

```typescript
// Test file: apps/chat-protocol-demo-web/src/lib/__tests__/toolkitBridge.test.ts
import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import {
  createToolkitBridge,
  createLoggingToolkitBridge,
  ToolkitBridgeError,
} from '../toolkitBridge';

const testToolSchema = z.object({ input: z.string() });

describe('createToolkitBridge', () => {
  const mockToolkit = {
    testTool: {
      type: 'frontend',
      description: 'A test tool',
      parameters: testToolSchema,
      execute: vi.fn().mockResolvedValue({ result: 'success' }),
    },
    backendTool: {
      type: 'backend',
      description: 'A backend tool',
      parameters: testToolSchema,
    },
    noExecuteTool: {
      type: 'frontend',
      description: 'Tool without execute',
      parameters: testToolSchema,
    },
  };

  it('should execute a frontend tool successfully', async () => {
    const bridge = createToolkitBridge(mockToolkit);
    const result = await bridge.executeTool('testTool', { input: 'test' });

    expect(result).toEqual({ result: 'success' });
    expect(mockToolkit.testTool.execute).toHaveBeenCalledWith({ input: 'test' });
  });

  it('should throw ToolkitBridgeError for non-existent tool', async () => {
    const bridge = createToolkitBridge(mockToolkit);

    await expect(bridge.executeTool('nonExistent', {})).rejects.toThrow(ToolkitBridgeError);
    await expect(bridge.executeTool('nonExistent', {})).rejects.toThrow(
      'Tool "nonExistent" not found in toolkit',
    );
  });

  it('should throw ToolkitBridgeError for non-frontend tool', async () => {
    const bridge = createToolkitBridge(mockToolkit);

    await expect(bridge.executeTool('backendTool', {})).rejects.toThrow(ToolkitBridgeError);
    await expect(bridge.executeTool('backendTool', {})).rejects.toThrow(
      'Tool "backendTool" is not a frontend tool',
    );
  });

  it('should throw ToolkitBridgeError for tool without execute', async () => {
    const bridge = createToolkitBridge(mockToolkit);

    await expect(bridge.executeTool('noExecuteTool', {})).rejects.toThrow(ToolkitBridgeError);
  });

  it('should return true for frontend tools with execute', () => {
    const bridge = createToolkitBridge(mockToolkit);

    expect(bridge.hasFrontendTool('testTool')).toBe(true);
    expect(bridge.hasFrontendTool('backendTool')).toBe(false);
    expect(bridge.hasFrontendTool('noExecuteTool')).toBe(false);
    expect(bridge.hasFrontendTool('nonExistent')).toBe(false);
  });

  it('should throw for invalid toolkit', () => {
    expect(() => createToolkitBridge(null as unknown as Record<string, unknown>)).toThrow(ToolkitBridgeError);
    expect(() => createToolkitBridge({} as unknown as Record<string, unknown>)).toThrow(ToolkitBridgeError);
  });
});

describe('createLoggingToolkitBridge', () => {
  const mockToolkit = {
    testTool: {
      type: 'frontend',
      description: 'A test tool',
      parameters: testToolSchema,
      execute: vi.fn().mockResolvedValue({ result: 'success' }),
    },
    errorTool: {
      type: 'frontend',
      description: 'A tool that errors',
      parameters: testToolSchema,
      execute: vi.fn().mockRejectedValue(new Error('Tool execution failed')),
    },
  };

  it('should log successful executions', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const bridge = createLoggingToolkitBridge(mockToolkit, {
      logPrefix: '[TEST]',
    });

    await bridge.executeTool('testTool', { input: 'test' });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[TEST] Executing tool "testTool"'),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[TEST] Tool "testTool" completed'),
    );

    consoleSpy.mockRestore();
  });

  it('should log errors', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const bridge = createLoggingToolkitBridge(mockToolkit, {
      logPrefix: '[TEST]',
    });

    await expect(bridge.executeTool('errorTool', {})).rejects.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[TEST] Tool "errorTool" failed'),
    );

    consoleSpy.mockRestore();
  });

  it('should provide execution log', async () => {
    const bridge = createLoggingToolkitBridge(mockToolkit);

    await bridge.executeTool('testTool', {});

    const log = bridge.getExecutionLog();
    expect(log.length).toBeGreaterThan(0);
    expect(log[0]).toContain('Executing tool');
  });

  it('should respect logging options', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const bridge = createLoggingToolkitBridge(mockToolkit, {
      logInput: false,
      logOutput: false,
      logErrors: false,
    });

    await bridge.executeTool('testTool', { secret: 'value' });

    // Should only log minimal information
    expect(consoleSpy).toHaveBeenCalledTimes(2); // Start and end only

    consoleSpy.mockRestore();
  });

  it('should delegate hasFrontendTool to base bridge', () => {
    const bridge = createLoggingToolkitBridge(mockToolkit);

    expect(bridge.hasFrontendTool('testTool')).toBe(true);
    expect(bridge.hasFrontendTool('nonExistent')).toBe(false);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail (TDD)**

```bash
cd apps/chat-protocol-demo-web && npm test -- src/lib/__tests__/toolkitBridge.test.ts
```

Expected: Tests fail because the implementation doesn't exist yet

- [ ] **Step 4: Commit test file**

```bash
git add apps/chat-protocol-demo-web/src/lib/__tests__/toolkitBridge.test.ts
git commit -m "test(bridge): add unit tests for ToolkitBridge

- Test createToolkitBridge with various scenarios
- Test error handling and edge cases
- Test createLoggingToolkitBridge with logging options
- All tests initially failing (TDD approach)

Refs: #unified-tool-execution"
```

---

## Task 4: Update ChatProtocolProvider to Accept ToolkitBridge

**Files:**

- Modify: `packages/chat-protocol-ui/src/provider.tsx`

- [ ] **Step 1: Add ToolkitBridge to imports**

At the top of `packages/chat-protocol-ui/src/provider.tsx`, add to existing imports:

```typescript
import type { ToolkitBridge } from '@fm/chat-protocol-runtime';
```

- [ ] **Step 2: Update ChatProtocolProviderProps type**

Find the `ChatProtocolProviderProps` type definition and add the new prop:

````typescript
export type ChatProtocolProviderProps = {
  apiUrl: string;
  toolkit: Toolkit;
  tools?: ChatToolDescriptor[];
  context?: ChatRunRequest['context'];
  metadata?: ChatRunRequest['metadata'];
  fetch?: typeof globalThis.fetch;
  onFrame?: (frame: import('@fm/chat-protocol-contract').ChatStreamFrame) => void;

  /**
   * @deprecated Use toolkitBridge instead for unified tool execution.
   * This will be removed in v3.0.0.
   */
  resolveFrontendTool?: (
    toolCall: ChatToolCallPart,
    request: ChatRunRequest,
  ) => Promise<Record<string, unknown>> | Record<string, unknown>;

  /**
   * Toolkit bridge for unified frontend tool execution.
   * When provided, the protocol will use this bridge to execute frontend tools
   * through the app's toolkit, eliminating the need for resolveFrontendTool.
   *
   * @example
   * ```typescript
   * import { createToolkitBridge } from '@/lib/toolkitBridge';
   *
   * const toolkitBridge = createToolkitBridge(toolkit);
   *
   * <ChatProtocolProvider
   *   toolkitBridge={toolkitBridge}
   * >
   * ```
   */
  toolkitBridge?: ToolkitBridge;

  createConversationId?: (threadId?: string) => string;
  children: ReactNode;
};
````

- [ ] **Step 3: Update component to accept and use toolkitBridge**

Find the `ChatProtocolProvider` function definition and update its destructuring:

```typescript
export function ChatProtocolProvider({
  apiUrl,
  toolkit,
  tools,
  context,
  metadata,
  fetch,
  onFrame,
  resolveFrontendTool,  // DEPRECATED
  toolkitBridge,  // NEW
  createConversationId = defaultCreateConversationId,
  children,
}: ChatProtocolProviderProps): JSX.Element {
```

- [ ] **Step 4: Pass toolkitBridge to streamProtocolRun**

Find where `streamProtocolRun` is called in the `modelAdapter` (around line 100-108) and update it:

```typescript
return streamProtocolRun({
  request,
  url: apiUrl,
  fetch,
  onFrame: handleFrame,
  toolkitBridge, // NEW: Pass the bridge
  resolveFrontendTool, // DEPRECATED: Still pass for backward compatibility
});
```

Similarly, find the second call to `streamProtocolRun` in the wrapped toolkit (around line 160-167) and update it:

```typescript
stream: () =>
  createProtocolResultStream(
    streamProtocolRun({
      request,
      url: apiUrl,
      fetch,
      onFrame: handleFrame,
      toolkitBridge,  // NEW: Pass the bridge
      resolveFrontendTool,  // DEPRECATED
    }),
  ),
```

- [ ] **Step 5: Run type check**

```bash
cd packages/chat-protocol-ui && npm run typecheck
```

Expected: No TypeScript errors

- [ ] **Step 6: Commit**

```bash
git add packages/chat-protocol-ui/src/provider.tsx
git commit -m "feat(ui): add toolkitBridge support to ChatProtocolProvider

- Add ToolkitBridge to ChatProtocolProviderProps
- Deprecate resolveFrontendTool in favor of toolkitBridge
- Pass toolkitBridge through to streamProtocolRun calls
- Maintain backward compatibility

Refs: #unified-tool-execution"
```

---

## Task 5: Update Demo App to Use ToolkitBridge

**Files:**

- Modify: `apps/chat-protocol-demo-web/src/App.tsx`

- [ ] **Step 1: Update imports**

At the top of `apps/chat-protocol-demo-web/src/App.tsx`, add:

```typescript
import { useMemo } from 'react';
import { createToolkitBridge } from '@/lib/toolkitBridge';
```

- [ ] **Step 2: Remove resolveFrontendTool definition**

Find and remove the entire `resolveFrontendTool` function definition (around lines 31-53):

```typescript
// REMOVE THIS ENTIRE BLOCK:
// const resolveFrontendTool: ResolveFrontendTool = async (toolCall) => {
//   if (toolCall.toolName === 'location.resolve') {
//     ...
//   }
//   return { ... };
// };
```

- [ ] **Step 3: Create toolkitBridge in component**

Inside the `ChatProtocolAppContent` component, add before the return statement:

```typescript
function ChatProtocolAppContent({
  activeToolPreset,
  selectToolPreset,
}: {
  activeToolPreset: ToolPreset;
  selectToolPreset: (preset: ToolPreset) => void;
}) {
  const { invocations, trackInvocation, updateInvocation, resetInvocations } =
    useToolInvocationTracker();

  // NEW: Create toolkit bridge for unified tool execution
  const toolkit = getToolkitForPreset(activeToolPreset);
  const toolkitBridge = useMemo(() => createToolkitBridge(toolkit), [toolkit]);

  const onFrame = useCallback(
    // ... existing code
  );

  // Remove this line since we now use toolkitBridge instead
  // const toolkit = getToolkitForPreset(activeToolPreset);
  // const currentTools = getToolDescriptors(activeToolPreset);
  // const protocolTools = getProtocolToolDescriptors(activeToolPreset);

  // Update to use the memoized toolkit
  const currentTools = useMemo(() => getToolDescriptors(activeToolPreset), [activeToolPreset]);
  const protocolTools = useMemo(() => getProtocolToolDescriptors(activeToolPreset), [activeToolPreset]);

  return (
    <ChatProtocolProvider
      apiUrl={API_URL}
      toolkit={toolkit}
      tools={protocolTools}
      onFrame={onFrame}
      toolkitBridge={toolkitBridge}  // NEW: Use toolkitBridge
      // resolveFrontendTool={resolveFrontendTool}  // REMOVED
      createConversationId={createConversationId}
    >
      {/* ... rest of JSX ... */}
    </ChatProtocolProvider>
  );
}
```

- [ ] **Step 4: Run type check**

```bash
cd apps/chat-protocol-demo-web && npm run typecheck
```

Expected: No TypeScript errors

- [ ] **Step 5: Test in browser**

```bash
cd /Users/taissa/lushuai/code/mfe/mfe-next && npm run dev:chat-protocol-demo
```

Open http://localhost:3000 and verify:

1. Frontend tools execute correctly via toolkitBridge
2. Tool results are displayed properly
3. No console warnings about resolveFrontendTool

- [ ] **Step 6: Commit**

```bash
git add apps/chat-protocol-demo-web/src/App.tsx
git add apps/chat-protocol-demo-web/src/lib/toolkitBridge.ts
git commit -m "feat(demo): migrate to toolkitBridge for unified tool execution

- Remove resolveFrontendTool from App.tsx
- Add toolkitBridge using createToolkitBridge
- Update ChatProtocolProvider to use toolkitBridge
- Frontend tools now execute through toolkit execute consistently

Refs: #unified-tool-execution"
```

---

## Summary

This plan provides a complete migration path from `resolveFrontendTool` to a unified toolkit `execute` approach. The key insight is that while assistant-ui's toolkit `execute` handles UI-initiated tool execution, the chat-protocol's streaming lifecycle requires a bridge mechanism (`ToolkitBridge`) to execute tools during protocol runs.

The migration:

1. Maintains backward compatibility during transition
2. Provides clear deprecation warnings
3. Unifies on toolkit `execute` as the single execution mechanism
4. Eliminates the dual-path complexity of the current architecture

**Next Steps:** Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.
