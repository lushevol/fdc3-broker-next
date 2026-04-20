# Assistant UI Weather Capture vs Our Chat Contract

**Purpose:** distill the Assistant UI weather example into rules that fit our contract package without copying the upstream wire format verbatim.  
**Source pattern:** Assistant UI modal weather demo with repeated geocode attempts, tool rendering, and final text output.  
**Last updated:** 2026-04-15

---

## Summary

The captured Assistant UI example demonstrates a useful interaction pattern:

1. User sends a message.
2. Assistant emits tool calls.
3. Tool results are fed back into the next request.
4. The assistant may call more tools before producing the final text answer.

We want that behavior, but we keep **our** contract as the canonical one.

That means:

- We keep `parts`, not upstream `content`.
- We keep our richer assistant parts and stream frames.
- We explicitly support **assistant history and tool history in request bodies**.
- We treat the capture as a behavioral reference, not as the exact wire contract.

---

## Canonical Differences

### Upstream capture

- Request messages are shown with `content`.
- Initial request example only shows a user message.
- Follow-up requests include assistant and tool messages.
- Tool outputs are modeled as separate `tool` role messages.

### Our contract

- Request messages use `parts`.
- Request history supports `system`, `user`, `assistant`, and `tool`.
- Assistant messages carry prior tool calls, reasoning summaries, text, steps, cards, and actions.
- Tool messages carry finalized `tool-result` parts linked to a previous `toolCallId`.
- Stream frames remain our richer SSE protocol and are not constrained to Assistant UI's minimal example.

---

## Request Contract

### `ChatRunRequest`

```ts
type ChatRunRequest = {
  conversationId: string;
  runId?: string | null;
  trigger?: 'submit-message' | 'submit-tool-result' | 'submit-action';
  config?: ChatRunConfig;
  context?: ChatRunContext;
  messages: ChatMessage[];
  metadata?: Record<string, unknown>;
};
```

### Message roles

```ts
type ChatRole = 'system' | 'user' | 'assistant' | 'tool';
```

### Message shapes

```ts
type ChatSystemMessage = {
  id: string;
  role: 'system';
  parts: ChatTextPart[];
  metadata?: Record<string, unknown>;
};

type ChatUserMessage = {
  id: string;
  role: 'user';
  parts: ChatUserPart[];
  metadata?: Record<string, unknown>;
};

type ChatAssistantMessage = {
  id: string;
  role: 'assistant';
  parts: ChatAssistantPart[];
  metadata?: Record<string, unknown>;
};

type ChatToolMessage = {
  id: string;
  role: 'tool';
  toolCallId: string;
  toolName: string;
  parts: ChatToolResultPart[];
  metadata?: Record<string, unknown>;
};
```

### Why `tool` is a first-class request role

If a run pauses on `finishReason: 'tool-calls'`, the next request needs the prior assistant tool-call context and the concrete tool outputs that followed. Treating tool outputs as distinct history messages makes continuation deterministic and mirrors how the weather example actually progresses.

---

## Trigger-Aware History Rules

These are the recommended semantics for consumers of this package.

### `submit-message`

Allowed:

- A first-turn request with only the new user message.
- A later-turn request with full history.

Recommended:

- Send enough prior history for the model to continue coherently if the backend is stateless.

### `submit-tool-result`

Expected:

- The request should include the prior user message(s).
- The request should include the assistant message that emitted the tool call.
- The request should include the matching `tool` message carrying the tool result.

This is the key fix from the original capture note: continuation requests are not user-only.

### `submit-action`

Expected:

- Include the assistant message that asked for the action.
- Include the action resolution context required to continue the same run or conversation.

---

## Multi-Tool Weather Example in Our Contract

### Step 1: Initial user submission

```json
{
  "conversationId": "conv_weather_1",
  "trigger": "submit-message",
  "messages": [
    {
      "id": "msg_user_1",
      "role": "user",
      "parts": [{ "type": "text", "text": "What's the weather in San Francisco?" }],
      "metadata": {}
    }
  ],
  "metadata": {}
}
```

### Step 2: Backend pauses for a tool

Example SSE frames:

```text
data: {"type":"start","conversationId":"conv_weather_1","runId":"run_1"}

data: {"type":"message-start","messageId":"msg_assistant_1","role":"assistant"}

data: {"type":"start-step","stepId":"step_1","title":"Resolve location"}

data: {"type":"tool-input-start","toolCallId":"call_geocode_1","toolName":"geocode_location","executionTarget":"backend"}

data: {"type":"tool-input-available","toolCallId":"call_geocode_1","input":{"query":"San Francisco"}}

data: {"type":"finish-step","stepId":"step_1","status":"completed"}

data: {"type":"finish","finishReason":"tool-calls","messageId":"msg_assistant_1"}
```

### Step 3: Continuation request includes assistant and tool history

