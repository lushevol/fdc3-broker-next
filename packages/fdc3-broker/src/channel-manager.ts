/**
 * Channel Manager
 *
 * Manages channel lifecycle, membership, and operations.
 * Creates and manages app channels, user channels, and private channels.
 *
 * @see plan.md#L637-L676
 */

import { ChannelImpl, PrivateChannelImpl, USER_CHANNEL_IDS } from './channel';
import { Logger } from './logger';
import type { Channel, Context, DisplayMetadata, PrivateChannel } from './types';

/**
 * Channel Manager Implementation
 *
 * Central manager for all channel types in the FDC3 broker.
 * Handles channel creation, tile membership tracking, and channel operations.
 */
export class ChannelManager {
  private appChannels = new Map<string, ChannelImpl>();
  private privateChannels = new Map<string, PrivateChannelImpl>();
  private userChannels = new Map<string, ChannelImpl>();
  private tileChannels = new Map<string, Channel>(); // Track which channel each tile is on
  private logger: Logger;

  /**
   * Creates a new ChannelManager
   *
   * @param userChannelIds - Optional custom user channel IDs
   * @param enableDebug - Whether to enable debug logging
   */
  constructor(userChannelIds?: string[], enableDebug = false) {
    // Initialize user channels
    const channels = userChannelIds || (USER_CHANNEL_IDS as unknown as string[]);
    this.initializeUserChannels(channels);
    this.logger = new Logger(enableDebug);
  }

  /**
   * Initializes user channels with standard IDs and colors
   *
   * @param channelIds - Channel IDs to initialize
   */
  private initializeUserChannels(channelIds: string[]): void {
    const colors: Record<string, string> = {
      red: '#FF0000',
      green: '#00FF00',
      blue: '#0000FF',
      orange: '#FFA500',
      yellow: '#FFFF00',
      cyan: '#00FFFF',
      magenta: '#FF00FF',
      purple: '#800080',
    };

    for (const channelId of channelIds) {
      const displayMetadata: DisplayMetadata = {
        name: channelId.charAt(0).toUpperCase() + channelId.slice(1) + ' Channel',
        color: colors[channelId] || '#808080',
      };

      const channel = new ChannelImpl(channelId, 'user', displayMetadata);
      this.userChannels.set(channelId, channel);
    }
  }

  /**
   * Creates or retrieves an app channel
   *
   * @param channelId - Channel ID
   * @returns Channel object
   */
  createChannel(channelId: string): Channel {
    if (this.appChannels.has(channelId)) {
      return this.appChannels.get(channelId)!;
    }

    const channel = new ChannelImpl(channelId, 'app');
    this.appChannels.set(channelId, channel);
    return channel;
  }

  /**
   * Gets a channel by ID
   *
   * @param channelId - Channel ID to retrieve
   * @returns Channel object or null if not found
   */
  getChannel(channelId: string): Channel | null {
    // Check app channels
    if (this.appChannels.has(channelId)) {
      return this.appChannels.get(channelId)!;
    }

    // Check user channels
    if (this.userChannels.has(channelId)) {
      return this.userChannels.get(channelId)!;
    }

    return null;
  }

  /**
   * Creates a private channel
   *
   * @param channelId - Optional channel ID (auto-generated if not provided)
   * @returns PrivateChannel object
   */
  createPrivateChannel(channelId?: string): PrivateChannel {
    const id = channelId || `private_${Date.now()}_${Math.random()}`;
    const privateChannel = new PrivateChannelImpl(id);
    this.privateChannels.set(id, privateChannel);
    return privateChannel;
  }

  /**
   * Gets all user channels
   *
   * @returns Array of user channel objects
   */
  getUserChannels(): Channel[] {
    return Array.from(this.userChannels.values());
  }

  /**
   * Joins a tile to a channel
   *
   * @param instanceId - Tile identifier
   * @param channel - Channel to join
   */
  joinChannel(instanceId: string, channel: Channel): void {
    const currentChannel = this.tileChannels.get(instanceId);
    const previousChannelId = currentChannel?.id;

    // Remove from previous channel if on one
    if (currentChannel) {
      if ('removeTile' in currentChannel) {
        (currentChannel as unknown as ChannelImpl).removeTile(instanceId);
      }
    }

    // Add to new channel
    if ('addTile' in channel) {
      (channel as unknown as ChannelImpl).addTile(instanceId);
    }

    // Track tile's channel
    this.tileChannels.set(instanceId, channel);

    this.logger.debug('Tile joined channel', {
      instanceId,
      channelId: channel.id,
      previousChannelId,
    });
  }

  /**
   * Removes a tile from its current channel
   *
   * @param instanceId - Tile identifier
   */
  leaveChannel(instanceId: string): void {
    const channel = this.tileChannels.get(instanceId);
    const channelId = channel?.id;

    if (channel && 'removeTile' in channel) {
      (channel as unknown as ChannelImpl).removeTile(instanceId);
    }

    this.tileChannels.delete(instanceId);

    this.logger.debug('Tile left channel', { instanceId, channelId });
  }

