/**
 * Intent Resolver
 *
 * Resolves intent targets by querying App Directory and handling ambiguity.
 * Provides functionality to find target applications for intents, filter by entitlements,
 * and show resolver UI when multiple targets are available.
 *
 * @see plan.md#L451-L522
 */

import type { AppDefinition, AppDirectoryClient } from 'ratan-fdc3-app-directory';
import { Logger, LogLevel } from './logger';
import type {
  AppIdentifier,
  BrokerConfig,
  Context,
  IntentResolution,
  ResolverTarget,
  TileRegistry,
} from './types';

/**
 * Intent Resolution Result
 *
 * Represents the result of attempting to resolve an intent to a target application.
 * Can be successful (single target), ambiguous (multiple targets), or not found.
 */
interface IntentResolutionResult {
  /** Resolution status */
  type: 'success' | 'ambiguous' | 'not-found';
  /** Selected target (for successful resolution) */
  target?: ResolverTarget;
  /** Available targets (for ambiguous resolution) */
  targets?: ResolverTarget[];
}

/**
 * Intent Resolver Implementation
 *
 * Handles the resolution of intents to target applications by querying the app directory,
 * filtering by entitlements, and finding running instances. Manages the resolver UI flow
 * when multiple targets are available.
 */
export class IntentResolver {
  private appDirectory: AppDirectoryClient;
  private tileRegistry: TileRegistry;
  private callbacks: BrokerConfig['callbacks'];
  private logger: Logger;

  /**
   * Creates a new IntentResolver instance
   *
   * @param appDirectory - App directory client for querying applications
   * @param tileRegistry - Registry of running tile instances
   * @param callbacks - Broker configuration callbacks
   */
  constructor(
    appDirectory: AppDirectoryClient,
    tileRegistry: TileRegistry,
    callbacks: BrokerConfig['callbacks'],
    enableDebug = false,
    logLevel = LogLevel.INFO,
  ) {
    this.appDirectory = appDirectory;
    this.tileRegistry = tileRegistry;
    this.callbacks = callbacks;
    this.logger = new Logger(enableDebug, logLevel);
  }

  /**
   * Resolves an intent to a target application
   *
   * Finds applications that can handle the intent, filters by entitlements,
   * and returns either a single target, multiple targets (ambiguous), or no target.
   *
   * @param intent - Intent type to resolve
   * @param context - Context data for the intent
   * @param target - Optional target specification
   * @returns Promise resolving to IntentResolutionResult
   *
   * @example
   * ```typescript
   * const result = await resolver.resolve('ViewChart', context);
   * if (result.type === 'success') {
   *   // Use result.target
   * } else if (result.type === 'ambiguous') {
   *   // Show resolver UI with result.targets
   * }
   * ```
   *
   * @see showResolverUI
   * @see createIntentResolution
   */
  async resolve(
    intent: string,
    context: Context,
    target?: AppIdentifier,
  ): Promise<IntentResolutionResult> {
    this.logger.debug('Resolving intent', {
      intent,
      contextType: context?.type,
      target,
    }, 'intent');

    // If target specified, resolve directly
    if (target) {
      this.logger.debug('Resolving to specific target', {
        appId: target.appId,
        instanceId: target.instanceId,
      }, 'intent');
      return await this.resolveSpecificTarget(intent, context, target);
    }

    // Find all apps that can handle this intent
    const apps = await this.appDirectory.findByIntent(intent);
    this.logger.debug('Found apps for intent', { intent, count: apps.length }, 'intent');

    if (apps.length === 0) {
      this.logger.debug('No apps found for intent', { intent }, 'intent');
      return { type: 'not-found' };
    }

    // Filter apps to only those entitled
    const entitledApps = await this.filterEntitledApps(apps);
    this.logger.debug('Filtered by entitlements', {
      total: apps.length,
      entitled: entitledApps.length,
    }, 'intent');

    if (entitledApps.length === 0) {
      this.logger.debug('No entitled apps found for intent', { intent }, 'intent');
      return { type: 'not-found' };
    }

    // Find instances of entitled apps
    const targets = await this.findTargets(entitledApps, intent);
    this.logger.debug('Found targets', { count: targets.length, intent }, 'intent');

    if (targets.length === 0) {
      // No instances running, but apps exist - return first app for launching
      this.logger.debug('No running instances, returning app for launch', {
        appId: entitledApps[0]?.appId,
      }, 'intent');
      return { type: 'success', target: targets[0] };
    }

    if (targets.length === 1) {
      this.logger.debug('Single target found', {
        appId: targets[0].appId,
        instanceId: targets[0].instanceId,
      }, 'intent');
      return { type: 'success', target: targets[0] };
    }

    // Multiple targets available - ambiguous
    this.logger.debug('Multiple targets found, showing resolver UI', {
      count: targets.length,
      appIds: targets.map((t) => t.appId),
    }, 'intent');
    return { type: 'ambiguous', targets };
  }

