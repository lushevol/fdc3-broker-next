/**
 * PostMessage Bridge Tests
 *
 * Unit tests for PostMessage bridge functionality including:
 * - Message protocol serialization
 * - Intent raising and receiving
 * - Origin validation
 * - Timeout handling
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PostMessageBridge,
  type PostMessageBridgeOptions,
  type PostMessageRequest,
  type PostMessageResponse,
} from '../src/postmessage-bridge';

// Mock window and postMessage
const mockPostMessage = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

describe('PostMessageBridge', () => {
  let messageHandler: ((event: MessageEvent) => void) | null = null;

  beforeEach(() => {
    // Setup window mock
    vi.stubGlobal('window', {
      postMessage: mockPostMessage,
      addEventListener: (event: string, handler: (event: MessageEvent) => void) => {
        if (event === 'message') {
          messageHandler = handler;
        }
        mockAddEventListener(event, handler);
      },
      removeEventListener: mockRemoveEventListener,
      location: { origin: 'http://localhost:3000' },
      parent: { postMessage: mockPostMessage },
      opener: null,
    });

    // Clear mocks
    mockPostMessage.mockClear();
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
    messageHandler = null;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('initialization', () => {
    it('should initialize with valid options', () => {
      const options: PostMessageBridgeOptions = {
        allowedOrigins: ['http://example.com'],
      };

      const bridge = new PostMessageBridge(options);

      expect(bridge.isEnabled()).toBe(true);
      expect(mockAddEventListener).toHaveBeenCalledWith('message', expect.any(Function));
    });

    it('should disable bridge with empty allowedOrigins', () => {
      const options: PostMessageBridgeOptions = {
        allowedOrigins: [],
      };

      const bridge = new PostMessageBridge(options);

      expect(bridge.isEnabled()).toBe(false);
    });

    it('should use default timeout of 5000ms', () => {
      const options: PostMessageBridgeOptions = {
        allowedOrigins: ['http://example.com'],
      };

      const bridge = new PostMessageBridge(options);

      expect(bridge.isEnabled()).toBe(true);
    });

    it('should accept custom timeout', () => {
      const options: PostMessageBridgeOptions = {
        allowedOrigins: ['http://example.com'],
        timeout: 10000,
      };

      const bridge = new PostMessageBridge(options);

      expect(bridge.isEnabled()).toBe(true);
    });
  });

  describe('origin validation', () => {
    it('should ignore messages from disallowed origins', () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://allowed.com'],
      });

      const mockHandler = vi.fn();
      bridge.subscribeToIntents(mockHandler, ['ViewChart']);

      // Simulate message from disallowed origin
      const event = new MessageEvent('message', {
        data: {
          type: 'fdc3-pm-event',
          correlationId: '123',
          method: 'intentEvent',
          payload: { intent: 'ViewChart', context: { type: 'test' } },
          meta: {
            timestamp: new Date().toISOString(),
            origin: 'http://evil.com',
          },
        },
        origin: 'http://evil.com',
      });

      messageHandler?.(event);

      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should process messages from allowed origins', () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://allowed.com'],
      });

      const mockHandler = vi.fn();
      bridge.subscribeToIntents(mockHandler, ['ViewChart']);

      // Simulate message from allowed origin
      const event = new MessageEvent('message', {
        data: {
          type: 'fdc3-pm-event',
          correlationId: '123',
          method: 'intentEvent',
          payload: { intent: 'ViewChart', context: { type: 'test' } },
          meta: {
            timestamp: new Date().toISOString(),
            origin: 'http://allowed.com',
          },
        },
        origin: 'http://allowed.com',
      });

      messageHandler?.(event);

      expect(mockHandler).toHaveBeenCalledWith('ViewChart', { type: 'test' }, undefined);
    });
  });

  describe('subscribeToIntents', () => {
    it('should register intent handler', () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const mockHandler = vi.fn();
      bridge.subscribeToIntents(mockHandler, ['ViewChart', 'CreateOrder']);

      // Verify no errors thrown
      expect(bridge.isEnabled()).toBe(true);
    });

    it('should skip subscription when bridge is disabled', () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: [],
      });

      const mockHandler = vi.fn();
      bridge.subscribeToIntents(mockHandler, ['ViewChart']);

      // Should not throw
      expect(bridge.isEnabled()).toBe(false);
    });
  });

  describe('raiseIntentExternal', () => {
    it('should throw when bridge is disabled', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: [],
      });

      await expect(bridge.raiseIntentExternal('ViewChart', { type: 'test' })).rejects.toThrow(
        'PostMessage bridge is not enabled',
      );
    });

    it('should send request to parent window', async () => {
      vi.useFakeTimers();

      const bridge = new PostMessageBridge({
        allowedOrigins: ['*'],
      });

      // Start the intent raising (will timeout, but we verify the message was sent)
      const promise = bridge.raiseIntentExternal(
        'ViewChart',
        { type: 'fdc3.instrument' },
        undefined,
        '*',
      );

      // Verify postMessage was called
      expect(mockPostMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'fdc3-pm-request',
          method: 'raiseIntent',
          payload: {
            intent: 'ViewChart',
            context: { type: 'fdc3.instrument' },
            target: undefined,
          },
        }),
        '*',
      );

      // Advance timer to trigger timeout
      vi.advanceTimersByTime(5001);

      // Should timeout since no response
      await expect(promise).rejects.toThrow('Request timed out');

      vi.useRealTimers();
    });

    it('should also broadcast wildcard requests to an opener window when present', async () => {
      vi.useFakeTimers();
      const openerPostMessage = vi.fn();
      window.opener = { postMessage: openerPostMessage };

      const bridge = new PostMessageBridge({
        allowedOrigins: ['*'],
      });

      const promise = bridge.raiseIntentExternal('ViewChart', { type: 'fdc3.instrument' });

      expect(openerPostMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'fdc3-pm-request',
          method: 'raiseIntent',
        }),
        '*',
      );

      vi.advanceTimersByTime(5001);
      await expect(promise).rejects.toThrow('Request timed out');
      vi.useRealTimers();
    });

    it('should reject when target origin is not allowlisted', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      await expect(
        bridge.raiseIntentExternal(
          'ViewChart',
          { type: 'fdc3.instrument' },
          undefined,
          'http://evil.com',
        ),
      ).rejects.toThrow('Origin not allowed: http://evil.com');
      expect(mockPostMessage).not.toHaveBeenCalled();
    });

    it('should resolve on success response', async () => {
      vi.useFakeTimers();

      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      // Start request
      const promise = bridge.raiseIntentExternal(
        'ViewChart',
        { type: 'test' },
        undefined,
        'http://example.com',
      );

      // Get the correlation ID from the sent message
      const sentMessage = mockPostMessage.mock.calls[0][0] as PostMessageRequest;

      // Simulate success response
      const response: PostMessageResponse = {
        type: 'fdc3-pm-response',
        correlationId: sentMessage.correlationId,
        method: 'raiseIntent',
        success: true,
        payload: {
          source: { appId: 'external-app' },
          intent: 'ViewChart',
          getResult: () => Promise.resolve(),
        },
        meta: {
          timestamp: new Date().toISOString(),
          origin: 'http://example.com',
        },
      };

      const event = new MessageEvent('message', {
        data: response,
        origin: 'http://example.com',
      });

      messageHandler?.(event);

      const result = await promise;
      expect(result.source.appId).toBe('external-app');

      vi.useRealTimers();
    });

    it('should reject on failed remote responses', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const promise = bridge.raiseIntentExternal(
        'ViewChart',
        { type: 'test' },
        undefined,
        'http://example.com',
      );
      const sentMessage = mockPostMessage.mock.calls[0][0] as PostMessageRequest;

      messageHandler?.(
        new MessageEvent('message', {
          data: {
            type: 'fdc3-pm-response',
            correlationId: sentMessage.correlationId,
            method: 'raiseIntent',
            success: false,
            error: 'remote intent failed',
            meta: {
              timestamp: new Date().toISOString(),
              origin: 'http://example.com',
            },
          },
          origin: 'http://example.com',
        }),
      );

      await expect(promise).rejects.toThrow('remote intent failed');
    });
  });

  describe('open', () => {
    it('should throw when bridge is disabled', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: [],
      });

      await expect(bridge.open('my-app')).rejects.toThrow('PostMessage bridge is not enabled');
    });

    it('should send open request', async () => {
      vi.useFakeTimers();

      const bridge = new PostMessageBridge({
        allowedOrigins: ['*'],
      });

      const promise = bridge.open('my-app', { type: 'test' }, '*');

      expect(mockPostMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'fdc3-pm-request',
          method: 'open',
          payload: {
            app: { appId: 'my-app' },
            context: { type: 'test' },
          },
        }),
        '*',
      );

      // Advance timer to trigger timeout
      vi.advanceTimersByTime(5001);

      // Will timeout
      await expect(promise).rejects.toThrow('Request timed out');

      vi.useRealTimers();
    });

    it('should resolve open requests with the returned app identifier', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const promise = bridge.open(
        { appId: 'my-app', instanceId: 'requested-instance' },
        { type: 'fdc3.instrument' },
        'http://example.com',
      );
      const sentMessage = mockPostMessage.mock.calls[0][0] as PostMessageRequest;

      messageHandler?.(
        new MessageEvent('message', {
          data: {
            type: 'fdc3-pm-response',
            correlationId: sentMessage.correlationId,
            method: 'open',
            success: true,
            payload: { appId: 'my-app', instanceId: 'opened-instance' },
            meta: {
              timestamp: new Date().toISOString(),
              origin: 'http://example.com',
            },
          },
          origin: 'http://example.com',
        }),
      );

      await expect(promise).resolves.toEqual({
        appId: 'my-app',
        instanceId: 'opened-instance',
      });
    });
  });

  describe('findIntent', () => {
    it('should return empty result when disabled', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: [],
      });

      const result = await bridge.findIntent('ViewChart');

      expect(result).toEqual({
        intent: { name: 'ViewChart', displayName: 'ViewChart' },
        apps: [],
      });
    });

    it('should send findIntent requests and return successful remote results', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const promise = bridge.findIntent(
        'ViewChart',
        { type: 'fdc3.instrument' },
        'http://example.com',
      );
      const sentMessage = mockPostMessage.mock.calls[0][0] as PostMessageRequest;
      const response = {
        intent: { name: 'ViewChart', displayName: 'View Chart' },
        apps: [{ appId: 'chart-app', name: 'Chart App' }],
      };

      expect(sentMessage).toEqual(
        expect.objectContaining({
          method: 'findIntent',
          payload: { intent: 'ViewChart', context: { type: 'fdc3.instrument' } },
        }),
      );

      messageHandler?.(
        new MessageEvent('message', {
          data: {
            type: 'fdc3-pm-response',
            correlationId: sentMessage.correlationId,
            method: 'findIntent',
            success: true,
            payload: response,
            meta: {
              timestamp: new Date().toISOString(),
              origin: 'http://example.com',
            },
          },
          origin: 'http://example.com',
        }),
      );

      await expect(promise).resolves.toEqual(response);
    });

    it('should return an empty result when remote findIntent fails', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const promise = bridge.findIntent('ViewChart', undefined, 'http://example.com');
      const sentMessage = mockPostMessage.mock.calls[0][0] as PostMessageRequest;

      messageHandler?.(
        new MessageEvent('message', {
          data: {
            type: 'fdc3-pm-response',
            correlationId: sentMessage.correlationId,
            method: 'findIntent',
            success: false,
            error: 'directory unavailable',
            meta: {
              timestamp: new Date().toISOString(),
              origin: 'http://example.com',
            },
          },
          origin: 'http://example.com',
        }),
      );

      await expect(promise).resolves.toEqual({
        intent: { name: 'ViewChart', displayName: 'ViewChart' },
        apps: [],
      });
    });
  });

  describe('findIntentsByContext', () => {
    it('should return empty array when disabled', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: [],
      });

      const result = await bridge.findIntentsByContext({ type: 'test' });

      expect(result).toEqual([]);
    });

    it('should send findIntentsByContext requests and return successful remote results', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const context = { type: 'fdc3.instrument' };
      const promise = bridge.findIntentsByContext(context, 'http://example.com');
      const sentMessage = mockPostMessage.mock.calls[0][0] as PostMessageRequest;
      const response = [{ intent: { name: 'ViewChart', displayName: 'View Chart' }, apps: [] }];

      expect(sentMessage).toEqual(
        expect.objectContaining({
          method: 'findIntentsByContext',
          payload: { context },
        }),
      );

      messageHandler?.(
        new MessageEvent('message', {
          data: {
            type: 'fdc3-pm-response',
            correlationId: sentMessage.correlationId,
            method: 'findIntentsByContext',
            success: true,
            payload: response,
            meta: {
              timestamp: new Date().toISOString(),
              origin: 'http://example.com',
            },
          },
          origin: 'http://example.com',
        }),
      );

      await expect(promise).resolves.toEqual(response);
    });

    it('should return an empty list when remote findIntentsByContext fails', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const promise = bridge.findIntentsByContext(
        { type: 'fdc3.instrument' },
        'http://example.com',
      );
      const sentMessage = mockPostMessage.mock.calls[0][0] as PostMessageRequest;

      messageHandler?.(
        new MessageEvent('message', {
          data: {
            type: 'fdc3-pm-response',
            correlationId: sentMessage.correlationId,
            method: 'findIntentsByContext',
            success: false,
            error: 'directory unavailable',
            meta: {
              timestamp: new Date().toISOString(),
              origin: 'http://example.com',
            },
          },
          origin: 'http://example.com',
        }),
      );

      await expect(promise).resolves.toEqual([]);
    });
  });

  describe('channel operations', () => {
    it('joinUserChannel should reject when the bridge is disabled', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: [],
      });

      await expect(bridge.joinUserChannel('red')).rejects.toThrow(
        'PostMessage bridge is not enabled',
      );
    });

    it('joinUserChannel should send a channel join request', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const promise = bridge.joinUserChannel('red', 'http://example.com');
      const sentMessage = mockPostMessage.mock.calls[0][0] as PostMessageRequest;

      expect(mockPostMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'fdc3-pm-request',
          method: 'joinUserChannel',
          payload: { channelId: 'red' },
        }),
        'http://example.com',
      );

      const response: PostMessageResponse = {
        type: 'fdc3-pm-response',
        correlationId: sentMessage.correlationId,
        method: 'joinUserChannel',
        success: true,
        payload: undefined,
        meta: {
          timestamp: new Date().toISOString(),
          origin: 'http://example.com',
        },
      };

      messageHandler?.(
        new MessageEvent('message', {
          data: response,
          origin: 'http://example.com',
        }),
      );

      await expect(promise).resolves.toBeUndefined();
    });

    it('joinUserChannel should send channel object IDs', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const channel = {
        id: 'green',
        type: 'user',
        displayMetadata: { name: 'Green Channel', color: '#00FF00' },
      };

      const promise = bridge.joinUserChannel(channel, 'http://example.com');
      const sentMessage = mockPostMessage.mock.calls[0][0] as PostMessageRequest;

      expect(sentMessage).toEqual(
        expect.objectContaining({
          method: 'joinUserChannel',
          payload: { channelId: 'green' },
        }),
      );

      messageHandler?.(
        new MessageEvent('message', {
          data: {
            type: 'fdc3-pm-response',
            correlationId: sentMessage.correlationId,
            method: 'joinUserChannel',
            success: true,
            payload: undefined,
            meta: {
              timestamp: new Date().toISOString(),
              origin: 'http://example.com',
            },
          },
          origin: 'http://example.com',
        }),
      );

      await expect(promise).resolves.toBeUndefined();
    });

    it('joinUserChannel should use the first allowlisted origin by default', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const promise = bridge.joinUserChannel('blue');
      const sentMessage = mockPostMessage.mock.calls[0][0] as PostMessageRequest;

      expect(mockPostMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'joinUserChannel',
          payload: { channelId: 'blue' },
        }),
        'http://example.com',
      );

      messageHandler?.(
        new MessageEvent('message', {
          data: {
            type: 'fdc3-pm-response',
            correlationId: sentMessage.correlationId,
            method: 'joinUserChannel',
            success: true,
            payload: undefined,
            meta: {
              timestamp: new Date().toISOString(),
              origin: 'http://example.com',
            },
          },
          origin: 'http://example.com',
        }),
      );

      await expect(promise).resolves.toBeUndefined();
    });

    it('broadcast should reject when the bridge is disabled', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: [],
      });

      await expect(bridge.broadcast({ type: 'fdc3.instrument' })).rejects.toThrow(
        'PostMessage bridge is not enabled',
      );
    });

    it('broadcast should send context and channel ID', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const context = { type: 'fdc3.instrument', id: { ticker: 'AAPL' } };
      const promise = bridge.broadcast(context, 'red', 'http://example.com');
      const sentMessage = mockPostMessage.mock.calls[0][0] as PostMessageRequest;

      expect(mockPostMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'fdc3-pm-request',
          method: 'broadcast',
          payload: {
            context,
            channelId: 'red',
          },
        }),
        'http://example.com',
      );

      messageHandler?.(
        new MessageEvent('message', {
          data: {
            type: 'fdc3-pm-response',
            correlationId: sentMessage.correlationId,
            method: 'broadcast',
            success: true,
            payload: undefined,
            meta: {
              timestamp: new Date().toISOString(),
              origin: 'http://example.com',
            },
          },
          origin: 'http://example.com',
        }),
      );

      await expect(promise).resolves.toBeUndefined();
    });

    it('getCurrentChannel should return the remote current channel', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const channel = {
        id: 'red',
        type: 'user',
        displayMetadata: { name: 'Red Channel', color: '#FF0000' },
      };
      const promise = bridge.getCurrentChannel('http://example.com');
      const sentMessage = mockPostMessage.mock.calls[0][0] as PostMessageRequest;

      expect(sentMessage).toEqual(
        expect.objectContaining({
          method: 'getCurrentChannel',
          payload: {},
        }),
      );

      messageHandler?.(
        new MessageEvent('message', {
          data: {
            type: 'fdc3-pm-response',
            correlationId: sentMessage.correlationId,
            method: 'getCurrentChannel',
            success: true,
            payload: channel,
            meta: {
              timestamp: new Date().toISOString(),
              origin: 'http://example.com',
            },
          },
          origin: 'http://example.com',
        }),
      );

      await expect(promise).resolves.toEqual(channel);
    });

    it('getCurrentChannel should return null when the remote request fails', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const promise = bridge.getCurrentChannel('http://example.com');
      const sentMessage = mockPostMessage.mock.calls[0][0] as PostMessageRequest;

      messageHandler?.(
        new MessageEvent('message', {
          data: {
            type: 'fdc3-pm-response',
            correlationId: sentMessage.correlationId,
            method: 'getCurrentChannel',
            success: false,
            error: 'no current channel',
            meta: {
              timestamp: new Date().toISOString(),
              origin: 'http://example.com',
            },
          },
          origin: 'http://example.com',
        }),
      );

      await expect(promise).resolves.toBeNull();
    });

    it('getCurrentChannel should return null when disabled', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: [],
      });

      await expect(bridge.getCurrentChannel()).resolves.toBeNull();
    });

    it('getUserChannels should return remote user channels', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const channels = [
        {
          id: 'red',
          type: 'user',
          displayMetadata: { name: 'Red Channel', color: '#FF0000' },
        },
        {
          id: 'green',
          type: 'user',
          displayMetadata: { name: 'Green Channel', color: '#00FF00' },
        },
      ];
      const promise = bridge.getUserChannels('http://example.com');
      const sentMessage = mockPostMessage.mock.calls[0][0] as PostMessageRequest;

      expect(sentMessage).toEqual(
        expect.objectContaining({
          method: 'getUserChannels',
          payload: {},
        }),
      );

      messageHandler?.(
        new MessageEvent('message', {
          data: {
            type: 'fdc3-pm-response',
            correlationId: sentMessage.correlationId,
            method: 'getUserChannels',
            success: true,
            payload: channels,
            meta: {
              timestamp: new Date().toISOString(),
              origin: 'http://example.com',
            },
          },
          origin: 'http://example.com',
        }),
      );

      await expect(promise).resolves.toEqual(channels);
    });

    it('getUserChannels should return an empty list when the remote request fails', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const promise = bridge.getUserChannels('http://example.com');
      const sentMessage = mockPostMessage.mock.calls[0][0] as PostMessageRequest;

      messageHandler?.(
        new MessageEvent('message', {
          data: {
            type: 'fdc3-pm-response',
            correlationId: sentMessage.correlationId,
            method: 'getUserChannels',
            success: false,
            error: 'channels unavailable',
            meta: {
              timestamp: new Date().toISOString(),
              origin: 'http://example.com',
            },
          },
          origin: 'http://example.com',
        }),
      );

      await expect(promise).resolves.toEqual([]);
    });

    it('getUserChannels should return an empty list when disabled', async () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: [],
      });

      await expect(bridge.getUserChannels()).resolves.toEqual([]);
    });
  });

  describe('destroy', () => {
    it('should clean up resources', () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      bridge.destroy();

      expect(bridge.isEnabled()).toBe(false);
      expect(mockRemoveEventListener).toHaveBeenCalledWith('message', expect.any(Function));
    });

    it('should reject pending requests on destroy', async () => {
      vi.useFakeTimers();

      const bridge = new PostMessageBridge({
        allowedOrigins: ['*'],
      });

      const promise = bridge.raiseIntentExternal('ViewChart', { type: 'test' });

      // Destroy while request is pending
      bridge.destroy();

      await expect(promise).rejects.toThrow('Bridge destroyed');

      vi.useRealTimers();
    });
  });

  describe('message protocol', () => {
    it('should ignore non-FDC3 messages', () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const mockHandler = vi.fn();
      bridge.subscribeToIntents(mockHandler, ['ViewChart']);

      // Send non-FDC3 message
      const event = new MessageEvent('message', {
        data: { type: 'some-other-message', data: 'test' },
        origin: 'http://example.com',
      });

      messageHandler?.(event);

      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should ignore messages without required fields', () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const mockHandler = vi.fn();
      bridge.subscribeToIntents(mockHandler, ['ViewChart']);

      // Send incomplete FDC3 message
      const event = new MessageEvent('message', {
        data: { type: 'fdc3-pm-event' }, // Missing correlationId and method
        origin: 'http://example.com',
      });

      messageHandler?.(event);

      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should ignore non-object message data', () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const mockHandler = vi.fn();
      bridge.subscribeToIntents(mockHandler, ['ViewChart']);

      messageHandler?.(
        new MessageEvent('message', {
          data: null,
          origin: 'http://example.com',
        }),
      );

      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should ignore incoming request envelopes', () => {
      const bridge = new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      const mockHandler = vi.fn();
      bridge.subscribeToIntents(mockHandler, ['ViewChart']);

      messageHandler?.(
        new MessageEvent('message', {
          data: {
            type: 'fdc3-pm-request',
            correlationId: 'incoming-request',
            method: 'raiseIntent',
            payload: { intent: 'ViewChart', context: { type: 'fdc3.instrument' } },
            meta: {
              timestamp: new Date().toISOString(),
              origin: 'http://example.com',
            },
          },
          origin: 'http://example.com',
        }),
      );

      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should handle response for unknown correlation ID', () => {
      new PostMessageBridge({
        allowedOrigins: ['http://example.com'],
      });

      // Should not throw
      const response: PostMessageResponse = {
        type: 'fdc3-pm-response',
        correlationId: 'unknown-id',
        method: 'raiseIntent',
        success: true,
        payload: {},
        meta: {
          timestamp: new Date().toISOString(),
          origin: 'http://example.com',
        },
      };

      const event = new MessageEvent('message', {
        data: response,
        origin: 'http://example.com',
      });

      expect(() => messageHandler?.(event)).not.toThrow();
    });
  });
});
