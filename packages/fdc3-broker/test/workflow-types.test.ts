import { describe, expect, it } from 'vitest';
import type { WorkflowDefinition, WorkflowTranscript } from '../src';

describe('workflow public types', () => {
  it('exports workflow declaration and transcript types', () => {
    const definition: WorkflowDefinition = {
      workflowId: 'trade.pendingValidation.openChart',
      title: 'Open chart for pending validation trade',
      description: 'Search trades and open a chart',
      inputSchema: { type: 'object', properties: {}, required: [] },
      steps: [
        {
          id: 'search-trades',
          intent: 'SearchTrades',
          contextTemplate: { type: 'fdc3.trade.query' },
        },
      ],
    };

    const transcript: WorkflowTranscript = {
      status: 'ok',
      workflowId: definition.workflowId,
      title: definition.title,
      input: {},
      completedSteps: [],
      summary: 'Completed 0 of 1 workflow steps.',
    };

    expect(transcript.workflowId).toBe(definition.workflowId);
  });
});
