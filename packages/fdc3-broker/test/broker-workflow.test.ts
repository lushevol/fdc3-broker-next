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

  it('buffers lifecycle events and executes a resolution only once', async () => {
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
    const resolution = await broker.raiseWorkflow(workflow.workflowId, {
      status: 'PENDING_VALIDATION',
    });
    const eventTypes: string[] = [];

    const subscription = resolution.subscribe((event) => {
      eventTypes.push(event.type);
    });
    const [first, second] = await Promise.all([resolution.getResult(), resolution.getResult()]);

    expect(first).toBe(second);
    expect(broker.raiseIntent).toHaveBeenCalledTimes(1);
    expect(eventTypes).toEqual([
      'workflow.started',
      'node.started',
      'node.completed',
      'workflow.completed',
    ]);

    subscription.unsubscribe();
  });

  it('isolates throwing workflow subscribers from execution and other subscribers', async () => {
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
    const resolution = await broker.raiseWorkflow(workflow.workflowId, {
      status: 'PENDING_VALIDATION',
    });
    const healthySubscriber = vi.fn();

    resolution.subscribe(() => {
      throw new Error('subscriber failed');
    });
    resolution.subscribe(healthySubscriber);

    await expect(resolution.getResult()).resolves.toMatchObject({ status: 'ok' });
    expect(healthySubscriber).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'workflow.completed' }),
    );
  });

  it('distinguishes unavailable, declared-only, and live workflow handlers', async () => {
    const findByIntent = vi.fn().mockResolvedValue([]);
    const broker = new Broker({
      appDirectory: { findByIntent } as unknown as AppDirectoryClient,
      workflows: [workflow],
      callbacks: {},
      onLogin: async () => undefined,
      onLogout: async () => undefined,
    });

    await expect(
      broker.inspectWorkflowCapability({
        intent: 'SearchTrades',
        targetAppId: 'trade-search',
      }),
    ).resolves.toEqual({ state: 'unavailable', appId: 'trade-search' });

    findByIntent.mockResolvedValue([{ appId: 'trade-search', name: 'Trade search' }]);
    await expect(
      broker.inspectWorkflowCapability({
        intent: 'SearchTrades',
        targetAppId: 'trade-search',
      }),
    ).resolves.toEqual({ state: 'declared-only', appId: 'trade-search' });

    await broker.registerTile('trade-search-1', 'trade-search');
    await broker.addIntentListener('SearchTrades', async () => ({ totalCount: 1 }), {
      appId: 'trade-search',
      instanceId: 'trade-search-1',
    });
    await expect(
      broker.inspectWorkflowCapability({
        intent: 'SearchTrades',
        targetAppId: 'trade-search',
      }),
    ).resolves.toEqual({
      state: 'ready',
      appId: 'trade-search',
      instanceId: 'trade-search-1',
    });
  });
});
