import {
  appearanceSnapshotSchema,
  type AppearanceCapability,
  type AppearanceSnapshot,
  type PlatformCapabilities,
} from '@fm/platform-contracts';

export interface PlatformClient {
  navigate(path: string): void;
  notify(message: string): void;
  track(event: string, data?: Readonly<Record<string, unknown>>): void;
  closeCurrentWorkspace(): void;
  getAppearance(): AppearanceSnapshot;
  subscribeToAppearance(listener: (snapshot: AppearanceSnapshot) => void): () => void;
}

export function createPlatformClient(capabilities: PlatformCapabilities): PlatformClient {
  return {
    navigate: (path) => capabilities.navigation.navigate(path),
    notify: (message) => capabilities.notifications.show(message),
    track: (event, data) => capabilities.telemetry.track(event, data),
    closeCurrentWorkspace: () => capabilities.workspace.closeCurrent(),
    getAppearance: () => capabilities.appearance.getSnapshot(),
    subscribeToAppearance: (listener) => capabilities.appearance.subscribe(listener),
  };
}

export interface AppearanceController {
  readonly capability: AppearanceCapability;
  setSnapshot(snapshot: AppearanceSnapshot): void;
}

function immutableSnapshot(candidate: AppearanceSnapshot): AppearanceSnapshot {
  return Object.freeze({ ...appearanceSnapshotSchema.parse(candidate) });
}

export function createAppearanceController(initialSnapshot: AppearanceSnapshot): AppearanceController {
  let snapshot = immutableSnapshot(initialSnapshot);
  const listeners = new Set<(nextSnapshot: AppearanceSnapshot) => void>();
  const capability: AppearanceCapability = Object.freeze({
    getSnapshot: () => snapshot,
    subscribe(listener: (nextSnapshot: AppearanceSnapshot) => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  });

  return Object.freeze({
    capability,
    setSnapshot(nextSnapshot: AppearanceSnapshot) {
      snapshot = immutableSnapshot(nextSnapshot);
      listeners.forEach((listener) => listener(snapshot));
    },
  });
}
