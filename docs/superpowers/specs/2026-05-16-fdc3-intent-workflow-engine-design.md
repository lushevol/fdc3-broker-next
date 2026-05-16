# FDC3 Intent Workflow Engine Design

## Goal

Add a declaration-backed workflow engine for FDC3 intents so a user can describe a multi-step workflow in natural language, approve it once, and have the base shell execute multiple FDC3 actions in a strict linear order. Later intent steps can consume data returned by earlier intent handlers.

Example request:

`Find pending validation trades and open the chart for the first related instrument.`

Expected workflow:

1. Raise `SearchTrades` with an `fdc3.trade.query` context.
2. Read the selected instrument from the `SearchTrades` result.
3. Raise `ViewChart` with an `fdc3.instrument` context built from that result.
4. Return a compact workflow transcript to the chat continuation flow.

## Existing Context

The codebase already has a one-intent FDC3 chatbot path in `apps/base`:

- `fdc3-action-definitions.ts` derives chat-visible actions from local FDC3 declarations.
- `fdc3-action-provider.ts` matches and resolves known action ids.
- `fdc3-action-executor.ts` raises one FDC3 intent through `ratan-fdc3-agent`.
- `tools.tsx` exposes `propose_fdc3_action` as a `human` tool and `execute_fdc3_action` as a `frontend` tool.
- `toolkitBridge.ts` executes only frontend tools in the browser.
- `FDC3Integration.tsx` owns broker initialization, resolver UI, and workspace integration.

The workflow engine should extend this browser-side flow. The backend may help the model choose a plan through the existing tool manifest, but actual FDC3 execution must stay in `apps/base` because the broker, resolver, tabs, and tile instances live in the shell.

## Scope

In scope for v1:

- Linear FDC3 workflows only.
- Declaration-backed actions only.
- One user approval for the whole workflow.
- Step-to-step data binding from prior intent results into later step contexts.
- Structured validation before execution.
- Stop-on-first-error by default.
- Optional `continueOnError` per step.
- Compact workflow transcript returned to chat.
- Jest coverage for validation, binding resolution, execution order, and toolkit descriptors.

Out of scope for v1:

- Parallel branches.
- Loops.
- Conditional branching.
- Long-running persisted workflow state.
- Server-side FDC3 broker execution.
- Automatic execution without explicit user approval.
- Arbitrary JSONPath implementation beyond the path subset defined below.

## Architecture

Add a small workflow layer under `apps/base/src/components/ChatbotSidebarV2/toolkit`.

Core modules:

- `fdc3-workflow-types.ts`: shared TypeScript types for workflow plans, steps, bindings, and transcripts.
- `fdc3-workflow-schema.ts`: Zod schemas for runtime validation and tool parameter definitions.
- `fdc3-workflow-bindings.ts`: safe path resolver and context writer for step result bindings.
- `fdc3-workflow-validator.ts`: validates linear structure, known action ids, binding references, and basic context shape.
- `fdc3-workflow-executor.ts`: executes validated steps sequentially through the existing action executor.
- `fdc3-workflow-tool-description.ts`: builds the LLM-facing catalog text from declaration-backed action metadata.

Existing modules to extend:

- `fdc3-action-executor.ts`: accept an optional context override so workflow steps can execute with contexts built from prior results.
- `tools.tsx`: add `propose_fdc3_workflow` and `execute_fdc3_workflow`.
- `tool-renderers.tsx`: add workflow approval and execution transcript renderers.
- `use-fdc3-action-executor.ts`: expose a workflow executor beside the existing action executor, or add a new hook if that keeps dependencies clearer.

## Workflow Contract

```ts
export type Fdc3WorkflowPlan = {
  workflowId: string;
  title: string;
  originalRequest: string;
  steps: Fdc3WorkflowStep[];
};

export type Fdc3WorkflowStep = {
  id: string;
  actionId: string;
  intent: string;
  context: Record<string, unknown>;
  targetAppId?: string;
  timeoutMs?: number;
  continueOnError?: boolean;
  inputBindings?: Fdc3WorkflowInputBinding[];
};

export type Fdc3WorkflowInputBinding = {
  fromStepId: string;
  resultPath: string;
  contextPath: string;
  required: boolean;
};
```

Binding example:

```json
{
  "fromStepId": "search-trades",
  "resultPath": "$.trades[0].instrument",
  "contextPath": "$.id.ticker",
  "required": true
}
```

