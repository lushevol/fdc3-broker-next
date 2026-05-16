# FDC3 Workflow Capability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add first-class FDC3 workflow capability support so the chatbot can call `raiseWorkflow(workflowId, input)` instead of assembling workflow steps itself.

**Architecture:** Put workflow definitions, validation, result bindings, and linear intent execution in the FDC3 platform packages. Keep the chatbot as a workflow caller that selects a declared workflow id, gathers input, asks approval, and calls the FDC3 agent API.

**Tech Stack:** TypeScript, React 18, Jest/Vitest, Zod or local validators, `packages/fdc3-broker`, `packages/fdc3-agent`, `packages/fdc3-app-directory`, `apps/base` chatbot toolkit.

---

## File Structure

Create:

- `packages/fdc3-broker/src/workflow-types.ts`: workflow definition, binding, transcript, and API types.
- `packages/fdc3-broker/src/workflow-bindings.ts`: safe path parser, result reader, context writer.
- `packages/fdc3-broker/src/workflow-template.ts`: input-to-context template renderer.
- `packages/fdc3-broker/src/workflow-validator.ts`: workflow definition and call validation.
- `packages/fdc3-broker/src/workflow-executor.ts`: sequential workflow runner that delegates each step to broker `raiseIntent`.
- `packages/fdc3-broker/test/workflow-*.test.ts`: package tests for validation, bindings, templates, and execution.

Modify:

- `packages/fdc3-broker/src/broker.ts`: register workflow definitions and expose `raiseWorkflow`.
- `packages/fdc3-broker/src/types.ts`: export workflow API types if this is the existing public type barrel.
- `packages/fdc3-broker/src/index.ts`: export workflow types and executor-facing API.
- `packages/fdc3-agent/src/agent.ts`: add `raiseWorkflow` pass-through to broker.
- `packages/fdc3-agent/src/types.ts`: export workflow API types.
- `packages/fdc3-agent/src/index.ts`: export workflow API.
- `packages/fdc3-app-directory/src/types.ts`: add optional workflow declaration fields.
- `apps/base/src/fdc3/declarations/workflows.json`: local dev workflow declarations.
- `apps/base/src/fdc3/FDC3Integration.tsx`: pass workflows into broker config.
- `apps/base/src/components/ChatbotSidebarV2/toolkit/tools.tsx`: make workflow tools accept `workflowId` and `input`, not steps.
- `apps/base/src/components/ChatbotSidebarV2/toolkit/tool-renderers.tsx`: render declared workflow approval and transcript.

---

### Task 1: Add Broker Workflow Types

**Files:**

- Create: `packages/fdc3-broker/src/workflow-types.ts`
- Modify: `packages/fdc3-broker/src/index.ts`
- Test: `packages/fdc3-broker/test/workflow-types.test.ts`

- [ ] **Step 1: Write type export smoke test**

```ts
import { describe, expect, it } from 'vitest';
import type { WorkflowDefinition, WorkflowTranscript } from '../src';

describe('workflow public types', () => {
  it('exports workflow declaration and transcript types', () => {
    const definition: WorkflowDefinition = {
      workflowId: 'trade.pendingValidation.openChart',
      title: 'Open chart for pending validation trade',
      description: 'Search trades and open a chart',
      inputSchema: { type: 'object', properties: {}, required: [] },
      steps: [
        {
          id: 'search-trades',
          intent: 'SearchTrades',
          contextTemplate: { type: 'fdc3.trade.query' },
        },
      ],
    };

    const transcript: WorkflowTranscript = {
      status: 'ok',
      workflowId: definition.workflowId,
      title: definition.title,
      input: {},
      completedSteps: [],
      summary: 'Completed 0 of 1 workflow steps.',
    };

    expect(transcript.workflowId).toBe(definition.workflowId);
  });
});
```

- [ ] **Step 2: Run failing test**

Run:

```bash
cd packages/fdc3-broker
npm run test -- workflow-types.test.ts
```

Expected: FAIL because workflow types are not exported.

- [ ] **Step 3: Add workflow types**

Add types for:

