import { createWorkspaceStore, type TileRegistryEntry } from './workspaceStore';

const cashflow: TileRegistryEntry = {
  tileId: 'cashflow',
  displayName: 'Cashflow',
  category: 'Operations',
  loader: 'module-federation',
  entry: 'http://127.0.0.1:9101/mf-manifest.json',
  exposedModule: './application',
  requiredEntitlements: ['cashflow.read'],
  contractVersion: '0.1',
};

const positions: TileRegistryEntry = {
  ...cashflow,
  tileId: 'positions',
  displayName: 'Positions',
  requiredEntitlements: ['positions.read'],
};

describe('workspace store', () => {
  it('filters the registry and enforces entitlement again when opening', () => {
    const store = createWorkspaceStore([cashflow, positions], ['cashflow.read']);

    expect(store.getState().availableTiles()).toEqual([cashflow]);
    expect(store.getState().openTile('positions')).toEqual({ ok: false, reason: 'denied' });
    expect(store.getState().instances).toEqual([]);
  });

  it('creates independent, monotonically numbered instances per tile type', () => {
    const store = createWorkspaceStore([cashflow, positions], ['cashflow.read', 'positions.read']);

    expect(store.getState().openTile('cashflow')).toEqual({ ok: true, instanceId: 'cashflow-1' });
    expect(store.getState().openTile('cashflow')).toEqual({ ok: true, instanceId: 'cashflow-2' });
    expect(store.getState().openTile('positions')).toEqual({ ok: true, instanceId: 'positions-1' });
    expect(store.getState().instances.map((instance) => instance.instanceId)).toEqual([
      'cashflow-1',
      'cashflow-2',
      'positions-1',
    ]);
  });

  it('activates and closes by instance identity while preserving the other instances', () => {
    const store = createWorkspaceStore([cashflow], ['cashflow.read']);
    store.getState().openTile('cashflow');
    store.getState().openTile('cashflow');

    store.getState().activate('cashflow-1');
    expect(store.getState().activeInstanceId).toBe('cashflow-1');

    store.getState().close('cashflow-1');
    expect(store.getState().instances.map((instance) => instance.instanceId)).toEqual(['cashflow-2']);
    expect(store.getState().activeInstanceId).toBe('cashflow-2');
  });

  it('ignores unknown actions and clears the active Tile when the last instance closes', () => {
    const store = createWorkspaceStore([cashflow], ['cashflow.read']);
    expect(store.getState().openTile('missing')).toEqual({ ok: false, reason: 'unknown' });
    store.getState().activate('missing');
    expect(store.getState().activeInstanceId).toBeNull();
    store.getState().openTile('cashflow');
    store.getState().close('missing');
    store.getState().close('cashflow-1');
    expect(store.getState().activeInstanceId).toBeNull();
    expect(store.getState().instances).toEqual([]);
  });
});
