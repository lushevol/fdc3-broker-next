# Chat Protocol Design

Date: 2026-04-14

## Goal

Define a clean chat protocol for the chatbot stack that:

- supports multi-message threads and resumable runs
- supports visible reasoning summaries, planning, tool calls, streaming text, generative UI cards, and human approval
- uses `assistant-ui` with `LocalRuntime` on the frontend
- keeps the backend as the only planner/orchestrator
- works with a LangChain4j-based chatbot backend through an adapter layer
- can be tested in isolation, outside the current noisy `apps/base` and `services/chatbot-backend` integrations

This design is intentionally protocol-first. It does not implement the production integration directly. Instead, it defines two standalone protocol packages and a minimal isolated demo so the protocol can be verified before it is folded back into the existing chatbot codepath.

## Context

The current codebase already contains most of the required concepts:

- frontend runtime wiring in `apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx`
- custom SSE-to-assistant-ui adaptation in `apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts`
- backend streaming, planning, tool, and generative UI models in `services/chatbot-backend`

However, the current contract is still built around:

- `message` plus ad hoc side-channel events
- `toolContext` as a continuation escape hatch
- `frontendTools` as a serialized manifest blob
- separate event categories for planning, tooling, and generative UI instead of one coherent message model

This makes the flow harder to persist, resume, test, and reason about.

The target UX is closer to the assistant-ui showcase pattern:

- structured messages with typed parts
- streamed step and tool state
- tool pauses and run resumes
- cards rendered as message content
- thread persistence separated from the render transport

## Non-Goals

- immediate refactor of the production chatbot integration
- direct replacement of all existing chatbot code in one step
- raw chain-of-thought exposure
- coupling the public protocol to Vercel AI SDK internals

## Design Principles

1. Backend-only orchestration
   The backend decides planning, reasoning summaries, tool selection, and approval gates.

2. Structured messages are the source of truth
   The protocol should operate on message arrays with typed parts, not plain transcript strings plus event side channels.

3. Streaming frames describe state transitions
   The stream should carry typed frames for text deltas, planning steps, tool lifecycle, cards, and action requirements.

4. Resume by state, not by hidden continuation payload
   Frontend tool execution and HITL decisions should resume a run by sending updated message state or typed action submissions, not by sending opaque `toolContext`.

5. UI library is an adapter, not the protocol
   `assistant-ui` shapes the frontend adapter, but the protocol remains backend-owned and stable.

6. Isolated verification first
   The protocol must be proven in a minimal demo before it is integrated into `apps/base` and `services/chatbot-backend`.

## High-Level Architecture

The protocol is split into three layers:

1. Contract layer
   Shared message, part, frame, schema, and validation definitions.

2. Frontend runtime adapter layer
   Converts protocol frames into assistant-ui runtime updates and handles frontend tool execution / action submission.

3. Backend orchestration adapter layer
   Converts LangChain4j planning/model/tool events into protocol frames and resumes.

## Package Layout

```text
packages/
  chat-protocol-contract/
  chat-protocol-frontend/
  chat-protocol-demo-support/

apps/
  chat-protocol-demo-web/
  chat-protocol-demo-server/
```

## Package Responsibilities

### `packages/chat-protocol-contract`

Purpose:

- define the public protocol contract
- validate requests and stream frames
- provide JSON schema and fixture support

Responsibilities:

- message types
- message part types
- stream frame types
- action types
- finish reasons
- validation helpers
- sample fixture payloads

Exports:

- `ChatRunRequest`
- `ChatMessage`
- `ChatPart`
- `ChatStreamFrame`
- `ChatAction`
- `ChatFinishReason`
- `validateRunRequest`
- `validateStreamFrame`
- `schemas/*`
- `fixtures/*`

Constraints:

- no React
- no Spring
- no LangChain4j
- no app-specific business tools

### `packages/chat-protocol-frontend`

Purpose:

- provide the frontend runtime adapter for `assistant-ui` `LocalRuntime`
- consume protocol frames and produce assistant-ui-compatible state

Responsibilities:

- map protocol stream frames into assistant-ui message updates
- render typed parts using a card registry
- execute frontend-targeted tools
- submit tool output back to the backend
- submit HITL decisions back to the backend
- keep run/conversation state isolated from app shell code

Exports:

- `createProtocolLocalRuntime`
- `createProtocolStreamAdapter`
- `ProtocolMessageRenderer`
- `ProtocolCardRegistry`
- `submitToolResult`
- `submitActionDecision`

