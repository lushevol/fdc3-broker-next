const mockRegisterRemotes = jest.fn();
const mockLoadRemote = jest.fn();
jest.mock('@module-federation/enhanced/runtime', () => ({
  registerRemotes: mockRegisterRemotes,
  loadRemote: mockLoadRemote,
}));

import { loaderFor, moduleFederationLoader, systemJsLoader } from './tileLoader';
import type { TileRegistryEntry } from './workspaceStore';

const entry: TileRegistryEntry = {
  tileId: 'legacy-cashflow', displayName: 'Legacy Cashflow', category: 'Operations', loader: 'systemjs',
  entry: '/legacy/cashflow.js', requiredEntitlements: [], contractVersion: '0.1',
};

describe('tile loaders', () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ exposes: [] }) });
  });
  afterEach(() => {
    delete (globalThis as { System?: unknown }).System;
    delete (globalThis as { fetch?: unknown }).fetch;
  });

  it('keeps SystemJS behind the legacy loader adapter', async () => {
    const module = { manifest: { tileId: entry.tileId, contractVersion: '0.1' as const }, mount: jest.fn() };
    const importTile = jest.fn().mockResolvedValue(module);
    (globalThis as { System?: { import(value: string): Promise<unknown> } }).System = { import: importTile };

    await expect(systemJsLoader.load(entry)).resolves.toBe(module);
    expect(importTile).toHaveBeenCalledWith('/legacy/cashflow.js');
    expect(loaderFor(entry)).toBe(systemJsLoader);
  });

  it('rejects an incompatible legacy module before it can mount', async () => {
    (globalThis as { System?: { import(value: string): Promise<unknown> } }).System = {
      import: jest.fn().mockResolvedValue({ manifest: { tileId: 'other', contractVersion: '0.1' }, mount: jest.fn() }),
    };
    await expect(systemJsLoader.load(entry)).rejects.toThrow('identity mismatch');
  });

  it('reports an unavailable legacy runtime and unknown module shape', async () => {
    await expect(systemJsLoader.load(entry)).rejects.toThrow('SystemJS is unavailable');
    (globalThis as { System?: { import(value: string): Promise<unknown> } }).System = { import: jest.fn().mockResolvedValue({}) };
    await expect(systemJsLoader.load(entry)).rejects.toThrow('identity mismatch');
    (globalThis as { System?: { import(value: string): Promise<unknown> } }).System = { import: jest.fn().mockResolvedValue(null) };
    await expect(systemJsLoader.load(entry)).rejects.toThrow('did not return a module');
  });

  it('loads an exposed Module Federation Tile using its remote container name', async () => {
    const modern = { ...entry, entry: 'http://tiles.test/mf-manifest.json', tileId: 'cashflow', loader: 'module-federation' as const, remoteName: 'cashflow_remote', exposedModule: './application' };
    const module = { manifest: { tileId: 'cashflow', contractVersion: '0.1' as const }, mount: jest.fn() };
    jest.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ exposes: [{ path: './application', assets: { css: { sync: ['static/application.css'], async: ['static/lazy.css'] } } }] }),
    } as Response);
    mockLoadRemote.mockResolvedValue(module);
    await expect(moduleFederationLoader.load(modern)).resolves.toEqual({
      ...module,
      styleUrls: ['http://tiles.test/static/application.css', 'http://tiles.test/static/lazy.css'],
    });
    expect(mockRegisterRemotes).toHaveBeenCalledWith([{ name: 'cashflow_remote', entry: 'http://tiles.test/mf-manifest.json' }]);
    expect(mockLoadRemote).toHaveBeenCalledWith('cashflow_remote/application');
    expect(loaderFor(modern)).toBe(moduleFederationLoader);

    const defaultRemote = { ...modern, remoteName: undefined, exposedModule: undefined };
    mockLoadRemote.mockResolvedValue(module);
    await expect(moduleFederationLoader.load(defaultRemote)).resolves.toEqual({ ...module, styleUrls: [] });
    expect(mockLoadRemote).toHaveBeenCalledWith('cashflow');
  });

  it('contains a failed Module Federation manifest request', async () => {
    jest.mocked(globalThis.fetch).mockResolvedValueOnce({ ok: false, status: 503 } as Response);
    await expect(moduleFederationLoader.load({ ...entry, loader: 'module-federation', entry: 'http://tiles.test/mf-manifest.json' }))
      .rejects.toThrow('Tile manifest failed with 503');
  });

  it('rejects a module with an unsupported contract or no mount function', async () => {
    (globalThis as { System?: { import(value: string): Promise<unknown> } }).System = {
      import: jest.fn().mockResolvedValue({ manifest: { tileId: entry.tileId, contractVersion: '9.9' } }),
    };
    await expect(systemJsLoader.load(entry)).rejects.toThrow('Unsupported Tile contract');
    (globalThis as { System?: { import(value: string): Promise<unknown> } }).System = {
      import: jest.fn().mockResolvedValue({ manifest: { tileId: entry.tileId, contractVersion: '0.1' } }),
    };
    await expect(systemJsLoader.load(entry)).rejects.toThrow('does not expose mount');
  });
});
