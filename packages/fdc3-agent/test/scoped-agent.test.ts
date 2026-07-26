import type { AppIdentifier, Context } from '@finos/fdc3';
import type { Broker } from 'ratan-fdc3-broker';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ScopedDesktopAgent } from '../src/scoped-agent';

describe('ScopedDesktopAgent', () => {
  let mockBroker: Broker;
  let scopedAgent: ScopedDesktopAgent;
  const mockSource: AppIdentifier = {
    appId: 'test-app',
    instanceId: 'test-instance',
  };

  beforeEach(() => {
    mockBroker = {
      open: vi.fn(),
      findInstances: vi.fn(),
      getAppMetadata: vi.fn(),
      broadcast: vi.fn(),
      raiseIntent: vi.fn(),
      raiseWorkflow: vi.fn(),
      raiseIntentForContext: vi.fn(),
      findWorkflow: vi.fn(),
      findWorkflowsByInput: vi.fn(),
      addContextListener: vi.fn(),
      addIntentListener: vi.fn(),
      findIntent: vi.fn(),
      findIntentsByContext: vi.fn(),
      getCurrentChannel: vi.fn(),
      getSystemChannels: vi.fn(),
      joinUserChannel: vi.fn(),
      getOrCreateChannel: vi.fn(),
      createPrivateChannel: vi.fn(),
      leaveCurrentChannel: vi.fn(),
      getInfo: vi.fn(),
      getUserChannels: vi.fn(),
      joinChannel: vi.fn(),
      addEventListener: vi.fn(),
      registerTile: vi.fn(),
      unregisterTile: vi.fn(),
      modules: { load: vi.fn() },
    } as unknown as Broker;

    scopedAgent = new ScopedDesktopAgent(mockBroker, mockSource);
  });

  it('should inject source into broadcast', async () => {
    const context: Context = { type: 'fdc3.contact', name: 'Test' };
    await scopedAgent.broadcast(context);
    expect(mockBroker.broadcast).toHaveBeenCalledWith(context, mockSource);
  });

  it('should inject source into raiseIntent', async () => {
    const intent = 'ViewContact';
    const context: Context = { type: 'fdc3.contact', name: 'Test' };
    const target = { appId: 'target-app' };

    await scopedAgent.raiseIntent(intent, context, target);
    expect(mockBroker.raiseIntent).toHaveBeenCalledWith(intent, context, target, mockSource);
  });

  it('should forward workflow APIs to the broker', async () => {
    const input = { status: 'PENDING_VALIDATION' };
    const options = { timeoutMs: 5000 };

    await scopedAgent.raiseWorkflow('trade.pendingValidation.openChart', input, options);
    await scopedAgent.findWorkflow('trade.pendingValidation.openChart');
    await scopedAgent.findWorkflowsByInput(input);

    expect(mockBroker.raiseWorkflow).toHaveBeenCalledWith(
      'trade.pendingValidation.openChart',
      input,
      options,
    );
    expect(mockBroker.findWorkflow).toHaveBeenCalledWith('trade.pendingValidation.openChart');
    expect(mockBroker.findWorkflowsByInput).toHaveBeenCalledWith(input);
  });

  it('should inject source into raiseIntentForContext', async () => {
    const context: Context = { type: 'fdc3.contact', name: 'Test' };
    const target = { appId: 'target-app' };

    await scopedAgent.raiseIntentForContext(context, target);
    expect(mockBroker.raiseIntentForContext).toHaveBeenCalledWith(context, target, mockSource);
  });

  it('should inject source into addContextListener', async () => {
    const handler = vi.fn();
    const contextType = 'fdc3.contact';

    await scopedAgent.addContextListener(contextType, handler);
    expect(mockBroker.addContextListener).toHaveBeenCalledWith(contextType, handler, mockSource);
  });

  it('should inject source into addIntentListener', async () => {
    const handler = vi.fn();
    const intent = 'ViewContact';

    await scopedAgent.addIntentListener(intent, handler);
    expect(mockBroker.addIntentListener).toHaveBeenCalledWith(intent, handler, mockSource);
  });

  it('should inject source into joinUserChannel', async () => {
    const channelId = 'user-channel-1';
    await scopedAgent.joinUserChannel(channelId);
    expect(mockBroker.joinUserChannel).toHaveBeenCalledWith(channelId, mockSource);
  });

  it('should inject source into leaveCurrentChannel', async () => {
    await scopedAgent.leaveCurrentChannel();
    expect(mockBroker.leaveCurrentChannel).toHaveBeenCalledWith(mockSource);
  });

  it('should inject source into getCurrentChannel', async () => {
    await scopedAgent.getCurrentChannel();
    expect(mockBroker.getCurrentChannel).toHaveBeenCalledWith(mockSource);
  });

  it('should inject source into open', async () => {
    await scopedAgent.open('target-app');
    expect(mockBroker.open).toHaveBeenCalledWith('target-app', undefined, mockSource);
  });

  it('should inject source into createPrivateChannel', async () => {
    await scopedAgent.createPrivateChannel();
    expect(mockBroker.createPrivateChannel).toHaveBeenCalledWith(mockSource);
  });

  it('should delegate discovery and metadata methods without injecting source', async () => {
    const app = { appId: 'chart-app', instanceId: 'chart-app-1' };
    const context: Context = { type: 'fdc3.instrument', id: { ticker: 'AAPL' } };

    await scopedAgent.findInstances(app);
    await scopedAgent.getAppMetadata(app);
    await scopedAgent.findIntent('ViewChart', context, 'fdc3.chart');
    await scopedAgent.findIntentsByContext(context, 'fdc3.chart');

    expect(mockBroker.findInstances).toHaveBeenCalledWith(app);
    expect(mockBroker.getAppMetadata).toHaveBeenCalledWith(app);
    expect(mockBroker.findIntent).toHaveBeenCalledWith('ViewChart', context, 'fdc3.chart');
    expect(mockBroker.findIntentsByContext).toHaveBeenCalledWith(context, 'fdc3.chart');
  });

  it('should delegate channel utility methods without source where the broker owns global state', async () => {
    await scopedAgent.getOrCreateChannel('shared-channel');
    await scopedAgent.getUserChannels();
    await scopedAgent.getSystemChannels();
    await scopedAgent.getInfo();

    expect(mockBroker.getOrCreateChannel).toHaveBeenCalledWith('shared-channel');
    expect(mockBroker.getUserChannels).toHaveBeenCalled();
    expect(mockBroker.getUserChannels).toHaveBeenCalledTimes(2);
    expect(mockBroker.getInfo).toHaveBeenCalled();
  });

  it('should map joinChannel to source-aware joinUserChannel', async () => {
    await scopedAgent.joinChannel('green');
    expect(mockBroker.joinUserChannel).toHaveBeenCalledWith('green', mockSource);
  });

  it('should delegate event and tile registry methods', async () => {
    const handler = vi.fn();
    const metadata = { appId: 'chart-app', name: 'Chart App' };

    await scopedAgent.addEventListener('userChannelChanged', handler);
    await scopedAgent.registerTile('chart-app-1', 'chart-app', metadata);
    await scopedAgent.unregisterTile('chart-app-1');

    expect(mockBroker.addEventListener).toHaveBeenCalledWith('userChannelChanged', handler);
    expect(mockBroker.registerTile).toHaveBeenCalledWith('chart-app-1', 'chart-app', metadata);
    expect(mockBroker.unregisterTile).toHaveBeenCalledWith('chart-app-1');
  });

  it('delegates the non-FDC3 module-composition capability to the broker', () => {
    expect(scopedAgent.modules).toBe(mockBroker.modules);
  });
});
