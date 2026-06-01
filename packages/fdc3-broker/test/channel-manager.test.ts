/**
 * ChannelManager Unit Tests
 * @see plan.md#T120
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { ChannelManager } from '../src/channel-manager';
import type { Context } from '../src/types';

describe('ChannelManager', () => {
  let channelManager: ChannelManager;
  const mockContext: Context = {
    type: 'fdc3.chart',
    id: { ticker: 'AAPL' },
  };

  beforeEach(() => {
    channelManager = new ChannelManager(['red', 'green', 'blue']);
  });

  describe('initialization', () => {
    it('should initialize with user channels', () => {
      const channels = channelManager.getUserChannels();

      expect(channels.length).toBe(3);
      expect(channels.map((c) => c.id)).toContain('red');
      expect(channels.map((c) => c.id)).toContain('green');
      expect(channels.map((c) => c.id)).toContain('blue');
    });

    it('should initialize with display metadata for user channels', () => {
      const channels = channelManager.getUserChannels();

      channels.forEach((channel) => {
        expect(channel.displayMetadata).toBeDefined();
        expect(channel.displayMetadata?.name).toBeDefined();
        expect(channel.displayMetadata?.color).toBeDefined();
      });
    });

    it('should use default user channels if not specified', () => {
      const defaultManager = new ChannelManager();

      const channels = defaultManager.getUserChannels();
      expect(channels.length).toBeGreaterThan(0);
    });
  });

  describe('createChannel()', () => {
    it('should create new app channel', () => {
      const channel = channelManager.createChannel('test-app-channel');

      expect(channel.id).toBe('test-app-channel');
      expect(channel.type).toBe('app');
    });

    it('should return existing channel if already created', () => {
      const channel1 = channelManager.createChannel('same-channel');
      const channel2 = channelManager.createChannel('same-channel');

      expect(channel1).toBe(channel2);
    });

    it('should return same instance for repeated calls', () => {
      const channel1 = channelManager.createChannel('my-channel');
      const channel2 = channelManager.createChannel('my-channel');

      expect(channel1.id).toBe(channel2.id);
    });
  });

  describe('getChannel()', () => {
    it('should return channel by id', () => {
      channelManager.createChannel('my-channel');

      const channel = channelManager.getChannel('my-channel');

      expect(channel).toBeDefined();
      expect(channel?.id).toBe('my-channel');
    });

    it('should return user channel', () => {
      const channel = channelManager.getChannel('red');

      expect(channel).toBeDefined();
      expect(channel?.id).toBe('red');
      expect(channel?.type).toBe('user');
    });

    it('should return null for non-existent channel', () => {
      const channel = channelManager.getChannel('nonexistent');

      expect(channel).toBeNull();
    });
  });

  describe('createPrivateChannel()', () => {
    it('should create private channel with unique id', () => {
      const channel1 = channelManager.createPrivateChannel();
      const channel2 = channelManager.createPrivateChannel();

      expect(channel1.id).not.toBe(channel2.id);
      expect(channel1.id).toMatch(/^private_/);
      expect(channel2.id).toMatch(/^private_/);
    });

    it('should create private channel with custom id', () => {
      const channel = channelManager.createPrivateChannel('my-private');

      expect(channel.id).toBe('my-private');
      expect(channel.type).toBe('private');
    });

    it('should support access control on private channel', () => {
      const channel = channelManager.createPrivateChannel();

      expect(channel.grantAccess).toBeDefined();
      expect(channel.revokeAccess).toBeDefined();
      expect(channel.hasAccess).toBeDefined();
    });
  });

  describe('getUserChannels()', () => {
    it('should return all user channels', () => {
      const channels = channelManager.getUserChannels();

      expect(channels.length).toBe(3);
      channels.forEach((channel) => {
        expect(channel.type).toBe('user');
      });
    });

    it('should include all configured user channels', () => {
      const channels = channelManager.getUserChannels();

      const ids = channels.map((c) => c.id);
      expect(ids).toContain('red');
      expect(ids).toContain('green');
      expect(ids).toContain('blue');
    });
  });

  describe('joinChannel()', () => {
    it('should add tile to channel', () => {
      const channel = channelManager.createChannel('test-channel');

      channelManager.joinChannel('tile-1', channel);

      expect(channelManager.isTileOnChannel('tile-1', 'test-channel')).toBe(true);
    });

    it('should remove tile from previous channel', () => {
      const channel1 = channelManager.createChannel('channel-1');
      const channel2 = channelManager.createChannel('channel-2');

      channelManager.joinChannel('tile-1', channel1);
      expect(channelManager.isTileOnChannel('tile-1', 'channel-1')).toBe(true);

      channelManager.joinChannel('tile-1', channel2);
      expect(channelManager.isTileOnChannel('tile-1', 'channel-1')).toBe(false);
      expect(channelManager.isTileOnChannel('tile-1', 'channel-2')).toBe(true);
    });

    it('should track multiple tiles on same channel', () => {
      const channel = channelManager.createChannel('shared-channel');

      channelManager.joinChannel('tile-1', channel);
      channelManager.joinChannel('tile-2', channel);
      channelManager.joinChannel('tile-3', channel);

      const tiles = channelManager.getTilesOnChannel('shared-channel');
      expect(tiles).toEqual(['tile-1', 'tile-2', 'tile-3']);
    });
  });

  describe('leaveChannel()', () => {
    it('should remove tile from channel', () => {
      const channel = channelManager.createChannel('test-channel');

      channelManager.joinChannel('tile-1', channel);
      expect(channelManager.isTileOnChannel('tile-1', 'test-channel')).toBe(true);

      channelManager.leaveChannel('tile-1');
      expect(channelManager.isTileOnChannel('tile-1', 'test-channel')).toBe(false);
    });

    it('should handle tile not on any channel', () => {
      expect(() => channelManager.leaveChannel('nonexistent')).not.toThrow();
    });

    it('should clear tile channel mapping', () => {
      const channel = channelManager.createChannel('test-channel');

      channelManager.joinChannel('tile-1', channel);
      expect(channelManager.getTileChannel('tile-1')?.id).toBe('test-channel');

      channelManager.leaveChannel('tile-1');
      expect(channelManager.getTileChannel('tile-1')).toBeNull();
    });
  });

  describe('getTileChannel()', () => {
    it('should return tile current channel', () => {
      const channel = channelManager.createChannel('test-channel');

      channelManager.joinChannel('tile-1', channel);

      const currentChannel = channelManager.getTileChannel('tile-1');
      expect(currentChannel).toBe(channel);
    });

    it('should return null for tile not on channel', () => {
      const currentChannel = channelManager.getTileChannel('nonexistent');

      expect(currentChannel).toBeNull();
    });
  });

  describe('broadcastToChannel()', () => {
    it('should broadcast context to channel listeners', async () => {
      const handler = vi.fn();

      const channel = channelManager.createChannel('test-channel');
      await channel.addContextListener(null, handler);

      await channelManager.broadcastToChannel('test-channel', mockContext);

      expect(handler).toHaveBeenCalledWith(mockContext);
    });

    it('should handle broadcast to non-existent channel', async () => {
      await expect(
        channelManager.broadcastToChannel('nonexistent', mockContext),
      ).resolves.toBeUndefined();
    });
  });

  describe('getAllChannels()', () => {
    it('should return all channels', () => {
      channelManager.createChannel('app-1');
      channelManager.createChannel('app-2');
      channelManager.createPrivateChannel('private-1');

      const channels = channelManager.getAllChannels();

      expect(channels.length).toBeGreaterThan(3);
    });

    it('should include app, user, and private channels', () => {
      // Create channels of different types
      channelManager.createChannel('app-1');
      channelManager.createPrivateChannel('private-1');

      const channels = channelManager.getAllChannels();

      const types = channels.map((c) => c.type);
      expect(types).toContain('app');
      expect(types).toContain('user');
      expect(types).toContain('private');
    });
  });

  describe('getChannelCount()', () => {
    it('should return total channel count', () => {
      const initialCount = channelManager.getChannelCount();

      channelManager.createChannel('app-1');
      channelManager.createChannel('app-2');
      channelManager.createPrivateChannel('private-1');

      expect(channelManager.getChannelCount()).toBe(initialCount + 3);
    });
  });

  describe('getTilesOnChannel()', () => {
    it('should return tiles on specific channel', () => {
      const channel = channelManager.createChannel('test-channel');

      channelManager.joinChannel('tile-1', channel);
      channelManager.joinChannel('tile-2', channel);

      const tiles = channelManager.getTilesOnChannel('test-channel');
      expect(tiles).toEqual(['tile-1', 'tile-2']);
    });

    it('should return empty array for channel with no tiles', () => {
      const tiles = channelManager.getTilesOnChannel('red');

      expect(tiles).toEqual([]);
    });

    it('should return empty array for non-existent channel', () => {
      const tiles = channelManager.getTilesOnChannel('nonexistent');

      expect(tiles).toEqual([]);
    });
  });

  describe('isTileOnChannel()', () => {
    it('should return true when tile is on channel', () => {
      const channel = channelManager.createChannel('test-channel');

      channelManager.joinChannel('tile-1', channel);

      expect(channelManager.isTileOnChannel('tile-1', 'test-channel')).toBe(true);
    });

    it('should return false when tile is not on channel', () => {
      channelManager.createChannel('test-channel');

      expect(channelManager.isTileOnChannel('tile-1', 'test-channel')).toBe(false);
    });

    it('should return false for non-existent channel', () => {
      expect(channelManager.isTileOnChannel('tile-1', 'nonexistent')).toBe(false);
    });
  });

  describe('getChannelStats()', () => {
    it('should return stats for channel', () => {
      const channel = channelManager.createChannel('test-channel');

      channelManager.joinChannel('tile-1', channel);
      channelManager.joinChannel('tile-2', channel);

      const stats = channelManager.getChannelStats('test-channel');

      expect(stats).toBeDefined();
      expect(stats?.tileCount).toBe(2);
      expect(stats?.type).toBe('app');
    });

    it('should return null for non-existent channel', () => {
      const stats = channelManager.getChannelStats('nonexistent');

      expect(stats).toBeNull();
    });

    it('should include listener count', async () => {
      const channel = channelManager.createChannel('test-channel');

      await channel.addContextListener(null, vi.fn());
      await channel.addContextListener('fdc3.chart', vi.fn());

      const stats = channelManager.getChannelStats('test-channel');

      expect(stats?.listenerCount).toBe(2);
    });
  });

  describe('hasChannel()', () => {
    it('should return true for user channel', () => {
      expect(channelManager.hasChannel('red')).toBe(true);
    });

    it('should return true for created app channel', () => {
      channelManager.createChannel('my-channel');

      expect(channelManager.hasChannel('my-channel')).toBe(true);
    });

    it('should return true for created private channel', () => {
      const channel = channelManager.createPrivateChannel();

      expect(channelManager.hasChannel(channel.id)).toBe(true);
    });

    it('should return false for non-existent channel', () => {
      expect(channelManager.hasChannel('nonexistent')).toBe(false);
    });
  });

  describe('getChannelsByType()', () => {
    it('should return app channels', () => {
      channelManager.createChannel('app-1');
      channelManager.createChannel('app-2');

      const channels = channelManager.getChannelsByType('app');

      expect(channels.length).toBeGreaterThanOrEqual(2);
      channels.forEach((c) => expect(c.type).toBe('app'));
    });

    it('should return user channels', () => {
      const channels = channelManager.getChannelsByType('user');

      expect(channels.length).toBe(3);
      channels.forEach((c) => expect(c.type).toBe('user'));
    });

    it('should return private channels', () => {
      channelManager.createPrivateChannel('private-1');
      channelManager.createPrivateChannel('private-2');

      const channels = channelManager.getChannelsByType('private');

      expect(channels.length).toBe(2);
      channels.forEach((c) => expect(c.type).toBe('private'));
    });

    it('should return an empty list for unknown channel types', () => {
      expect(channelManager.getChannelsByType('workspace' as never)).toEqual([]);
    });
  });

  describe('getChannelByType()', () => {
    it('should return channel by type and id', () => {
      channelManager.createChannel('app-channel');

      const channel = channelManager.getChannelByType('app', 'app-channel');

      expect(channel).toBeDefined();
      expect(channel?.id).toBe('app-channel');
    });

    it('should return private channels by type and id', () => {
      channelManager.createPrivateChannel('private-channel');

      const channel = channelManager.getChannelByType('private', 'private-channel');

      expect(channel?.id).toBe('private-channel');
      expect(channel?.type).toBe('private');
    });

    it('should return null for wrong type', () => {
      channelManager.createChannel('app-channel');

      const channel = channelManager.getChannelByType('user', 'app-channel');

      expect(channel).toBeNull();
    });

    it('should return null for non-existent channel', () => {
      const channel = channelManager.getChannelByType('app', 'nonexistent');

      expect(channel).toBeNull();
    });

    it('should return null for unknown channel types', () => {
      const channel = channelManager.getChannelByType('workspace' as never, 'red');

      expect(channel).toBeNull();
    });
  });

  describe('addUserChannel()', () => {
    it('should add a custom user channel', () => {
      channelManager.addUserChannel('purple', {
        name: 'Purple',
        color: '#800080',
      });

      const channel = channelManager.getChannelByType('user', 'purple');

      expect(channel?.id).toBe('purple');
      expect(channel?.type).toBe('user');
      expect(channel?.displayMetadata).toEqual({
        name: 'Purple',
        color: '#800080',
      });
    });

    it('should keep the existing user channel when adding a duplicate id', () => {
      const original = channelManager.getChannelByType('user', 'red');

      channelManager.addUserChannel('red', {
        name: 'Replacement Red',
        color: '#ff1111',
      });

      expect(channelManager.getChannelByType('user', 'red')).toBe(original);
      expect(channelManager.getChannelByType('user', 'red')?.displayMetadata).toEqual(
        original?.displayMetadata,
      );
    });
  });

  describe('removePrivateChannel()', () => {
    it('should remove private channel', () => {
      channelManager.createPrivateChannel('my-private');

      expect(channelManager.hasChannel('my-private')).toBe(true);

      channelManager.removePrivateChannel('my-private');

      expect(channelManager.hasChannel('my-private')).toBe(false);
    });

    it('should not affect user channels', () => {
      channelManager.removePrivateChannel('red');

      expect(channelManager.hasChannel('red')).toBe(true);
    });
  });

  describe('clear()', () => {
    it('should clear app channels', () => {
      channelManager.createChannel('app-1');
      channelManager.createChannel('app-2');

      channelManager.clear();

      expect(channelManager.getChannelByType('app', 'app-1')).toBeNull();
      expect(channelManager.getChannelByType('app', 'app-2')).toBeNull();
    });

    it('should keep user channels', () => {
      channelManager.clear();

      expect(channelManager.hasChannel('red')).toBe(true);
      expect(channelManager.hasChannel('green')).toBe(true);
      expect(channelManager.hasChannel('blue')).toBe(true);
    });

    it('should clear private channels', () => {
      const channel = channelManager.createPrivateChannel('test-private');

      channelManager.clear();

      expect(channelManager.hasChannel(channel.id)).toBe(false);
    });

    it('should clear tile mappings', () => {
      const channel = channelManager.createChannel('test-channel');
      channelManager.joinChannel('tile-1', channel);

      channelManager.clear();

      expect(channelManager.getTileChannel('tile-1')).toBeNull();
    });
  });
});
