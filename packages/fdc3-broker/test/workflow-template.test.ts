import { describe, expect, it } from 'vitest';
import { renderWorkflowContextTemplate } from '../src/workflow-template';

describe('renderWorkflowContextTemplate', () => {
  it('renders input placeholders inside context templates', () => {
    expect(
      renderWorkflowContextTemplate(
        {
          type: 'fdc3.trade.query',
          filters: { status: '{{input.status}}' },
          symbols: ['{{input.primaryTicker}}', '{{input.secondaryTicker}}'],
          question: '{{input.originalRequest}}',
        },
        {
          status: 'PENDING_VALIDATION',
          primaryTicker: 'AAPL',
          secondaryTicker: 'MSFT',
          originalRequest: 'find pending validation trades',
        },
      ),
    ).toEqual({
      type: 'fdc3.trade.query',
      filters: { status: 'PENDING_VALIDATION' },
      symbols: ['AAPL', 'MSFT'],
      question: 'find pending validation trades',
    });
  });

  it('keeps non-placeholder strings unchanged', () => {
    expect(
      renderWorkflowContextTemplate(
        {
          type: 'fdc3.instrument',
          id: { source: 'ticker' },
          optional: null,
          limit: 10,
          strict: true,
        },
        {},
      ),
    ).toEqual({
      type: 'fdc3.instrument',
      id: { source: 'ticker' },
      optional: null,
      limit: 10,
      strict: true,
    });
  });

  it('renders missing placeholders as undefined', () => {
    expect(
      renderWorkflowContextTemplate(
        {
          type: 'fdc3.instrument',
          id: { ticker: '{{input.ticker}}' },
        },
        {},
      ),
    ).toEqual({
      type: 'fdc3.instrument',
      id: { ticker: undefined },
    });
  });

  it('rejects templates that do not render to an object', () => {
    expect(() =>
      renderWorkflowContextTemplate('{{input.value}}' as never, { value: 'AAPL' }),
    ).toThrow('Workflow context template must render to an object');
  });
});
