import { MockAppDirectoryService } from '../../fdc3-app-directory/src/mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type { AppIdentifier, BrokerConfig, Context } from '../src/types';

const listenerApp: AppIdentifier = { appId: 'listener-app', instanceId: 'listener-1' };
const senderApp: AppIdentifier = { appId: 'sender-app', instanceId: 'sender-1' };
const instrument: Context = {
  type: 'fdc3.instrument',
  name: 'Apple',
  id: { ticker: 'AAPL' },
};

function createBroker(): Broker {
  const config: BrokerConfig = {
    appDirectory: new MockAppDirectoryService(),
    callbacks: {
      onLoginStatusCheck: async () => true,
      onTileOpen: async (app) => app,
      onValidateEntitlements: async () => true,
      onShowResolverUI: async (targets) => targets[0] ?? null,
      onSecurityEvent: vi.fn(),
    },
    userChannelIds: ['red', 'blue'],
    onLogin: async () => undefined,
    onLogout: async () => undefined,
  };
  return new Broker(config);
}

describe('Broker FDC3 conformance remediation', () => {
  let broker: Broker;

  beforeEach(() => {
    broker = createBroker();
    broker.registerTile(listenerApp.instanceId!, listenerApp.appId);
    broker.registerTile(senderApp.instanceId!, senderApp.appId);
  });

  it('emits scoped userChannelChanged events and supports unsubscribe', async () => {
    const handler = vi.fn();
    const listener = await broker.addEventListener('userChannelChanged', handler, listenerApp);

    await broker.joinUserChannel('red', listenerApp);
    await broker.leaveCurrentChannel(listenerApp);

    expect(handler).toHaveBeenNthCalledWith(1, {
      type: 'userChannelChanged',
      details: { currentChannelId: 'red' },
    });
    expect(handler).toHaveBeenNthCalledWith(2, {
      type: 'userChannelChanged',
      details: { currentChannelId: null },
    });

    await listener.unsubscribe();
    await broker.joinUserChannel('blue', listenerApp);
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('allows context listeners before joining and follows channel changes', async () => {
    const handler = vi.fn();
    await broker.addContextListener('fdc3.instrument', handler, listenerApp);

    await broker.joinUserChannel('red', listenerApp);
    await broker.joinUserChannel('red', senderApp);
    await broker.broadcast(instrument, senderApp);

    expect(handler).toHaveBeenCalledWith(instrument);

    await broker.joinUserChannel('blue', listenerApp);
    await broker.broadcast({ ...instrument, name: 'Old channel' }, senderApp);
    expect(handler).toHaveBeenCalledTimes(1);

    await broker.joinUserChannel('blue', senderApp);
    await broker.broadcast({ ...instrument, name: 'New channel' }, senderApp);
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('replays matching current context when a desktop listener joins a channel', async () => {
    await broker.joinUserChannel('red', senderApp);
    await broker.broadcast(instrument, senderApp);

    const handler = vi.fn();
    await broker.addContextListener('fdc3.instrument', handler, listenerApp);
    await broker.joinUserChannel('red', listenerApp);

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(instrument);
  });

  it('removes channel membership and context listeners when a tile unregisters', async () => {
    const handler = vi.fn();
    await broker.addContextListener(null, handler, listenerApp);
    await broker.joinUserChannel('red', listenerApp);
    await broker.joinUserChannel('red', senderApp);

    broker.unregisterTile(listenerApp.instanceId!);
    await broker.broadcast(instrument, senderApp);

    expect(handler).not.toHaveBeenCalled();
    await expect(broker.getCurrentChannel(listenerApp)).resolves.toBeNull();
  });

  it('returns calling app metadata and accurately reports unsupported originating metadata', async () => {
    await expect(broker.getInfo(listenerApp)).resolves.toEqual(
      expect.objectContaining({
        appMetadata: expect.objectContaining(listenerApp),
        optionalFeatures: expect.objectContaining({ OriginatingAppMetadata: false }),
      }),
    );
  });

  it('destroys initialized bridges and clears registered listeners', async () => {
    const destroyPostMessage = vi.fn();
    broker['postMessageBridge'] = { destroy: destroyPostMessage } as never;

    await broker.addContextListener(null, vi.fn(), listenerApp);
    await broker.addEventListener('userChannelChanged', vi.fn(), listenerApp);
    broker.destroy();

    expect(destroyPostMessage).toHaveBeenCalledOnce();
    expect(broker['contextListeners'].size).toBe(0);
    expect(broker['eventListeners'].size).toBe(0);
  });

  it('supports the handler-first context overload and validates missing handlers', async () => {
    const handler = vi.fn();
    const listener = await broker.addContextListener(handler, listenerApp);

    await broker.joinUserChannel('red', listenerApp);
    await broker.joinUserChannel('red', senderApp);
    await broker.broadcast({ type: 'custom.context' }, senderApp);
    expect(handler).toHaveBeenCalledWith({ type: 'custom.context' });

    await listener.unsubscribe();
    await broker.broadcast(instrument, senderApp);
    expect(handler).toHaveBeenCalledOnce();
    await expect(broker.addContextListener('fdc3.instrument')).rejects.toThrow('Handler is required');
  });

  it('routes wildcard events while filtering type and instance scoped handlers', async () => {
    const wildcard = vi.fn();
    const wrongType = vi.fn();
    const wrongInstance = vi.fn();
    await broker.addEventListener(null, wildcard);
    await broker.addEventListener('listenerAdded', wrongType, listenerApp);
    await broker.addEventListener('userChannelChanged', wrongInstance, {
      appId: listenerApp.appId,
      instanceId: 'different-instance',
    });

    await broker.joinUserChannel('red', listenerApp);

    expect(wildcard).toHaveBeenCalledOnce();
    expect(wrongType).not.toHaveBeenCalled();
    expect(wrongInstance).not.toHaveBeenCalled();
  });

  it('opens an AppIdentifier without a platform callback and handles identity-free calls', async () => {
    const minimal = new Broker({
      appDirectory: new MockAppDirectoryService(),
      callbacks: {
        onLoginStatusCheck: async () => true,
        onValidateEntitlements: async () => true,
        onShowResolverUI: async (targets) => targets[0] ?? null,
        onSecurityEvent: vi.fn(),
      },
      onLogin: async () => undefined,
      onLogout: async () => undefined,
    });
    const target = { appId: 'plain-app', instanceId: 'plain-1' };

    await expect(minimal.open(target)).resolves.toEqual(target);
    await expect(minimal.getCurrentChannel()).resolves.toBeNull();
    await expect(minimal.leaveCurrentChannel()).resolves.toBeUndefined();
    await expect(minimal.getInfo()).resolves.toEqual(
      expect.objectContaining({ appMetadata: expect.objectContaining({ appId: '@fm/fdc3-broker' }) }),
    );
  });

  it('clears pending listener timeouts and rejects waits during destroy', () => {
    const rejectWithTimeout = vi.fn();
    const rejectWithoutTimeout = vi.fn();
    const timeoutId = setTimeout(() => undefined, 60_000);
    const internals = broker as unknown as {
      pendingIntentListeners: Map<
        string,
        Array<{
          intent: string;
          resolve: () => void;
          reject: (error: Error) => void;
          timeoutId?: ReturnType<typeof setTimeout>;
        }>
      >;
    };
    internals.pendingIntentListeners.set('pending-app', [
      { intent: 'ViewChart', resolve: vi.fn(), reject: rejectWithTimeout, timeoutId },
      { intent: 'ViewNews', resolve: vi.fn(), reject: rejectWithoutTimeout },
    ]);

    broker.destroy();

    expect(rejectWithTimeout).toHaveBeenCalledWith(expect.objectContaining({ message: 'Broker destroyed' }));
    expect(rejectWithoutTimeout).toHaveBeenCalledWith(expect.objectContaining({ message: 'Broker destroyed' }));
  });

  it('delivers queued intents only to applicable listeners and survives handler failures', async () => {
    const otherHandler = vi.fn();
    const failingHandler = vi.fn().mockRejectedValue(new Error('handler failed'));
    await broker.addIntentListener('ViewQueued', otherHandler, {
      appId: 'queued-app',
      instanceId: 'other-instance',
    });
    await broker.addIntentListener('ViewQueued', failingHandler);
    const internals = broker as unknown as {
      intentQueue: {
        enqueue: (instanceId: string, intent: string, context: Context, source: AppIdentifier) => void;
      };
    };
    internals.intentQueue.enqueue('queued-instance', 'ViewQueued', instrument, senderApp);

    await broker.registerTile('queued-instance', 'queued-app');

    expect(otherHandler).not.toHaveBeenCalled();
    expect(failingHandler).toHaveBeenCalledWith(instrument);
  });

  it('covers identity-free listener, channel, and lifecycle cleanup branches', async () => {
    const contextListener = await broker.addContextListener(null, vi.fn());
    await contextListener.unsubscribe();
    const intentListener = await broker.addIntentListener('TemporaryIntent', vi.fn());
    await intentListener.unsubscribe();
    await intentListener.unsubscribe();

    await expect(broker.broadcast(instrument)).rejects.toThrow('No channel joined');
    await expect(broker.createPrivateChannel()).resolves.toEqual(expect.objectContaining({ id: expect.any(String) }));
    await broker.leaveCurrentChannel({ appId: 'missing', instanceId: 'missing-instance' });

    const eventListener = await broker.addEventListener(null, vi.fn(), listenerApp);
    await broker.addContextListener(null, vi.fn(), senderApp);
    broker.unregisterTile(listenerApp.instanceId!);
    await eventListener.unsubscribe();

    const internals = broker as unknown as {
      removePendingIntentListener: (appId: string, wait: object) => void;
    };
    internals.removePendingIntentListener('missing-app', {});
    broker.destroy();
  });

  it('uses default login behavior and string application identifiers', async () => {
    const defaults = new Broker({
      appDirectory: new MockAppDirectoryService(),
      callbacks: {
        onValidateEntitlements: async () => true,
        onShowResolverUI: async (targets) => targets[0] ?? null,
        onSecurityEvent: vi.fn(),
      },
      onLogin: async () => undefined,
      onLogout: async () => undefined,
    });

    await expect(defaults.open('string-app')).resolves.toEqual({ appId: 'string-app' });
    await expect(defaults.inspectWorkflowCapability({ intent: 'UnknownIntent' })).resolves.toEqual({
      state: 'unavailable',
      appId: undefined,
    });
  });

  it('normalizes string targets for intent and context raises', async () => {
    vi.spyOn(broker, 'findIntentsByContext').mockResolvedValue([
      {
        intent: { name: 'ViewChart', displayName: 'View Chart' },
        apps: [{ appId: 'target-app' }],
      },
    ]);
    const raiseSpy = vi.spyOn(broker, 'raiseIntent').mockResolvedValue({
      source: { appId: 'target-app' },
      intent: 'ViewChart',
    });

    await broker.raiseIntentForContext(instrument, 'target-app', senderApp);
    expect(raiseSpy).toHaveBeenCalledWith(
      expect.any(String),
      instrument,
      { appId: 'target-app' },
      senderApp,
    );
    raiseSpy.mockRestore();

    await expect(broker.raiseIntent('UnknownIntent', instrument, 'target-app', senderApp)).rejects.toThrow();
  });
});
