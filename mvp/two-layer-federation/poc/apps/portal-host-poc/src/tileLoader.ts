import type { TileCapabilities } from './platformCapabilities';
import type { TileRegistryEntry } from './workspaceStore';

export interface TileModule {
  manifest: { contractVersion: '0.1'; tileId: string };
  styleUrls?: string[];
  mount(input: { capabilities: TileCapabilities; instanceId: string; root: ShadowRoot; tileId: string }): void | Promise<void>;
  unmount?(instanceId: string): void | Promise<void>;
}

export interface TileLoader {
  load(entry: TileRegistryEntry): Promise<TileModule>;
}

function assertTileModule(candidate: unknown, entry: TileRegistryEntry): TileModule {
  if (!candidate || typeof candidate !== 'object') throw new Error(`Tile ${entry.tileId} did not return a module`);
  const module = candidate as Partial<TileModule>;
  if (!module.manifest || module.manifest.tileId !== entry.tileId) throw new Error(`Tile identity mismatch for ${entry.tileId}`);
  if (module.manifest.contractVersion !== entry.contractVersion) throw new Error(`Unsupported Tile contract for ${entry.tileId}`);
  if (typeof module.mount !== 'function') throw new Error(`Tile ${entry.tileId} does not expose mount`);
  return module as TileModule;
}

export const moduleFederationLoader: TileLoader = {
  async load(entry) {
    const runtime = await import('@module-federation/enhanced/runtime');
    const remoteName = entry.remoteName ?? entry.tileId;
    const request = entry.exposedModule ? `${remoteName}/${entry.exposedModule.replace(/^\.\//, '')}` : remoteName;
    const manifestResponse = await fetch(entry.entry, { cache: 'no-store' });
    if (!manifestResponse.ok) throw new Error(`Tile manifest failed with ${manifestResponse.status}`);
    const federationManifest = await manifestResponse.json() as {
      exposes?: Array<{ path: string; assets?: { css?: { sync?: string[]; async?: string[] } } }>;
    };
    const exposedPath = entry.exposedModule ?? `./${entry.tileId}`;
    const exposed = federationManifest.exposes?.find((candidate) => candidate.path === exposedPath);
    const cssAssets = [...(exposed?.assets?.css?.sync ?? []), ...(exposed?.assets?.css?.async ?? [])];
    const styleUrls = cssAssets.map((asset) => new URL(asset, entry.entry).href);
    runtime.registerRemotes([{ name: remoteName, entry: entry.entry }]);
    return { ...assertTileModule(await runtime.loadRemote(request), entry), styleUrls };
  },
};

type SystemJs = { import(entry: string): Promise<unknown> };

export const systemJsLoader: TileLoader = {
  async load(entry) {
    const system = (globalThis as typeof globalThis & { System?: SystemJs }).System;
    if (!system) throw new Error('SystemJS is unavailable in this runtime');
    return assertTileModule(await system.import(entry.entry), entry);
  },
};

export function loaderFor(entry: TileRegistryEntry): TileLoader {
  return entry.loader === 'systemjs' ? systemJsLoader : moduleFederationLoader;
}
