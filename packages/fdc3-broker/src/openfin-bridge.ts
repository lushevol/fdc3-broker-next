/**
 * OpenFin Bridge
 *
 * Enables bidirectional intent routing with OpenFin applications.
 * Provides interoperability between the MFE platform and OpenFin containers.
 *
 * @see plan.md#L247-L622
 * @see research.md#L572-L653
 */

import { isOpenFinAvailable } from './environment';
import { Logger } from './logger';
import type { AppIdentifier, Channel, Context, DesktopAgent, IntentResolution } from './types';

/**
 * OpenFin Bridge Implementation
 *
 * Bridges FDC3 communication between the MFE platform and OpenFin applications.
 * Automatically detects OpenFin availability and enables bidirectional intent routing.
 */
export class OpenFinBridge {
  private logger: Logger;
  private enabled: boolean;
  private fdc3: DesktopAgent | null = null; // OpenFin's fin.desktop.fdc3

  /**
   * Creates an OpenFin bridge instance
   *
   * Automatically detects OpenFin availability and initializes the bridge.
   */
  constructor() {
    this.logger = new Logger(!!(globalThis as any).__FDC3_DEBUG__);
    this.enabled = isOpenFinAvailable();

    if (this.enabled) {
      try {
        this.fdc3 = (globalThis as any).fdc3;
        this.logger.info('OpenFin bridge initialized');
      } catch (error) {
        this.logger.error('Failed to initialize OpenFin bridge:', error as Error);
        this.enabled = false;
      }
    }
  }

  /**
   * Checks if OpenFin bridge is enabled
   *
   * @returns true if OpenFin is available
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Subscribes to intents from OpenFin applications
   *
   * @param intentHandler - Handler for incoming intents from OpenFin
   * @param supportedIntents - List of intent types to subscribe to
   */
  subscribeToIntents(
    intentHandler: (intent: string, context: Context, source?: AppIdentifier) => void,
    supportedIntents: string[],
  ): void {
    if (!this.enabled || !this.fdc3) {
      this.logger.warn('OpenFin not available, skipping intent subscription');
      return;
    }

    try {
      // Subscribe to each supported intent type
      supportedIntents.forEach((intent) => {
        if (this.fdc3?.addIntentListener) {
          this.fdc3.addIntentListener(intent, (context: Context) => {
            this.logger.debug('Received intent from OpenFin', {
              intent,
              context,
            });

            // Call handler with intent, context, and source
            intentHandler(intent, context);
          });
        }
      });

      this.logger.info('Subscribed to OpenFin intents', {
        intents: supportedIntents,
      });
    } catch (error) {
      this.logger.error('Failed to subscribe to OpenFin intents:', error as Error);
    }
  }

  /**
   * Raises an intent to an OpenFin application
   *
   * @param intent - Intent type
   * @param context - Context data
   * @param target - Optional target app
   * @returns Promise resolving to IntentResolution
   * @throws Error if OpenFin is not available
   */
  async raiseIntentExternal(
    intent: string,
    context: Context,
    target?: AppIdentifier,
  ): Promise<IntentResolution> {
    if (!this.enabled || !this.fdc3) {
      this.logger.warn('OpenFin not available, cannot raise external intent');
      throw new Error('OpenFin not available');
    }

    this.logger.debug('Raising intent to OpenFin', { intent, context, target });

    try {
      let resolution;
      if (target) {
        resolution = await this.fdc3.raiseIntent(intent, context, target);
      } else {
        resolution = await this.fdc3.raiseIntent(intent, context);
      }

      this.logger.info('Intent raised to OpenFin successfully', {
        intent,
        source: resolution.source,
      });

      return resolution;
    } catch (error) {
      this.logger.error('Failed to raise intent to OpenFin:', error as Error);
      throw error;
    }
  }

  /**
   * Joins a user channel in OpenFin
   *
   * @param channel - Channel object or channel ID
   */
  async joinUserChannel(channel: Channel | string): Promise<void> {
    if (!this.enabled || !this.fdc3) {
      this.logger.debug('OpenFin not available, skipping channel join');
      return;
    }

    const channelId = typeof channel === 'string' ? channel : channel.id;

    this.logger.debug('Joining OpenFin user channel', { channelId });

    try {
      await this.fdc3.joinUserChannel(channelId);
      this.logger.info('Joined OpenFin user channel', { channelId });
    } catch (error) {
      this.logger.error('Failed to join OpenFin channel:', error as Error);
      throw error;
    }
  }

  /**
   * Broadcasts context to an OpenFin channel
   *
   * @param context - Context data to broadcast
   * @param channelId - Optional channel ID (uses current channel if not specified)
   */
  async broadcast(context: Context, channelId?: string): Promise<void> {
    if (!this.enabled || !this.fdc3) {
      this.logger.debug('OpenFin not available, skipping broadcast');
      return;
    }

    this.logger.debug('Broadcasting to OpenFin', { context, channelId });

    try {
      if (channelId) {
        // Broadcast to specific channel
        const channel = await this.fdc3.getOrCreateChannel(channelId);
        await channel.broadcast(context);
      } else {
        // Broadcast to current channel
        await this.fdc3.broadcast(context);
      }

      this.logger.info('Broadcast to OpenFin successful', {
        context,
        channelId,
      });
    } catch (error) {
      this.logger.error('Failed to broadcast to OpenFin:', error as Error);
      throw error;
    }
  }

