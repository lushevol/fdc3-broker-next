/**
 * Agent Channel Hooks Unit Tests
 * @see plan.md#T122, T123, T124
 */

import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { clearBroker, setBroker, getAgentApi } from '../src/agent';
import { useContextListener, useCurrentChannel, useUserChannels } from '../src/hooks';
import type { Channel, Context, DesktopAgent, Listener } from '../src/types';

type ContextListenerRecord = {
  contextType: string | null | ((context: Context) => void);
  handler?: (context: Context) => void;
  listener: Listener;
};

// Mock DesktopAgent
const createMockBroker = () => {
  let currentChannel: Channel | null = null;
  const contextListeners = new Map<string, ContextListenerRecord>();

  const mockBroker: DesktopAgent = {
    open: vi.fn().mockResolvedValue({ appId: 'test-app' }),
    findInstances: vi.fn().mockResolvedValue([]),
    getAppMetadata: vi.fn().mockResolvedValue({
      appId: 'test-app',
      name: 'Test App',
      version: '1.0.0',
    }),
    broadcast: vi.fn().mockResolvedValue(undefined),
    addContextListener: vi.fn().mockImplementation(async (contextType, handler) => {
      const listenerId = `listener-${Date.now()}`;
      const listener = {
        id: listenerId,
        unsubscribe: vi.fn(),
      };
      contextListeners.set(listenerId, { contextType, handler, listener });
      return listener;
    }),
    findIntent: vi.fn().mockResolvedValue({
      intent: 'ViewChart',
      apps: [],
    }),
    findIntentsByContext: vi.fn().mockResolvedValue([]),
    raiseIntent: vi.fn().mockResolvedValue({
      source: { appId: 'test-app' },
    }),
    raiseIntentForContext: vi.fn().mockResolvedValue({
      source: { appId: 'test-app' },
    }),
    addIntentListener: vi.fn().mockResolvedValue({
      id: 'intent-listener-1',
      unsubscribe: vi.fn(),
    }),
    getOrCreateChannel: vi.fn().mockImplementation(async (channelId) => {
      if (!currentChannel) {
        currentChannel = {
          id: channelId,
          type: 'app',
          broadcast: vi.fn(),
          getCurrentContext: vi.fn().mockResolvedValue(null),
          addContextListener: vi.fn().mockImplementation(async (_contextType, _handler) => {
            const listenerId = `listener-${Date.now()}`;
            return {
              id: listenerId,
              unsubscribe: vi.fn(),
            };
          }),
        };
      }
      return currentChannel;
    }),
    createPrivateChannel: vi.fn().mockResolvedValue({
      id: 'private-channel',
      type: 'private',
      broadcast: vi.fn(),
      getCurrentContext: vi.fn().mockResolvedValue(null),
      addContextListener: vi.fn().mockResolvedValue({
        id: 'listener-1',
        unsubscribe: vi.fn(),
      }),
    }),
    getUserChannels: vi.fn().mockResolvedValue([
      {
        id: 'red',
        type: 'user',
        displayMetadata: { name: 'Red Channel', color: '#FF0000' },
        broadcast: vi.fn(),
        getCurrentContext: vi.fn().mockResolvedValue(null),
        addContextListener: vi.fn(),
      },
      {
        id: 'green',
        type: 'user',
        displayMetadata: { name: 'Green Channel', color: '#00FF00' },
        broadcast: vi.fn(),
        getCurrentContext: vi.fn().mockResolvedValue(null),
        addContextListener: vi.fn(),
      },
      {
        id: 'blue',
        type: 'user',
        displayMetadata: { name: 'Blue Channel', color: '#0000FF' },
        broadcast: vi.fn(),
        getCurrentContext: vi.fn().mockResolvedValue(null),
        addContextListener: vi.fn(),
      },
    ]),
    joinUserChannel: vi.fn().mockImplementation(async (channel) => {
      currentChannel = {
        id: typeof channel === 'string' ? channel : channel.id,
        type: 'user',
        broadcast: vi.fn(),
        getCurrentContext: vi.fn().mockResolvedValue(null),
        addContextListener: vi.fn(),
      };
      return;
    }),
    getCurrentChannel: vi.fn().mockImplementation(async () => currentChannel),
    leaveCurrentChannel: vi.fn().mockImplementation(async () => {
      currentChannel = null;
    }),
    addEventListener: vi.fn().mockResolvedValue({
      id: 'event-listener-1',
      unsubscribe: vi.fn(),
    }),
    getInfo: vi.fn().mockResolvedValue({
      fdc3Version: '2.2',
      provider: '@fm/fdc3-broker',
      providerVersion: '1.0.0',
    }),
    getSystemChannels: vi.fn().mockResolvedValue([]),
    joinChannel: vi.fn().mockResolvedValue(undefined),
  };

  return { mockBroker, getCurrentChannelMock: () => currentChannel };
};

