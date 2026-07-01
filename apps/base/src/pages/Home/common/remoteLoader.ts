import { createInstance } from '@module-federation/enhanced/runtime';
import type React from 'react';
import ReactRuntime from 'react';
import ReactDomRuntime from 'react-dom';

type RemoteModule = {
  default: React.ComponentType<any>;
};

type BaseModule = Record<string, unknown>;

declare global {
  interface Window {
    __FM_BASE_MODULE__?: BaseModule;
  }
}

const moduleFederationRemotes: Record<string, string> = {
  '@fm/ratan_container': 'ratan_container',
  '@fm/ratan_cashflow_blotter': 'ratan_cashflow_blotter',
};

type ModuleFederationInstance = ReturnType<typeof createInstance>;

let moduleFederationInstance: ModuleFederationInstance | null = null;

const getRemoteEntry = (localPort: number, productionPath: string): string => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `http://localhost:${localPort}/mf-manifest.json`;
  }

  return `${productionPath}/mf-manifest.json`;
};

const getModuleFederationInstance = (): ModuleFederationInstance => {
  if (moduleFederationInstance) {
    return moduleFederationInstance;
  }

  const instance = createInstance({
    name: 'base_ratan_module_federation_host',
    remotes: [
      {
        name: 'ratan_container',
        alias: 'ratan_container',
        entry: getRemoteEntry(8009, '/ratan_container'),
      },
      {
        name: 'ratan_cashflow_blotter',
        alias: 'ratan_cashflow_blotter',
        entry: getRemoteEntry(8015, '/ratan_cashflow_blotter'),
      },
    ],
  });

  instance.registerShared({
    react: {
      version: '18.2.0',
      scope: 'default',
      lib: () => ReactRuntime,
      shareConfig: {
        singleton: true,
        requiredVersion: '^18.2.0',
      },
    },
    'react-dom': {
      version: '18.2.0',
      scope: 'default',
      lib: () => ReactDomRuntime,
      shareConfig: {
        singleton: true,
        requiredVersion: '^18.2.0',
      },
    },
  });

  moduleFederationInstance = instance;
  return moduleFederationInstance;
};

const initializeBaseModuleBridge = async (): Promise<void> => {
  if (!window.__FM_BASE_MODULE__) {
    window.__FM_BASE_MODULE__ = (await System.import('@fm/base')) as BaseModule;
  }
};

const isReactComponent = (value: unknown): value is React.ComponentType<any> =>
  typeof value === 'function' ||
  (typeof value === 'object' && value !== null && '$$typeof' in value);

const normalizeFederatedModule = (remoteModule: unknown): RemoteModule => {
  if (isReactComponent(remoteModule)) {
    return { default: remoteModule };
  }

  if (typeof remoteModule === 'object' && remoteModule !== null) {
    const candidate = remoteModule as { default?: unknown };

    if (isReactComponent(candidate.default)) {
      return candidate as RemoteModule;
    }

    if (typeof candidate.default === 'object' && candidate.default !== null) {
      const nestedCandidate = candidate.default as { default?: unknown };

      if (isReactComponent(nestedCandidate.default)) {
        return { default: nestedCandidate.default };
      }
    }
  }

  throw new Error('Module Federation remote did not resolve to a React component');
};

export const loadWorkspaceRemote = async (containerName: string): Promise<RemoteModule> => {
  const remoteName = moduleFederationRemotes[containerName];

  if (remoteName) {
    await initializeBaseModuleBridge();
    const remoteModule = await getModuleFederationInstance().loadRemote(remoteName);
    return normalizeFederatedModule(remoteModule);
  }

  return System.import(containerName) as Promise<RemoteModule>;
};
