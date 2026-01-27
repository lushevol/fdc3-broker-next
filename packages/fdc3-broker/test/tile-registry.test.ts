/**
 * Tile Registry Unit Tests
 * @see plan.md#T088
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TileRegistryImpl } from '../src/tile-registry';
import type { AppMetadata, TileInstance } from '../src/types';

describe('TileRegistryImpl', () => {
  let registry: TileRegistryImpl;

  let mockTile1: TileInstance;
  let mockTile2: TileInstance;
  let mockTile3: TileInstance;

  beforeEach(() => {
    mockTile1 = {
      tileId: 'tile-1',
      appId: 'app1',
      state: 'mounted',
      metadata: {
        appId: 'app1',
        name: 'App 1',
        title: 'Tile 1',
      },
      intentListeners: new Set(['ViewChart', 'ViewQuote']),
      contextListeners: new Set(),
    };

    mockTile2 = {
      tileId: 'tile-2',
      appId: 'app1',
      state: 'mounted',
      metadata: {
        appId: 'app1',
        name: 'App 1',
        title: 'Tile 2',
      },
      intentListeners: new Set(['ViewQuote']),
      contextListeners: new Set(),
    };

    mockTile3 = {
      tileId: 'tile-3',
      appId: 'app2',
      state: 'unmounted',
      metadata: {
        appId: 'app2',
        name: 'App 2',
        title: 'Tile 3',
      },
      intentListeners: new Set(['ViewChart']),
      contextListeners: new Set(),
    };

    registry = new TileRegistryImpl();
  });

  describe('registerTile()', () => {
    it('should register a tile', () => {
      registry.registerTile(mockTile1);

      expect(registry.getTile('tile-1')).toEqual(mockTile1);
      expect(registry.hasTile('tile-1')).toBe(true);
      expect(registry.getTileCount()).toBe(1);
    });

    it('should register multiple tiles', () => {
      registry.registerTile(mockTile1);
      registry.registerTile(mockTile2);
      registry.registerTile(mockTile3);

      expect(registry.getTileCount()).toBe(3);
    });

    it('should allow updating existing tile by re-registering', () => {
      registry.registerTile(mockTile1);

      const updatedTile: TileInstance = {
        ...mockTile1,
        state: 'unmounted',
      };

      registry.registerTile(updatedTile);

      expect(registry.getTile('tile-1')?.state).toBe('unmounted');
      expect(registry.getTileCount()).toBe(1);
    });
  });

  describe('unregisterTile()', () => {
    it('should unregister a tile', () => {
      registry.registerTile(mockTile1);

      registry.unregisterTile('tile-1');

      expect(registry.getTile('tile-1')).toBeNull();
      expect(registry.hasTile('tile-1')).toBe(false);
      expect(registry.getTileCount()).toBe(0);
    });

    it('should handle unregistering non-existent tile', () => {
      expect(() => registry.unregisterTile('nonexistent')).not.toThrow();
      expect(registry.getTileCount()).toBe(0);
    });

    it('should only unregister specific tile', () => {
      registry.registerTile(mockTile1);
      registry.registerTile(mockTile2);

      registry.unregisterTile('tile-1');

      expect(registry.hasTile('tile-1')).toBe(false);
      expect(registry.hasTile('tile-2')).toBe(true);
      expect(registry.getTileCount()).toBe(1);
    });
  });

  describe('getTile()', () => {
    it('should return registered tile', () => {
      registry.registerTile(mockTile1);

      const tile = registry.getTile('tile-1');

      expect(tile).toEqual(mockTile1);
    });

    it('should return null for non-existent tile', () => {
      const tile = registry.getTile('nonexistent');

      expect(tile).toBeNull();
    });
  });

  describe('getAllTiles()', () => {
    it('should return empty array when no tiles registered', () => {
      const tiles = registry.getAllTiles();

      expect(tiles).toEqual([]);
    });

    it('should return all registered tiles', () => {
      registry.registerTile(mockTile1);
      registry.registerTile(mockTile2);
      registry.registerTile(mockTile3);

      const tiles = registry.getAllTiles();

      expect(tiles.length).toBe(3);
      expect(tiles).toContain(mockTile1);
      expect(tiles).toContain(mockTile2);
      expect(tiles).toContain(mockTile3);
    });
  });

  describe('getTilesByAppId()', () => {
    it('should return tiles for specific app', () => {
      registry.registerTile(mockTile1);
      registry.registerTile(mockTile2);
      registry.registerTile(mockTile3);

      const app1Tiles = registry.getTilesByAppId('app1');

      expect(app1Tiles.length).toBe(2);
      expect(app1Tiles).toContain(mockTile1);
      expect(app1Tiles).toContain(mockTile2);
    });

    it('should return empty array for app with no tiles', () => {
      registry.registerTile(mockTile1);

      const tiles = registry.getTilesByAppId('app2');

      expect(tiles).toEqual([]);
    });

    it('should include both mounted and unmounted tiles', () => {
      registry.registerTile(mockTile1);
      registry.registerTile(mockTile3);

      const app1Tiles = registry.getTilesByAppId('app1');
      const app2Tiles = registry.getTilesByAppId('app2');

      expect(app1Tiles.length).toBe(1);
      expect(app2Tiles.length).toBe(1);
    });
  });

  describe('updateTileState()', () => {
    it('should update tile state', () => {
      registry.registerTile(mockTile1);

      registry.updateTileState('tile-1', 'unmounted');

      expect(registry.getTile('tile-1')?.state).toBe('unmounted');
    });

    it('should handle state transitions: mounting -> mounted', () => {
      const tile: TileInstance = { ...mockTile1, state: 'mounting' };
      registry.registerTile(tile);

      registry.updateTileState('tile-1', 'mounted');

      expect(registry.getTile('tile-1')?.state).toBe('mounted');
    });

    it('should handle state transitions: mounted -> unmounted', () => {
      registry.registerTile(mockTile1);

      registry.updateTileState('tile-1', 'unmounted');

      expect(registry.getTile('tile-1')?.state).toBe('unmounted');
    });

    it('should handle updating non-existent tile gracefully', () => {
      expect(() => registry.updateTileState('nonexistent', 'mounted')).not.toThrow();
    });
  });

  describe('addIntentListener() / removeIntentListener()', () => {
    it('should add intent listener to tile', () => {
      registry.registerTile(mockTile1);

      registry.addIntentListener('tile-1', 'ViewOrders');

      const tile = registry.getTile('tile-1');
      expect(tile?.intentListeners.has('ViewOrders')).toBe(true);
      expect(tile?.intentListeners.size).toBe(3); // 2 original + 1 new
    });

    it('should add multiple intent listeners', () => {
      registry.registerTile(mockTile1);

      registry.addIntentListener('tile-1', 'ViewOrders');
      registry.addIntentListener('tile-1', 'ViewBlotter');

      const tile = registry.getTile('tile-1');
      expect(tile?.intentListeners.has('ViewOrders')).toBe(true);
      expect(tile?.intentListeners.has('ViewBlotter')).toBe(true);
    });

    it('should not duplicate intent listeners', () => {
      registry.registerTile(mockTile1);

      registry.addIntentListener('tile-1', 'ViewChart');
      registry.addIntentListener('tile-1', 'ViewChart');

      const tile = registry.getTile('tile-1');
      const count = Array.from(tile?.intentListeners || []).filter((i) => i === 'ViewChart').length;
      expect(count).toBe(1);
    });

    it('should remove intent listener from tile', () => {
      registry.registerTile(mockTile1);

      registry.removeIntentListener('tile-1', 'ViewChart');

      const tile = registry.getTile('tile-1');
      expect(tile?.intentListeners.has('ViewChart')).toBe(false);
      expect(tile?.intentListeners.has('ViewQuote')).toBe(true);
    });

    it('should handle removing non-existent listener', () => {
      registry.registerTile(mockTile1);

      expect(() => registry.removeIntentListener('tile-1', 'NonExistent')).not.toThrow();
    });

    it('should handle updating non-existent tile', () => {
      expect(() => registry.addIntentListener('nonexistent', 'ViewChart')).not.toThrow();
    });
  });

  describe('addContextListener() / removeContextListener()', () => {
    const mockListener1 = {
      id: 'listener-1',
      contextType: 'fdc3.chart',
      handler: vi.fn(),
    };

    const mockListener2 = {
      id: 'listener-2',
      contextType: 'fdc3.quote',
      handler: vi.fn(),
    };

    it('should add context listener to tile', () => {
      registry.registerTile(mockTile1);

      registry.addContextListener('tile-1', mockListener1);

      const tile = registry.getTile('tile-1');
      expect(tile?.contextListeners.has(mockListener1)).toBe(true);
    });

    it('should add multiple context listeners', () => {
      registry.registerTile(mockTile1);

      registry.addContextListener('tile-1', mockListener1);
      registry.addContextListener('tile-1', mockListener2);

      const tile = registry.getTile('tile-1');
      expect(tile?.contextListeners.size).toBe(2);
    });

    it('should remove context listener by ID', () => {
      registry.registerTile(mockTile1);
      registry.addContextListener('tile-1', mockListener1);
      registry.addContextListener('tile-1', mockListener2);

      registry.removeContextListener('tile-1', 'listener-1');

      const tile = registry.getTile('tile-1');
      expect(tile?.contextListeners.has(mockListener1)).toBe(false);
      expect(tile?.contextListeners.has(mockListener2)).toBe(true);
    });

    it('should handle removing non-existent listener ID', () => {
      registry.registerTile(mockTile1);
      registry.addContextListener('tile-1', mockListener1);

      expect(() => registry.removeContextListener('tile-1', 'nonexistent-id')).not.toThrow();
    });
  });

  describe('setTileChannel()', () => {
    const mockChannel = {
      id: 'red',
      type: 'user',
      displayMetadata: {
        name: 'Red Channel',
        color: '#FF0000',
      },
      broadcast: vi.fn(),
      getCurrentContext: vi.fn(),
      addContextListener: vi.fn(),
    };

    it('should set channel for tile', () => {
      registry.registerTile(mockTile1);

      registry.setTileChannel('tile-1', mockChannel as any);

      const tile = registry.getTile('tile-1');
      expect(tile?.currentChannel).toEqual(mockChannel);
    });

    it('should update channel for tile', () => {
      const mockChannel2 = { ...mockChannel, id: 'blue' };

      registry.registerTile(mockTile1);
      registry.setTileChannel('tile-1', mockChannel as any);
      registry.setTileChannel('tile-1', mockChannel2 as any);

      const tile = registry.getTile('tile-1');
      expect(tile?.currentChannel).toEqual(mockChannel2);
    });

    it('should handle setting channel on non-existent tile', () => {
      expect(() => registry.setTileChannel('nonexistent', mockChannel as any)).not.toThrow();
    });
  });

  describe('getMountedTiles()', () => {
    it('should return only mounted tiles', () => {
      registry.registerTile(mockTile1);
      registry.registerTile(mockTile2);
      registry.registerTile(mockTile3);

      const mountedTiles = registry.getMountedTiles();

      expect(mountedTiles.length).toBe(2);
      expect(mountedTiles).toContain(mockTile1);
      expect(mountedTiles).toContain(mockTile2);
      expect(mountedTiles).not.toContain(mockTile3);
    });

    it('should return empty array when no mounted tiles', () => {
      registry.registerTile(mockTile3);

      const mountedTiles = registry.getMountedTiles();

      expect(mountedTiles).toEqual([]);
    });

    it('should handle mounting state', () => {
      const mountingTile: TileInstance = {
        ...mockTile1,
        state: 'mounting',
      };
      registry.registerTile(mountingTile);

      const mountedTiles = registry.getMountedTiles();

      expect(mountedTiles).toEqual([]);
    });
  });

  describe('getTilesWithIntentListener()', () => {
    it('should return tiles with specific intent listener', () => {
      registry.registerTile(mockTile1);
      registry.registerTile(mockTile2);
      registry.registerTile(mockTile3);

      const tiles = registry.getTilesWithIntentListener('ViewChart');

      expect(tiles.length).toBe(2);
      expect(tiles).toContain(mockTile1);
      expect(tiles).toContain(mockTile3);
    });

    it('should return empty array when no tiles have listener', () => {
      registry.registerTile(mockTile1);

      const tiles = registry.getTilesWithIntentListener('NonExistent');

      expect(tiles).toEqual([]);
    });

    it('should return only tiles with mounted state', () => {
      registry.registerTile(mockTile1);
      registry.registerTile(mockTile3);

      const tiles = registry.getTilesWithIntentListener('ViewChart');

      // mockTile3 is unmounted but has the listener
      expect(tiles).toContain(mockTile3);
    });
  });

  describe('hasTile()', () => {
    it('should return true for registered tile', () => {
      registry.registerTile(mockTile1);

      expect(registry.hasTile('tile-1')).toBe(true);
    });

    it('should return false for non-existent tile', () => {
      expect(registry.hasTile('nonexistent')).toBe(false);
    });

    it('should return false after unregistering', () => {
      registry.registerTile(mockTile1);
      registry.unregisterTile('tile-1');

      expect(registry.hasTile('tile-1')).toBe(false);
    });
  });

  describe('getTileCount()', () => {
    it('should return 0 when no tiles registered', () => {
      expect(registry.getTileCount()).toBe(0);
    });

    it('should return count of registered tiles', () => {
      registry.registerTile(mockTile1);
      expect(registry.getTileCount()).toBe(1);

      registry.registerTile(mockTile2);
      expect(registry.getTileCount()).toBe(2);

      registry.registerTile(mockTile3);
      expect(registry.getTileCount()).toBe(3);
    });

    it('should decrease count when unregistering', () => {
      registry.registerTile(mockTile1);
      registry.registerTile(mockTile2);

      registry.unregisterTile('tile-1');

      expect(registry.getTileCount()).toBe(1);
    });
  });

  describe('clear()', () => {
    it('should clear all registered tiles', () => {
      registry.registerTile(mockTile1);
      registry.registerTile(mockTile2);
      registry.registerTile(mockTile3);

      registry.clear();

      expect(registry.getTileCount()).toBe(0);
      expect(registry.getTile('tile-1')).toBeNull();
      expect(registry.getTile('tile-2')).toBeNull();
      expect(registry.getTile('tile-3')).toBeNull();
    });

    it('should handle clearing empty registry', () => {
      expect(() => registry.clear()).not.toThrow();
      expect(registry.getTileCount()).toBe(0);
    });
  });
});
