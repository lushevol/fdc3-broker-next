/**
 * Broker Intent Listener Cleanup & Scoping Tests
 */

import type { AppDirectoryClient } from '@fm/fdc3-app-directory';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type { BrokerConfig, Context } from '../src/types';

describe('Broker Intent Listeners', () => {
  let broker: Broker;
  let mockAppDirectory: AppDirectoryClient;
  let mockCallbacks: BrokerConfig['callbacks'];
  let mockConfig: BrokerConfig;

  const mockContext: Context = {
    type: 'fdc3.test',
    id: { testId: '123' },
  };

  const mockApp1 = {
    appId: 'app1',
    name: 'App 1',
    version: '1.0.0',
    title: 'Application 1',
    description: 'Test Application 1',
    interop: {
      intents: {
        listensFor: [{ intent: 'TestIntent', contexts: ['fdc3.test'] }],
      },
    },
  };

  beforeEach(() => {
    mockAppDirectory = {
      findByIntent: vi.fn(),
      findByContextType: vi.fn(),
      getApp: vi.fn(),
      getAllApps: vi.fn(),
      findByCategory: vi.fn(),
    } satisfies AppDirectoryClient;

    mockCallbacks = {
      onLoginStatusCheck: vi.fn().mockResolvedValue(true),
      onTileOpen: vi.fn(),
      onTileClose: vi.fn(),
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

  describe('Listener Cleanup', () => {
    it('should remove listeners when tile is unregistered', async () => {
      const instanceId = 'tile-1';
      const appId = 'app1';

      // Register tile
      await broker.registerTile(instanceId, appId, { appId, name: 'App 1' });

      // Add listener
      const handler = vi.fn();
      await broker.addIntentListener('TestIntent', handler, {
        appId,
        instanceId,
      });

      // Verify listener registered
      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      await broker.raiseIntent(
        'TestIntent',
        mockContext,
        { appId, instanceId },
        { appId: 'source', instanceId: 'source' },
      );
      expect(handler).toHaveBeenCalled();
      handler.mockClear();

      // Unregister tile (simulate close)
      broker.unregisterTile(instanceId);

      // Verify listener removed
      // We can check internal state or try to raise intent again
      // Trying to raise intent to that instance should fail or not call handler

      // Since instance is unmounted, raiseIntent might queue it or fail.
      // But let's check internal state via "private" access for verification
      const listeners = broker['intentListeners'].get('TestIntent');
      expect(listeners).toBeDefined();
      if (listeners) {
        // Should be empty or filtered out
        expect(listeners.length).toBe(0);
      }
    });

    it('should only remove listeners for the specific instance', async () => {
      const instanceId1 = 'tile-A';
      const instanceId2 = 'tile-B';
      const appId = 'app1';

      // Register two tiles for same app
      await broker.registerTile(instanceId1, appId, { appId, name: 'App 1' });
      await broker.registerTile(instanceId2, appId, { appId, name: 'App 1' });

      // Add listeners for both
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      await broker.addIntentListener('TestIntent', handler1, {
        appId,
        instanceId: instanceId1,
      });
      await broker.addIntentListener('TestIntent', handler2, {
        appId,
        instanceId: instanceId2,
      });

      // Unregister tile A
      broker.unregisterTile(instanceId1);

      // Verify listener for A is removed
      const listeners = broker['intentListeners'].get('TestIntent') || [];
      // Should have 1 listener left (for tile B)
      expect(listeners.length).toBe(1);

      // raises intent to B (via generic raise to verify B still listens? or explicitly check)
      // Check manually the listener source
      const remainingListener = listeners[0] as any;
      expect(remainingListener.source.instanceId).toBe(instanceId2);
    });
  });

  describe('Instance Scoping', () => {
    it('should deliver intent only to targeted instance', async () => {
      const instanceId1 = 'tile-A';
      const instanceId2 = 'tile-B';
      const appId = 'app1';

      // Register two tiles
      await broker.registerTile(instanceId1, appId, { appId, name: 'App 1' });
      await broker.registerTile(instanceId2, appId, { appId, name: 'App 1' });

      // Add listeners
      const handler1 = vi.fn().mockResolvedValue('result1');
      const handler2 = vi.fn().mockResolvedValue('result2');

      await broker.addIntentListener('TestIntent', handler1, {
        appId,
        instanceId: instanceId1,
      });
      await broker.addIntentListener('TestIntent', handler2, {
        appId,
        instanceId: instanceId2,
      });

      // Mock resolver finding
      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);

      // Raise intent targeting Instance A specifically
      await broker.raiseIntent(
        'TestIntent',
        mockContext,
        { appId, instanceId: instanceId1 },
        { appId: 'source', instanceId: 'source' },
      );

      // Verify only A's handler called
      expect(handler1).toHaveBeenCalledWith(mockContext);
      expect(handler2).not.toHaveBeenCalled();

      handler1.mockClear();

      // Raise intent targeting Instance B specifically
      await broker.raiseIntent(
        'TestIntent',
        mockContext,
        { appId, instanceId: instanceId2 },
        { appId: 'source', instanceId: 'source' },
      );

      // Verify only B's handler called
      expect(handler2).toHaveBeenCalledWith(mockContext);
      expect(handler1).not.toHaveBeenCalled();
    });
  });
});
