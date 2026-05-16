# FDC3 Intent Workflow Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a browser-side FDC3 workflow engine that lets the chatbot propose, approve, and execute linear multi-intent FDC3 workflows, including passing prior intent results into later intent contexts.

**Architecture:** Extend the existing `apps/base` chatbot FDC3 toolkit. Keep FDC3 execution in the browser shell, validate declaration-backed workflow plans before execution, resolve a small safe path syntax for result bindings, and execute each step sequentially through the existing FDC3 action executor.

**Tech Stack:** React 18, TypeScript, Zod, Jest, `chat-protocol-ui`, `chat-protocol-contract`, `ratan-fdc3-agent`, existing FDC3 declaration JSON.

---

## File Structure

Create:

- `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-types.ts`: exported workflow plan, binding, validation, and transcript types.
- `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-schema.ts`: Zod schemas and inferred runtime types for workflow tool parameters.
- `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-bindings.ts`: safe path parsing, value reading, and immutable context writing.
- `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-validator.ts`: declaration-backed structural validation.
- `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-executor.ts`: sequential workflow runner.
- `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-tool-description.ts`: compact action catalog text for LLM tool descriptions.
- Matching Jest tests for each new module.

Modify:

- `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.ts`: accept context override input and preserve current one-action behavior.
- `apps/base/src/components/ChatbotSidebarV2/toolkit/tools.tsx`: add `propose_fdc3_workflow` and `execute_fdc3_workflow`.
- `apps/base/src/components/ChatbotSidebarV2/toolkit/tool-renderers.tsx`: add workflow approval and transcript renderers.
- `apps/base/src/components/ChatbotSidebarV2/toolkit/use-fdc3-action-executor.ts`: create and pass the workflow executor where runtime toolkit is assembled.

---

### Task 1: Add Workflow Types And Schemas

**Files:**

- Create: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-types.ts`
- Create: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-schema.ts`
- Test: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-schema.test.ts`

- [ ] **Step 1: Write failing schema tests**

```ts
import { describe, expect, it } from '@jest/globals';
import { fdc3WorkflowPlanSchema } from './fdc3-workflow-schema';

