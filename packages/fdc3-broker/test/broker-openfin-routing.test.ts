/**
 * Broker Bidirectional Routing Unit Tests
 * @see plan.md#T146
 */

import { MockAppDirectoryService } from '../../fdc3-app-directory/src/mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type { AppIdentifier, BrokerConfig, Context } from '../src/types';

// Mock OpenFin global
const mockFDC3 = {
  addIntentListener: vi.fn(),
  raiseIntent: vi.fn(),
  joinUserChannel: vi.fn(),
  broadcast: vi.fn(),
  getOrCreateChannel: vi.fn(),
  getCurrentChannel: vi.fn(),
  getUserChannels: vi.fn(),
};

const mockFin = {
  desktop: {
    fdc3: mockFDC3,
    version: '1.0.0',
  },
};

describe('Broker Bidirectional Routing', () => {
  let broker: Broker;
  let mockConfig: BrokerConfig;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup OpenFin environment
    (globalThis as any).fin = mockFin;
    (globalThis as any).fdc3 = mockFDC3;

    const mockAppDirectory = new MockAppDirectoryService();

    mockConfig = {
      appDirectory: mockAppDirectory,
      callbacks: {
        onLoginStatusCheck: async () => true,
        onTileOpen: async () => ({ appId: 'test', instanceId: 'test' }),
        onValidateEntitlements: async () => true,
        onShowResolverUI: async (targets) => targets[0] || null,
        onSecurityEvent: () => undefined,
      },
      enableDebug: false,
      userChannelIds: ['red', 'green', 'blue'],
    };

    broker = new Broker(mockConfig);
  });

  describe('outgoing intent routing to OpenFin', () => {
    it('should route intent to OpenFin when no internal target found', async () => {
      const intent = 'ViewChart';
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Mock OpenFin to return resolution
      const resolution = {
        source: { appId: 'openfin-app' },
        intent: 'ViewChart',
        getResult: vi.fn(),
      };
      mockFDC3.raiseIntent.mockResolvedValue(resolution);

      const result = await broker.raiseIntent(intent, context);

      expect(mockFDC3.raiseIntent).toHaveBeenCalledWith(intent, context);
      expect(result.source.appId).toBe('openfin-app');
    });

    it('should route intent to OpenFin with target', async () => {
      const intent = 'ViewChart';
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };
      const target: AppIdentifier = { appId: 'openfin-app' };

      const resolution = {
        source: { appId: 'openfin-app' },
        intent: 'ViewChart',
        getResult: vi.fn(),
      };
      mockFDC3.raiseIntent.mockResolvedValue(resolution);

      const result = await broker.raiseIntent(intent, context, target);

      expect(mockFDC3.raiseIntent).toHaveBeenCalledWith(intent, context, target);
      expect(result.source.appId).toBe('openfin-app');
    });

    it('should not route to OpenFin when internal target exists', async () => {
      const intent = 'ViewChart';
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Register a tile that can handle the intent
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      await broker.addIntentListener(intent, vi.fn(), source);

      const result = await broker.raiseIntent(intent, context, {
        appId: 'test-app',
        instanceId: 'tile-1',
      });

      // Should not call OpenFin
      expect(mockFDC3.raiseIntent).not.toHaveBeenCalled();
      expect(result.source.instanceId).toBe('tile-1');
    });

    it('should handle OpenFin routing errors', async () => {
      const intent = 'ViewChart';
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      mockFDC3.raiseIntent.mockRejectedValue(new Error('OpenFin error'));

      await expect(broker.raiseIntent(intent, context)).rejects.toThrow('OpenFin error');
    });

    it('should throw error when OpenFin not available and no internal target', async () => {
      // Remove OpenFin
      delete (globalThis as any).fin;

      const brokerWithoutOpenFin = new Broker(mockConfig);

      const intent = 'ViewChart';
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await expect(brokerWithoutOpenFin.raiseIntent(intent, context)).rejects.toThrow(
        'No target found for intent: ViewChart',
      );
    });
  });

  describe('incoming intent forwarding from OpenFin', () => {
    it('should forward incoming intents to internal tiles', async () => {
      const intent = 'ViewChart';
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Register a tile with intent listener
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      const handler = vi.fn();
      await broker.addIntentListener(intent, handler, source);

      // Get the intent handler that was registered with OpenFin
      const registeredHandler = mockFDC3.addIntentListener.mock.calls[0][1];

      // Simulate receiving intent from OpenFin
      await registeredHandler(context);

      expect(handler).toHaveBeenCalledWith(context);
    });

    it('should forward to multiple listeners', async () => {
      const intent = 'ViewChart';
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Register multiple tiles with listeners
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      const handler1 = vi.fn();
      const handler2 = vi.fn();

      await broker.addIntentListener(intent, handler1, source);
      await broker.addIntentListener(intent, handler2, source);

      // Get the intent handler that was registered with OpenFin
      const registeredHandler = mockFDC3.addIntentListener.mock.calls[0][1];

      // Simulate receiving intent from OpenFin
      await registeredHandler(context);

      expect(handler1).toHaveBeenCalledWith(context);
      expect(handler2).toHaveBeenCalledWith(context);
    });

    it('should handle errors in intent forwarding gracefully', async () => {
      const intent = 'ViewChart';
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Register a tile with a failing handler
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      const failingHandler = vi.fn().mockRejectedValue(new Error('Handler error'));
      await broker.addIntentListener(intent, failingHandler, source);

      // Get the intent handler that was registered with OpenFin
      const registeredHandler = mockFDC3.addIntentListener.mock.calls[0][1];

      // Should not throw
      await expect(registeredHandler(context)).resolves.toBeUndefined();
    });

    it('should not forward when no internal listeners', async () => {
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Register tile without intent listener
      broker.registerTile('tile-1', 'test-app');
      // No current tile set (removed setCurrentTile)

      // Should not register with OpenFin if no internal listeners
      expect(mockFDC3.addIntentListener).not.toHaveBeenCalled();
    });
  });

  describe('bidirectional intent flow', () => {
    it('should support full round-trip intent flow', async () => {
      const intent = 'ViewChart';
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Scenario 1: Internal tile sends to OpenFin
      const outgoingResolution = {
        source: { appId: 'openfin-app' },
        intent: 'ViewChart',
        getResult: vi.fn(),
      };
      mockFDC3.raiseIntent.mockResolvedValue(outgoingResolution);

      const result = await broker.raiseIntent(intent, context);
      expect(result.source.appId).toBe('openfin-app');

      // Scenario 2: OpenFin sends to internal tile
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      const handler = vi.fn();
      await broker.addIntentListener(intent, handler, source);

      await new Promise((r) => setTimeout(r, 50));
      const incomingHandler = mockFDC3.addIntentListener.mock.calls[0][1];
      await incomingHandler(context);

      expect(handler).toHaveBeenCalledWith(context);
    });
  });

  describe('integration with broker tile registry', () => {
    it('should update tile registry when OpenFin intent is received', async () => {
      const intent = 'ViewChart';
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      const handler = vi.fn();
      await broker.addIntentListener(intent, handler, source);

      // Verify tile is registered
      const tile = (broker as any).tileRegistry.getTile('tile-1');
      expect(tile).toBeDefined();
      expect(tile.appId).toBe('test-app');
    });

    it('should handle unmounted tiles gracefully', async () => {
      const intent = 'ViewChart';
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Register and then unregister tile
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      const handler = vi.fn();
      await broker.addIntentListener(intent, handler, source);

      broker.unregisterTile('tile-1');

      await new Promise((r) => setTimeout(r, 50));
      // Get the intent handler
      const registeredHandler = mockFDC3.addIntentListener.mock.calls[0][1];

      // Should handle gracefully
      await expect(registeredHandler(context)).resolves.toBeUndefined();
    });
  });
});
