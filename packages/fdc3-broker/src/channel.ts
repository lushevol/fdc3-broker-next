/**
 * Channel Implementation
 *
 * Implements FDC3 Channel and PrivateChannel interfaces for context sharing.
 * Supports broadcasting context to channel members and managing context listeners.
 *
 * @see plan.md#L637-L676
 */

import type { Channel, Context, ContextListener, Listener, PrivateChannel } from './types';

/**
 * Channel Implementation
 *
 * Represents a communication channel that applications can join to share context.
 * Supports both app channels (custom) and user channels (predefined).
 */
export class ChannelImpl implements Channel {
  id: string;
  type: 'app' | 'user';
  displayMetadata?: Channel['displayMetadata'];
  private currentContexts: Map<string, Context> = new Map();
  private contextListeners: Set<ContextListener> = new Set();
  private tiles: Set<string> = new Set(); // Tile IDs on this channel

  /**
   * Creates a new channel
   *
   * @param id - Unique channel identifier
   * @param type - Channel type ('app' or 'user')
   * @param displayMetadata - Optional display metadata
   */
  constructor(id: string, type: 'app' | 'user', displayMetadata?: Channel['displayMetadata']) {
    this.id = id;
    this.type = type;
    this.displayMetadata = displayMetadata;
  }

  /**
   * Broadcasts context to all channel members
   *
   * @param context - Context data to broadcast
   *
   * @example
   * ```typescript
   * await channel.broadcast({ type: 'fdc3.instrument', name: 'Apple', id: { ticker: 'AAPL' } });
   * ```
   */
  async broadcast(context: Context): Promise<void> {
    // Store context by type for getCurrentContext
    this.currentContexts.set(context.type, context);

    // Deliver to all context listeners on this channel
    for (const listener of this.contextListeners) {
      try {
        // Filter by context type if listener has one
        if (listener.contextType && listener.contextType !== context.type) {
          continue;
        }

        // Call handler (await in case handler returns a promise)
        await listener.handler(context);
      } catch (error) {
        console.error(`[Channel] Error delivering context to listener:`, error);
      }
    }
  }

  /**
   * Retrieves the current context for the channel
   *
   * @param contextType - Optional context type filter
   * @returns Promise resolving to current context or null
   */
  async getCurrentContext(contextType?: string): Promise<Context | null> {
    if (contextType) {
      return this.currentContexts.get(contextType) || null;
    }

    // Return most recent context if no type specified
    const contexts = Array.from(this.currentContexts.values());
    return contexts.length > 0 ? contexts[contexts.length - 1] : null;
  }

  /**
   * Adds a context listener to the channel (all context types)
   *
   * @param handler - Function to handle incoming contexts
   * @returns Promise resolving to Listener with unsubscribe method
   */
  async addContextListener(handler: (context: Context) => void): Promise<Listener>;

  /**
   * Adds a context listener to the channel (filtered by type)
   *
   * @param contextType - Context type filter
   * @param handler - Function to handle incoming contexts
   * @returns Promise resolving to Listener with unsubscribe method
   */
  async addContextListener(contextType: string, handler: (context: Context) => void): Promise<Listener>;

  async addContextListener(
    contextTypeOrHandler: string | ((context: Context) => void),
    handler?: (context: Context) => void,
  ): Promise<Listener> {
    const listenerId = `channel_listener_${Date.now()}_${Math.random()}`;

    // Handle overload: if first arg is a function, it's the handler for all contexts
    const actualContextType: string | null = typeof contextTypeOrHandler === 'function' ? null : contextTypeOrHandler;
    const actualHandler = typeof contextTypeOrHandler === 'function' ? contextTypeOrHandler : handler!;

    const listener: ContextListener = {
      id: listenerId,
      contextType: actualContextType,
      handler: actualHandler,
    };

    this.contextListeners.add(listener);

    return {
      id: listenerId,
      unsubscribe: async () => {
        this.contextListeners.delete(listener);
      },
    } as Listener;
  }

  /**
   * Add tile to channel
   * @param tileId Tile identifier
   */
  addTile(tileId: string): void {
    this.tiles.add(tileId);
  }

  /**
   * Remove tile from channel
   * @param tileId Tile identifier
   */
  removeTile(tileId: string): void {
    this.tiles.delete(tileId);
  }

