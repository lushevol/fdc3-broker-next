import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  APPLICATION_CONTRACT_VERSION,
  APPEARANCE_CONTRACT_VERSION,
  type ApplicationProps,
  type ApplicationRegistry,
} from '@fm/platform-contracts-poc';
import { PortalHost } from './PortalHost';
import type { RemoteRuntime } from './remote';

const registry: ApplicationRegistry = {
  applications: [
    {
      id: 'cashflow', displayName: 'Cashflow', remoteName: 'mfe_cashflow_poc',
      manifestUrl: 'http://127.0.0.1:9101/mf-manifest.json', exposedModule: './application',
      basePath: '/cashflow', contractVersion: APPLICATION_CONTRACT_VERSION,
      appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
      capabilities: ['navigation', 'notifications', 'telemetry', 'workspace', 'appearance'],
    },
  ],
};

function Cashflow({ capabilities, instanceId }: ApplicationProps) {
  const appearance = capabilities.appearance.getSnapshot();
  return (
    <div>
      <span>Remote {instanceId}</span>
      <span data-testid="remote-appearance">{appearance.scheme} {appearance.density}</span>
      <button onClick={() => capabilities.notifications.show('Cashflow says hello')}>Notify</button>
      <button onClick={() => capabilities.telemetry.track('cashflow.test', { ok: true })}>Track</button>
      <button onClick={() => capabilities.navigation.navigate('/cashflow/details')}>Details</button>
      <button onClick={() => capabilities.workspace.closeCurrent()}>Close from app</button>
    </div>
  );
}

const createRuntime = (): RemoteRuntime => ({
  registerRemotes: jest.fn(),
  loadRemote: jest.fn().mockResolvedValue({
    manifest: {
      id: 'cashflow', displayName: 'Cashflow', contractVersion: APPLICATION_CONTRACT_VERSION,
      appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
    },
    Application: Cashflow,
  }),
});

describe('PortalHost', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    window.localStorage.clear();
  });

  it('opens, navigates, notifies, closes, and reopens a direct application', async () => {
    const runtime = createRuntime();
    render(<PortalHost registry={registry} runtime={runtime} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open Cashflow' }));
    expect(await screen.findByText('Remote cashflow-1')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/cashflow');
    fireEvent.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getByRole('status')).toHaveTextContent('Cashflow says hello');
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    const info = jest.spyOn(console, 'info').mockImplementation(() => undefined);
    fireEvent.click(screen.getByRole('button', { name: 'Track' }));
    expect(info).toHaveBeenCalledWith('platform-event', expect.objectContaining({ event: 'cashflow.test' }));
    info.mockRestore();
    fireEvent.click(screen.getByRole('button', { name: 'Details' }));
    expect(window.location.pathname).toBe('/cashflow/details');
    fireEvent.click(screen.getByRole('button', { name: 'Close from app' }));
    expect(screen.queryByText(/Remote cashflow/)).not.toBeInTheDocument();
    expect(window.location.pathname).toBe('/');
    fireEvent.click(screen.getByRole('button', { name: 'Open Cashflow' }));
    expect(await screen.findByText('Remote cashflow-2')).toBeInTheDocument();
  });

  it('opens the matching application on a nested route refresh', async () => {
    window.history.replaceState({}, '', '/cashflow/details');
    render(<PortalHost registry={registry} runtime={createRuntime()} />);
    expect(await screen.findByText('Remote cashflow-1')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Cashflow' })).toHaveAttribute('aria-selected', 'true');
  });

  it('contains load failures and retries without losing the launcher', async () => {
    const runtime = createRuntime();
    (runtime.loadRemote as jest.Mock)
      .mockRejectedValueOnce(new Error('Remote offline'))
      .mockResolvedValueOnce({
        manifest: {
          id: 'cashflow', displayName: 'Cashflow', contractVersion: APPLICATION_CONTRACT_VERSION,
          appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
        },
        Application: Cashflow,
      });
    render(<PortalHost registry={registry} runtime={runtime} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open Cashflow' }));
    expect(await screen.findByText('Remote offline')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open Cashflow' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'Retry Cashflow' }));
    expect(await screen.findByText('Remote cashflow-1')).toBeInTheDocument();
    expect(runtime.registerRemotes).toHaveBeenLastCalledWith(
      [{ name: 'mfe_cashflow_poc', entry: 'http://127.0.0.1:9101/mf-manifest.json' }],
      { force: true },
    );
  });

  it('responds to browser history navigation', async () => {
    render(<PortalHost registry={registry} runtime={createRuntime()} />);
    act(() => {
      window.history.pushState({}, '', '/cashflow');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await waitFor(() => expect(screen.getByRole('tab', { name: 'Cashflow' })).toBeInTheDocument());
  });

  it('owns persisted appearance and exposes a stable live capability', async () => {
    window.localStorage.setItem('fm.portal.appearance', JSON.stringify({
      scheme: 'light', preference: 'light', density: 'comfortable', locale: 'en-US',
      direction: 'ltr', contractVersion: APPEARANCE_CONTRACT_VERSION,
    }));
    const runtime = createRuntime();
    let capability: ApplicationProps['capabilities']['appearance'] | undefined;
    (runtime.loadRemote as jest.Mock).mockResolvedValueOnce({
      manifest: {
        id: 'cashflow', displayName: 'Cashflow', contractVersion: APPLICATION_CONTRACT_VERSION,
        appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
      },
      Application: ({ capabilities }: ApplicationProps) => {
        capability = capabilities.appearance;
        return <span>Appearance remote</span>;
      },
    });

    render(<PortalHost registry={registry} runtime={runtime} />);
    const designRoot = document.querySelector('[data-ratan-scope="host"]');
    expect(designRoot).toHaveAttribute('data-ratan-theme', 'light');
    expect(designRoot).toHaveAttribute('data-ratan-density', 'comfortable');
    fireEvent.click(screen.getByRole('button', { name: 'Open Cashflow' }));
    expect(await screen.findByText('Appearance remote')).toBeInTheDocument();
    const initialCapability = capability;
    const listener = jest.fn();
    const unsubscribe = initialCapability?.subscribe(listener);

    fireEvent.click(screen.getByRole('button', { name: 'Use dark theme' }));
    await waitFor(() => expect(listener).toHaveBeenCalledWith(expect.objectContaining({ scheme: 'dark' })));
    expect(capability).toBe(initialCapability);
    expect(initialCapability?.getSnapshot().scheme).toBe('dark');
    expect(designRoot).toHaveAttribute('data-ratan-theme', 'dark');
    expect(JSON.parse(window.localStorage.getItem('fm.portal.appearance') ?? '{}')).toMatchObject({ scheme: 'dark' });
    unsubscribe?.();
  });

  it('uses design-system controls and deterministic defaults', () => {
    render(<PortalHost registry={registry} runtime={createRuntime()} />);
    const designRoot = document.querySelector('[data-ratan-scope="host"]');
    expect(designRoot).toHaveAttribute('data-ratan-theme', 'dark');
    expect(designRoot).toHaveAttribute('data-ratan-density', 'compact');
    expect(screen.getByRole('button', { name: 'Open Cashflow' })).toHaveAttribute(
      'data-ratan-variant',
      'secondary',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Use comfortable density' }));
    expect(designRoot).toHaveAttribute('data-ratan-density', 'comfortable');
  });
});
