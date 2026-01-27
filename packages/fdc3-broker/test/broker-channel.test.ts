/**
 * Broker Channel Methods Unit Tests
 * @see plan.md#T121
 */

import { MockAppDirectoryService } from '@fm/fdc3-app-directory/mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type { BrokerConfig, Channel, Context, PrivateChannel } from '../src/types';

describe('Broker Channel Methods', () => {
  let broker: Broker;
  let mockConfig: BrokerConfig;

  const mockContext: Context = {
    type: 'fdc3.chart',
    id: { ticker: 'AAPL' },
  };

  beforeEach(() => {
    const mockAppDirectory = new MockAppDirectoryService();

    mockConfig = {
      appDirectory: mockAppDirectory,
      callbacks: {
        onLoginStatusCheck: async () => true,
        onTileOpen: async () => undefined,
        onValidateEntitlements: async () => true,
        onShowResolverUI: async (targets) => targets[0] || null,
        onSecurityEvent: () => undefined,
      },
      enableDebug: false,
      userChannelIds: ['red', 'green', 'blue'],
    };

    broker = new Broker(mockConfig);
  });

  describe('getOrCreateChannel()', () => {
    it('should create new app channel', async () => {
      const channel = await broker.getOrCreateChannel('test-channel');

      expect(channel).toBeDefined();
      expect(channel.id).toBe('test-channel');
      expect(channel.type).toBe('app');
    });

    it('should return existing channel', async () => {
      const channel1 = await broker.getOrCreateChannel('same-channel');
      const channel2 = await broker.getOrCreateChannel('same-channel');

      expect(channel1.id).toBe(channel2.id);
    });

    it('should create channel with broadcast capability', async () => {
      const channel = await broker.getOrCreateChannel('test-channel');

      expect(typeof channel.broadcast).toBe('function');
    });

    it('should create channel with getCurrentContext capability', async () => {
      const channel = await broker.getOrCreateChannel('test-channel');

      expect(typeof channel.getCurrentContext).toBe('function');
    });

    it('should create channel with addContextListener capability', async () => {
      const channel = await broker.getOrCreateChannel('test-channel');

      expect(typeof channel.addContextListener).toBe('function');
    });
  });

  describe('createPrivateChannel()', () => {
    it('should create private channel', async () => {
      const channel = await broker.createPrivateChannel();

      expect(channel).toBeDefined();
      expect(channel.type).toBe('private');
      expect(channel.id).toMatch(/^private_/);
    });

    it('should grant access to current tile', async () => {
      broker['setCurrentTile']('tile-1');

      const channel = await broker.createPrivateChannel();

      if ('grantAccess' in channel) {
        expect((channel as any).hasAccess('tile-1')).toBe(true);
      }
    });

    it('should support broadcast', async () => {
      const channel = await broker.createPrivateChannel();

      expect(typeof channel.broadcast).toBe('function');
    });

    it('should support getCurrentContext', async () => {
      const channel = await broker.createPrivateChannel();

      expect(typeof channel.getCurrentContext).toBe('function');
    });

    it('should support addContextListener', async () => {
      const channel = await broker.createPrivateChannel();

      expect(typeof channel.addContextListener).toBe('function');
    });
  });

  describe('getUserChannels()', () => {
    it('should return array of user channels', async () => {
      const channels = await broker.getUserChannels();

      expect(Array.isArray(channels)).toBe(true);
      expect(channels.length).toBeGreaterThan(0);
    });

    it('should return configured user channels', async () => {
      const channels = await broker.getUserChannels();

      const ids = channels.map((c) => c.id);
      expect(ids).toContain('red');
      expect(ids).toContain('green');
      expect(ids).toContain('blue');
    });

    it('should return channels with type user', async () => {
      const channels = await broker.getUserChannels();

      channels.forEach((channel) => {
        expect(channel.type).toBe('user');
      });
    });

    it('should return channels with display metadata', async () => {
      const channels = await broker.getUserChannels();

      channels.forEach((channel) => {
        expect(channel.displayMetadata).toBeDefined();
        expect(channel.displayMetadata?.name).toBeDefined();
        expect(channel.displayMetadata?.color).toBeDefined();
      });
    });
  });

  describe('joinUserChannel()', () => {
    it('should join user channel', async () => {
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      await broker.joinUserChannel('red');

      const currentChannel = await broker.getCurrentChannel();
      expect(currentChannel?.id).toBe('red');
    });

    it('should throw when no current tile', async () => {
      await expect(broker.joinUserChannel('red')).rejects.toThrow('No current tile context');
    });

    it('should throw for non-existent channel', async () => {
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      await expect(broker.joinUserChannel('nonexistent')).rejects.toThrow('Channel not found');
    });

    it('should update tile registry', async () => {
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      await broker.joinUserChannel('green');

      const tile = broker['tileRegistry'].getTile('tile-1');
      expect(tile?.currentChannel?.id).toBe('green');
    });

    it('should switch from one channel to another', async () => {
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      await broker.joinUserChannel('red');
      expect((await broker.getCurrentChannel())?.id).toBe('red');

      await broker.joinUserChannel('blue');
      expect((await broker.getCurrentChannel())?.id).toBe('blue');
    });
  });

  describe('getCurrentChannel()', () => {
    it('should return null when tile not on channel', async () => {
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      const channel = await broker.getCurrentChannel();

      expect(channel).toBeNull();
    });

    it('should return current channel', async () => {
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      await broker.joinUserChannel('red');

      const channel = await broker.getCurrentChannel();

      expect(channel).toBeDefined();
      expect(channel?.id).toBe('red');
    });

    it('should return null when no current tile', async () => {
      const channel = await broker.getCurrentChannel();

      expect(channel).toBeNull();
    });
  });

  describe('leaveCurrentChannel()', () => {
    it('should leave current channel', async () => {
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      await broker.joinUserChannel('red');
      expect((await broker.getCurrentChannel())?.id).toBe('red');

      await broker.leaveCurrentChannel();
      expect(await broker.getCurrentChannel()).toBeNull();
    });

    it('should handle leaving when not on channel', async () => {
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      await expect(broker.leaveCurrentChannel()).resolves.toBeUndefined();
    });

    it('should handle leaving when no current tile', async () => {
      await expect(broker.leaveCurrentChannel()).resolves.toBeUndefined();
    });

    it('should update tile registry', async () => {
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      await broker.joinUserChannel('red');
      await broker.leaveCurrentChannel();

      const tile = broker['tileRegistry'].getTile('tile-1');
      expect(tile?.currentChannel).toBeUndefined();
    });
  });

  describe('broadcast()', () => {
    it('should broadcast to current channel', async () => {
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      await broker.joinUserChannel('red');

      const handler = vi.fn();
      const channel = await broker.getCurrentChannel();
      await channel?.addContextListener(null, handler);

      await broker.broadcast(mockContext);

      expect(handler).toHaveBeenCalledWith(mockContext);
    });

    it('should throw when not on channel', async () => {
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      await expect(broker.broadcast(mockContext)).rejects.toThrow('No channel joined');
    });

    it('should support complex context objects', async () => {
      const complexContext: Context = {
        type: 'fdc3.order',
        id: { orderId: '12345' },
        quantity: 100,
        price: 150.25,
      };

      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      await broker.joinUserChannel('green');

      const handler = vi.fn();
      const channel = await broker.getCurrentChannel();
      await channel?.addContextListener(null, handler);

      await broker.broadcast(complexContext);

      expect(handler).toHaveBeenCalledWith(complexContext);
    });
  });

  describe('addContextListener()', () => {
    it('should add listener to current channel', async () => {
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      await broker.joinUserChannel('red');

      const handler = vi.fn();
      const listener = await broker.addContextListener('fdc3.chart', handler);

      expect(listener).toBeDefined();
      expect(listener.unsubscribe).toBeDefined();
    });

    it('should call listener when context is broadcast', async () => {
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      await broker.joinUserChannel('blue');

      const handler = vi.fn();
      await broker.addContextListener('fdc3.chart', handler);

      await broker.broadcast(mockContext);

      expect(handler).toHaveBeenCalledWith(mockContext);
    });

    it('should filter by context type', async () => {
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      await broker.joinUserChannel('green');

      const chartHandler = vi.fn();
      const quoteHandler = vi.fn();

      await broker.addContextListener('fdc3.chart', chartHandler);
      await broker.addContextListener('fdc3.quote', quoteHandler);

      const chartContext: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await broker.broadcast(chartContext);

      expect(chartHandler).toHaveBeenCalled();
      expect(quoteHandler).not.toHaveBeenCalled();
    });

    it('should support null context type (all contexts)', async () => {
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      await broker.joinUserChannel('red');

      const handler = vi.fn();
      await broker.addContextListener(null, handler);

      const chartContext: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };
      const quoteContext: Context = {
        type: 'fdc3.quote',
        id: { ticker: 'MSFT' },
      };

      await broker.broadcast(chartContext);
      await broker.broadcast(quoteContext);

      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('should throw when not on channel', async () => {
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      await expect(broker.addContextListener('fdc3.chart', vi.fn())).rejects.toThrow(
        'No channel joined',
      );
    });

    it('should unsubscribe listener', async () => {
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      await broker.joinUserChannel('blue');

      const handler = vi.fn();
      const listener = await broker.addContextListener('fdc3.chart', handler);

      listener.unsubscribe();

      await broker.broadcast(mockContext);

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('channel operations with multiple tiles', () => {
    it('should support multiple tiles on same channel', async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      // Tile 1
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');
      await broker.joinUserChannel('red');
      await broker.addContextListener(null, handler1);

      // Tile 2
      broker['registerTile']('tile-2', 'test-app');
      broker['setCurrentTile']('tile-2');
      await broker.joinUserChannel('red');
      await broker.addContextListener(null, handler2);

      // Broadcast from tile 1
      broker['setCurrentTile']('tile-1');
      await broker.broadcast(mockContext);

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it('should isolate broadcasts by channel', async () => {
      const redHandler = vi.fn();
      const greenHandler = vi.fn();

      // Tile on red channel
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');
      await broker.joinUserChannel('red');
      await broker.addContextListener(null, redHandler);

      // Tile on green channel
      broker['registerTile']('tile-2', 'test-app');
      broker['setCurrentTile']('tile-2');
      await broker.joinUserChannel('green');
      await broker.addContextListener(null, greenHandler);

      // Broadcast on red channel
      broker['setCurrentTile']('tile-1');
      await broker.broadcast(mockContext);

      expect(redHandler).toHaveBeenCalled();
      expect(greenHandler).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle broadcast errors gracefully', async () => {
      broker['registerTile']('tile-1', 'test-app');
      broker['setCurrentTile']('tile-1');

      await broker.joinUserChannel('red');

      const errorHandler = vi.fn().mockRejectedValue(new Error('Handler error'));
      const normalHandler = vi.fn();

      const channel = await broker.getCurrentChannel();
      await channel?.addContextListener(null, errorHandler);
      await channel?.addContextListener(null, normalHandler);

      await broker.broadcast(mockContext);

      expect(normalHandler).toHaveBeenCalled();
    });
  });
});
