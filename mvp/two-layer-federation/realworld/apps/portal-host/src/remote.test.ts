import { IDENTITY_CONTRACT_VERSION } from '@fm/platform-contracts';
import { loadFederatedApplication, type RemoteRuntime } from './remote';
import { entry } from './test-fixtures';

function applicationModule() {
  return {
    manifest: {
      id: 'cashflow',
      displayName: 'Cashflow',
      contractVersion: '1.0.0',
      appearanceContractVersion: '1.0.0',
      identityContractVersion: IDENTITY_CONTRACT_VERSION,
    },
    Application: () => null,
  };
}

describe('production remote loading', () => {
  it('loads the release selected by the runtime registry without rebuilding the host', async () => {
    const runtime: RemoteRuntime = {
      registerRemotes: jest.fn(),
      loadRemote: jest.fn().mockResolvedValue(applicationModule()),
    };
    const releaseEntry = { ...entry, manifestUrl: 'https://tiles.example.test/cashflow/mf-manifest.json?release=2026.07.27-b' };
    await expect(loadFederatedApplication(releaseEntry, runtime)).resolves.toMatchObject({ manifest: { id: 'cashflow' } });
    expect(runtime.registerRemotes).toHaveBeenCalledWith([{
      name: 'mfe_cashflow', entry: releaseEntry.manifestUrl,
    }], undefined);
    expect(runtime.loadRemote).toHaveBeenCalledWith('mfe_cashflow/application');
  });
});
