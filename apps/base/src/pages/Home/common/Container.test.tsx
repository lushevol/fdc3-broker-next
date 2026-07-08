import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Container from './Container';
import type { Container as ContainerProps } from '../../../hooks/model/workspaces';

const mockFDC3TileProvider = jest.fn(
  ({
    children,
    instanceId,
    tile,
  }: {
    children: React.ReactNode;
    instanceId: string;
    tile: string;
  }) => (
    <div
      data-testid="fdc3-tile-provider"
      data-instance-id={instanceId}
      data-tile={tile}
    >
      {children}
    </div>
  ),
);

jest.mock(
  '../../../fdc3/FDC3Integration',
  () => ({
    FDC3TileProvider: (props: {
      children: React.ReactNode;
      instanceId: string;
      tile: string;
    }) => mockFDC3TileProvider(props),
  }),
);

jest.mock('../../../components/ErrorBoundry', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../components/Splash', () => ({
  __esModule: true,
  default: () => <div>Loading</div>,
}));

jest.mock('../../../admin', () => ({
  __esModule: true,
  default: () => <div>Admin Module</div>,
}));

const remoteTileProps: ContainerProps = {
  id: 'tile-instance-1',
  container: '@fm/template',
  module: '/template_tile_fdc3_2',
  tile: '/template_tile_fdc3_2',
  title: 'FDC3 Tile 2',
  emailSupport: 'ops@example.com',
  panelId: 'panel-1',
  tabId: 'workspace-1',
};

describe('Container FDC3 integration', () => {
  beforeEach(() => {
    mockFDC3TileProvider.mockClear();
    (System.import as jest.Mock).mockClear();
  });

  it('wraps remote tiles with the centralized FDC3 tile provider', async () => {
    render(<Container {...remoteTileProps} />);

    const provider = await screen.findByTestId('fdc3-tile-provider');

    expect(provider).toHaveAttribute('data-tile', '/template_tile_fdc3_2');
    expect(provider).toHaveAttribute('data-instance-id', 'tile-instance-1');
    await waitFor(() => {
      expect(System.import).toHaveBeenCalledWith('@fm/template');
    });
  });
});
