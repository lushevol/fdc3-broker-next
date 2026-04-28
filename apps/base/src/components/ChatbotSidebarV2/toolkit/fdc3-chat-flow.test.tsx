import { describe, expect, it, jest } from '@jest/globals';
jest.mock(
  'ratan-fdc3-agent',
  () => ({
    getAgentApi: jest.fn(),
  }),
  { virtual: true },
);
jest.mock(
  'chat-protocol-ui',
  () => ({
    ChartContainer: ({ children }: { children: React.ReactNode }) => children,
    ChartTooltip: () => null,
    ChartTooltipContent: () => null,
  }),
  { virtual: true },
);
jest.mock('recharts', () => ({
  CartesianGrid: () => null,
  Line: () => null,
  LineChart: ({ children }: { children: React.ReactNode }) => children,
  XAxis: () => null,
}));

import { createFdc3ActionExecutor } from './fdc3-action-executor';
import { createRuntimeToolkit } from './tools';

type ExecuteFdc3ActionTool = {
  execute: (input: { actionId: string }) => Promise<unknown>;
};

describe('FDC3 chat flow', () => {
  it('returns a compact continuation payload for the assistant after intent execution', async () => {
    const raiseIntent = jest.fn().mockResolvedValue({
      getResult: async () => ({
        totalCount: '12',
        summary: '12 pending validation trades found',
        trades: Array.from({ length: 12 }, (_, index) => ({ tradeId: `TR-${index + 1}` })),
        tile: { appId: 'template_tile_trade_blotter', instanceId: 'resolved-by-broker' },
      }),
    });
    const executor = createFdc3ActionExecutor({
      getAgentApi: () => ({ raiseIntent }),
    });
    const toolkit = createRuntimeToolkit({ fdc3Executor: executor });

    const result = await (toolkit.execute_fdc3_action as ExecuteFdc3ActionTool).execute({
      actionId: 'trade-blotter.pending-validation',
    });

    expect(result).toEqual({
      status: 'ok',
      intent: 'SearchTrades',
      context: {
        type: 'fdc3.trade.query',
        filters: { status: 'PENDING_VALIDATION' },
      },
      totalCount: 12,
      summary: '12 pending validation trades found',
      trades: Array.from({ length: 10 }, (_, index) => ({ tradeId: `TR-${index + 1}` })),
      tile: { appId: 'template_tile_trade_blotter', instanceId: 'resolved-by-broker' },
    });
  });

  it('returns a compact error payload for the assistant when intent execution fails', async () => {
    const executor = createFdc3ActionExecutor({
      getAgentApi: () => {
        throw new Error('FDC3 Agent not initialized');
      },
    });
    const toolkit = createRuntimeToolkit({ fdc3Executor: executor });

    const result = await (toolkit.execute_fdc3_action as ExecuteFdc3ActionTool).execute({
      actionId: 'trade-blotter.pending-validation',
    });

    expect(result).toEqual({
      status: 'error',
      intent: 'SearchTrades',
      message: 'FDC3 Agent not initialized',
    });
  });
});
