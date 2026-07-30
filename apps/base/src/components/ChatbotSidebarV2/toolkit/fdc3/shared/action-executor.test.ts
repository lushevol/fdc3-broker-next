import { describe, expect, it, jest, beforeEach } from '@jest/globals';
jest.mock(
  'ratan-fdc3',
  () => ({
    getAgentApi: jest.fn(),
  }),
  { virtual: true },
);

import { getAgentApi } from 'ratan-fdc3';
import { createFdc3ActionExecutor } from './action-executor';

describe('createFdc3ActionExecutor', () => {
  const mockedGetAgentApi = getAgentApi as jest.MockedFunction<typeof getAgentApi>;

  beforeEach(() => {
    mockedGetAgentApi.mockReset();
  });

  it('raises SearchTrades through the FDC3 broker and returns the result payload', async () => {
    const raiseIntent = jest.fn().mockResolvedValue({
      getResult: async () => ({
        status: 'ok',
        intent: 'SearchTrades',
        totalCount: 2,
        summary: '2 pending validation trades found',
        trades: [{ tradeId: 'TR-001' }, { tradeId: 'TR-002' }],
        appliedFilters: { status: 'PENDING_VALIDATION' },
        tile: { appId: 'template_tile_trade_blotter', instanceId: 'resolved-by-broker' },
      }),
    });
    mockedGetAgentApi.mockReturnValue({ raiseIntent } as ReturnType<typeof getAgentApi>);

    const executor = createFdc3ActionExecutor();

    const result = await executor.execute(
      { actionId: 'trade-blotter.pending-validation' },
      { continuationPayload: true },
    );

    expect(raiseIntent).toHaveBeenCalledWith('SearchTrades', {
      type: 'fdc3.trade.query',
      filters: { status: 'PENDING_VALIDATION' },
    });
    expect(result).toEqual(
      expect.objectContaining({
        status: 'ok',
        context: {
          type: 'fdc3.trade.query',
          filters: { status: 'PENDING_VALIDATION' },
        },
        totalCount: 2,
      }),
    );
  });

  it('throws when the action id is unknown', async () => {
    const executor = createFdc3ActionExecutor();

    await expect(
      executor.execute({
        actionId: 'unknown-action',
      }),
    ).rejects.toThrow('Unknown FDC3 action: unknown-action');

    expect(mockedGetAgentApi).not.toHaveBeenCalled();
  });

  it('surfaces getAgentApi failures when the FDC3 broker is unavailable', async () => {
    mockedGetAgentApi.mockImplementation(() => {
      throw new Error('FDC3 Agent not initialized');
    });
    const executor = createFdc3ActionExecutor();

    await expect(
      executor.execute({
        actionId: 'trade-blotter.pending-validation',
      }),
    ).rejects.toThrow('FDC3 Agent not initialized');
  });
});
