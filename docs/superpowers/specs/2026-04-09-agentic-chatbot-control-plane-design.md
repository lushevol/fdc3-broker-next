# Agentic Chatbot Control Plane Design

Date: 2026-04-09

## Summary

This design upgrades the current chatbot from a partly rule-driven governed executor into a true agentic control plane while keeping the system in one deployable.

The target behavior is:

1. user sends a goal in natural language
2. backend resolves the allowed capability surface for that request
3. the LLM decides whether to answer directly, ask a clarification question, or propose an execution plan
4. backend validates the plan against capability, schema, and policy boundaries
5. backend executes approved steps through MCP and, later, FDC3
6. UI renders only normal assistant text, tool receipts, and result cards
7. the LLM writes the final conclusion from actual execution results

The frontend must not invent business narration. All assistant-facing wording comes from backend LLM responses. The UI is responsible only for rendering structure and status.

## Goals

- Replace deterministic regex-based planning for the governed path with LLM-driven decisioning.
- Keep deployment simple by implementing the full control-plane loop inside `services/chatbot-backend`.
- Preserve strong backend control over capability resolution, policy, schema validation, and execution.
- Keep the UI simple: normal assistant text plus tool receipts and structured cards.
- Ensure the analytics card continues to render data from the live Elasticsearch MCP service rather than frontend heuristics.

## Non-Goals

- Separate deployables for policy or capability registry.
- Visible “thinking” or chain-of-thought UI.
- Full generic workflow/BPM engine.
- Autonomous multi-turn background execution.
- Broad multi-capability orchestration in the first implementation slice.

## Current Gap

Today the governed analytics path is not truly agentic.

- `ExecutionPlanner` contains deterministic message parsing and hardcoded selection of `statistic_count_by_app`.
- `AgentService` short-circuits matching requests into governed execution rather than asking the LLM to decide whether and how to use tools.
- This makes the flow fast and predictable, but the model is not actually choosing the tool.

The large-scope change replaces that shortcut with an LLM-first decision loop while preserving backend enforcement.

## Architecture

The system remains one deployable:

- `apps/base`
  - captures workspace context
  - renders assistant text, tool receipts, and result cards
- `services/chatbot-backend`
  - LLM decision service
  - capability resolver
  - policy evaluator
  - execution orchestrator
  - MCP client/runtime integration

The backend is logically split into four layers:

1. Decision layer
2. Validation layer
3. Execution layer
4. Synthesis layer

## Request Lifecycle

### 1. Request intake

Incoming request includes:

- user message
- conversation history
- bounded workspace context
- frontend tool manifest
- resolved user capability context

### 2. Capability resolution

Before the LLM is called, backend resolves the allowed capability surface for this request.

Inputs:

- static capability JSON
- runtime MCP provider registry
- frontend tool manifest
- user claims/profile
- tenant scope
- workspace context

Output:

- normalized resolved capabilities, each with:
  - `capabilityId`
  - `type`
  - `providerId`
  - `targetName`
  - schema/required inputs
  - risk classification
  - tenant/entitlement constraints

This is the only capability set the LLM may plan against.

### 3. Agent decision pass

The LLM receives:

- user goal
- bounded workspace context
- recent conversation history
- a compact allowed capability list
- system instructions describing the decision contract

The LLM must return one of three outcomes:

1. `respond`
2. `clarify`
3. `plan`

The LLM is not allowed to return arbitrary tool names outside the resolved capability list.

### 4. Backend validation

If the LLM returns `plan`, backend validates:

- every referenced `capabilityId` exists in the resolved capability set
- every step argument object matches the capability input schema
- tenant scope and user entitlement are satisfied
- policy decision is computed for each step

Policy outcomes remain:

- `allow`
- `review_required`
- `deny`

Any invalid step is rejected by backend regardless of LLM output.

### 5. Execution

If the validated plan is executable:

- backend emits assistant text if the agent included it
- backend emits tool-call events as steps run
- backend executes step(s) through MCP runtime
- backend captures raw results and normalized card-friendly result payloads

For the first large-scope implementation, the initial true-agentic flow should still focus on the Elasticsearch MCP capability `statistic_count_by_app`.

### 6. Final synthesis pass

After execution, backend runs a second LLM pass with:

- user goal
- validated plan
- actual executed steps
- actual tool results

The LLM writes the final conclusion in plain assistant text.

This final message is the only source of business summary text shown in the UI.

