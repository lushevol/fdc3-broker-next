import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearBroker, getAgentApi, setBroker } from '../src/agent';
import type { RatanDesktopAgent } from '../src/types';

describe('workflow agent api', () => {
  afterEach(() => {
    clearBroker();
  });

  it('delegates raiseWorkflow to the active broker', async () => {
    const raiseWorkflow = vi.fn().mockResolvedValue({
      workflowId: 'trade.pendingValidation.openChart',
      getResult: async () => ({
        status: 'ok',
        workflowId: 'trade.pendingValidation.openChart',
        title: 'Open chart',
        input: {},
        completedSteps: [],
        summary: 'Completed 0 of 0 workflow steps.',
      }),
    });

    setBroker({ raiseWorkflow } as unknown as RatanDesktopAgent);

    const resolution = await getAgentApi().raiseWorkflow('trade.pendingValidation.openChart', {
      status: 'PENDING_VALIDATION',
    });

    expect(raiseWorkflow).toHaveBeenCalledWith('trade.pendingValidation.openChart', {
      status: 'PENDING_VALIDATION',
    });
    expect(resolution.workflowId).toBe('trade.pendingValidation.openChart');
  });
});
