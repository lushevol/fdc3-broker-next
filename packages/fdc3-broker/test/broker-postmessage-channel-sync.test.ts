/**
 * Broker Channel Sync Unit Tests for PostMessage bridge
 */

import { MockAppDirectoryService } from '../../fdc3-app-directory/src/mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type { BrokerConfig, Channel, Context } from '../src/types';

describe('Broker Channel Sync with PostMessage', () => {
  let broker: Broker;
  let mockConfig: BrokerConfig;
  let mockPostMessageBridge: {
    isEnabled: ReturnType<typeof vi.fn>;
    joinUserChannel: ReturnType<typeof vi.fn>;
    broadcast: ReturnType<typeof vi.fn>;
    getUserChannels: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    const mockAppDirectory = new MockAppDirectoryService();

    mockConfig = {
      appDirectory: mockAppDirectory,
      callbacks: {
        onLoginStatusCheck: async () => true,
        onTileOpen: async (app) => ({ appId: app.appId, instanceId: `${app.appId}-1` }),
        onValidateEntitlements: async () => true,
        onShowResolverUI: async (targets) => targets[0] || null,
        onSecurityEvent: () => undefined,
      },
      enableDebug: false,
      userChannelIds: ['red', 'green', 'blue'],
      enablePostMessageBridge: true,
      postMessageBridgeOptions: {
        allowedOrigins: ['http://example.com'],
      },
    };

    mockPostMessageBridge = {
      isEnabled: vi.fn(() => true),
      joinUserChannel: vi.fn().mockResolvedValue(undefined),
      broadcast: vi.fn().mockResolvedValue(undefined),
      getUserChannels: vi.fn().mockResolvedValue([]),
    };

    broker = new Broker(mockConfig);

    const brokerInternals = broker as unknown as {
      getOpenFinBridge: () => Promise<unknown>;
      getPostMessageBridge: () => Promise<typeof mockPostMessageBridge>;
    };

    vi.spyOn(brokerInternals, 'getOpenFinBridge').mockResolvedValue(null);
    vi.spyOn(brokerInternals, 'getPostMessageBridge').mockResolvedValue(mockPostMessageBridge);
  });

  describe('joinUserChannel() sync', () => {
    it('should sync channel join with PostMessage', async () => {
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      await broker.joinUserChannel('red', source);

      expect(mockPostMessageBridge.joinUserChannel).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'red', type: 'user' }),
      );
    });
  });

  describe('broadcast() sync', () => {
    it('should sync broadcast with PostMessage', async () => {
      broker.registerTile('tile-1', 'test-app');
      const source = { appId: 'test-app', instanceId: 'tile-1' };

      await broker.joinUserChannel('red', source);
      mockPostMessageBridge.broadcast.mockClear();

      const context: Context = {
        type: 'fdc3.instrument',
        id: { ticker: 'AAPL' },
      };

      await broker.broadcast(context, source);

      expect(mockPostMessageBridge.broadcast).toHaveBeenCalledWith(context, 'red');
    });
  });

  describe('getUserChannels() merge', () => {
    it('should include PostMessage-only channels', async () => {
      const postMessageChannel: Channel = {
        id: 'external-postmessage',
        type: 'user',
        displayMetadata: { name: 'External PostMessage', color: '#FFFFFF' },
        broadcast: vi.fn(),
        getCurrentContext: vi.fn(),
        addContextListener: vi.fn(),
      };

      mockPostMessageBridge.getUserChannels.mockResolvedValue([postMessageChannel]);

      const channels = await broker.getUserChannels();
      const channelIds = channels.map((channel) => channel.id);

      expect(channelIds).toContain('red');
      expect(channelIds).toContain('green');
      expect(channelIds).toContain('blue');
      expect(channelIds).toContain('external-postmessage');
    });

    it('should not duplicate channels that exist internally and through PostMessage', async () => {
      const postMessageChannel: Channel = {
        id: 'red',
        type: 'user',
        displayMetadata: { name: 'Remote Red Channel', color: '#FF0000' },
        broadcast: vi.fn(),
        getCurrentContext: vi.fn(),
        addContextListener: vi.fn(),
      };

      mockPostMessageBridge.getUserChannels.mockResolvedValue([postMessageChannel]);

      const channels = await broker.getUserChannels();
      const redChannels = channels.filter((channel) => channel.id === 'red');

      expect(redChannels).toHaveLength(1);
    });
  });
});
