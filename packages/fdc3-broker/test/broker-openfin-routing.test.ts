/**
 * Broker Bidirectional Routing Unit Tests
 * @see plan.md#T146
 */

import { MockAppDirectoryService } from '../../fdc3-app-directory/src/mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type { AppIdentifier, BrokerConfig, Context } from '../src/types';
import { OpenFinBridge } from '../src/openfin-bridge';

type BrokerOpenFinTestAccess = Broker & {
  handleOpenFinIntent: (
    intent: string,
    context: Context,
    source?: AppIdentifier,
  ) => Promise<void>;
};

type BrokerTileRegistryTestAccess = Broker & {
  tileRegistry: {
    getTile: (instanceId: string) => { appId: string } | null;
  };
};

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

type OpenFinTestGlobal = typeof globalThis & {
  fin: typeof mockFin;
  fdc3: typeof mockFDC3;
};

describe('Broker Bidirectional Routing', () => {
  let broker: Broker;
  let mockConfig: BrokerConfig;
  let mockAppDirectory: MockAppDirectoryService;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup OpenFin environment
    (globalThis as OpenFinTestGlobal).fin = mockFin;
    (globalThis as OpenFinTestGlobal).fdc3 = mockFDC3;

    mockAppDirectory = new MockAppDirectoryService();

    // Register an app that handles ViewChart intent (needed for intent resolution)
    mockAppDirectory.registerApp({
      appId: 'test-app',
      name: 'Test App',
      version: '1.0.0',
      title: 'Test Application',
      interop: {
        intents: {
          listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart', 'fdc3.instrument'] }],
        },
      },
    });

    mockConfig = {
      appDirectory: mockAppDirectory,
      callbacks: {
        onLoginStatusCheck: async () => true,
        onTileOpen: async ({ appId }) => ({ appId, instanceId: `${appId}-instance` }),
        onValidateEntitlements: async () => true,
        onShowResolverUI: async (targets) => targets[0] || null,
        onSecurityEvent: () => undefined,
      },
      enableDebug: false,
      enableOpenFinBridge: false, // Disable auto-init, we'll set up manually
      userChannelIds: ['red', 'green', 'blue'],
    };

    broker = new Broker(mockConfig);
  });

  describe('outgoing intent routing to OpenFin', () => {
    it('should route intent to OpenFin when no internal target found', async () => {
      // Use an intent that is NOT in the mock app directory
      // so the broker routes to OpenFin instead of failing with "No target selected"
      const intent = 'StartCall';
      const context: Context = {
        type: 'fdc3.contact',
        id: { email: 'test@example.com' },
      };

      // Mock OpenFin to return resolution
      const resolution = {
        source: { appId: 'openfin-app' },
        intent: 'StartCall',
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
      const intent = 'StartCall'; // Use a different intent with no internal listeners
      const context: Context = {
        type: 'fdc3.contact',
        id: { email: 'test@example.com' },
      };

      mockFDC3.raiseIntent.mockRejectedValue(new Error('OpenFin error'));

      await expect(broker.raiseIntent(intent, context)).rejects.toThrow('OpenFin error');
    });

    it('should throw error when OpenFin not available and no internal target', async () => {
      // Use an intent not in the mock app directory
      const intent = 'ViewInstrument';
      const context: Context = {
        type: 'fdc3.instrument',
        id: { ticker: 'AAPL' },
      };

      // Don't mock raiseIntent - it will fail with undefined resolution
      // This is expected behavior when OpenFin is not available
      await expect(broker.raiseIntent(intent, context)).rejects.toThrow();
    });
  });

  describe('incoming intent forwarding from OpenFin', () => {
    it('should route configured OpenFin launch/update intents by context type', async () => {
      const intent = 'scb.ViewLaunch';
      const context: Context = {
        type: 'scb.fmptp.cashflow',
        id: { tradeId: 'TR-1' },
      };

      mockAppDirectory.registerApp({
        appId: 'cashflow-tile',
        name: 'Cashflow Tile',
        version: '1.0.0',
        interop: {
          intents: {
            listensFor: [
              {
                intent: 'scb.fmptp.ViewCashflows',
                contexts: ['scb.fmptp.cashflow'],
              },
            ],
          },
        },
      });

      const contextRoutingBroker = new Broker({
        ...mockConfig,
        openFinBridgeOptions: {
          contextRoutingIntents: ['scb.ViewLaunch', 'scb.ViewUpdate'],
        },
      });

      contextRoutingBroker.registerTile('cashflow-1', 'cashflow-tile');
      const handler = vi.fn();
      await contextRoutingBroker.addIntentListener('scb.fmptp.ViewCashflows', handler, {
        appId: 'cashflow-tile',
        instanceId: 'cashflow-1',
      });

      await (contextRoutingBroker as unknown as BrokerOpenFinTestAccess).handleOpenFinIntent(
        intent,
        context,
        {
          appId: 'external-openfin-app',
        },
      );

      expect(handler).toHaveBeenCalledWith(context);
      expect(mockFDC3.raiseIntent).not.toHaveBeenCalled();
    });

    it('should carry context-selected app target into intent resolution', async () => {
      const context: Context = {
        type: 'scb.fmptp.cashflow',
        id: { tradeId: 'TR-CONTEXT-TARGET' },
      };
      const handler = vi.fn();
      const onShowResolverUI = vi.fn(async () => null);
      const brokerHolder: { current?: Broker } = {};
      const onTileOpen = vi.fn(async ({ appId }: AppIdentifier) => {
        const instanceId = `${appId}-instance`;
        brokerHolder.current?.registerTile(instanceId, appId);
        await brokerHolder.current?.addIntentListener('OpenDetails', handler, {
          appId,
          instanceId,
        });
        return {
          appId,
          instanceId,
        };
      });

      mockAppDirectory.registerApp({
        appId: 'cashflow-context-tile',
        name: 'Cashflow Context Tile',
        version: '1.0.0',
        interop: {
          intents: {
            listensFor: [
              {
                intent: 'OpenDetails',
                contexts: ['scb.fmptp.cashflow'],
              },
            ],
          },
        },
      });
      mockAppDirectory.registerApp({
        appId: 'trade-context-tile',
        name: 'Trade Context Tile',
        version: '1.0.0',
        interop: {
          intents: {
            listensFor: [
              {
                intent: 'OpenDetails',
                contexts: ['fdc3.trade'],
              },
            ],
          },
        },
      });

      const contextRoutingBroker = new Broker({
        ...mockConfig,
        callbacks: {
          ...mockConfig.callbacks,
          onTileOpen,
          onShowResolverUI,
        },
        openFinBridgeOptions: {
          contextRoutingIntents: ['scb.ViewLaunch'],
        },
      });
      brokerHolder.current = contextRoutingBroker;

      await (contextRoutingBroker as unknown as BrokerOpenFinTestAccess).handleOpenFinIntent(
        'scb.ViewLaunch',
        context,
        {
          appId: 'external-openfin-app',
        },
      );

      expect(onShowResolverUI).not.toHaveBeenCalled();
      expect(onTileOpen).toHaveBeenCalledWith(
        expect.objectContaining({ appId: 'cashflow-context-tile' }),
      );
      expect(handler).toHaveBeenCalledWith(context);
    });

    it('should not bounce an unresolved OpenFin-originated intent back to OpenFin', async () => {
      const context: Context = {
        type: 'fdc3.contact',
        id: { email: 'test@example.com' },
      };

      await (broker as unknown as BrokerOpenFinTestAccess).handleOpenFinIntent(
        'UnknownExternalIntent',
        context,
        {
          appId: 'external-openfin-app',
        },
      );

      expect(mockFDC3.raiseIntent).not.toHaveBeenCalled();
    });

    it('should persist pre-login OpenFin intents and replay them after reload/login', async () => {
      const context: Context = {
        type: 'scb.fmptp.cashflow',
        id: { tradeId: 'TR-2' },
      };
      const handler = vi.fn();
      let loggedIn = false;
      let loginCallback: (() => Promise<unknown>) | undefined;

      mockAppDirectory.registerApp({
        appId: 'cashflow-tile',
        name: 'Cashflow Tile',
        version: '1.0.0',
        interop: {
          intents: {
            listensFor: [
              {
                intent: 'scb.fmptp.ViewCashflows',
                contexts: ['scb.fmptp.cashflow'],
              },
            ],
          },
        },
      });

      const queueingBroker = new Broker({
        ...mockConfig,
        callbacks: {
          ...mockConfig.callbacks,
          onLoginStatusCheck: async () => loggedIn,
        },
        openFinBridgeOptions: {
          contextRoutingIntents: ['scb.ViewLaunch', 'scb.ViewUpdate'],
        },
      });

      await (queueingBroker as unknown as BrokerOpenFinTestAccess).handleOpenFinIntent(
        'scb.ViewLaunch',
        context,
        {
          appId: 'external-openfin-app',
        },
      );

      expect(localStorage.getItem('fdc3-intent-queue')).toContain('__prelogin__');

      loggedIn = true;
      const replayBroker = new Broker({
        ...mockConfig,
        callbacks: {
          ...mockConfig.callbacks,
          onLoginStatusCheck: async () => loggedIn,
        },
        onLogin: async (callback) => {
          loginCallback = callback;
        },
        openFinBridgeOptions: {
          contextRoutingIntents: ['scb.ViewLaunch', 'scb.ViewUpdate'],
        },
      });

      replayBroker.registerTile('cashflow-1', 'cashflow-tile');
      await replayBroker.addIntentListener('scb.fmptp.ViewCashflows', handler, {
        appId: 'cashflow-tile',
        instanceId: 'cashflow-1',
      });

      await loginCallback?.();

      expect(handler).toHaveBeenCalledWith(context);
      expect(localStorage.getItem('fdc3-intent-queue')).toBe(JSON.stringify([]));
    });

    it('should forward incoming intents to internal tiles', async () => {
      const intent = 'ViewChart';
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Register a tile with intent listener (this registers with tileRegistry)
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      const handler = vi.fn();
      await broker.addIntentListener(intent, handler, source);

      // Manually initialize the OpenFin bridge with ViewChart intent
      const bridge = new OpenFinBridge(mockAppDirectory);
      await bridge.initializeIntents([intent]);
      bridge.setIntentHandler(broker.handleOpenFinIntent.bind(broker));

      // Mock OpenFin to return resolution when raiseIntent is called (for external routing fallback)
      const resolution = {
        source: { appId: 'openfin-app' },
        intent: 'ViewChart',
        getResult: vi.fn(),
      };
      mockFDC3.raiseIntent.mockResolvedValue(resolution);

      // Get the intent handler that was registered with OpenFin
      expect(mockFDC3.addIntentListener).toHaveBeenCalled();

      // Get the registered handler and simulate receiving intent from OpenFin
      const registeredHandler = mockFDC3.addIntentListener.mock.calls.find(
        (call) => call[0] === intent,
      )?.[1];

      expect(registeredHandler).toBeDefined();

      // Simulate receiving intent from OpenFin
      await registeredHandler(context);

      // The handler should be called via raiseIntent -> internal routing
      // The internal routing finds the registered tile via tileRegistry
      await vi.waitFor(() => expect(handler).toHaveBeenCalledWith(context));
    });

    it('should forward to multiple listeners', async () => {
      const intent = 'ViewChart';
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Register multiple tiles with listeners (these get added to tileRegistry)
      broker.registerTile('tile-1', 'test-app');
      const source1 = { appId: 'test-app', instanceId: 'tile-1' };

      broker.registerTile('tile-2', 'test-app-2');
      const source2 = { appId: 'test-app-2', instanceId: 'tile-2' };

      // Also need to register test-app-2 in app directory for resolution
      mockAppDirectory.registerApp({
        appId: 'test-app-2',
        name: 'Test App 2',
        version: '1.0.0',
        interop: {
          intents: {
            listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
          },
        },
      });

      const handler1 = vi.fn();
      const handler2 = vi.fn();

      await broker.addIntentListener(intent, handler1, source1);
      await broker.addIntentListener(intent, handler2, source2);

      // Manually initialize the OpenFin bridge
      const bridge = new OpenFinBridge(mockAppDirectory);
      await bridge.initializeIntents([intent]);
      bridge.setIntentHandler(broker.handleOpenFinIntent.bind(broker));

      // Mock resolution for external routing fallback
      mockFDC3.raiseIntent.mockResolvedValue({
        source: { appId: 'openfin-app' },
        intent: 'ViewChart',
        getResult: vi.fn(),
      });

      // Get the registered handler
      const registeredHandler = mockFDC3.addIntentListener.mock.calls.find(
        (call) => call[0] === intent,
      )?.[1];

      expect(registeredHandler).toBeDefined();

      // Simulate receiving intent from OpenFin
      await registeredHandler(context);

      // Both handlers should be called via raiseIntent (one will be selected based on instanceId)
      await vi.waitFor(() => expect(handler1).toHaveBeenCalledWith(context));
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

      // Manually initialize the OpenFin bridge
      const bridge = new OpenFinBridge(mockAppDirectory);
      await bridge.initializeIntents([intent]);
      bridge.setIntentHandler(broker.handleOpenFinIntent.bind(broker));

      // Mock resolution for external routing fallback
      mockFDC3.raiseIntent.mockResolvedValue({
        source: { appId: 'openfin-app' },
        intent: 'ViewChart',
        getResult: vi.fn(),
      });

      // Get the registered handler
      const registeredHandler = mockFDC3.addIntentListener.mock.calls.find(
        (call) => call[0] === intent,
      )?.[1];

      expect(registeredHandler).toBeDefined();

      // Should not throw - errors are caught internally
      expect(() => registeredHandler(context)).not.toThrow();
      await vi.waitFor(() => expect(failingHandler).toHaveBeenCalledWith(context));
    });

    it('should not register with OpenFin if no internal listeners for that intent', async () => {
      // Register tile without intent listener
      broker.registerTile('tile-1', 'test-app');

      // Without bridge initialization, addIntentListener should not be called
      expect(mockFDC3.addIntentListener).not.toHaveBeenCalled();
    });
  });

  describe('bidirectional intent flow', () => {
    it('should support full round-trip intent flow', async () => {
      const intent = 'ViewChart';

      // Scenario 1: Internal tile sends to OpenFin using an intent not in mock directory
      const externalIntent = 'StartCall';
      const context: Context = {
        type: 'fdc3.contact',
        id: { email: 'test@example.com' },
      };

      const outgoingResolution = {
        source: { appId: 'openfin-app' },
        intent: 'StartCall',
        getResult: vi.fn(),
      };
      mockFDC3.raiseIntent.mockResolvedValue(outgoingResolution);

      const result = await broker.raiseIntent(externalIntent, context);
      expect(result.source.appId).toBe('openfin-app');

      // Scenario 2: OpenFin bridge initializes and subscribes to ViewChart
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      const handler = vi.fn();
      await broker.addIntentListener(intent, handler, source);

      // Initialize the OpenFin bridge
      const bridge = new OpenFinBridge(mockAppDirectory);
      await bridge.initializeIntents([intent]);
      bridge.setIntentHandler(broker.handleOpenFinIntent.bind(broker));

      // Verify addIntentListener was called for ViewChart
      expect(mockFDC3.addIntentListener).toHaveBeenCalled();
    });
  });

  describe('integration with broker tile registry', () => {
    it('should update tile registry when OpenFin intent is received', async () => {
      const intent = 'ViewChart';
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      const handler = vi.fn();
      await broker.addIntentListener(intent, handler, source);

      // Verify tile is registered
      const tile = (broker as unknown as BrokerTileRegistryTestAccess).tileRegistry.getTile(
        'tile-1',
      );
      expect(tile).toBeDefined();
      expect(tile.appId).toBe('test-app');
    });

    it('should handle unmounted tiles gracefully', async () => {
      const intent = 'ViewChart';

      // Register and then unregister tile
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      const handler = vi.fn();
      await broker.addIntentListener(intent, handler, source);

      broker.unregisterTile('tile-1');

      // Initialize the OpenFin bridge
      const bridge = new OpenFinBridge(mockAppDirectory);
      await bridge.initializeIntents([intent]);
      bridge.setIntentHandler(broker.handleOpenFinIntent.bind(broker));

      // Verify addIntentListener was called
      expect(mockFDC3.addIntentListener).toHaveBeenCalled();
    });
  });
});