Constraints:

- generic UI/runtime package only
- no dependency on current `ChatbotSidebar` business logic
- no FDC3-specific assumptions

### LangChain4j Backend Adapter

Purpose:

- provide a backend adapter layer between LangChain4j orchestration and the public chat protocol

Responsibilities:

- map internal planning events into protocol planning frames
- map tool requests into protocol tool frames
- map tool results into protocol output frames
- map card directives into protocol card parts
- map approval requirements into protocol actions
- support resuming runs after frontend tools or HITL

Notes:

- this adapter belongs in the Java/Spring backend, not in the TS demo packages
- the logical boundary is the important part

Suggested home:

- `services/chatbot-backend` as a LangChain4j/Spring module that maps LangChain4j planning, tool, approval, and UI directives into protocol frames

### `packages/chat-protocol-demo-support`

Purpose:

- provide deterministic TS helpers used only by the isolated demo server and browser tests

Responsibilities:

- stream a scripted weather scenario over the public protocol
- keep demo-only fixtures, SSE helpers, and scripted run state out of the LangChain4j adapter boundary

Constraints:

- demo-only
- not the production backend adapter

## Canonical Request Model

The protocol uses message-native requests.

### Run Start

`POST /api/chat/runs`

```json
{
  "conversationId": "conv_123",
  "runId": null,
  "trigger": "submit-message",
  "config": {
    "modelName": "openai/gpt-4.1",
    "reasoningVisibility": "summary"
  },
  "context": {
    "workspace": {
      "activeWorkspaceId": "ws_1",
      "activeAppId": "weather-tile"
    },
    "frontendTools": [
      {
        "name": "location.resolve",
        "description": "Resolve a location in the frontend/runtime context",
        "parameters": {
          "type": "object",
          "properties": {
            "query": { "type": "string" }
          },
          "required": ["query"]
        },
        "interactionMode": "auto"
      }
    ]
  },
  "messages": [
    {
      "id": "msg_user_1",
      "role": "user",
      "parts": [
        {
          "type": "text",
          "text": "how is the weather in Beijing yesterday?"
        }
      ],
      "metadata": {}
    }
  ],
  "metadata": {}
}
```

### Run Resume

Resume uses the same endpoint and same message model.

- for frontend tools: trigger `submit-tool-result`
- for HITL: trigger `submit-action`
- the request includes updated assistant message state

This replaces the current `toolContext` continuation design.

## Canonical Message Model

### Message

```json
{
  "id": "msg_asst_1",
  "role": "assistant",
  "parts": [],
  "metadata": {
    "status": {
      "type": "running"
    }
  }
}
```

### Roles

- `system`
- `user`
- `assistant`
- `tool` is not exposed as a first-class protocol role; tool activity is represented as assistant parts

### Part Types

User parts:

- `text`
- `file`
- `image`

Assistant parts:

- `text`
- `reasoning-summary`
- `plan`
- `step-start`
- `step`
- `tool-call`
- `tool-result`
- `card`
- `action`
- `error`

### Part Semantics

#### `reasoning-summary`

Visible, safe reasoning summary only. No raw chain-of-thought.

```json
{
  "type": "reasoning-summary",
  "text": "I need to resolve the date first, then the location, then fetch historical weather."
}
```

#### `plan`

High-level plan view for the turn.

```json
{
  "type": "plan",
  "planId": "plan_1",
  "summary": "Resolve date, resolve Beijing, fetch historical weather, summarize results."
}
```

#### `tool-call`

Represents tool invocation lifecycle.

```json
{
  "type": "tool-call",
  "toolCallId": "tc_1",
  "toolName": "datetime.resolve_relative_date",
  "executionTarget": "backend",
  "state": "output-available",
  "input": { "expression": "yesterday" },
  "output": { "date": "2026-04-13" }
}
```

State values:

- `input-streaming`
- `input-available`
- `awaiting-frontend`
- `awaiting-approval`
- `output-available`
- `output-error`

#### `card`

Generative UI rendered as message content.

```json
{
  "type": "card",
  "cardType": "weather-summary",
  "props": {
    "location": "Beijing",
    "date": "2026-04-13",
    "condition": "Clear",
    "high": 18,
    "low": 9
  }
}
```

#### `action`

Pending user decision for HITL.

