/**
 * Broker raiseIntent() Unit Tests
 * @see plan.md#T090
 */

import type { AppDirectoryClient } from '@fm/fdc3-app-directory';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type { AppIdentifier, BrokerConfig, Context, IntentResolution } from '../src/types';

describe('Broker.raiseIntent()', () => {
  let broker: Broker;
  let mockAppDirectory: AppDirectoryClient;
  let mockCallbacks: BrokerConfig['callbacks'];
  let mockConfig: BrokerConfig;

  const mockContext: Context = {
    type: 'fdc3.chart',
    id: { ticker: 'AAPL' },
  };

  const mockSource = { appId: 'tile-1', instanceId: 'tile-1' };

  const mockApp1 = {
    appId: 'app1',
    name: 'App 1',
    version: '1.0.0',
    title: 'Application 1',
    description: 'Test Application 1',
    interop: {
      intents: {
        listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
      },
    },
  };

  const mockApp2 = {
    appId: 'app2',
    name: 'App 2',
    version: '1.0.0',
    title: 'Application 2',
    description: 'Test Application 2',
    interop: {
      intents: {
        listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
      },
    },
  };

  beforeEach(() => {
    // Mock App Directory
    mockAppDirectory = {
      findByIntent: vi.fn(),
      findByContextType: vi.fn(),
      getApp: vi.fn(),
      getAllApps: vi.fn(),
      findByCategory: vi.fn(),
    } satisfies AppDirectoryClient;

    // Mock callbacks
    mockCallbacks = {
      onLoginStatusCheck: vi.fn().mockResolvedValue(true),
      onTileOpen: vi.fn().mockImplementation(async (target) => {
        const appId = typeof target === 'string' ? target : target.appId;
        // Register immediately for standard tests to avoid timeouts
        const instanceId = `${appId}-instance-auto`;
        broker['registerTile'](instanceId, appId, { appId, name: appId });
        await broker.addIntentListener('ViewChart', async () => {}, {
          appId,
          instanceId,
        });
      }),
      onValidateEntitlements: vi.fn().mockResolvedValue(true),
      onShowResolverUI: vi.fn(),
      onSecurityEvent: vi.fn(),
    };

    mockConfig = {
      appDirectory: mockAppDirectory,
      callbacks: mockCallbacks,
      enableDebug: false,
    };

    broker = new Broker(mockConfig);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('entitlement validation', () => {
    it('should validate sender entitlements before sending intent', async () => {
      // broker["setCurrentTile"]("tile-1");

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);

      const denyEntitlements = vi.fn().mockResolvedValue(false);
      const configWithDeny = {
        ...mockConfig,
        callbacks: {
          ...mockCallbacks,
          onValidateEntitlements: denyEntitlements,
        },
      };

      const restrictedBroker = new Broker(configWithDeny);
      // restrictedBroker["setCurrentTile"]("tile-1");

      await expect(
        restrictedBroker.raiseIntent('ViewChart', mockContext, undefined, mockSource),
      ).rejects.toThrow('Not entitled to send this intent');

      expect(denyEntitlements).toHaveBeenCalledWith('tile-1', 'send-intent');
    });

    it('should allow intent when entitlements pass', async () => {
      // broker["setCurrentTile"]("tile-1");
      broker['registerTile']('tile-1', 'app1', {
        appId: 'app1',
        name: 'App 1',
      });

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockCallbacks.onShowResolverUI).mockImplementation(async (targets) => targets[0] ?? null);

      // Add intent listener
      await broker.addIntentListener('ViewChart', vi.fn(), mockSource);

      const result = await broker.raiseIntent('ViewChart', mockContext, undefined, mockSource);

      expect(result).toBeDefined();
      expect(result.source.appId).toBe('app1');
    });

    it('should skip entitlement check when no callback provided', async () => {
      const configWithoutCheck = {
        ...mockConfig,
        callbacks: {
          ...mockCallbacks,
          onValidateEntitlements: undefined,
        },
      };

      const brokerWithoutCheck = new Broker(configWithoutCheck);
      // brokerWithoutCheck["setCurrentTile"]("tile-1");

      // Override onTileOpen to use this specific broker instance
      brokerWithoutCheck['config'].callbacks.onTileOpen = async (target) => {
        const appId = typeof target === 'string' ? target : target.appId;
        const instanceId = `${appId}-instance-auto`;
        brokerWithoutCheck['registerTile'](instanceId, appId, {
          appId,
          name: appId,
        });
        await brokerWithoutCheck.addIntentListener('ViewChart', async () => {}, {
          appId,
          instanceId,
        });
      };

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(mockApp1);

      // Should not throw
      await expect(
        brokerWithoutCheck.raiseIntent(
          'ViewChart',
          mockContext,
          {
            appId: 'app1',
          },
          mockSource,
        ),
      ).resolves.toBeDefined();
    });
  });

  describe('target resolution', () => {
    it('should resolve to single target when only one app available', async () => {
      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(mockApp1);

      const result = await broker.raiseIntent('ViewChart', mockContext, undefined, mockSource);

      expect(result.source.appId).toBe('app1');
      expect(mockCallbacks.onTileOpen).toHaveBeenCalledWith(
        expect.objectContaining({ appId: 'app1' }),
      );
    });

    it('should show resolver UI when multiple targets available', async () => {
      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1, mockApp2]);

      const selectedTarget = {
        appId: 'app2',
        metadata: { appId: 'app2', name: 'App 2' },
      };

      vi.mocked(mockCallbacks.onShowResolverUI).mockResolvedValue(selectedTarget);
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(mockApp2);

      const result = await broker.raiseIntent('ViewChart', mockContext, undefined, mockSource);

      expect(result.source.appId).toBe('app2');
      expect(mockCallbacks.onShowResolverUI).toHaveBeenCalled();
      expect(mockCallbacks.onTileOpen).toHaveBeenCalledWith(
        expect.objectContaining({ appId: 'app2' }),
      );
    });

    it('should throw when no target found', async () => {
      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([]);

      await expect(
        broker.raiseIntent('ViewChart', mockContext, undefined, mockSource),
      ).rejects.toThrow('No target found for intent: ViewChart');
    });

    it('should throw when user cancels resolver UI', async () => {
      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1, mockApp2]);

      vi.mocked(mockCallbacks.onShowResolverUI).mockResolvedValue(null);

      await expect(broker.raiseIntent('ViewChart', mockContext)).rejects.toThrow(
        'User cancelled intent resolution',
      );
    });
  });

  describe('with specific target', () => {
    it('should resolve to specific instance when provided', async () => {
      broker['registerTile']('tile-1', 'app1', {
        appId: 'app1',
        name: 'App 1',
      });

      await broker.addIntentListener('ViewChart', vi.fn());

      const result = await broker.raiseIntent(
        'ViewChart',
        mockContext,
        {
          appId: 'app1',
          instanceId: 'tile-1',
        },
        mockSource,
      );

      expect(result.source.appId).toBe('app1');
      expect(result.source.instanceId).toBe('tile-1');
      expect(mockCallbacks.onTileOpen).not.toHaveBeenCalled();
    });

    it('should open new app instance when target has no instanceId', async () => {
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(mockApp1);

      const result = await broker.raiseIntent(
        'ViewChart',
        mockContext,
        {
          appId: 'app1',
        },
        mockSource,
      );

      expect(result.source.appId).toBe('app1');
      expect(mockCallbacks.onTileOpen).toHaveBeenCalledWith(
        expect.objectContaining({ appId: 'app1' }),
      );
    });

    it('should throw when specific target not found', async () => {
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(null);

      await expect(
        broker.raiseIntent('ViewChart', mockContext, { appId: 'nonexistent' }, mockSource),
      ).rejects.toThrow('No target found for intent: ViewChart');
    });
  });

  describe('intent delivery to mounted tiles', () => {
    it('should deliver intent to mounted tile with listener', async () => {
      const handler = vi.fn().mockResolvedValue('result');
      broker['registerTile']('tile-1', 'app1', {
        appId: 'app1',
        name: 'App 1',
      });

      await broker.addIntentListener('ViewChart', handler);

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);

      const result = await broker.raiseIntent(
        'ViewChart',
        mockContext,
        {
          appId: 'app1',
          instanceId: 'tile-1',
        },
        mockSource,
      );

      expect(handler).toHaveBeenCalledWith(mockContext);
      expect(result.source.appId).toBe('app1');
    });

    it('should handle multiple intent listeners', async () => {
      const handler1 = vi.fn().mockResolvedValue('result1');
      const handler2 = vi.fn().mockResolvedValue('result2');

      broker['registerTile']('tile-1', 'app1', {
        appId: 'app1',
        name: 'App 1',
      });

      await broker.addIntentListener('ViewChart', handler1);
      await broker.addIntentListener('ViewChart', handler2);

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);

      const result = await broker.raiseIntent(
        'ViewChart',
        mockContext,
        {
          appId: 'app1',
          instanceId: 'tile-1',
        },
        mockSource,
      );

      expect(handler1).toHaveBeenCalledWith(mockContext);
      expect(handler2).toHaveBeenCalledWith(mockContext);
      expect(result.source.appId).toBe('app1');
    });

    it('should replace duplicate listener registrations from the same tile instance', async () => {
      const handler1 = vi.fn().mockResolvedValue('stale');
      const handler2 = vi.fn().mockResolvedValue('fresh');
      const target = { appId: 'app1', instanceId: 'tile-1' };

      broker['registerTile']('tile-1', 'app1', {
        appId: 'app1',
        name: 'App 1',
      });

      await broker.addIntentListener('ViewChart', handler1, target);
      await broker.addIntentListener('ViewChart', handler2, target);

      const result = await broker.raiseIntent('ViewChart', mockContext, target, mockSource);

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledWith(mockContext);
      await expect(result.getResult?.()).resolves.toBe('fresh');
    });

    it('should handle handler errors gracefully', async () => {
      const handler = vi.fn().mockRejectedValue(new Error('Handler error'));

      broker['registerTile']('tile-1', 'app1', {
        appId: 'app1',
        name: 'App 1',
      });

      await broker.addIntentListener('ViewChart', handler);

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);

      // Should not throw despite handler error
      const result = await broker.raiseIntent(
        'ViewChart',
        mockContext,
        {
          appId: 'app1',
          instanceId: 'tile-1',
        },
        mockSource,
      );

      expect(result.source.appId).toBe('app1');
    });
  });

  describe('intent queuing for unmounted tiles', () => {
    it('should queue intent when target tile is not mounted', async () => {
      // broker["setCurrentTile"]("tile-sender");
      broker['registerTile']('tile-unmounted', 'app1', {
        appId: 'app1',
        name: 'App 1',
      });
      broker['tileRegistry'].updateTileState('tile-unmounted', 'unmounted');

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(mockApp1);

      // Raise intent for unmounted tile (will queue)
      const result = await broker.raiseIntent(
        'ViewChart',
        mockContext,
        {
          appId: 'app1',
          instanceId: 'tile-unmounted',
        },
        { appId: 'tile-sender', instanceId: 'tile-sender' },
      );

      expect(result.source.appId).toBe('app1');
      expect(result.source.instanceId).toBe('tile-unmounted');

      // Verify intent was queued
      const queued = broker['intentQueue'].getQueuedIntents('tile-unmounted');
      expect(queued.length).toBe(1);
      expect(queued[0].intent).toBe('ViewChart');
      expect(queued[0].context).toEqual(mockContext);
    });

    it('should persist queued intent to localStorage', async () => {
      // broker["setCurrentTile"]("tile-sender");
      broker['registerTile']('tile-unmounted', 'app1', {
        appId: 'app1',
        name: 'App 1',
      });
      broker['tileRegistry'].updateTileState('tile-unmounted', 'unmounted');

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(mockApp1);

      await broker.raiseIntent(
        'ViewChart',
        mockContext,
        {
          appId: 'app1',
          instanceId: 'tile-unmounted',
        },
        { appId: 'tile-sender', instanceId: 'tile-sender' },
      );

      const stored = localStorage.getItem('fdc3-intent-queue');
      expect(stored).toBeTruthy();
    });
  });

  describe('opening new instances', () => {
    it('should call onTileOpen when no instance exists', async () => {
      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(mockApp1);

      const result = await broker.raiseIntent('ViewChart', mockContext, undefined, mockSource);

      expect(mockCallbacks.onTileOpen).toHaveBeenCalledWith(
        expect.objectContaining({ appId: 'app1' }),
      );
      expect(result.source.appId).toBe('app1');
    });

    it('should open correct app on target resolution', async () => {
      const complexContext: Context = {
        type: 'fdc3.order',
        id: { orderId: '12345' },
        quantity: 100,
        price: 150.25,
      };

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(mockApp1);

      await broker.raiseIntent('ViewChart', complexContext, undefined, mockSource);

      expect(mockCallbacks.onTileOpen).toHaveBeenCalledWith(
        expect.objectContaining({ appId: 'app1' }),
      );
    });

    it('should wait for intent listener registration when opening new app', async () => {
      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(mockApp1);

      // Simulate async app startup and listener registration
      vi.mocked(mockCallbacks.onTileOpen).mockImplementation(async (appId) => {
        const id = typeof appId === 'string' ? appId : appId.appId;
        if (id === 'app1') {
          // Register tile first
          broker['registerTile']('tile-new', 'app1', {
            appId: 'app1',
            name: 'App 1',
          });

          // Delay to simulate app loading
          setTimeout(async () => {
            await broker.addIntentListener(
              'ViewChart',
              async (ctx) => {
                return { processed: true, context: ctx };
              },
              { appId: 'app1', instanceId: 'tile-new' },
            );
          }, 50);
        }
      });

      const result = await broker.raiseIntent('ViewChart', mockContext, undefined, mockSource);

      expect(result.source.appId).toBe('app1');

      // Get the result from resolution
      if (result.getResult) {
        const intentResult = await result.getResult();
        expect(intentResult).toEqual({ processed: true, context: mockContext });
      }
    });

    it('shares one cold tile launch across concurrent intents for the same target app', async () => {
      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(mockApp1);

      const handler = vi.fn(async (context: Context) => ({ context }));
      vi.mocked(mockCallbacks.onTileOpen).mockImplementation(async (app) => {
        const appId = typeof app === 'string' ? app : app.appId;
        const instanceId = `${appId}-shared-instance`;

        await broker.registerTile(instanceId, appId, { appId, name: appId });
        setTimeout(() => {
          void broker.addIntentListener('ViewChart', handler, { appId, instanceId });
        }, 10);

        return { appId, instanceId };
      });

      await Promise.all([
        broker.raiseIntent('ViewChart', mockContext, undefined, mockSource),
        broker.raiseIntent(
          'ViewChart',
          { type: 'fdc3.chart', id: { ticker: 'MSFT' } },
          undefined,
          mockSource,
        ),
      ]);

      expect(mockCallbacks.onTileOpen).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('should clear pending listener waits after registration resolves', async () => {
      vi.useFakeTimers();
      const warnSpy = vi.spyOn(broker['logger'], 'warn');

      const waitForListener = broker['waitForIntentListener']('app1', 'ViewChart', 30_000);

      await broker.registerTile('tile-new', 'app1', {
        appId: 'app1',
        name: 'App 1',
      });
      await broker.addIntentListener('ViewChart', vi.fn(), {
        appId: 'app1',
        instanceId: 'tile-new',
      });
      await expect(waitForListener).resolves.toBeUndefined();

      expect(broker['pendingIntentListeners'].get('app1')).toBeUndefined();

      vi.advanceTimersByTime(30_000);

      expect(warnSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('waitForListener ✗: timeout'),
        expect.anything(),
        'intent',
      );
    });
  });

  describe('error handling', () => {
    it('should throw when no target found', async () => {
      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([]);

      await expect(
        broker.raiseIntent('NonExistent', mockContext, undefined, mockSource),
      ).rejects.toThrow('No target found for intent: NonExistent');
    });

    it('should throw when user cancels ambiguous resolution', async () => {
      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1, mockApp2]);

      vi.mocked(mockCallbacks.onShowResolverUI).mockResolvedValue(null);

      await expect(broker.raiseIntent('ViewChart', mockContext)).rejects.toThrow(
        'User cancelled intent resolution',
      );
    });

    it('should throw when not entitled to send intent', async () => {
      // broker["setCurrentTile"]("tile-1");

      const denyEntitlements = vi.fn().mockResolvedValue(false);
      const configWithDeny = {
        ...mockConfig,
        callbacks: {
          ...mockCallbacks,
          onValidateEntitlements: denyEntitlements,
        },
      };

      const restrictedBroker = new Broker(configWithDeny);
      // restrictedBroker["setCurrentTile"]("tile-1");

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);

      await expect(
        restrictedBroker.raiseIntent('ViewChart', mockContext, undefined, mockSource),
      ).rejects.toThrow('Not entitled to send this intent');
    });
  });

  describe('logging and performance', () => {
    it('should log intent raising with debug mode', async () => {
      const debugConfig = { ...mockConfig, enableDebug: true };
      const debugBroker = new Broker(debugConfig);

      // Override onTileOpen to use debugBroker
      vi.mocked(mockCallbacks.onTileOpen).mockImplementation(async (target) => {
        const appId = typeof target === 'string' ? target : target.appId;
        const instanceId = `${appId}-instance-debug`;
        debugBroker['registerTile'](instanceId, appId, { appId, name: appId });
        await debugBroker.addIntentListener('ViewChart', async () => {}, {
          appId,
          instanceId,
        });
      });

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(mockApp1);

      const logSpy = vi.spyOn(debugBroker['logger'], 'debug');

      await debugBroker.raiseIntent('ViewChart', mockContext, undefined, mockSource);

      expect(logSpy).toHaveBeenCalledWith('raiseIntent', {
        intent: 'ViewChart',
        context: mockContext,
        target: undefined,
        sourceTile: { appId: 'tile-1', instanceId: 'tile-1' },
      });
    });

    it('should track performance of raiseIntent', async () => {
      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(mockApp1);

      const measureSpy = vi.spyOn(broker['perf'], 'measure');

      await broker.raiseIntent('ViewChart', mockContext, undefined, mockSource);

      expect(measureSpy).toHaveBeenCalledWith(
        'raiseIntent',
        expect.any(Function),
        expect.objectContaining({
          intent: 'ViewChart',
          sourceAppId: 'tile-1',
          sourceInstanceId: 'tile-1',
        }),
      );
    });
  });

  describe('edge cases', () => {
    it('should handle null context', async () => {
      const nullContext = null as unknown as Context;

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(mockApp1);

      // Should not throw
      await expect(
        broker.raiseIntent('ViewChart', nullContext, undefined, mockSource),
      ).resolves.toBeDefined();
    });

    it('should handle complex nested context', async () => {
      const complexContext: Context = {
        type: 'fdc3.complex',
        id: { id: '123' },
        nested: {
          level1: {
            level2: {
              data: 'value',
            },
          },
        },
      };

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(mockApp1);

      const result = await broker.raiseIntent('ViewChart', complexContext, undefined, mockSource);

      expect(result.source.appId).toBe('app1');
      expect(mockCallbacks.onTileOpen).toHaveBeenCalledWith(
        expect.objectContaining({ appId: 'app1' }),
      );
    });
  });
});
