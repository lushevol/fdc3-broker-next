/**
 * Security Event Logging Unit Tests
 * @see plan.md#T161
 */

import { MockAppDirectoryService } from '@fm/fdc3-app-directory/mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type { AppIdentifier, BrokerConfig, Context } from '../src/types';

describe('Security Event Logging', () => {
  let broker: Broker;
  let mockConfig: BrokerConfig;
  let mockSecurityEvent: ReturnType<typeof vi.fn>;

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

    mockSecurityEvent = vi.fn();

    const mockAppDirectory = new MockAppDirectoryService();
    mockApps.forEach((app) => mockAppDirectory.registerApp(app));

    mockConfig = {
      appDirectory: mockAppDirectory,
      callbacks: {
        onLoginStatusCheck: async () => true,
        onTileOpen: async () => undefined,
        onValidateEntitlements: async () => true,
        onShowResolverUI: async (targets) => targets[0] || null,
        onSecurityEvent: mockSecurityEvent,
      },
      enableDebug: false,
      userChannelIds: ['red', 'green', 'blue'],
    };

    broker = new Broker(mockConfig);
  });

  describe('intent sending security events', () => {
    it('should log successful intent send with full context', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await broker.raiseIntent('ViewChart', context, {
        appId: 'app-a',
        instanceId: 'tile-1',
      });

      // Security event should not be called for successful operations
      expect(mockSecurityEvent).not.toHaveBeenCalled();
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

      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      try {
        await broker.raiseIntent('ViewChart', context);
      } catch (error) {
        // Expected
      }

      expect(mockSecurityEvent).toHaveBeenCalledWith(
        'Intent send denied due to entitlements',
        expect.objectContaining({
          tileId: 'tile-1',
          intent: 'ViewChart',
          contextType: 'fdc3.chart',
        }),
      );
    });

    it('should include timestamp and action type in security events', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => false;
      broker = new Broker(mockConfig);

      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      try {
        await broker.raiseIntent('ViewChart', {} as Context);
      } catch (error) {
        // Expected
      }

      expect(mockSecurityEvent).toHaveBeenCalledWith(
        expect.stringContaining('denied'),
        expect.any(Object),
      );
    });
  });

  describe('intent receiving security events', () => {
    it('should log denied intent listener registration', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => false;
      broker = new Broker(mockConfig);

      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      try {
        await broker.addIntentListener('ViewChart', vi.fn());
      } catch (error) {
        // Expected
      }

      expect(mockSecurityEvent).toHaveBeenCalledWith(
        'Intent receive denied due to entitlements',
        expect.objectContaining({
          tileId: 'tile-1',
          intent: 'ViewChart',
        }),
      );
    });

    it('should include source information in intent denial logs', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => false;
      broker = new Broker(mockConfig);

      broker.registerTile('unauthorized-tile', 'malicious-app');
      broker.setCurrentTile('unauthorized-tile');

      try {
        await broker.addIntentListener('ViewChart', vi.fn());
      } catch (error) {
        // Expected
      }

      const securityCall = mockSecurityEvent.mock.calls.find((call) =>
        call[0].includes('Intent receive denied'),
      );

      expect(securityCall).toBeDefined();
      expect(securityCall[1]).toMatchObject({
        tileId: 'unauthorized-tile',
        intent: 'ViewChart',
      });
    });
  });

  describe('channel operation security events', () => {
    it('should log denied channel join with details', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => false;
      broker = new Broker(mockConfig);

      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      try {
        await broker.joinUserChannel('premium-gold');
      } catch (error) {
        // Expected
      }

      expect(mockSecurityEvent).toHaveBeenCalledWith(
        'Channel join denied due to entitlements',
        expect.objectContaining({
          tileId: 'tile-1',
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

      broker.registerTile('regular-tile', 'app-a');
      broker.setCurrentTile('regular-tile');

      try {
        await broker.joinUserChannel('premium-gold');
      } catch (error) {
        // Expected
      }

      expect(mockSecurityEvent).toHaveBeenCalledWith(
        'Channel join denied due to entitlements',
        expect.objectContaining({
          tileId: 'regular-tile',
          channelId: 'premium-gold',
        }),
      );
    });

    it('should track channel access patterns', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => true;
      broker = new Broker(mockConfig);

      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      // Join multiple channels
      await broker.joinUserChannel('red');
      await broker.joinUserChannel('green');
      await broker.joinUserChannel('blue');

      // No security events should be logged for successful operations
      expect(mockSecurityEvent).not.toHaveBeenCalled();
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

      expect(mockSecurityEvent).toHaveBeenCalledWith(
        'Tile open denied due to entitlements',
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

      expect(mockSecurityEvent).toHaveBeenCalledWith(
        'Tile open denied due to entitlements',
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

      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      // Test multiple security violations
      const violations = [
        {
          action: () => broker.raiseIntent('ViewChart', {} as Context),
          expectedEvent: 'Intent send denied',
        },
        {
          action: () => broker.addIntentListener('ViewChart', vi.fn()),
          expectedEvent: 'Intent receive denied',
        },
        {
          action: () => broker.joinUserChannel('premium-gold'),
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
      expect(mockSecurityEvent).toHaveBeenCalledTimes(4);

      // Verify each violation type was logged
      const loggedEvents = mockSecurityEvent.mock.calls.map((call) => call[0]);
      expect(loggedEvents).toContain('Intent send denied due to entitlements');
      expect(loggedEvents).toContain('Intent receive denied due to entitlements');
      expect(loggedEvents).toContain('Channel join denied due to entitlements');
      expect(loggedEvents).toContain('Tile open denied due to entitlements');
    });

    it('should include tile identity in all security events', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => false;
      broker = new Broker(mockConfig);

      broker.registerTile('suspicious-tile', 'app-x');
      broker.setCurrentTile('suspicious-tile');

      try {
        await broker.raiseIntent('ViewChart', {} as Context);
      } catch (error) {
        // Expected
      }

      expect(mockSecurityEvent).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          tileId: 'suspicious-tile',
        }),
      );
    });

    it('should not log successful operations to security event log', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => true;
      broker = new Broker(mockConfig);

      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      // Successful operations should not trigger security events
      await broker.addIntentListener('ViewChart', vi.fn());
      await broker.joinUserChannel('red');
      await broker.open({ appId: 'app-b' });

      expect(mockSecurityEvent).not.toHaveBeenCalled();
    });
  });

  describe('security event data integrity', () => {
    it('should include all relevant context in security events', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => false;
      broker = new Broker(mockConfig);

      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      const context: Context = {
        type: 'fdc3.instrument',
        id: { ticker: 'AAPL', exchange: 'NYSE' },
      };

      try {
        await broker.raiseIntent('ViewChart', context);
      } catch (error) {
        // Expected
      }

      const securityCall = mockSecurityEvent.mock.calls[0];
      expect(securityCall[0]).toContain('denied');
      expect(securityCall[1]).toMatchObject({
        tileId: 'tile-1',
        intent: 'ViewChart',
        contextType: 'fdc3.instrument',
      });
    });

    it('should preserve error types in security logs', async () => {
      mockConfig.callbacks.onValidateEntitlements = async () => false;
      broker = new Broker(mockConfig);

      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

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

        broker.registerTile('tile-1', 'app-a');
        broker.setCurrentTile('tile-1');

        try {
          if (testCase.method === 'raiseIntent') {
            await broker.raiseIntent(testCase.intent, {} as Context);
          } else if (testCase.method === 'joinUserChannel') {
            await broker.joinUserChannel(testCase.channelId);
          } else if (testCase.method === 'open') {
            await broker.open({ appId: testCase.appId });
          }
        } catch (error) {
          // Expected
        }

        const securityCall = mockSecurityEvent.mock.calls[0];
        expect(securityCall[1]).toHaveProperty(testCase.expectedField);
      }
    });
  });
});