```json
{
  "type": "action",
  "actionId": "act_1",
  "actionType": "tool-approval",
  "status": "pending",
  "toolCallId": "tc_7",
  "title": "Approve tool execution",
  "description": "This tool performs a side-effecting action.",
  "options": [
    { "id": "approve", "label": "Approve" },
    { "id": "reject", "label": "Reject" }
  ]
}
```

## Stream Frame Catalog

Transport stays `text/event-stream`, but the payload semantics should align with assistant-ui-style data streams.

### Lifecycle Frames

- `start`
- `message-start`
- `message-metadata`
- `finish`
- `error`

### Planning and Reasoning Frames

- `start-step`
- `reasoning-summary`
- `plan-available`
- `step-status`
- `finish-step`

### Text Frames

- `text-start`
- `text-delta`
- `text-end`

### Tool Frames

- `tool-input-start`
- `tool-input-delta`
- `tool-input-available`
- `tool-output-available`
- `tool-output-error`

### UI Frames

- `ui-part-available`

### HITL Frames

- `action-required`
- `action-resolved`

### Finish Reasons

`finish.finishReason` must be one of:

- `stop`
- `tool-calls`
- `action-required`
- `error`

These reasons are operationally important:

- `tool-calls`: frontend must execute one or more frontend-targeted tools and resume
- `action-required`: frontend must collect user approval/rejection and resume
- `stop`: assistant turn is complete

## Backend-Only Orchestration Model

The backend is the sole planner and decision-maker.

Implications:

- frontend does not route prompts to tools on its own
- frontend does not invent planning steps
- frontend does not synthesize tool narratives
- frontend only:
  - renders protocol parts
  - executes frontend-targeted tools when instructed
  - submits action decisions
  - resumes the run with updated state

This explicitly removes the current “frontend tool shortcut” behavior.

## Frontend Tool Flow

### Desired Flow

1. User submits a message.
2. Backend streams reasoning summary and plan.
3. Backend emits a `tool-call` / tool input frame targeting `frontend`.
4. Backend ends the stream with `finishReason: "tool-calls"`.
5. Frontend executes the named tool.
6. Frontend updates the assistant message state with tool output.
7. Frontend resubmits the updated `messages[]` payload.
8. Backend resumes the same run and continues the turn.

### Resume Example

```json
{
  "conversationId": "conv_123",
  "runId": "run_1",
  "trigger": "submit-tool-result",
  "messages": [
    {
      "id": "msg_user_1",
      "role": "user",
      "parts": [
        { "type": "text", "text": "how is the weather in Beijing yesterday?" }
      ]
    },
    {
      "id": "msg_asst_1",
      "role": "assistant",
      "parts": [
        {
          "type": "tool-call",
          "toolCallId": "tc_2",
          "toolName": "location.resolve",
          "executionTarget": "frontend",
          "state": "output-available",
          "input": { "query": "Beijing" },
          "output": {
            "name": "Beijing",
            "latitude": 39.9042,
            "longitude": 116.4074
          }
        }
      ]
    }
  ]
}
```

## HITL Flow

### Desired Flow

1. Backend identifies a side-effecting action that requires approval.
2. Backend emits an `action` part and `action-required` frame.
3. Stream ends with `finishReason: "action-required"`.
4. Frontend renders approve/reject UI.
5. User chooses an option.
6. Frontend submits the decision.
7. Backend resumes the run and continues.

### Action Submission

Dedicated endpoint is recommended even if internal state stays message-native:

`POST /api/chat/runs/{runId}/actions/{actionId}`

```json
{
  "decision": "approve"
}
```

This allows the backend to materialize the decision into updated assistant state while keeping the frontend API simple.

## Generative UI

Generative UI is represented as `card` parts in assistant messages.

This replaces the current out-of-band `generative_ui` directive at the public protocol boundary.

The backend may still internally use a generative UI directive model, but it must adapt that into:

- `ui-part-available` frames
- `card` message parts

The frontend package provides a card registry keyed by `cardType`.

Examples:

- `weather-summary`
- `tool-output-preview`
- `approval-request`
- `stock-quote`

## Weather Story Sequence

User prompt:

`how is the weather in Beijing yesterday?`

### Expected Stream

1. `start`
2. `message-start`
3. `reasoning-summary`
4. `plan-available`
5. `start-step`
6. `tool-input-start` for `datetime.resolve_relative_date`
7. `tool-input-available`
8. `tool-output-available`
9. `finish-step`
10. `start-step`
11. `tool-input-start` for `location.resolve`
12. `tool-input-available`
13. if frontend tool:
    `finish` with `tool-calls`
