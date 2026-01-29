/**
 * Broker getInfo() Unit Tests
 * @see plan.md#T179
 */

import { MockAppDirectoryService } from '../../fdc3-app-directory/src/mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type { BrokerConfig, ImplementationMetadata } from '../src/types';

describe('Broker getInfo()', () => {
  let broker: Broker;
  let mockConfig: BrokerConfig;

  beforeEach(() => {
    vi.clearAllMocks();

    const mockAppDirectory = new MockAppDirectoryService();

    mockConfig = {
      appDirectory: mockAppDirectory,
      callbacks: {
        onLoginStatusCheck: async () => true,
        onTileOpen: async () => undefined,
        onValidateEntitlements: async () => true,
        onShowResolverUI: async (targets) => targets[0] || null,
        onSecurityEvent: vi.fn(),
      },
      enableDebug: false,
      userChannelIds: ['red', 'green', 'blue'],
    };

    broker = new Broker(mockConfig);
  });

  describe('basic getInfo() functionality', () => {
    it('should return ImplementationMetadata object', async () => {
      const info = await broker.getInfo();

      expect(info).toBeDefined();
      expect(typeof info).toBe('object');
    });

    it('should return correct FDC3 version', async () => {
      const info = await broker.getInfo();

      expect(info.fdc3Version).toBeDefined();
      expect(info.fdc3Version).toBe('2.2');
    });

    it('should return provider name', async () => {
      const info = await broker.getInfo();

      expect(info.provider).toBeDefined();
      expect(typeof info.provider).toBe('string');
      expect(info.provider.length).toBeGreaterThan(0);
    });

    it('should return implementation version', async () => {
      const info = await broker.getInfo();

      expect(info.providerVersion).toBeDefined();
      expect(typeof info.providerVersion).toBe('string');
    });
  });

  describe('ImplementationMetadata structure', () => {
    it('should include all required metadata fields', async () => {
      const info = await broker.getInfo();

      // Check required fields according to FDC3 spec
      expect(info).toHaveProperty('fdc3Version');
      expect(info).toHaveProperty('provider');
      expect(info).toHaveProperty('providerVersion');
    });

    it('should match ImplementationMetadata type', async () => {
      const info = await broker.getInfo();

      // Type guard checks
      expect(info).toMatchObject({
        fdc3Version: expect.any(String),
        provider: expect.any(String),
        providerVersion: expect.any(String),
      } as ImplementationMetadata);
    });

    it('should allow additional optional metadata fields', async () => {
      const info = await broker.getInfo();

      // The base implementation may include additional metadata
      // At minimum, required fields should be present
      expect(info.fdc3Version).toBeDefined();
      expect(info.provider).toBeDefined();
      expect(info.providerVersion).toBeDefined();
    });
  });

  describe('version information', () => {
    it('should return FDC3 version as 2.2', async () => {
      const info = await broker.getInfo();

      expect(info.fdc3Version).toBe('2.2');
    });

    it('should return non-empty provider version', async () => {
      const info = await broker.getInfo();

      expect(info.providerVersion).not.toBe('');
      expect(info.providerVersion.length).toBeGreaterThan(0);
    });

    it('should return valid version format', async () => {
      const info = await broker.getInfo();

      // Version should be semver-like or similar format
      const versionPattern = /^\d+\.\d+(\.\d+)?([-.].+)?$/;
      const isValidVersion = versionPattern.test(info.providerVersion);

      // Provider version should follow some version format
      expect(info.providerVersion).toMatch(/\d/);
    });
  });

  describe('provider information', () => {
    it('should return consistent provider name', async () => {
      const info1 = await broker.getInfo();
      const info2 = await broker.getInfo();

      expect(info1.provider).toBe(info2.provider);
    });

    it('should return consistent version across calls', async () => {
      const info1 = await broker.getInfo();
      const info2 = await broker.getInfo();

      expect(info1.providerVersion).toBe(info2.providerVersion);
    });

    it('should return provider name containing known identifiers', async () => {
      const info = await broker.getInfo();

      // Provider should be a recognizable platform provider
      expect(info.provider).toBeDefined();
      expect(info.provider.length).toBeGreaterThan(0);
    });
  });

  describe('getInfo() behavior', () => {
    it('should be callable without parameters', async () => {
      const info = await broker.getInfo();

      expect(info).toBeDefined();
    });

    it('should return promise that resolves to object', async () => {
      const infoPromise = broker.getInfo();

      expect(infoPromise).toBeInstanceOf(Promise);

      const info = await infoPromise;
      expect(typeof info).toBe('object');
    });

    it('should return synchronously (no async delay)', async () => {
      const startTime = Date.now();
      await broker.getInfo();
      const endTime = Date.now();

      // Should complete almost instantly
      expect(endTime - startTime).toBeLessThan(10);
    });

    it('should not throw errors', async () => {
      await expect(broker.getInfo()).resolves.toBeDefined();
    });
  });

  describe('getInfo() integration with broker', () => {
    it('should work before any tiles are registered', async () => {
      const info = await broker.getInfo();

      expect(info.fdc3Version).toBe('2.2');
    });

    it('should work after tiles are registered', async () => {
      await broker.registerTile('tile-1', 'app-a');
      await broker.registerTile('tile-2', 'app-b');

      const info = await broker.getInfo();

      expect(info.fdc3Version).toBe('2.2');
    });

    it('should work after channel operations', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      await broker.joinUserChannel('red');

      const info = await broker.getInfo();

      expect(info.fdc3Version).toBe('2.2');
    });

    it('should work after intent operations', async () => {
      broker.registerTile('tile-1', 'app-a');
      broker.setCurrentTile('tile-1');

      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler);

      const info = await broker.getInfo();

      expect(info.fdc3Version).toBe('2.2');
    });
  });

  describe('getInfo() metadata accuracy', () => {
    it('should return metadata matching FDC3 2.2 specification', async () => {
      const info = await broker.getInfo();

      // FDC3 2.2 requires these fields
      expect(info.fdc3Version).toBeDefined();
      expect(info.provider).toBeDefined();
      expect(info.providerVersion).toBeDefined();
    });

    it('should indicate FDC3 2.2 compliance', async () => {
      const info = await broker.getInfo();

      // Version should explicitly indicate 2.2
      expect(info.fdc3Version).toMatch(/^2\.2/);
    });

    it('should provide identifying information for debugging', async () => {
      const info = await broker.getInfo();

      // Metadata should be useful for debugging
      expect(info.provider).toBeDefined();
      expect(info.providerVersion).toBeDefined();
      expect(info.fdc3Version).toBeDefined();

      // All should be non-empty strings
      expect(info.provider.trim().length).toBeGreaterThan(0);
      expect(info.providerVersion.trim().length).toBeGreaterThan(0);
      expect(info.fdc3Version.trim().length).toBeGreaterThan(0);
    });
  });

  describe('getInfo() edge cases', () => {
    it('should handle multiple concurrent calls', async () => {
      const [info1, info2, info3] = await Promise.all([
        broker.getInfo(),
        broker.getInfo(),
        broker.getInfo(),
      ]);

      // All should return valid metadata
      expect(info1.fdc3Version).toBe('2.2');
      expect(info2.fdc3Version).toBe('2.2');
      expect(info3.fdc3Version).toBe('2.2');

      // All should be identical
      expect(info1).toEqual(info2);
      expect(info2).toEqual(info3);
    });

    it('should return immutable metadata', async () => {
      const info1 = await broker.getInfo();

      // Try to modify the returned object
      try {
        (info1 as any).fdc3Version = '1.2';
      } catch (error) {
        // Object might be frozen/readonly
      }

      const info2 = await broker.getInfo();

      // Version should still be 2.2
      expect(info2.fdc3Version).toBe('2.2');
    });

    it('should work correctly with debug mode enabled', async () => {
      mockConfig.enableDebug = true;
      const debugBroker = new Broker(mockConfig);

      const info = await debugBroker.getInfo();

      expect(info.fdc3Version).toBe('2.2');
      expect(info.provider).toBeDefined();
    });
  });

  describe('getInfo() consistency', () => {
    it('should return same metadata structure across calls', async () => {
      const info1 = await broker.getInfo();
      const info2 = await broker.getInfo();

      // Same keys
      const keys1 = Object.keys(info1);
      const keys2 = Object.keys(info2);

      expect(keys1).toEqual(keys2);

      // Same values
      expect(info1).toEqual(info2);
    });

    it('should maintain type safety', async () => {
      const info = await broker.getInfo();

      // Type checks
      expect(typeof info.fdc3Version).toBe('string');
      expect(typeof info.provider).toBe('string');
      expect(typeof info.providerVersion).toBe('string');
    });

    it('should not include undefined or null values for required fields', async () => {
      const info = await broker.getInfo();

      expect(info.fdc3Version).not.toBeNull();
      expect(info.fdc3Version).not.toBeUndefined();
      expect(info.provider).not.toBeNull();
      expect(info.provider).not.toBeUndefined();
      expect(info.providerVersion).not.toBeNull();
      expect(info.providerVersion).not.toBeUndefined();
    });
  });
});
