import { createStore } from 'zustand/vanilla';

export type TileLoader = 'module-federation' | 'systemjs';

export interface TileRegistryEntry {
  tileId: string;
  displayName: string;
  category: string;
  loader: TileLoader;
  entry: string;
  /** Module Federation container name. Defaults to tileId for SystemJS-style entries. */
  remoteName?: string;
  exposedModule?: string;
  requiredEntitlements: string[];
  contractVersion: '0.1';
}

export interface TileInstance {
  entry: TileRegistryEntry;
  instanceId: string;
  status: 'opening' | 'ready' | 'failed';
  error?: string;
}

type OpenResult = { ok: true; instanceId: string } | { ok: false; reason: 'denied' | 'unknown' };

export interface WorkspaceState {
  activeInstanceId: string | null;
  availableTiles(): TileRegistryEntry[];
  activate(instanceId: string): void;
  close(instanceId: string): void;
  instances: TileInstance[];
  openTile(tileId: string): OpenResult;
}

const isEntitled = (entry: TileRegistryEntry, entitlements: Set<string>) =>
  entry.requiredEntitlements.every((entitlement) => entitlements.has(entitlement));

export function createWorkspaceStore(registry: TileRegistryEntry[], grantedEntitlements: string[]) {
  const entitlements = new Set(grantedEntitlements);
  const counters = new Map<string, number>();

  return createStore<WorkspaceState>((set, get) => ({
    activeInstanceId: null,
    instances: [],
    availableTiles: () => registry.filter((entry) => isEntitled(entry, entitlements)),
    openTile: (tileId) => {
      const entry = registry.find((candidate) => candidate.tileId === tileId);
      if (!entry) return { ok: false, reason: 'unknown' };
      if (!isEntitled(entry, entitlements)) return { ok: false, reason: 'denied' };

      const next = (counters.get(tileId) ?? 0) + 1;
      counters.set(tileId, next);
      const instanceId = `${tileId}-${next}`;
      set((state) => ({
        activeInstanceId: instanceId,
        instances: [...state.instances, { entry, instanceId, status: 'opening' }],
      }));
      return { ok: true, instanceId };
    },
    activate: (instanceId) => {
      if (get().instances.some((instance) => instance.instanceId === instanceId)) {
        set({ activeInstanceId: instanceId });
      }
    },
    close: (instanceId) => {
      set((state) => {
        const index = state.instances.findIndex((instance) => instance.instanceId === instanceId);
        if (index < 0) return state;
        const instances = state.instances.filter((instance) => instance.instanceId !== instanceId);
        const previous = instances[Math.max(0, index - 1)];
        const activeInstanceId = state.activeInstanceId === instanceId
          ? previous?.instanceId ?? null
          : state.activeInstanceId;
        return { instances, activeInstanceId };
      });
    },
  }));
}
