import { describe, expect, it, vi } from 'vitest';
import { WorkflowExecutor } from '../src/workflow-executor';
import type { WorkflowDefinition } from '../src/workflow-types';

const workflow: WorkflowDefinition = {
  workflowId: 'trade.pendingValidation.openChart',
  title: 'Open chart for pending validation trade',
  inputSchema: { type: 'object', properties: {}, required: [] },
  steps: [
    {
      id: 'search-trades',
      intent: 'SearchTrades',
      contextTemplate: {
        type: 'fdc3.trade.query',
        filters: { status: '{{input.status}}' },
      },
    },
    {
      id: 'view-chart',
      intent: 'ViewChart',
      contextTemplate: {
        type: 'fdc3.instrument',
        id: {},
      },
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

describe('WorkflowExecutor', () => {
  it('raises workflow step intents in order and binds prior results into later contexts', async () => {
    const raiseIntent = vi
      .fn()
      .mockResolvedValueOnce({
        getResult: async () => ({ trades: [{ instrument: 'AAPL' }] }),
      })
      .mockResolvedValueOnce({
        getResult: async () => ({ opened: true }),
      });

    const executor = new WorkflowExecutor([workflow], raiseIntent);
    const transcript = await executor.execute('trade.pendingValidation.openChart', {
      status: 'PENDING_VALIDATION',
    });

    expect(transcript.status).toBe('ok');
    expect(raiseIntent).toHaveBeenNthCalledWith(1, 'SearchTrades', {
      type: 'fdc3.trade.query',
      filters: { status: 'PENDING_VALIDATION' },
    });
    expect(raiseIntent).toHaveBeenNthCalledWith(2, 'ViewChart', {
      type: 'fdc3.instrument',
      id: { ticker: 'AAPL' },
    });
    expect(transcript.completedSteps.map((step) => step.stepId)).toEqual([
      'search-trades',
      'view-chart',
    ]);
  });

  it('returns a failed transcript when a required binding cannot be resolved', async () => {
    const raiseIntent = vi.fn().mockResolvedValueOnce({
      getResult: async () => ({ trades: [] }),
    });

    const executor = new WorkflowExecutor([workflow], raiseIntent);
    const transcript = await executor.execute('trade.pendingValidation.openChart', {
      status: 'PENDING_VALIDATION',
    });

    expect(transcript.status).toBe('error');
    expect(transcript.failedStep?.stepId).toBe('view-chart');
    expect(raiseIntent).toHaveBeenCalledTimes(1);
  });
});
