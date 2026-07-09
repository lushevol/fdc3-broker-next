import { MockAppDirectoryService } from '../../fdc3-app-directory/src/mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type { AppIdentifier, BrokerConfig, Context } from '../src/types';

describe('Broker PostMessage Routing', () => {
  let mockAppDirectory: MockAppDirectoryService;
  let mockConfig: BrokerConfig;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    mockAppDirectory = new MockAppDirectoryService();
    mockConfig = {
      appDirectory: mockAppDirectory,
      callbacks: {
        onLoginStatusCheck: async () => true,
        onValidateEntitlements: async () => true,
        onShowResolverUI: async (targets) => targets[0] || null,
      },
      enableDebug: false,
      enableOpenFinBridge: false,
      enablePostMessageBridge: true,
      postMessageBridgeOptions: {
        allowedOrigins: ['https://source.example'],
        contextRoutingIntents: ['scb.ViewLaunch', 'scb.ViewUpdate'],
      },
      userChannelIds: ['red', 'green', 'blue'],
    };
  });

  it('routes incoming launch/update PostMessage intents by context and opens the matching tile', async () => {
    const context: Context = {
      type: 'scb.fmptp.cashflow',
      id: { tradeId: 'TR-PM-1' },
    };
    const handler = vi.fn();
    const brokerHolder: { current?: Broker } = {};
    const onTileOpen = vi.fn(async ({ appId }: AppIdentifier) => {
      const instanceId = `${appId}-instance`;
      brokerHolder.current?.registerTile(instanceId, appId);
      await brokerHolder.current?.addIntentListener('scb.fmptp.ViewCashflows', handler, {
        appId,
        instanceId,
      });
      return {
        appId,
        instanceId,
      };
    });

    mockAppDirectory.registerApp({
      appId: 'cashflow-tile',
      name: 'Cashflow Tile',
      version: '1.0.0',
      interop: {
        intents: {
          listensFor: [
            {
              intent: 'scb.fmptp.ViewCashflows',
              contexts: ['scb.fmptp.cashflow'],
            },
          ],
        },
      },
    });

    const broker = new Broker({
      ...mockConfig,
      callbacks: {
        ...mockConfig.callbacks,
        onTileOpen,
      },
    });
    brokerHolder.current = broker;

    await vi.waitFor(() => {
      expect((broker as unknown as { postMessageBridge: { isEnabled(): boolean } | null }).postMessageBridge?.isEnabled()).toBe(true);
    });

    window.dispatchEvent(
      new MessageEvent('message', {
        origin: 'https://source.example',
        data: {
          type: 'fdc3-pm-event',
          correlationId: 'pm-launch-1',
          method: 'intentEvent',
          payload: {
            intent: 'scb.ViewLaunch',
            context,
          },
          meta: {
            timestamp: new Date().toISOString(),
            origin: 'https://source.example',
            source: {
              appId: 'standalone-demo-console',
            },
          },
        },
      }),
    );

    await vi.waitFor(() => {
      expect(onTileOpen).toHaveBeenCalledWith(expect.objectContaining({ appId: 'cashflow-tile' }));
      expect(handler).toHaveBeenCalledWith(context);
    });
  });
});
