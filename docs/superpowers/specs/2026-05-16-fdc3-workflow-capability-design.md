# FDC3 Workflow Capability Design

## Decision

Move workflow assembly out of the chatbot layer and into the FDC3 platform layer.

The chatbot should not produce raw step arrays. It should raise a declared workflow capability by id, with natural-language-derived inputs. FDC3 owns the workflow definition, validates inputs, executes the linear sequence of intents, applies result bindings between steps, and returns a workflow transcript.

This supersedes the earlier chatbot-assembled workflow design in `2026-05-16-fdc3-intent-workflow-engine-design.md`.

## Goal

Add a first-class FDC3 workflow capability so callers can execute:

```ts
fdc3.raiseWorkflow('trade.pendingValidation.openChart', {
  status: 'PENDING_VALIDATION',
  select: 'first',
});
```

The broker executes the declared workflow:

1. Raise `SearchTrades` with an `fdc3.trade.query` context.
2. Read the instrument returned by the trade search result.
3. Raise `ViewChart` with an `fdc3.instrument` context derived from that result.
4. Return a structured workflow transcript.

The chatbot becomes a thin caller:

- list available workflows
- ask approval for a selected workflow id and input payload
- call `raiseWorkflow`
- pass the transcript back to chat continuation

## Why This Is Better

FDC3 workflows are an interoperability concern, not a chatbot concern.

Putting workflow assembly in FDC3 gives us:

- one workflow definition reusable by chatbot, buttons, menus, external launchers, and future automation
- less model-generated structure to validate
- stronger declaration-backed governance
- better test boundaries in `packages/fdc3-*`
- less coupling between chat UI and business workflow sequencing

The chatbot still uses natural language, but it maps NL to a declared workflow capability instead of inventing the workflow steps.

## Architecture

Add workflow capability support to the FDC3 packages:

- `packages/fdc3-broker`
  - owns workflow definition types
  - validates workflow definitions
  - executes workflow steps through existing `raiseIntent`
  - applies step result bindings
  - returns workflow transcript

- `packages/fdc3-agent`
  - exposes `raiseWorkflow(workflowId, input, options?)`
  - exposes `findWorkflow(workflowId)` and `findWorkflowsByInput(input?)` if useful for discovery

- `packages/fdc3-app-directory`
  - extends app/declaration typing to include platform workflow declarations, or consumes a separate workflow declaration file

- `apps/base`
  - provides local workflow declarations during development
  - wires the broker with those workflow definitions
  - exposes chatbot tools that call `raiseWorkflow`

## Workflow Declaration

Workflows should be declared data, not chatbot prompts.

Example:

```json
{
  "workflowId": "trade.pendingValidation.openChart",
  "title": "Open chart for pending validation trade",
  "description": "Search pending validation trades and open a chart for the selected instrument.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "status": { "type": "string", "enum": ["PENDING_VALIDATION"] },
      "select": { "type": "string", "enum": ["first"] }
    },
    "required": ["status"]
  },
  "steps": [
    {
      "id": "search-trades",
      "intent": "SearchTrades",
      "contextTemplate": {
        "type": "fdc3.trade.query",
        "filters": { "status": "{{input.status}}" },
        "question": "{{input.originalRequest}}"
      }
    },
    {
      "id": "view-chart",
      "intent": "ViewChart",
      "contextTemplate": {
        "type": "fdc3.instrument",
        "id": {}
      },
      "inputBindings": [
        {
          "fromStepId": "search-trades",
          "resultPath": "$.trades[0].instrument",
          "contextPath": "$.id.ticker",
          "required": true
        }
      ]
    }
  ]
}
```

## Public API

Add to the FDC3 agent API:

```ts
export type WorkflowResolution = {
  workflowId: string;
  getResult(): Promise<WorkflowTranscript>;
};

export type WorkflowOptions = {
  timeoutMs?: number;
};

export interface WorkflowApi {
  raiseWorkflow(
    workflowId: string,
    input?: Record<string, unknown>,
    options?: WorkflowOptions,
  ): Promise<WorkflowResolution>;

  findWorkflow(workflowId: string): Promise<WorkflowDefinition | null>;

  findWorkflowsByInput(input?: Record<string, unknown>): Promise<WorkflowDefinition[]>;
}
```

The broker can implement this as a platform extension while keeping standard FDC3 `raiseIntent` behavior unchanged.

## Execution Rules

Execution remains linear in v1:

1. Resolve workflow definition by `workflowId`.
2. Validate caller input against `inputSchema`.
3. Render the first step context from input.
4. Raise the step intent using the existing broker intent flow.
5. Wait for the step result.
6. Render the next step context from its template.
7. Apply required and optional bindings from prior step results.
8. Stop on first error unless the step declares `continueOnError`.
9. Return a transcript.

The resolver UI remains unchanged. If a step intent has multiple targets, the existing resolver flow selects the target.

## Chatbot Tool Contract

Replace chatbot-assembled workflow tools with workflow capability tools:

- `propose_fdc3_workflow`
  - source: `human`
  - arguments: `workflowId`, `input`, `originalRequest`
  - approval UI displays the declared workflow steps from FDC3 metadata

- `execute_fdc3_workflow`
  - source: `frontend`
  - arguments: `workflowId`, `input`
  - implementation calls `getAgentApi().raiseWorkflow(workflowId, input)`

The LLM no longer supplies `steps`, `intent`, `context`, or `inputBindings`. It only selects a declared workflow and fills input fields.

## Validation Rules

Workflow definitions must be validated when registered:

- non-empty workflow id
- non-empty step list
- unique step ids
- every step has an intent
- every binding references an earlier step
- every binding path uses the supported path subset
- context template renders to an object
- `inputSchema` is an object schema

Workflow calls must be validated before execution:

- known workflow id
- input satisfies the workflow input schema
- rendered contexts are objects
- required bindings resolve to non-null values

## Transcript

```ts
export type WorkflowTranscript = {
  status: 'ok' | 'error';
  workflowId: string;
  title: string;
  input: Record<string, unknown>;
  completedSteps: WorkflowStepResult[];
  failedStep?: WorkflowStepResult;
  summary: string;
};

export type WorkflowStepResult = {
  stepId: string;
  intent: string;
  status: 'ok' | 'error' | 'skipped';
  context: Record<string, unknown>;
  result?: unknown;
  error?: string;
};
```

## Testing Strategy

Package tests:

- broker validates workflow definitions
- broker rejects future-step bindings
- broker renders context templates from workflow input
- broker applies result bindings into later contexts
- broker executes step intents in order through the existing intent path
- agent exposes `raiseWorkflow`
- app-directory typing accepts workflow declarations

App tests:

- base loads local workflow declarations into broker config
- chatbot tool descriptors expose workflow id/input tools only
- frontend execution tool calls `raiseWorkflow`, not a local step executor
- renderer displays declared workflow steps and final transcript

Manual verification:

1. Run UI dev stack.
2. Login at `http://localhost:8001`.
3. Ask chatbot: `Find pending validation trades and open the chart for the first instrument`.
4. Confirm approval shows a declared FDC3 workflow id.
5. Approve.
6. Verify FDC3 raises both intents in order.
7. Verify the second intent context uses data from the first result.
8. Verify chat receives a workflow transcript.

