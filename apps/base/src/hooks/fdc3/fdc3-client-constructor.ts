import type {
  AppIdentifier,
  Context,
  DesktopAgent,
  EventHandler,
  FDC3EventTypes,
  Listener,
} from '@finos/fdc3';
import type { BaseFDC3Broker } from './base-broker';

export class FDC3ClientConstructor {
  broker: BaseFDC3Broker;
  private appIdentifier?: AppIdentifier;

  constructor(broker: BaseFDC3Broker, appIdentifier?: AppIdentifier) {
    this.broker = broker;
    this.appIdentifier = appIdentifier;
  }

  build(): DesktopAgent {
    return {
      addIntentListener: (intent: string, handler: (context: Context) => void) => {
        console.log(`[FMPTP FDC3] Client addIntentListener for intent: ${intent}`);
        const res = this.broker.addIntentListenerHandler(intent, handler, this.appIdentifier);

        return res;
      },
      broadcast: (context: Context) => {
        console.log(`[FMPTP FDC3] Client broadcast with context:`, context);
        return Promise.resolve();
      },
      findIntent: (intent: string, context?: Context) => {
        console.log(`[FMPTP FDC3] Client findIntent for intent: ${intent}`, context);
        return Promise.resolve({
          intent: { name: intent, displayName: intent },
          apps: [],
        });
      },
      findIntentsByContext: (context: Context) => {
        console.log(`[FMPTP FDC3] Client findIntentsByContext with context:`, context);
        return Promise.resolve([]);
      },
      getCurrentChannel: () => {
        console.log(`[FMPTP FDC3] Client getCurrentChannel`);
        return Promise.resolve(null);
      },
      getOrCreateChannel: (channelId: string) => {
        console.log(`[FMPTP FDC3] Client getOrCreateChannel with channelId: ${channelId}`);
        return Promise.resolve({
          id: channelId,
          type: 'user',
          broadcast: (context: Context) => {
            console.log(`[FMPTP FDC3] Client channel broadcast with context:`, context);
            return Promise.resolve();
          },
          getCurrentContext: () => Promise.resolve(null),
          addContextListener: (
            contextTypeOrHandler: string | ((context: Context) => void) | null,
            handler?: (context: Context) => void,
          ) => {
            console.log(
              `[FMPTP FDC3] Client channel addContextListener for contextType: ${contextTypeOrHandler}`,
            );
            return Promise.resolve({
              unsubscribe: async () =>
                console.log(
                  `[FMPTP FDC3] Client channel listener unsubscribed for contextType: ${contextTypeOrHandler}`,
                ),
            });
          },
        });
      },
      getSystemChannels: () => {
        console.log(`[FMPTP FDC3] Client getSystemChannels`);
        return Promise.resolve([]);
      },
      joinChannel: (channelId: string) => {
        console.log(`[FMPTP FDC3] Client joinChannel with channelId: ${channelId}`);
        return Promise.resolve();
      },
      leaveCurrentChannel: () => {
        console.log(`[FMPTP FDC3] Client leaveCurrentChannel`);
        return Promise.resolve();
      },
      open: (app: AppIdentifier | string, context?: Context) => {
        console.log(`[FMPTP FDC3] Client open app: ${app} with context:`, context);
        return Promise.resolve({
          appId: '',
          instanceId: '',
        });
      },
      raiseIntent: (intent: string, context: Context, app?: AppIdentifier | string) => {
        console.log(
          `[FMPTP FDC3] Client raiseIntent for intent: ${intent} with context:`,
          context,
          `and target: ${typeof app === 'string' ? app : JSON.stringify(app)}`,
        );

        return this.broker.handleRaiseIntent(
          intent,
          context,
          typeof app === 'string' ? { appId: app, instanceId: '' } : app,
        );
      },
      raiseIntentForContext: (context: Context, app?: AppIdentifier | string) => {
        console.log(
          `[FMPTP FDC3] Client raiseIntentForContext with context:`,
          context,
          `and target: ${app ? (typeof app === 'string' ? app : JSON.stringify(app)) : 'none'}`,
        );
        // return Promise.resolve({
        //   intent: "ClientIntent",
        //   source: {
        //     appId: "ClientApp",
        //     instanceId: "ClientInstance",
        //   },
        //   getResult: () =>
        //     Promise.resolve({
        //       type: "data",
        //       data: { message: "Client result data" },
        //     }),
        // });

        return this.broker.handleRaiseIntentForContext(
          context,
          typeof app === 'string' ? { appId: app, instanceId: '' } : app,
        );
      },
      addContextListener: (
        contextTypeOrHandler: string | ((context: Context) => void) | null,
        handler?: (context: Context) => void,
      ) => {
        const contextType =
          typeof contextTypeOrHandler === 'string' ? contextTypeOrHandler : undefined;
        const actualHandler =
          typeof contextTypeOrHandler === 'function' ? contextTypeOrHandler : handler;
        console.log(`[FMPTP FDC3] Client addContextListener for contextType: ${contextType}`);
        return Promise.resolve({
          unsubscribe: async () =>
            console.log(
              `[FMPTP FDC3] Client context listener unsubscribed for contextType: ${contextType}`,
            ),
        });
      },
      getInfo: () => {
        console.log(`[FMPTP FDC3] Client getInfo`);
        return Promise.resolve({
          fdc3Version: '2.1',
          appMetadata: {
            appId: 'ClientFDC3App',
            name: 'Client FDC3 App',
            version: '1.0.0',
            description: 'Client FDC3 implementation for testing purposes',
          },
          provider: 'Client FDC3 Provider',
          optionalFeatures: {
            OriginatingAppMetadata: false,
            UserChannelMembershipAPIs: false,
            DesktopAgentBridging: false,
          },
        });
      },
      findInstances: () => {
        console.log(`[FMPTP FDC3] Client findInstances`);
        return Promise.resolve([]);
      },
      getUserChannels: () => {
        console.log(`[FMPTP FDC3] Client getUserChannels`);
        return Promise.resolve([]);
      },
      joinUserChannel: (channelId: string) => {
        console.log(`[FMPTP FDC3] Client joinUserChannel with channelId: ${channelId}`);
        return Promise.resolve();
      },
      createPrivateChannel: () => {
        console.log(`[FMPTP FDC3] Client createPrivateChannel`);
        return Promise.resolve({
          id: 'ClientPrivateChannel',
          type: 'private',
          broadcast: async (context: Context) =>
            console.log(`[FMPTP FDC3] Client private channel broadcast with context:`, context),
          getCurrentContext: () => Promise.resolve(null),
          addEventListener: async (event: string | null, handler: (_x) => void) => {
            console.log(`[FMPTP FDC3] Client private channel addEventListener for event: ${event}`);
            return Promise.resolve({
              unsubscribe: async () =>
                console.log(
                  `[FMPTP FDC3] Client context listener unsubscribed for contextType: ${event}`,
                ),
            });
          },
          disconnect: async () => {
            console.log(`[FMPTP FDC3] Client private channel disconnect`);
          },
          onAddContextListener: (
            contextTypeOrHandler: string | ((context?: string) => void) | null,
            handler?: (context: Context) => void,
          ) => {
            console.log(
              `[FMPTP FDC3] Client private channel onAddContextListener for contextType: ${contextTypeOrHandler}`,
            );

            return {
              unsubscribe: async () =>
                console.log(
                  `[FMPTP FDC3] Client context listener unsubscribed for contextType: ${event}`,
                ),
            };
          },
          onUnsubscribe: () => {
            console.log(`[FMPTP FDC3] Client private channel onUnsubscribe`);
            return {
              unsubscribe: async () =>
                console.log(
                  `[FMPTP FDC3] Client context listener unsubscribed for contextType: ${event}`,
                ),
            };
          },
          onDisconnect: () => {
            console.log(`[FMPTP FDC3] Client private channel onDisconnect`);
            return {
              unsubscribe: async () =>
                console.log(
                  `[FMPTP FDC3] Client context listener unsubscribed for contextType: ${event}`,
                ),
            };
          },
          addContextListener: (
            contextTypeOrHandler: string | ((context: Context) => void) | null,
            handler?: (context: Context) => void,
          ) => {
            console.log(
              `[FMPTP FDC3] Client channel addContextListener for contextType: ${contextTypeOrHandler}`,
            );
            return Promise.resolve({
              unsubscribe: async () =>
                console.log(
                  `[FMPTP FDC3] Client channel listener unsubscribed for contextType: ${contextTypeOrHandler}`,
                ),
            });
          },
        });
      },
      getAppMetadata: (app: AppIdentifier) => {
        console.log(`[FMPTP FDC3] Client getAppMetadata for appId: ${app.appId}`);
        return Promise.resolve({
          appId: app.appId,
          name: app.appId,
          version: '1.0.0',
          description: 'Client app metadata',
        });
      },
      addEventListener: (type: FDC3EventTypes | null, handler: EventHandler): Promise<Listener> => {
        console.log(`[FMPTP FDC3] Client addEventListener for event type: ${type}`);
        return Promise.resolve({
          unsubscribe: async () =>
            console.log(`[FMPTP FDC3] Client event listener unsubscribed for event type: ${type}`),
        });
      },
    };
  }
}
