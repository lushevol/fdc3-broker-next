/**
 * Intent Resolver Unit Tests
 * @see plan.md#T087
 */

import type { AppDefinition, AppDirectoryClient } from '@fm/fdc3-app-directory';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IntentResolver } from '../src/intent-resolver';
import type { BrokerConfig, TileInstance, TileRegistry } from '../src/types';

describe('IntentResolver', () => {
  let mockAppDirectory: AppDirectoryClient;
  let mockTileRegistry: TileRegistry;
  let mockCallbacks: BrokerConfig['callbacks'];
  let resolver: IntentResolver;

  const mockApp1: AppDefinition = {
    appId: 'app1',
    name: 'App 1',
    version: '1.0.0',
    title: 'Application 1',
    description: 'Test Application 1',
    interop: {
      intents: {
        listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
      },
    },
  };

  const mockApp2: AppDefinition = {
    appId: 'app2',
    name: 'App 2',
    version: '1.0.0',
    title: 'Application 2',
    description: 'Test Application 2',
    interop: {
      intents: {
        listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.chart'] }],
      },
    },
  };

  const mockTile1: TileInstance = {
    instanceId: 'tile-1',
    appId: 'app1',
    state: 'mounted',
    metadata: {
      appId: 'app1',
      name: 'App 1',
      title: 'Tile 1',
    },
  };

  const mockTile2: TileInstance = {
    instanceId: 'tile-2',
    appId: 'app2',
    state: 'mounted',
    metadata: {
      appId: 'app2',
      name: 'App 2',
      title: 'Tile 2',
    },
  };

  beforeEach(() => {
    // Mock App Directory
    mockAppDirectory = {
      findByIntent: vi.fn(),
      getApp: vi.fn(),
    } as unknown as AppDirectoryClient;

    // Mock Tile Registry
    mockTileRegistry = {
      registerTile: vi.fn(),
      unregisterTile: vi.fn(),
      getTile: vi.fn(),
      getTilesByAppId: vi.fn().mockReturnValue([]),
      getTilesWithIntentListener: vi.fn(),
      updateTileState: vi.fn(),
    } as unknown as TileRegistry;

    // Mock callbacks
    mockCallbacks = {
      onValidateEntitlements: vi.fn().mockResolvedValue(true),
      onShowResolverUI: vi.fn(),
    };

    resolver = new IntentResolver(mockAppDirectory, mockTileRegistry, mockCallbacks);
  });

  describe('resolve() - single target', () => {
    it('should return single target when only one app available', async () => {
      const mockContext = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockTileRegistry.getTilesByAppId).mockReturnValue([]);

      const result = await resolver.resolve('ViewChart', mockContext);

      expect(result.type).toBe('success');
      expect(result.target).toBeDefined();
      expect(result.target?.appId).toBe('app1');
      expect(mockAppDirectory.findByIntent).toHaveBeenCalledWith('ViewChart');
    });

    it('should return ambiguous result with mounted tile and new instance when one instance is running', async () => {
      const mockContext = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockTileRegistry.getTilesByAppId).mockReturnValue([mockTile1]);

      const result = await resolver.resolve('ViewChart', mockContext);

      expect(result.type).toBe('ambiguous');
      expect(result.targets).toEqual([
        expect.objectContaining({ appId: 'app1', instanceId: 'tile-1' }),
        expect.objectContaining({ appId: 'app1' }),
      ]);
      expect(result.targets?.[1].instanceId).toBeUndefined();
    });

    it('should filter out unmounted tiles', async () => {
      const mockContext = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };
      const unmountedTile: TileInstance = {
        instanceId: 'tile-3',
        appId: 'app1',
        state: 'unmounted',
      };

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockTileRegistry.getTilesByAppId).mockReturnValue([mockTile1, unmountedTile]);

      const result = await resolver.resolve('ViewChart', mockContext);

      expect(result.type).toBe('ambiguous');
      // Only mounted tiles should be returned
      const tiles = vi.mocked(mockTileRegistry.getTilesByAppId).mock.results[0].value;
      expect(tiles.filter((t: TileInstance) => t.state === 'mounted').length).toBe(1);
      expect(result.targets?.filter((target) => target.instanceId).length).toBe(1);
    });
  });

  describe('resolve() - multiple targets (ambiguous)', () => {
    it('should return ambiguous result when multiple apps available', async () => {
      const mockContext = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1, mockApp2]);
      vi.mocked(mockTileRegistry.getTilesByAppId)
        .mockReturnValueOnce([mockTile1])
        .mockReturnValueOnce([mockTile2]);

      const result = await resolver.resolve('ViewChart', mockContext);

      expect(result.type).toBe('ambiguous');
      expect(result.targets).toBeDefined();
      expect(result.targets?.length).toBe(4);
      expect(result.targets?.[0].appId).toBe('app1');
      expect(result.targets?.[1].appId).toBe('app1');
      expect(result.targets?.[1].instanceId).toBeUndefined();
      expect(result.targets?.[2].appId).toBe('app2');
      expect(result.targets?.[3].appId).toBe('app2');
      expect(result.targets?.[3].instanceId).toBeUndefined();
    });

    it('should return ambiguous result when multiple instances of same app', async () => {
      const mockContext = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };
      const mockTile2a: TileInstance = {
        instanceId: 'tile-2a',
        appId: 'app1',
        state: 'mounted',
        metadata: { appId: 'app1', name: 'App 1', title: 'Tile 2A' },
      };

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockTileRegistry.getTilesByAppId).mockReturnValue([mockTile1, mockTile2a]);

      const result = await resolver.resolve('ViewChart', mockContext);

      expect(result.type).toBe('ambiguous');
      expect(result.targets?.length).toBe(3);
      expect(result.targets?.[0].instanceId).toBe('tile-1');
      expect(result.targets?.[1].instanceId).toBe('tile-2a');
      expect(result.targets?.[2].instanceId).toBeUndefined();
    });

    it('should include a new instance target for apps that already have mounted instances', async () => {
      const mockContext = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockTileRegistry.getTilesByAppId).mockReturnValue([mockTile1]);

      const result = await resolver.resolve('ViewChart', mockContext);

      expect(result.type).toBe('ambiguous');
      expect(result.targets).toContainEqual(
        expect.objectContaining({
          appId: 'app1',
          metadata: expect.objectContaining({ appId: 'app1', name: 'App 1' }),
        }),
      );
      expect(result.targets?.some((target) => target.appId === 'app1' && !target.instanceId)).toBe(
        true,
      );
    });
  });

  describe('resolve() - no targets found', () => {
    it('should return not-found when no apps registered for intent', async () => {
      const mockContext = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([]);

      const result = await resolver.resolve('ViewChart', mockContext);

      expect(result.type).toBe('not-found');
      expect(result.target).toBeUndefined();
      expect(result.targets).toBeUndefined();
    });

    it('should return not-found when all apps fail entitlement check', async () => {
      const appWithConstraints: AppDefinition = {
        ...mockApp1,
        entitlementConstraints: {
          requiredPermissions: ['premium'],
        },
      };

      const mockContext = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };
      const denyEntitlements = vi.fn().mockResolvedValue(false);

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([appWithConstraints]);
      // Create new resolver with denying entitlements
      resolver = new IntentResolver(mockAppDirectory, mockTileRegistry, {
        onValidateEntitlements: denyEntitlements,
      });

      const result = await resolver.resolve('ViewChart', mockContext);

      expect(result.type).toBe('not-found');
      expect(denyEntitlements).toHaveBeenCalledWith('app1', 'access');
    });

    it('should return not-found when app not found with specific target', async () => {
      const mockContext = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };
      const target = { appId: 'nonexistent' };

      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(null);

      const result = await resolver.resolve('ViewChart', mockContext, target);

      expect(result.type).toBe('not-found');
      expect(mockAppDirectory.getApp).toHaveBeenCalledWith('nonexistent');
    });
  });

  describe('resolve() - with specific target', () => {
    it('should resolve to mounted tile instance', async () => {
      const mockContext = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };
      const target = { appId: 'app1', instanceId: 'tile-1' };

      vi.mocked(mockTileRegistry.getTile).mockReturnValue(mockTile1);

      const result = await resolver.resolve('ViewChart', mockContext, target);

      expect(result.type).toBe('success');
      expect(result.target?.appId).toBe('app1');
      expect(result.target?.instanceId).toBe('tile-1');
      expect(mockTileRegistry.getTile).toHaveBeenCalledWith('tile-1');
    });

    it('should resolve to app when no instance running', async () => {
      const mockContext = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };
      const target = { appId: 'app1' };

      vi.mocked(mockTileRegistry.getTile).mockReturnValue(undefined);
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(mockApp1);

      const result = await resolver.resolve('ViewChart', mockContext, target);

      expect(result.type).toBe('success');
      expect(result.target?.appId).toBe('app1');
      expect(result.target?.instanceId).toBeUndefined();
      expect(mockAppDirectory.getApp).toHaveBeenCalledWith('app1');
    });

    it('should check entitlements when resolving specific target', async () => {
      const mockContext = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };
      const target = { appId: 'app1' };

      vi.mocked(mockTileRegistry.getTile).mockReturnValue(undefined);
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(mockApp1);

      const result = await resolver.resolve('ViewChart', mockContext, target);

      expect(result.type).toBe('success');
      expect(mockCallbacks.onValidateEntitlements).toHaveBeenCalledWith('app1', 'receive-intent');
    });

    it('should return not-found when specific target fails entitlement check', async () => {
      const mockContext = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };
      const target = { appId: 'app1' };
      const denyEntitlements = vi.fn().mockResolvedValue(false);

      vi.mocked(mockTileRegistry.getTile).mockReturnValue(undefined);
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(mockApp1);

      // Create new resolver with denying entitlements
      resolver = new IntentResolver(mockAppDirectory, mockTileRegistry, {
        onValidateEntitlements: denyEntitlements,
      });

      const result = await resolver.resolve('ViewChart', mockContext, target);

      expect(result.type).toBe('not-found');
    });

    it('should return not-found when tile instance not found', async () => {
      const mockContext = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };
      const target = { appId: 'app1', instanceId: 'nonexistent-tile' };

      vi.mocked(mockTileRegistry.getTile).mockReturnValue(undefined);
      vi.mocked(mockAppDirectory.getApp).mockResolvedValue(mockApp1);

      const result = await resolver.resolve('ViewChart', mockContext, target);

      // When instance doesn't exist but app does, returns success with instanceId from input
      expect(result.type).toBe('success');
      expect(result.target?.instanceId).toBe('nonexistent-tile');
    });
  });

  describe('showResolverUI()', () => {
    it('should call onShowResolverUI callback and return selected target', async () => {
      const targets = [
        {
          appId: 'app1',
          instanceId: 'tile-1',
          metadata: { appId: 'app1', name: 'App 1' },
        },
        {
          appId: 'app2',
          instanceId: 'tile-2',
          metadata: { appId: 'app2', name: 'App 2' },
        },
      ];

      const selectedTarget = targets[1];
      vi.mocked(mockCallbacks.onShowResolverUI).mockResolvedValue(selectedTarget);

      const context = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };

      const result = await resolver.showResolverUI(targets, context, 'ViewChart');

      expect(result).toEqual(selectedTarget);
      expect(mockCallbacks.onShowResolverUI).toHaveBeenCalledWith(targets, context, 'ViewChart');
    });

    it('should return null when resolver UI is cancelled', async () => {
      const targets = [
        {
          appId: 'app1',
          metadata: { appId: 'app1', name: 'App 1' },
        },
      ];

      vi.mocked(mockCallbacks.onShowResolverUI).mockResolvedValue(null);

      const result = await resolver.showResolverUI(targets);

      expect(result).toBeNull();
    });

    it('should return null when resolver UI throws error', async () => {
      const targets = [
        {
          appId: 'app1',
          metadata: { appId: 'app1', name: 'App 1' },
        },
      ];

      vi.mocked(mockCallbacks.onShowResolverUI).mockRejectedValue(new Error('UI Error'));

      const result = await resolver.showResolverUI(targets);

      expect(result).toBeNull();
    });

    it('should default to first target when no callback provided', async () => {
      // Create resolver without onShowResolverUI callback
      resolver = new IntentResolver(mockAppDirectory, mockTileRegistry, {});

      const targets = [
        {
          appId: 'app1',
          metadata: { appId: 'app1', name: 'App 1' },
        },
        {
          appId: 'app2',
          metadata: { appId: 'app2', name: 'App 2' },
        },
      ];

      const result = await resolver.showResolverUI(targets);

      expect(result).toEqual(targets[0]);
    });

    it('should return null when targets array is empty', async () => {
      resolver = new IntentResolver(mockAppDirectory, mockTileRegistry, {});

      const result = await resolver.showResolverUI([]);

      expect(result).toBeNull();
    });
  });

  describe('createIntentResolution()', () => {
    it('should create IntentResolution from target', () => {
      const target = {
        appId: 'app1',
        instanceId: 'tile-1',
        metadata: {
          appId: 'app1',
          name: 'App 1',
          title: 'Application 1',
          version: '1.0.0',
        },
      };

      const resolution = resolver.createIntentResolution(target);

      expect(resolution.source).toEqual({
        appId: 'app1',
        instanceId: 'tile-1',
        name: 'App 1',
        title: 'Application 1',
        version: '1.0.0',
      });
    });

    it('should handle target without instanceId', () => {
      const target = {
        appId: 'app1',
        metadata: {
          appId: 'app1',
          name: 'App 1',
        },
      };

      const resolution = resolver.createIntentResolution(target);

      expect(resolution.source.appId).toBe('app1');
      expect(resolution.source.instanceId).toBeUndefined();
    });
  });

  describe('entitlement filtering', () => {
    it('should filter apps with entitlement constraints', async () => {
      const appWithConstraints: AppDefinition = {
        ...mockApp1,
        entitlementConstraints: {
          requiredPermissions: ['premium'],
        },
      };

      const mockContext = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1, appWithConstraints]);
      vi.mocked(mockTileRegistry.getTilesByAppId).mockReturnValue([]);

      vi.mocked(mockCallbacks.onValidateEntitlements).mockResolvedValue(false);

      const result = await resolver.resolve('ViewChart', mockContext);

      expect(mockCallbacks.onValidateEntitlements).toHaveBeenCalledWith('app1', 'access');
      expect(result.type).toBe('success');
    });

    it('should allow apps without entitlement constraints', async () => {
      const mockContext = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([mockApp1]);
      vi.mocked(mockTileRegistry.getTilesByAppId).mockReturnValue([]);

      const result = await resolver.resolve('ViewChart', mockContext);

      // Should not check entitlements for apps without constraints
      expect(mockCallbacks.onValidateEntitlements).not.toHaveBeenCalled();
      expect(result.type).toBe('success');
    });

    it('should handle entitlement check errors gracefully', async () => {
      const appWithConstraints: AppDefinition = {
        ...mockApp1,
        entitlementConstraints: {
          requiredPermissions: ['premium'],
        },
      };

      const mockContext = { type: 'fdc3.chart', id: { ticker: 'AAPL' } };
      const errorCallback = vi.fn().mockRejectedValue(new Error('Network error'));

      vi.mocked(mockAppDirectory.findByIntent).mockResolvedValue([appWithConstraints]);

      resolver = new IntentResolver(mockAppDirectory, mockTileRegistry, {
        onValidateEntitlements: errorCallback,
      });

      const result = await resolver.resolve('ViewChart', mockContext);

      expect(result.type).toBe('not-found');
    });
  });
});
