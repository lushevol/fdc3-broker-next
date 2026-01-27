/**
 * Entitlement Validator Unit Tests
 * @see plan.md#T159
 */

import { MockAppDirectoryService } from '@fm/fdc3-app-directory/mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EntitlementValidator } from '../src/entitlements';
import type { BrokerConfig, Context } from '../src/types';

describe('EntitlementValidator', () => {
  let validator: EntitlementValidator;
  let mockConfig: BrokerConfig;
  let mockValidateEntitlements: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockValidateEntitlements = vi.fn();

    const mockAppDirectory = new MockAppDirectoryService();

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
      userChannelIds: ['red', 'green', 'blue'],
    };

    validator = new EntitlementValidator(mockConfig);
  });

  describe('canSendIntent()', () => {
    it('should allow sending intent when entitled', async () => {
      mockValidateEntitlements.mockResolvedValue(true);

      const result = await validator.canSendIntent('tile-1', 'ViewChart', {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      } as Context);

      expect(result.allowed).toBe(true);
      expect(mockValidateEntitlements).toHaveBeenCalledWith('tile-1', 'send-intent');
    });

    it('should deny sending intent when not entitled', async () => {
      mockValidateEntitlements.mockResolvedValue(false);

      const result = await validator.canSendIntent('tile-1', 'ViewChart', {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      } as Context);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Not entitled to send this intent');
      expect(result.errorCode).toBe('ENTITLEMENT_DENIED_SEND');
    });

    it('should allow when no validation callback configured', async () => {
      const configWithoutCallback = {
        ...mockConfig,
        callbacks: {
          ...mockConfig.callbacks,
          onValidateEntitlements: undefined,
        },
      };
      const validatorWithoutCallback = new EntitlementValidator(configWithoutCallback);

      const result = await validatorWithoutCallback.canSendIntent('tile-1', 'ViewChart');

      expect(result.allowed).toBe(true);
    });

    it('should handle validation errors gracefully', async () => {
      mockValidateEntitlements.mockRejectedValue(new Error('Validation error'));

      const result = await validator.canSendIntent('tile-1', 'ViewChart');

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Error validating entitlements');
      expect(result.errorCode).toBe('ENTITLEMENT_ERROR');
    });

    it('should log security event when denied', async () => {
      mockValidateEntitlements.mockResolvedValue(false);
      const mockSecurityEvent = vi.fn();
      mockConfig.callbacks.onSecurityEvent = mockSecurityEvent;

      const result = await validator.canSendIntent('tile-1', 'ViewChart', {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      } as Context);

      expect(result.allowed).toBe(false);
      expect(mockSecurityEvent).toHaveBeenCalledWith(
        'Intent send denied due to entitlements',
        expect.objectContaining({
          tileId: 'tile-1',
          intent: 'ViewChart',
          contextType: 'fdc3.chart',
        }),
      );
    });
  });

  describe('canReceiveIntent()', () => {
    it('should allow receiving intent when entitled', async () => {
      mockValidateEntitlements.mockResolvedValue(true);

      const result = await validator.canReceiveIntent('tile-1', 'ViewChart');

      expect(result.allowed).toBe(true);
      expect(mockValidateEntitlements).toHaveBeenCalledWith('tile-1', 'receive-intent');
    });

    it('should deny receiving intent when not entitled', async () => {
      mockValidateEntitlements.mockResolvedValue(false);

      const result = await validator.canReceiveIntent('tile-1', 'ViewChart');

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Not entitled to receive this intent');
      expect(result.errorCode).toBe('ENTITLEMENT_DENIED_RECEIVE');
    });

    it('should allow when no validation callback configured', async () => {
      const configWithoutCallback = {
        ...mockConfig,
        callbacks: {
          ...mockConfig.callbacks,
          onValidateEntitlements: undefined,
        },
      };
      const validatorWithoutCallback = new EntitlementValidator(configWithoutCallback);

      const result = await validatorWithoutCallback.canReceiveIntent('tile-1', 'ViewChart');

      expect(result.allowed).toBe(true);
    });

    it('should handle validation errors gracefully', async () => {
      mockValidateEntitlements.mockRejectedValue(new Error('Validation error'));

      const result = await validator.canReceiveIntent('tile-1', 'ViewChart');

      expect(result.allowed).toBe(false);
      expect(result.errorCode).toBe('ENTITLEMENT_ERROR');
    });

    it('should log security event when denied', async () => {
      mockValidateEntitlements.mockResolvedValue(false);
      const mockSecurityEvent = vi.fn();
      mockConfig.callbacks.onSecurityEvent = mockSecurityEvent;

      const result = await validator.canReceiveIntent('tile-1', 'ViewChart');

      expect(result.allowed).toBe(false);
      expect(mockSecurityEvent).toHaveBeenCalledWith(
        'Intent receive denied due to entitlements',
        expect.objectContaining({
          tileId: 'tile-1',
          intent: 'ViewChart',
        }),
      );
    });
  });

  describe('canJoinChannel()', () => {
    it('should allow joining channel when entitled', async () => {
      mockValidateEntitlements
        .mockResolvedValueOnce(true) // First call: join-channel
        .mockResolvedValueOnce(true); // Second call: join-premium-channel (not called for non-premium)

      const result = await validator.canJoinChannel('tile-1', 'red');

      expect(result.allowed).toBe(true);
    });

    it('should deny joining channel when not entitled', async () => {
      mockValidateEntitlements.mockResolvedValue(false);

      const result = await validator.canJoinChannel('tile-1', 'red');

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Not entitled to join this channel');
      expect(result.errorCode).toBe('ENTITLEMENT_DENIED_CHANNEL');
    });

    it('should allow joining regular channel when entitled', async () => {
      mockValidateEntitlements.mockResolvedValue(true);

      const result = await validator.canJoinChannel('tile-1', 'red');

      expect(result.allowed).toBe(true);
      expect(mockValidateEntitlements).toHaveBeenCalledWith('tile-1', 'join-channel');
    });

    it('should require premium entitlement for premium channels', async () => {
      mockValidateEntitlements
        .mockResolvedValueOnce(true) // join-channel allowed
        .mockResolvedValueOnce(false); // join-premium-channel denied

      const result = await validator.canJoinChannel('tile-1', 'premium-gold');

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Premium subscription required for this channel');
      expect(result.errorCode).toBe('ENTITLEMENT_DENIED_PREMIUM_CHANNEL');
    });

    it('should allow premium channel when entitled to both', async () => {
      mockValidateEntitlements
        .mockResolvedValueOnce(true) // join-channel allowed
        .mockResolvedValueOnce(true); // join-premium-channel allowed

      const result = await validator.canJoinChannel('tile-1', 'premium-gold');

      expect(result.allowed).toBe(true);
    });

    it('should identify premium channels correctly', async () => {
      const premiumChannels = ['premium-gold', 'private-alpha', 'premium-beta'];
      const regularChannels = ['red', 'green', 'blue', 'custom'];

      mockValidateEntitlements.mockResolvedValue(true);

      // Test premium channels
      for (const channelId of premiumChannels) {
        await validator.canJoinChannel('tile-1', channelId);
        expect(mockValidateEntitlements).toHaveBeenCalledWith('tile-1', 'join-premium-channel');
      }

      vi.clearAllMocks();
      mockValidateEntitlements.mockResolvedValue(true);

      // Test regular channels
      for (const channelId of regularChannels) {
        await validator.canJoinChannel('tile-1', channelId);
        expect(mockValidateEntitlements).toHaveBeenCalledWith('tile-1', 'join-channel');
      }
    });

    it('should allow when no validation callback configured', async () => {
      const configWithoutCallback = {
        ...mockConfig,
        callbacks: {
          ...mockConfig.callbacks,
          onValidateEntitlements: undefined,
        },
      };
      const validatorWithoutCallback = new EntitlementValidator(configWithoutCallback);

      const result = await validatorWithoutCallback.canJoinChannel('tile-1', 'red');

      expect(result.allowed).toBe(true);
    });

    it('should handle validation errors gracefully', async () => {
      mockValidateEntitlements.mockRejectedValue(new Error('Validation error'));

      const result = await validator.canJoinChannel('tile-1', 'red');

      expect(result.allowed).toBe(false);
      expect(result.errorCode).toBe('ENTITLEMENT_ERROR');
    });

    it('should log security event when denied', async () => {
      mockValidateEntitlements.mockResolvedValue(false);
      const mockSecurityEvent = vi.fn();
      mockConfig.callbacks.onSecurityEvent = mockSecurityEvent;

      const result = await validator.canJoinChannel('tile-1', 'red');

      expect(result.allowed).toBe(false);
      expect(mockSecurityEvent).toHaveBeenCalledWith(
        'Channel join denied due to entitlements',
        expect.objectContaining({
          tileId: 'tile-1',
          channelId: 'red',
        }),
      );
    });
  });

  describe('canOpenTile()', () => {
    it('should allow opening tile when entitled', async () => {
      mockValidateEntitlements.mockResolvedValue(true);

      const result = await validator.canOpenTile('chart-app', {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      } as Context);

      expect(result.allowed).toBe(true);
      expect(mockValidateEntitlements).toHaveBeenCalledWith('chart-app', 'open');
    });

    it('should deny opening tile when not entitled', async () => {
      mockValidateEntitlements.mockResolvedValue(false);

      const result = await validator.canOpenTile('chart-app');

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Not entitled to open this application');
      expect(result.errorCode).toBe('ENTITLEMENT_DENIED_OPEN');
    });

    it('should allow when no validation callback configured', async () => {
      const configWithoutCallback = {
        ...mockConfig,
        callbacks: {
          ...mockConfig.callbacks,
          onValidateEntitlements: undefined,
        },
      };
      const validatorWithoutCallback = new EntitlementValidator(configWithoutCallback);

      const result = await validatorWithoutCallback.canOpenTile('chart-app');

      expect(result.allowed).toBe(true);
    });

    it('should handle validation errors gracefully', async () => {
      mockValidateEntitlements.mockRejectedValue(new Error('Validation error'));

      const result = await validator.canOpenTile('chart-app');

      expect(result.allowed).toBe(false);
      expect(result.errorCode).toBe('ENTITLEMENT_ERROR');
    });

    it('should log security event when denied', async () => {
      mockValidateEntitlements.mockResolvedValue(false);
      const mockSecurityEvent = vi.fn();
      mockConfig.callbacks.onSecurityEvent = mockSecurityEvent;

      const result = await validator.canOpenTile('chart-app', {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      } as Context);

      expect(result.allowed).toBe(false);
      expect(mockSecurityEvent).toHaveBeenCalledWith(
        'Tile open denied due to entitlements',
        expect.objectContaining({
          appId: 'chart-app',
          contextType: 'fdc3.chart',
        }),
      );
    });
  });

  describe('error messages', () => {
    it('should return appropriate error messages without exposing sensitive details', async () => {
      mockValidateEntitlements.mockResolvedValue(false);

      const sendResult = await validator.canSendIntent('tile-1', 'ViewChart');
      expect(sendResult.reason).toBeDefined();
      expect(sendResult.reason).not.toContain('password');
      expect(sendResult.reason).not.toContain('token');

      const receiveResult = await validator.canReceiveIntent('tile-1', 'ViewChart');
      expect(receiveResult.reason).toBeDefined();

      const joinResult = await validator.canJoinChannel('tile-1', 'red');
      expect(joinResult.reason).toBeDefined();

      const openResult = await validator.canOpenTile('app-1');
      expect(openResult.reason).toBeDefined();
    });

    it('should return error codes for all denial types', async () => {
      mockValidateEntitlements.mockResolvedValue(false);

      const sendResult = await validator.canSendIntent('tile-1', 'ViewChart');
      expect(sendResult.errorCode).toBe('ENTITLEMENT_DENIED_SEND');

      const receiveResult = await validator.canReceiveIntent('tile-1', 'ViewChart');
      expect(receiveResult.errorCode).toBe('ENTITLEMENT_DENIED_RECEIVE');

      const joinResult = await validator.canJoinChannel('tile-1', 'red');
      expect(joinResult.errorCode).toBe('ENTITLEMENT_DENIED_CHANNEL');

      const openResult = await validator.canOpenTile('app-1');
      expect(openResult.errorCode).toBe('ENTITLEMENT_DENIED_OPEN');
    });

    it('should return ENTITLEMENT_ERROR code for validation errors', async () => {
      mockValidateEntitlements.mockRejectedValue(new Error('Network error'));

      const results = await Promise.all([
        validator.canSendIntent('tile-1', 'ViewChart'),
        validator.canReceiveIntent('tile-1', 'ViewChart'),
        validator.canJoinChannel('tile-1', 'red'),
        validator.canOpenTile('app-1'),
      ]);

      results.forEach((result) => {
        expect(result.allowed).toBe(false);
        expect(result.errorCode).toBe('ENTITLEMENT_ERROR');
      });
    });
  });
});