## Decision Contract

Recommended LLM output model:

```json
{
  "decisionType": "respond | clarify | plan",
  "assistantText": "optional plain assistant text",
  "clarificationQuestion": "optional when decisionType=clarify",
  "plan": {
    "steps": [
      {
        "capabilityId": "string",
        "arguments": {}
      }
    ]
  }
}
```

Rules:

- `respond`: backend streams `assistantText` only
- `clarify`: backend streams `clarificationQuestion`
- `plan`: backend validates and executes the plan; any optional `assistantText` is treated as ordinary assistant text, not a special “thinking” block

## UI Contract

The UI should only render:

1. assistant text from backend `message` events
2. generic tool receipts from `tool_call`
3. structured cards from `tool_result` or `generative_ui`
4. final assistant summary from backend `message` events

The UI must not:

- invent business narration
- generate capability-specific assistant copy
- infer conclusions from the data

The polished receipt and analytics card remain valid as long as they are structural renderers only.

## Tool Receipt Contract

Tool receipts are generic UI for execution metadata.

They may display:

- label such as `Used tool`
- tool name
- generic metadata extracted from arguments
- status
- raw request/response payloads when expanded

They must not display capability-specific business sentences authored by the frontend.

## Analytics Card Contract

The analytics card remains a structured visual renderer for `statistic_count_by_app` results.

It may render:

- app label
- date range
- PV total
- UV total
- trend chart

It must derive all values from MCP result payloads, not frontend-authored text.

## Backend Refactor Plan

`AgentService` is currently carrying too many responsibilities. It should be split into explicit collaborators:

- `AgentDecisionService`
  - calls the LLM for `respond | clarify | plan`
- `PlanValidationService`
  - validates `capabilityId`, arguments, schema, and policy
- `ExecutionOrchestrator`
  - executes MCP/FDC3 steps and emits lifecycle events
- `ResultSynthesisService`
  - calls the LLM for the final conclusion

The existing modules remain useful:

- `CapabilityResolver`
- `PolicyEvaluator`
- MCP provider registry/client factory

`ExecutionPlanner` should stop being the primary planner. At most, it can survive temporarily as a compatibility fallback during migration, but the target design removes it from the main governed path.

## Streaming Model

No visible thinking UI is introduced.

Streamed event model remains simple:

- `message`
- `tool_call`
- `tool_result`
- `generative_ui`
- `done`

`execution_plan` and `execution_step` may still exist for observability, but they are not part of the intended user-facing assistant narrative.

## Error Handling

### Clarification needed

If required arguments are missing and the LLM cannot safely infer them from workspace context, it must return `clarify`.

### Invalid plan

If the LLM proposes an invalid capability or malformed arguments:

- backend rejects the plan
- backend returns a safe assistant message asking the user to retry or clarify
- invalid plan never reaches execution

### Tool failure

If MCP execution fails:

- backend emits failed tool result/receipt state
- optional final synthesis pass may explain the failure in plain language

## Security

The LLM never becomes the authorization source.

Security remains backend-owned:

- capability availability is filtered before the LLM sees it
- plan validation is backend-enforced
- policy is backend-enforced
- execution only occurs through approved providers

This preserves tenant isolation and prevents prompt-driven privilege escalation.

## Migration Strategy

Implement in stages inside one deployable:

1. Remove frontend-authored narration completely
2. Introduce structured LLM decision output for `respond | clarify | plan`
3. Route the governed analytics flow through LLM decisioning
4. Validate and execute using existing MCP path
5. Add final synthesis pass
6. Expand to more capabilities after the analytics path is stable

## Verification Requirements

Required verification for the first true-agentic slice:

- prompt with explicit app name:
  - LLM chooses plan
  - MCP tool runs
  - card displays Elasticsearch MCP data
  - LLM conclusion appears
- prompt without app name but with active workspace app:
  - LLM may use workspace context to plan
  - MCP tool runs
  - card displays Elasticsearch MCP data
  - LLM conclusion appears
- prompt missing enough context:
  - LLM asks a clarification question
  - no tool executes
- invalid tool proposal path:
  - backend rejects before execution

## Recommendation

Proceed with the large one-deployable refactor, but implement only one true-agentic governed capability first:

- `statistic_count_by_app`

This is enough to prove the architecture:

- the LLM decides
- backend validates
- MCP executes
- UI stays generic
- conclusion comes from the model, not frontend logic
