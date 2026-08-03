/**
 * useFDC3 Hook Unit Tests
 * @see plan.md#T094
 */

import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { clearBroker, getAgentApi, setBroker } from '../src/agent';
import { AgentProvider, useAppIdentifier, useFDC3 } from '../src/hooks';
import type { AppIdentifier, Channel, Context, DesktopAgent } from '../src/types';

// Mock DesktopAgent
const mockDesktopAgent: DesktopAgent = {
  open: vi.fn().mockResolvedValue({ appId: 'test-app' }),
  findInstances: vi.fn().mockResolvedValue([]),
  getAppMetadata: vi.fn().mockResolvedValue({
    appId: 'test-app',
    name: 'Test App',
    version: '1.0.0',
  }),
  broadcast: vi.fn().mockResolvedValue(undefined),
  addContextListener: vi.fn().mockResolvedValue({
    id: 'listener-1',
    unsubscribe: vi.fn(),
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
    id: 'listener-1',
    unsubscribe: vi.fn(),
  }),
  getOrCreateChannel: vi.fn().mockResolvedValue({
    id: 'test-channel',
    type: 'app',
    broadcast: vi.fn(),
  }),
  createPrivateChannel: vi.fn().mockResolvedValue({
    id: 'private-channel',
    type: 'private',
  }),
  getUserChannels: vi.fn().mockResolvedValue([]),
  joinUserChannel: vi.fn().mockResolvedValue(undefined),
  getCurrentChannel: vi.fn().mockResolvedValue(null),
  leaveCurrentChannel: vi.fn().mockResolvedValue(undefined),
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

describe('useFDC3 hook', () => {
  beforeEach(() => {
    // Set up broker before each test
    setBroker(mockDesktopAgent);
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up broker after each test
    clearBroker();
  });

  describe('with AgentProvider', () => {
    it('renders a diagnostic when a scoped provider starts before the broker', async () => {
      clearBroker();

      render(
        <AgentProvider appIdentifier={{ appId: 'late-app', instanceId: 'late-1' }}>
          <div>Child content</div>
        </AgentProvider>,
      );

      expect(await screen.findByText(/FDC3 Agent not initialized/)).toBeInTheDocument();
      expect(screen.queryByText('Child content')).not.toBeInTheDocument();
    });

    it('recovers when the broker becomes available during the retry window', async () => {
      vi.useFakeTimers();
      clearBroker();
      try {
        render(
          <AgentProvider appIdentifier={{ appId: 'late-app', instanceId: 'late-1' }}>
            <div>Recovered content</div>
          </AgentProvider>,
        );
        setBroker(mockDesktopAgent);

        await act(async () => {
          await vi.advanceTimersByTimeAsync(100);
        });

        expect(screen.getByText('Recovered content')).toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });

    it('continues retrying until the broker becomes available', async () => {
      vi.useFakeTimers();
      clearBroker();
      try {
        render(
          <AgentProvider appIdentifier={{ appId: 'late-app', instanceId: 'late-1' }}>
            <div>Eventually recovered</div>
          </AgentProvider>,
        );

        await act(async () => {
          await vi.advanceTimersByTimeAsync(100);
        });
        expect(screen.queryByText('Eventually recovered')).not.toBeInTheDocument();

        setBroker(mockDesktopAgent);
        await act(async () => {
          await vi.advanceTimersByTimeAsync(100);
        });
        expect(screen.getByText('Eventually recovered')).toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });


    it('stops a pending provider retry after unmount', async () => {
      vi.useFakeTimers();
      clearBroker();
      try {
        const { unmount } = render(
          <AgentProvider appIdentifier={{ appId: 'late-app', instanceId: 'late-1' }}>
            <div />
          </AgentProvider>,
        );
        unmount();
        setBroker(mockDesktopAgent);

        await act(async () => {
          await vi.advanceTimersByTimeAsync(100);
        });
      } finally {
        vi.useRealTimers();
      }
    });

    it('should return DesktopAgent instance from context', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AgentProvider>{children}</AgentProvider>
      );

      const { result } = renderHook(() => useFDC3(), { wrapper });

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current).toEqual(mockDesktopAgent);
      });
    });

    it('should provide the same agent instance to all consumers', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AgentProvider>{children}</AgentProvider>
      );

      const { result: result1 } = renderHook(() => useFDC3(), { wrapper });
      const { result: result2 } = renderHook(() => useFDC3(), { wrapper });

      expect(result1.current).toBe(result2.current);
    });

    it('should allow calling FDC3 methods through the hook', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AgentProvider>{children}</AgentProvider>
      );

      const { result } = renderHook(() => useFDC3(), { wrapper });

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await act(async () => {
        await result.current.raiseIntent('ViewChart', context);
      });

      expect(mockDesktopAgent.raiseIntent).toHaveBeenCalledWith('ViewChart', context);
    });

    it('should keep the broker instance in provider context even if the global broker is cleared', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AgentProvider>{children}</AgentProvider>
      );

      const { result, rerender } = renderHook(() => useFDC3(), { wrapper });

      await waitFor(() => {
        expect(result.current).toBe(mockDesktopAgent);
      });

      clearBroker();

      expect(() => rerender()).not.toThrow();
      expect(result.current).toBe(mockDesktopAgent);
    });

    it('should expose the provider app identifier through useAppIdentifier', async () => {
      const appIdentifier: AppIdentifier = {
        appId: 'chart-tile',
        instanceId: 'chart-tile-1',
      };
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AgentProvider appIdentifier={appIdentifier}>{children}</AgentProvider>
      );

      const { result } = renderHook(() => useAppIdentifier(), { wrapper });

      await waitFor(() => {
        expect(result.current).toEqual(appIdentifier);
      });
    });

    it('should scope FDC3 calls to the provider app identifier', async () => {
      const appIdentifier: AppIdentifier = {
        appId: 'chart-tile',
        instanceId: 'chart-tile-1',
      };
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AgentProvider appIdentifier={appIdentifier}>{children}</AgentProvider>
      );

      const { result } = renderHook(() => useFDC3(), { wrapper });

      const context: Context = {
        type: 'fdc3.instrument',
        id: { ticker: 'AAPL' },
      };

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });

      await act(async () => {
        await result.current.broadcast(context);
      });

      expect(mockDesktopAgent.broadcast).toHaveBeenCalledWith(context, appIdentifier);
    });
  });

  describe('without AgentProvider', () => {
    it('should fallback to getAgentApi when context not available', () => {
      const { result } = renderHook(() => useFDC3());

      expect(result.current).toBeDefined();
      expect(result.current).toEqual(mockDesktopAgent);
    });

    it('should return the same instance as getAgentApi', () => {
      const { result } = renderHook(() => useFDC3());

      expect(result.current).toBe(getAgentApi());
    });
  });

  describe('error handling', () => {
    it('should throw error when broker is not initialized', () => {
      // Clear the broker
      clearBroker();

      expect(() => {
        renderHook(() => useFDC3());
      }).toThrow('FDC3 Agent not initialized');
    });

    it('should throw descriptive error message', () => {
      clearBroker();

      expect(() => {
        renderHook(() => useFDC3());
      }).toThrow(/FDC3 Agent/);
    });
  });

  describe('FDC3 API methods', () => {
    it('should provide access to open() method', async () => {
      const { result } = renderHook(() => useFDC3());

      await act(async () => {
        await result.current.open({ appId: 'test-app' });
      });

      expect(mockDesktopAgent.open).toHaveBeenCalledWith({
        appId: 'test-app',
      });
    });

    it('should provide access to findInstances() method', async () => {
      const { result } = renderHook(() => useFDC3());

      await act(async () => {
        await result.current.findInstances({ appId: 'test-app' });
      });

      expect(mockDesktopAgent.findInstances).toHaveBeenCalledWith({
        appId: 'test-app',
      });
    });

    it('should provide access to getAppMetadata() method', async () => {
      const { result } = renderHook(() => useFDC3());

      await act(async () => {
        await result.current.getAppMetadata({ appId: 'test-app' });
      });

      expect(mockDesktopAgent.getAppMetadata).toHaveBeenCalledWith({
        appId: 'test-app',
      });
    });

    it('should provide access to broadcast() method', async () => {
      const { result } = renderHook(() => useFDC3());

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await act(async () => {
        await result.current.broadcast(context);
      });

      expect(mockDesktopAgent.broadcast).toHaveBeenCalledWith(context);
    });

    it('should provide access to addContextListener() method', async () => {
      const { result } = renderHook(() => useFDC3());

      const handler = vi.fn();

      await act(async () => {
        await result.current.addContextListener('fdc3.chart', handler);
      });

      expect(mockDesktopAgent.addContextListener).toHaveBeenCalledWith('fdc3.chart', handler);
    });

    it('should provide access to findIntent() method', async () => {
      const { result } = renderHook(() => useFDC3());

      await act(async () => {
        await result.current.findIntent('ViewChart');
      });

      expect(mockDesktopAgent.findIntent).toHaveBeenCalledWith('ViewChart');
    });

    it('should provide access to findIntentsByContext() method', async () => {
      const { result } = renderHook(() => useFDC3());

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await act(async () => {
        await result.current.findIntentsByContext(context);
      });

      expect(mockDesktopAgent.findIntentsByContext).toHaveBeenCalledWith(context);
    });

    it('should provide access to raiseIntent() method', async () => {
      const { result } = renderHook(() => useFDC3());

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await act(async () => {
        await result.current.raiseIntent('ViewChart', context);
      });

      expect(mockDesktopAgent.raiseIntent).toHaveBeenCalledWith('ViewChart', context);
    });

    it('should provide access to raiseIntentForContext() method', async () => {
      const { result } = renderHook(() => useFDC3());

      const context: Context = {
        type: 'fdc3.chart',
        id: { ticker: 'AAPL' },
      };

      await act(async () => {
        await result.current.raiseIntentForContext(context);
      });

      expect(mockDesktopAgent.raiseIntentForContext).toHaveBeenCalledWith(context);
    });

    it('should provide access to addIntentListener() method', async () => {
      const { result } = renderHook(() => useFDC3());

      const handler = vi.fn();

      await act(async () => {
        await result.current.addIntentListener('ViewChart', handler);
      });

      expect(mockDesktopAgent.addIntentListener).toHaveBeenCalledWith('ViewChart', handler);
    });

    it('should provide access to getOrCreateChannel() method', async () => {
      const { result } = renderHook(() => useFDC3());

      await act(async () => {
        await result.current.getOrCreateChannel('test-channel');
      });

      expect(mockDesktopAgent.getOrCreateChannel).toHaveBeenCalledWith('test-channel');
    });

    it('should provide access to getUserChannels() method', async () => {
      const { result } = renderHook(() => useFDC3());

      await act(async () => {
        await result.current.getUserChannels();
      });

      expect(mockDesktopAgent.getUserChannels).toHaveBeenCalled();
    });

    it('should provide access to getSystemChannels() method', async () => {
      const { result } = renderHook(() => useFDC3());

      await act(async () => {
        await result.current.getSystemChannels();
      });

      expect(mockDesktopAgent.getSystemChannels).toHaveBeenCalled();
    });

    it('should provide access to joinChannel() method', async () => {
      const { result } = renderHook(() => useFDC3());

      await act(async () => {
        await result.current.joinChannel('channel-id');
      });

      expect(mockDesktopAgent.joinChannel).toHaveBeenCalledWith('channel-id');
    });

    it('should provide access to joinUserChannel() method', async () => {
      const { result } = renderHook(() => useFDC3());

      const mockChannel: Channel = {
        id: 'red',
        type: 'user',
      };

      await act(async () => {
        await result.current.joinUserChannel(mockChannel);
      });

      expect(mockDesktopAgent.joinUserChannel).toHaveBeenCalledWith(mockChannel);
    });

    it('should provide access to getCurrentChannel() method', async () => {
      const { result } = renderHook(() => useFDC3());

      await act(async () => {
        await result.current.getCurrentChannel();
      });

      expect(mockDesktopAgent.getCurrentChannel).toHaveBeenCalled();
    });

    it('should provide access to leaveCurrentChannel() method', async () => {
      const { result } = renderHook(() => useFDC3());

      await act(async () => {
        await result.current.leaveCurrentChannel();
      });

      expect(mockDesktopAgent.leaveCurrentChannel).toHaveBeenCalled();
    });

    it('should provide access to addEventListener() method', async () => {
      const { result } = renderHook(() => useFDC3());

      const handler = vi.fn();

      await act(async () => {
        await result.current.addEventListener('userChannelChanged', handler);
      });

      expect(mockDesktopAgent.addEventListener).toHaveBeenCalledWith('userChannelChanged', handler);
    });

    it('should provide access to getInfo() method', async () => {
      const { result } = renderHook(() => useFDC3());

      await act(async () => {
        await result.current.getInfo();
      });

      expect(mockDesktopAgent.getInfo).toHaveBeenCalled();
    });
  });

  describe('integration with broker', () => {
    it('should reflect changes when broker is updated', () => {
      const { result } = renderHook(() => useFDC3());

      expect(result.current).toBe(mockDesktopAgent);

      // Update broker
      const newBroker = { ...mockDesktopAgent };
      setBroker(newBroker);

      // Re-render to get new value
      const { result: newResult } = renderHook(() => useFDC3());

      expect(newResult.current).toBeDefined();
    });

    it('should work with different broker implementations', () => {
      const customBroker: DesktopAgent = {
        ...mockDesktopAgent,
        getInfo: vi.fn().mockResolvedValue({
          fdc3Version: '2.2',
          provider: 'custom-provider',
          providerVersion: '2.0.0',
        }),
      };

      setBroker(customBroker);

      const { result } = renderHook(() => useFDC3());

      expect(result.current).toEqual(customBroker);
    });
  });

  describe('edge cases', () => {
    it('should handle multiple concurrent calls to the hook', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AgentProvider>{children}</AgentProvider>
      );

      const { result: result1 } = renderHook(() => useFDC3(), { wrapper });
      const { result: result2 } = renderHook(() => useFDC3(), { wrapper });
      const { result: result3 } = renderHook(() => useFDC3(), { wrapper });

      expect(result1.current).toBe(result2.current);
      expect(result2.current).toBe(result3.current);
    });

    it('should handle re-renders correctly', () => {
      const { result, rerender } = renderHook(() => useFDC3());

      const firstInstance = result.current;

      rerender();

      const secondInstance = result.current;

      expect(firstInstance).toBe(secondInstance);
    });
  });
});