describe('fdc3WorkflowPlanSchema', () => {
  it('accepts a two-step workflow with a required result binding', () => {
    const parsed = fdc3WorkflowPlanSchema.parse({
      workflowId: 'wf-trade-chart',
      title: 'Find trades and open chart',
      originalRequest: 'Find pending validation trades and open the chart',
      steps: [
        {
          id: 'search-trades',
          actionId: 'trade-blotter.pending-validation',
          intent: 'SearchTrades',
          context: { type: 'fdc3.trade.query', filters: { status: 'PENDING_VALIDATION' } },
        },
        {
          id: 'view-chart',
          actionId: 'chart.view-instrument',
          intent: 'ViewChart',
          context: { type: 'fdc3.instrument', id: {} },
          inputBindings: [
            {
              fromStepId: 'search-trades',
              resultPath: '$.trades[0].instrument',
              contextPath: '$.id.ticker',
              required: true,
            },
          ],
        },
      ],
    });

    expect(parsed.steps).toHaveLength(2);
  });

  it('rejects workflows without steps', () => {
    expect(() =>
      fdc3WorkflowPlanSchema.parse({
        workflowId: 'wf-empty',
        title: 'Empty',
        originalRequest: 'do nothing',
        steps: [],
      }),
    ).toThrow();
  });
});
```

- [ ] **Step 2: Run the failing test**

Run:

```bash
cd apps/base
npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-schema.test.ts --runInBand
```

Expected: FAIL because the schema module does not exist.

- [ ] **Step 3: Add the workflow types**

```ts
export type Fdc3WorkflowInputBinding = {
  fromStepId: string;
  resultPath: string;
  contextPath: string;
  required: boolean;
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

export type Fdc3WorkflowPlan = {
  workflowId: string;
  title: string;
  originalRequest: string;
  steps: Fdc3WorkflowStep[];
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

export type Fdc3WorkflowTranscript = {
  status: 'ok' | 'error';
  workflowId: string;
  title: string;
  completedSteps: Fdc3WorkflowStepResult[];
  failedStep?: Fdc3WorkflowStepResult;
  summary: string;
};
```

- [ ] **Step 4: Add the Zod schemas**

```ts
import { z } from 'zod';

export const fdc3WorkflowInputBindingSchema = z.object({
  fromStepId: z.string().min(1),
  resultPath: z.string().min(1),
  contextPath: z.string().min(1),
  required: z.boolean(),
});

export const fdc3WorkflowStepSchema = z.object({
  id: z.string().min(1),
  actionId: z.string().min(1),
  intent: z.string().min(1),
  context: z.record(z.string(), z.unknown()),
  targetAppId: z.string().min(1).optional(),
  timeoutMs: z.number().int().min(1000).max(60000).optional(),
  continueOnError: z.boolean().optional(),
  inputBindings: z.array(fdc3WorkflowInputBindingSchema).optional(),
});

export const fdc3WorkflowPlanSchema = z.object({
  workflowId: z.string().min(1),
  title: z.string().min(1),
  originalRequest: z.string().min(1),
  steps: z.array(fdc3WorkflowStepSchema).min(1),
});
```

- [ ] **Step 5: Run the schema test**

Run:

```bash
cd apps/base
npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-schema.test.ts --runInBand
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-types.ts \
  apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-schema.ts \
  apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-schema.test.ts
git commit -m "feat: add fdc3 workflow schema"
```

---

### Task 2: Add Binding Path Resolver

**Files:**

- Create: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-bindings.ts`
- Test: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-bindings.test.ts`

- [ ] **Step 1: Write failing binding tests**

```ts
import { describe, expect, it } from '@jest/globals';
import { applyWorkflowBindings, readWorkflowPath } from './fdc3-workflow-bindings';

describe('fdc3 workflow bindings', () => {
  it('reads object fields and array indexes', () => {
    const value = readWorkflowPath(
      { trades: [{ instrument: { ticker: 'AAPL' } }] },
      '$.trades[0].instrument.ticker',
    );

    expect(value).toBe('AAPL');
  });

  it('writes a required binding into the next step context', () => {
    const context = applyWorkflowBindings({
      baseContext: { type: 'fdc3.instrument', id: {} },
      priorResults: new Map([
        ['search-trades', { trades: [{ instrument: 'MSFT' }] }],
      ]),
      bindings: [
        {
          fromStepId: 'search-trades',
          resultPath: '$.trades[0].instrument',
          contextPath: '$.id.ticker',
          required: true,
        },
      ],
    });

    expect(context).toEqual({ type: 'fdc3.instrument', id: { ticker: 'MSFT' } });
  });

  it('throws when a required binding is missing', () => {
    expect(() =>
      applyWorkflowBindings({
        baseContext: { type: 'fdc3.instrument', id: {} },
        priorResults: new Map([['search-trades', { trades: [] }]]),
        bindings: [
          {
            fromStepId: 'search-trades',
            resultPath: '$.trades[0].instrument',
            contextPath: '$.id.ticker',
            required: true,
          },
        ],
      }),
    ).toThrow('Required workflow binding could not be resolved');
  });
});
```

- [ ] **Step 2: Run the failing test**

Run:

```bash
cd apps/base
npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-bindings.test.ts --runInBand
```

Expected: FAIL because the binding module does not exist.

- [ ] **Step 3: Implement the binding resolver**

Implement these exported functions:

```ts
export function readWorkflowPath(source: unknown, path: string): unknown;

export function applyWorkflowBindings(input: {
  baseContext: Record<string, unknown>;
  priorResults: Map<string, unknown>;
  bindings?: Fdc3WorkflowInputBinding[];
}): Record<string, unknown>;
```

Rules:

- Accept `$`, `.field`, and `[index]`.
- Reject wildcards, filters, recursive descent, empty fields, and non-numeric indexes.
- Clone the base context before writing.
- Create missing object containers for context writes.
- Return unchanged context for missing optional bindings.
- Throw `Required workflow binding could not be resolved: <fromStepId> <resultPath>` for missing required values.

- [ ] **Step 4: Run binding tests**

Run:

```bash
cd apps/base
npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-bindings.test.ts --runInBand
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-bindings.ts \
  apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-bindings.test.ts
git commit -m "feat: add fdc3 workflow bindings"
```

---

### Task 3: Add Declaration-Backed Workflow Validator

**Files:**

- Create: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-validator.ts`
- Test: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-validator.test.ts`

- [ ] **Step 1: Write failing validator tests**

```ts
import { describe, expect, it } from '@jest/globals';
import type { Fdc3ChatActionDefinition } from './fdc3-action-definitions';
import { validateFdc3WorkflowPlan } from './fdc3-workflow-validator';

const actions: Fdc3ChatActionDefinition[] = [
  {
    id: 'trade-blotter.pending-validation',
    title: 'Search trades',
    description: 'Search trades',
    approvalTitle: 'Search trades',
    approvalBody: 'Search trades',
    intent: 'SearchTrades',
    contextType: 'fdc3.trade.query',
    defaultContext: { type: 'fdc3.trade.query' },
    argumentSchema: {},
    resultSchemaHint: {},
  },
  {
    id: 'chart.view-instrument',
    title: 'View chart',
    description: 'View chart',
    approvalTitle: 'View chart',
    approvalBody: 'View chart',
    intent: 'ViewChart',
    contextType: 'fdc3.instrument',
    defaultContext: { type: 'fdc3.instrument' },
    argumentSchema: {},
    resultSchemaHint: {},
  },
];

describe('validateFdc3WorkflowPlan', () => {
  it('accepts a valid linear workflow', () => {
    const result = validateFdc3WorkflowPlan(
      {
        workflowId: 'wf',
        title: 'Workflow',
        originalRequest: 'search then chart',
        steps: [
          {
            id: 'search',
            actionId: 'trade-blotter.pending-validation',
            intent: 'SearchTrades',
            context: { type: 'fdc3.trade.query' },
          },
          {
            id: 'chart',
            actionId: 'chart.view-instrument',
            intent: 'ViewChart',
            context: { type: 'fdc3.instrument', id: {} },
            inputBindings: [
              {
                fromStepId: 'search',
                resultPath: '$.trades[0].instrument',
                contextPath: '$.id.ticker',
                required: true,
              },
            ],
          },
        ],
      },
      actions,
    );

    expect(result.valid).toBe(true);
  });

  it('rejects bindings from future steps', () => {
    const result = validateFdc3WorkflowPlan(
      {
        workflowId: 'wf',
        title: 'Workflow',
        originalRequest: 'search then chart',
        steps: [
          {
            id: 'search',
            actionId: 'trade-blotter.pending-validation',
            intent: 'SearchTrades',
            context: { type: 'fdc3.trade.query' },
            inputBindings: [
              {
                fromStepId: 'chart',
                resultPath: '$.value',
                contextPath: '$.value',
                required: true,
              },
            ],
          },
          {
            id: 'chart',
            actionId: 'chart.view-instrument',
            intent: 'ViewChart',
            context: { type: 'fdc3.instrument' },
          },
        ],
      },
      actions,
    );

    expect(result.valid).toBe(false);
    expect(result.error).toContain('future');
  });
});
```

- [ ] **Step 2: Run the failing test**

Run:

```bash
cd apps/base
npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-validator.test.ts --runInBand
```

Expected: FAIL because the validator module does not exist.

- [ ] **Step 3: Implement validator**

Export:

```ts
export type Fdc3WorkflowValidationResult =
  | { valid: true }
  | { valid: false; error: string };

export function validateFdc3WorkflowPlan(
  plan: Fdc3WorkflowPlan,
  actions?: Fdc3ChatActionDefinition[],
): Fdc3WorkflowValidationResult;
```

Implementation details:

- Default `actions` to `getFdc3ChatActionDefinitions()`.
- Build an action map by action id.
- Reject duplicate step ids.
- Reject unknown action ids.
- Reject mismatched step intent and action intent.
- Reject non-object contexts.
- Reject binding references where the source step index is greater than or equal to the current step index.
- Reuse path parser validation from `fdc3-workflow-bindings.ts`.

- [ ] **Step 4: Run validator tests**

Run:

```bash
cd apps/base
npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-validator.test.ts --runInBand
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-validator.ts \
  apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-validator.test.ts
git commit -m "feat: validate fdc3 workflow plans"
```

---

### Task 4: Let The Action Executor Accept Step Context

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.ts`
- Test: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.test.ts`

- [ ] **Step 1: Add failing context override test**

Add this test to `fdc3-action-executor.test.ts`:

```ts
it('raises the resolved intent with an explicit workflow context override', async () => {
  const raiseIntent = jest.fn().mockResolvedValue({
    getResult: async () => ({ summary: 'chart opened' }),
  });

  const executor = createFdc3ActionExecutor({
    getAgentApi: () => ({ raiseIntent }),
  });

  await executor.execute(
    {
      actionId: 'trade-blotter.pending-validation',
      context: { type: 'fdc3.trade.query', filters: { status: 'PENDING_VALIDATION' } },
    },
    { continuationPayload: true },
  );

  expect(raiseIntent).toHaveBeenCalledWith('SearchTrades', {
    type: 'fdc3.trade.query',
    filters: { status: 'PENDING_VALIDATION' },
  });
});
```

- [ ] **Step 2: Run the failing test**

Run:

```bash
cd apps/base
npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.test.ts --runInBand
```

Expected: FAIL because `execute` input only accepts `actionId`.

- [ ] **Step 3: Update executor input type**

Change:

```ts
export type Fdc3ActionExecutor = {
  execute(input: { actionId: string }, options?: Fdc3ActionExecuteOptions): Promise<unknown>;
};
```

To:

```ts
export type Fdc3ActionExecutorInput = {
  actionId: string;
  context?: Record<string, unknown>;
};

export type Fdc3ActionExecutor = {
  execute(input: Fdc3ActionExecutorInput, options?: Fdc3ActionExecuteOptions): Promise<unknown>;
};
```

Then raise:

```ts
const context = input.context ?? action.defaultContext;
const resolution = await getFdc3Api().raiseIntent(action.intent, context);
```

- [ ] **Step 4: Run action executor tests**

Run:

```bash
cd apps/base
npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.test.ts --runInBand
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.ts \
  apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.test.ts
git commit -m "feat: allow fdc3 action context overrides"
```

---

### Task 5: Add Sequential Workflow Executor

**Files:**

- Create: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-executor.ts`
- Test: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-executor.test.ts`

- [ ] **Step 1: Write failing executor tests**

```ts
import { describe, expect, it, jest } from '@jest/globals';
import type { Fdc3ActionExecutor } from './fdc3-action-executor';
import { createFdc3WorkflowExecutor } from './fdc3-workflow-executor';

describe('createFdc3WorkflowExecutor', () => {
  it('executes steps in order and passes prior result into the next context', async () => {
    const actionExecutor: Fdc3ActionExecutor = {
      execute: jest
        .fn()
        .mockResolvedValueOnce({
          status: 'ok',
          intent: 'SearchTrades',
          trades: [{ instrument: 'AAPL' }],
          summary: 'found trades',
          totalCount: 1,
        })
        .mockResolvedValueOnce({
          status: 'ok',
          intent: 'ViewChart',
          summary: 'chart opened',
          totalCount: 0,
          trades: [],
        }),
    };

    const executor = createFdc3WorkflowExecutor({ actionExecutor });
    const transcript = await executor.execute({
      workflowId: 'wf',
      title: 'Trade chart workflow',
      originalRequest: 'search trades and chart first instrument',
      steps: [
        {
          id: 'search',
          actionId: 'trade-blotter.pending-validation',
          intent: 'SearchTrades',
          context: { type: 'fdc3.trade.query', filters: { status: 'PENDING_VALIDATION' } },
        },
        {
          id: 'chart',
          actionId: 'chart.view-instrument',
          intent: 'ViewChart',
          context: { type: 'fdc3.instrument', id: {} },
          inputBindings: [
            {
              fromStepId: 'search',
              resultPath: '$.trades[0].instrument',
              contextPath: '$.id.ticker',
              required: true,
            },
          ],
        },
      ],
    });

    expect(transcript.status).toBe('ok');
    expect(actionExecutor.execute).toHaveBeenNthCalledWith(
      2,
      {
        actionId: 'chart.view-instrument',
        context: { type: 'fdc3.instrument', id: { ticker: 'AAPL' } },
      },
      { continuationPayload: true },
    );
  });

  it('stops when a required binding cannot be resolved', async () => {
    const actionExecutor: Fdc3ActionExecutor = {
      execute: jest.fn().mockResolvedValueOnce({
        status: 'ok',
        intent: 'SearchTrades',
        trades: [],
      }),
    };

    const executor = createFdc3WorkflowExecutor({ actionExecutor });
    const transcript = await executor.execute({
      workflowId: 'wf',
      title: 'Trade chart workflow',
      originalRequest: 'search trades and chart first instrument',
      steps: [
        {
          id: 'search',
          actionId: 'trade-blotter.pending-validation',
          intent: 'SearchTrades',
          context: { type: 'fdc3.trade.query' },
        },
        {
          id: 'chart',
          actionId: 'chart.view-instrument',
          intent: 'ViewChart',
          context: { type: 'fdc3.instrument', id: {} },
          inputBindings: [
            {
              fromStepId: 'search',
              resultPath: '$.trades[0].instrument',
              contextPath: '$.id.ticker',
              required: true,
            },
          ],
        },
      ],
    });

    expect(transcript.status).toBe('error');
    expect(transcript.failedStep?.stepId).toBe('chart');
    expect(actionExecutor.execute).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run the failing test**

Run:

```bash
cd apps/base
npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-executor.test.ts --runInBand
```

Expected: FAIL because the executor module does not exist.

- [ ] **Step 3: Implement workflow executor**

Export:

```ts
export type Fdc3WorkflowExecutor = {
  execute(plan: Fdc3WorkflowPlan): Promise<Fdc3WorkflowTranscript>;
};

export function createFdc3WorkflowExecutor(deps: {
  actionExecutor: Fdc3ActionExecutor;
}): Fdc3WorkflowExecutor;
```

Execution behavior:

- Validate plan with `validateFdc3WorkflowPlan`.
- Keep `priorResults` as `Map<string, unknown>`.
- For each step:
  - apply bindings to `step.context`
  - call `actionExecutor.execute({ actionId: step.actionId, context }, { continuationPayload: true })`
  - if returned record has `status: 'error'`, create failed transcript entry
  - otherwise store result by `step.id`
- Stop on error unless `continueOnError` is true.
- Return `summary` as `Completed X of Y workflow steps.` or `Workflow failed at step <id>: <message>`.

- [ ] **Step 4: Run workflow executor tests**

Run:

```bash
cd apps/base
npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-executor.test.ts --runInBand
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-executor.ts \
  apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-executor.test.ts
git commit -m "feat: execute linear fdc3 workflows"
```

---

### Task 6: Add Workflow Chat Tools

**Files:**

- Create: `apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-tool-description.ts`
- Modify: `apps/base/src/components/ChatbotSidebarV2/toolkit/tools.tsx`
- Test: `apps/base/src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx`

- [ ] **Step 1: Add failing toolkit descriptor test**

Add expectations that:

```ts
expect(descriptors).toEqual(
  expect.arrayContaining([
    expect.objectContaining({ name: 'propose_fdc3_workflow', source: 'human' }),
    expect.objectContaining({ name: 'execute_fdc3_workflow', source: 'frontend' }),
  ]),
);
```

Also assert:

```ts
expect(runtimeToolkit.propose_fdc3_workflow.type).toBe('human');
expect(runtimeToolkit.execute_fdc3_workflow.type).toBe('frontend');
```

- [ ] **Step 2: Run failing toolkit tests**

Run:

```bash
cd apps/base
npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx --runInBand
```

Expected: FAIL because workflow tools are not registered.

- [ ] **Step 3: Add workflow tool description helper**

Implement a helper that returns compact rules:

```ts
export function getFdc3WorkflowCatalogDescription(): string {
  return [
    'Build only linear FDC3 workflows.',
    'Every step actionId must come from this catalog:',
    ...getFdc3ChatActionDefinitions().map(
      (action) => `${action.id}: intent=${action.intent}, contextType=${action.contextType}`,
    ),
    'Use inputBindings only from earlier steps.',
    'Use required=true when the next step cannot run without the value.',
  ].join(' ');
}
```

- [ ] **Step 4: Register workflow tools in `tools.tsx`**

Add `workflowExecutor?: Fdc3WorkflowExecutor` to runtime deps.

Add:

```ts
propose_fdc3_workflow: {
  type: 'human',
  description: `Ask the user to approve a linear declaration-backed FDC3 workflow. ${workflowCatalogDescription}`,
  parameters: fdc3WorkflowPlanSchema,
  render: Fdc3WorkflowApprovalTool,
}
```

When `workflowExecutor` exists, add:

```ts
execute_fdc3_workflow: {
  type: 'frontend',
  description: 'Execute an approved linear FDC3 workflow in the browser shell and return the transcript.',
  parameters: fdc3WorkflowPlanSchema,
  execute: async (input) => workflowExecutor.execute(input as Fdc3WorkflowPlan),
  render: Fdc3WorkflowTranscriptTool,
}
```

- [ ] **Step 5: Run toolkit tests**

Run:

```bash
cd apps/base
npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx --runInBand
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/base/src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-tool-description.ts \
  apps/base/src/components/ChatbotSidebarV2/toolkit/tools.tsx \
  apps/base/src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx
git commit -m "feat: expose fdc3 workflow chat tools"
```

---

### Task 7: Add Workflow Renderers

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebarV2/toolkit/tool-renderers.tsx`
- Test: `apps/base/src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx`

- [ ] **Step 1: Add failing renderer tests**

Add render tests that:

- render `Fdc3WorkflowApprovalTool` with two steps
- assert step ids, intents, and binding labels appear
- render `Fdc3WorkflowTranscriptTool` with one completed and one failed step
- assert the failed step error appears

- [ ] **Step 2: Run failing renderer tests**

Run:

```bash
cd apps/base
npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx --runInBand
```

Expected: FAIL because renderers do not exist.

- [ ] **Step 3: Implement renderers**

Add:

```ts
export function Fdc3WorkflowApprovalTool({ args }: ToolRenderProps) {
  const plan = asRecord(args);
  const steps = Array.isArray(plan?.steps) ? plan.steps : [];
  return (
    <div>
      <div>FDC3 workflow approval</div>
      <div>{asString(plan?.title) ?? 'Untitled workflow'}</div>
      {steps.map((step, index) => {
        const record = asRecord(step);
        return (
          <div key={asString(record?.id) ?? index}>
            <span>{index + 1}</span>
            <span>{asString(record?.id)}</span>
            <span>{asString(record?.intent)}</span>
          </div>
        );
      })}
    </div>
  );
}
```

Add a similar `Fdc3WorkflowTranscriptTool` that renders transcript status, summary, completed step rows, and failed step error. Use compact un-nested rows consistent with existing toolkit renderers.

- [ ] **Step 4: Run renderer tests**

Run:

```bash
cd apps/base
npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx --runInBand
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/base/src/components/ChatbotSidebarV2/toolkit/tool-renderers.tsx \
  apps/base/src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx
git commit -m "feat: render fdc3 workflow approvals"
```

---

### Task 8: Wire Runtime Executor Into The Sidebar

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebarV2/toolkit/use-fdc3-action-executor.ts`
- Modify caller that invokes `createRuntimeToolkit`, if separate from the hook
- Test: existing FDC3 toolkit tests plus the nearest hook/component test if present

- [ ] **Step 1: Locate runtime toolkit assembly**

Run:

```bash
rg -n "createRuntimeToolkit|useFdc3ActionExecutor|runtimeToolkit" apps/base/src/components/ChatbotSidebarV2 apps/base/src -g '*.{ts,tsx}'
```

Expected: identify where `fdc3Executor` is passed into `createRuntimeToolkit`.

- [ ] **Step 2: Add workflow executor construction**

In the hook/module that already creates `fdc3Executor`, create:

```ts
const workflowExecutor = useMemo(
  () => createFdc3WorkflowExecutor({ actionExecutor: fdc3Executor }),
  [fdc3Executor],
);
```

Pass both:

```ts
createRuntimeToolkit({ fdc3Executor, workflowExecutor })
```

- [ ] **Step 3: Run focused tests**

Run:

```bash
cd apps/base
npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/fdc3-action-definitions.test.ts src/components/ChatbotSidebarV2/toolkit/fdc3-action-provider.test.ts src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.test.ts src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx --runInBand
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add apps/base/src/components/ChatbotSidebarV2
git commit -m "feat: wire fdc3 workflow executor into chatbot"
```

---

### Task 9: Verify Full Workflow Slice

**Files:**

- No new files unless a small integration test is added near existing toolkit tests.

- [ ] **Step 1: Run all FDC3 workflow and action toolkit tests**

Run:

```bash
cd apps/base
npx jest --runTestsByPath \
  src/components/ChatbotSidebarV2/toolkit/fdc3-action-definitions.test.ts \
  src/components/ChatbotSidebarV2/toolkit/fdc3-action-provider.test.ts \
  src/components/ChatbotSidebarV2/toolkit/fdc3-action-executor.test.ts \
  src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-schema.test.ts \
  src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-bindings.test.ts \
  src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-validator.test.ts \
  src/components/ChatbotSidebarV2/toolkit/fdc3-workflow-executor.test.ts \
  src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx \
  --runInBand
```

Expected: PASS.

- [ ] **Step 2: Run base lint for touched files if the repo command is stable**

Run:

```bash
cd apps/base
npm run lint
```

Expected: PASS, or document pre-existing lint failures with exact output.

- [ ] **Step 3: Run manual UI verification**

Run:

```bash
npm run dev:ui
```

Open `http://localhost:8001` and verify:

1. Click `login`.
2. Ask for a two-step FDC3 workflow.
3. Approve the workflow.
4. Confirm step 1 intent runs.
5. Confirm step 2 context includes data from step 1 result.
6. Confirm chat receives a final transcript.

- [ ] **Step 4: Final commit if verification fixes were required**

```bash
git status --short
git add <changed-files>
git commit -m "test: verify fdc3 workflow execution"
```

