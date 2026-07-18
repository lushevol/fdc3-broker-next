import {
  assertCompatibleApplicationModule,
  type ApplicationRegistryEntry,
  type FederatedApplicationModule,
} from '@fm/platform-contracts-poc';

export interface RemoteRuntime {
  registerRemotes(
    remotes: Array<{ name: string; entry: string }>,
    options?: { force?: boolean },
  ): void | Promise<void>;
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

export function remoteRequestFromEntry(entry: ApplicationRegistryEntry): string {
  return `${entry.remoteName}/${entry.exposedModule.replace(/^\.\//, '')}`;
}

export async function loadFederatedApplication(
  entry: ApplicationRegistryEntry,
  runtime: RemoteRuntime = moduleFederationRuntime,
  force = false,
): Promise<FederatedApplicationModule> {
  const registration = [{ name: entry.remoteName, entry: entry.manifestUrl }];
  if (force) await runtime.registerRemotes(registration, { force: true });
  else await runtime.registerRemotes(registration);
  const candidate = await runtime.loadRemote(remoteRequestFromEntry(entry));
  if (!candidate) {
    throw new Error(`Remote ${entry.id} did not return an application module`);
  }
  return assertCompatibleApplicationModule(candidate, entry);
}
