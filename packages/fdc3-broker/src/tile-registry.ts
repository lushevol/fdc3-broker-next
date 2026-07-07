/**
 * Tile Registry
 *
 * Runtime registry for tracking tile instances and their state.
 * Provides functionality to register tiles, track their state, manage listeners,
 * and query for tiles by various criteria.
 *
 * @see data-model.md#L518-L583
 */

import { Logger } from './logger';
import type { Channel, ContextListener, TileInstance, TileRegistry } from './types';

/**
 * Tile Instance Registry Implementation
 *
 * Manages the lifecycle and state of tile instances (MFE components).
 * Tracks which tiles are running, their intent/context listeners,
 * and which channels they are joined to.
 */
export class TileRegistryImpl implements TileRegistry {
  private tiles = new Map<string, TileInstance>();
  private logger: Logger;

  constructor() {
    this.logger = new Logger(false);
  }

  /**
   * Register a tile
   * @param tile Tile instance
   */
  registerTile(tile: TileInstance): void {
    this.tiles.set(tile.instanceId, tile);
    this.logger.debug('Tile registered', { instanceId: tile.instanceId, appId: tile.appId, state: tile.state }, 'lifecycle');
  }

  /**
   * Unregister a tile
   * @param instanceId Tile identifier
   */
  unregisterTile(instanceId: string): void {
    this.tiles.delete(instanceId);
    this.logger.debug('Tile unregistered', { instanceId }, 'lifecycle');
  }

  /**
   * Get tile by ID
   * @param instanceId Tile identifier
   * @returns Tile instance or null if not found
   */
  getTile(instanceId: string): TileInstance | null {
    return this.tiles.get(instanceId) || null;
  }

  /**
   * Get all tiles
   * @returns Array of all registered tiles
   */
  getAllTiles(): TileInstance[] {
    return Array.from(this.tiles.values());
  }

  /**
   * Get tiles by app ID
   * @param appId Application ID
   * @returns Array of tiles with the given app ID
   */
  getTilesByAppId(appId: string): TileInstance[] {
    return Array.from(this.tiles.values()).filter((tile) => tile.appId === appId);
  }

  /**
   * Update tile state
   * @param instanceId Tile identifier
   * @param state New state
   */
  updateTileState(instanceId: string, state: 'mounting' | 'mounted' | 'unmounted'): void {
    const tile = this.tiles.get(instanceId);
    if (tile) {
      tile.state = state;
    }
  }

  /**
   * Add intent listener to tile
   * @param instanceId Tile identifier
   * @param intent Intent type
   */
  addIntentListener(instanceId: string, intent: string): void {
    const tile = this.tiles.get(instanceId);
    if (tile) {
      tile.intentListeners.add(intent);
    }
  }

  /**
   * Remove intent listener from tile
   * @param instanceId Tile identifier
   * @param intent Intent type
   */
  removeIntentListener(instanceId: string, intent: string): void {
    const tile = this.tiles.get(instanceId);
    if (tile) {
      tile.intentListeners.delete(intent);
    }
  }

  /**
   * Add context listener to tile
   * @param instanceId Tile identifier
   * @param listener Context listener
   */
  addContextListener(instanceId: string, listener: ContextListener): void {
    const tile = this.tiles.get(instanceId);
    if (tile) {
      tile.contextListeners.add(listener);
    }
  }

  /**
   * Remove context listener from tile
   * @param instanceId Tile identifier
   * @param listenerId Context listener ID
   */
  removeContextListener(instanceId: string, listenerId: string): void {
    const tile = this.tiles.get(instanceId);
    if (tile) {
      for (const listener of tile.contextListeners) {
        if (listener.id === listenerId) {
          tile.contextListeners.delete(listener);
          break;
        }
      }
    }
  }

  /**
   * Set current channel for tile
   * @param instanceId Tile identifier
   * @param channel Channel
   */
  setTileChannel(instanceId: string, channel: Channel): void {
    const tile = this.tiles.get(instanceId);
    if (tile) {
      tile.currentChannel = channel;
    }
  }

  /**
   * Get mounted tiles
   * @returns Array of mounted tiles
   */
  getMountedTiles(): TileInstance[] {
    return Array.from(this.tiles.values()).filter((tile) => tile.state === 'mounted');
  }

  /**
   * Get tiles listening for specific intent
   * @param intent Intent type
   * @returns Array of tiles that have registered intent listener
   */
  getTilesWithIntentListener(intent: string): TileInstance[] {
    return Array.from(this.tiles.values()).filter((tile) => tile.intentListeners.has(intent));
  }

  /**
   * Check if tile exists
   * @param instanceId Tile identifier
   * @returns true if tile is registered
   */
  hasTile(instanceId: string): boolean {
    return this.tiles.has(instanceId);
  }

  /**
   * Get tile count
   * @returns Number of registered tiles
   */
  getTileCount(): number {
    return this.tiles.size;
  }

  /**
   * Clear all tiles
   */
  clear(): void {
    this.tiles.clear();
  }
}