```json
{
  "conversationId": "conv_weather_1",
  "runId": "run_2",
  "trigger": "submit-tool-result",
  "messages": [
    {
      "id": "msg_user_1",
      "role": "user",
      "parts": [{ "type": "text", "text": "What's the weather in San Francisco?" }],
      "metadata": {}
    },
    {
      "id": "msg_assistant_1",
      "role": "assistant",
      "parts": [
        { "type": "step-start", "stepId": "step_1", "title": "Resolve location" },
        {
          "type": "tool-call",
          "toolCallId": "call_geocode_1",
          "toolName": "geocode_location",
          "executionTarget": "backend",
          "state": "output-available",
          "input": { "query": "San Francisco" },
          "output": { "latitude": 37.77493, "longitude": -122.41942 }
        }
      ],
      "metadata": {}
    },
    {
      "id": "msg_tool_1",
      "role": "tool",
      "toolCallId": "call_geocode_1",
      "toolName": "geocode_location",
      "parts": [
        {
          "type": "tool-result",
          "toolCallId": "call_geocode_1",
          "output": {
            "latitude": 37.77493,
            "longitude": -122.41942,
            "country": "United States",
            "admin1": "California"
          }
        }
      ],
      "metadata": {}
    },
    {
      "id": "msg_assistant_2",
      "role": "assistant",
      "parts": [
        { "type": "step-start", "stepId": "step_2", "title": "Fetch weather" },
        {
          "type": "tool-call",
          "toolCallId": "call_weather_1",
          "toolName": "weather_search",
          "executionTarget": "backend",
          "state": "input-available",
          "input": {
            "query": "San Francisco, CA",
            "latitude": 37.77493,
            "longitude": -122.41942
          }
        }
      ],
      "metadata": {}
    }
  ],
  "metadata": {}
}
```

### Step 4: Final assistant answer can include UI and text

This is where our contract is intentionally richer than the captured upstream example. The final assistant message may combine:

- `card` parts for structured rendering
- `text` parts for narrative output
- `reasoning-summary` parts if exposed
- `step` / `step-start` parts for execution trace

Example assembled assistant message:

```json
{
  "id": "msg_assistant_3",
  "role": "assistant",
  "parts": [
    {
      "type": "card",
      "cardType": "weather-summary",
      "props": {
        "location": "San Francisco, CA",
        "temperatureC": 18,
        "summary": "Partly cloudy"
      }
    },
    {
      "type": "text",
      "text": "It is currently 18°C and partly cloudy in San Francisco."
    }
  ],
  "metadata": {}
}
```

This achieves the same outcome as the weather capture: multiple tool calls, UI rendering, and final text.

---

## SSE Notes

Our streaming contract remains:

```ts
type ChatStreamFrame =
  | { type: 'start'; runId?: string; conversationId?: string }
  | { type: 'message-start'; messageId: string; role: ChatRole }
  | { type: 'message-metadata'; messageId: string; metadata: Record<string, unknown> }
  | { type: 'start-step'; stepId: string; title?: string; parentStepId?: string }
  | { type: 'reasoning-summary'; messageId?: string; text: string }
  | { type: 'plan-available'; planId: string; summary: string }
  | {
      type: 'step-status';
      stepId: string;
      status: 'pending' | 'running' | 'completed' | 'failed';
      detail?: string;
    }
  | { type: 'finish-step'; stepId: string; status?: 'completed' | 'failed' }
  | { type: 'text-start'; messageId: string; partId?: string }
  | { type: 'text-delta'; messageId: string; partId?: string; delta: string }
  | { type: 'text-end'; messageId: string; partId?: string }
  | {
      type: 'tool-input-start';
      toolCallId: string;
      toolName: string;
      executionTarget?: 'backend' | 'frontend';
    }
  | { type: 'tool-input-delta'; toolCallId: string; delta: string }
  | { type: 'tool-input-available'; toolCallId: string; input: unknown }
  | { type: 'tool-output-available'; toolCallId: string; output: unknown }
  | { type: 'tool-output-error'; toolCallId: string; error: string }
  | {
      type: 'ui-part-available';
      messageId?: string;
      cardType: string;
      props: Record<string, unknown>;
    }
  | {
      type: 'action-required';
      actionId: string;
      actionType: string;
      title: string;
      description?: string;
      options?: { id: string; label: string }[];
    }
  | { type: 'action-resolved'; actionId: string; status: 'resolved'; decision: string }
  | {
      type: 'finish';
      finishReason: 'stop' | 'tool-calls' | 'action-required' | 'error';
      messageId?: string;
      usage?: Record<string, unknown>;
    }
  | { type: 'error'; message: string; code?: string };
```

The important boundary is:

- Request history may include `tool` messages.
- Stream frames still model execution events, not historical message replay.

---

## Contract Checklist

Use this package as if these statements are true:

- Assistant messages are allowed in request history.
- Tool messages are allowed in request history.
- First-turn `submit-message` can be user-only.
- Continuation requests should include assistant and tool context from earlier steps.
- Final assistant output can mix renderable UI parts and plain text.
- Assistant UI is a reference behavior; this package is the canonical contract.
