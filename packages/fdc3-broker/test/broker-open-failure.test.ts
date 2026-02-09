/**
 * Broker Tile Open Failure Callback Tests
 * Tests for onTileOpenFailure callback functionality
 */

import { MockAppDirectoryService } from '../../fdc3-app-directory/src/mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type { BrokerConfig } from '../src/types';

describe('Broker Tile Open Failure Callback', () => {
  let mockConfig: BrokerConfig;
  let onTileOpenFailureFn: ReturnType<typeof vi.fn>;
  let mockAppDirectory: MockAppDirectoryService;

  beforeEach(() => {
    vi.clearAllMocks();

    onTileOpenFailureFn = vi.fn();

    mockAppDirectory = new MockAppDirectoryService();
    mockAppDirectory.registerApp({
      appId: 'test-app',
      name: 'Test Application',
      version: '1.0.0',
    });

    mockConfig = {
      appDirectory: mockAppDirectory,
      callbacks: {
        onLoginStatusCheck: async () => true,
        onTileOpen: async (app) => ({ appId: app.appId, instanceId: `${app.appId}-1` }),
        onTileOpenFailure: onTileOpenFailureFn,
      },
      enableDebug: false,
    };
  });

  describe('callback invocation', () => {
    it('should invoke onTileOpenFailure when user is not logged in', async () => {
      const config = {
        ...mockConfig,
        callbacks: {
          ...mockConfig.callbacks,
          onLoginStatusCheck: async () => false,
        },
      };
      const broker = new Broker(config);

      await expect(broker.open({ appId: 'test-app' })).rejects.toThrow('User not logged in');

      expect(onTileOpenFailureFn).toHaveBeenCalledWith({
        appId: 'test-app',
        reason: 'User not logged in',
        errorCode: undefined,
        error: undefined,
      });
    });

    it('should invoke onTileOpenFailure with error code on entitlement denial', async () => {
      const config = {
        ...mockConfig,
        callbacks: {
          ...mockConfig.callbacks,
          onValidateEntitlements: async () => false, // Deny entitlement
        },
      };
      const broker = new Broker(config);

      await expect(broker.open({ appId: 'test-app' })).rejects.toThrow(
        'Not entitled to open this application',
      );

      expect(onTileOpenFailureFn).toHaveBeenCalledWith({
        appId: 'test-app',
        reason: 'Not entitled to open this application',
        errorCode: 'ENTITLEMENT_DENIED_OPEN',
        error: undefined,
      });
    });

    it('should invoke onTileOpenFailure when onTileOpen callback throws', async () => {
      const openError = new Error('Failed to load application');
      const config = {
        ...mockConfig,
        callbacks: {
          ...mockConfig.callbacks,
          onTileOpen: async () => {
            throw openError;
          },
        },
      };
      const broker = new Broker(config);

      await expect(broker.open({ appId: 'test-app' })).rejects.toThrow(
        'Failed to load application',
      );

      expect(onTileOpenFailureFn).toHaveBeenCalledWith({
        appId: 'test-app',
        reason: 'Failed to load application',
        errorCode: undefined,
        error: openError,
      });
    });

    it('should invoke onTileOpenFailure with error when onTileOpen throws non-Error', async () => {
      const config = {
        ...mockConfig,
        callbacks: {
          ...mockConfig.callbacks,
          onTileOpen: async () => {
            throw 'string error';
          },
        },
      };
      const broker = new Broker(config);

      await expect(broker.open({ appId: 'test-app' })).rejects.toThrow('string error');

      // When a non-Error is thrown, the error is passed as-is
      expect(onTileOpenFailureFn).toHaveBeenCalledWith({
        appId: 'test-app',
        reason: 'Unknown error',
        errorCode: undefined,
        error: 'string error',
      });
    });
  });

  describe('callback error handling', () => {
    it('should not throw when onTileOpenFailure callback throws', async () => {
      onTileOpenFailureFn.mockImplementation(() => {
        throw new Error('Callback failed');
      });

      const config = {
        ...mockConfig,
        callbacks: {
          ...mockConfig.callbacks,
          onLoginStatusCheck: async () => false,
        },
      };
      const broker = new Broker(config);

      // Should still throw the original error, not the callback error
      await expect(broker.open({ appId: 'test-app' })).rejects.toThrow('User not logged in');
    });
  });

  describe('no callback configured', () => {
    it('should succeed when no callback configured and open succeeds', async () => {
      const config = {
        ...mockConfig,
        callbacks: {
          ...mockConfig.callbacks,
          onTileOpenFailure: undefined,
        },
      };
      const broker = new Broker(config);

      const result = await broker.open({ appId: 'test-app' });

      expect(result.appId).toBe('test-app');
    });
  });
});
