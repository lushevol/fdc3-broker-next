import {
  APPLICATION_CONTRACT_VERSION,
  APPEARANCE_CONTRACT_VERSION,
} from '@fm/platform-contracts';
import { APPEARANCE_STORAGE_KEY, DEFAULT_APPEARANCE, persistAppearance, readStoredAppearance } from './appearance';
import { loadApplicationRegistry } from './registry';
import { loadFederatedApplication, remoteRequestFromEntry, type RemoteRuntime } from './remote';
import { entry } from './test-fixtures';

describe('production host foundation', () => {
  it('loads and validates the registry and rejects transport failure', async () => {
    await expect(loadApplicationRegistry(async () => ({ ok: true, status: 200, json: async () => ({ applications: [entry] }) }))).resolves.toEqual({ applications: [entry] });
    await expect(loadApplicationRegistry(async () => ({ ok: false, status: 503, json: async () => ({}) }))).rejects.toThrow('status 503');
    await expect(loadApplicationRegistry(async () => ({ ok: true, status: 200, json: async () => ({ applications: [] }) }))).rejects.toThrow();
  });

  it('uses deterministic appearance persistence', () => {
    expect(readStoredAppearance({ getItem: () => null })).toEqual(DEFAULT_APPEARANCE);
    expect(readStoredAppearance({ getItem: () => '{broken' })).toEqual(DEFAULT_APPEARANCE);
    expect(readStoredAppearance({ getItem: () => JSON.stringify({ bad: true }) })).toEqual(DEFAULT_APPEARANCE);
    const setItem = jest.fn();
    persistAppearance({ setItem }, DEFAULT_APPEARANCE);
    expect(setItem).toHaveBeenCalledWith(APPEARANCE_STORAGE_KEY, JSON.stringify(DEFAULT_APPEARANCE));
  });

  it('registers, loads, and validates a direct remote', async () => {
    const Application = () => null;
    const runtime: RemoteRuntime = {
      registerRemotes: jest.fn(),
      loadRemote: jest.fn().mockResolvedValue({ manifest: {
        id: 'cashflow', displayName: 'Cashflow', contractVersion: APPLICATION_CONTRACT_VERSION,
        appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
      }, Application }),
    };
    expect(remoteRequestFromEntry(entry)).toBe('mfe_cashflow/application');
    await expect(loadFederatedApplication(entry, runtime, true)).resolves.toMatchObject({ Application });
    expect(runtime.registerRemotes).toHaveBeenCalledWith([{ name: 'mfe_cashflow', entry: entry.manifestUrl }], { force: true });
    (runtime.loadRemote as jest.Mock).mockResolvedValueOnce(null);
    await expect(loadFederatedApplication(entry, runtime)).rejects.toMatchObject({ code: 'MODULE_MISSING' });
  });
});
