import { useSyncExternalStore } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  IDENTITY_CONTRACT_VERSION,
  type ApplicationProps,
  type IdentityCapability,
  type IdentitySnapshot,
} from '@fm/platform-contracts';
import { PortalHost } from './PortalHost';
import { entry } from './test-fixtures';
import type { RemoteRuntime } from './remote';

function Cashflow({ capabilities, instanceId }: ApplicationProps) {
  const appearance = capabilities.appearance.getSnapshot();
  return (
    <div>
      <span>
        Remote {instanceId} {appearance.scheme} {appearance.density}
      </span>
      <button onClick={() => capabilities.notifications.show('Cashflow ready')}>Notify</button>
      <button onClick={() => capabilities.telemetry.track('test')}>Track</button>
      <button onClick={() => capabilities.navigation.navigate('/cashflow/details/CF-1001')}>
        Details
      </button>
      <button onClick={() => capabilities.workspace.closeCurrent()}>Close from app</button>
    </div>
  );
}

function runtime(): RemoteRuntime {
  return {
    registerRemotes: jest.fn(),
    loadRemote: jest.fn().mockResolvedValue({
      manifest: {
        id: 'cashflow',
        displayName: 'Cashflow',
        contractVersion: '1.0.0',
        appearanceContractVersion: '1.0.0',
        identityContractVersion: IDENTITY_CONTRACT_VERSION,
      },
      Application: Cashflow,
    }),
  };
}

function openCashflowTile() {
  fireEvent.click(screen.getByRole('button', { name: 'New tile' }));
  fireEvent.click(screen.getByRole('button', { name: 'Open Cashflow' }));
}

function searchTiles(value: string) {
  fireEvent(
    screen.getByRole('textbox', { name: 'Search tiles' }),
    new CustomEvent('sc-input', { detail: { value } }),
  );
}

function selectMenuItem(value: string) {
  fireEvent(
    document.querySelector('sc-menu') as unknown as Element,
    new CustomEvent('sc-select', { detail: { item: { value } } }),
  );
}

