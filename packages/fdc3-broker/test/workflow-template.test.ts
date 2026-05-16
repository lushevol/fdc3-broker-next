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

  it('keeps non-placeholder strings unchanged', () => {
    expect(
      renderWorkflowContextTemplate(
        {
          type: 'fdc3.instrument',
          id: { source: 'ticker' },
        },
        {},
      ),
    ).toEqual({
      type: 'fdc3.instrument',
      id: { source: 'ticker' },
    });
  });
});
