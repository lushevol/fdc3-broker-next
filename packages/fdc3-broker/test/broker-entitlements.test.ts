/**
 * Broker Entitlement Validation Unit Tests
 * @see plan.md#T160
 */

import { MockAppDirectoryService } from '@fm/fdc3-app-directory/mock';
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
        onTileOpen: async () => undefined,
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
      broker.setCurrentTile('tile-1');

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await expect(broker.raiseIntent('ViewChart', context)).rejects.toThrow(
        'Not entitled to send this intent',
      );

      expect(mockValidateEntitlements).toHaveBeenCalledWith('tile-1', 'send-intent');
    });

    it('should allow raiseIntent when sender entitled', async () => {
      mockValidateEntitlements.mockResolvedValue(true);

      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const result = await broker.raiseIntent('ViewChart', context, {
        appId: 'app-a',
        instanceId: 'tile-1',
      });

      expect(result.source.instanceId).toBe('tile-1');
      expect(handler).toHaveBeenCalledWith(context);
    });

    it('should deny raiseIntent for specific intent types based on entitlements', async () => {
      // Allow ViewChart but deny PlaceOrder
      mockValidateEntitlements.mockImplementation(async (tileId, action) => {
        // Deny sending PlaceOrder intent
        if (action === 'send-intent') {
          // Check tile's entitlement level
          return tileId === 'premium-tile'; // Only premium tiles can send
        }
        return true;
      });

      // Regular tile cannot send
      broker.registerTile('regular-tile', 'app-a');
      broker.setCurrentTile('regular-tile');

      const context: Context = {
        type: 'fdc3.order',
        id: { orderId: '12345' },
      };

      await expect(broker.raiseIntent('PlaceOrder', context)).rejects.toThrow();

      // Premium tile can send
      broker.registerTile('premium-tile', 'app-b');
      broker.setCurrentTile('premium-tile');

      const handler = vi.fn();
      await broker.addIntentListener('PlaceOrder', handler);

      const result = await broker.raiseIntent('PlaceOrder', context, {
        appId: 'app-b',
        instanceId: 'premium-tile',
      });

      expect(result.source.instanceId).toBe('premium-tile');
    });
  });

  describe('addIntentListener() entitlement validation', () => {
    it('should deny addIntentListener when receiver not entitled', async () => {
      mockValidateEntitlements.mockResolvedValue(false);

      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      await expect(broker.addIntentListener('ViewChart', vi.fn())).rejects.toThrow(
        'Not entitled to receive this intent',
      );

      expect(mockValidateEntitlements).toHaveBeenCalledWith('tile-1', 'receive-intent');
    });

    it('should allow addIntentListener when receiver entitled', async () => {
      mockValidateEntitlements.mockResolvedValue(true);

      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      const handler = vi.fn();
      const listener = await broker.addIntentListener('ViewChart', handler);

      expect(listener).toBeDefined();
      expect(listener.unsubscribe).toBeDefined();
    });

    it('should prevent unauthorized tiles from receiving intents', async () => {
      mockValidateEntitlements.mockImplementation(async (tileId, action) => {
        if (action === 'receive-intent') {
          return tileId === 'authorized-tile';
        }
        return true;
      });

      // Unauthorized tile cannot add listener
      broker.registerTile('unauthorized-tile', 'app-a');
      broker.setCurrentTile('unauthorized-tile');

      await expect(broker.addIntentListener('ViewChart', vi.fn())).rejects.toThrow();

      // Authorized tile can add listener
      broker.registerTile('authorized-tile', 'app-b');
      broker.setCurrentTile('authorized-tile');

      const handler = vi.fn();
      const listener = await broker.addIntentListener('ViewChart', handler);

      expect(listener).toBeDefined();
    });
  });

  describe('joinUserChannel() entitlement validation', () => {
    it('should deny joinUserChannel when not entitled to channel', async () => {
      mockValidateEntitlements.mockResolvedValue(false);

      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      await expect(broker.joinUserChannel('red')).rejects.toThrow(
        'Not entitled to join this channel',
      );

      expect(mockValidateEntitlements).toHaveBeenCalledWith('tile-1', 'join-channel');
    });

    it('should allow joinUserChannel when entitled', async () => {
      mockValidateEntitlements.mockResolvedValue(true);

      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      await broker.joinUserChannel('red');

      const currentChannel = await broker.getCurrentChannel();
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
      broker.setCurrentTile('regular-tile');

      // Regular channel should work
      await broker.joinUserChannel('red');
      expect((await broker.getCurrentChannel())?.id).toBe('red');

      // Premium channel should be denied
      await expect(broker.joinUserChannel('premium-gold')).rejects.toThrow(
        'Premium subscription required for this channel',
      );
    });

    it('should allow premium channels with premium entitlement', async () => {
      mockValidateEntitlements
        .mockResolvedValueOnce(true) // Regular channel join allowed
        .mockResolvedValueOnce(true) // Premium check first part
        .mockResolvedValueOnce(true); // Premium channel allowed

      broker.registerTile('premium-tile', 'app-a');
      broker.setCurrentTile('premium-tile');

      await broker.joinUserChannel('premium-gold');

      const currentChannel = await broker.getCurrentChannel();
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
      broker.setCurrentTile('tile-1');

      // Test raiseIntent denial
      const raiseError = await broker
        .raiseIntent('ViewChart', {} as Context)
        .catch((e) => e.message);
      expect(raiseError).toBeDefined();
      expect(raiseError).not.toContain('password');
      expect(raiseError).not.toContain('token');

      // Test joinUserChannel denial
      const joinError = await broker.joinUserChannel('red').catch((e) => e.message);
      expect(joinError).toBeDefined();
      expect(joinError).not.toMatch(/password|token|secret/);
    });

    it('should log all entitlement violations', async () => {
      const mockSecurityEvent = vi.fn();
      mockConfig.callbacks.onSecurityEvent = mockSecurityEvent;
      // Create new broker with updated config
      const securityBroker = new Broker(mockConfig);
      mockValidateEntitlements.mockResolvedValue(false);

      securityBroker.registerTile('tile-1', 'app-a');
      securityBroker.setCurrentTile('tile-1');

      // Test raiseIntent security log
      try {
        await securityBroker.raiseIntent('ViewChart', {
          type: 'fdc3.chart',
          id: { ticker: 'AAPL' },
        } as Context);
      } catch (error) {
        // Expected
      }

      expect(mockSecurityEvent).toHaveBeenCalled();

      // Test joinUserChannel security log
      vi.clearAllMocks();
      mockValidateEntitlements.mockResolvedValue(false);

      try {
        await securityBroker.joinUserChannel('red');
      } catch (error) {
        // Expected
      }

      expect(mockSecurityEvent).toHaveBeenCalled();
    });
  });

  describe('entitlement validation edge cases', () => {
    it('should handle missing tile context gracefully', async () => {
      // Return false for empty tileId (simulating entitlement check failure for unknown tile)
      mockValidateEntitlements.mockResolvedValue(false);

      // No current tile set
      const context: Context = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };
      await expect(broker.raiseIntent('ViewChart', context)).rejects.toThrow(
        'Not entitled to send this intent',
      );
    });

    it('should handle validation callback errors', async () => {
      mockValidateEntitlements.mockRejectedValue(new Error('Service unavailable'));

      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      await expect(broker.raiseIntent('ViewChart', {} as Context)).rejects.toThrow(
        'Error validating entitlements',
      );
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
      brokerWithoutCallback.setCurrentTile('tile-1');

      const handler = vi.fn();
      await brokerWithoutCallback.addIntentListener('ViewChart', handler);

      expect(handler).toBeDefined();
    });
  });
});
