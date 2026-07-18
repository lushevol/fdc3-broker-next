import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ApplicationProps } from '@fm/platform-contracts';
import { PortalHost } from './PortalHost';
import { entry } from './test-fixtures';
import type { RemoteRuntime } from './remote';

function Cashflow({ capabilities, instanceId }: ApplicationProps) {
  const appearance = capabilities.appearance.getSnapshot();
  return <div><span>Remote {instanceId} {appearance.scheme} {appearance.density}</span><button onClick={() => capabilities.notifications.show('Cashflow ready')}>Notify</button><button onClick={() => capabilities.telemetry.track('test')}>Track</button><button onClick={() => capabilities.navigation.navigate('/cashflow/details/CF-1001')}>Details</button><button onClick={() => capabilities.workspace.closeCurrent()}>Close from app</button></div>;
}

function runtime(): RemoteRuntime {
  return { registerRemotes: jest.fn(), loadRemote: jest.fn().mockResolvedValue({ manifest: {
    id: 'cashflow', displayName: 'Cashflow', contractVersion: '1.0.0', appearanceContractVersion: '1.0.0',
  }, Application: Cashflow }) };
}

describe('production PortalHost', () => {
  beforeEach(() => { window.history.replaceState({}, '', '/'); window.localStorage.clear(); });

  it('opens, delegates capabilities, closes, and reopens fresh instances', async () => {
    const remote = runtime();
    render(<PortalHost registry={{ applications: [entry] }} runtime={remote} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open Cashflow' }));
    expect(await screen.findByText(/Remote cashflow-1/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getByRole('status')).toHaveTextContent('Cashflow ready');
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    const info = jest.spyOn(console, 'info').mockImplementation(() => undefined);
    fireEvent.click(screen.getByRole('button', { name: 'Track' }));
    expect(info).toHaveBeenCalledWith('platform-event', expect.objectContaining({ event: 'test' }));
    info.mockRestore();
    fireEvent.click(screen.getByRole('button', { name: 'Details' }));
    expect(window.location.pathname).toBe('/cashflow/details/CF-1001');
    fireEvent.click(screen.getByRole('button', { name: 'Close from app' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open Cashflow' }));
    expect(await screen.findByText(/Remote cashflow-2/)).toBeInTheDocument();
  });

  it('boots nested routes and responds to browser history', async () => {
    window.history.replaceState({}, '', '/cashflow/details/CF-1002');
    render(<PortalHost registry={{ applications: [entry] }} runtime={runtime()} />);
    expect(await screen.findByText(/Remote cashflow-1/)).toBeInTheDocument();
    act(() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); });
    expect(await screen.findByText('Choose an application')).toBeInTheDocument();
  });

  it('owns persisted live appearance without replacing capability identity', async () => {
    let supplied: ApplicationProps['capabilities']['appearance'] | undefined;
    const remote = runtime();
    (remote.loadRemote as jest.Mock).mockResolvedValueOnce({ manifest: {
      id: 'cashflow', displayName: 'Cashflow', contractVersion: '1.0.0', appearanceContractVersion: '1.0.0',
    }, Application: ({ capabilities }: ApplicationProps) => { supplied = capabilities.appearance; return <span>Appearance remote</span>; } });
    render(<PortalHost registry={{ applications: [entry] }} runtime={remote} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open Cashflow' }));
    await screen.findByText('Appearance remote');
    const identity = supplied;
    const listener = jest.fn();
    const unsubscribe = supplied?.subscribe(listener);
    fireEvent.click(screen.getByRole('button', { name: 'Use light theme' }));
    fireEvent.click(screen.getByRole('button', { name: 'Use comfortable density' }));
    await waitFor(() => expect(listener).toHaveBeenCalled());
    expect(supplied).toBe(identity);
    expect(identity?.getSnapshot()).toMatchObject({ scheme: 'light', density: 'comfortable' });
    expect(document.querySelector('[data-ratan-scope="host"]')).toHaveAttribute('data-ratan-theme', 'light');
    unsubscribe?.();
  });

  it('contains remote failures and forces retry registration', async () => {
    const remote = runtime();
    (remote.loadRemote as jest.Mock).mockRejectedValueOnce('offline');
    render(<PortalHost registry={{ applications: [entry] }} runtime={remote} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open Cashflow' }));
    expect(await screen.findByText('offline')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Retry Cashflow' }));
    expect(await screen.findByText(/Remote cashflow-1/)).toBeInTheDocument();
    expect(remote.registerRemotes).toHaveBeenLastCalledWith(expect.any(Array), { force: true });
  });
});
