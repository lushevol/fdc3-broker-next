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
 * Configuration for entitlement check
 */
interface EntitlementCheckConfig {
  /** Action being checked (e.g., 'send-intent', 'receive-intent') */
  action: string;
  /** Error code when denied */
  deniedErrorCode: string;
  /** Reason message when denied */
  deniedReason: string;
  /** Log message for security events */
  securityLogMessage: string;
  /** Additional context for logging */
  logContext: Record<string, unknown>;
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
   * Shared entitlement check logic
   *
   * @param tileId - Tile or app identifier
   * @param checkConfig - Check configuration
   * @returns Promise resolving to entitlement check result
   */
  private async checkEntitlement(
    tileId: string,
    checkConfig: EntitlementCheckConfig,
  ): Promise<EntitlementCheckResult> {
    this.logger.debug(`Checking ${checkConfig.action} entitlement`, checkConfig.logContext);

    if (!this.config.callbacks.onValidateEntitlements) {
      this.logger.warn('No entitlement validation configured, allowing by default');
      return { allowed: true };
    }

    try {
      const entitled = await this.config.callbacks.onValidateEntitlements(tileId, checkConfig.action);

      if (!entitled) {
        this.logger.security(checkConfig.securityLogMessage, checkConfig.logContext);
        return {
          allowed: false,
          reason: checkConfig.deniedReason,
          errorCode: checkConfig.deniedErrorCode,
        };
      }

      return { allowed: true };
    } catch (error) {
      this.logger.error(`Error checking ${checkConfig.action} entitlements`, error as Error);
      return {
        allowed: false,
        reason: 'Error validating entitlements',
        errorCode: 'ENTITLEMENT_ERROR',
      };
    }
  }

  /**
   * Checks if a tile can send an intent
   *
   * @param tileId - Tile identifier to check
   * @param intent - Intent type to send
   * @param context - Optional context data
   * @returns Promise resolving to entitlement check result
   */
  async canSendIntent(tileId: string, intent: string, context?: Context): Promise<EntitlementCheckResult> {
    return this.checkEntitlement(tileId, {
      action: 'send-intent',
      deniedErrorCode: 'ENTITLEMENT_DENIED_SEND',
      deniedReason: 'Not entitled to send this intent',
      securityLogMessage: 'Intent send denied due to entitlements',
      logContext: { tileId, intent, contextType: context?.type },
    });
  }

  /**
   * Checks if a tile can receive an intent
   *
   * @param tileId - Tile identifier to check
   * @param intent - Intent type to receive
   * @returns Promise resolving to entitlement check result
   */
  async canReceiveIntent(tileId: string, intent: string): Promise<EntitlementCheckResult> {
    return this.checkEntitlement(tileId, {
      action: 'receive-intent',
      deniedErrorCode: 'ENTITLEMENT_DENIED_RECEIVE',
      deniedReason: 'Not entitled to receive this intent',
      securityLogMessage: 'Intent receive denied due to entitlements',
      logContext: { tileId, intent },
    });
  }

  /**
   * Checks if a tile can join a channel
   *
   * @param tileId - Tile identifier to check
   * @param channelId - Channel ID to join
   * @returns Promise resolving to entitlement check result
   */
  async canJoinChannel(tileId: string, channelId: string): Promise<EntitlementCheckResult> {
    const baseResult = await this.checkEntitlement(tileId, {
      action: 'join-channel',
      deniedErrorCode: 'ENTITLEMENT_DENIED_CHANNEL',
      deniedReason: 'Not entitled to join this channel',
      securityLogMessage: 'Channel join denied due to entitlements',
      logContext: { tileId, channelId },
    });

    if (!baseResult.allowed) {
      return baseResult;
    }

    // Additional check for premium channels
    if (this.isPremiumChannel(channelId)) {
      const premiumResult = await this.checkEntitlement(tileId, {
        action: 'join-premium-channel',
        deniedErrorCode: 'ENTITLEMENT_DENIED_PREMIUM_CHANNEL',
        deniedReason: 'Premium subscription required for this channel',
        securityLogMessage: 'Premium channel join denied due to entitlements',
        logContext: { tileId, channelId, premium: true },
      });
      return premiumResult;
    }

    return baseResult;
  }

  /**
   * Checks if a tile can be opened
   *
   * @param appId - App identifier to check
   * @param context - Optional context data
   * @returns Promise resolving to entitlement check result
   */
  async canOpenTile(appId: string, context?: Context): Promise<EntitlementCheckResult> {
    return this.checkEntitlement(appId, {
      action: 'open',
      deniedErrorCode: 'ENTITLEMENT_DENIED_OPEN',
      deniedReason: 'Not entitled to open this application',
      securityLogMessage: 'Tile open denied due to entitlements',
      logContext: { appId, contextType: context?.type },
    });
  }

  /**
   * Check if channel is a premium channel
   * @param channelId Channel ID
   * @returns true if channel requires premium access
   */
  private isPremiumChannel(channelId: string): boolean {
    const premiumChannelPrefixes = ['premium-', 'private-'];
    return premiumChannelPrefixes.some((prefix) => channelId.startsWith(prefix));
  }
}