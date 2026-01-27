/**
 * Entitlement Validator
 *
 * Validates user entitlements for FDC3 operations. Provides security by checking
 * user permissions before allowing operations like sending intents, joining channels,
 * or opening applications.
 *
 * @see plan.md#T151
 * @see research.md#L875-L880
 */

import { Logger } from './logger';
import type { BrokerConfig, Context } from './types';

/**
 * Result of an entitlement check
 *
 * Indicates whether an operation is allowed and provides details about any denial.
 */
export interface EntitlementCheckResult {
  /** Whether the operation is allowed */
  allowed: boolean;
  /** Reason for denial (if not allowed) */
  reason?: string;
  /** Error code for the denial */
  errorCode?: string;
}

/**
 * Entitlement Validator Implementation
 *
 * Validates user permissions for FDC3 operations including sending intents,
 * receiving intents, joining channels, and opening applications.
 * Uses a fail-closed approach for security.
 */
export class EntitlementValidator {
  private logger: Logger;
  private config: BrokerConfig;

  /**
   * Creates a new EntitlementValidator instance
   *
   * @param config - Broker configuration including callbacks
   */
  constructor(config: BrokerConfig) {
    this.config = config;
    this.logger = new Logger(config.enableDebug || false);
  }

  /**
   * Checks if a tile can send an intent
   *
   * Validates that the tile has permission to send the specified intent type.
   * Logs a security event if denied.
   *
   * @param tileId - Tile identifier to check
   * @param intent - Intent type to send
   * @param context - Optional context data
   * @returns Promise resolving to entitlement check result
   *
   * @example
   * ```typescript
   * const check = await validator.canSendIntent('tile-123', 'ViewChart', context);
   * if (!check.allowed) {
   *   console.error(check.reason);
   * }
   * ```
   */
  async canSendIntent(
    tileId: string,
    intent: string,
    context?: Context,
  ): Promise<EntitlementCheckResult> {
    this.logger.debug('Checking send intent entitlement', {
      tileId,
      intent,
      contextType: context?.type,
    });

    // Check if entitlement validation callback is configured
    if (!this.config.callbacks.onValidateEntitlements) {
      // No validation configured - allow by default
      this.logger.warn('No entitlement validation configured, allowing by default');
      return { allowed: true };
    }

    try {
      // Call entitlement validation callback
      const entitled = await this.config.callbacks.onValidateEntitlements(tileId, 'send-intent');

      if (!entitled) {
        this.logger.security('Intent send denied due to entitlements', {
          tileId,
          intent,
          contextType: context?.type,
        });

        return {
          allowed: false,
          reason: 'Not entitled to send this intent',
          errorCode: 'ENTITLEMENT_DENIED_SEND',
        };
      }

      return { allowed: true };
    } catch (error) {
      this.logger.error('Error checking send intent entitlements', error as Error);

      // Fail closed for security
      return {
        allowed: false,
        reason: 'Error validating entitlements',
        errorCode: 'ENTITLEMENT_ERROR',
      };
    }
  }

  /**
   * Checks if a tile can receive an intent
   *
   * @param tileId - Tile identifier to check
   * @param intent - Intent type to receive
   * @returns Promise resolving to entitlement check result
   */
  async canReceiveIntent(tileId: string, intent: string): Promise<EntitlementCheckResult> {
    this.logger.debug('Checking receive intent entitlement', {
      tileId,
      intent,
    });

    // Check if entitlement validation callback is configured
    if (!this.config.callbacks.onValidateEntitlements) {
      // No validation configured - allow by default
      this.logger.warn('No entitlement validation configured, allowing by default');
      return { allowed: true };
    }

    try {
      // Call entitlement validation callback
      const entitled = await this.config.callbacks.onValidateEntitlements(tileId, 'receive-intent');

      if (!entitled) {
        this.logger.security('Intent receive denied due to entitlements', {
          tileId,
          intent,
        });

        return {
          allowed: false,
          reason: 'Not entitled to receive this intent',
          errorCode: 'ENTITLEMENT_DENIED_RECEIVE',
        };
      }

      return { allowed: true };
    } catch (error) {
      this.logger.error('Error checking receive intent entitlements', error as Error);

      // Fail closed for security
      return {
        allowed: false,
        reason: 'Error validating entitlements',
        errorCode: 'ENTITLEMENT_ERROR',
      };
    }
  }

