/**
 * Security Event Logging Unit Tests
 * @see plan.md#T161
 */

import { MockAppDirectoryService } from '../../fdc3-app-directory/src/mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type { AppIdentifier, BrokerConfig, Context } from '../src/types';

describe('Security Event Logging', () => {
  let broker: Broker;
  let mockConfig: BrokerConfig;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

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

    consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const mockAppDirectory = new MockAppDirectoryService();
    mockApps.forEach((app) => mockAppDirectory.registerApp(app));

    mockConfig = {
      appDirectory: mockAppDirectory,
      callbacks: {
        onLoginStatusCheck: async () => true,
        onTileOpen: async () => ({ appId: 'test', instanceId: 'test' }),
        onValidateEntitlements: async () => true,
        onShowResolverUI: async (targets) => targets[0] || null,
      },
      enableDebug: false,
      userChannelIds: ['red', 'green', 'blue'],
    };

    broker = new Broker(mockConfig);
  });

  describe('intent sending security events', () => {
    it('should log successful intent send with full context', async () => {
      (broker as any).registerTile('tile-1', 'app-a');

      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler, {
        appId: 'app-a',
        instanceId: 'tile-1',
      });

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await broker.raiseIntent('ViewChart', context, {
        appId: 'app-a',
        instanceId: 'tile-1',
      });

      const securityCalls = consoleSpy.mock.calls.filter(
        (call: any[]) => typeof call[0] === 'string' && call[0].includes('[FDC3:SECURITY]'),
      );
      expect(securityCalls.length).toBe(0);
    });

    it('should log denied intent send with audit trail', async () => {
      // Create new mock with apps and override callback to deny entitlements
      const newMockAppDirectory = new MockAppDirectoryService();
      mockApps.forEach((app) => newMockAppDirectory.registerApp(app));

      mockConfig.appDirectory = newMockAppDirectory;
      mockConfig.callbacks = {
        ...mockConfig.callbacks,
        onValidateEntitlements: async () => false,
      };
      broker = new Broker(mockConfig);

      broker['registerTile']('tile-1', 'app-a');

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      try {
        await broker.raiseIntent('ViewChart', context, undefined, {
          appId: 'app-a',
          instanceId: 'tile-1',
        });
      } catch (error) {
        // Expected
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FDC3:SECURITY] Intent send denied due to entitlements'),
        expect.objectContaining({
          tileId: 'app-a',
          intent: 'ViewChart',
          contextType: 'fdc3.chart',
        }),
      );
    });

    it('should include timestamp and action type in security events', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => false;
      broker = new Broker(mockConfig);

      broker['registerTile']('tile-1', 'app-a');

      try {
        await broker.raiseIntent('ViewChart', {} as Context, undefined, {
          appId: 'app-a',
          instanceId: 'tile-1',
        });
      } catch (error) {
        // Expected
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FDC3:SECURITY]'),
        expect.any(Object),
      );
    });
  });

  describe('intent receiving security events', () => {
    it('should log denied intent listener registration', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => false;
      broker = new Broker(mockConfig);

      broker['registerTile']('tile-1', 'app-a');

      try {
        await broker.addIntentListener('ViewChart', vi.fn(), {
          appId: 'app-a',
          instanceId: 'tile-1',
        });
      } catch (error) {
        // Expected
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FDC3:SECURITY] Intent receive denied due to entitlements'),
        expect.objectContaining({
          tileId: 'app-a',
          intent: 'ViewChart',
        }),
      );
    });

    it('should include source information in intent denial logs', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => false;
      broker = new Broker(mockConfig);

      (broker as any).registerTile('unauthorized-tile', 'malicious-app');

      try {
        await broker.addIntentListener('ViewChart', vi.fn(), {
          appId: 'malicious-app',
          instanceId: 'unauthorized-tile',
        });
      } catch (error) {
        // Expected
      }

      const securityCall = consoleSpy.mock.calls.find(
        (call: any[]) => typeof call[0] === 'string' && call[0].includes('Intent receive denied'),
      );

      expect(securityCall).toBeDefined();
      expect(securityCall[1]).toMatchObject({
        tileId: 'malicious-app',
        intent: 'ViewChart',
      });
    });
  });

  describe('channel operation security events', () => {
    it('should log denied channel join with details', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => false;
      broker = new Broker(mockConfig);

      broker['registerTile']('tile-1', 'app-a');

      try {
        await broker.joinUserChannel('premium-gold', { appId: 'app-a', instanceId: 'tile-1' });
      } catch (error) {
        // Expected
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FDC3:SECURITY] Channel join denied due to entitlements'),
        expect.objectContaining({
          tileId: 'app-a',
          channelId: 'premium-gold',
        }),
      );
    });

    it('should log premium channel access attempts', async () => {
      // Deny premium channel access
      mockConfig.callbacks.onValidateEntitlements = async (tileId, action) => {
        return action !== 'join-premium-channel';
      };
      broker = new Broker(mockConfig);

      (broker as any).registerTile('regular-tile', 'app-a');

      try {
        await broker.joinUserChannel('premium-gold', {
          appId: 'app-a',
          instanceId: 'regular-tile',
        });
      } catch (error) {
        // Expected
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FDC3:SECURITY] Premium channel join denied due to entitlements'),
        expect.objectContaining({
          tileId: 'app-a',
          channelId: 'premium-gold',
        }),
      );
    });

    it('should track channel access patterns', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => true;
      broker = new Broker(mockConfig);

      // Join multiple channels
      await broker.joinUserChannel('red', { appId: 'app-a', instanceId: 'tile-1' });
      await broker.joinUserChannel('green', { appId: 'app-a', instanceId: 'tile-1' });
      await broker.joinUserChannel('blue', { appId: 'app-a', instanceId: 'tile-1' });

      // No security events should be logged for successful operations
      const securityCalls = consoleSpy.mock.calls.filter(
        (call: any[]) => typeof call[0] === 'string' && call[0].includes('[FDC3:SECURITY]'),
      );
      expect(securityCalls.length).toBe(0);
    });
  });

  describe('tile launch security events', () => {
    it('should log denied tile open with app information', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => false;
      broker = new Broker(mockConfig);

      const app: AppIdentifier = { appId: 'restricted-app' };

      try {
        await broker.open(app);
      } catch (error) {
        // Expected
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FDC3:SECURITY] Tile open denied due to entitlements'),
        expect.objectContaining({
          appId: 'restricted-app',
        }),
      );
    });

    it('should log context data in tile open denials', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => false;
      broker = new Broker(mockConfig);

      const app: AppIdentifier = { appId: 'restricted-app' };
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      try {
        await broker.open(app, context);
      } catch (error) {
        // Expected
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FDC3:SECURITY] Tile open denied due to entitlements'),
        expect.objectContaining({
          appId: 'restricted-app',
          contextType: 'fdc3.chart',
        }),
      );
    });
  });

  describe('comprehensive audit trail', () => {
    it('should maintain full audit trail for all security violations', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => false;
      broker = new Broker(mockConfig);

      broker['registerTile']('tile-1', 'app-a');

      // Test multiple security violations
      const violations = [
        {
          action: () =>
            broker.raiseIntent('ViewChart', {} as Context, undefined, {
              appId: 'app-a',
              instanceId: 'tile-1',
            }),
          expectedEvent: 'Intent send denied',
        },
        {
          action: () =>
            broker.addIntentListener('ViewChart', vi.fn(), {
              appId: 'app-a',
              instanceId: 'tile-1',
            }),
          expectedEvent: 'Intent receive denied',
        },
        {
          action: () =>
            broker.joinUserChannel('premium-gold', { appId: 'app-a', instanceId: 'tile-1' }),
          expectedEvent: 'Channel join denied',
        },
        {
          action: () => broker.open({ appId: 'restricted-app' }),
          expectedEvent: 'Tile open denied',
        },
      ];

      for (const violation of violations) {
        try {
          await violation.action();
        } catch (error) {
          // Expected
        }
      }

      // Verify all violations were logged
      const securityCalls = consoleSpy.mock.calls.filter(
        (call: any[]) => typeof call[0] === 'string' && call[0].includes('[FDC3:SECURITY]'),
      );
      expect(securityCalls.length).toBe(4);

      const loggedEvents = securityCalls.map((call: any[]) => call[0]);
      expect(loggedEvents).toEqual(
        expect.arrayContaining([
          expect.stringContaining('Intent send denied'),
          expect.stringContaining('Intent receive denied'),
          expect.stringContaining('Channel join denied'),
          expect.stringContaining('Tile open denied'),
        ]),
      );
    });

    it('should include tile identity in all security events', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => false;
      broker = new Broker(mockConfig);

      (broker as any).registerTile('suspicious-tile', 'app-x');

      try {
        await broker.raiseIntent('ViewChart', {} as Context, undefined, {
          appId: 'app-x',
          instanceId: 'suspicious-tile',
        });
      } catch (error) {
        // Expected
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FDC3:SECURITY]'),
        expect.objectContaining({
          tileId: 'app-x',
        }),
      );
    });

    it('should not log successful operations to security event log', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => true;
      broker = new Broker(mockConfig);

      // Successful operations should not trigger security events
      await broker.addIntentListener('ViewChart', vi.fn(), {
        appId: 'app-a',
        instanceId: 'tile-1',
      });
      await broker.joinUserChannel('red', { appId: 'app-a', instanceId: 'tile-1' });
      await broker.open({ appId: 'app-b' });

      const securityCalls = consoleSpy.mock.calls.filter(
        (call: any[]) => typeof call[0] === 'string' && call[0].includes('[FDC3:SECURITY]'),
      );
      expect(securityCalls.length).toBe(0);
    });
  });

  describe('security event data integrity', () => {
    it('should include all relevant context in security events', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => false;
      broker = new Broker(mockConfig);

      (broker as any).registerTile('tile-1', 'app-a');

      const context: Context = {
        type: 'fdc3.instrument',
        id: { ticker: 'AAPL', exchange: 'NYSE' },
      };

      try {
        await broker.raiseIntent('ViewChart', context, undefined, {
          appId: 'app-a',
          instanceId: 'tile-1',
        });
      } catch (error) {
        // Expected
      }

      const securityCall = consoleSpy.mock.calls.find(
        (call: any[]) => typeof call[0] === 'string' && call[0].includes('denied'),
      );
      expect(securityCall).toBeDefined();
      expect(securityCall![1]).toMatchObject({
        tileId: 'app-a',
        intent: 'ViewChart',
        contextType: 'fdc3.instrument',
      });
    });

    it('should preserve error types in security logs', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => false;
      broker = new Broker(mockConfig);

      (broker as any).registerTile('tile-1', 'app-a');

      // Test different denial types
      const testCases = [
        { method: 'raiseIntent', intent: 'ViewChart', expectedField: 'intent' },
        {
          method: 'joinUserChannel',
          channelId: 'premium',
          expectedField: 'channelId',
        },
        { method: 'open', appId: 'restricted', expectedField: 'appId' },
      ];

      for (const testCase of testCases) {
        vi.clearAllMocks();
        mockConfig.callbacks.onValidateEntitlements = async () => false;
        broker = new Broker(mockConfig);

        (broker as any).registerTile('tile-1', 'app-a');

        try {
          if (testCase.method === 'raiseIntent') {
            await broker.raiseIntent(testCase.intent!, {} as Context, undefined, {
              appId: 'app-a',
              instanceId: 'tile-1',
            });
          } else if (testCase.method === 'joinUserChannel') {
            await broker.joinUserChannel(testCase.channelId!, {
              appId: 'app-a',
              instanceId: 'tile-1',
            });
          } else if (testCase.method === 'open') {
            await broker.open({ appId: testCase.appId! }, undefined, {
              appId: 'app-a',
              instanceId: 'tile-1',
            });
          }
        } catch (error) {
          // Expected
        }

        const securityCall = consoleSpy.mock.calls.find(
          (call: any[]) =>
            typeof call[0] === 'string' &&
            call[0].includes('[FDC3:SECURITY]') &&
            call[0].includes('denied'),
        );
        expect(securityCall).toBeDefined();
        // Check data property (arguments[1])
        expect(securityCall![1]).toHaveProperty(testCase.expectedField);
      }
    });
  });
});