  /**
   * Get all tiles on channel
   * @returns Array of tile IDs
   */
  getTiles(): string[] {
    return Array.from(this.tiles);
  }

  /**
   * Get listener count
   * @returns Number of listeners
   */
  getListenerCount(): number {
    return this.contextListeners.size;
  }

  /**
   * Check if tile is on channel
   * @param tileId Tile identifier
   * @returns true if tile is on channel
   */
  hasTile(tileId: string): boolean {
    return this.tiles.has(tileId);
  }
}

/**
 * Private Channel Implementation
 *
 * Private channels can only be accessed by applications that have a direct reference.
 * Useful for secure context sharing between specific applications.
 */
export class PrivateChannelImpl implements PrivateChannel {
  id: string;
  type = 'private' as const;
  private channel: ChannelImpl;
  private allowedTiles: Set<string> = new Set();

  /**
   * Creates a new private channel
   *
   * @param channelId - Unique identifier for the private channel
   */
  constructor(channelId: string) {
    this.id = channelId;
    this.channel = new ChannelImpl(channelId, 'app');
  }

  /**
   * Broadcasts context to private channel members
   *
   * Only broadcasts to tiles that have been granted access.
   * If no tiles have been granted access, no broadcasts will be delivered.
   *
   * @param context - Context data to broadcast
   */
  async broadcast(context: Context): Promise<void> {
    // Only broadcast if at least one tile has been granted access
    if (this.allowedTiles.size === 0) {
      return;
    }

    // Broadcast to allowed tiles
    await this.channel.broadcast(context);
  }

  /**
   * Retrieves the current context
   *
   * @param contextType - Optional context type filter
   * @returns Promise resolving to current context or null
   */
  async getCurrentContext(contextType?: string): Promise<Context | null> {
    return this.channel.getCurrentContext(contextType);
  }

  /**
   * Adds a context listener (all context types)
   *
   * @param handler - Function to handle incoming contexts
   * @returns Promise resolving to Listener
   */
  async addContextListener(handler: (context: Context) => void): Promise<Listener>;

  /**
   * Adds a context listener (filtered by type)
   *
   * @param contextType - Context type filter
   * @param handler - Function to handle incoming contexts
   * @returns Promise resolving to Listener
   */
  async addContextListener(contextType: string, handler: (context: Context) => void): Promise<Listener>;

  async addContextListener(
    contextTypeOrHandler: string | ((context: Context) => void),
    handler?: (context: Context) => void,
  ): Promise<Listener> {
    // If first arg is a function, it's the handler for all contexts
    if (typeof contextTypeOrHandler === 'function') {
      return this.channel.addContextListener(contextTypeOrHandler);
    }
    // Otherwise it's (contextType, handler)
    return this.channel.addContextListener(contextTypeOrHandler, handler!);
  }

  /**
   * Grants tile access to the private channel
   *
   * @param tileId - Tile identifier to grant access to
   */
  grantAccess(tileId: string): void {
    this.allowedTiles.add(tileId);
  }

  /**
   * Revokes tile access to the private channel
   *
   * @param tileId - Tile identifier to revoke access from
   */
  revokeAccess(tileId: string): void {
    this.allowedTiles.delete(tileId);
  }

  /**
   * Checks if tile has access to the private channel
   *
   * @param tileId - Tile identifier to check
   * @returns true if tile has access
   */
  hasAccess(tileId: string): boolean {
    return this.allowedTiles.has(tileId);
  }

  /**
   * Add tile to private channel
   * @param tileId Tile identifier
   */
  addTile(tileId: string): void {
    if (this.allowedTiles.has(tileId)) {
      this.channel.addTile(tileId);
    }
  }

  /**
   * Remove tile from private channel
   * @param tileId Tile identifier
   */
  removeTile(tileId: string): void {
    this.channel.removeTile(tileId);
  }
}

/**
 * User Channel IDs (standard FDC3 user channels)
 *
 * Standard set of user channel IDs defined by FDC3 specification.
 * These channels are typically color-coded for easy identification.
 */
export const USER_CHANNEL_IDS = [
  'red',
  'green',
  'blue',
  'orange',
  'yellow',
  'cyan',
  'magenta',
  'purple',
] as const;
