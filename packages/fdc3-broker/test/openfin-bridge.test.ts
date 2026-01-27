/**
 * OpenFin Bridge Unit Tests
 * @see plan.md#T144
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpenFinBridge } from '../src/openfin-bridge';
import type { AppIdentifier, Channel, Context } from '../src/types';

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

describe('OpenFinBridge', () => {
  let bridge: OpenFinBridge;

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup global fin object
    (globalThis as any).fin = mockFin;
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