  /**
   * Gets a tile's current channel
   *
   * @param instanceId - Tile identifier
   * @returns Channel or null if not on a channel
   */
  getTileChannel(instanceId: string): Channel | null {
    return this.tileChannels.get(instanceId) || null;
  }

  /**
   * Broadcast context to channel
   * @param channelId Channel ID
   * @param context Context data
   */
  async broadcastToChannel(channelId: string, context: Context): Promise<void> {
    this.logger.debug('Broadcasting to channel', {
      channelId,
      contextType: context?.type,
    });
    const channel = this.getChannel(channelId);
    if (channel) {
      await channel.broadcast(context);
      this.logger.debug('Broadcast complete', {
        channelId,
        contextType: context?.type,
      });
    }
  }

  /**
   * Get all channels
   * @returns Array of all channels
   */
  getAllChannels(): Channel[] {
    return [
      ...Array.from(this.appChannels.values()),
      ...Array.from(this.userChannels.values()),
      ...Array.from(this.privateChannels.values()),
    ];
  }

  /**
   * Get channel count
   * @returns Total number of channels
   */
  getChannelCount(): number {
    return this.appChannels.size + this.userChannels.size + this.privateChannels.size;
  }

  /**
   * Clear all channels (for testing)
   */
  clear(): void {
    this.appChannels.clear();
    this.privateChannels.clear();
    // Keep user channels
    this.tileChannels.clear();
  }

  /**
   * Get tiles on channel
   * @param channelId Channel ID
   * @returns Array of tile IDs
   */
  getTilesOnChannel(channelId: string): string[] {
    const channel = this.getChannel(channelId) as unknown as ChannelImpl;
    if (channel && channel.getTiles) {
      return channel.getTiles();
    }
    return [];
  }

  /**
   * Check if tile is on channel
   * @param instanceId Tile identifier
   * @param channelId Channel ID
   * @returns true if tile is on channel
   */
  isTileOnChannel(instanceId: string, channelId: string): boolean {
    const channel = this.getChannel(channelId) as unknown as ChannelImpl;
    if (channel && channel.hasTile) {
      return channel.hasTile(instanceId);
    }
    return false;
  }

  /**
   * Get channel statistics
   * @param channelId Channel ID
   * @returns Channel stats or null
   */
  getChannelStats(channelId: string): {
    tileCount: number;
    listenerCount: number;
    type: string;
  } | null {
    const channel = this.getChannel(channelId) as unknown as ChannelImpl;
    if (!channel) {
      return null;
    }

    return {
      tileCount: channel.getTiles ? channel.getTiles().length : 0,
      listenerCount: channel.getListenerCount ? channel.getListenerCount() : 0,
      type: channel.type,
    };
  }

  /**
   * Remove private channel
   * @param channelId Channel ID
   */
  removePrivateChannel(channelId: string): void {
    this.privateChannels.delete(channelId);
  }

  /**
   * Add a user channel with custom display metadata
   *
   * @param channelId - Channel ID
   * @param displayMetadata - Display metadata for the channel
   */
  addUserChannel(channelId: string, displayMetadata: DisplayMetadata): void {
    if (this.userChannels.has(channelId)) {
      this.logger.debug('User channel already exists', { channelId });
      return;
    }

    const channel = new ChannelImpl(channelId, 'user', displayMetadata);
    this.userChannels.set(channelId, channel);
    this.logger.debug('User channel added', { channelId });
  }

  /**
   * Check if channel exists
   * @param channelId Channel ID
   * @returns true if channel exists
   */
  hasChannel(channelId: string): boolean {
    return (
      this.appChannels.has(channelId) ||
      this.userChannels.has(channelId) ||
      this.privateChannels.has(channelId)
    );
  }

  /**
   * Get channels by type
   * @param type Channel type
   * @returns Array of channels
   */
  getChannelsByType(type: 'app' | 'user' | 'private'): Channel[] {
    switch (type) {
      case 'app':
        return Array.from(this.appChannels.values());
      case 'user':
        return Array.from(this.userChannels.values());
      case 'private':
        return Array.from(this.privateChannels.values());
      default:
        return [];
    }
  }

  /**
   * Get channel by type and ID
   * @param type Channel type
   * @param channelId Channel ID
   * @returns Channel or null
   */
  getChannelByType(type: 'app' | 'user' | 'private', channelId: string): Channel | null {
    switch (type) {
      case 'app':
        return this.appChannels.get(channelId) || null;
      case 'user':
        return this.userChannels.get(channelId) || null;
      case 'private':
        return this.privateChannels.get(channelId) || null;
      default:
        return null;
    }
  }
}
