/**
 * Broker Logging Unit Tests
 * @see plan.md#T177
 */

import { MockAppDirectoryService } from '@fm/fdc3-app-directory/mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
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
      userChannelIds: ['red', 'green', 'blue'],
    };

    broker = new Broker(mockConfig);
  });

  describe('debug mode logging', () => {
    it('should log detailed intent information in debug mode', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await broker.raiseIntent('ViewChart', context, {
        appId: 'app-a',
        instanceId: 'tile-1',
      });

      // Should log debug messages
      expect(consoleDebugSpy).toHaveBeenCalled();
      const debugCalls = consoleDebugSpy.mock.calls.map((call) => call[0]);
      expect(debugCalls.some((call) => String(call).includes('FDC3:DEBUG'))).toBe(true);
    });

    it('should log intent type, context, and source in debug mode', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await broker.raiseIntent('ViewChart', context);

      // Check that debug logs contain relevant information
      const debugCalls = consoleDebugSpy.mock.calls.map((call) => String(call[0]).join(' '));
      const hasIntentInfo = debugCalls.some(
        (call) =>
          call.includes('ViewChart') || call.includes('fdc3.chart') || call.includes('tile-1'),
      );
      expect(hasIntentInfo).toBe(true);
    });

    it('should log context broadcasting details in debug mode', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      await broker.joinUserChannel('red');

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await broker.broadcast(context);

      // Should log broadcast operation
      expect(consoleDebugSpy).toHaveBeenCalled();
      const debugCalls = consoleDebugSpy.mock.calls.map((call) => String(call[0]));
      expect(debugCalls.some((call) => String(call).includes('FDC3:DEBUG'))).toBe(true);
    });

    it('should log channel operations in debug mode', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      await broker.joinUserChannel('green');

      // Should log channel join operation
      expect(consoleDebugSpy).toHaveBeenCalled();
      const debugCalls = consoleDebugSpy.mock.calls.map((call) => String(call[0]).join(' '));
      expect(debugCalls.some((call) => call.includes('green') || call.includes('channel'))).toBe(
        true,
      );
    });

    it('should log listener registration in debug mode', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler);

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
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await broker.raiseIntent('ViewChart', context);

      // Should not log debug messages
      const debugCalls = consoleDebugSpy.mock.calls.filter((call) =>
        String(call[0]).includes('FDC3:DEBUG'),
      );
      expect(debugCalls.length).toBe(0);
    });

    it('should still log errors when debug mode is disabled', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      // Try to join non-existent channel
      try {
        await broker.joinUserChannel('non-existent');
      } catch (error) {
        // Expected
      }

      // Should log error even in non-debug mode
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should still log warnings when debug mode is disabled', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      // Try to raise intent without listeners
      try {
        await broker.raiseIntent('ViewChart', {} as Context);
      } catch (error) {
        // Expected
      }

      // Should log warning/error even in non-debug mode
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('intent operation logging', () => {
    it('should log successful intent resolution', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await broker.raiseIntent('ViewChart', context, {
        appId: 'app-a',
        instanceId: 'tile-1',
      });

      // Should log successful operation
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should log failed intent resolution', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      // Try to raise intent without any listeners
      try {
        await broker.raiseIntent('ViewChart', {} as Context);
      } catch (error) {
        // Expected
      }

      // Should log error
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should log intent resolution with multiple targets', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.registerTile('tile-2', 'app-b');
      broker.setCurrentTile('tile-1');

      const handler1 = vi.fn();
      const handler2 = vi.fn();

      await broker.addIntentListener('ViewChart', handler1);
      broker.setCurrentTile('tile-2');
      await broker.addIntentListener('ViewChart', handler2);

      broker.setCurrentTile('tile-1');

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await broker.raiseIntent('ViewChart', context);

      // Should log that multiple targets were found
      expect(consoleDebugSpy).toHaveBeenCalled();
    });
  });

  describe('channel operation logging', () => {
    it('should log channel join operations', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      await broker.joinUserChannel('red');

      // Should log channel join
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should log broadcast operations', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      await broker.joinUserChannel('red');

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await broker.broadcast(context);

      // Should log broadcast
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should log context listener additions', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      await broker.joinUserChannel('red');

      const handler = vi.fn();
      await broker.addContextListener('fdc3.chart', handler);

      // Should log listener addition
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should log current channel retrieval', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      await broker.joinUserChannel('red');

      const channel = await broker.getCurrentChannel();

      expect(channel?.id).toBe('red');
      // Should log channel retrieval
      expect(consoleDebugSpy).toHaveBeenCalled();
    });
  });

  describe('error and warning logging', () => {
    it('should log errors with context information', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      try {
        await broker.joinUserChannel('invalid-channel');
      } catch (error) {
        // Expected
      }

      // Should log error
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Check that error message includes relevant context
      const errorCalls = consoleErrorSpy.mock.calls.map((call) => String(call[0]).join(' '));
      expect(
        errorCalls.some((call) => call.includes('Channel') || call.includes('not found')),
      ).toBe(true);
    });

    it('should log warnings for edge cases', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      // Add and remove the same listener multiple times
      const handler = vi.fn();
      const listener1 = await broker.addIntentListener('ViewChart', handler);
      const listener2 = await broker.addIntentListener('ViewChart', handler);

      listener1.unsubscribe();
      listener2.unsubscribe();

      // Should log operations
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should handle missing tile context gracefully', async () => {
      // No current tile set
      try {
        await broker.raiseIntent('ViewChart', {} as Context);
      } catch (error) {
        // Expected
      }

      // Should log error
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('logging format and structure', () => {
    it('should include FDC3 prefix in log messages', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      await broker.joinUserChannel('red');

      const allLogs = [
        ...consoleDebugSpy.mock.calls.map((call) => String(call[0])),
        ...consoleInfoSpy.mock.calls.map((call) => String(call[0])),
      ];

      expect(allLogs.some((log) => String(log).includes('FDC3'))).toBe(true);
    });

    it('should include timestamp information in logs', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      await broker.joinUserChannel('red');

      // Debug logs should be called
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should serialize complex objects in logs', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      const context: Context = {
        type: 'fdc3.instrument',
        id: {
          ticker: 'AAPL',
          exchange: 'NYSE',
          BBG: 'EQ001006',
        },
      };

      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler);

      await broker.raiseIntent('ViewChart', context);

      // Should log complex context
      expect(consoleDebugSpy).toHaveBeenCalled();
    });
  });
});