- `WorkflowDefinition`
- `WorkflowStepDefinition`
- `WorkflowInputBinding`
- `WorkflowOptions`
- `WorkflowResolution`
- `WorkflowStepResult`
- `WorkflowTranscript`
- `WorkflowRegistry`

Use `Record<string, unknown>` for context templates and inputs.

- [ ] **Step 4: Export types**

Export from `packages/fdc3-broker/src/index.ts`.

- [ ] **Step 5: Run test**

Run:

```bash
cd packages/fdc3-broker
npm run test -- workflow-types.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/fdc3-broker/src packages/fdc3-broker/test/workflow-types.test.ts
git commit -m "feat: add fdc3 workflow types"
```

---

### Task 2: Add Broker Workflow Binding Utilities

**Files:**

- Create: `packages/fdc3-broker/src/workflow-bindings.ts`
- Test: `packages/fdc3-broker/test/workflow-bindings.test.ts`

- [ ] **Step 1: Write failing binding tests**

```ts
import { describe, expect, it } from 'vitest';
import { applyWorkflowBindings, readWorkflowPath } from '../src/workflow-bindings';

describe('workflow bindings', () => {
  it('reads values using the supported path subset', () => {
    expect(readWorkflowPath({ trades: [{ instrument: 'AAPL' }] }, '$.trades[0].instrument')).toBe('AAPL');
  });

  it('writes prior result values into a context object', () => {
    const context = applyWorkflowBindings({
      baseContext: { type: 'fdc3.instrument', id: {} },
      priorResults: new Map([['search-trades', { trades: [{ instrument: 'MSFT' }] }]]),
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
});
```

- [ ] **Step 2: Run failing test**

Run:

```bash
cd packages/fdc3-broker
npm run test -- workflow-bindings.test.ts
```

Expected: FAIL because utilities do not exist.

- [ ] **Step 3: Implement path parser and binding application**

Support only:

- `$`
- `.field`
- `[0]`

Reject wildcards, filters, recursive descent, empty fields, and non-numeric indexes.

- [ ] **Step 4: Run test**

Run:

```bash
cd packages/fdc3-broker
npm run test -- workflow-bindings.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/fdc3-broker/src/workflow-bindings.ts packages/fdc3-broker/test/workflow-bindings.test.ts
git commit -m "feat: add fdc3 workflow bindings"
```

---

### Task 3: Add Workflow Template Rendering And Validation

**Files:**

- Create: `packages/fdc3-broker/src/workflow-template.ts`
- Create: `packages/fdc3-broker/src/workflow-validator.ts`
- Test: `packages/fdc3-broker/test/workflow-template.test.ts`
- Test: `packages/fdc3-broker/test/workflow-validator.test.ts`

- [ ] **Step 1: Write failing template test**

```ts
import { describe, expect, it } from 'vitest';
import { renderWorkflowContextTemplate } from '../src/workflow-template';

describe('renderWorkflowContextTemplate', () => {
  it('renders input placeholders inside context templates', () => {
    expect(
      renderWorkflowContextTemplate(
        {
          type: 'fdc3.trade.query',
          filters: { status: '{{input.status}}' },
          question: '{{input.originalRequest}}',
        },
        {
          status: 'PENDING_VALIDATION',
          originalRequest: 'find pending validation trades',
        },
      ),
    ).toEqual({
      type: 'fdc3.trade.query',
      filters: { status: 'PENDING_VALIDATION' },
      question: 'find pending validation trades',
    });
  });
});
```

- [ ] **Step 2: Write failing validator test**

```ts
import { describe, expect, it } from 'vitest';
import { validateWorkflowDefinition } from '../src/workflow-validator';

describe('validateWorkflowDefinition', () => {
  it('rejects bindings from future steps', () => {
    const result = validateWorkflowDefinition({
      workflowId: 'wf',
      title: 'Bad workflow',
      inputSchema: { type: 'object', properties: {}, required: [] },
      steps: [
        {
          id: 'first',
          intent: 'SearchTrades',
          contextTemplate: { type: 'fdc3.trade.query' },
          inputBindings: [
            {
              fromStepId: 'second',
              resultPath: '$.value',
              contextPath: '$.value',
              required: true,
            },
          ],
        },
        {
          id: 'second',
          intent: 'ViewChart',
          contextTemplate: { type: 'fdc3.instrument' },
        },
      ],
    });

    expect(result.valid).toBe(false);
  });
});
```

