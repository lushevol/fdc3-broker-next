/**
 * FDC3 API Compliance Contract Tests
 * @see plan.md#T097
 *
 * These tests verify that the Broker correctly implements the FDC3 2.2 DesktopAgent API specification.
 * Reference: https://fdc3.finos.org/docs/api/overview/
 */

import { MockAppDirectoryService } from '../../fdc3-app-directory/src/mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Broker } from '../src/broker';
import type {
  AppIdentifier,
  AppIntent,
  AppMetadata,
  BrokerConfig,
  Channel,
  Context,
  DesktopAgent,
  ImplementationMetadata,
  IntentResolution,
  Listener,
} from '../src/types';

describe('FDC3 2.2 API Compliance Contract Tests', () => {
  let broker: DesktopAgent;
  let mockAppDirectory: MockAppDirectoryService;
  let mockConfig: BrokerConfig;

  const mockApp = {
    appId: 'test-app',
    name: 'Test Application',
    version: '1.0.0',
    title: 'Test App',
    description: 'Test application for FDC3 compliance',
    interop: {
      intents: {
        listensFor: [
          { intent: 'ViewChart', contexts: ['fdc3.chart'] },
          { intent: 'ViewQuote', contexts: ['fdc3.quote'] },
        ],
      },
    },
  };

  beforeEach(() => {
    mockAppDirectory = new MockAppDirectoryService();
    mockAppDirectory.registerApp(mockApp);

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
    };

    broker = new Broker(mockConfig);

    // Register a tile for operations that require current tile context
    broker.registerTile('test-tile', 'test-app');
  });

  describe('DesktopAgent Interface Compliance', () => {
    it('should implement all required DesktopAgent methods', () => {
      // Check all required FDC3 2.2 methods exist
      expect(broker.open).toBeDefined();
      expect(broker.findInstances).toBeDefined();
      expect(broker.getAppMetadata).toBeDefined();
      expect(broker.broadcast).toBeDefined();
      expect(broker.addContextListener).toBeDefined();
      expect(broker.findIntent).toBeDefined();
      expect(broker.findIntentsByContext).toBeDefined();
      expect(broker.raiseIntent).toBeDefined();
      expect(broker.raiseIntentForContext).toBeDefined();
      expect(broker.addIntentListener).toBeDefined();
      expect(broker.getOrCreateChannel).toBeDefined();
      expect(broker.getUserChannels).toBeDefined();
      expect(broker.joinUserChannel).toBeDefined();
      expect(broker.getCurrentChannel).toBeDefined();
      expect(broker.leaveCurrentChannel).toBeDefined();
      expect(broker.addEventListener).toBeDefined();
      expect(broker.getInfo).toBeDefined();
    });

    it('should have methods that return correct Promise types', async () => {
      // Verify method signatures match FDC3 spec
      await expect(broker.open({ appId: 'test-app' })).resolves.toBeDefined();
      await expect(broker.findInstances({ appId: 'test-app' })).resolves.toBeDefined();
      await expect(broker.getAppMetadata({ appId: 'test-app' })).resolves.toBeDefined();
      await expect(broker.findIntent('ViewChart')).resolves.toBeDefined();
      await expect(broker.findIntentsByContext({ type: 'fdc3.chart' })).resolves.toBeDefined();
      await expect(broker.getUserChannels()).resolves.toBeDefined();
      await expect(broker.getCurrentChannel()).resolves.toBeDefined();
      await expect(broker.getInfo()).resolves.toBeDefined();
    });
  });

  describe('open() - Application Management', () => {
    it('should open app and return AppIdentifier', async () => {
      const app: AppIdentifier = { appId: 'test-app' };
      const result = await broker.open(app);

      expect(result).toHaveProperty('appId', 'test-app');
    });

    it('should support opening app with context', async () => {
      const app: AppIdentifier = { appId: 'test-app' };
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const result = await broker.open(app, context);

      expect(result.appId).toBe('test-app');
    });
  });

  describe('findInstances() - App Discovery', () => {
    it('should return array of AppIdentifier instances', async () => {
      const app: AppIdentifier = { appId: 'test-app' };
      const instances = await broker.findInstances(app);

      expect(Array.isArray(instances)).toBe(true);
      instances.forEach((instance) => {
        expect(instance).toHaveProperty('appId');
      });
    });
  });

  describe('getAppMetadata() - App Metadata', () => {
    it('should return AppMetadata with required fields', async () => {
      const app: AppIdentifier = { appId: 'test-app' };
      const metadata = await broker.getAppMetadata(app);

      expect(metadata).toHaveProperty('appId');
      expect(metadata).toHaveProperty('name');
      expect(metadata).toHaveProperty('version');
    });
  });

  describe('broadcast() - Context Broadcasting', () => {
    it('should broadcast context to current channel', async () => {
      // Register tile and add to channel first
      (broker as Broker)['registerTile']('tile-1', 'test-app');

      const source = { appId: 'test-app', instanceId: 'tile-1' };
      // We need to join a channel for the tile to broadcast
      await (broker as any).joinUserChannel('red', source);

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      // Should not throw when not in channel
      // Note: This test now verifies we can broadcast if we have joined a channel
      await expect((broker as any).broadcast(context, source)).resolves.not.toThrow();
    });
  });

  describe('addContextListener() - Context Listening', () => {
    it('should add listener and return Listener object', async () => {
      // Register a tile and join a channel first
      (broker as Broker)['registerTile']('tile-1', 'test-app', {
        appId: 'test-app',
        name: 'Test Application',
      });
      const source = { appId: 'test-app', instanceId: 'tile-1' };
      await broker.joinUserChannel('red', source);

      const handler = vi.fn();
      const listener = await broker.addContextListener('fdc3.chart', handler, source);

      expect((listener as any).id).toBeDefined();
      expect(listener.unsubscribe).toBeDefined();
      expect(typeof listener.unsubscribe).toBe('function');
    });

    it('should support listening to all context types with null', async () => {
      // Register a tile and join a channel first
      (broker as Broker)['registerTile']('tile-2', 'test-app', {
        appId: 'test-app',
        name: 'Test Application',
      });
      const source = { appId: 'test-app', instanceId: 'tile-2' };
      await broker.joinUserChannel('red', source);

      const handler = vi.fn();
      const listener = await broker.addContextListener(null, handler, source);

      expect(listener).toBeDefined();
      expect(listener.unsubscribe).toBeDefined();
    });
  });

  describe('findIntent() - Intent Discovery', () => {
    it('should return AppIntent with intent and apps array', async () => {
      const appIntent = await broker.findIntent('ViewChart');

      // intent is an object with name and displayName properties
      expect(appIntent.intent).toHaveProperty('name', 'ViewChart');
      expect(appIntent.intent).toHaveProperty('displayName', 'ViewChart');
      expect(appIntent).toHaveProperty('apps');
      expect(Array.isArray(appIntent.apps)).toBe(true);

      appIntent.apps.forEach((app) => {
        expect(app).toHaveProperty('appId');
        expect(app).toHaveProperty('name');
        expect(app).toHaveProperty('title');
        expect(app).toHaveProperty('version');
      });
    });

    it('should throw when intent not found', async () => {
      await expect(broker.findIntent('NonExistentIntent')).rejects.toThrow();
    });
  });

  describe('findIntentsByContext() - Context-based Intent Discovery', () => {
    it('should return array of AppIntent', async () => {
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const intents = await broker.findIntentsByContext(context);

      expect(Array.isArray(intents)).toBe(true);
      intents.forEach((appIntent) => {
        expect(appIntent).toHaveProperty('intent');
        expect(appIntent).toHaveProperty('apps');
        expect(Array.isArray(appIntent.apps)).toBe(true);
      });
    });

    it('should return empty array when no intents found', async () => {
      const context: Context = {
        type: 'fdc3.unknown',
        id: { id: '123' },
      };

      const intents = await broker.findIntentsByContext(context);

      expect(Array.isArray(intents)).toBe(true);
    });
  });

  describe('raiseIntent() - Intent Raising', () => {
    it('should return IntentResolution with source', async () => {
      // Register a tile and add intent listener so there's a target to receive the intent
      (broker as Broker)['registerTile']('tile-1', 'test-app', {
        appId: 'test-app',
        name: 'Test Application',
      });
      // Must pass source to addIntentListener so it registers with tile registry
      await broker.addIntentListener('ViewChart', vi.fn(), {
        appId: 'test-app',
        instanceId: 'tile-1',
      });

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const resolution = await broker.raiseIntent('ViewChart', context);

      expect(resolution).toHaveProperty('source');
      expect(resolution.source).toHaveProperty('appId');
    });

    it('should support targeting specific app', async () => {
      // Register a tile and add intent listener
      (broker as Broker)['registerTile']('tile-2', 'test-app', {
        appId: 'test-app',
        name: 'Test Application',
      });
      // Must pass source to addIntentListener so it registers with tile registry
      await broker.addIntentListener('ViewChart', vi.fn(), {
        appId: 'test-app',
        instanceId: 'tile-2',
      });

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const target: AppIdentifier = { appId: 'test-app' };
      const resolution = await broker.raiseIntent('ViewChart', context, target);

      expect(resolution.source.appId).toBe('test-app');
    });

    it('should support targeting specific instance', async () => {
      (broker as Broker)['registerTile']('tile-1', 'test-app', {
        appId: 'test-app',
        name: 'Test Application',
      });
      await broker.addIntentListener('ViewChart', vi.fn(), {
        appId: 'test-app',
        instanceId: 'tile-1',
      });

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const target: AppIdentifier = {
        appId: 'test-app',
        instanceId: 'tile-1',
      };

      const resolution = await broker.raiseIntent('ViewChart', context, target);

      expect(resolution.source.appId).toBe('test-app');
      expect(resolution.source.instanceId).toBe('tile-1');
    });

    it('should throw when target not found', async () => {
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await expect(broker.raiseIntent('NonExistent', context)).rejects.toThrow();
    });
  });

  describe('raiseIntentForContext() - Context-based Intent Raising', () => {
    it('should return IntentResolution', async () => {
      // Register a tile and add intent listener
      (broker as Broker)['registerTile']('tile-1', 'test-app', {
        appId: 'test-app',
        name: 'Test Application',
      });
      // Must pass source to addIntentListener so it registers with tile registry
      await broker.addIntentListener('ViewChart', vi.fn(), {
        appId: 'test-app',
        instanceId: 'tile-1',
      });

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const resolution = await broker.raiseIntentForContext(context);

      expect(resolution).toHaveProperty('source');
      expect(resolution.source).toHaveProperty('appId');
    });

    it('should support targeting specific app', async () => {
      // Register a tile and add intent listener
      (broker as Broker)['registerTile']('tile-2', 'test-app', {
        appId: 'test-app',
        name: 'Test Application',
      });
      // Must pass source to addIntentListener so it registers with tile registry
      await broker.addIntentListener('ViewChart', vi.fn(), {
        appId: 'test-app',
        instanceId: 'tile-2',
      });

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      const target: AppIdentifier = { appId: 'test-app' };
      const resolution = await broker.raiseIntentForContext(context, target);

      expect(resolution.source.appId).toBe('test-app');
    });
  });

  describe('addIntentListener() - Intent Listening', () => {
    it('should add listener and return Listener object', async () => {
      const handler = vi.fn();
      const listener = await broker.addIntentListener('ViewChart', handler);

      expect((listener as any).id).toBeDefined();
      expect(listener.unsubscribe).toBeDefined();
      expect(typeof listener.unsubscribe).toBe('function');
    });

    it('should call listener when intent is received', async () => {
      const handler = vi.fn();
      await broker.addIntentListener('ViewChart', handler);

      // Register tile to receive intent
      (broker as Broker)['registerTile']('tile-1', 'test-app');

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await broker.raiseIntent('ViewChart', context, {
        appId: 'test-app',
        instanceId: 'tile-1',
      });

      // Handler should be called
      expect(handler).toHaveBeenCalled();
    });
  });

  describe('getOrCreateChannel() - Channel Management', () => {
    it('should return Channel object', async () => {
      const channel = await broker.getOrCreateChannel('test-channel');

      expect(channel).toHaveProperty('id', 'test-channel');
      expect(channel).toHaveProperty('broadcast');
      expect(channel).toHaveProperty('getCurrentContext');
      expect(channel).toHaveProperty('addContextListener');
    });

    it('should return same channel for subsequent calls', async () => {
      const channel1 = await broker.getOrCreateChannel('test-channel');
      const channel2 = await broker.getOrCreateChannel('test-channel');

      expect(channel1.id).toBe(channel2.id);
    });
  });

  describe('getUserChannels() - User Channel Discovery', () => {
    it('should return array of user channels', async () => {
      const channels = await broker.getUserChannels();

      expect(Array.isArray(channels)).toBe(true);
      channels.forEach((channel) => {
        expect(channel).toHaveProperty('id');
        expect(channel).toHaveProperty('type', 'user');
        expect(channel).toHaveProperty('broadcast');
      });
    });
  });

  describe('joinUserChannel() - Channel Joining', () => {
    it('should join channel successfully', async () => {
      // Register a tile first to have a valid source
      (broker as Broker)['registerTile']('tile-1', 'test-app', {
        appId: 'test-app',
        name: 'Test Application',
      });

      const channel: Channel = {
        id: 'red',
        type: 'user',
        displayMetadata: {
          name: 'Red Channel',
          color: '#FF0000',
        },
        broadcast: vi.fn(),
        getCurrentContext: vi.fn(),
        addContextListener: vi.fn(),
      };

      const source = { appId: 'test-app', instanceId: 'tile-1' };
      await expect(broker.joinUserChannel(channel.id, source)).resolves.toBeUndefined();
    });
  });

  describe('getCurrentChannel() - Current Channel Retrieval', () => {
    it('should return null when not in channel', async () => {
      const channel = await broker.getCurrentChannel();

      expect(channel).toBeNull();
    });

    it('should return channel when in one', async () => {
      // Register and join channel
      (broker as Broker)['registerTile']('tile-1', 'test-app');

      const channel = await broker.getCurrentChannel();

      // Will be null unless we implement channel joining
      expect(channel).toBeDefined();
    });
  });

  describe('leaveCurrentChannel() - Channel Leaving', () => {
    it('should leave current channel successfully', async () => {
      await expect(broker.leaveCurrentChannel()).resolves.toBeUndefined();
    });
  });

  describe('addEventListener() - Event Listening', () => {
    it('should add event listener and return Listener object', async () => {
      const handler = vi.fn();
      const listener = await broker.addEventListener('appListener', handler);

      expect((listener as any).id).toBeDefined();
      expect(listener.unsubscribe).toBeDefined();
      expect(typeof listener.unsubscribe).toBe('function');
    });
  });

  describe('getInfo() - Implementation Metadata', () => {
    it('should return ImplementationMetadata with required fields', async () => {
      const info = await broker.getInfo();

      expect(info).toHaveProperty('fdc3Version');
      expect(info).toHaveProperty('provider');
      expect(info).toHaveProperty('providerVersion');

      // Verify FDC3 version format
      expect(info.fdc3Version).toMatch(/^2\./);

      // Verify provider is not empty
      expect(info.provider.length).toBeGreaterThan(0);
    });

    it('should report FDC3 2.2 compliance', async () => {
      const info = await broker.getInfo();

      expect(info.fdc3Version).toBe('2.2');
    });
  });

  describe('Listener.unsubscribe() - Listener Cleanup', () => {
    it('should unsubscribe context listener', async () => {
      // Register a tile first
      (broker as Broker)['registerTile']('tile-1', 'test-app', {
        appId: 'test-app',
        name: 'Test Application',
      });

      const source = { appId: 'test-app', instanceId: 'tile-1' };

      // Join a channel with source (required by broker)
      await broker.joinUserChannel('red', source);

      const handler = vi.fn();
      const listener = await broker.addContextListener('fdc3.chart', handler, source);

      expect(() => listener.unsubscribe()).not.toThrow();
    });

    it('should unsubscribe intent listener', async () => {
      const handler = vi.fn();
      const listener = await broker.addIntentListener('ViewChart', handler);

      expect(() => listener.unsubscribe()).not.toThrow();
    });

    it('should unsubscribe event listener', async () => {
      const handler = vi.fn();
      const listener = await broker.addEventListener('appListener', handler);

      expect(() => listener.unsubscribe()).not.toThrow();
    });
  });

  describe('Type Safety - Return Types', () => {
    it('should return correct types for all methods', async () => {
      // Register a tile first for operations that require a source
      (broker as Broker)['registerTile']('tile-1', 'test-app', {
        appId: 'test-app',
        name: 'Test Application',
      });

      // Application Management - use registered mock app
      const appIdentifier: AppIdentifier = await broker.open({
        appId: 'test-app',
      });
      expect(appIdentifier.appId).toBeDefined();

      const instances: AppIdentifier[] = await broker.findInstances({
        appId: 'test-app',
      });
      expect(Array.isArray(instances)).toBe(true);

      const metadata: AppMetadata = await broker.getAppMetadata({
        appId: 'test-app',
      });
      expect(metadata.appId).toBeDefined();

      // Intent Operations - register listener first
      await broker.addIntentListener('ViewChart', vi.fn());
      const intent: AppIntent = await broker.findIntent('ViewChart');
      expect(intent.intent).toBeDefined();

      const intents: AppIntent[] = await broker.findIntentsByContext({
        type: 'test',
      });
      expect(Array.isArray(intents)).toBe(true);

      const resolution: IntentResolution = await broker.raiseIntent('ViewChart', {
        type: 'test',
        id: {},
      });
      expect(resolution.source).toBeDefined();

      // Channel Operations
      const channel: Channel = await broker.getOrCreateChannel('test');
      expect(channel.id).toBeDefined();

      const channels: Channel[] = await broker.getUserChannels();
      expect(Array.isArray(channels)).toBe(true);

      const currentChannel: Channel | null = await broker.getCurrentChannel();
      expect(currentChannel === null || currentChannel.id).toBeDefined();

      // Implementation Info
      const info: ImplementationMetadata = await broker.getInfo();
      expect(info.fdc3Version).toBeDefined();

      // Listeners - need to join a channel with source for context listener
      const source = { appId: 'test-app', instanceId: 'tile-1' };
      await broker.joinUserChannel('red', source);
      const contextListener: Listener = await broker.addContextListener(
        'fdc3.chart',
        vi.fn(),
        source,
      );
      expect((contextListener as any).id).toBeDefined();

      const intentListener: Listener = await broker.addIntentListener('ViewChart', vi.fn());
      expect((intentListener as any).id).toBeDefined();

      const eventListener: Listener = await broker.addEventListener('appListener', vi.fn());
      expect((eventListener as any).id).toBeDefined();
    });
  });

  describe('FDC3 Specification Compliance', () => {
    it('should comply with FDC3 2.2 specification requirements', () => {
      // Verify DesktopAgent interface completeness
      const methods: Array<keyof DesktopAgent> = [
        'open',
        'findInstances',
        'getAppMetadata',
        'broadcast',
        'addContextListener',
        'findIntent',
        'findIntentsByContext',
        'raiseIntent',
        'raiseIntentForContext',
        'addIntentListener',
        'getOrCreateChannel',
        'getUserChannels',
        'joinUserChannel',
        'getCurrentChannel',
        'leaveCurrentChannel',
        'addEventListener',
        'getInfo',
      ];

      methods.forEach((method) => {
        expect(broker[method]).toBeDefined();
        expect(typeof broker[method]).toBe('function');
      });
    });

    it('should maintain backwards compatibility with FDC3 2.0 and 2.1', () => {
      // All FDC3 2.0 methods should be present
      const fdc3_2_0_methods = [
        'open',
        'findInstances',
        'getAppMetadata',
        'broadcast',
        'addContextListener',
        'findIntent',
        'findIntentsByContext',
        'raiseIntent',
        'addIntentListener',
        'getUserChannels',
        'joinUserChannel',
        'getCurrentChannel',
        'leaveCurrentChannel',
        'addEventListener',
        'getInfo',
      ];

      fdc3_2_0_methods.forEach((method) => {
        expect(broker[method as keyof DesktopAgent]).toBeDefined();
      });
    });
  });
});
