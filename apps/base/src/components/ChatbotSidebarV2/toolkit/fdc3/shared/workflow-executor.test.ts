import { describe, expect, it, jest } from '@jest/globals';

jest.mock(
  'ratan-fdc3-agent',
  () => ({ getAgentApi: jest.fn() }),
  { virtual: true },
);

import { createFdc3WorkflowExecutor, getStandardFdc3Workflows } from './workflow-executor';

describe('createFdc3WorkflowExecutor', () => {
  it('adapts declaration bindings to the standard workflow runtime format', () => {
    expect(getStandardFdc3Workflows()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          workflowId: 'trade.workflow.insight',
          steps: expect.arrayContaining([
            expect.objectContaining({
              id: 'discover-trade',
              contextTemplate: {
                type: 'fdc3.trade.query',
                filters: { status: '${input.status}' },
              },
            }),
          ]),
        }),
      ]),
    );
  });

  it('executes the declared workflow through the standard orchestrator and returns its transcript', async () => {
    const raiseIntent = jest.fn().mockImplementation(async (intent: string) => ({
      getResult: async () => {
        if (intent === 'DiscoverWorkflowTrades') {
          return { trade: { tradeId: 'TR-42' } };
        }
        if (intent === 'PriceWorkflowTrade') {
          return { price: { value: 101.25 } };
        }
        return { assessment: 'LOW' };
      },
    }));
    const onEvent = jest.fn();
    const executor = createFdc3WorkflowExecutor({
      getAgentApi: () => ({ raiseIntent }),
    });

    const transcript = await executor.execute({
      workflowId: 'trade.workflow.insight',
      input: { status: 'PENDING_VALIDATION' },
      onEvent,
    });

    expect(transcript).toMatchObject({
      status: 'success',
      workflowId: 'trade.workflow.insight',
      summary: 'Completed 3 of 3 workflow steps.',
    });
    expect(raiseIntent).toHaveBeenNthCalledWith(
      1,
      'DiscoverWorkflowTrades',
      expect.objectContaining({ type: 'fdc3.trade.query' }),
      { appId: 'template_tile_workflow_discovery' },
    );
    expect(raiseIntent).toHaveBeenNthCalledWith(
      2,
      'PriceWorkflowTrade',
      expect.objectContaining({ trade: { tradeId: 'TR-42' } }),
      { appId: 'template_tile_workflow_pricing' },
    );
    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'workflow.completed' }),
    );
  });

  it('uses a declared single-value enum as the safe default for omitted workflow input', async () => {
    const raiseIntent = jest.fn().mockImplementation(async (intent: string) => ({
      getResult: async () =>
        intent === 'SearchTrades'
          ? { trades: [{ instrument: 'ACME' }] }
          : { opened: true },
    }));
    const executor = createFdc3WorkflowExecutor({
      getAgentApi: () => ({ raiseIntent }),
    });

    const transcript = await executor.execute({
      workflowId: 'trade.pendingValidation.openChart',
      input: {},
    });

    expect(transcript).toMatchObject({
      status: 'success',
      summary: 'Completed 2 of 2 workflow steps.',
    });
    expect(raiseIntent).toHaveBeenNthCalledWith(
      1,
      'SearchTrades',
      expect.objectContaining({ filters: { status: 'PENDING_VALIDATION' } }),
      undefined,
    );
  });
});
