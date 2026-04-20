# Frontend Tool Execution - Infinite Loop Issue

## Problem

When calling a frontend tool (e.g., `profile_lookup`) in chat-protocol-demo-web, the tool executes successfully and returns a result, but then enters an infinite loop calling the tool repeatedly.

## Root Cause

In `packages/chat-protocol-runtime/src/runtime/client.ts`, the `streamProtocolRun` function:

1. Receives tool-call from LLM with `finishReason: 'tool-calls'`
2. Finds and executes the frontend tool via `toolkitBridge.executeTool()`
3. Yields `tool-output-available` frame
4. Creates a new request with the tool result and loops back
5. **BUG**: On next iteration, the adapter still has the OLD message without `output`, so the same tool is found as "pending" and executed again

## Files to Fix

### 1. packages/chat-protocol-runtime/src/runtime/client.ts

After yielding the `tool-output-available` frame, apply it to the adapter so the message state is updated:

```typescript
// Around line 570 - after yielding the frame:
yield {
  type: 'tool-output-available',
  toolCallId: resolvedTool.toolCallId,
  output,
  source: 'frontend',
} as ChatStreamFrame;

// FIX: Apply the frame to adapter so message is updated with output (prevents re-execution)
adapter.applyFrame({
  type: 'tool-output-available',
  toolCallId: resolvedTool.toolCallId,
  output,
  source: 'frontend',
});
```

### 2. packages/chat-protocol-runtime/src/runtime/client.ts

Add a safety check to prevent infinite loops if the adapter.applyFrame fix isn't sufficient:

```typescript
// Around line 509 - before executing tool:
let output: Record<string, unknown>;

// Safety: Check if we've already executed this tool
const hasFrontendToolInMessages = assistantMessage.content.some(
  (part) => part.type === 'tool-call' && part.source === 'frontend',
);
if (
  hasFrontendToolInMessages &&
  assistantMessage.content.some(
    (part) =>
      part.type === 'tool-call' &&
      part.source === 'frontend' &&
      'output' in part &&
      part.output !== undefined,
  )
) {
  break; // Prevent infinite loop
}
```

### 3. packages/chat-protocol-ui/src/provider.tsx

Ensure `toolkitBridge` is passed to `streamProtocolRun`:

```typescript
// Around line 127:
return streamProtocolRun({
  request,
  url: apiUrl,
  fetch,
  onFrame: handleFrame,
  resolveFrontendTool,
  toolkitBridge, // Ensure this is passed
});
```

## Testing

1. Start: `npm run dev:chat-protocol-real-demo`
2. Open: http://127.0.0.1:4173
3. Ask: "what's the profile of user 123"
4. Expected: Tool result displays once, no infinite loop
5. Check browser console for debug logs showing execution happens only once
