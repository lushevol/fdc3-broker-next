import { describe, expect, it } from '@jest/globals';
import { getFdc3ChatActionDefinitions } from './fdc3-action-definitions';

describe('getFdc3ChatActionDefinitions', () => {
  it('builds a trade blotter action from the local declarations', () => {
    const actions = getFdc3ChatActionDefinitions();

    expect(actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'trade-blotter.pending-validation',
          title: 'Check Pending Validation Trades',
          intent: 'SearchTrades',
          contextType: 'fdc3.trade.query',
          defaultContext: {
            type: 'fdc3.trade.query',
            filters: {
              status: 'PENDING_VALIDATION',
            },
          },
        }),
      ]),
    );
  });
});
