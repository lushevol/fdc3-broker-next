import type {
  AppearanceCapability,
  AppearanceSnapshot,
  PlatformCapabilities,
} from '@fm/platform-contracts-poc';

export interface PlatformClient {
  navigate(path: string): void;
  notify(message: string): void;
  track(event: string, data?: Record<string, unknown>): void;
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

export function createAppearanceController(initialSnapshot: AppearanceSnapshot): AppearanceController {
  let snapshot = initialSnapshot;
  const listeners = new Set<(nextSnapshot: AppearanceSnapshot) => void>();
  const capability: AppearanceCapability = {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };

  return {
    capability,
    setSnapshot(nextSnapshot) {
      snapshot = nextSnapshot;
      listeners.forEach((listener) => listener(snapshot));
    },
  };
}
