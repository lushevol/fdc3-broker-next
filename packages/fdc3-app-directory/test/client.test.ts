/**
 * AppDirectoryClientImpl Unit Tests
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppDirectoryClientImpl } from '../src/client';
import type { AppDefinition } from '../src/types';

// Mock fetch
global.fetch = vi.fn();

describe('AppDirectoryClientImpl', () => {
  let client: AppDirectoryClientImpl;
  const mockToken = 'test-auth-token';

  const mockChartApp: AppDefinition = {
    appId: 'my-chart-app',
    name: 'Advanced Chart',
    version: '1.0.0',
    title: 'Chart',
    description: 'Financial charting application',
    categories: ['Analytics'],
    interop: {
      intents: {
        listensFor: [
          {
            intent: 'ViewChart',
            contexts: ['fdc3.instrument'],
          },
        ],
      },
    },
  };

  beforeEach(() => {
    client = new AppDirectoryClientImpl({
      baseUrl: 'https://app-directory.example.com/api',
      getAuthToken: () => mockToken,
      timeout: 5000,
    });

    // Clear fetch mocks
    vi.mocked(fetch).mockClear();
  });

  describe('getAllApps', () => {
    it('should fetch all apps', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockChartApp],
      } as Response);

      const apps = await client.getAllApps();

      expect(fetch).toHaveBeenCalledWith(
        'https://app-directory.example.com/api/v2/apps',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        }),
      );
      expect(apps).toEqual([mockChartApp]);
    });

    it('should handle authentication error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ message: 'Invalid token' }),
      } as Response);

      await expect(client.getAllApps()).rejects.toThrow('Unauthorized');
    });
  });

  describe('getApp', () => {
    it('should fetch app by ID', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockChartApp,
      } as Response);

      const app = await client.getApp('my-chart-app');

      expect(fetch).toHaveBeenCalledWith(
        'https://app-directory.example.com/api/v2/apps/my-chart-app',
        expect.objectContaining({
          method: 'GET',
        }),
      );
      expect(app).toEqual(mockChartApp);
    });

    it('should return null when app not found (404)', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'App not found' }),
      } as Response);

      const app = await client.getApp('non-existent');

      expect(app).toBeNull();
    });
  });

  describe('findByIntent', () => {
    it('should fetch apps by intent type', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockChartApp],
      } as Response);

      const apps = await client.findByIntent('ViewChart');

      expect(fetch).toHaveBeenCalledWith(
        'https://app-directory.example.com/api/v2/apps?intent=ViewChart',
        expect.objectContaining({
          method: 'GET',
        }),
      );
      expect(apps).toEqual([mockChartApp]);
    });
  });

  describe('findByContextType', () => {
    it('should fetch apps by context type', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockChartApp],
      } as Response);

      const apps = await client.findByContextType('fdc3.instrument');

      expect(fetch).toHaveBeenCalledWith(
        'https://app-directory.example.com/api/v2/apps?contextType=fdc3.instrument',
        expect.objectContaining({
          method: 'GET',
        }),
      );
      expect(apps).toEqual([mockChartApp]);
    });
  });

  describe('findByCategory', () => {
    it('should fetch apps by category', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockChartApp],
      } as Response);

      const apps = await client.findByCategory('Analytics');

      expect(fetch).toHaveBeenCalledWith(
        'https://app-directory.example.com/api/v2/apps?category=Analytics',
        expect.objectContaining({
          method: 'GET',
        }),
      );
      expect(apps).toEqual([mockChartApp]);
    });
  });

  describe('error handling', () => {
    it('should handle 500 error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Server error' }),
      } as Response);

      await expect(client.getAllApps()).rejects.toThrow('Internal Server Error');
    });

    it('should handle timeout', async () => {
      // Create a client with short timeout
      const shortTimeoutClient = new AppDirectoryClientImpl({
        baseUrl: 'https://app-directory.example.com/api',
        timeout: 100,
      });

      // Mock fetch to hang
      vi.mocked(fetch).mockImplementationOnce(
        (url, options) =>
          new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
              resolve({
                ok: true,
                json: async () => [],
              } as Response);
            }, 200);

            if (options && typeof options === 'object' && 'signal' in options) {
              const signal = (options as any).signal;
              if (signal) {
                signal.addEventListener('abort', () => {
                  clearTimeout(timer);
                  const error = new Error('The operation was aborted');
                  error.name = 'AbortError';
                  reject(error);
                });
              }
            }
          }),
      );

      await expect(shortTimeoutClient.getAllApps()).rejects.toThrow('timeout');
    });
  });
});
