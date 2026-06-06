import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppDirectoryClientImpl } from '../src/client';
import type { AppDefinition } from '../src/types';

// Mock fetch
global.fetch = vi.fn();

describe('AppDirectoryClientImpl - Modes', () => {
  let client: AppDirectoryClientImpl;

  const localApp: AppDefinition = {
    appId: 'local-app',
    name: 'Local App',
    version: '1.0.0',
    categories: ['Local'],
    interop: {
      intents: {
        listensFor: [{ intent: 'ViewChart', contexts: ['fdc3.instrument'] }],
      },
    },
  };

  const commonAppLocal: AppDefinition = {
    appId: 'common-app',
    name: 'Common App',
    version: '1.0.0',
    categories: ['Common'],
    interop: {},
  };

  const commonAppRemote: AppDefinition = {
    appId: 'common-app',
    name: 'Common App',
    version: '2.0.0', // Newer version
    categories: ['Common', 'Remote'],
    interop: {},
  };

  const remoteApp: AppDefinition = {
    appId: 'remote-app',
    name: 'Remote App',
    version: '1.0.0',
    categories: ['Remote'],
    interop: {},
  };

  beforeEach(() => {
    vi.mocked(fetch).mockClear();
  });

  describe('Mode: remote-only (Default)', () => {
    it('should ignore local apps and fetch only remote', async () => {
      client = new AppDirectoryClientImpl({
        baseUrl: 'https://api.example.com',
        localApps: [localApp],
        // Default mode is remote-only
      });

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => [remoteApp],
      } as Response);

      const apps = await client.getAllApps();
      expect(apps).toHaveLength(1);
      expect(apps).toContainEqual(remoteApp);
      expect(apps).not.toContainEqual(localApp);
    });

    it('should throw error on remote failure', async () => {
      client = new AppDirectoryClientImpl({
        baseUrl: 'https://api.example.com',
        localApps: [localApp],
        mode: 'remote-only',
      });

      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network'));
      await expect(client.getAllApps()).rejects.toThrow('Network');
    });

    it('should throw remote query errors for intent, context, and category lookups', async () => {
      client = new AppDirectoryClientImpl({
        baseUrl: 'https://api.example.com',
        localApps: [localApp],
        mode: 'remote-only',
      });

      vi.mocked(fetch)
        .mockRejectedValueOnce(new Error('Intent network'))
        .mockRejectedValueOnce(new Error('Context network'))
        .mockRejectedValueOnce(new Error('Category network'));

      await expect(client.findByIntent('ViewChart')).rejects.toThrow('Intent network');
      await expect(client.findByContextType('fdc3.instrument')).rejects.toThrow('Context network');
      await expect(client.findByCategory('Local')).rejects.toThrow('Category network');
    });

    it('should rethrow non-Error getApp failures', async () => {
      client = new AppDirectoryClientImpl({
        baseUrl: 'https://api.example.com',
        localApps: [localApp],
        mode: 'remote-only',
      });

      vi.mocked(fetch).mockRejectedValueOnce('network-string');

      await expect(client.getApp('local-app')).rejects.toBe('network-string');
    });
  });

  describe('Mode: local-only', () => {
    beforeEach(() => {
      client = new AppDirectoryClientImpl({
        baseUrl: 'https://api.example.com',
        localApps: [localApp, commonAppLocal],
        mode: 'local-only',
      });
    });

    it('should return only local apps without network call', async () => {
      const apps = await client.getAllApps();
      expect(fetch).not.toHaveBeenCalled();
      expect(apps).toHaveLength(2);
      expect(apps).toContainEqual(localApp);
    });

    it('should return local app by ID', async () => {
      const app = await client.getApp('local-app');
      expect(fetch).not.toHaveBeenCalled();
      expect(app).toEqual(localApp);
    });

    it('should return null for missing app', async () => {
      const app = await client.getApp('remote-app');
      expect(app).toBeNull();
    });

    it('should filter local apps by intent without a network call', async () => {
      const apps = await client.findByIntent('ViewChart');

      expect(fetch).not.toHaveBeenCalled();
      expect(apps).toEqual([localApp]);
    });

    it('should filter local apps by context type without a network call', async () => {
      const apps = await client.findByContextType('fdc3.instrument');

      expect(fetch).not.toHaveBeenCalled();
      expect(apps).toEqual([localApp]);
    });

    it('should filter local apps by category without a network call', async () => {
      const apps = await client.findByCategory('Local');

      expect(fetch).not.toHaveBeenCalled();
      expect(apps).toEqual([localApp]);
    });
  });

  describe('Mode: local-first (Hybrid)', () => {
    it('should merge local and remote apps, preferring remote', async () => {
      client = new AppDirectoryClientImpl({
        baseUrl: 'https://api.example.com',
        localApps: [localApp, commonAppLocal],
        mode: 'local-first',
      });

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => [commonAppRemote, remoteApp],
      } as Response);

      const apps = await client.getAllApps();

      expect(apps).toHaveLength(3);
      expect(apps).toContainEqual(localApp); // Only local
      expect(apps).toContainEqual(remoteApp); // Only remote
      expect(apps).toContainEqual(commonAppRemote); // Merged (remote version)
    });

    it('should fallback to local apps on remote error', async () => {
      client = new AppDirectoryClientImpl({
        baseUrl: 'https://api.example.com',
        localApps: [localApp],
        mode: 'local-first',
      });

      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network'));

      const apps = await client.getAllApps();
      expect(apps).toContainEqual(localApp);
    });

    it('should return local app on remote not found', async () => {
      client = new AppDirectoryClientImpl({
        baseUrl: 'https://api.example.com',
        localApps: [localApp],
        mode: 'local-first',
      });

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'APP_NOT_FOUND' }),
      } as Response);

      await expect(client.getApp('local-app')).resolves.toEqual(localApp);
    });

    it('should fallback to a local app on non-404 remote getApp errors', async () => {
      client = new AppDirectoryClientImpl({
        baseUrl: 'https://api.example.com',
        localApps: [localApp],
        mode: 'local-first',
      });

      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network'));

      await expect(client.getApp('local-app')).resolves.toEqual(localApp);
    });

    it('should merge matching local and remote intent results with remote precedence', async () => {
      client = new AppDirectoryClientImpl({
        baseUrl: 'https://api.example.com',
        localApps: [localApp, commonAppLocal],
        mode: 'local-first',
      });

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => [commonAppRemote],
      } as Response);

      const apps = await client.findByIntent('ViewChart');

      expect(apps).toContainEqual(localApp);
      expect(apps).toContainEqual(commonAppRemote);
      expect(apps).not.toContainEqual(commonAppLocal);
    });

    it('should fallback to local intent, context, and category queries when remote fails', async () => {
      client = new AppDirectoryClientImpl({
        baseUrl: 'https://api.example.com',
        localApps: [localApp],
        mode: 'local-first',
      });

      vi.mocked(fetch)
        .mockRejectedValueOnce(new Error('Network'))
        .mockRejectedValueOnce(new Error('Network'))
        .mockRejectedValueOnce(new Error('Network'));

      await expect(client.findByIntent('ViewChart')).resolves.toEqual([localApp]);
      await expect(client.findByContextType('fdc3.instrument')).resolves.toEqual([localApp]);
      await expect(client.findByCategory('Local')).resolves.toEqual([localApp]);
    });
  });
});
