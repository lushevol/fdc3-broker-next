import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ApplicationRegistryEntry, PlatformCapabilities } from '@fm/platform-contracts';
import { vi } from 'vitest';
import { RemoteApplication } from './RemoteApplication';
import { loadFederatedApplication } from './remote';

vi.mock('./remote', () => ({ loadFederatedApplication: vi.fn() }));

const entry: ApplicationRegistryEntry = {
  id: 'cashflow', displayName: 'Cashflow', remoteName: 'mfe_cashflow',
  manifestUrl: 'http://example.test/mf-manifest.json', exposedModule: './application',
  basePath: '/cashflow', contractVersion: '1.0.0', appearanceContractVersion: '1.0.0',
  capabilities: ['navigation', 'notifications', 'telemetry', 'workspace', 'appearance'],
};

const capabilities = {
  navigation: { navigate: vi.fn() }, notifications: { show: vi.fn() }, telemetry: { track: vi.fn() },
  workspace: { closeCurrent: vi.fn() },
  appearance: { getSnapshot: () => ({ scheme: 'dark', preference: 'dark', density: 'compact', locale: 'en-US', direction: 'ltr', contractVersion: '1.0.0' as const }), subscribe: () => () => undefined },
} satisfies PlatformCapabilities;

describe('independent React remote boundary', () => {
  beforeEach(() => vi.mocked(loadFederatedApplication).mockReset());

  it('mounts and unmounts an imperative remote without rendering its React element in the portal', async () => {
    const mount = vi.fn();
    const unmount = vi.fn();
    vi.mocked(loadFederatedApplication).mockResolvedValue({
      manifest: { id: 'cashflow', displayName: 'Cashflow', contractVersion: '1.0.0', appearanceContractVersion: '1.0.0' },
      Application: () => null, mount, unmount,
    });
    const { unmount: unmountHost, container } = render(<RemoteApplication entry={entry} instanceId="cashflow-1" capabilities={capabilities} runtime={{ registerRemotes: vi.fn(), loadRemote: vi.fn() }} />);
    await waitFor(() => expect(mount).toHaveBeenCalledTimes(1));
    const root = container.querySelector('[data-composition-boundary]');
    expect(root).toHaveAttribute('data-mounted', 'true');
    expect(mount).toHaveBeenCalledWith(expect.objectContaining({ root, instanceId: 'cashflow-1', basePath: '/cashflow', capabilities }));
    unmountHost();
    expect(unmount).toHaveBeenCalledWith('cashflow-1');
  });

  it('uses Ratan feedback and retry controls for remote loading failures', async () => {
    vi.mocked(loadFederatedApplication)
      .mockRejectedValueOnce(new Error('remote offline'))
      .mockResolvedValueOnce({
        manifest: {
          id: 'cashflow',
          displayName: 'Cashflow',
          contractVersion: '1.0.0',
          appearanceContractVersion: '1.0.0',
        },
        Application: () => <span>Recovered application</span>,
      });
    const { container } = render(
      <RemoteApplication
        entry={entry}
        instanceId="cashflow-1"
        capabilities={capabilities}
        runtime={{ registerRemotes: vi.fn(), loadRemote: vi.fn() }}
      />,
    );
    expect(container.querySelector('sc-spinner')).toBeInTheDocument();
    expect(await screen.findByRole('alert')).toHaveProperty('title', 'Application unavailable');
    fireEvent.click(screen.getByRole('button', { name: 'Retry Cashflow' }));
    expect(await screen.findByText('Recovered application')).toBeInTheDocument();
  });
});