describe('production PortalHost', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    window.localStorage.clear();
  });

  it('opens, delegates capabilities, closes, and reopens fresh instances', async () => {
    const remote = runtime();
    render(<PortalHost registry={{ applications: [entry] }} runtime={remote} />);
    openCashflowTile();
    expect(await screen.findByText(/Remote cashflow-1/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getByRole('status')).toHaveTextContent('Cashflow ready');
    fireEvent(
      document.querySelector('sc-toast') as unknown as Element,
      new CustomEvent('sc-hide'),
    );
    const info = jest.spyOn(console, 'info').mockImplementation(() => undefined);
    fireEvent.click(screen.getByRole('button', { name: 'Track' }));
    expect(info).toHaveBeenCalledWith('platform-event', expect.objectContaining({ event: 'test' }));
    info.mockRestore();
    fireEvent.click(screen.getByRole('button', { name: 'Details' }));
    expect(window.location.pathname).toBe('/cashflow/details/CF-1001');
    fireEvent.click(screen.getByRole('button', { name: 'Close from app' }));
    openCashflowTile();
    expect(await screen.findByText(/Remote cashflow-2/)).toBeInTheDocument();
  });

  it('composes the shell from Ratan WebKit catalog components', () => {
    const { container } = render(
      <PortalHost registry={{ applications: [entry] }} runtime={runtime()} />,
    );
    expect(container.querySelector('.portal-app-bar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open user menu' })).toBeInTheDocument();
    expect(container.querySelector('sc-tab-group')).toBeInTheDocument();
    expect(container.querySelector('.portal-empty-state')).toBeInTheDocument();
  });

  it('finds tiles by title or description, then opens the selected tile', async () => {
    render(<PortalHost registry={{ applications: [entry] }} runtime={runtime()} />);
    fireEvent.click(screen.getByRole('button', { name: 'New tile' }));
    const dialog = document.querySelector('sc-dialog');
    expect(dialog).toHaveProperty('label', 'New tile');
    expect(dialog).toBeInstanceOf(customElements.get('sc-dialog')!);
    expect(screen.getByText('Operations')).toBeInTheDocument();
    expect(screen.getByLabelText('Available')).toBeInstanceOf(customElements.get('sc-badge')!);
    searchTiles('liquidity');
    expect(screen.getByText('Cashflow')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open Cashflow' }));
    expect(await screen.findByText(/Remote cashflow-1/)).toBeInTheDocument();
    expect(document.querySelector('sc-dialog')).not.toBeInTheDocument();
  });

  it('offers profile and logout from the avatar menu', () => {
    const onLogout = jest.fn();
    render(
      <PortalHost registry={{ applications: [entry] }} runtime={runtime()} onLogout={onLogout} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open user menu' }));
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toBeInTheDocument();
    selectMenuItem('logout');
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('uses fallback tile metadata and communicates profile, notification, and empty search actions', () => {
    const platformEntry = {
      ...entry,
      id: 'identity',
      displayName: 'Identity profile',
      basePath: '/identity',
    };
    render(<PortalHost registry={{ applications: [entry, platformEntry] }} runtime={runtime()} />);
    fireEvent.click(screen.getByRole('button', { name: 'New tile' }));
    expect(screen.getByText('Platform')).toBeInTheDocument();
    searchTiles('unknown');
    expect(screen.getByText('No matching tiles')).toBeInTheDocument();
    fireEvent(
      document.querySelector('sc-dialog') as unknown as Element,
      new CustomEvent('sc-hide'),
    );
    expect(document.querySelector('sc-dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }));
    expect(screen.getByRole('status')).toHaveTextContent('No new notifications.');
    fireEvent(
      document.querySelector('sc-toast') as unknown as Element,
      new CustomEvent('sc-hide'),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open user menu' }));
    selectMenuItem('profile');
    expect(screen.getByRole('status')).toHaveTextContent('Profile is not available in this pilot.');
  });

  it('keeps independently mounted duplicate instances and restores the previous tab on close', async () => {
    render(<PortalHost registry={{ applications: [entry] }} runtime={runtime()} />);
    openCashflowTile();
    await screen.findByText(/Remote cashflow-1/);
    openCashflowTile();
    expect(await screen.findByText(/Remote cashflow-2/)).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Cashflow 1' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Cashflow 2' })).toBeInTheDocument();
    fireEvent(
      document.querySelector('sc-tab-group') as unknown as Element,
      new CustomEvent('sc-tab-select', { detail: { name: 'cashflow-1' } }),
    );
    expect(screen.getByText(/Remote cashflow-1/)).toBeVisible();
    const tabGroup = document.querySelector('sc-tab-group') as unknown as Element;
    const leakedClose = jest.fn();
    tabGroup.addEventListener('sc-close', leakedClose);
    fireEvent(
      screen.getByRole('tab', { name: 'Cashflow 1' }),
      new CustomEvent('sc-close', {
        bubbles: true,
        detail: { name: 'cashflow-1' },
      }),
    );
    expect(leakedClose).not.toHaveBeenCalled();
    expect(screen.getByText(/Remote cashflow-2/)).toBeVisible();
    expect(screen.queryByRole('tab', { name: 'Cashflow 1' })).not.toBeInTheDocument();
  });

  it('boots nested routes and responds to browser history', async () => {
    window.history.replaceState({}, '', '/cashflow/details/CF-1002');
    render(<PortalHost registry={{ applications: [entry] }} runtime={runtime()} />);
    expect(await screen.findByText(/Remote cashflow-1/)).toBeInTheDocument();
    act(() => {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(await screen.findByText('Choose an application')).toBeInTheDocument();
  });

  it('owns persisted live appearance without replacing capability identity', async () => {
    let supplied: ApplicationProps['capabilities']['appearance'] | undefined;
    const remote = runtime();
    (remote.loadRemote as jest.Mock).mockResolvedValueOnce({
      manifest: {
        id: 'cashflow',
        displayName: 'Cashflow',
        contractVersion: '1.0.0',
        appearanceContractVersion: '1.0.0',
        identityContractVersion: IDENTITY_CONTRACT_VERSION,
      },
      Application: ({ capabilities }: ApplicationProps) => {
        supplied = capabilities.appearance;
        return <span>Appearance remote</span>;
      },
    });
    render(<PortalHost registry={{ applications: [entry] }} runtime={remote} />);
    openCashflowTile();
    await screen.findByText('Appearance remote');
    const identity = supplied;
    const listener = jest.fn();
    const unsubscribe = supplied?.subscribe(listener);
    fireEvent.click(screen.getByRole('button', { name: 'Use light theme' }));
    await waitFor(() => expect(listener).toHaveBeenCalled());
    expect(supplied).toBe(identity);
    expect(identity?.getSnapshot()).toMatchObject({ scheme: 'light', density: 'compact' });
    expect(document.querySelector('[data-ratan-scope="host"]')).toHaveAttribute(
      'data-ratan-theme',
      'light',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Use dark theme' }));
    await waitFor(() =>
      expect(identity?.getSnapshot()).toMatchObject({ scheme: 'dark', density: 'compact' }),
    );
    unsubscribe?.();
  });

  it('owns a truthful anonymous identity capability', async () => {
    let supplied: ApplicationProps['capabilities']['identity'];
    const remote = runtime();
    (remote.loadRemote as jest.Mock).mockResolvedValueOnce({
      manifest: {
        id: 'cashflow',
        displayName: 'Cashflow',
        contractVersion: '1.0.0',
        appearanceContractVersion: '1.0.0',
        identityContractVersion: IDENTITY_CONTRACT_VERSION,
      },
      Application: ({ capabilities }: ApplicationProps) => {
        supplied = capabilities.identity;
        return <span>Identity remote</span>;
      },
    });
    render(<PortalHost registry={{ applications: [entry] }} runtime={remote} />);
    openCashflowTile();
    await screen.findByText('Identity remote');
    expect(supplied?.getSnapshot()).toEqual({
      state: 'anonymous',
      contractVersion: IDENTITY_CONTRACT_VERSION,
    });
    expect(Object.isFrozen(supplied?.getSnapshot())).toBe(true);
  });

  it('delivers an injected capability by reference and preserves live logout', async () => {
    let current: IdentitySnapshot = {
      state: 'authenticated',
      userId: 'maker-one',
      permissions: ['limits:write'],
      contractVersion: IDENTITY_CONTRACT_VERSION,
    };
    const listeners = new Set<(snapshot: IdentitySnapshot) => void>();
    const identity: IdentityCapability = {
      getSnapshot: () => current,
      subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    };
    let supplied: IdentityCapability | undefined;
    const remote = runtime();
    (remote.loadRemote as jest.Mock).mockResolvedValueOnce({
      manifest: {
        id: 'cashflow',
        displayName: 'Cashflow',
        contractVersion: '1.0.0',
        appearanceContractVersion: '1.0.0',
        identityContractVersion: IDENTITY_CONTRACT_VERSION,
      },
      Application: ({ capabilities }: ApplicationProps) => {
        supplied = capabilities.identity;
        const snapshot = useSyncExternalStore(
          capabilities.identity!.subscribe,
          capabilities.identity!.getSnapshot,
          capabilities.identity!.getSnapshot,
        );
        return <span>Live identity {snapshot.state}</span>;
      },
    });
    render(
      <PortalHost registry={{ applications: [entry] }} runtime={remote} identity={identity} />,
    );
    openCashflowTile();
    expect(await screen.findByText('Live identity authenticated')).toBeInTheDocument();
    expect(supplied).toBe(identity);
    act(() => {
      current = { state: 'anonymous', contractVersion: IDENTITY_CONTRACT_VERSION };
      listeners.forEach((listener) => listener(current));
    });
    expect(screen.getByText('Live identity anonymous')).toBeInTheDocument();
    expect(supplied).toBe(identity);
  });

  it('contains remote failures and forces retry registration', async () => {
    const remote = runtime();
    (remote.loadRemote as jest.Mock).mockRejectedValueOnce('offline');
    render(<PortalHost registry={{ applications: [entry] }} runtime={remote} />);
    openCashflowTile();
    expect(await screen.findByText('offline')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Retry Cashflow' }));
    expect(await screen.findByText(/Remote cashflow-1/)).toBeInTheDocument();
    expect(remote.registerRemotes).toHaveBeenLastCalledWith(expect.any(Array), { force: true });
  });
});
