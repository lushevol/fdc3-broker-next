/**
 * Channel & PrivateChannel Unit Tests
 * @see plan.md#T118, T119
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChannelImpl, PrivateChannelImpl } from '../src/channel';
import type { Context } from '../src/types';

describe('ChannelImpl', () => {
  let channel: ChannelImpl;
  const mockContext: Context = {
    type: 'fdc3.chart',
    id: { ticker: 'AAPL' },
  };

  beforeEach(() => {
    channel = new ChannelImpl('test-channel', 'app', {
      name: 'Test Channel',
      color: '#FF0000',
    });
  });

  describe('initialization', () => {
    it('should initialize with id and type', () => {
      expect(channel.id).toBe('test-channel');
      expect(channel.type).toBe('app');
    });

    it('should initialize with display metadata', () => {
      expect(channel.displayMetadata).toBeDefined();
      expect(channel.displayMetadata?.name).toBe('Test Channel');
      expect(channel.displayMetadata?.color).toBe('#FF0000');
    });

    it('should initialize without display metadata', () => {
      const channelWithoutMeta = new ChannelImpl('no-meta', 'user');
      expect(channelWithoutMeta.displayMetadata).toBeUndefined();
    });
  });

  describe('broadcast()', () => {
    it('should broadcast context to all listeners', async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      await channel.addContextListener(null, handler1);
      await channel.addContextListener(null, handler2);

      await channel.broadcast(mockContext);

      expect(handler1).toHaveBeenCalledWith(mockContext);
      expect(handler2).toHaveBeenCalledWith(mockContext);
    });

    it('should filter listeners by context type', async () => {
      const chartHandler = vi.fn();
      const quoteHandler = vi.fn();

      await channel.addContextListener('fdc3.chart', chartHandler);
      await channel.addContextListener('fdc3.quote', quoteHandler);

      const chartContext: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await channel.broadcast(chartContext);

      expect(chartHandler).toHaveBeenCalledWith(chartContext);
      expect(quoteHandler).not.toHaveBeenCalled();
    });

    it('should deliver to listeners with no context type filter', async () => {
      const universalHandler = vi.fn();
      const specificHandler = vi.fn();

      await channel.addContextListener(null, universalHandler);
      await channel.addContextListener('fdc3.chart', specificHandler);

      await channel.broadcast(mockContext);

      expect(universalHandler).toHaveBeenCalledWith(mockContext);
      expect(specificHandler).toHaveBeenCalledWith(mockContext);
    });

    it('should handle listener errors gracefully', async () => {
      const errorHandler = vi.fn().mockRejectedValue(new Error('Handler error'));
      const normalHandler = vi.fn();

      await channel.addContextListener(null, errorHandler);
      await channel.addContextListener(null, normalHandler);

      await channel.broadcast(mockContext);

      // Normal handler should still be called despite error in error handler
      expect(normalHandler).toHaveBeenCalled();
    });

    it('should store current context by type', async () => {
      await channel.broadcast(mockContext);

      const currentContext = await channel.getCurrentContext('fdc3.chart');
      expect(currentContext).toEqual(mockContext);
    });

    it('should support multiple context types', async () => {
      const chartContext: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const quoteContext: Context = {
        type: 'fdc3.quote',
        id: { ticker: 'MSFT' },
      };

      await channel.broadcast(chartContext);
      await channel.broadcast(quoteContext);

      const currentChart = await channel.getCurrentContext('fdc3.chart');
      const currentQuote = await channel.getCurrentContext('fdc3.quote');

      expect(currentChart).toEqual(chartContext);
      expect(currentQuote).toEqual(quoteContext);
    });
  });

  describe('getCurrentContext()', () => {
    it('should return null when no context broadcast', async () => {
      const context = await channel.getCurrentContext();
      expect(context).toBeNull();
    });

    it('should return most recent context when no type specified', async () => {
      const context1: Context = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };
      const context2: Context = { type: 'fdc3.quote', id: { ticker: 'MSFT' } };

      await channel.broadcast(context1);
      await channel.broadcast(context2);

      const current = await channel.getCurrentContext();
      expect(current).toEqual(context2);
    });

    it('should return context for specific type', async () => {
      const chartContext: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };
      const quoteContext: Context = {
        type: 'fdc3.quote',
        id: { ticker: 'MSFT' },
      };

      await channel.broadcast(chartContext);
      await channel.broadcast(quoteContext);

      const chart = await channel.getCurrentContext('fdc3.chart');
      const quote = await channel.getCurrentContext('fdc3.quote');

      expect(chart).toEqual(chartContext);
      expect(quote).toEqual(quoteContext);
    });

    it('should return null for non-existent context type', async () => {
      const context = await channel.getCurrentContext('fdc3.nonexistent');
      expect(context).toBeNull();
    });
  });

  describe('addContextListener()', () => {
    it('should add listener and return Listener object', async () => {
      const handler = vi.fn();

      const listener = await channel.addContextListener('fdc3.chart', handler);

      expect(listener).toHaveProperty('id');
      expect(listener.unsubscribe).toBeDefined();
      expect(typeof listener.unsubscribe).toBe('function');
    });

    it('should call listener on broadcast', async () => {
      const handler = vi.fn();

      await channel.addContextListener('fdc3.chart', handler);
      await channel.broadcast(mockContext);

      expect(handler).toHaveBeenCalledWith(mockContext);
    });

    it('should support removing listener via unsubscribe', async () => {
      const handler = vi.fn();

      const listener = await channel.addContextListener('fdc3.chart', handler);
      listener.unsubscribe();

      await channel.broadcast(mockContext);

      expect(handler).not.toHaveBeenCalled();
    });

    it('should generate unique listener IDs', async () => {
      const listener1 = await channel.addContextListener('fdc3.chart', vi.fn());
      const listener2 = await channel.addContextListener('fdc3.chart', vi.fn());

      expect(listener1.id).not.toBe(listener2.id);
    });

    it('should support null context type (all contexts)', async () => {
      const handler = vi.fn();

      await channel.addContextListener(null, handler);

      const chartContext: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };
      const quoteContext: Context = {
        type: 'fdc3.quote',
        id: { ticker: 'MSFT' },
      };

      await channel.broadcast(chartContext);
      await channel.broadcast(quoteContext);

      expect(handler).toHaveBeenCalledTimes(2);
    });
  });

  describe('tile membership', () => {
    it('should track tiles on channel', () => {
      channel.addTile('tile-1');
      channel.addTile('tile-2');

      expect(channel.getTiles()).toEqual(['tile-1', 'tile-2']);
    });

    it('should check if tile is on channel', () => {
      channel.addTile('tile-1');

      expect(channel.hasTile('tile-1')).toBe(true);
      expect(channel.hasTile('tile-2')).toBe(false);
    });

    it('should remove tile from channel', () => {
      channel.addTile('tile-1');
      channel.removeTile('tile-1');

      expect(channel.hasTile('tile-1')).toBe(false);
      expect(channel.getTiles()).toEqual([]);
    });

    it('should handle removing non-existent tile', () => {
      expect(() => channel.removeTile('nonexistent')).not.toThrow();
    });
  });

  describe('getListenerCount()', () => {
    it('should return 0 when no listeners', () => {
      expect(channel.getListenerCount()).toBe(0);
    });

    it('should return correct listener count', async () => {
      await channel.addContextListener('fdc3.chart', vi.fn());
      await channel.addContextListener('fdc3.quote', vi.fn());

      expect(channel.getListenerCount()).toBe(2);
    });

    it('should update count when listeners are removed', async () => {
      const listener = await channel.addContextListener('fdc3.chart', vi.fn());

      expect(channel.getListenerCount()).toBe(1);

      listener.unsubscribe();

      expect(channel.getListenerCount()).toBe(0);
    });
  });
});

describe('PrivateChannelImpl', () => {
  let privateChannel: PrivateChannelImpl;
  const mockContext: Context = {
    type: 'fdc3.chart',
    id: { ticker: 'AAPL' },
  };

  beforeEach(() => {
    privateChannel = new PrivateChannelImpl('private-channel-1');
  });

  describe('initialization', () => {
    it('should initialize with unique id', () => {
      expect(privateChannel.id).toBe('private-channel-1');
      expect(privateChannel.type).toBe('private');
    });

    it('should initialize with custom id', () => {
      const customChannel = new PrivateChannelImpl('my-private-channel');
      expect(customChannel.id).toBe('my-private-channel');
    });
  });

  describe('access control', () => {
    it('should grant access to tile', () => {
      privateChannel.grantAccess('tile-1');

      expect(privateChannel.hasAccess('tile-1')).toBe(true);
    });

    it('should revoke access from tile', () => {
      privateChannel.grantAccess('tile-1');
      privateChannel.revokeAccess('tile-1');

      expect(privateChannel.hasAccess('tile-1')).toBe(false);
    });

    it('should not allow tile without access to join', () => {
      privateChannel.addTile('tile-1');

      // Tile should not be added without access
      expect(privateChannel['channel'].hasTile('tile-1')).toBe(false);
    });

    it('should allow tile with access to join', () => {
      privateChannel.grantAccess('tile-1');
      privateChannel.addTile('tile-1');

      expect(privateChannel['channel'].hasTile('tile-1')).toBe(true);
    });

    it('should allow multiple tiles with access', () => {
      privateChannel.grantAccess('tile-1');
      privateChannel.grantAccess('tile-2');

      privateChannel.addTile('tile-1');
      privateChannel.addTile('tile-2');

      expect(privateChannel['channel'].getTiles().length).toBe(2);
    });
  });

  describe('broadcast()', () => {
    it('should broadcast to tiles with access', async () => {
      const handler = vi.fn();

      privateChannel.grantAccess('tile-1');
      privateChannel.addTile('tile-1');

      await privateChannel.addContextListener(null, handler);
      await privateChannel.broadcast(mockContext);

      expect(handler).toHaveBeenCalledWith(mockContext);
    });

    it('should not broadcast to tiles without access', async () => {
      const handler = vi.fn();

      // Add listener without granting access
      await privateChannel.addContextListener(null, handler);
      await privateChannel.broadcast(mockContext);

      // Handler should not be called because tile doesn't have access
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('addContextListener()', () => {
    it('should add listener to private channel', async () => {
      const handler = vi.fn();

      const listener = await privateChannel.addContextListener(null, handler);

      expect(listener).toBeDefined();
      expect(listener.unsubscribe).toBeDefined();
    });

    it('should filter by context type', async () => {
      const chartHandler = vi.fn();
      const quoteHandler = vi.fn();

      privateChannel.grantAccess('tile-1');

      await privateChannel.addContextListener('fdc3.chart', chartHandler);
      await privateChannel.addContextListener('fdc3.quote', quoteHandler);

      const chartContext: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };
      await privateChannel.broadcast(chartContext);

      expect(chartHandler).toHaveBeenCalled();
      expect(quoteHandler).not.toHaveBeenCalled();
    });
  });

  describe('getCurrentContext()', () => {
    it('should return null when no context', async () => {
      const context = await privateChannel.getCurrentContext();
      expect(context).toBeNull();
    });

    it('should return most recent context', async () => {
      privateChannel.grantAccess('tile-1');

      await privateChannel.addContextListener(null, vi.fn());
      await privateChannel.broadcast(mockContext);

      const context = await privateChannel.getCurrentContext();
      expect(context).toEqual(mockContext);
    });
  });

  describe('tile management', () => {
    it('should remove tile from channel', () => {
      privateChannel.grantAccess('tile-1');
      privateChannel.addTile('tile-1');
      privateChannel.removeTile('tile-1');

      expect(privateChannel['channel'].hasTile('tile-1')).toBe(false);
    });

    it('should maintain access after removal', () => {
      privateChannel.grantAccess('tile-1');
      privateChannel.addTile('tile-1');
      privateChannel.removeTile('tile-1');

      // Access should be retained
      expect(privateChannel.hasAccess('tile-1')).toBe(true);

      // Can re-add
      privateChannel.addTile('tile-1');
      expect(privateChannel['channel'].hasTile('tile-1')).toBe(true);
    });
  });
});
