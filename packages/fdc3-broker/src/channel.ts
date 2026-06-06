/**
 * Channel Implementation
 *
 * Implements FDC3 Channel and PrivateChannel interfaces for context sharing.
 * Supports broadcasting context to channel members and managing context listeners.
 *
 * @see plan.md#L637-L676
 */

import type {
  Channel,
  Context,
  ContextListener,
  EventHandler,
  Listener,
  PrivateChannel,
  PrivateChannelEventTypes,
} from './types';

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
  async addContextListener(
    contextType: string,
    handler: (context: Context) => void,
  ): Promise<Listener>;

  async addContextListener(
    contextTypeOrHandler: string | ((context: Context) => void),
    handler?: (context: Context) => void,
  ): Promise<Listener> {
    const listenerId = `channel_listener_${Date.now()}_${Math.random()}`;

    // Handle overload: if first arg is a function, it's the handler for all contexts
    const actualContextType: string | null =
      typeof contextTypeOrHandler === 'function' ? null : contextTypeOrHandler;
    const actualHandler =
      typeof contextTypeOrHandler === 'function' ? contextTypeOrHandler : handler!;

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
  private contextListenerRecords: Map<
    string,
    {
      contextType: string | null;
      listener: Listener;
      active: boolean;
    }
  > = new Map();

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
    if (this.disconnected) {
      return;
    }

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
  async addContextListener(
    contextType: string,
    handler: (context: Context) => void,
  ): Promise<Listener>;

  async addContextListener(
    contextTypeOrHandler: string | ((context: Context) => void),
    handler?: (context: Context) => void,
  ): Promise<Listener> {
    const contextType = typeof contextTypeOrHandler === 'function' ? null : contextTypeOrHandler;

    // If first arg is a function, it's the handler for all contexts
    const innerListener =
      typeof contextTypeOrHandler === 'function'
        ? await this.channel.addContextListener(contextTypeOrHandler)
        : await this.channel.addContextListener(contextTypeOrHandler, handler!);
    const listenerId = `private_context_listener_${Date.now()}_${Math.random()}`;

    const record = {
      contextType,
      listener: innerListener,
      active: true,
    };

    this.contextListenerRecords.set(listenerId, record);
    this.emitEvent('addContextListener', { contextType });

    return {
      id: listenerId,
      unsubscribe: async () => {
        await this.unsubscribeContextListener(listenerId);
      },
    } as Listener;
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

  // PrivateChannel-specific event handling

  private eventHandlers: Map<string, Set<EventHandler>> = new Map();
  private disconnected = false;

  private emitEvent(type: PrivateChannelEventTypes, details: unknown): void {
    const handlers = this.eventHandlers.get(type);
    if (!handlers) {
      return;
    }

    for (const handler of Array.from(handlers)) {
      try {
        handler({ type, details });
      } catch (error) {
        console.error(`[PrivateChannel] Error in ${type} handler:`, error);
      }
    }
  }

  private replayAddContextListenerEvents(handler: EventHandler): void {
    for (const record of this.contextListenerRecords.values()) {
      if (record.active) {
        handler({
          type: 'addContextListener',
          details: { contextType: record.contextType },
        });
      }
    }
  }

  private async unsubscribeContextListener(listenerId: string): Promise<void> {
    const record = this.contextListenerRecords.get(listenerId);
    if (!record || !record.active) {
      return;
    }

    record.active = false;
    this.contextListenerRecords.delete(listenerId);
    await record.listener.unsubscribe();
    this.emitEvent('unsubscribe', { contextType: record.contextType });
  }

  /**
   * Register a handler for events from the PrivateChannel.
   *
   * @param type - Event type to listen for, or null for all events
   * @param handler - Function to handle events
   * @returns Promise resolving to Listener
   */
  async addEventListener(
    type: PrivateChannelEventTypes | null,
    handler: EventHandler,
  ): Promise<Listener> {
    const listenerId = `event_listener_${Date.now()}_${Math.random()}`;

    const typesToListen: PrivateChannelEventTypes[] = type
      ? [type]
      : ['addContextListener', 'unsubscribe', 'disconnect'];

    for (const eventType of typesToListen) {
      if (!this.eventHandlers.has(eventType)) {
        this.eventHandlers.set(eventType, new Set());
      }
      this.eventHandlers.get(eventType)!.add(handler);
    }

    if (type === null || type === 'addContextListener') {
      this.replayAddContextListenerEvents(handler);
    }

    return {
      id: listenerId,
      unsubscribe: async () => {
        for (const eventType of typesToListen) {
          this.eventHandlers.get(eventType)?.delete(handler);
        }
      },
    } as Listener;
  }

  /**
   * Disconnect from the private channel.
   *
   * After calling this, desktop agents should prevent apps from broadcasting
   * on this channel and automatically unsubscribe all listeners.
   */
  async disconnect(): Promise<void> {
    if (this.disconnected) {
      return;
    }
    this.disconnected = true;

    for (const listenerId of Array.from(this.contextListenerRecords.keys())) {
      await this.unsubscribeContextListener(listenerId);
    }

    this.emitEvent('disconnect', null);
  }

  /**
   * @deprecated Use `addEventListener("addContextListener", handler)` instead.
   *
   * Adds a listener that will be called each time the remote app invokes
   * addContextListener on this channel.
   *
   * @param handler - Function to call when addContextListener is invoked
   * @returns Listener with unsubscribe method
   */
  onAddContextListener(handler: (contextType?: string) => void): Listener {
    const wrappedHandler: EventHandler = (event) => {
      if (event.type === 'addContextListener') {
        handler(event.details?.contextType ?? undefined);
      }
    };

    const listenerId = `onAddContextListener_${Date.now()}`;

    if (!this.eventHandlers.has('addContextListener')) {
      this.eventHandlers.set('addContextListener', new Set());
    }
    this.eventHandlers.get('addContextListener')!.add(wrappedHandler);
    this.replayAddContextListenerEvents(wrappedHandler);

    return {
      id: listenerId,
      unsubscribe: async () => {
        this.eventHandlers.get('addContextListener')?.delete(wrappedHandler);
      },
    } as Listener;
  }

  /**
   * @deprecated Use `addEventListener("unsubscribe", handler)` instead.
   *
   * Adds a listener that will be called whenever the remote app invokes
   * Listener.unsubscribe() on a context listener.
   *
   * @param handler - Function to call when unsubscribe is invoked
   * @returns Listener with unsubscribe method
   */
  onUnsubscribe(handler: (contextType?: string) => void): Listener {
    const wrappedHandler: EventHandler = (event) => {
      if (event.type === 'unsubscribe') {
        handler(event.details?.contextType ?? undefined);
      }
    };

    const listenerId = `onUnsubscribe_${Date.now()}`;

    if (!this.eventHandlers.has('unsubscribe')) {
      this.eventHandlers.set('unsubscribe', new Set());
    }
    this.eventHandlers.get('unsubscribe')!.add(wrappedHandler);

    return {
      id: listenerId,
      unsubscribe: async () => {
        this.eventHandlers.get('unsubscribe')?.delete(wrappedHandler);
      },
    } as Listener;
  }

  /**
   * @deprecated Use `addEventListener("disconnect", handler)` instead.
   *
   * Adds a listener that will be called when the remote app terminates or disconnects.
   *
   * @param handler - Function to call on disconnect
   * @returns Listener with unsubscribe method
   */
  onDisconnect(handler: () => void): Listener {
    const wrappedHandler: EventHandler = (event) => {
      if (event.type === 'disconnect') {
        handler();
      }
    };

    const listenerId = `onDisconnect_${Date.now()}`;

    if (!this.eventHandlers.has('disconnect')) {
      this.eventHandlers.set('disconnect', new Set());
    }
    this.eventHandlers.get('disconnect')!.add(wrappedHandler);

    return {
      id: listenerId,
      unsubscribe: async () => {
        this.eventHandlers.get('disconnect')?.delete(wrappedHandler);
      },
    } as Listener;
  }

  /**
   * Check if the channel is disconnected
   * @returns true if disconnected
   */
  isDisconnected(): boolean {
    return this.disconnected;
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
