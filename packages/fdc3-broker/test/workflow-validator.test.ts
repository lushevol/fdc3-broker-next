import { describe, expect, it } from 'vitest';
import { validateWorkflowDefinition } from '../src/workflow-validator';
import type { WorkflowDefinition } from '../src/workflow-types';

const validWorkflow: WorkflowDefinition = {
  workflowId: 'trade.pendingValidation.openChart',
  title: 'Open chart',
  inputSchema: { type: 'object', properties: {}, required: [] },
  steps: [
    {
      id: 'search-trades',
      intent: 'SearchTrades',
      contextTemplate: { type: 'fdc3.trade.query' },
    },
    {
      id: 'view-chart',
      intent: 'ViewChart',
      contextTemplate: { type: 'fdc3.instrument', id: {} },
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
};

describe('validateWorkflowDefinition', () => {
  it('accepts a valid linear workflow definition', () => {
    const result = validateWorkflowDefinition(validWorkflow);

    expect(result.valid).toBe(true);
  });

  it.each([
    ['Workflow id is required', { workflowId: '  ' }],
    ['inputSchema must be an object schema', { inputSchema: { type: 'string' } }],
    ['must include at least one step', { steps: [] }],
    ['has a step without an id', { steps: [{ ...validWorkflow.steps[0], id: ' ' }] }],
    [
      'has duplicate step id search-trades',
      { steps: [validWorkflow.steps[0], { ...validWorkflow.steps[1], id: 'search-trades' }] },
    ],
    ['must include an intent', { steps: [{ ...validWorkflow.steps[0], intent: ' ' }] }],
    [
      'contextTemplate must be an object',
      { steps: [{ ...validWorkflow.steps[0], contextTemplate: null as never }] },
    ],
  ])('rejects invalid definitions: %s', (expectedError, patch) => {
    const result = validateWorkflowDefinition({ ...validWorkflow, ...patch });

    expect(result.valid).toBe(false);
    expect(result.valid ? '' : result.error).toContain(expectedError);
  });

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
    expect(result.valid ? '' : result.error).toContain('future');
  });

  it('rejects bindings from unknown steps and invalid paths', () => {
    const unknownStepResult = validateWorkflowDefinition({
      ...validWorkflow,
      steps: [
        validWorkflow.steps[0],
        {
          ...validWorkflow.steps[1],
          inputBindings: [
            {
              fromStepId: 'missing-step',
              resultPath: '$.value',
              contextPath: '$.id.ticker',
            },
          ],
        },
      ],
    });

    expect(unknownStepResult.valid).toBe(false);
    expect(unknownStepResult.valid ? '' : unknownStepResult.error).toContain('unknown step');

    const invalidPathResult = validateWorkflowDefinition({
      ...validWorkflow,
      steps: [
        validWorkflow.steps[0],
        {
          ...validWorkflow.steps[1],
          inputBindings: [
            {
              fromStepId: 'search-trades',
              resultPath: '$.bad[',
              contextPath: '$.id.ticker',
            },
          ],
        },
      ],
    });

    expect(invalidPathResult.valid).toBe(false);
    expect(invalidPathResult.valid ? '' : invalidPathResult.error).toContain(
      'Invalid workflow path index',
    );
  });
});
