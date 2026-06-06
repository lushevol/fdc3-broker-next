import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Container from './Container';
import type { Container as ContainerProps } from '../../../hooks/model/workspaces';

const mockRegisterTile = jest.fn();
const mockUnregisterTile = jest.fn();
const mockUseFDC3 = jest.fn(() => ({
  registerTile: mockRegisterTile,
  unregisterTile: mockUnregisterTile,
}));
const mockAgentProvider = jest.fn(
  ({
    children,
    appIdentifier,
  }: {
    children: React.ReactNode;
    appIdentifier: { appId: string; instanceId: string };
  }) => (
    <div
      data-testid="fdc3-agent-provider"
      data-app-id={appIdentifier.appId}
      data-instance-id={appIdentifier.instanceId}
    >
      {children}
    </div>
  ),
);

jest.mock(
  'ratan-fdc3-agent',
  () => ({
    AgentProvider: (props: {
      children: React.ReactNode;
      appIdentifier: { appId: string; instanceId: string };
    }) => mockAgentProvider(props),
    useFDC3: () => mockUseFDC3(),
  }),
  { virtual: true },
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
    mockAgentProvider.mockClear();
    mockRegisterTile.mockClear();
    mockUnregisterTile.mockClear();
    mockUseFDC3.mockClear();
    (System.import as jest.Mock).mockClear();
  });

  it('wraps remote tiles with a scoped FDC3 agent and registers the tile lifecycle in base', async () => {
    const { unmount } = render(<Container {...remoteTileProps} />);

    const provider = await screen.findByTestId('fdc3-agent-provider');

    expect(provider).toHaveAttribute('data-app-id', 'template_tile_fdc3_2');
    expect(provider).toHaveAttribute('data-instance-id', 'tile-instance-1');
    await waitFor(() => {
      expect(mockRegisterTile).toHaveBeenCalledWith('tile-instance-1', 'template_tile_fdc3_2');
    });

    unmount();

    await waitFor(() => {
      expect(mockUnregisterTile).toHaveBeenCalledWith('tile-instance-1');
    });
  });
});
