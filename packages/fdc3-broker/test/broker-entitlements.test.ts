/**
 * Broker Entitlement Validation Unit Tests
 * @see plan.md#T160
 */

import { MockAppDirectoryService } from '../../fdc3-app-directory/src/mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type { AppIdentifier, BrokerConfig, Context } from '../src/types';

describe('Broker Entitlement Validation', () => {
  let broker: Broker;
  let mockConfig: BrokerConfig;
  let mockValidateEntitlements: ReturnType<typeof vi.fn>;

  const mockApps = [
    {
      appId: 'chart-app',
      name: 'Chart Application',
      version: '1.0.0',
      title: 'Chart App',
      description: 'Displays financial charts',
      interop: {
        intents: {
          listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
        },
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    mockValidateEntitlements = vi.fn();

    const mockAppDirectory = new MockAppDirectoryService();
    mockApps.forEach((app) => mockAppDirectory.registerApp(app));

    mockConfig = {
      appDirectory: mockAppDirectory,
      callbacks: {
        onLoginStatusCheck: async () => true,
        onTileOpen: async (app) => ({ appId: app.appId, instanceId: `${app.appId}-1` }),
        onValidateEntitlements: mockValidateEntitlements,
        onShowResolverUI: async (targets) => targets[0] || null,
        onSecurityEvent: vi.fn(),
      },
      enableDebug: false,
      userChannelIds: ['red', 'green', 'blue', 'premium-gold', 'premium-platinum'],
    };

    broker = new Broker(mockConfig);
  });

  describe('raiseIntent() entitlement validation', () => {
    it('should deny raiseIntent when sender not entitled', async () => {
      mockValidateEntitlements.mockResolvedValue(false);

      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await expect(broker.raiseIntent('ViewChart', context, undefined, source)).rejects.toThrow(
        'Not entitled to send this intent',
      );

      expect(mockValidateEntitlements).toHaveBeenCalledWith('app-a', 'send-intent');
    });

    it('should allow raiseIntent when sender entitled', async () => {
      mockValidateEntitlements.mockResolvedValue(true);

      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler, source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const result = await broker.raiseIntent(
        'ViewChart',
        context,
        {
          appId: 'app-a',
          instanceId: 'tile-1',
        },
        source,
      );

      expect(result.source.instanceId).toBe('tile-1');
      expect(handler).toHaveBeenCalledWith(context);
    });

    it('should deny raiseIntent for specific intent types based on entitlements', async () => {
      // Allow ViewChart but deny PlaceOrder
      mockValidateEntitlements.mockImplementation(async (appId, action) => {
        // Deny sending PlaceOrder intent
        if (action === 'send-intent') {
          // Check app's entitlement level - only premium-app can send
          return appId === 'premium-app';
        }
        return true;
      });

      // Register an app that handles PlaceOrder
      const mockAppDirectory = new MockAppDirectoryService();
      mockAppDirectory.registerApp({
        appId: 'app-a',
        name: 'App A',
        version: '1.0.0',
        interop: {
          intents: {
            listensFor: [{ intent: 'PlaceOrder', contexts: ['fdc3.order'] }],
          },
        },
      });
      mockAppDirectory.registerApp({
        appId: 'premium-app',
        name: 'Premium App',
        version: '1.0.0',
        interop: {
          intents: {
            listensFor: [{ intent: 'PlaceOrder', contexts: ['fdc3.order'] }],
          },
        },
      });

      const premiumBroker = new Broker({
        ...mockConfig,
        appDirectory: mockAppDirectory,
      });

      // Regular app cannot send
      premiumBroker.registerTile('regular-tile', 'app-a');
      const regularSource = { appId: 'app-a', instanceId: 'regular-tile' };

      const context: Context = {
        type: 'fdc3.order',
        id: { orderId: '12345' },
      };

      await expect(
        premiumBroker.raiseIntent('PlaceOrder', context, undefined, regularSource),
      ).rejects.toThrow();

      // Premium app can send
      premiumBroker.registerTile('premium-tile', 'premium-app');
      const premiumSource = { appId: 'premium-app', instanceId: 'premium-tile' };

      const handler = vi.fn();
      await premiumBroker.addIntentListener('PlaceOrder', handler, premiumSource);

      const result = await premiumBroker.raiseIntent(
        'PlaceOrder',
        context,
        {
          appId: 'premium-app',
          instanceId: 'premium-tile',
        },
        premiumSource,
      );

      expect(result.source.instanceId).toBe('premium-tile');
    });
  });

  describe('addIntentListener() entitlement validation', () => {
    it('should deny addIntentListener when receiver not entitled', async () => {
      mockValidateEntitlements.mockResolvedValue(false);

      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      await expect(broker.addIntentListener('ViewChart', vi.fn(), source)).rejects.toThrow(
        'Not entitled to receive this intent',
      );

      expect(mockValidateEntitlements).toHaveBeenCalledWith('app-a', 'receive-intent');
    });

    it('should allow addIntentListener when receiver entitled', async () => {
      mockValidateEntitlements.mockResolvedValue(true);

      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const handler = vi.fn();
      const listener = await broker.addIntentListener('ViewChart', handler, source);

      expect(listener).toBeDefined();
      expect(listener.unsubscribe).toBeDefined();
    });

    it('should prevent unauthorized tiles from receiving intents', async () => {
      mockValidateEntitlements.mockImplementation(async (appId, action) => {
        if (action === 'receive-intent') {
          // Only authorized-app can receive intents
          return appId === 'authorized-app';
        }
        return true;
      });

      // Unauthorized tile cannot add listener
      broker.registerTile('unauthorized-tile', 'app-a');
      const unauthorizedSource = { appId: 'app-a', instanceId: 'unauthorized-tile' };

      await expect(
        broker.addIntentListener('ViewChart', vi.fn(), unauthorizedSource),
      ).rejects.toThrow();

      // Authorized tile can add listener
      broker.registerTile('authorized-tile', 'authorized-app');
      const authorizedSource = { appId: 'authorized-app', instanceId: 'authorized-tile' };

      const handler = vi.fn();
      const listener = await broker.addIntentListener('ViewChart', handler, authorizedSource);

      expect(listener).toBeDefined();
    });
  });

  describe('joinUserChannel() entitlement validation', () => {
    it('should deny joinUserChannel when not entitled to channel', async () => {
      mockValidateEntitlements.mockResolvedValue(false);

      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      await expect(broker.joinUserChannel('red', source)).rejects.toThrow(
        'Not entitled to join this channel',
      );

      expect(mockValidateEntitlements).toHaveBeenCalledWith('app-a', 'join-channel');
    });

    it('should allow joinUserChannel when entitled', async () => {
      mockValidateEntitlements.mockResolvedValue(true);

      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      await broker.joinUserChannel('red', source);

      const currentChannel = await broker.getCurrentChannel(source);
      expect(currentChannel?.id).toBe('red');
    });

    it('should deny premium channels without premium entitlement', async () => {
      // Premium channel check calls onValidateEntitlements twice:
      // 1. First with "join-channel" for regular check
      // 2. Then with "join-premium-channel" for premium check
      mockValidateEntitlements
        .mockResolvedValueOnce(true) // Regular channel join allowed
        .mockResolvedValueOnce(true) // Premium check first part (join-channel for premium)
        .mockResolvedValueOnce(false); // Premium channel denied

      broker.registerTile('regular-tile', 'app-a');
      const regularSource = { appId: 'app-a', instanceId: 'regular-tile' };

      // Regular channel should work
      await broker.joinUserChannel('red', regularSource);
      expect((await broker.getCurrentChannel(regularSource))?.id).toBe('red');

      // Premium channel should be denied
      await expect(broker.joinUserChannel('premium-gold', regularSource)).rejects.toThrow(
        'Premium subscription required for this channel',
      );
    });

    it('should allow premium channels with premium entitlement', async () => {
      mockValidateEntitlements
        .mockResolvedValueOnce(true) // Regular channel join allowed
        .mockResolvedValueOnce(true) // Premium check first part
        .mockResolvedValueOnce(true); // Premium channel allowed

      broker.registerTile('premium-tile', 'app-a');
      const premiumSource = { appId: 'app-a', instanceId: 'premium-tile' };

      await broker.joinUserChannel('premium-gold', premiumSource);

      const currentChannel = await broker.getCurrentChannel(premiumSource);
      expect(currentChannel?.id).toBe('premium-gold');
    });
  });

  describe('open() entitlement validation', () => {
    it('should deny open when not entitled to tile', async () => {
      mockValidateEntitlements.mockResolvedValue(false);

      const app: AppIdentifier = { appId: 'restricted-app' };

      await expect(broker.open(app)).rejects.toThrow('Not entitled to open this application');

      expect(mockValidateEntitlements).toHaveBeenCalledWith('restricted-app', 'open');
    });

    it('should allow open when entitled to tile', async () => {
      mockValidateEntitlements.mockResolvedValue(true);

      const app: AppIdentifier = { appId: 'chart-app' };
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const result = await broker.open(app, context);

      expect(result.appId).toBe('chart-app');
    });

    it('should deny launching restricted applications', async () => {
      mockValidateEntitlements.mockImplementation(async (appId, action) => {
        if (action === 'open') {
          // Only allow opening 'public-app'
          return appId === 'public-app';
        }
        return true;
      });

      // Restricted app cannot be opened
      await expect(broker.open({ appId: 'restricted-app' })).rejects.toThrow();

      // Public app can be opened
      const result = await broker.open({ appId: 'public-app' });
      expect(result.appId).toBe('public-app');
    });

    it('should check login status before entitlements', async () => {
      const mockLoginCheck = vi.fn().mockResolvedValue(false);
      mockConfig.callbacks.onLoginStatusCheck = mockLoginCheck;
      mockValidateEntitlements.mockResolvedValue(true);

      broker = new Broker(mockConfig);

      await expect(broker.open({ appId: 'any-app' })).rejects.toThrow('User not logged in');

      expect(mockLoginCheck).toHaveBeenCalled();
      expect(mockValidateEntitlements).not.toHaveBeenCalled();
    });
  });

  describe('entitlement denial behavior', () => {
    it('should include helpful error messages without exposing sensitive data', async () => {
      mockValidateEntitlements.mockResolvedValue(false);

      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      // Test raiseIntent denial
      const raiseError = await broker
        .raiseIntent('ViewChart', {} as Context, undefined, source)
        .catch((e) => e.message);
      expect(raiseError).toBeDefined();
      expect(raiseError).not.toContain('password');
      expect(raiseError).not.toContain('token');

      // Test joinUserChannel denial
      const joinError = await broker.joinUserChannel('red', source).catch((e) => e.message);
      expect(joinError).toBeDefined();
      expect(joinError).not.toMatch(/password|token|secret/);
    });

    it('should log all entitlement violations', async () => {
      // Capture security events via console.warn since logger.security uses it
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockConfig.callbacks.onSecurityEvent = vi.fn();
      // Create new broker with updated config
      const securityBroker = new Broker(mockConfig);
      mockValidateEntitlements.mockResolvedValue(false);

      securityBroker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      // Test raiseIntent security log
      try {
        await securityBroker.raiseIntent(
          'ViewChart',
          {
            type: 'fdc3.chart',
            id: { ticker: 'AAPL' },
          } as Context,
          undefined,
          source,
        );
      } catch (error) {
        // Expected
      }

      // Verify security event was logged via console.warn
      expect(warnSpy).toHaveBeenCalledWith(
        '[FDC3:SECURITY] Intent send denied due to entitlements',
        expect.anything(),
      );

      // Test joinUserChannel security log
      vi.clearAllMocks();
      warnSpy.mockClear();
      mockValidateEntitlements.mockResolvedValue(false);

      try {
        await securityBroker.joinUserChannel('red', source);
      } catch (error) {
        // Expected
      }

      expect(warnSpy).toHaveBeenCalledWith(
        '[FDC3:SECURITY] Channel join denied due to entitlements',
        expect.anything(),
      );

      warnSpy.mockRestore();
    });
  });

  describe('entitlement validation edge cases', () => {
    it('should handle missing tile context gracefully', async () => {
      // Return false for empty tileId (simulating entitlement check failure for unknown tile)
      mockValidateEntitlements.mockResolvedValue(false);

      // No current tile set - passing empty source should fail
      const context: Context = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };
      await expect(
        broker.raiseIntent('ViewChart', context, undefined, { appId: '', instanceId: '' }),
      ).rejects.toThrow('Not entitled to send this intent');
    });

    it('should handle validation callback errors', async () => {
      mockValidateEntitlements.mockRejectedValue(new Error('Service unavailable'));

      broker.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      await expect(
        broker.raiseIntent('ViewChart', {} as Context, undefined, source),
      ).rejects.toThrow('Error validating entitlements');
    });

    it('should work without entitlement validation callback', async () => {
      const configWithoutCallback = {
        ...mockConfig,
        callbacks: {
          ...mockConfig.callbacks,
          onValidateEntitlements: undefined,
        },
      };
      const brokerWithoutCallback = new Broker(configWithoutCallback);

      brokerWithoutCallback.registerTile('tile-1', 'app-a');
      const source = { appId: 'app-a', instanceId: 'tile-1' };

      const handler = vi.fn();
      await brokerWithoutCallback.addIntentListener('ViewChart', handler, source);

      expect(handler).toBeDefined();
    });
  });
});
