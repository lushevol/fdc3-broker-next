import { act, render } from '@testing-library/react';
import type { FDC3PlatformAdapter } from 'ratan-fdc3';
import { FDC3Integration } from './FDC3Integration';

const mockWorkspaceOpenTile = jest.fn();
let mockCapturedPlatform: FDC3PlatformAdapter | undefined;
let mockCapturedModuleLoader: unknown;

jest.mock('ratan-fdc3', () => {
  const React = jest.requireActual<typeof import('react')>('react');

  return {
    FDC3RootProvider: ({
      children,
      moduleLoader,
      platform,
    }: {
      children: React.ReactNode;
      moduleLoader?: unknown;
      platform: FDC3PlatformAdapter;
    }) => {
      mockCapturedPlatform = platform;
      mockCapturedModuleLoader = moduleLoader;
      return React.createElement(React.Fragment, null, children);
    },
  };
});

jest.mock('../hooks/provider', () => ({
  useContext: () => [
    {
      drawers: [],
      token: 'authenticated',
    },
  ],
}));

jest.mock('./useFDC3WorkspaceHelper', () => ({
  useFDC3WorkspaceHelper: () => ({
    allAccessibleTiles: [
      {
        tile: '/template_tile_fdc3_1',
        title: 'FDC3 Tile 1',
      },
    ],
    workspaceOpenTile: mockWorkspaceOpenTile,
  }),
}));

describe('FDC3Integration', () => {
  beforeEach(() => {
    mockCapturedPlatform = undefined;
    mockCapturedModuleLoader = undefined;
    mockWorkspaceOpenTile.mockReset();
  });

  it('provides base workspace opening as a host capability called by FDC3', async () => {
    mockWorkspaceOpenTile.mockResolvedValue({
      opened: true,
      workspaceId: 'workspace-1',
    });

    render(
      <FDC3Integration>
        <div>child</div>
      </FDC3Integration>,
    );

    let openedApp;
    await act(async () => {
      openedApp = await mockCapturedPlatform?.openApp({
        appId: 'template_tile_fdc3_1',
        instanceId: 'requested-workspace',
      });
    });

    expect(mockWorkspaceOpenTile).toHaveBeenCalledWith(
      { tile: 'template_tile_fdc3_1' },
      { workspaceId: 'requested-workspace' },
    );
    expect(openedApp).toEqual({
      appId: 'template_tile_fdc3_1',
      instanceId: 'workspace-1',
    });
    expect(mockCapturedModuleLoader).toBeUndefined();
  });
});
