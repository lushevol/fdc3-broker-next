import { render, screen } from '@testing-library/react';
import { APPLICATION_CONTRACT_VERSION, type ApplicationRegistryEntry, type PlatformCapabilities } from '@fm/platform-contracts-poc';
import { RemoteApplication } from './RemoteApplication';

const entry: ApplicationRegistryEntry = {
  id: 'cashflow', displayName: 'Cashflow', remoteName: 'mfe_cashflow_poc',
  manifestUrl: 'http://127.0.0.1:9101/mf-manifest.json', exposedModule: './application',
  basePath: '/cashflow', contractVersion: APPLICATION_CONTRACT_VERSION, capabilities: [],
};
const capabilities: PlatformCapabilities = {
  navigation: { navigate: jest.fn() }, notifications: { show: jest.fn() },
  telemetry: { track: jest.fn() }, workspace: { closeCurrent: jest.fn() },
};

describe('RemoteApplication edge cases', () => {
  it('normalizes non-Error load failures', async () => {
    const runtime = { registerRemotes: jest.fn(), loadRemote: jest.fn().mockRejectedValue('network string') };
    render(<RemoteApplication entry={entry} instanceId="cashflow-1" capabilities={capabilities} runtime={runtime} />);
    expect(await screen.findByText('network string')).toBeInTheDocument();
  });

  it('ignores a late remote result after unmount', async () => {
    let resolveRemote: (value: unknown) => void = () => undefined;
    const runtime = {
      registerRemotes: jest.fn(),
      loadRemote: jest.fn().mockReturnValue(new Promise((resolve) => { resolveRemote = resolve; })),
    };
    const view = render(<RemoteApplication entry={entry} instanceId="cashflow-1" capabilities={capabilities} runtime={runtime} />);
    view.unmount();
    resolveRemote({
      manifest: { id: 'cashflow', displayName: 'Cashflow', contractVersion: APPLICATION_CONTRACT_VERSION },
      Application: () => <p>Too late</p>,
    });
    await Promise.resolve();
    expect(screen.queryByText('Too late')).not.toBeInTheDocument();
  });
});
