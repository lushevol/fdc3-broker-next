import { describe, expect, it } from 'vitest';
import { applyWorkflowBindings, readWorkflowPath } from '../src/workflow-bindings';

describe('workflow bindings', () => {
  it('reads values using the supported path subset', () => {
    expect(readWorkflowPath({ trades: [{ instrument: 'AAPL' }] }, '$.trades[0].instrument')).toBe(
      'AAPL',
    );
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

  it('throws when a required binding cannot be resolved', () => {
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
