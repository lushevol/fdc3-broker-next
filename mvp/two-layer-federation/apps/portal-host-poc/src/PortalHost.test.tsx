import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  APPLICATION_CONTRACT_VERSION,
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
      capabilities: ['navigation', 'notifications', 'telemetry', 'workspace'],
    },
  ],
};

function Cashflow({ capabilities, instanceId }: ApplicationProps) {
  return (
    <div>
      <span>Remote {instanceId}</span>
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
    manifest: { id: 'cashflow', displayName: 'Cashflow', contractVersion: APPLICATION_CONTRACT_VERSION },
    Application: Cashflow,
  }),
});

describe('PortalHost', () => {
  beforeEach(() => window.history.replaceState({}, '', '/'));

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
        manifest: { id: 'cashflow', displayName: 'Cashflow', contractVersion: APPLICATION_CONTRACT_VERSION },
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
});
