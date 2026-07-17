import type { PlatformCapabilities } from '@fm/platform-contracts-poc';

export interface PlatformClient {
  navigate(path: string): void;
  notify(message: string): void;
  track(event: string, data?: Record<string, unknown>): void;
  closeCurrentWorkspace(): void;
}

export function createPlatformClient(capabilities: PlatformCapabilities): PlatformClient {
  return {
    navigate: (path) => capabilities.navigation.navigate(path),
    notify: (message) => capabilities.notifications.show(message),
    track: (event, data) => capabilities.telemetry.track(event, data),
    closeCurrentWorkspace: () => capabilities.workspace.closeCurrent(),
  };
}