  /**
   * Checks if a tile can join a channel
   *
   * @param tileId - Tile identifier to check
   * @param channelId - Channel ID to join
   * @returns Promise resolving to entitlement check result
   */
  async canJoinChannel(tileId: string, channelId: string): Promise<EntitlementCheckResult> {
    this.logger.debug('Checking join channel entitlement', {
      tileId,
      channelId,
    });

    // Check if entitlement validation callback is configured
    if (!this.config.callbacks.onValidateEntitlements) {
      // No validation configured - allow by default
      this.logger.warn('No entitlement validation configured, allowing by default');
      return { allowed: true };
    }

    try {
      // Call entitlement validation callback
      const entitled = await this.config.callbacks.onValidateEntitlements(tileId, 'join-channel');

      if (!entitled) {
        this.logger.security('Channel join denied due to entitlements', {
          tileId,
          channelId,
        });

        return {
          allowed: false,
          reason: 'Not entitled to join this channel',
          errorCode: 'ENTITLEMENT_DENIED_CHANNEL',
        };
      }

      // Additional check for premium channels
      if (this.isPremiumChannel(channelId)) {
        const premiumEntitled = await this.config.callbacks.onValidateEntitlements(
          tileId,
          'join-premium-channel',
        );

        if (!premiumEntitled) {
          this.logger.security('Premium channel join denied due to entitlements', {
            tileId,
            channelId,
          });

          return {
            allowed: false,
            reason: 'Premium subscription required for this channel',
            errorCode: 'ENTITLEMENT_DENIED_PREMIUM_CHANNEL',
          };
        }
      }

      return { allowed: true };
    } catch (error) {
      this.logger.error('Error checking join channel entitlements', error as Error);

      // Fail closed for security
      return {
        allowed: false,
        reason: 'Error validating entitlements',
        errorCode: 'ENTITLEMENT_ERROR',
      };
    }
  }

  /**
   * Checks if a tile can be opened
   *
   * @param appId - App identifier to check
   * @param context - Optional context data
   * @returns Promise resolving to entitlement check result
   */
  async canOpenTile(appId: string, context?: Context): Promise<EntitlementCheckResult> {
    this.logger.debug('Checking open tile entitlement', {
      appId,
      contextType: context?.type,
    });

    // Check if entitlement validation callback is configured
    if (!this.config.callbacks.onValidateEntitlements) {
      // No validation configured - allow by default
      this.logger.warn('No entitlement validation configured, allowing by default');
      return { allowed: true };
    }

    try {
      // Call entitlement validation callback
      const entitled = await this.config.callbacks.onValidateEntitlements(appId, 'open');

      if (!entitled) {
        this.logger.security('Tile open denied due to entitlements', {
          appId,
          contextType: context?.type,
        });

        return {
          allowed: false,
          reason: 'Not entitled to open this application',
          errorCode: 'ENTITLEMENT_DENIED_OPEN',
        };
      }

      return { allowed: true };
    } catch (error) {
      this.logger.error('Error checking open tile entitlements', error as Error);

      // Fail closed for security
      return {
        allowed: false,
        reason: 'Error validating entitlements',
        errorCode: 'ENTITLEMENT_ERROR',
      };
    }
  }

  /**
   * Check if channel is a premium channel
   * @param channelId Channel ID
   * @returns true if channel requires premium access
   */
  private isPremiumChannel(channelId: string): boolean {
    // Example: channels starting with 'premium-' require premium access
    // This can be configured via broker config if needed
    const premiumChannelPrefixes = ['premium-', 'private-'];
    return premiumChannelPrefixes.some((prefix) => channelId.startsWith(prefix));
  }

  /**
   * Log security event
   * @param event Event description
   * @param data Event data
   */
  private logSecurityEvent(event: string, data: Record<string, unknown>): void {
    this.logger.security(event, data);

    // Call security event callback if configured
    if (this.config.callbacks.onSecurityEvent) {
      try {
        this.config.callbacks.onSecurityEvent(event, data);
      } catch (error) {
        this.logger.error('Error calling security event callback', error as Error);
      }
    }
  }
}
