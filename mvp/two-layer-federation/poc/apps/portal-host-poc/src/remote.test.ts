import React from 'react';
import { APPLICATION_CONTRACT_VERSION, APPEARANCE_CONTRACT_VERSION, type ApplicationRegistryEntry } from '@fm/platform-contracts-poc';
import { loadFederatedApplication, remoteRequestFromEntry } from './remote';

jest.mock('@module-federation/enhanced/runtime', () => ({
  registerRemotes: jest.fn(),
  loadRemote: jest.fn(),
}));

const entry: ApplicationRegistryEntry = {
  id: 'cashflow',
  displayName: 'Cashflow',
  remoteName: 'mfe_cashflow_poc',
  manifestUrl: 'http://127.0.0.1:9101/mf-manifest.json',
  exposedModule: './application',
  basePath: '/cashflow',
  contractVersion: APPLICATION_CONTRACT_VERSION,
  appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
  capabilities: [],
};

describe('remote application loader', () => {
  it('builds a Module Federation request from the registry entry', () => {
    expect(remoteRequestFromEntry(entry)).toBe('mfe_cashflow_poc/application');
  });

  it('registers and returns a compatible remote module', async () => {
    const module = {
      manifest: { id: 'cashflow', displayName: 'Cashflow', contractVersion: APPLICATION_CONTRACT_VERSION, appearanceContractVersion: APPEARANCE_CONTRACT_VERSION },
      Application: () => React.createElement('div'),
    };
    const runtime = {
      registerRemotes: jest.fn(),
      loadRemote: jest.fn().mockResolvedValue(module),
    };
    await expect(loadFederatedApplication(entry, runtime)).resolves.toBe(module);
    expect(runtime.registerRemotes).toHaveBeenCalledWith([
      { name: entry.remoteName, entry: entry.manifestUrl },
    ]);
    expect(runtime.loadRemote).toHaveBeenCalledWith('mfe_cashflow_poc/application');
  });

  it('forces remote registration on retry', async () => {
    const runtime = {
      registerRemotes: jest.fn(),
      loadRemote: jest.fn().mockResolvedValue({
        manifest: { id: 'cashflow', displayName: 'Cashflow', contractVersion: APPLICATION_CONTRACT_VERSION, appearanceContractVersion: APPEARANCE_CONTRACT_VERSION },
        Application: () => null,
      }),
    };
    await loadFederatedApplication(entry, runtime, true);
    expect(runtime.registerRemotes).toHaveBeenCalledWith(
      [{ name: entry.remoteName, entry: entry.manifestUrl }],
      { force: true },
    );
  });

  it('rejects missing and incompatible modules', async () => {
    const runtime = { registerRemotes: jest.fn(), loadRemote: jest.fn() };
    runtime.loadRemote.mockResolvedValue(undefined);
    await expect(loadFederatedApplication(entry, runtime)).rejects.toThrow(/did not return/i);
    runtime.loadRemote.mockResolvedValue({
      manifest: { id: 'other', displayName: 'Other', contractVersion: APPLICATION_CONTRACT_VERSION, appearanceContractVersion: APPEARANCE_CONTRACT_VERSION },
      Application: () => null,
    });
    await expect(loadFederatedApplication(entry, runtime)).rejects.toThrow(/identity/i);
  });

  it('delegates through the production runtime adapter', async () => {
    const enhanced = await import('@module-federation/enhanced/runtime');
    const { moduleFederationRuntime } = await import('./remote');
    (enhanced.loadRemote as jest.Mock).mockResolvedValue({ remote: true });
    await moduleFederationRuntime.registerRemotes([{ name: 'cashflow', entry: entry.manifestUrl }]);
    await expect(moduleFederationRuntime.loadRemote('cashflow/application')).resolves.toEqual({ remote: true });
    expect(enhanced.registerRemotes).toHaveBeenCalled();
  });
});
