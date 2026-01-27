import type { AppIdentifier, Context, DesktopAgent } from '@finos/fdc3';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ScopedDesktopAgent } from '../src/scoped-agent';

describe('ScopedDesktopAgent', () => {
  let mockBroker: any;
  let scopedAgent: ScopedDesktopAgent;
  const mockSource: AppIdentifier = {
    appId: 'test-app',
    instanceId: 'test-instance',
  };

  beforeEach(() => {
    mockBroker = {
      open: vi.fn(),
      findInstances: vi.fn(),
      broadcast: vi.fn(),
      raiseIntent: vi.fn(),
      raiseIntentForContext: vi.fn(),
      addContextListener: vi.fn(),
      addIntentListener: vi.fn(),
      findIntent: vi.fn(),
      findIntentsByContext: vi.fn(),
      getCurrentChannel: vi.fn(),
      getSystemChannels: vi.fn(),
      joinUserChannel: vi.fn(),
      getOrCreateChannel: vi.fn(),
      leaveCurrentChannel: vi.fn(),
      getInfo: vi.fn(),
      getUserChannels: vi.fn(),
      joinChannel: vi.fn(),
    };

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
});
