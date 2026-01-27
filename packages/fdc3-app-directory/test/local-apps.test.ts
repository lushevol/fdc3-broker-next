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
  });
});
