import type { AppDirectoryClient } from '@fm/fdc3-app-directory';
import { describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type { WorkflowDefinition } from '../src/workflow-types';

const workflow: WorkflowDefinition = {
  workflowId: 'trade.pendingValidation.openChart',
  title: 'Open chart for pending validation trade',
  inputSchema: { type: 'object', properties: {}, required: [] },
  steps: [
    {
      id: 'search-trades',
      intent: 'SearchTrades',
      contextTemplate: { type: 'fdc3.trade.query', filters: { status: '{{input.status}}' } },
    },
  ],
};

describe('Broker workflows', () => {
  it('raises a declared workflow through the broker API', async () => {
    const broker = new Broker({
      appDirectory: {} as AppDirectoryClient,
      workflows: [workflow],
      callbacks: {},
      onLogin: async () => undefined,
      onLogout: async () => undefined,
    });

    broker.raiseIntent = vi.fn().mockResolvedValue({
      getResult: async () => ({ totalCount: 1 }),
    }) as typeof broker.raiseIntent;

    const resolution = await broker.raiseWorkflow('trade.pendingValidation.openChart', {
      status: 'PENDING_VALIDATION',
    });
    const transcript = await resolution.getResult();

    expect(resolution.workflowId).toBe('trade.pendingValidation.openChart');
    expect(transcript.status).toBe('ok');
    expect(broker.raiseIntent).toHaveBeenCalledWith('SearchTrades', {
      type: 'fdc3.trade.query',
      filters: { status: 'PENDING_VALIDATION' },
    });
  });
});
