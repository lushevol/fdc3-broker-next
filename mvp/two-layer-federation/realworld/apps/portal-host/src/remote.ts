import {
  assertCompatibleApplicationModule,
  type ApplicationRegistryEntry,
  type FederatedApplicationModule,
} from '@fm/platform-contracts';
import * as React from 'react';
import * as ReactDom from 'react-dom';

export interface RemoteRuntime {
  registerRemotes(remotes: Array<{ name: string; entry: string }>, options?: { force?: boolean }): void | Promise<void>;
  loadRemote(request: string): Promise<unknown>;
}

let federationRuntimePromise: Promise<RemoteRuntime> | undefined;

async function getFederationRuntime(): Promise<RemoteRuntime> {
  federationRuntimePromise ??= import('@module-federation/enhanced/runtime').then((runtime) => {
    // Rsbuild created this instance as part of its Module Federation plugin.
    // Vite intentionally has no such implicit bootstrap, so the portal owns it.
    return runtime.getInstance() ?? runtime.createInstance({
      name: 'portal_host',
      remotes: [],
      shared: {
        react: {
          version: '19.2.3',
          lib: () => React,
          shareConfig: { singleton: true, requiredVersion: '^19.2.3' },
        },
        'react-dom': {
          version: '19.2.3',
          lib: () => ReactDom,
          shareConfig: { singleton: true, requiredVersion: '^19.2.3' },
        },
      },
    });
  });
  return federationRuntimePromise;
}

export const moduleFederationRuntime: RemoteRuntime = {
  async registerRemotes(remotes, options) {
    const runtime = await getFederationRuntime();
    runtime.registerRemotes(remotes, options);
  },
  async loadRemote(request) {
    const runtime = await getFederationRuntime();
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
