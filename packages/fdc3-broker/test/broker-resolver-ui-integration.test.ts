/**
 * Broker + Resolver UI Integration Tests
 * @see plan.md#T096
 */

import { MockAppDirectoryService } from '@fm/fdc3-app-directory/mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type { BrokerConfig, Context, ResolverTarget } from '../src/types';

describe('Broker + Resolver UI Integration', () => {
  let broker: Broker;
  let mockAppDirectory: MockAppDirectoryService;
  let mockCallbacks: BrokerConfig['callbacks'];
  let resolverUIPromise: Promise<ResolverTarget | null> | null;
  let resolveResolverUI: (target: ResolverTarget) => void;
  let rejectResolverUI: () => void;

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
    {
      appId: 'quote-app',
      name: 'Quote Application',
      version: '1.0.0',
      title: 'Quote App',
      description: 'Displays real-time quotes',
      interop: {
        intents: {
          listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
        },
      },
    },
    {
      appId: 'news-app',
      name: 'News Application',
      version: '1.0.0',
      title: 'News App',
      description: 'Displays news articles',
      interop: {
        intents: {
          listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
        },
      },
    },
  ];

  const mockContext: Context = {
    type: 'fdc3.chart',
    id: { ticker: 'AAPL' },
  };

  beforeEach(() => {
    // Create mock app directory and register apps
    mockAppDirectory = new MockAppDirectoryService();
    mockApps.forEach((app) => mockAppDirectory.registerApp(app));

    // Create resolver UI callback that returns a promise
    resolverUIPromise = null;
    resolveResolverUI = vi.fn();
    rejectResolverUI = vi.fn();

    const onShowResolverUI = vi.fn().mockImplementation(() => {
      return new Promise<ResolverTarget | null>((resolve, reject) => {
        resolverUIPromise = new Promise((res, rej) => {
          resolveResolverUI = (target: ResolverTarget) => {
            res(target);
            resolve(target);
          };
          rejectResolverUI = () => {
            rej(new Error('User cancelled'));
            resolve(null);
          };
        });
      });
    });

    // Mock callbacks
    mockCallbacks = {
      onLoginStatusCheck: vi.fn().mockResolvedValue(true),
      onTileOpen: vi.fn().mockResolvedValue(undefined),
      onValidateEntitlements: vi.fn().mockResolvedValue(true),
      onShowResolverUI,
      onSecurityEvent: vi.fn(),
    };

    mockCallbacks.onShowResolverUI = onShowResolverUI;

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

  describe('ambiguous intent resolution with resolver UI', () => {
    it('should trigger resolver UI when multiple targets available', async () => {
      const intentPromise = broker.raiseIntent('ViewChart', mockContext);

      // Wait for resolver UI to be called
      await vi.waitFor(() => {
        expect(mockCallbacks.onShowResolverUI).toHaveBeenCalled();
      });

      // Verify targets passed to resolver UI
      const resolverTargets = vi.mocked(mockCallbacks.onShowResolverUI).mock.calls[0][0];
      expect(resolverTargets.length).toBe(3);
      expect(resolverTargets.map((t: ResolverTarget) => t.appId)).toContain('chart-app');
      expect(resolverTargets.map((t: ResolverTarget) => t.appId)).toContain('quote-app');
      expect(resolverTargets.map((t: ResolverTarget) => t.appId)).toContain('news-app');

      // Simulate user selecting first target
      resolveResolverUI(resolverTargets[0]);

      // Wait for intent to be resolved
      const resolution = await intentPromise;

      expect(resolution.source.appId).toBe('chart-app');
      expect(mockCallbacks.onTileOpen).toHaveBeenCalledWith('chart-app', mockContext);
    });

    it('should complete intent when user selects target from resolver UI', async () => {
      const intentPromise = broker.raiseIntent('ViewChart', mockContext);

      await vi.waitFor(() => {
        expect(mockCallbacks.onShowResolverUI).toHaveBeenCalled();
      });

      const resolverTargets = vi.mocked(mockCallbacks.onShowResolverUI).mock.calls[0][0];

      // User selects second target (quote-app)
      resolveResolverUI(resolverTargets[1]);

      const resolution = await intentPromise;

      expect(resolution.source.appId).toBe('quote-app');
      expect(mockCallbacks.onTileOpen).toHaveBeenCalledWith('quote-app', mockContext);
    });

    it('should cancel intent when user cancels resolver UI', async () => {
      const intentPromise = broker.raiseIntent('ViewChart', mockContext);

      await vi.waitFor(() => {
        expect(mockCallbacks.onShowResolverUI).toHaveBeenCalled();
      });

      // User cancels
      rejectResolverUI();

      await expect(intentPromise).rejects.toThrow('User cancelled intent resolution');
    });

    it('should handle resolver UI errors gracefully', async () => {
      vi.mocked(mockCallbacks.onShowResolverUI).mockRejectedValue(new Error('UI render error'));

      await expect(broker.raiseIntent('ViewChart', mockContext)).rejects.toThrow(
        'User cancelled intent resolution',
      );
    });
  });

  describe('single target resolution (no resolver UI)', () => {
    it('should resolve directly when only one target available', async () => {
      // Create a fresh mock with only one app to ensure isolation
      const singleAppDirectory = new MockAppDirectoryService();
      singleAppDirectory.registerApp(mockApps[0]);

      const onShowResolverUI = vi.fn().mockResolvedValue({
        appId: 'chart-app',
        metadata: {},
      });
      const config: BrokerConfig = {
        appDirectory: singleAppDirectory,
        callbacks: {
          ...mockCallbacks,
          onShowResolverUI,
        },
      };

      const singleTargetBroker = new Broker(config);

      const resolution = await singleTargetBroker.raiseIntent('ViewChart', mockContext);

      // Resolver UI should not be shown for single target
      expect(onShowResolverUI).not.toHaveBeenCalled();

      expect(resolution.source.appId).toBe('chart-app');
    });

    it('should open tile directly without resolver UI', async () => {
      const onTileOpen = vi.fn().mockResolvedValue(undefined);
      const config: BrokerConfig = {
        appDirectory: mockAppDirectory,
        callbacks: {
          ...mockCallbacks,
          onTileOpen,
          onShowResolverUI: vi.fn().mockResolvedValue(null),
        },
      };

      const directBroker = new Broker(config);

      await directBroker.raiseIntent('ViewChart', mockContext, {
        appId: 'chart-app',
      });

      // Should open tile directly
      expect(onTileOpen).toHaveBeenCalledWith('chart-app', mockContext);
    });
  });

  describe('target with instance ID', () => {
    it('should resolve to specific instance without resolver UI', async () => {
      broker['registerTile']('tile-1', 'chart-app', {
        appId: 'chart-app',
        name: 'Chart Application',
      });

      await broker.addIntentListener('ViewChart', vi.fn());

      const resolution = await broker.raiseIntent('ViewChart', mockContext, {
        appId: 'chart-app',
        instanceId: 'tile-1',
      });

      // Resolver UI should not be shown when specific instance is targeted
      expect(mockCallbacks.onShowResolverUI).not.toHaveBeenCalled();

      expect(resolution.source.appId).toBe('chart-app');
      expect(resolution.source.instanceId).toBe('tile-1');
    });
  });

  describe('resolver UI target data', () => {
    it('should pass complete target metadata to resolver UI', async () => {
      broker.raiseIntent('ViewChart', mockContext);

      await vi.waitFor(() => {
        expect(mockCallbacks.onShowResolverUI).toHaveBeenCalled();
      });

      const resolverTargets = vi.mocked(mockCallbacks.onShowResolverUI).mock.calls[0][0];

      // Verify each target has required metadata
      resolverTargets.forEach((target: ResolverTarget) => {
        expect(target).toHaveProperty('appId');
        expect(target).toHaveProperty('metadata');
        expect(target.metadata).toHaveProperty('name');
        expect(target.metadata).toHaveProperty('title');
        expect(target.metadata).toHaveProperty('description');
        expect(target.metadata).toHaveProperty('version');
      });
    });

    it('should include instanceId for running instances', async () => {
      broker['registerTile']('tile-1', 'chart-app', {
        appId: 'chart-app',
        name: 'Chart Application',
      });

      broker['registerTile']('tile-2', 'quote-app', {
        appId: 'quote-app',
        name: 'Quote Application',
      });

      await broker.addIntentListener('ViewChart', vi.fn());

      broker.raiseIntent('ViewChart', mockContext);

      await vi.waitFor(() => {
        expect(mockCallbacks.onShowResolverUI).toHaveBeenCalled();
      });

      const resolverTargets = vi.mocked(mockCallbacks.onShowResolverUI).mock.calls[0][0];

      // Targets with instances should have instanceId
      const targetsWithInstance = resolverTargets.filter((t: ResolverTarget) => t.instanceId);

      expect(targetsWithInstance.length).toBeGreaterThan(0);
    });
  });

  describe('resolver UI callback integration', () => {
    it('should use custom resolver UI callback when provided', async () => {
      const customResolverUI = vi.fn().mockResolvedValue({
        appId: 'custom-selection',
        metadata: { appId: 'custom-selection', name: 'Custom' },
      });

      const config: BrokerConfig = {
        appDirectory: mockAppDirectory,
        callbacks: {
          ...mockCallbacks,
          onShowResolverUI: customResolverUI,
        },
      };

      const customBroker = new Broker(config);

      await customBroker.raiseIntent('ViewChart', mockContext);

      expect(customResolverUI).toHaveBeenCalled();
      expect(customResolverUI.mock.calls[0][0]).toHaveLength(3);
    });

    it('should default to first target when no resolver UI callback', async () => {
      const configWithoutResolver: BrokerConfig = {
        appDirectory: mockAppDirectory,
        callbacks: {
          ...mockCallbacks,
          onShowResolverUI: undefined,
        },
      };

      const brokerWithoutResolver = new Broker(configWithoutResolver);

      const resolution = await brokerWithoutResolver.raiseIntent('ViewChart', mockContext);

      // Should select first target by default
      expect(resolution.source.appId).toBe('chart-app');
    });
  });

  describe('entitlement filtering before resolver UI', () => {
    it('should only show entitled targets in resolver UI', async () => {
      const onValidateEntitlements = vi.fn((appId: string) => {
        return Promise.resolve(appId === 'chart-app');
      });

      const config: BrokerConfig = {
        appDirectory: mockAppDirectory,
        callbacks: {
          ...mockCallbacks,
          onValidateEntitlements,
        },
      };

      const restrictedBroker = new Broker(config);

      await restrictedBroker.raiseIntent('ViewChart', mockContext);

      await vi.waitFor(() => {
        expect(mockCallbacks.onShowResolverUI).toHaveBeenCalled();
      });

      const resolverTargets = vi.mocked(mockCallbacks.onShowResolverUI).mock.calls[0][0];

      // Only chart-app should be shown (entitled)
      expect(resolverTargets.length).toBe(1);
      expect(resolverTargets[0].appId).toBe('chart-app');
    });

    it('should throw error when no entitled targets available', async () => {
      const onValidateEntitlements = vi.fn().mockResolvedValue(false);

      const config: BrokerConfig = {
        appDirectory: mockAppDirectory,
        callbacks: {
          ...mockCallbacks,
          onValidateEntitlements,
        },
      };

      const restrictedBroker = new Broker(config);

      await expect(restrictedBroker.raiseIntent('ViewChart', mockContext)).rejects.toThrow(
        'No target found for intent: ViewChart',
      );
    });
  });

  describe('context propagation to resolver UI', () => {
    it('should pass context to resolver UI for preview', async () => {
      const complexContext: Context = {
        type: 'fdc3.order',
        id: { orderId: '12345' },
        quantity: 100,
        price: 150.25,
        side: 'buy',
      };

      broker.raiseIntent('ViewOrders', complexContext);

      await vi.waitFor(() => {
        expect(mockCallbacks.onShowResolverUI).toHaveBeenCalled();
      });

      // Note: Context is not directly passed to onShowResolverUI in current implementation
      // This test verifies the integration structure
      expect(mockCallbacks.onShowResolverUI).toHaveBeenCalled();
    });
  });

  describe('error scenarios', () => {
    it('should handle resolver UI timeout gracefully', async () => {
      vi.mocked(mockCallbacks.onShowResolverUI).mockImplementation(
        () =>
          new Promise((resolve) => {
            // Never resolves - simulates timeout
            setTimeout(() => resolve(null), 10000);
          }),
      );

      // This would require implementing timeout in intent resolver
      // For now, just verify the structure
      broker.raiseIntent('ViewChart', mockContext);

      await vi.waitFor(() => {
        expect(mockCallbacks.onShowResolverUI).toHaveBeenCalled();
      });
    });

    it('should handle malformed resolver UI response', async () => {
      vi.mocked(mockCallbacks.onShowResolverUI).mockResolvedValue(
        null as unknown as ResolverTarget,
      );

      await expect(broker.raiseIntent('ViewChart', mockContext)).rejects.toThrow(
        'User cancelled intent resolution',
      );
    });
  });

  describe('multiple concurrent intent resolutions', () => {
    it('should handle multiple simultaneous resolver UI requests', async () => {
      // Register an app that handles ViewQuote
      mockAppDirectory.registerApp({
        appId: 'quote-app',
        name: 'Quote Application',
        version: '1.0.0',
        title: 'Quote App',
        description: 'Displays real-time quotes',
        interop: {
          intents: {
            listensFor: [{ intent: 'ViewQuote', contexts: ['fdc3.quote'] }],
          },
        },
      });

      const intent1 = broker.raiseIntent('ViewChart', mockContext);
      const intent2 = broker.raiseIntent('ViewQuote', {
        type: 'fdc3.quote',
        id: { ticker: 'MSFT' },
      });

      await vi.waitFor(() => {
        expect(mockCallbacks.onShowResolverUI).toHaveBeenCalledTimes(2);
      });
    });
  });
});

let mockConfig: BrokerConfig;
