/**
 * PostMessage Bridge
 *
 * Enables bidirectional FDC3 communication with external domains via postMessage API.
 * Provides interoperability between the MFE platform and cross-origin applications.
 *
 * @see design.md for architecture decisions
 */

import { Logger } from './logger';
import type { AppIdentifier, AppIntent, Channel, Context, IntentResolution } from './types';

// ============================================================================
// Message Protocol Types
// ============================================================================

/**
 * Base envelope for all PostMessage protocol messages
 */
export interface PostMessageEnvelope {
  /** Message type identifier */
  type: 'fdc3-pm-request' | 'fdc3-pm-response' | 'fdc3-pm-event';
  /** Unique correlation ID for request/response matching */
  correlationId: string;
  /** FDC3 method being invoked */
  method: string;
  /** Message payload */
  payload: unknown;
  /** Metadata */
  meta: {
    timestamp: string;
    origin: string;
    source?: AppIdentifier;
  };
}

/**
 * Request message sent to external origins
 */
export interface PostMessageRequest extends PostMessageEnvelope {
  type: 'fdc3-pm-request';
}

/**
 * Response message received from external origins
 */
export interface PostMessageResponse extends PostMessageEnvelope {
  type: 'fdc3-pm-response';
  /** Whether the request succeeded */
  success: boolean;
  /** Error message if failed */
  error?: string;
}

/**
 * Event message for unsolicited notifications (e.g., intent events)
 */
export interface PostMessageEvent extends PostMessageEnvelope {
  type: 'fdc3-pm-event';
}

/**
 * PostMessage bridge configuration options
 */
export interface PostMessageBridgeOptions {
  /** Allowed origins for cross-domain messaging */
  allowedOrigins: string[];
  /** Request timeout in ms (default: 5000) */
  timeout?: number;
}

// ============================================================================
// PostMessage Bridge Implementation
// ============================================================================

/**
 * PostMessage Bridge Implementation
 *
 * Bridges FDC3 communication between the MFE platform and external domain applications
 * using the browser's postMessage API with MessageChannel for reliable two-way comms.
 */
export class PostMessageBridge {
  private logger: Logger;
  private enabled: boolean;
  private options: PostMessageBridgeOptions;
  private pendingRequests: Map<
    string,
    {
      resolve: (value: unknown) => void;
      reject: (reason: Error) => void;
      timeout: ReturnType<typeof setTimeout>;
    }
  > = new Map();
  private intentHandler:
    | ((intent: string, context: Context, source?: AppIdentifier) => void)
    | null = null;
  private messageHandler: ((event: MessageEvent) => void) | null = null;

  /**
   * Creates a PostMessage bridge instance
   *
   * @param options - Bridge configuration options
   */
  constructor(options: PostMessageBridgeOptions) {
    this.logger = new Logger(!!(globalThis as Record<string, unknown>).__FDC3_DEBUG__);
    this.options = {
      timeout: 5000,
      ...options,
    };

    // Validate configuration
    if (!this.options.allowedOrigins || this.options.allowedOrigins.length === 0) {
      this.logger.warn(
        'PostMessage bridge initialized with empty allowedOrigins - no cross-origin messages will be accepted',
      );
      this.enabled = false;
    } else {
      this.enabled = this.isPostMessageAvailable();
    }

    if (this.enabled) {
      this.setupMessageListener();
      this.logger.info('PostMessage bridge initialized', {
        allowedOrigins: this.options.allowedOrigins,
      });
    }
  }

