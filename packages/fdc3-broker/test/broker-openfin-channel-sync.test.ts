/**
 * Broker Channel Sync Unit Tests
 * @see plan.md#T147
 */

import { MockAppDirectoryService } from '../../fdc3-app-directory/src/mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type { BrokerConfig, Channel, Context } from '../src/types';

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

describe('Broker Channel Sync with OpenFin', () => {
  let broker: Broker;
  let mockConfig: BrokerConfig;
  let mockChannelBroadcast: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Create a mock channel with spyable broadcast
    mockChannelBroadcast = vi.fn().mockResolvedValue(undefined);
    const mockChannel = { broadcast: mockChannelBroadcast, id: 'red' };

    // Reset mock implementations as well since clearAllMocks doesn't reset mockRejectedValue/mockResolvedValue
    mockFDC3.joinUserChannel.mockImplementation(() => Promise.resolve());
    mockFDC3.broadcast.mockImplementation(() => Promise.resolve());
    mockFDC3.getOrCreateChannel.mockResolvedValue(mockChannel);
    mockFDC3.getUserChannels.mockImplementation(() => Promise.resolve([]));

    // Setup OpenFin environment - both fin and fdc3 need to be set
    // OpenFinBridge checks isOpenFinAvailable() which looks for fin.desktop
    // And then accesses (globalThis as any).fdc3 directly
    (globalThis as any).fin = mockFin;
    (globalThis as any).fdc3 = mockFDC3;

    const mockAppDirectory = new MockAppDirectoryService();

    mockConfig = {
      appDirectory: mockAppDirectory,
      callbacks: {
        onLoginStatusCheck: async () => true,
        onTileOpen: async (app) => ({ appId: app.appId, instanceId: `${app.appId}-1` }),
        onValidateEntitlements: async () => true,
        onShowResolverUI: async (targets) => targets[0] || null,
        onSecurityEvent: () => undefined,
      },
      enableDebug: false,
      userChannelIds: ['red', 'green', 'blue'],
    };

    broker = new Broker(mockConfig);
  });

  describe('joinUserChannel() sync', () => {
    it('should sync channel join with OpenFin', async () => {
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      await broker.joinUserChannel('red', source);

      expect(mockFDC3.joinUserChannel).toHaveBeenCalled();
      const channelArg = mockFDC3.joinUserChannel.mock.calls[0][0];
      // Bridge passes channel ID as string, not as object
      expect(channelArg).toBe('red');
    });

    it('should sync channel join with OpenFin when passed channel object', async () => {
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      // Get channel first
      const channels = await broker.getUserChannels();
      const redChannel = channels.find((c) => c.id === 'red');

      await broker.joinUserChannel(redChannel!.id, source);

      expect(mockFDC3.joinUserChannel).toHaveBeenCalled();
    });

    it('should not call OpenFin when not available', async () => {
      delete (globalThis as any).fin;
      const brokerWithoutOpenFin = new Broker(mockConfig);

      brokerWithoutOpenFin.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      await brokerWithoutOpenFin.joinUserChannel('red', source);

      expect(mockFDC3.joinUserChannel).not.toHaveBeenCalled();
    });

    it('should handle OpenFin sync errors gracefully', async () => {
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      mockFDC3.joinUserChannel.mockRejectedValue(new Error('OpenFin error'));

      // Should still throw error
      await expect(broker.joinUserChannel('red', source)).rejects.toThrow();
    });

    it('should maintain internal channel state even if OpenFin sync fails', async () => {
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      mockFDC3.joinUserChannel.mockRejectedValue(new Error('OpenFin error'));

      try {
        await broker.joinUserChannel('red', source);
      } catch (error) {
        // Expected to throw
      }

      // Internal channel should still be updated
      const currentChannel = await broker.getCurrentChannel(source);
      expect(currentChannel?.id).toBe('red');
    });
  });

  describe('broadcast() sync', () => {
    it('should sync broadcast with OpenFin', async () => {
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      await broker.joinUserChannel('red', source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await broker.broadcast(context, source);

      // OpenFin bridge calls getOrCreateChannel then channel.broadcast
      expect(mockFDC3.getOrCreateChannel).toHaveBeenCalledWith('red');
      expect(mockChannelBroadcast).toHaveBeenCalledWith(context);
    });

    it('should not sync with OpenFin when not available', async () => {
      delete (globalThis as any).fin;
      const brokerWithoutOpenFin = new Broker(mockConfig);

      brokerWithoutOpenFin.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      await brokerWithoutOpenFin.joinUserChannel('red', source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Add context listener to verify internal broadcast works
      const handler = vi.fn();
      const channel = await brokerWithoutOpenFin.getCurrentChannel(source);
      await channel?.addContextListener(null, handler);

      await brokerWithoutOpenFin.broadcast(context, source);

      expect(mockFDC3.broadcast).not.toHaveBeenCalled();
      expect(handler).toHaveBeenCalledWith(context);
    });

    it('should handle OpenFin broadcast errors gracefully', async () => {
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      await broker.joinUserChannel('red', source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Make the channel's broadcast reject
      mockChannelBroadcast.mockRejectedValue(new Error('OpenFin error'));

      // Should still throw error
      await expect(broker.broadcast(context, source)).rejects.toThrow('OpenFin error');
    });

    it('should broadcast to specific OpenFin channel', async () => {
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      await broker.joinUserChannel('green', source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const mockChannel = {
        broadcast: vi.fn().mockResolvedValue(undefined),
      };
      mockFDC3.getOrCreateChannel.mockResolvedValue(mockChannel);

      await broker.broadcast(context, source);

      expect(mockFDC3.getOrCreateChannel).toHaveBeenCalledWith('green');
      expect(mockChannel.broadcast).toHaveBeenCalledWith(context);
    });
  });

  describe('getUserChannels() merge', () => {
    it('should merge internal and OpenFin channels', async () => {
      const internalChannels = await broker.getUserChannels();
      const internalChannelIds = internalChannels.map((c) => c.id);

      expect(internalChannelIds).toContain('red');
      expect(internalChannelIds).toContain('green');
      expect(internalChannelIds).toContain('blue');
    });

    it('should include OpenFin-only channels', async () => {
      const openFinChannel: Channel = {
        id: 'custom-openfin',
        type: 'user',
        displayMetadata: { name: 'Custom OpenFin', color: '#FFFFFF' },
        broadcast: vi.fn(),
        getCurrentContext: vi.fn(),
        addContextListener: vi.fn(),
      };

      mockFDC3.getUserChannels.mockResolvedValue([openFinChannel]);

      const channels = await broker.getUserChannels();
      const channelIds = channels.map((c) => c.id);

      expect(channelIds).toContain('red');
      expect(channelIds).toContain('green');
      expect(channelIds).toContain('blue');
      expect(channelIds).toContain('custom-openfin');
    });

    it('should not duplicate channels that exist in both', async () => {
      const openFinChannel: Channel = {
        id: 'red',
        type: 'user',
        displayMetadata: { name: 'Red Channel', color: '#FF0000' },
        broadcast: vi.fn(),
        getCurrentContext: vi.fn(),
        addContextListener: vi.fn(),
      };

      mockFDC3.getUserChannels.mockResolvedValue([openFinChannel]);

      const channels = await broker.getUserChannels();
      const redChannels = channels.filter((c) => c.id === 'red');

      // Should only have one 'red' channel
      expect(redChannels.length).toBe(1);
    });

    it('should return only internal channels when OpenFin not available', async () => {
      delete (globalThis as any).fin;
      const brokerWithoutOpenFin = new Broker(mockConfig);

      const channels = await brokerWithoutOpenFin.getUserChannels();
      const channelIds = channels.map((c) => c.id);

      expect(channelIds).toContain('red');
      expect(channelIds).toContain('green');
      expect(channelIds).toContain('blue');
      expect(channelIds.length).toBe(3);
    });

    it('should handle OpenFin getUserChannels errors gracefully', async () => {
      mockFDC3.getUserChannels.mockRejectedValue(new Error('OpenFin error'));

      const channels = await broker.getUserChannels();

      // Should return internal channels
      expect(channels.length).toBeGreaterThan(0);
    });

    it('should preserve internal channel metadata', async () => {
      const channels = await broker.getUserChannels();
      const redChannel = channels.find((c) => c.id === 'red');

      expect(redChannel).toBeDefined();
      expect(redChannel?.type).toBe('user');
      expect(redChannel?.displayMetadata).toBeDefined();
      expect(redChannel?.displayMetadata?.name).toBeDefined();
    });
  });

  describe('channel switching sync', () => {
    it('should sync channel switches with OpenFin', async () => {
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      // Join first channel
      await broker.joinUserChannel('red', source);
      expect(mockFDC3.joinUserChannel).toHaveBeenCalledTimes(1);

      // Switch to another channel
      await broker.joinUserChannel('green', source);
      expect(mockFDC3.joinUserChannel).toHaveBeenCalledTimes(2);

      const currentChannel = await broker.getCurrentChannel(source);
      expect(currentChannel?.id).toBe('green');
    });

    it('should handle multiple tiles on different channels', async () => {
      // Tile 1 on red
      broker.registerTile('tile-1', 'test-app');
      const source1 = { appId: 'test-app', instanceId: 'tile-1' };
      await broker.joinUserChannel('red', source1);

      // Tile 2 on green
      broker.registerTile('tile-2', 'test-app');
      const source2 = { appId: 'test-app', instanceId: 'tile-2' };
      await broker.joinUserChannel('green', source2);

      expect(mockFDC3.joinUserChannel).toHaveBeenCalledTimes(2);

      // Verify tiles are on different channels
      expect((await broker.getCurrentChannel(source1))?.id).toBe('red');
      expect((await broker.getCurrentChannel(source2))?.id).toBe('green');
    });
  });

  describe('leaveCurrentChannel() sync', () => {
    it('should leave channel internally', async () => {
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      await broker.joinUserChannel('red', source);
      expect((await broker.getCurrentChannel(source))?.id).toBe('red');

      await broker.leaveCurrentChannel(source);
      expect(await broker.getCurrentChannel(source)).toBeNull();
    });

    it('should handle leaving when not on channel', async () => {
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      // Should not throw
      await expect(broker.leaveCurrentChannel(source)).resolves.toBeUndefined();
    });

    it('should handle leaving when no current tile', async () => {
      // Should not throw - using empty source
      await expect(
        broker.leaveCurrentChannel({ appId: '', instanceId: '' }),
      ).resolves.toBeUndefined();
    });
  });
});
