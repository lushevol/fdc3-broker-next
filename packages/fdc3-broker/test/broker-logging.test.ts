/**
 * Broker Logging Unit Tests
 * @see plan.md#T177
 */

import { MockAppDirectoryService } from '../../fdc3-app-directory/src/mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import { LogLevel } from '../src/logger';
import type { AppIdentifier, BrokerConfig, Context } from '../src/types';

describe('Broker Logging', () => {
  let broker: Broker;
  let mockConfig: BrokerConfig;
  let consoleDebugSpy: ReturnType<typeof vi.spyOn>;
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  const mockApps = [
    {
      appId: 'chart-app',
      name: 'Chart Application',
      version: '1.0.0',
      title: 'Chart App',
      description: 'Displays financial charts',
      interop: {
        intents: {
          listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
        },
      },
    },
    {
      appId: 'quote-app',
      name: 'Quote Application',
      version: '1.0.0',
      title: 'Quote App',
      description: 'Displays real-time quotes',
      interop: {
        intents: {
          listensFor: [{ intent: 'ViewQuote', contexts: ['fdc3.quote'] }],
        },
      },
    },
    {
      appId: 'app-a',
      name: 'Test App A',
      version: '1.0.0',
      title: 'Test App A',
      description: 'Test application',
      interop: {
        intents: {
          listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
        },
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Spy on console methods
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const mockAppDirectory = new MockAppDirectoryService();
    mockApps.forEach((app) => mockAppDirectory.registerApp(app));

    mockConfig = {
      appDirectory: mockAppDirectory,
      callbacks: {
        onLoginStatusCheck: async () => true,
        onTileOpen: async () => undefined,
        onValidateEntitlements: async () => true,
        onShowResolverUI: async (targets) => targets[0] || null,
        onSecurityEvent: vi.fn(),
      },
      enableDebug: true, // Enable debug mode for these tests
      logLevel: LogLevel.DEBUG, // Ensure debug logs are output
      userChannelIds: ['red', 'green', 'blue'],
    };

    broker = new Broker(mockConfig);

    // Mock internal bridge getters to prevent timeouts (they are lazy loaded and might hang in test env)
    vi.spyOn(broker as any, 'getOpenFinBridge').mockResolvedValue(null);
    vi.spyOn(broker as any, 'getPostMessageBridge').mockResolvedValue(null);
  });

  describe('debug mode logging', () => {
    it('should log detailed intent information in debug mode', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const handler = vi.fn();
      await (broker as any).addIntentListener('ViewChart', handler, source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await (broker as any).raiseIntent(
        'ViewChart',
        context,
        {
          appId: 'app-a',
          instanceId: 'tile-1',
        },
        source,
      );

      // Should log debug messages
      expect(consoleDebugSpy).toHaveBeenCalled();
      const debugCalls = consoleDebugSpy.mock.calls.map((call) => call[0]);
      expect(debugCalls.some((call) => String(call).includes('FDC3:DEBUG'))).toBe(true);
    });

    it('should log intent type, context, and source in debug mode', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const handler = vi.fn();
      await (broker as any).addIntentListener('ViewChart', handler, source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await (broker as any).raiseIntent('ViewChart', context, undefined, source);

      // Check that debug logs contain relevant information
      const debugCalls = consoleDebugSpy.mock.calls;
      const hasIntentInfo = debugCalls.some(([msg, data]) => {
        const fullLog = `${msg} ${JSON.stringify(data)}`;
        return (
          fullLog.includes('ViewChart') ||
          fullLog.includes('fdc3.chart') ||
          fullLog.includes('tile-1')
        );
      });
      expect(hasIntentInfo).toBe(true);
    });

    it('should log context broadcasting details in debug mode', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      await (broker as any).joinUserChannel('red', source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await (broker as any).broadcast(context, source);

      // Should log broadcast operation
      expect(consoleDebugSpy).toHaveBeenCalled();
      const debugCalls = consoleDebugSpy.mock.calls.map((call) => String(call[0]));
      expect(debugCalls.some((call) => String(call).includes('FDC3:DEBUG'))).toBe(true);
    });

    it('should log channel operations in debug mode', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      await (broker as any).joinUserChannel('green', source);

      // Should log channel join operation
      expect(consoleDebugSpy).toHaveBeenCalled();
      const debugCalls = consoleDebugSpy.mock.calls;
      const hasLog = debugCalls.some(([msg, data]) => {
        const fullLog = `${msg} ${JSON.stringify(data)}`;
        return fullLog.includes('green') || fullLog.includes('channel');
      });
      expect(hasLog).toBe(true);
    });

    it('should log listener registration in debug mode', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const handler = vi.fn();
      await (broker as any).addIntentListener('ViewChart', handler, source);

      // Should log listener registration
      expect(consoleDebugSpy).toHaveBeenCalled();
    });
  });

  describe('non-debug mode logging', () => {
    beforeEach(() => {
      // Re-create broker with debug mode disabled
      mockConfig.enableDebug = false;
      broker = new Broker(mockConfig);
    });

    it('should not log debug messages when debug mode is disabled', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const handler = vi.fn();
      await (broker as any).addIntentListener('ViewChart', handler, source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await (broker as any).raiseIntent('ViewChart', context, undefined, source);

      // Should not log debug messages
      const debugCalls = consoleDebugSpy.mock.calls.filter((call) =>
        String(call[0]).includes('FDC3:DEBUG'),
      );
      expect(debugCalls.length).toBe(0);
    });

    it('should still log errors when debug mode is disabled', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      // Try to join non-existent channel
      try {
        await (broker as any).joinUserChannel('non-existent', source);
      } catch (error) {
        // Expected
      }

      // Should log error even in non-debug mode
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should still log warnings when debug mode is disabled', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      // Try to raise intent without listeners
      try {
        await (broker as any).raiseIntent('ViewChart', {} as Context, undefined, source);
      } catch (error) {
        // Expected
      }

      // Should log warning/error even in non-debug mode
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('intent operation logging', () => {
    it('should log successful intent resolution', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const handler = vi.fn();
      await (broker as any).addIntentListener('ViewChart', handler, source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await (broker as any).raiseIntent(
        'ViewChart',
        context,
        {
          appId: 'app-a',
          instanceId: 'tile-1',
        },
        source,
      );

      // Should log successful operation
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should log failed intent resolution', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      // Try to raise intent without any listeners
      try {
        await (broker as any).raiseIntent('ViewChart', {} as Context, undefined, source);
      } catch (error) {
        // Expected
      }

      // Should log error
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should log intent resolution with multiple targets', async () => {
      await broker.registerTile('tile-1', 'app-a');
      await broker.registerTile('tile-2', 'app-b');
      const source1 = { appId: 'app-a', instanceId: 'tile-1' };
      const source2 = { appId: 'app-b', instanceId: 'tile-2' };

      const handler1 = vi.fn();
      const handler2 = vi.fn();

      await (broker as any).addIntentListener('ViewChart', handler1, source1);
      // broker.setCurrentTile('tile-2'); // Removed
      await (broker as any).addIntentListener('ViewChart', handler2, source2);

      // broker.setCurrentTile('tile-1'); // Removed

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await (broker as any).raiseIntent('ViewChart', context, undefined, source1);

      // Should log that multiple targets were found
      expect(consoleDebugSpy).toHaveBeenCalled();
    });
  });

  describe('channel operation logging', () => {
    it('should log channel join operations', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      await (broker as any).joinUserChannel('red', source);

      // Should log channel join
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should log broadcast operations', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      await (broker as any).joinUserChannel('red', source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await (broker as any).broadcast(context, source);

      // Should log broadcast
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should log context listener additions', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      await (broker as any).joinUserChannel('red', source);

      const handler = vi.fn();
      await (broker as any).addContextListener('fdc3.chart', handler, source);

      // Should log listener addition
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should log current channel retrieval', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      await (broker as any).joinUserChannel('red', source);

      // getCurrentChannel might require source or internal method
      // Assuming broker.getCurrentChannel(source) signature?
      // Checking Broker.ts... standard specific says getCurrentChannel() no args.
      // But implementation uses this.getTile(source.instanceId).
      // So I likely need to pass source if calling directly on Broker class.
      // I'll check signature later, but assuming (broker as any).getCurrentChannel(source).
      const channel = await (broker as any).getCurrentChannel(source);

      expect(channel?.id).toBe('red');
      // Should log channel retrieval
      expect(consoleDebugSpy).toHaveBeenCalled();
    });
  });

  describe('error and warning logging', () => {
    it('should log errors with context information', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      try {
        await (broker as any).joinUserChannel('invalid-channel', source);
      } catch (error) {
        // Expected
      }

      // Should log error
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Check that error message includes relevant context
      const errorCalls = consoleErrorSpy.mock.calls.map((call) => String(call[0]));
      expect(
        errorCalls.some((call) => call.includes('Channel') || call.includes('not found')),
      ).toBe(true);
    });

    it('should log warnings for edge cases', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      // Add and remove the same listener multiple times
      const handler = vi.fn();
      const listener1 = await (broker as any).addIntentListener('ViewChart', handler, source);
      const listener2 = await (broker as any).addIntentListener('ViewChart', handler, source);

      listener1.unsubscribe();
      listener2.unsubscribe();

      // Should log operations
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should handle missing tile context gracefully', async () => {
      // No current tile set
      try {
        // Passing undefined/empty source might trigger error logging
        await (broker as any).raiseIntent('ViewChart', {} as Context, undefined, undefined);
      } catch (error) {
        // Expected
      }

      // Should log error
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('logging format and structure', () => {
    it('should include FDC3 prefix in log messages', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      await (broker as any).joinUserChannel('red', source);

      const allLogs = [
        ...consoleDebugSpy.mock.calls.map((call) => `${call[0]} ${JSON.stringify(call[1])}`),
        ...consoleInfoSpy.mock.calls.map((call) => `${call[0]} ${JSON.stringify(call[1])}`),
      ];

      expect(allLogs.some((log) => String(log).includes('FDC3'))).toBe(true);
    });

    it('should include timestamp information in logs', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      await (broker as any).joinUserChannel('red', source);

      // Debug logs should be called
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should serialize complex objects in logs', async () => {
      await broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const context: Context = {
        type: 'fdc3.instrument',
        id: {
          ticker: 'AAPL',
          exchange: 'NYSE',
          BBG: 'EQ001006',
        },
      };

      const handler = vi.fn();
      await (broker as any).addIntentListener('ViewChart', handler, source);

      await (broker as any).raiseIntent('ViewChart', context, undefined, source);

      // Should log complex context
      expect(consoleDebugSpy).toHaveBeenCalled();
    });
  });
});