- [ ] **Step 3: Run failing tests**

Run:

```bash
cd packages/fdc3-broker
npm run test -- workflow-template.test.ts workflow-validator.test.ts
```

Expected: FAIL because modules do not exist.

- [ ] **Step 4: Implement template rendering**

Render only whole-string placeholders:

- `{{input.field}}`
- `{{input.nested.field}}`

Keep non-placeholder strings unchanged. Throw on placeholders that cannot be resolved during required workflow execution.

- [ ] **Step 5: Implement definition validation**

Validate:

- non-empty workflow id
- non-empty steps
- unique step ids
- step intent present
- context template is an object
- binding source is an earlier step
- binding paths use supported syntax

- [ ] **Step 6: Run tests**

Run:

```bash
cd packages/fdc3-broker
npm run test -- workflow-template.test.ts workflow-validator.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add packages/fdc3-broker/src/workflow-template.ts \
  packages/fdc3-broker/src/workflow-validator.ts \
  packages/fdc3-broker/test/workflow-template.test.ts \
  packages/fdc3-broker/test/workflow-validator.test.ts
git commit -m "feat: validate fdc3 workflow definitions"
```

---

### Task 4: Add Broker `raiseWorkflow`

**Files:**

- Create: `packages/fdc3-broker/src/workflow-executor.ts`
- Modify: `packages/fdc3-broker/src/broker.ts`
- Test: `packages/fdc3-broker/test/workflow-executor.test.ts`

- [ ] **Step 1: Write failing broker execution test**

Write a test that registers one workflow with two steps, stubs broker intent raising, and verifies:

- `SearchTrades` runs first
- `ViewChart` runs second
- `ViewChart` context receives the ticker from the first result
- transcript status is `ok`

- [ ] **Step 2: Run failing test**

Run:

```bash
cd packages/fdc3-broker
npm run test -- workflow-executor.test.ts
```

Expected: FAIL because broker has no workflow executor.

- [ ] **Step 3: Implement workflow executor**

The executor should depend on a function:

```ts
type RaiseIntentDependency = (
  intent: string,
  context: Record<string, unknown>,
  target?: unknown,
) => Promise<{ getResult(): Promise<unknown> }>;
```

This keeps workflow execution reusable and easy to test.

- [ ] **Step 4: Add broker registration and API**

Add broker config support for local workflow definitions:

```ts
workflows?: WorkflowDefinition[];
```

Add:

```ts
raiseWorkflow(workflowId: string, input?: Record<string, unknown>, options?: WorkflowOptions): Promise<WorkflowResolution>
findWorkflow(workflowId: string): Promise<WorkflowDefinition | null>
findWorkflowsByInput(input?: Record<string, unknown>): Promise<WorkflowDefinition[]>
```

- [ ] **Step 5: Run broker workflow tests**

Run:

```bash
cd packages/fdc3-broker
npm run test -- workflow-executor.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/fdc3-broker/src packages/fdc3-broker/test/workflow-executor.test.ts
git commit -m "feat: execute fdc3 workflows in broker"
```

---

### Task 5: Expose Workflow API Through FDC3 Agent

**Files:**

- Modify: `packages/fdc3-agent/src/agent.ts`
- Modify: `packages/fdc3-agent/src/types.ts`
- Modify: `packages/fdc3-agent/src/index.ts`
- Test: `packages/fdc3-agent/test/workflow-agent.test.ts`

- [ ] **Step 1: Write failing agent test**

Test that `getAgentApi().raiseWorkflow('wf', input)` delegates to the active broker `raiseWorkflow`.

- [ ] **Step 2: Run failing test**

Run:

```bash
cd packages/fdc3-agent
npm run test -- workflow-agent.test.ts
```