14. frontend executes tool and resumes
15. resumed stream:
    - `start-step`
    - `tool-input-start` for `weather.history`
    - `tool-output-available`
    - `finish-step`
    - `ui-part-available` with `weather-summary`
    - `text-start`
    - `text-delta`
    - `text-end`
    - `finish` with `stop`

### Expected Rendered Assistant Turn

- reasoning summary
- visible plan
- date resolution step
- location resolution step
- weather retrieval step
- weather summary card
- final textual summary

## Minimal Demo Design

The demo exists to verify protocol behavior without production noise.

### `apps/chat-protocol-demo-server`

Purpose:

- deterministic protocol server
- no auth, no FDC3, no shell integration
- no production chatbot dependencies required for first verification

Scenarios:

1. `weather-basic`
   backend-only date + weather tools

2. `weather-frontend-location`
   frontend `location.resolve`, then backend weather lookup

3. `approval-required`
   backend pauses for approve/reject

4. `failure-recovery`
   first tool fails, assistant still recovers and completes

Endpoints:

- `POST /api/chat/runs`
- `POST /api/chat/runs/{runId}/actions/{actionId}`
- optional `GET /api/chat/conversations/{conversationId}`

### `apps/chat-protocol-demo-web`

Purpose:

- minimal `assistant-ui` test harness
- depends only on protocol packages
- verifies rendering, resume flow, tool flow, and approvals

Features:

- thread list
- one message thread surface
- model picker stub
- visible reasoning summary
- visible step timeline
- card renderer
- approve/reject renderer
- frontend tool registry

Verification:

- send a weather question
- observe tool and plan steps
- confirm frontend tool execution resumes the same turn
- confirm HITL pauses and resumes
- confirm cards render correctly

## Acceptance Criteria

### Contract Package

- all request/frame schemas validate deterministically
- invalid states are rejected with clear errors
- fixtures cover all supported finish reasons

### Frontend Package

- given protocol frames, assistant-ui shows the correct message parts
- frontend tool execution resumes via updated state, not opaque continuation strings
- HITL decisions are submitted cleanly
- cards render from a pluggable registry

### Backend Package

- backend can stream a full turn with planning, tools, cards, and finish reasons
- backend can pause and resume after frontend tool result
- backend can pause and resume after approval

### Demo

- all four demo scenarios work without production chatbot wiring
- no dependency on the current `ChatbotSidebar` implementation is required to run the demo

## Migration Plan Back Into Production

### Phase 1: Isolated Protocol and Demo

- build the contract package
- build the frontend adapter package
- build the backend adapter package
- verify with demo web/server

### Phase 2: Frontend Integration

Replace the current custom continuation logic in:

- `apps/base/src/components/ChatbotSidebar/AssistantUIRuntimeProvider.tsx`
- `apps/base/src/components/ChatbotSidebar/adapters/sseToAssistantUi.ts`

with protocol package integration.

### Phase 3: Backend Integration

Adapt:

- `services/chatbot-backend/src/main/java/com/fdc3/chatbot/controller/ChatController.java`
- `services/chatbot-backend/src/main/java/com/fdc3/chatbot/agent/AgentService.java`

to emit protocol frames and consume resumed state.

### Phase 4: Remove Legacy Contract

Remove:

- `toolContext`
- serialized frontend tool continuation
- out-of-band public `generative_ui` contract
- public dependence on separate `execution_plan` / `execution_step` event channels

## Open Questions Resolved

1. Reasoning visibility
   Use visible reasoning summaries and plan traces only. No raw chain-of-thought.

2. Tool routing
   Backend-only orchestration. The frontend does not pre-route prompts.

3. HITL boundary
   Pause at action/tool boundaries, not at the whole plan boundary.

4. Demo scope
   Standalone packages plus isolated demo apps before production integration.

## Recommendation

Proceed with the isolated protocol-first build:

- `chat-protocol-contract`
- `chat-protocol-frontend`
- `chat-protocol-demo-support`
- `chat-protocol-demo-web`
- `chat-protocol-demo-server`

This is the lowest-risk path to achieve the assistant-ui-style UX while preserving LangChain4j as the backend runtime and avoiding a large noisy refactor inside the current chatbot stack.
