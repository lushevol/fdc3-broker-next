import type { Broker } from 'ratan-fdc3-broker';
import type {
  AppIdentifier,
  AppIntent,
  AppMetadata,
  Channel,
  Context,
  DesktopAgent,
  ImplementationMetadata,
  IntentResolution,
  Listener,
  PrivateChannel,
} from './types';

/**
 * Scoped Desktop Agent
 *
 * Wraps the stateless Broker and injects the source AppIdentifier into every call.
 * This ensures that the Broker knows which tile is performing the action.
 */
export class ScopedDesktopAgent implements DesktopAgent {
  private broker: Broker;
  private source: AppIdentifier;

  constructor(broker: Broker, source: AppIdentifier) {
    this.broker = broker;
    this.source = source;
  }

  async open(app: AppIdentifier | string, context?: Context): Promise<AppIdentifier> {
    return this.broker.open(app, context, this.source);
  }

  async findInstances(app: AppIdentifier): Promise<AppIdentifier[]> {
    return this.broker.findInstances(app);
  }

  async getAppMetadata(app: AppIdentifier): Promise<AppMetadata> {
    return this.broker.getAppMetadata(app);
  }

  async broadcast(context: Context): Promise<void> {
    return this.broker.broadcast(context, this.source);
  }

  async addContextListener(
    contextTypeOrHandler: string | null | ((context: Context) => void),
    handler?: (context: Context) => void,
  ): Promise<Listener> {
    return this.broker.addContextListener(contextTypeOrHandler, handler, this.source);
  }

  async findIntent(intent: string, context?: Context, resultType?: string): Promise<AppIntent> {
    return this.broker.findIntent(intent, context, resultType);
  }

  async findIntentsByContext(context: Context, resultType?: string): Promise<AppIntent[]> {
    return this.broker.findIntentsByContext(context, resultType);
  }

  async raiseIntent(
    intent: string,
    context: Context,
    target?: AppIdentifier | string,
  ): Promise<IntentResolution> {
    return this.broker.raiseIntent(intent, context, target, this.source);
  }

  async raiseIntentForContext(
    context: Context,
    target?: AppIdentifier | string,
  ): Promise<IntentResolution> {
    return this.broker.raiseIntentForContext(context, target, this.source);
  }

  async addIntentListener(
    intent: string,
    handler: (context: Context) => any | Promise<any>,
  ): Promise<Listener> {
    return this.broker.addIntentListener(intent, handler, this.source);
  }

  async getOrCreateChannel(channelId: string): Promise<Channel> {
    return this.broker.getOrCreateChannel(channelId);
  }

  async createPrivateChannel(): Promise<PrivateChannel> {
    return this.broker.createPrivateChannel(this.source);
  }

  async getUserChannels(): Promise<Channel[]> {
    return this.broker.getUserChannels();
  }

  async joinUserChannel(channelId: string): Promise<void> {
    return this.broker.joinUserChannel(channelId, this.source);
  }

  async getCurrentChannel(): Promise<Channel | null> {
    return this.broker.getCurrentChannel(this.source);
  }

  async leaveCurrentChannel(): Promise<void> {
    return this.broker.leaveCurrentChannel(this.source);
  }

  async getInfo(): Promise<ImplementationMetadata> {
    return this.broker.getInfo();
  }

  async addEventListener(eventType: any, handler: (event: any) => void): Promise<Listener> {
    return this.broker.addEventListener(eventType, handler);
  }

  // Alias methods for compatibility
  async joinChannel(channelId: string): Promise<void> {
    return this.joinUserChannel(channelId);
  }

  async getSystemChannels(): Promise<Channel[]> {
    return this.getUserChannels();
  }

  async registerTile(instanceId: string, appId: string, metadata?: AppMetadata): Promise<void> {
    return this.broker.registerTile(instanceId, appId, metadata);
  }

  async unregisterTile(instanceId: string): Promise<void> {
    return this.broker.unregisterTile(instanceId);
  }
}