Expected: FAIL because agent has no workflow API.

- [ ] **Step 3: Add pass-through API**

Add `raiseWorkflow`, `findWorkflow`, and `findWorkflowsByInput` to the agent API surface.

- [ ] **Step 4: Run test**

Run:

```bash
cd packages/fdc3-agent
npm run test -- workflow-agent.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/fdc3-agent/src packages/fdc3-agent/test/workflow-agent.test.ts
git commit -m "feat: expose fdc3 workflow api through agent"
```

---

### Task 6: Load Local Workflows In Base

**Files:**

- Create: `apps/base/src/fdc3/declarations/workflows.json`
- Modify: `apps/base/src/fdc3/FDC3Integration.tsx`
- Test: `apps/base/src/fdc3/FDC3Integration.workflow.test.tsx` or nearest existing FDC3 integration test

- [ ] **Step 1: Add local workflow declaration**

Add `trade.pendingValidation.openChart` workflow using:

- input `status`
- first step `SearchTrades`
- second step `ViewChart`
- binding from `$.trades[0].instrument` to `$.id.ticker`

- [ ] **Step 2: Pass workflows to broker config**

Import `workflows.json` and add it to broker config.

- [ ] **Step 3: Add integration test**

Verify broker config receives at least one workflow and the workflow id is `trade.pendingValidation.openChart`.

- [ ] **Step 4: Run test**

Run:

```bash
cd apps/base
npx jest --runTestsByPath src/fdc3/FDC3Integration.workflow.test.tsx --runInBand
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/base/src/fdc3 apps/base/src/fdc3/FDC3Integration.tsx
git commit -m "feat: register local fdc3 workflows"
```

---

### Task 7: Change Chatbot Workflow Tools To Raise Declared Workflow

**Files:**

- Modify: `apps/base/src/components/ChatbotSidebarV2/toolkit/tools.tsx`
- Modify: `apps/base/src/components/ChatbotSidebarV2/toolkit/tool-renderers.tsx`
- Test: `apps/base/src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx`

- [ ] **Step 1: Update toolkit tests**

Assert:

- `propose_fdc3_workflow` is `human`
- `execute_fdc3_workflow` is `frontend`
- tool parameters include `workflowId` and `input`
- tool parameters do not include `steps`

- [ ] **Step 2: Implement chatbot tool contract**

`execute_fdc3_workflow` should call:

```ts
const resolution = await getAgentApi().raiseWorkflow(workflowId, input);
return resolution.getResult();
```

The chatbot should never pass raw workflow steps.

- [ ] **Step 3: Update renderers**

Approval renderer shows:

- workflow id
- input preview
- declared title/description when available

Transcript renderer shows:

- status
- summary
- completed step rows
- failed step error

- [ ] **Step 4: Run tests**

Run:

```bash
cd apps/base
npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx --runInBand
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/base/src/components/ChatbotSidebarV2/toolkit
git commit -m "feat: let chatbot raise fdc3 workflows"
```

---

### Task 8: Verification

- [ ] **Step 1: Run package workflow tests**

```bash
cd packages/fdc3-broker
npm run test -- workflow-types.test.ts workflow-bindings.test.ts workflow-template.test.ts workflow-validator.test.ts workflow-executor.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run agent workflow tests**

```bash
cd packages/fdc3-agent
npm run test -- workflow-agent.test.ts
```

Expected: PASS.

- [ ] **Step 3: Run base chatbot FDC3 tests**

```bash
cd apps/base
npx jest --runTestsByPath src/components/ChatbotSidebarV2/toolkit/tools.fdc3.test.tsx --runInBand
```

Expected: PASS.

- [ ] **Step 4: Manual UI verification**

```bash
npm run dev:ui
```

Then verify at `http://localhost:8001`:

1. Login.
2. Ask: `Find pending validation trades and open the chart for the first instrument`.
3. Approval shows `trade.pendingValidation.openChart`.
4. Chatbot execution calls `raiseWorkflow`.
5. Workflow raises `SearchTrades`.
6. Workflow maps result into `ViewChart`.
7. Chat receives final transcript.

