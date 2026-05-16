import { describe, expect, it } from 'vitest';
import { validateWorkflowDefinition } from '../src/workflow-validator';

describe('validateWorkflowDefinition', () => {
  it('accepts a valid linear workflow definition', () => {
    const result = validateWorkflowDefinition({
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
    });

    expect(result.valid).toBe(true);
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
});
