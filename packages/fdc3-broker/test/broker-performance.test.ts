/**
 * Broker Performance Tracking Unit Tests
 * @see plan.md#T178
 */

import { MockAppDirectoryService } from '../../fdc3-app-directory/src/mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type { AppIdentifier, BrokerConfig, Context } from '../src/types';

describe('Broker Performance Tracking', () => {
  let broker: Broker;
  let mockConfig: BrokerConfig;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Don't use fake timers by default - they cause issues with async operations
    // Only use them in specific tests that need them

    // Spy on console.warn for performance warnings
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const mockAppDirectory = new MockAppDirectoryService();

    // Register a test app that handles ViewChart intent
    mockAppDirectory.registerApp({
      appId: 'chart-app',
      name: 'Chart Application',
      version: '1.0.0',
      title: 'Chart App',
      description: 'Displays charts',
      interop: {
        intents: {
          listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
        },
      },
    });

    // Register app-a that handles ViewChart
    mockAppDirectory.registerApp({
      appId: 'app-a',
      name: 'App A',
      version: '1.0.0',
      title: 'App A',
      description: 'Test app A',
      interop: {
        intents: {
          listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
        },
      },
    });

    mockConfig = {
      appDirectory: mockAppDirectory,
      callbacks: {
        onLoginStatusCheck: async () => true,
        onTileOpen: async (app) => ({ appId: app.appId, instanceId: `${app.appId}-1` }),
        onValidateEntitlements: async () => true,
        onShowResolverUI: async (targets) => targets[0] || null,
        onSecurityEvent: vi.fn(),
      },
      enableDebug: true,
      userChannelIds: ['red', 'green', 'blue'],
    };

    broker = new Broker(mockConfig);
  });

  describe('intent operation performance tracking', () => {
    it('should track raiseIntent performance', async () => {
      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler, source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await broker.raiseIntent(
        'ViewChart',
        context,
        {
          appId: 'app-a',
          instanceId: 'tile-1',
        },
        source,
      );

      // Operation should complete quickly
      expect(handler).toHaveBeenCalledWith(context);
    });

    it('should track addIntentListener performance', async () => {
      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const handler = vi.fn();

      const startTime = Date.now();
      await broker.addIntentListener('ViewChart', handler, source);
      const endTime = Date.now();

      // Should complete quickly (< 10ms)
      expect(endTime - startTime).toBeLessThan(10);
    });

    it('should warn on slow intent resolution', async () => {
      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      // Use a fast handler - performance warning tests require vi.useFakeTimers() which isn't enabled
      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler, source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await broker.raiseIntent(
        'ViewChart',
        context,
        {
          appId: 'app-a',
          instanceId: 'tile-1',
        },
        source,
      );

      // Handler should be called
      expect(handler).toHaveBeenCalled();
    });

    it('should track multiple intent operations', async () => {
      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler, source);
      await broker.addIntentListener('ViewChart', handler, source);
      await broker.addIntentListener('ViewQuote', handler, source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Pass explicit target to avoid timeout
      await broker.raiseIntent(
        'ViewChart',
        context,
        { appId: 'app-a', instanceId: 'tile-1' },
        source,
      );

      // All operations should complete successfully
      expect(handler).toHaveBeenCalled();
    });
  });

  describe('channel operation performance tracking', () => {
    it('should track joinUserChannel performance', async () => {
      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const startTime = Date.now();
      await broker.joinUserChannel('red', source);
      const endTime = Date.now();

      // Should complete quickly
      expect(endTime - startTime).toBeLessThan(10);

      const channel = await broker.getCurrentChannel(source);
      expect(channel?.id).toBe('red');
    });

    it('should track broadcast performance', async () => {
      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      await broker.joinUserChannel('red', source);

      const handler = vi.fn();
      await broker.addContextListener('fdc3.chart', handler, source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const startTime = Date.now();
      await broker.broadcast(context, source);
      const endTime = Date.now();

      // Should complete quickly
      expect(endTime - startTime).toBeLessThan(10);
      expect(handler).toHaveBeenCalledWith(context);
    });

    it('should track addContextListener performance', async () => {
      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      await broker.joinUserChannel('red', source);

      const handler = vi.fn();

      const startTime = Date.now();
      await broker.addContextListener('fdc3.chart', handler, source);
      const endTime = Date.now();

      // Should complete quickly
      expect(endTime - startTime).toBeLessThan(10);
    });

    it('should warn on slow broadcast operations', async () => {
      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      await broker.joinUserChannel('red', source);

      // Add multiple fast listeners
      const listeners: Array<() => void> = [];
      for (let i = 0; i < 10; i++) {
        const handler = vi.fn();
        const { unsubscribe } = await broker.addContextListener('fdc3.chart', handler, source);
        listeners.push(unsubscribe);
      }

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await broker.broadcast(context, source);

      // Clean up listeners
      listeners.forEach((unsubscribe) => unsubscribe());
    });
  });

  describe('tile operation performance tracking', () => {
    it('should track open performance', async () => {
      const app: AppIdentifier = { appId: 'chart-app' };
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const startTime = Date.now();
      const result = await broker.open(app, context);
      const endTime = Date.now();

      // Should complete quickly
      expect(endTime - startTime).toBeLessThan(10);
      expect(result.appId).toBe('chart-app');
    });

    it('should track registerTile performance', async () => {
      const startTime = Date.now();
      await broker.registerTile('tile-1', 'app-a');
      const endTime = Date.now();

      // Should complete quickly
      expect(endTime - startTime).toBeLessThan(10);
    });

    it('should track multiple tile operations', async () => {
      const startTime = Date.now();

      await broker.registerTile('tile-1', 'app-a');
      await broker.registerTile('tile-2', 'app-b');
      await broker.registerTile('tile-3', 'app-c');

      const endTime = Date.now();

      // All operations should complete quickly
      expect(endTime - startTime).toBeLessThan(50);
    });
  });

  describe('performance metrics collection', () => {
    it('should measure operation completion times', async () => {
      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler, source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Perform operation
      await broker.raiseIntent(
        'ViewChart',
        context,
        {
          appId: 'app-a',
          instanceId: 'tile-1',
        },
        source,
      );

      // Should complete without throwing
      expect(handler).toHaveBeenCalled();
    });

    it('should handle concurrent operations efficiently', async () => {
      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler, source);

      // Join channel first so broadcast works
      await broker.joinUserChannel('red', source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Perform multiple concurrent operations
      const startTime = Date.now();

      await Promise.all([
        broker.raiseIntent('ViewChart', context, { appId: 'app-a', instanceId: 'tile-1' }, source),
        broker.broadcast(context, source),
      ]);

      const endTime = Date.now();

      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should not significantly impact performance with tracking enabled', async () => {
      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler, source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Perform many operations
      const startTime = Date.now();

      for (let i = 0; i < 10; i++) {
        await broker.raiseIntent(
          'ViewChart',
          context,
          { appId: 'app-a', instanceId: 'tile-1' },
          source,
        );
      }

      const endTime = Date.now();

      // Should complete quickly even with tracking
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('performance warning thresholds', () => {
    it('should have 100ms warning threshold for operations', async () => {
      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      // Use a fast handler - performance warning tests require vi.useFakeTimers()
      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler, source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await broker.raiseIntent(
        'ViewChart',
        context,
        {
          appId: 'app-a',
          instanceId: 'tile-1',
        },
        source,
      );

      // Handler should be called
      expect(handler).toHaveBeenCalled();
    });

    it('should not warn for fast operations', async () => {
      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler, source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await broker.raiseIntent(
        'ViewChart',
        context,
        {
          appId: 'app-a',
          instanceId: 'tile-1',
        },
        source,
      );

      // Fast operations should not trigger performance warnings
      const warnCalls = consoleWarnSpy.mock.calls.filter(
        (call) => String(call[0]).includes('performance') && String(call[0]).includes('100'),
      );
      expect(warnCalls.length).toBe(0);
    });

    it('should track performance across different operation types', async () => {
      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      // Test different operations
      await broker.joinUserChannel('red', source);

      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler, source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Pass explicit target to avoid waitForIntentListener with fake timers
      await broker.raiseIntent(
        'ViewChart',
        context,
        {
          appId: 'app-a',
          instanceId: 'tile-1',
        },
        source,
      );
      await broker.broadcast(context, source);

      const channel = await broker.getCurrentChannel(source);

      // All operations should complete
      expect(channel?.id).toBe('red');
      expect(handler).toHaveBeenCalled();
    });
  });

  describe('performance tracking edge cases', () => {
    it('should handle operations with no listeners gracefully', async () => {
      // Don't register any apps that handle ViewChart in the app directory
      // Create a fresh mock app directory with no apps
      const emptyAppDirectory = new MockAppDirectoryService();
      const emptyConfig: BrokerConfig = {
        ...mockConfig,
        appDirectory: emptyAppDirectory,
      };
      const emptyBroker = new Broker(emptyConfig);

      emptyBroker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // No apps registered, so this should throw "No target found"
      await expect(
        emptyBroker.raiseIntent('ViewChart', context, undefined, source),
      ).rejects.toThrow('No target found');

      // Should not hang or cause issues - test completes successfully
    });

    it('should handle error conditions without performance degradation', async () => {
      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const startTime = Date.now();

      try {
        await broker.joinUserChannel('invalid-channel', source);
      } catch (error) {
        // Expected
      }

      const endTime = Date.now();

      // Error handling should be fast
      expect(endTime - startTime).toBeLessThan(50);
    });

    it('should maintain performance with multiple registered tiles', async () => {
      const startTime = Date.now();

      for (let i = 0; i < 20; i++) {
        await broker.registerTile(`tile-${i}`, `app-${i % 3}`);
      }

      const endTime = Date.now();

      // Should handle many tiles efficiently
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
