import { act, render, screen } from '@testing-library/react';
import { TileSurface } from './TileSurface';
import { registerTileWorkspace } from './tileWorkspace';
import type { TileInstance } from './workspaceStore';

const mockLoad = jest.fn();
jest.mock('./tileLoader', () => ({ loaderFor: () => ({ load: mockLoad }) }));

const instance: TileInstance = {
  instanceId: 'cashflow-1', status: 'opening',
  entry: { tileId: 'cashflow', displayName: 'Cashflow', category: 'Operations', loader: 'module-federation', entry: '/cashflow', requiredEntitlements: [], contractVersion: '0.1' },
};

describe('TileSurface', () => {
  beforeAll(registerTileWorkspace);
  beforeEach(() => mockLoad.mockReset());

  it('mounts markup and extracted CSS into the same isolated Shadow Root', async () => {
    const mount = jest.fn();
    const unmount = jest.fn();
    const styleUrl = 'http://tiles.test/cashflow.css';
    const leaked = document.createElement('link');
    leaked.rel = 'stylesheet';
    leaked.href = styleUrl;
    document.head.append(leaked);
    mockLoad.mockResolvedValue({ manifest: { tileId: 'cashflow', contractVersion: '0.1' }, mount, unmount, styleUrls: [styleUrl] });
    const onTelemetry = jest.fn();
    (globalThis as typeof globalThis & { fin?: unknown }).fin = {};
    const view = render(<TileSurface active instance={instance} onClose={jest.fn()} onTelemetry={onTelemetry} />);
    await act(async () => undefined);
    const workspace = document.querySelector('tile-workspace') as HTMLElement & { tileRoot: ShadowRoot };
    expect(mount).toHaveBeenCalledWith(expect.objectContaining({ instanceId: 'cashflow-1', root: workspace.tileRoot }));
    expect(workspace.tileRoot.querySelector(`link[href="${styleUrl}"]`)).toBeInTheDocument();
    expect(document.head.querySelector(`link[href="${styleUrl}"]`)).toBeNull();
    expect(onTelemetry).toHaveBeenCalledWith(expect.objectContaining({ action: 'portal.tile.mount.succeeded' }));
    expect(onTelemetry).toHaveBeenCalledWith(expect.objectContaining({ action: 'openfin.available' }));
    view.unmount();
    expect(unmount).toHaveBeenCalledWith('cashflow-1');
    expect(workspace.tileRoot.querySelector('link')).toBeNull();
    delete (globalThis as typeof globalThis & { fin?: unknown }).fin;
  });

  it('shows a boundary message and failed telemetry when a remote cannot load', async () => {
    mockLoad.mockRejectedValue('offline');
    const onTelemetry = jest.fn();
    render(<TileSurface active={false} instance={instance} onClose={jest.fn()} onTelemetry={onTelemetry} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Cashflow could not load: offline');
    expect(onTelemetry).toHaveBeenCalledWith(expect.objectContaining({ action: 'portal.tile.mount.failed', outcome: 'failed' }));
  });

  it('does not require style or unmount exports', async () => {
    mockLoad.mockResolvedValue({ manifest: { tileId: 'cashflow', contractVersion: '0.1' }, mount: jest.fn() });
    const view = render(<TileSurface active instance={instance} onClose={jest.fn()} onTelemetry={jest.fn()} />);
    await act(async () => undefined);
    view.unmount();
  });

  it('ignores a Tile module that resolves after its surface is disposed', async () => {
    let resolveModule: (value: unknown) => void = () => undefined;
    mockLoad.mockReturnValue(new Promise((resolve) => { resolveModule = resolve; }));
    const mount = jest.fn();
    const view = render(<TileSurface active instance={instance} onClose={jest.fn()} onTelemetry={jest.fn()} />);
    view.unmount();
    await act(async () => resolveModule({ manifest: { tileId: 'cashflow', contractVersion: '0.1' }, mount }));
    expect(mount).not.toHaveBeenCalled();
  });
});