This reads the first trade instrument from the `search-trades` result and writes it into the next step context.

## Path Subset

The binding resolver supports a deliberately small path syntax:

- Root must be `$`.
- Object fields use `.fieldName`.
- Array indexes use `[0]`, `[1]`, etc.
- Paths cannot call functions, use wildcards, or evaluate filters.

Valid examples:

- `$.trades[0].instrument`
- `$.selectedInstrument.id.ticker`
- `$.summary.totalCount`

Invalid examples:

- `$.trades[*].instrument`
- `$.trades[?(@.status=="PENDING")]`
- `$..instrument`

## Validation Rules

The workflow validator must reject:

- empty workflows
- duplicate step ids
- unknown `actionId`
- step `intent` that does not match the declaration-backed action intent
- binding references to unknown steps
- binding references to the same step or a future step
- invalid path syntax
- missing or non-object step context

The validator should not attempt full JSON Schema validation of every FDC3 context in v1. It should enforce known action ids and intent compatibility, then rely on focused unit coverage for known sample contexts.

## Execution Rules

Execution is strict and linear:

1. Validate the full plan.
2. For each step, clone the step context.
3. Apply each input binding from previous step results into the cloned context.
4. If a required binding cannot be resolved, mark the step failed and stop.
5. Raise the FDC3 intent using the existing action executor and the bound context.
6. Store the normalized result in the transcript.
7. Continue to the next step only if the current step succeeded, unless `continueOnError` is true.

Timeouts:

- Default timeout is `15000`.
- A step may set `timeoutMs`.
- Minimum timeout is `1000`.
- Maximum timeout is `60000`.
- Timeout returns a structured workflow failure; it should not throw an uncaught exception into the chat runtime.

## Chat Tool UX

Add two tools:

- `propose_fdc3_workflow`
  - type/source: `human`
  - used by the model to request approval for the whole workflow
  - renders ordered steps, intents, contexts, and bindings

- `execute_fdc3_workflow`
  - type/source: `frontend`
  - used after approval
  - executes the workflow in the browser shell
  - returns a workflow transcript to chat continuation

Approval copy must make it clear that:

- multiple apps/intents may be opened or raised
- later steps may use data returned by earlier steps
- execution is linear
- rejected approval means no intent is raised

## Transcript Contract

```ts
export type Fdc3WorkflowTranscript = {
  status: 'ok' | 'error';
  workflowId: string;
  title: string;
  completedSteps: Fdc3WorkflowStepResult[];
  failedStep?: Fdc3WorkflowStepResult;
  summary: string;
};

export type Fdc3WorkflowStepResult = {
  stepId: string;
  actionId: string;
  intent: string;
  status: 'ok' | 'error' | 'skipped';
  context: Record<string, unknown>;
  result?: unknown;
  error?: string;
};
```

The transcript should be compact enough for model continuation. Intent handlers must not return unbounded datasets; existing action result normalization should continue bounding large collections.

## Testing Strategy

Unit tests:

- schema accepts a valid two-step workflow
- schema rejects empty steps
- validator rejects unknown actions
- validator rejects future-step bindings
- binding resolver reads object fields and array indexes
- binding writer creates nested objects
- required missing binding fails execution before raising the intent
- optional missing binding keeps the original context
- executor runs steps in order
- executor passes step 1 result into step 2 context
- executor stops on failure by default
- executor continues when `continueOnError` is true
- toolkit descriptors expose workflow tools with `human` and `frontend` sources

Integration-level Jest tests:

- mocked `SearchTrades` result returns an instrument
- workflow executor raises `ViewChart` with the instrument context
- transcript includes both completed steps

Manual verification after implementation:

1. Run `npm run dev:ui`.
2. Open `http://localhost:8001`.
3. Click `login`.
4. Ask the chatbot for a two-step FDC3 workflow.
5. Approve the workflow.
6. Verify the first tile receives the first intent.
7. Verify the second intent receives context derived from the first result.
8. Verify the chat receives and summarizes the transcript.

## Risks

- The model may produce malformed workflow JSON. Mitigation: strict schema and validator reject invalid plans before approval/execution.
- Step result shapes may vary by tile. Mitigation: action metadata should document binding-safe result paths, and required bindings fail loudly.
- The resolver UI may interrupt execution when multiple targets exist. This is acceptable for v1; resolver selection remains the existing platform behavior.
- Workflow approval may become noisy for many steps. V1 is linear and should keep plans short; renderer should show dense ordered rows rather than large cards.