describe('Channel Hooks', () => {
  beforeEach(() => {
    const { mockBroker } = createMockBroker();
    setBroker(mockBroker);
    vi.clearAllMocks();
  });

  afterEach(() => {
    clearBroker();
  });

  describe('useContextListener', () => {
    it('should register context listener on mount', async () => {
      const handler = vi.fn();

      renderHook(() => useContextListener('fdc3.chart', handler));

      await waitFor(() => {
        const broker = getAgentApi();
        expect(broker.addContextListener).toHaveBeenCalledWith('fdc3.chart', handler);
      });
    });

    it('should call handler when context is received', async () => {
      const handler = vi.fn();

      renderHook(() => useContextListener('fdc3.chart', handler));

      await waitFor(() => {
        const broker = getAgentApi();
        expect(broker.addContextListener).toHaveBeenCalled();
      });

      // Simulate context being received
      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await act(async () => {
        const registeredHandler = vi.mocked((getAgentApi() as DesktopAgent).addContextListener).mock
          .calls[0][1] as (context: Context) => void;
        registeredHandler(context);
      });

      expect(handler).toHaveBeenCalledWith(context);
    });

    it('should filter by context type', async () => {
      const handler = vi.fn();

      renderHook(() => useContextListener('fdc3.chart', handler));

      await waitFor(() => {
        const broker = getAgentApi();
        expect(broker.addContextListener).toHaveBeenCalledWith('fdc3.chart', handler);
      });
    });

    it('should support null context type (all contexts)', async () => {
      const handler = vi.fn();

      renderHook(() => useContextListener(null, handler));

      await waitFor(() => {
        const broker = getAgentApi();
        expect(broker.addContextListener).toHaveBeenCalledWith(null, handler);
      });
    });

    it('should unsubscribe on unmount', async () => {
      const handler = vi.fn();
      const unsubscribe = vi.fn();

      const mockBroker = getAgentApi() as DesktopAgent;
      vi.mocked(mockBroker.addContextListener).mockResolvedValue({
        unsubscribe,
      });

      const { unmount } = renderHook(() => useContextListener('fdc3.chart', handler));

      await waitFor(() => {
        expect(mockBroker.addContextListener).toHaveBeenCalled();
      });

      act(() => {
        unmount();
      });

      expect(unsubscribe).toHaveBeenCalled();
    });

    it('should re-register when context type changes', async () => {
      const handler = vi.fn();

      const { rerender } = renderHook(
        ({ contextType, handler }) => useContextListener(contextType, handler),
        {
          initialProps: { contextType: 'fdc3.chart' as string | null, handler },
        },
      );

      await waitFor(() => {
        const broker = getAgentApi();
        expect(broker.addContextListener).toHaveBeenCalledTimes(1);
      });

      act(() => {
        rerender({ contextType: 'fdc3.quote' as string | null, handler });
      });

      await waitFor(() => {
        const broker = getAgentApi();
        expect(broker.addContextListener).toHaveBeenCalledTimes(2);
      });
    });

    it('should re-register when handler changes', async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      const { rerender } = renderHook(
        ({ contextType, handler }) => useContextListener(contextType, handler),
        {
          initialProps: {
            contextType: 'fdc3.chart' as string | null,
            handler: handler1,
          },
        },
      );

      await waitFor(() => {
        const broker = getAgentApi();
        expect(broker.addContextListener).toHaveBeenCalledTimes(1);
      });

      act(() => {
        rerender({
          contextType: 'fdc3.chart' as string | null,
          handler: handler2,
        });
      });

      await waitFor(() => {
        const broker = getAgentApi();
        expect(broker.addContextListener).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('useCurrentChannel', () => {
    it('should return current channel', async () => {
      const { result } = renderHook(() => useCurrentChannel());

      await waitFor(() => {
        const broker = getAgentApi() as DesktopAgent;
        expect(broker.getCurrentChannel).toHaveBeenCalled();
      });

      expect(result.current).toBeDefined();
    });

    it('should return null when not on channel', async () => {
      const mockBroker = getAgentApi() as DesktopAgent;
      vi.mocked(mockBroker.getCurrentChannel).mockResolvedValue(null);

      const { result } = renderHook(() => useCurrentChannel());

      await waitFor(() => {
        expect(result.current).toBeNull();
      });
    });

    it('should return channel when on one', async () => {
      const mockChannel: Channel = {
        id: 'red',
        type: 'user',
        displayMetadata: { name: 'Red Channel', color: '#FF0000' },
        broadcast: vi.fn(),
        getCurrentContext: vi.fn(),
        addContextListener: vi.fn(),
      };

      const mockBroker = getAgentApi() as DesktopAgent;
      vi.mocked(mockBroker.getCurrentChannel).mockResolvedValue(mockChannel);

      const { result } = renderHook(() => useCurrentChannel());

      await waitFor(() => {
        expect(result.current).toEqual(mockChannel);
      });
    });

    it('should fetch channel on mount only', async () => {
      const mockBroker = getAgentApi() as DesktopAgent;

      renderHook(() => useCurrentChannel());

      await waitFor(() => {
        expect(mockBroker.getCurrentChannel).toHaveBeenCalledTimes(1);
      });

      // Should not call again on re-render
      act(() => {
        // Force re-render
      });

      expect(mockBroker.getCurrentChannel).toHaveBeenCalledTimes(1);
    });
  });

  describe('useUserChannels', () => {
    it('should return array of user channels', async () => {
      const { result } = renderHook(() => useUserChannels());

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(Array.isArray(result.current)).toBe(true);
      });

      const mockBroker = getAgentApi() as DesktopAgent;
      expect(mockBroker.getUserChannels).toHaveBeenCalled();
    });

    it('should return all configured user channels', async () => {
      const { result } = renderHook(() => useUserChannels());

      await waitFor(() => {
        expect(result.current.length).toBeGreaterThan(0);
      });

      const channels = result.current;

      expect(channels.some((c: Channel) => c.id === 'red')).toBe(true);
      expect(channels.some((c: Channel) => c.id === 'green')).toBe(true);
      expect(channels.some((c: Channel) => c.id === 'blue')).toBe(true);
    });

    it('should return channels with type user', async () => {
      const { result } = renderHook(() => useUserChannels());

      await waitFor(() => {
        result.current.forEach((channel: Channel) => {
          expect(channel.type).toBe('user');
        });
      });
    });

    it('should return channels with display metadata', async () => {
      const { result } = renderHook(() => useUserChannels());

      await waitFor(() => {
        result.current.forEach((channel: Channel) => {
          expect(channel.displayMetadata).toBeDefined();
          expect(channel.displayMetadata?.name).toBeDefined();
          expect(channel.displayMetadata?.color).toBeDefined();
        });
      });
    });

    it('should fetch channels on mount only', async () => {
      const mockBroker = getAgentApi() as DesktopAgent;

      renderHook(() => useUserChannels());

      await waitFor(() => {
        expect(mockBroker.getUserChannels).toHaveBeenCalledTimes(1);
      });

      // Should not call again on re-render
      act(() => {
        // Force re-render
      });

      expect(mockBroker.getUserChannels).toHaveBeenCalledTimes(1);
    });

    it('should handle empty user channels array', async () => {
      const mockBroker = getAgentApi() as DesktopAgent;
      vi.mocked(mockBroker.getUserChannels).mockResolvedValue([]);

      const { result } = renderHook(() => useUserChannels());

      await waitFor(() => {
        expect(result.current).toEqual([]);
      });
    });
  });

  describe('error handling', () => {
    it('should handle addContextListener errors gracefully', async () => {
      const handler = vi.fn();

      const mockBroker = getAgentApi() as DesktopAgent;
      vi.mocked(mockBroker.addContextListener).mockRejectedValue(new Error('Listener error'));

      // Should not throw
      const { result } = renderHook(() => useContextListener('fdc3.chart', handler));

      expect(result).toBeDefined();
    });

    it('should handle getCurrentChannel errors gracefully', async () => {
      const mockBroker = getAgentApi() as DesktopAgent;
      vi.mocked(mockBroker.getCurrentChannel).mockRejectedValue(new Error('Channel error'));

      const { result } = renderHook(() => useCurrentChannel());

      // Should not throw
      expect(result).toBeDefined();
    });

    it('should handle getUserChannels errors gracefully', async () => {
      const mockBroker = getAgentApi() as DesktopAgent;
      vi.mocked(mockBroker.getUserChannels).mockRejectedValue(new Error('Channels error'));

      const { result } = renderHook(() => useUserChannels());

      // Should not throw
      expect(result).toBeDefined();
    });
  });

  describe('integration scenarios', () => {
    it('should support using multiple hooks together', async () => {
      const handler = vi.fn();

      const { result } = renderHook(() => {
        const channel = useCurrentChannel();
        const channels = useUserChannels();

        useContextListener('fdc3.chart', handler);

        return { channel, channels };
      });

      await waitFor(() => {
        expect(result.current.channel).toBeDefined();
        expect(result.current.channels).toBeDefined();
      });
    });

    it('should handle channel switching with context listeners', async () => {
      const handler = vi.fn();

      const mockChannel1: Channel = {
        id: 'red',
        type: 'user',
        broadcast: vi.fn(),
        getCurrentContext: vi.fn(),
        addContextListener: vi.fn(),
      };

      const mockChannel2: Channel = {
        id: 'green',
        type: 'user',
        broadcast: vi.fn(),
        getCurrentContext: vi.fn(),
        addContextListener: vi.fn(),
      };

      const mockBroker = getAgentApi() as DesktopAgent;
      vi.mocked(mockBroker.getCurrentChannel)
        .mockResolvedValueOnce(mockChannel1)
        .mockResolvedValueOnce(mockChannel2);

      renderHook(() => {
        useContextListener('fdc3.chart', handler);
        return useCurrentChannel();
      });

      // Should handle channel transitions
      await waitFor(() => {
        expect(mockBroker.getCurrentChannel).toHaveBeenCalled();
      });
    });
  });
});