  /**
   * Resolve specific target
   * @param intent Intent type
   * @param context Context data
   * @param target Target specification
   * @returns Intent resolution result
   */
  private async resolveSpecificTarget(
    intent: string,
    context: Context,
    target: AppIdentifier,
  ): Promise<IntentResolutionResult> {
    // Check if target instance exists
    if (target.instanceId) {
      const tile = this.tileRegistry.getTile(target.instanceId);
      if (tile) {
        const resolverTarget: ResolverTarget = {
          appId: target.appId,
          ...(target.instanceId && { instanceId: target.instanceId }),
          metadata: tile.metadata || {
            appId: target.appId,
            name: tile.appId,
          },
          currentContext: undefined, // Could be enhanced to track current context
        };
        return { type: 'success', target: resolverTarget };
      }
    }

    // Check if app exists (for launching new instance)
    const app = await this.appDirectory.getApp(target.appId);
    if (!app) {
      return { type: 'not-found' };
    }

    // Check entitlements
    const entitled = await this.checkEntitlements(target.appId, 'receive-intent');
    if (!entitled) {
      return { type: 'not-found' };
    }

    const resolverTarget: ResolverTarget = {
      appId: app.appId,
      ...(target.instanceId && { instanceId: target.instanceId }),
      metadata: {
        appId: app.appId,
        name: app.name,
        title: app.title,
        description: app.description,
        version: app.version,
      },
    };

    return { type: 'success', target: resolverTarget };
  }

  /**
   * Filter apps to only those the user is entitled to access
   * @param apps All apps
   * @returns Entitled apps
   */
  private async filterEntitledApps(apps: Array<AppDefinition>): Promise<Array<AppDefinition>> {
    const entitled: Array<AppDefinition> = [];

    for (const app of apps) {
      // Check entitlement constraints
      if (app.entitlementConstraints) {
        const canAccess = await this.checkEntitlements(app.appId, 'access');
        if (!canAccess) {
          continue;
        }
      }
      entitled.push(app);
    }

    return entitled;
  }

  /**
   * Find target instances for apps
   * @param apps Apps to find instances for
   * @param intent Intent type
   * @returns Array of potential targets
   */
  private async findTargets(apps: Array<AppDefinition>, intent: string): Promise<ResolverTarget[]> {
    const targets: ResolverTarget[] = [];

    for (const app of apps) {
      // Find running instances of this app
      const tiles = this.tileRegistry.getTilesByAppId(app.appId);
      const mountedTiles = tiles.filter((t) => t.state === 'mounted');

      if (mountedTiles.length > 0) {
        // Add each mounted instance as a target
        for (const tile of mountedTiles) {
          const resolverTarget: ResolverTarget = {
            appId: app.appId,
            instanceId: tile.instanceId,
            metadata: tile.metadata || {
              appId: app.appId,
              name: app.name,
            },
          };
          targets.push(resolverTarget);
        }
      } else {
        // No instances running, but app is available
        const resolverTarget: ResolverTarget = {
          appId: app.appId,
          metadata: {
            appId: app.appId,
            name: app.name,
            title: app.title,
            description: app.description,
            version: app.version,
          },
        };
        targets.push(resolverTarget);
      }
    }

    return targets;
  }

  /**
   * Check if user is entitled to perform an action
   * @param appId App ID
   * @param action Action type
   * @returns true if entitled
   */
  private async checkEntitlements(appId: string, action: string): Promise<boolean> {
    if (this.callbacks.onValidateEntitlements) {
      try {
        return await this.callbacks.onValidateEntitlements(appId, action);
      } catch (error) {
        console.error(`[IntentResolver] Entitlement check failed for ${appId}:`, error);
        return false;
      }
    }
    // If no entitlement validator, allow all
    return true;
  }

  /**
   * Shows resolver UI to let user select from multiple targets
   *
   * Displays a user interface allowing the user to select which application
   * should handle the intent when multiple targets are available.
   *
   * @param targets - Array of available target applications
   * @returns Promise resolving to selected target or null if cancelled
   *
   * @example
   * ```typescript
   * const selected = await resolver.showResolverUI(availableTargets);
   * if (selected) {
   *   // User selected a target
   * } else {
   *   // User cancelled
   * }
   * ```
   */
  async showResolverUI(targets: ResolverTarget[]): Promise<ResolverTarget | null> {
    if (this.callbacks.onShowResolverUI) {
      try {
        return await this.callbacks.onShowResolverUI(targets);
      } catch (error) {
        console.error('[IntentResolver] Resolver UI failed:', error);
        return null;
      }
    }

    // No resolver UI callback - default to first target
    console.warn('[IntentResolver] No resolver UI callback, defaulting to first target');
    return targets[0] || null;
  }

  /**
   * Creates an IntentResolution object from a target
   *
   * Converts a ResolverTarget into the standard FDC3 IntentResolution format.
   *
   * @param target - The target application
   * @param intent - The intent type that was raised
   * @returns IntentResolution object with source app details
   *
   * @example
   * ```typescript
   * const resolution = resolver.createIntentResolution(target, 'ViewChart');
   * console.log('Intent handled by:', resolution.source.appId);
   * ```
   */
  createIntentResolution(
    target: ResolverTarget,
    intent: string,
    result?: unknown,
  ): IntentResolution {
    const resolution: IntentResolution = {
      intent,
      source: {
        ...target.metadata,
        appId: target.appId,
        ...(target.instanceId && { instanceId: target.instanceId }),
      },
      getResult: () => {
        // Return a promise that resolves to the result
        return Promise.resolve(result as any);
      },
    };

    return resolution;
  }
}
