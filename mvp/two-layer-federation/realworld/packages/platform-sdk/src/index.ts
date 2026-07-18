import {
  appearanceSnapshotSchema,
  identitySnapshotSchema,
  type AppearanceCapability,
  type AppearanceSnapshot,
  type IdentityCapability,
  type IdentitySnapshot,
  type PlatformCapabilities,
} from '@fm/platform-contracts';

export interface PlatformClient {
  navigate(path: string): void;
  notify(message: string): void;
  track(event: string, data?: Readonly<Record<string, unknown>>): void;
  closeCurrentWorkspace(): void;
  getAppearance(): AppearanceSnapshot;
  subscribeToAppearance(listener: (snapshot: AppearanceSnapshot) => void): () => void;
  getIdentity(): IdentitySnapshot | undefined;
  subscribeToIdentity(listener: (snapshot: IdentitySnapshot) => void): (() => void) | undefined;
}

export function createPlatformClient(capabilities: PlatformCapabilities): PlatformClient {
  return {
    navigate: (path) => capabilities.navigation.navigate(path),
    notify: (message) => capabilities.notifications.show(message),
    track: (event, data) => capabilities.telemetry.track(event, data),
    closeCurrentWorkspace: () => capabilities.workspace.closeCurrent(),
    getAppearance: () => capabilities.appearance.getSnapshot(),
    subscribeToAppearance: (listener) => capabilities.appearance.subscribe(listener),
    getIdentity: () => capabilities.identity?.getSnapshot(),
    subscribeToIdentity: (listener) => capabilities.identity?.subscribe(listener),
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

export interface IdentityController {
  readonly capability: IdentityCapability;
  setSnapshot(snapshot: IdentitySnapshot): void;
}

function immutableIdentitySnapshot(candidate: IdentitySnapshot): IdentitySnapshot {
  const parsed = identitySnapshotSchema.parse(candidate);
  if (parsed.state === 'anonymous') return Object.freeze({ ...parsed });
  return Object.freeze({ ...parsed, permissions: Object.freeze([...parsed.permissions]) });
}

export function createIdentityController(initialSnapshot: IdentitySnapshot): IdentityController {
  let snapshot = immutableIdentitySnapshot(initialSnapshot);
  const listeners = new Set<(nextSnapshot: IdentitySnapshot) => void>();
  const capability: IdentityCapability = Object.freeze({
    getSnapshot: () => snapshot,
    subscribe(listener: (nextSnapshot: IdentitySnapshot) => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  });

  return Object.freeze({
    capability,
    setSnapshot(nextSnapshot: IdentitySnapshot) {
      snapshot = immutableIdentitySnapshot(nextSnapshot);
      listeners.forEach((listener) => listener(snapshot));
    },
  });
}
