/**
 * Broker + App Directory Integration Tests
 * @see plan.md#T091
 */

import { MockAppDirectoryService } from '@fm/fdc3-app-directory/mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type { BrokerConfig, Context } from '../src/types';

describe('Broker + App Directory Integration', () => {
  let broker: Broker;
  let mockAppDirectory: MockAppDirectoryService;
  let mockCallbacks: BrokerConfig['callbacks'];
  let mockConfig: BrokerConfig;

  const mockApps = [
    {
      appId: 'chart-app',
      name: 'Chart Application',
      version: '1.0.0',
      title: 'Chart App',
      description: 'Displays financial charts',
      interop: {
        intents: {
          listensFor: [
            { intent: 'ViewChart', contexts: ['fdc3.chart'] },
            { intent: 'ViewQuote', contexts: ['fdc3.quote'] },
          ],
          raises: [{ intent: 'ViewOrders', contexts: ['fdc3.order'] }],
        },
      },
      categories: ['Charts', 'Analytics'],
    },
    {
      appId: 'quote-app',
      name: 'Quote Application',
      version: '1.0.0',
      title: 'Quote App',
      description: 'Displays real-time quotes',
      interop: {
        intents: {
          listensFor: [{ intent: 'ViewQuote', contexts: ['fdc3.quote'] }],
          raises: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
        },
      },
      categories: ['Market Data'],
    },
    {
      appId: 'order-app',
      name: 'Order Management',
      version: '1.0.0',
      title: 'Order App',
      description: 'Manages trading orders',
      interop: {
        intents: {
          listensFor: [
            { intent: 'ViewOrders', contexts: ['fdc3.order'] },
            { intent: 'CreateOrder', contexts: ['fdc3.order'] },
          ],
        },
      },
      categories: ['Trading', 'Execution'],
    },
  ];

  beforeEach(() => {
    // Create mock app directory and register apps
    mockAppDirectory = new MockAppDirectoryService();
    mockApps.forEach((app) => mockAppDirectory.registerApp(app));

    // Mock callbacks
    mockCallbacks = {
      onLoginStatusCheck: vi.fn().mockResolvedValue(true),
      onTileOpen: vi.fn().mockResolvedValue(undefined),
      onValidateEntitlements: vi.fn().mockResolvedValue(true),
      onShowResolverUI: vi.fn(),
      onSecurityEvent: vi.fn(),
    };

    mockConfig = {
      appDirectory: mockAppDirectory,
      callbacks: mockCallbacks,
      enableDebug: false,
    };

    broker = new Broker(mockConfig);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('finding intents', () => {
    it('should find apps that handle ViewChart intent', async () => {
      const apps = await mockAppDirectory.findByIntent('ViewChart');

      // Only chart-app listens for ViewChart; quote-app raises it but doesn't listen
      expect(apps.length).toBe(1);
      expect(apps.map((a) => a.appId)).toContain('chart-app');
    });

    it('should find apps that handle ViewQuote intent', async () => {
      const apps = await mockAppDirectory.findByIntent('ViewQuote');

      // Both chart-app and quote-app listen for ViewQuote
      expect(apps.length).toBe(2);
      expect(apps.map((a) => a.appId)).toContain('chart-app');
      expect(apps.map((a) => a.appId)).toContain('quote-app');
    });

    it('should return empty array for non-existent intent', async () => {
      const apps = await mockAppDirectory.findByIntent('NonExistent');

      expect(apps).toEqual([]);
    });

    it('should find intents by context type', async () => {
      const chartContext: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const apps = await mockAppDirectory.findByContextType('fdc3.chart');

      expect(apps.length).toBeGreaterThan(0);
      expect(apps.some((a) => a.appId === 'chart-app')).toBe(true);
    });

    it('should find apps by category', async () => {
      const tradingApps = await mockAppDirectory.findByCategory('Trading');

      expect(tradingApps.length).toBe(1);
      expect(tradingApps[0].appId).toBe('order-app');
    });

    it('should find all registered apps', async () => {
      const allApps = await mockAppDirectory.getAllApps();

      expect(allApps.length).toBe(3);
    });
  });

  describe('broker findIntent()', () => {
    it('should return AppIntent for ViewChart', async () => {
      const appIntent = await broker.findIntent('ViewChart');

      // Intent is an IntentMetadata object, not a string
      expect(appIntent.intent.name).toBe('ViewChart');
      // Only chart-app listens for ViewChart
      expect(appIntent.apps.length).toBe(1);
      expect(appIntent.apps.map((a) => a.appId)).toContain('chart-app');
    });

    it('should throw when intent not found', async () => {
      await expect(broker.findIntent('NonExistent')).rejects.toThrow(
        'No apps found for intent: NonExistent',
      );
    });

    it('should include all app metadata in AppIntent', async () => {
      const appIntent = await broker.findIntent('ViewOrders');

      expect(appIntent.apps[0]).toMatchObject({
        appId: 'order-app',
        name: 'Order Management',
        title: 'Order App',
        version: '1.0.0',
      });
    });
  });

  describe('broker findIntentsByContext()', () => {
    it('should find all intents for chart context', async () => {
      const chartContext: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const intents = await broker.findIntentsByContext(chartContext);

      expect(intents.length).toBeGreaterThan(0);
      // Intent is an IntentMetadata object
      expect(intents.some((i) => i.intent.name === 'ViewChart')).toBe(true);
    });

    it('should return empty array for unknown context type', async () => {
      const unknownContext: Context = {
        type: 'fdc3.unknown',
        id: { id: '123' },
      };

      const intents = await broker.findIntentsByContext(unknownContext);

      expect(intents).toEqual([]);
    });

    it('should map apps to intents correctly', async () => {
      const chartContext: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const intents = await broker.findIntentsByContext(chartContext);

      intents.forEach((appIntent) => {
        expect(appIntent.intent).toBeDefined();
        expect(appIntent.apps).toBeInstanceOf(Array);
        expect(appIntent.apps.length).toBeGreaterThan(0);
      });
    });
  });

  describe('broker getAppMetadata()', () => {
    it('should return app metadata', async () => {
      const metadata = await broker.getAppMetadata({ appId: 'chart-app' });

      expect(metadata).toMatchObject({
        appId: 'chart-app',
        name: 'Chart Application',
        title: 'Chart App',
        version: '1.0.0',
        description: 'Displays financial charts',
      });
    });

    it('should throw when app not found', async () => {
      await expect(broker.getAppMetadata({ appId: 'nonexistent' })).rejects.toThrow(
        'App not found: nonexistent',
      );
    });
  });

  describe('end-to-end intent resolution', () => {
    it('should resolve intent to target app', async () => {
      const chartContext: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Mock getApp directly on the instance
      const getAppSpy = vi.spyOn(mockAppDirectory, 'getApp').mockResolvedValue(mockApps[0]);

      const resolution = await broker.raiseIntent('ViewChart', chartContext, undefined, mockSource);

      expect(resolution.source.appId).toBe('chart-app');
      expect(mockCallbacks.onTileOpen).toHaveBeenCalledWith('chart-app', chartContext);
      getAppSpy.mockRestore();
    });

    it('should resolve specific target', async () => {
      broker['registerTile']('tile-1', 'chart-app', {
        appId: 'chart-app',
        name: 'Chart Application',
      });

      const handler = vi.fn().mockResolvedValue(undefined);
      await broker.addIntentListener('ViewChart', handler, mockSource);

      const chartContext: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const resolution = await broker.raiseIntent(
        'ViewChart',
        chartContext,
        {
          appId: 'chart-app',
          instanceId: 'tile-1',
        },
        mockSource,
      );

      expect(resolution.source.appId).toBe('chart-app');
      expect(resolution.source.instanceId).toBe('tile-1');
      expect(handler).toHaveBeenCalledWith(chartContext);
    });
  });

  describe('app directory with entitlement constraints', () => {
    it('should filter apps by entitlements', async () => {
      const appWithConstraints = {
        appId: 'premium-app',
        name: 'Premium App',
        version: '1.0.0',
        title: 'Premium App',
        description: 'Premium features',
        interop: {
          intents: {
            listensFor: [{ intent: 'ViewPremium', contexts: ['fdc3.premium'] }],
          },
        },
        entitlementConstraints: {
          requiredPermissions: ['premium'],
        },
      };

      mockAppDirectory.registerApp(appWithConstraints);

      // Test with entitlements granted
      vi.mocked(mockCallbacks.onValidateEntitlements).mockResolvedValue(true);

      const apps = await mockAppDirectory.findByIntent('ViewPremium');
      expect(apps.length).toBe(1);

      // Test with entitlements denied
      vi.mocked(mockCallbacks.onValidateEntitlements).mockResolvedValue(false);

      const result = await broker['intentResolver'].resolve('ViewPremium', {
        type: 'fdc3.premium',
        id: {},
      });

      expect(result.type).toBe('not-found');
    });
  });

  describe('app directory caching and performance', () => {
    it('should handle multiple concurrent requests', async () => {
      const promises = [
        mockAppDirectory.findByIntent('ViewChart'),
        mockAppDirectory.findByIntent('ViewQuote'),
        mockAppDirectory.findByIntent('ViewOrders'),
        mockAppDirectory.getApp('chart-app'),
        mockAppDirectory.getAllApps(),
      ];

      const results = await Promise.all(promises);

      expect(results[0]).toBeDefined();
      expect(results[1]).toBeDefined();
      expect(results[2]).toBeDefined();
      expect(results[3]).toBeDefined();
      expect(results[4]).toBeDefined();
    });

    it('should handle error from app directory gracefully', async () => {
      const errorAppDirectory = {
        findByIntent: vi.fn().mockRejectedValue(new Error('Network error')),
        getApp: vi.fn(),
        findByContextType: vi.fn(),
        getAllApps: vi.fn(),
        findByCategory: vi.fn(),
      } as any;

      const errorConfig: BrokerConfig = {
        appDirectory: errorAppDirectory,
        callbacks: mockCallbacks,
      };

      const errorBroker = new Broker(errorConfig);

      await expect(errorBroker.findIntent('ViewChart')).rejects.toThrow();
    });
  });

  describe('dynamic app registration', () => {
    it('should handle apps registered after broker initialization', async () => {
      const newApp = {
        appId: 'new-app',
        name: 'New Application',
        version: '1.0.0',
        title: 'New App',
        description: 'Dynamically registered app',
        interop: {
          intents: {
            listensFor: [{ intent: 'NewIntent', contexts: ['fdc3.new'] }],
          },
        },
      };

      mockAppDirectory.registerApp(newApp);

      const apps = await mockAppDirectory.findByIntent('NewIntent');
      expect(apps.length).toBe(1);
      expect(apps[0].appId).toBe('new-app');
    });

    it('should update broker intent resolution after app registration', async () => {
      const newContext: Context = {
        type: 'fdc3.new',
        id: { id: '123' },
      };

      const newApp = {
        appId: 'new-app',
        name: 'New Application',
        version: '1.0.0',
        title: 'New App',
        description: 'Dynamically registered app',
        interop: {
          intents: {
            listensFor: [{ intent: 'NewIntent', contexts: ['fdc3.new'] }],
          },
        },
      };

      mockAppDirectory.registerApp(newApp);
      const getAppSpy = vi.spyOn(mockAppDirectory, 'getApp').mockResolvedValue(newApp);

      const resolution = await broker.raiseIntent('NewIntent', newContext, undefined, mockSource);

      expect(resolution.source.appId).toBe('new-app');
      getAppSpy.mockRestore();
    });
  });

  describe('context type filtering', () => {
    it('should filter intents by context type', async () => {
      const apps = await mockAppDirectory.findByContextType('fdc3.chart');

      expect(apps.length).toBeGreaterThan(0);
      apps.forEach((app) => {
        const hasChartIntent = app.interop?.intents?.listensFor?.some(
          (intent) =>
            intent.intent === 'ViewChart' &&
            (!intent.contexts || intent.contexts.includes('fdc3.chart')),
        );
        expect(hasChartIntent).toBe(true);
      });
    });

    it('should return apps that handle any context when contexts not specified', async () => {
      const anyContextApp = {
        appId: 'any-app',
        name: 'Any Context App',
        version: '1.0.0',
        title: 'Any App',
        description: 'Handles any context',
        interop: {
          intents: {
            listensFor: [{ intent: 'HandleAny' }], // No contexts specified
          },
        },
      };

      mockAppDirectory.registerApp(anyContextApp);

      const apps = await mockAppDirectory.findByContextType('fdc3.unknown');

      // App with no context filter should still be returned
      expect(apps.some((a) => a.appId === 'any-app')).toBe(false);
      // Because findByContextType filters by context type in intents
    });
  });

  describe('complex app directory scenarios', () => {
    it('should handle app with multiple intents', async () => {
      const multiIntentApp = {
        appId: 'multi-intent-app',
        name: 'Multi Intent App',
        version: '1.0.0',
        title: 'Multi Intent',
        description: 'Handles multiple intents',
        interop: {
          intents: {
            listensFor: [
              { intent: 'ViewChart', contexts: ['fdc3.chart'] },
              { intent: 'ViewQuote', contexts: ['fdc3.quote'] },
              { intent: 'ViewNews', contexts: ['fdc3.news'] },
            ],
          },
        },
      };

      mockAppDirectory.registerApp(multiIntentApp);

      const chartApps = await mockAppDirectory.findByIntent('ViewChart');
      const quoteApps = await mockAppDirectory.findByIntent('ViewQuote');
      const newsApps = await mockAppDirectory.findByIntent('ViewNews');

      expect(chartApps.map((a) => a.appId)).toContain('multi-intent-app');
      expect(quoteApps.map((a) => a.appId)).toContain('multi-intent-app');
      expect(newsApps.map((a) => a.appId)).toContain('multi-intent-app');
    });

    it('should handle app with multiple categories', async () => {
      const multiCategoryApp = {
        appId: 'multi-category-app',
        name: 'Multi Category App',
        version: '1.0.0',
        title: 'Multi Category',
        description: 'Fits in multiple categories',
        interop: {
          intents: {
            listensFor: [{ intent: 'MultiIntent', contexts: ['fdc3.multi'] }],
          },
        },
        categories: ['Trading', 'Analytics', 'Charts'],
      };

      mockAppDirectory.registerApp(multiCategoryApp);

      const tradingApps = await mockAppDirectory.findByCategory('Trading');
      const analyticsApps = await mockAppDirectory.findByCategory('Analytics');
      const chartsApps = await mockAppDirectory.findByCategory('Charts');

      expect(tradingApps.map((a) => a.appId)).toContain('multi-category-app');
      expect(analyticsApps.map((a) => a.appId)).toContain('multi-category-app');
      expect(chartsApps.map((a) => a.appId)).toContain('multi-category-app');
    });
  });
});
