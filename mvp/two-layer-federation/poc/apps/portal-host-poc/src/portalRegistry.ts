import type { TileRegistryEntry } from './workspaceStore';

export const LOCAL_ENTITLEMENTS = ['cashflow.read', 'positions.read'] as const;

export const LOCAL_TILE_REGISTRY: TileRegistryEntry[] = [
  {
    tileId: 'cashflow',
    displayName: 'Cashflow',
    category: 'Operations',
    loader: 'module-federation',
    entry: 'http://127.0.0.1:9101/mf-manifest.json',
    remoteName: 'mfe_cashflow_poc',
    exposedModule: './application',
    requiredEntitlements: ['cashflow.read'],
    contractVersion: '0.1',
  },
  {
    tileId: 'positions',
    displayName: 'Positions',
    category: 'Operations',
    loader: 'module-federation',
    entry: 'http://127.0.0.1:9101/mf-manifest.json',
    remoteName: 'mfe_cashflow_poc',
    exposedModule: './positions',
    requiredEntitlements: ['positions.read'],
    contractVersion: '0.1',
  },
  {
    tileId: 'restricted-risk',
    displayName: 'Risk Controls',
    category: 'Controls',
    loader: 'module-federation',
    entry: 'http://127.0.0.1:9101/mf-manifest.json',
    remoteName: 'mfe_cashflow_poc',
    exposedModule: './application',
    requiredEntitlements: ['risk.admin'],
    contractVersion: '0.1',
  },
];