  /**
   * Check if postMessage API is available
   */
  private isPostMessageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.postMessage === 'function';
  }

  /**
   * Setup global message listener for incoming messages
   */
  private setupMessageListener(): void {
    this.messageHandler = (event: MessageEvent) => {
      this.handleIncomingMessage(event);
    };
    window.addEventListener('message', this.messageHandler);
  }

  /**
   * Handle incoming postMessage events
   */
  private handleIncomingMessage(event: MessageEvent): void {
    // Validate origin
    if (!this.isOriginAllowed(event.origin)) {
      this.logger.debug('Ignoring message from disallowed origin', {
        origin: event.origin,
      });
      return;
    }

    // Validate message structure
    const data = event.data;
    if (!this.isValidEnvelope(data)) {
      return; // Not an FDC3 PostMessage envelope
    }

    const envelope = data as PostMessageEnvelope;

    switch (envelope.type) {
      case 'fdc3-pm-response':
        this.handleResponse(envelope as PostMessageResponse);
        break;
      case 'fdc3-pm-event':
        this.handleEvent(envelope as PostMessageEvent);
        break;
      case 'fdc3-pm-request':
        // We don't handle incoming requests in this implementation
        // (we're the client, not the server)
        this.logger.debug('Received request - not handled', {
          method: envelope.method,
        });
        break;
    }
  }

  /**
   * Validate origin against allowlist
   */
  private isOriginAllowed(origin: string): boolean {
    return this.options.allowedOrigins.includes('*') || this.options.allowedOrigins.includes(origin);
  }

  /**
   * Get all target origins for fan-out requests.
   * When `*` is in the allowlist, returns `['*']`. Otherwise returns all configured origins.
   */
  private getAllTargetOrigins(): string[] {
    if (this.options.allowedOrigins.includes('*')) {
      return ['*'];
    }
    return [...this.options.allowedOrigins];
  }

  /**
   * Validate message envelope structure
   */
  private isValidEnvelope(data: unknown): data is PostMessageEnvelope {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as Record<string, unknown>;
    return (
      typeof obj.type === 'string' &&
      obj.type.startsWith('fdc3-pm-') &&
      typeof obj.correlationId === 'string' &&
      typeof obj.method === 'string'
    );
  }

  /**
   * Handle response messages
   */
  private handleResponse(response: PostMessageResponse): void {
    const pending = this.pendingRequests.get(response.correlationId);
    if (!pending) {
      this.logger.debug('Received response for unknown request', {
        correlationId: response.correlationId,
      });
      return;
    }

    clearTimeout(pending.timeout);
    this.pendingRequests.delete(response.correlationId);

    if (response.success) {
      pending.resolve(response.payload);
    } else {
      pending.reject(new Error(response.error || 'Unknown error'));
    }
  }

  /**
   * Handle event messages (e.g., incoming intents)
   */
  private handleEvent(event: PostMessageEvent): void {
    if (event.method === 'intentEvent' && this.intentHandler) {
      const payload = event.payload as {
        intent: string;
        context: Context;
      };
      this.intentHandler(payload.intent, payload.context, event.meta.source);
    }
  }

  /**
   * Generate a unique correlation ID
   */
  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Send a request to external origin
   */
  private sendRequest<T>(targetOrigin: string, method: string, payload: unknown): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.enabled) {
        reject(new Error('PostMessage bridge is not enabled'));
        return;
      }

      if (!this.isOriginAllowed(targetOrigin)) {
        reject(new Error(`Origin not allowed: ${targetOrigin}`));
        return;
      }

      const correlationId = this.generateCorrelationId();
      const request: PostMessageRequest = {
        type: 'fdc3-pm-request',
        correlationId,
        method,
        payload,
        meta: {
          timestamp: new Date().toISOString(),
          origin: window.location.origin,
        },
      };

      // Set up timeout
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(correlationId);
        reject(new Error(`Request timed out: ${method}`));
      }, this.options.timeout);

      // Store pending request
      this.pendingRequests.set(correlationId, {
        resolve: resolve as (value: unknown) => void,
        reject,
        timeout,
      });

      // Send message to target (broadcast to all frames if target is '*')
      if (targetOrigin === '*') {
        // Broadcast to parent and opener if available
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(request, '*');
        }
        if (window.opener) {
          window.opener.postMessage(request, '*');
        }
      } else {
        // Send to specific origin (we need to find the right target window)
        // For now, broadcast to parent with specific targetOrigin
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(request, targetOrigin);
        }
      }

      this.logger.debug('Sent request', {
        method,
        correlationId,
        targetOrigin,
      });
    });
  }

  // ==========================================================================
  // Public API
  // ==========================================================================

  /**
   * Checks if PostMessage bridge is enabled
   *
   * @returns true if bridge is available and configured
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Subscribes to intents from external applications
   *
   * @param intentHandler - Handler for incoming intents
   * @param supportedIntents - List of intent types to subscribe to
   */
  subscribeToIntents(
    intentHandler: (intent: string, context: Context, source?: AppIdentifier) => void,
    supportedIntents: string[],
  ): void {
    if (!this.enabled) {
      this.logger.warn('PostMessage bridge not enabled, skipping intent subscription');
      return;
    }

    this.intentHandler = intentHandler;
    this.logger.info('Subscribed to external intents via PostMessage', {
      intents: supportedIntents,
    });
  }

  /**
   * Raises an intent to an external application
   *
   * @param intent - Intent type
   * @param context - Context data
   * @param target - Optional target app
   * @param targetOrigin - Target origin to send to
   * @returns Promise resolving to IntentResolution
   * @throws Error if bridge is not enabled or request fails
   */
  async raiseIntentExternal(
    intent: string,
    context: Context,
    target?: AppIdentifier,
    targetOrigin: string = '*',
  ): Promise<IntentResolution> {
    if (!this.enabled) {
      throw new Error('PostMessage bridge is not enabled');
    }

    this.logger.debug('Raising intent via PostMessage', {
      intent,
      context,
      target,
      targetOrigin,
    });

    const response = await this.sendRequest<IntentResolution>(targetOrigin, 'raiseIntent', {
      intent,
      context,
      target,
    });

    this.logger.info('Intent raised via PostMessage successfully', {
      intent,
      source: response.source,
    });

    return response;
  }

  /**
   * Requests opening an app in an external domain
   *
   * @param app - App identifier
   * @param context - Optional context to pass
   * @param targetOrigin - Target origin to send to
   * @returns Promise resolving to AppIdentifier
   */
  async open(
    app: AppIdentifier | string,
    context?: Context,
    targetOrigin: string = '*',
  ): Promise<AppIdentifier> {
    if (!this.enabled) {
      throw new Error('PostMessage bridge is not enabled');
    }

    const appId = typeof app === 'string' ? app : app.appId;
    this.logger.debug('Requesting app open via PostMessage', {
      appId,
      targetOrigin,
    });

    const response = await this.sendRequest<AppIdentifier>(targetOrigin, 'open', {
      app: typeof app === 'string' ? { appId: app } : app,
      context,
    });

    this.logger.info('App open request successful via PostMessage', {
      appId: response.appId,
    });

    return response;
  }

  /**
   * Finds apps by intent in external domains
   *
   * @param intent - Intent type to search for
   * @param targetOrigin - Target origin to query
   * @returns Promise resolving to AppIntent
   */
  async findIntent(
    intent: string,
    context?: Context,
    targetOrigin: string = '*',
  ): Promise<AppIntent> {
    if (!this.enabled) {
      return { intent: { name: intent, displayName: intent }, apps: [] };
    }

    try {
      const response = await this.sendRequest<AppIntent>(targetOrigin, 'findIntent', {
        intent,
        context,
      });
      return response;
    } catch (error) {
      this.logger.debug('findIntent via PostMessage failed', { intent, error });
      return { intent: { name: intent, displayName: intent }, apps: [] };
    }
  }

  /**
   * Finds apps by context in external domains
   *
   * @param context - Context data to search for
   * @param targetOrigin - Target origin to query
   * @returns Promise resolving to array of app intents
   */
  async findIntentsByContext(context: Context, targetOrigin: string = '*'): Promise<AppIntent[]> {
    if (!this.enabled) {
      return [];
    }

    try {
      const response = await this.sendRequest<AppIntent[]>(targetOrigin, 'findIntentsByContext', {
        context,
      });
      return response;
    } catch (error) {
      this.logger.debug('findIntentsByContext via PostMessage failed', {
        context,
        error,
      });
      return [];
    }
  }

  /**
   * Joins a user channel in an external domain
   *
   * @param channel - Channel object or channel ID
   * @param targetOrigin - Target origin to send to
   */
  async joinUserChannel(channel: Channel | string, targetOrigin?: string): Promise<void> {
    if (!this.enabled) {
      throw new Error('PostMessage bridge is not enabled');
    }

    const channelId = typeof channel === 'string' ? channel : channel.id;
    const origins = targetOrigin ? [targetOrigin] : this.getAllTargetOrigins();

    this.logger.debug('Joining channel via PostMessage', {
      channelId,
      targetOrigins: origins,
    });

    await Promise.all(origins.map((origin) => this.sendRequest<void>(origin, 'joinUserChannel', { channelId })));

    this.logger.info('Joined channel via PostMessage', { channelId });
  }

  /**
   * Broadcasts context to an external channel
   *
   * @param context - Context data to broadcast
   * @param channelId - Optional channel ID, remote may use current channel when omitted
   * @param targetOrigin - Target origin to send to
   */
  async broadcast(context: Context, channelId?: string, targetOrigin?: string): Promise<void> {
    if (!this.enabled) {
      throw new Error('PostMessage bridge is not enabled');
    }

    const origins = targetOrigin ? [targetOrigin] : this.getAllTargetOrigins();

    this.logger.debug('Broadcasting context via PostMessage', {
      context,
      channelId,
      targetOrigins: origins,
    });

    await Promise.all(origins.map((origin) => this.sendRequest<void>(origin, 'broadcast', { context, channelId })));

    this.logger.info('Broadcast via PostMessage successful', {
      context,
      channelId,
    });
  }

  /**
   * Gets the current external channel
   *
   * @param targetOrigin - Target origin to query
   */
  async getCurrentChannel(targetOrigin?: string): Promise<Channel | null> {
    if (!this.enabled) {
      return null;
    }

    const origins = targetOrigin ? [targetOrigin] : this.getAllTargetOrigins();

    const results = await Promise.allSettled(
      origins.map((origin) => this.sendRequest<Channel | null>(origin, 'getCurrentChannel', {})),
    );

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value !== null) {
        return result.value;
      }
    }
    return null;
  }

  /**
   * Gets user channels from an external domain
   *
   * @param targetOrigin - Target origin to query
   */
  async getUserChannels(targetOrigin?: string): Promise<Channel[]> {
    if (!this.enabled) {
      return [];
    }

    const origins = targetOrigin ? [targetOrigin] : this.getAllTargetOrigins();

    const results = await Promise.allSettled(
      origins.map((origin) => this.sendRequest<Channel[]>(origin, 'getUserChannels', {})),
    );

    const channels: Channel[] = [];
    const seenIds = new Set<string>();
    for (const result of results) {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        for (const channel of result.value) {
          if (!seenIds.has(channel.id)) {
            seenIds.add(channel.id);
            channels.push(channel);
          }
        }
      }
    }
    return channels;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler);
      this.messageHandler = null;
    }

    // Clear pending requests
    for (const [, pending] of this.pendingRequests) {
      clearTimeout(pending.timeout);
      pending.reject(new Error('Bridge destroyed'));
    }
    this.pendingRequests.clear();

    this.enabled = false;
    this.logger.info('PostMessage bridge destroyed');
  }
}