  /**
   * Gets the current channel from OpenFin
   *
   * @returns Promise resolving to current Channel or null
   */
  async getCurrentChannel(): Promise<Channel | null> {
    if (!this.enabled || !this.fdc3) {
      return null;
    }

    try {
      const channel = await this.fdc3.getCurrentChannel();
      return channel;
    } catch (error) {
      this.logger.error('Failed to get current OpenFin channel:', error as Error);
      return null;
    }
  }

  /**
   * Gets user channels from OpenFin
   *
   * @returns Promise resolving to array of user channels
   */
  async getUserChannels(): Promise<Channel[]> {
    if (!this.enabled || !this.fdc3) {
      return [];
    }

    try {
      const channels = await this.fdc3.getUserChannels();
      this.logger.debug('Retrieved OpenFin user channels', {
        count: channels.length,
      });
      return channels;
    } catch (error) {
      this.logger.error('Failed to get OpenFin user channels:', error as Error);
      return [];
    }
  }

  /**
   * Subscribes to context broadcasts from OpenFin
   *
   * @param contextHandler - Handler for incoming context
   * @param contextType - Optional context type filter
   */
  async subscribeToContext(
    contextHandler: (context: Context) => void,
    contextType?: string,
  ): Promise<void> {
    if (!this.enabled || !this.fdc3) {
      this.logger.debug('OpenFin not available, skipping context subscription');
      return;
    }

    try {
      // Get current channel
      const currentChannel = await this.fdc3.getCurrentChannel();

      if (!currentChannel) {
        this.logger.warn('No current OpenFin channel, cannot subscribe to context');
        return;
      }

      // Add context listener to current channel
      await currentChannel.addContextListener(contextType || null, (context: Context) => {
        this.logger.debug('Received context from OpenFin', {
          context,
          contextType,
        });
        contextHandler(context);
      });

      this.logger.info('Subscribed to OpenFin context', { contextType });
    } catch (error) {
      this.logger.error('Failed to subscribe to OpenFin context:', error as Error);
    }
  }

  /**
   * Adds an intent listener in OpenFin
   *
   * @param intent - Intent type
   * @param handler - Intent handler function
   * @returns Promise resolving to listener object with unsubscribe method
   */
  async addIntentListener(
    intent: string,
    handler: (context: Context) => any,
  ): Promise<{ unsubscribe: () => void }> {
    if (!this.enabled || !this.fdc3) {
      this.logger.warn('OpenFin not available, cannot add intent listener');
      // Return mock listener
      return {
        unsubscribe: () => {},
      };
    }

    try {
      const listener = await this.fdc3.addIntentListener(intent, handler);
      this.logger.info('Added OpenFin intent listener', { intent });
      return listener;
    } catch (error) {
      this.logger.error('Failed to add OpenFin intent listener:', error as Error);
      throw error;
    }
  }

  /**
   * Gets or creates a channel in OpenFin
   *
   * @param channelId - Channel ID
   * @returns Promise resolving to Channel object
   * @throws Error if OpenFin is not available
   */
  async getOrCreateChannel(channelId: string): Promise<Channel> {
    if (!this.enabled || !this.fdc3) {
      this.logger.warn('OpenFin not available, cannot get channel');
      throw new Error('OpenFin not available');
    }

    try {
      const channel = await this.fdc3.getOrCreateChannel(channelId);
      this.logger.debug('Retrieved OpenFin channel', { channelId });
      return channel;
    } catch (error) {
      this.logger.error('Failed to get OpenFin channel:', error as Error);
      throw error;
    }
  }

  /**
   * Finds apps by intent in OpenFin
   *
   * @param intent - Intent type to search for
   * @returns Promise resolving to array of app metadata
   */
  async findAppsByIntent(intent: string): Promise<any[]> {
    if (!this.enabled || !this.fdc3) {
      return [];
    }

    try {
      const appIntent = await this.fdc3.findIntent(intent);
      return appIntent.apps || [];
    } catch (error) {
      this.logger.error('Failed to find OpenFin apps by intent:', error as Error);
      return [];
    }
  }

  /**
   * Finds apps by context in OpenFin
   *
   * @param context - Context data to search for
   * @returns Promise resolving to array of app intents
   */
  async findAppsByContext(context: Context): Promise<any[]> {
    if (!this.enabled || !this.fdc3) {
      return [];
    }

    try {
      const intents = await this.fdc3.findIntentsByContext(context);
      return intents || [];
    } catch (error) {
      this.logger.error('Failed to find OpenFin apps by context:', error as Error);
      return [];
    }
  }
}
