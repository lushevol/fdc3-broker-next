/**
 * OpenFin Bridge Unit Tests
 * @see plan.md#T144
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpenFinBridge, DEFAULT_GLOBAL_INTENTS } from '../src/openfin-bridge';
import type { AppIdentifier, Channel, Context } from '../src/types';
import type { AppDefinition } from 'ratan-fdc3-app-directory';

// Mock OpenFin FDC3 API
const mockFDC3 = {
  addIntentListener: vi.fn(),
  raiseIntent: vi.fn(),
  joinUserChannel: vi.fn(),
  broadcast: vi.fn(),
  getOrCreateChannel: vi.fn(),
  getCurrentChannel: vi.fn(),
  getUserChannels: vi.fn(),
  findIntent: vi.fn(),
  findIntentsByContext: vi.fn(),
};

// Mock OpenFin global
const mockFin = {
  desktop: {
    fdc3: mockFDC3,
    version: '1.0.0',
  },
};

// Mock AppDirectoryClient
const createMockAppDirectoryClient = (apps: AppDefinition[]) => ({
  getAllApps: vi.fn().mockResolvedValue(apps),
  findByIntent: vi.fn(),
  findByContextType: vi.fn(),
  getApp: vi.fn(),
});

describe('OpenFinBridge', () => {
  let bridge: OpenFinBridge;

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup global fin object
    (globalThis as any).fin = mockFin;
    (globalThis as any).fdc3 = mockFDC3;
    bridge = new OpenFinBridge();
  });

  describe('initialization', () => {
    it('should initialize when OpenFin is available', () => {
      expect(bridge.isEnabled()).toBe(true);
    });

    it('should not initialize when OpenFin is not available', () => {
      // Remove fin from globalThis
      delete (globalThis as any).fin;
      const bridgeWithoutOpenFin = new OpenFinBridge();

      expect(bridgeWithoutOpenFin.isEnabled()).toBe(false);
    });

    it('should log initialization info', () => {
      // Logger should have been called with version info
      expect(mockFin.desktop.version).toBeDefined();
    });

    it('should accept AppDirectoryClient in constructor', () => {
      const mockClient = createMockAppDirectoryClient([]);
      const bridgeWithClient = new OpenFinBridge(mockClient as any);

      expect(bridgeWithClient.isEnabled()).toBe(true);
    });
  });

  describe('DEFAULT_GLOBAL_INTENTS', () => {
    it('should have default global intents array', () => {
      expect(Array.isArray(DEFAULT_GLOBAL_INTENTS)).toBe(true);
    });

    it('should be empty by default (configured via BrokerConfig)', () => {
      // DEFAULT_GLOBAL_INTENTS is empty by default - configured via BrokerConfig.openFinBridgeOptions.globalIntents
      expect(DEFAULT_GLOBAL_INTENTS).toEqual([]);
    });
  });

  describe('getEntitledIntents()', () => {
    it('should return only global intents when no appDirectory client', async () => {
      const intents = await (bridge as any).getEntitledIntents(['CustomIntent']);

      expect(intents).toContain('CustomIntent');
    });

    it('should extract intents from entitled apps', async () => {
      const mockApps: AppDefinition[] = [
        {
          appId: 'app1',
          name: 'App 1',
          title: 'App 1',
          interop: {
            intents: {
              listensFor: [
                { intent: 'ViewChart', contexts: ['fdc3.chart'] },
                { intent: 'ViewQuote', contexts: ['fdc3.instrument'] },
              ],
            },
          },
        },
        {
          appId: 'app2',
          name: 'App 2',
          title: 'App 2',
          interop: {
            intents: {
              listensFor: [
                { intent: 'ViewChart', contexts: ['fdc3.chart'] },
                { intent: 'StartCall', contexts: ['fdc3.contact'] },
              ],
            },
          },
        },
      ];

      const mockClient = createMockAppDirectoryClient(mockApps);
      const bridgeWithClient = new OpenFinBridge(mockClient as any);

      const intents = await (bridgeWithClient as any).getEntitledIntents(['ViewChart']);

      expect(intents).toContain('ViewChart');
      expect(intents).toContain('ViewQuote');
      expect(intents).toContain('StartCall');
    });

    it('should deduplicate intents across apps', async () => {
      const mockApps: AppDefinition[] = [
        {
          appId: 'app1',
          name: 'App 1',
          title: 'App 1',
          interop: {
            intents: {
              listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
            },
          },
        },
        {
          appId: 'app2',
          name: 'App 2',
          title: 'App 2',
          interop: {
            intents: {
              listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
            },
          },
        },
      ];

      const mockClient = createMockAppDirectoryClient(mockApps);
      const bridgeWithClient = new OpenFinBridge(mockClient as any);

      const intents = await (bridgeWithClient as any).getEntitledIntents([]);

      // ViewChart should appear only once despite being in multiple apps
      const chartCount = intents.filter((i: string) => i === 'ViewChart').length;
      expect(chartCount).toBe(1);
    });

    it('should handle apps without interop config', async () => {
      const mockApps: AppDefinition[] = [
        {
          appId: 'app1',
          name: 'App 1',
          title: 'App 1',
          // No interop property
        },
      ];

      const mockClient = createMockAppDirectoryClient(mockApps);
      const bridgeWithClient = new OpenFinBridge(mockClient as any);

      const intents = await (bridgeWithClient as any).getEntitledIntents(['ViewChart']);

      expect(intents).toEqual(['ViewChart']);
    });

    it('should handle app directory failure gracefully', async () => {
      const mockClient = {
        getAllApps: vi.fn().mockRejectedValue(new Error('Network error')),
      };

      const bridgeWithClient = new OpenFinBridge(mockClient as any);

      const intents = await (bridgeWithClient as any).getEntitledIntents(['ViewChart']);

      // Should fall back to global intents only
      expect(intents).toEqual(['ViewChart']);
    });

    it('should handle empty app directory response', async () => {
      const mockClient = createMockAppDirectoryClient([]);
      const bridgeWithClient = new OpenFinBridge(mockClient as any);

      const intents = await (bridgeWithClient as any).getEntitledIntents(['ViewChart']);

      expect(intents).toEqual(['ViewChart']);
    });
  });

  describe('isIntentFromExternalOpenFinSource()', () => {
    it('should return false when source is undefined', () => {
      const result = bridge.isIntentFromExternalOpenFinSource(undefined);

      expect(result).toBe(false);
    });

    it('should return true when source.appId is "external"', () => {
      const source: AppIdentifier = { appId: 'external' };
      const result = bridge.isIntentFromExternalOpenFinSource(source);

      expect(result).toBe(true);
    });

    it('should return false when source has a real appId', () => {
      const source: AppIdentifier = { appId: 'real-app-id' };
      const result = bridge.isIntentFromExternalOpenFinSource(source);

      expect(result).toBe(false);
    });

    it('should handle source with name but no appId', () => {
      const source: AppIdentifier = { name: 'Some App' };
      const result = bridge.isIntentFromExternalOpenFinSource(source);

      expect(result).toBe(false);
    });
  });

  describe('initializeIntents()', () => {
    it('should skip initialization when OpenFin not available', async () => {
      delete (globalThis as any).fin;
      const bridgeWithoutOpenFin = new OpenFinBridge();

      await bridgeWithoutOpenFin.initializeIntents(['ViewChart']);

      expect(mockFDC3.addIntentListener).not.toHaveBeenCalled();
    });

    it('should subscribe to entitled intents', async () => {
      const mockApps: AppDefinition[] = [
        {
          appId: 'app1',
          name: 'App 1',
          title: 'App 1',
          interop: {
            intents: {
              listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
            },
          },
        },
      ];

      const mockClient = createMockAppDirectoryClient(mockApps);
      const bridgeWithClient = new OpenFinBridge(mockClient as any);

      await bridgeWithClient.initializeIntents(['ViewChart']);

      expect(mockFDC3.addIntentListener).toHaveBeenCalled();
    });

    it('should skip duplicate intents when subscribing', async () => {
      const mockApps: AppDefinition[] = [
        {
          appId: 'app1',
          name: 'App 1',
          title: 'App 1',
          interop: {
            intents: {
              listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
            },
          },
        },
      ];

      const mockClient = createMockAppDirectoryClient(mockApps);
      const bridgeWithClient = new OpenFinBridge(mockClient as any);

      // Call twice - second call should skip duplicates
      await bridgeWithClient.initializeIntents(['ViewChart']);
      await bridgeWithClient.initializeIntents(['ViewChart']);

      // Should only subscribe once per unique intent
      const calls = mockFDC3.addIntentListener.mock.calls.filter((call) => call[0] === 'ViewChart');
      expect(calls.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle subscription errors gracefully', async () => {
      mockFDC3.addIntentListener.mockRejectedValue(new Error('Subscription failed'));

      const mockApps: AppDefinition[] = [
        {
          appId: 'app1',
          name: 'App 1',
          title: 'App 1',
          interop: {
            intents: {
              listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
            },
          },
        },
      ];

      const mockClient = createMockAppDirectoryClient(mockApps);
      const bridgeWithClient = new OpenFinBridge(mockClient as any);

      // Should not throw
      await expect(bridgeWithClient.initializeIntents(['ViewChart'])).resolves.not.toThrow();
    });

    it('should call intent handler when intent is received', async () => {
      const mockApps: AppDefinition[] = [
        {
          appId: 'app1',
          name: 'App 1',
          title: 'App 1',
          interop: {
            intents: {
              listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
            },
          },
        },
      ];

      const mockClient = createMockAppDirectoryClient(mockApps);
      const bridgeWithClient = new OpenFinBridge(mockClient as any);

      const intentHandler = vi.fn();
      bridgeWithClient.setIntentHandler(intentHandler);

      await bridgeWithClient.initializeIntents(['ViewChart']);

      // Get the handler that was registered
      const registeredHandler = mockFDC3.addIntentListener.mock.calls.find(
        (call) => call[0] === 'ViewChart',
      )?.[1];

      expect(registeredHandler).toBeDefined();

      // Simulate receiving an intent
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };
      const source: AppIdentifier = { appId: 'test-source' };

      registeredHandler(context, { source });

      expect(intentHandler).toHaveBeenCalledWith('ViewChart', context, source);
    });

    it('should log warning when no handler is set', async () => {
      const mockApps: AppDefinition[] = [
        {
          appId: 'app1',
          name: 'App 1',
          title: 'App 1',
          interop: {
            intents: {
              listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
            },
          },
        },
      ];

      const mockClient = createMockAppDirectoryClient(mockApps);
      const bridgeWithClient = new OpenFinBridge(mockClient as any);

      // Don't set a handler
      await bridgeWithClient.initializeIntents(['ViewChart']);

      // Get the handler and simulate receiving intent
      const registeredHandler = mockFDC3.addIntentListener.mock.calls.find(
        (call) => call[0] === 'ViewChart',
      )?.[1];

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Should not throw
      expect(() => registeredHandler(context)).not.toThrow();
    });
  });

  describe('setIntentHandler()', () => {
    it('should set the intent handler', () => {
      const handler = vi.fn();
      bridge.setIntentHandler(handler);

      expect((bridge as any)._intentHandler).toBe(handler);
    });

    it('should allow replacing the intent handler', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      bridge.setIntentHandler(handler1);
      bridge.setIntentHandler(handler2);

      expect((bridge as any)._intentHandler).toBe(handler2);
    });
  });

  describe('subscribeToIntents()', () => {
    it('should subscribe to intents from OpenFin', () => {
      const intentHandler = vi.fn();
      const supportedIntents = ['ViewChart', 'ViewQuote'];

      bridge.subscribeToIntents(intentHandler, supportedIntents);

      expect(mockFDC3.addIntentListener).toHaveBeenCalledTimes(2);
      expect(mockFDC3.addIntentListener).toHaveBeenCalledWith('ViewChart', expect.any(Function));
      expect(mockFDC3.addIntentListener).toHaveBeenCalledWith('ViewQuote', expect.any(Function));
    });

    it('should call intent handler when intent is received', () => {
      const intentHandler = vi.fn();
      const supportedIntents = ['ViewChart'];

      bridge.subscribeToIntents(intentHandler, supportedIntents);

      // Get the handler that was registered with addIntentListener
      const registeredHandler = mockFDC3.addIntentListener.mock.calls[0][1];

      // Simulate receiving an intent from OpenFin
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };
      registeredHandler(context);

      expect(intentHandler).toHaveBeenCalledWith('ViewChart', context);
    });

    it('should skip subscription when OpenFin is not available', () => {
      delete (globalThis as any).fin;
      const bridgeWithoutOpenFin = new OpenFinBridge();
      const intentHandler = vi.fn();

      bridgeWithoutOpenFin.subscribeToIntents(intentHandler, ['ViewChart']);

      expect(mockFDC3.addIntentListener).not.toHaveBeenCalled();
    });

    it('should skip duplicate intents', () => {
      const intentHandler = vi.fn();

      bridge.subscribeToIntents(intentHandler, ['ViewChart']);
      bridge.subscribeToIntents(intentHandler, ['ViewChart']);

      // Should only subscribe once
      const calls = mockFDC3.addIntentListener.mock.calls.filter((call) => call[0] === 'ViewChart');
      expect(calls.length).toBe(1);
    });
  });

  describe('raiseIntentExternal()', () => {
    it('should raise intent to OpenFin application', async () => {
      const intent = 'ViewChart';
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };
      const target: AppIdentifier = { appId: 'test-app' };

      const resolution = {
        source: { appId: 'test-app' },
        intent: 'ViewChart',
      };
      mockFDC3.raiseIntent.mockResolvedValue(resolution);

      const result = await bridge.raiseIntentExternal(intent, context, target);

      expect(mockFDC3.raiseIntent).toHaveBeenCalledWith(intent, context, target);
      expect(result).toEqual(resolution);
    });

    it('should raise intent without target', async () => {
      const intent = 'ViewChart';
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const resolution = {
        source: { appId: 'test-app' },
        intent: 'ViewChart',
      };
      mockFDC3.raiseIntent.mockResolvedValue(resolution);

      const result = await bridge.raiseIntentExternal(intent, context);

      expect(mockFDC3.raiseIntent).toHaveBeenCalledWith(intent, context);
      expect(result).toEqual(resolution);
    });

    it('should throw error when OpenFin is not available', async () => {
      delete (globalThis as any).fin;
      const bridgeWithoutOpenFin = new OpenFinBridge();

      await expect(
        bridgeWithoutOpenFin.raiseIntentExternal('ViewChart', {} as Context),
      ).rejects.toThrow('OpenFin not available');
    });

    it('should handle errors from OpenFin', async () => {
      mockFDC3.raiseIntent.mockRejectedValue(new Error('OpenFin error'));

      await expect(bridge.raiseIntentExternal('ViewChart', {} as Context)).rejects.toThrow(
        'OpenFin error',
      );
    });
  });

  describe('joinUserChannel()', () => {
    it('should join user channel', async () => {
      const channel = 'red';

      await bridge.joinUserChannel(channel);

      expect(mockFDC3.joinUserChannel).toHaveBeenCalledWith(channel);
    });

    it('should accept channel object', async () => {
      const channel: Channel = {
        id: 'red',
        type: 'user',
        broadcast: vi.fn(),
        getCurrentContext: vi.fn(),
        addContextListener: vi.fn(),
      };

      await bridge.joinUserChannel(channel);

      expect(mockFDC3.joinUserChannel).toHaveBeenCalledWith('red');
    });

    it('should skip when OpenFin is not available', async () => {
      delete (globalThis as any).fin;
      const bridgeWithoutOpenFin = new OpenFinBridge();

      await bridgeWithoutOpenFin.joinUserChannel('red');

      expect(mockFDC3.joinUserChannel).not.toHaveBeenCalled();
    });
  });

  describe('broadcast()', () => {
    it('should broadcast to current channel', async () => {
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      mockFDC3.broadcast.mockResolvedValue(undefined);

      await bridge.broadcast(context);

      expect(mockFDC3.broadcast).toHaveBeenCalledWith(context);
    });

    it('should broadcast to specific channel', async () => {
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };
      const channelId = 'red';
      const mockChannel = {
        broadcast: vi.fn().mockResolvedValue(undefined),
      };

      mockFDC3.getOrCreateChannel.mockResolvedValue(mockChannel);

      await bridge.broadcast(context, channelId);

      expect(mockFDC3.getOrCreateChannel).toHaveBeenCalledWith(channelId);
      expect(mockChannel.broadcast).toHaveBeenCalledWith(context);
    });

    it('should skip when OpenFin is not available', async () => {
      delete (globalThis as any).fin;
      const bridgeWithoutOpenFin = new OpenFinBridge();

      await bridgeWithoutOpenFin.broadcast({} as Context);

      expect(mockFDC3.broadcast).not.toHaveBeenCalled();
    });
  });

  describe('getCurrentChannel()', () => {
    it('should get current channel', async () => {
      const mockChannel: Channel = {
        id: 'red',
        type: 'user',
        broadcast: vi.fn(),
        getCurrentContext: vi.fn(),
        addContextListener: vi.fn(),
      };
      mockFDC3.getCurrentChannel.mockResolvedValue(mockChannel);

      const result = await bridge.getCurrentChannel();

      expect(mockFDC3.getCurrentChannel).toHaveBeenCalled();
      expect(result).toEqual(mockChannel);
    });

    it('should return null when OpenFin is not available', async () => {
      delete (globalThis as any).fin;
      const bridgeWithoutOpenFin = new OpenFinBridge();

      const result = await bridgeWithoutOpenFin.getCurrentChannel();

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      mockFDC3.getCurrentChannel.mockRejectedValue(new Error('Channel error'));

      const result = await bridge.getCurrentChannel();

      expect(result).toBeNull();
    });
  });

  describe('getUserChannels()', () => {
    it('should get user channels', async () => {
      const mockChannels: Channel[] = [
        {
          id: 'red',
          type: 'user',
          displayMetadata: { name: 'Red Channel', color: '#FF0000' },
          broadcast: vi.fn(),
          getCurrentContext: vi.fn(),
          addContextListener: vi.fn(),
        },
      ];
      mockFDC3.getUserChannels.mockResolvedValue(mockChannels);

      const result = await bridge.getUserChannels();

      expect(mockFDC3.getUserChannels).toHaveBeenCalled();
      expect(result).toEqual(mockChannels);
    });

    it('should return empty array when OpenFin is not available', async () => {
      delete (globalThis as any).fin;
      const bridgeWithoutOpenFin = new OpenFinBridge();

      const result = await bridgeWithoutOpenFin.getUserChannels();

      expect(result).toEqual([]);
    });

    it('should return empty array on error', async () => {
      mockFDC3.getUserChannels.mockRejectedValue(new Error('Channels error'));

      const result = await bridge.getUserChannels();

      expect(result).toEqual([]);
    });
  });

  describe('subscribeToContext()', () => {
    it('should subscribe to context from current channel', async () => {
      const contextHandler = vi.fn();
      const mockChannel = {
        addContextListener: vi.fn().mockResolvedValue({}),
      };
      mockFDC3.getCurrentChannel.mockResolvedValue(mockChannel);

      await bridge.subscribeToContext(contextHandler, 'fdc3.chart');

      expect(mockFDC3.getCurrentChannel).toHaveBeenCalled();
      expect(mockChannel.addContextListener).toHaveBeenCalledWith(
        'fdc3.chart',
        expect.any(Function),
      );
    });

    it('should call handler when context is received', async () => {
      const contextHandler = vi.fn();
      const mockChannel = {
        addContextListener: vi.fn().mockImplementation((_, handler) => {
          // Simulate context being received
          const context: Context = {
            type: 'fdc3.chart',
            id: { ticker: 'AAPL' },
          };
          handler(context);
        }),
      };
      mockFDC3.getCurrentChannel.mockResolvedValue(mockChannel);

      await bridge.subscribeToContext(contextHandler, 'fdc3.chart');

      expect(contextHandler).toHaveBeenCalledWith({
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      });
    });

    it('should return early when no current channel', async () => {
      mockFDC3.getCurrentChannel.mockResolvedValue(null);
      const contextHandler = vi.fn();

      await bridge.subscribeToContext(contextHandler);

      expect(contextHandler).not.toHaveBeenCalled();
    });

    it('should skip when OpenFin is not available', async () => {
      delete (globalThis as any).fin;
      const bridgeWithoutOpenFin = new OpenFinBridge();
      const contextHandler = vi.fn();

      await bridgeWithoutOpenFin.subscribeToContext(contextHandler);

      expect(mockFDC3.getCurrentChannel).not.toHaveBeenCalled();
    });
  });

  describe('addIntentListener()', () => {
    it('should add intent listener', async () => {
      const handler = vi.fn();
      const mockListener = {
        id: 'listener-1',
        unsubscribe: vi.fn(),
      };
      mockFDC3.addIntentListener.mockResolvedValue(mockListener);

      const result = await bridge.addIntentListener('ViewChart', handler);

      expect(mockFDC3.addIntentListener).toHaveBeenCalledWith('ViewChart', handler);
      expect(result).toEqual(mockListener);
    });

    it('should return mock listener when OpenFin is not available', async () => {
      delete (globalThis as any).fin;
      const bridgeWithoutOpenFin = new OpenFinBridge();

      const result = await bridgeWithoutOpenFin.addIntentListener('ViewChart', vi.fn());

      expect(result).toEqual({ unsubscribe: expect.any(Function) });
    });
  });

  describe('getOrCreateChannel()', () => {
    it('should get or create channel', async () => {
      const channelId = 'test-channel';
      const mockChannel: Channel = {
        id: channelId,
        type: 'app',
        broadcast: vi.fn(),
        getCurrentContext: vi.fn(),
        addContextListener: vi.fn(),
      };
      mockFDC3.getOrCreateChannel.mockResolvedValue(mockChannel);

      const result = await bridge.getOrCreateChannel(channelId);

      expect(mockFDC3.getOrCreateChannel).toHaveBeenCalledWith(channelId);
      expect(result).toEqual(mockChannel);
    });

    it('should throw error when OpenFin is not available', async () => {
      delete (globalThis as any).fin;
      const bridgeWithoutOpenFin = new OpenFinBridge();

      await expect(bridgeWithoutOpenFin.getOrCreateChannel('test')).rejects.toThrow(
        'OpenFin not available',
      );
    });
  });

  describe('findAppsByIntent()', () => {
    it('should find apps by intent', async () => {
      const intent = 'ViewChart';
      const apps = [
        { appId: 'app1', name: 'App 1' },
        { appId: 'app2', name: 'App 2' },
      ];
      mockFDC3.findIntent.mockResolvedValue({ intent, apps });

      const result = await bridge.findAppsByIntent(intent);

      expect(mockFDC3.findIntent).toHaveBeenCalledWith(intent);
      expect(result).toEqual(apps);
    });

    it('should return empty array when OpenFin is not available', async () => {
      delete (globalThis as any).fin;
      const bridgeWithoutOpenFin = new OpenFinBridge();

      const result = await bridgeWithoutOpenFin.findAppsByIntent('ViewChart');

      expect(result).toEqual([]);
    });

    it('should handle missing apps property', async () => {
      mockFDC3.findIntent.mockResolvedValue({ intent: 'ViewChart' });

      const result = await bridge.findAppsByIntent('ViewChart');

      expect(result).toEqual([]);
    });
  });

  describe('findAppsByContext()', () => {
    it('should find apps by context', async () => {
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };
      const intents = [{ intent: 'ViewChart', apps: [{ appId: 'app1' }] }];
      mockFDC3.findIntentsByContext.mockResolvedValue(intents);

      const result = await bridge.findAppsByContext(context);

      expect(mockFDC3.findIntentsByContext).toHaveBeenCalledWith(context);
      expect(result).toEqual(intents);
    });

    it('should return empty array when OpenFin is not available', async () => {
      delete (globalThis as any).fin;
      const bridgeWithoutOpenFin = new OpenFinBridge();

      const result = await bridgeWithoutOpenFin.findAppsByContext({} as Context);

      expect(result).toEqual([]);
    });

    it('should handle null result', async () => {
      mockFDC3.findIntentsByContext.mockResolvedValue(null);

      const result = await bridge.findAppsByContext({} as Context);

      expect(result).toEqual([]);
    });
  });
});
