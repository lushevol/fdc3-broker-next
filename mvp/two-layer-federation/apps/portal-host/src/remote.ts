import {
  assertCompatibleApplicationModule,
  type ApplicationRegistryEntry,
  type FederatedApplicationModule,
} from '@fm/platform-contracts';

export interface RemoteRuntime {
  registerRemotes(remotes: Array<{ name: string; entry: string }>, options?: { force?: boolean }): void | Promise<void>;
  loadRemote(request: string): Promise<unknown>;
}

export const moduleFederationRuntime: RemoteRuntime = {
  async registerRemotes(remotes, options) {
    const runtime = await import('@module-federation/enhanced/runtime');
    runtime.registerRemotes(remotes, options);
  },
  async loadRemote(request) {
    const runtime = await import('@module-federation/enhanced/runtime');
    return runtime.loadRemote(request);
  },
};

export function remoteRequestFromEntry(entry: ApplicationRegistryEntry) {
  return `${entry.remoteName}/${entry.exposedModule.replace(/^\.\//, '')}`;
}

export async function loadFederatedApplication(entry: ApplicationRegistryEntry, runtime: RemoteRuntime, force = false): Promise<FederatedApplicationModule> {
  const remotes = [{ name: entry.remoteName, entry: entry.manifestUrl }];
  await runtime.registerRemotes(remotes, force ? { force: true } : undefined);
  return assertCompatibleApplicationModule(await runtime.loadRemote(remoteRequestFromEntry(entry)), entry);
}
