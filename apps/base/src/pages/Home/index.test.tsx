import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './index';

const capturedConfigs: Array<Record<string, unknown>> = [];

jest.mock('./common/useController', () => ({
  __esModule: true,
  default: () => ({
    store: {
      currentWorkspace: {
        id: 'workspace-1',
        label: 'Workspace 1',
        containers: [
          {
            id: 'tile-instance-1',
            container: '@fm/template',
            module: '/template_tile_fdc3_2',
            tile: '/template_tile_fdc3_2',
            title: 'FDC3 Tile 2',
            emailSupport: 'ops@example.com',
            panelId: 'panel-1',
            tabId: 'workspace-1',
          },
        ],
      },
      workspaces: [
        {
          id: 'workspace-1',
          label: 'Workspace 1',
          containers: [
            {
              id: 'tile-instance-1',
              container: '@fm/template',
              module: '/template_tile_fdc3_2',
              tile: '/template_tile_fdc3_2',
              title: 'FDC3 Tile 2',
              emailSupport: 'ops@example.com',
              panelId: 'panel-1',
              tabId: 'workspace-1',
            },
          ],
        },
      ],
      refreshTab: {},
    },
    value: 'workspace-1',
    handleChange: jest.fn(),
    add: jest.fn(),
    edit: jest.fn(),
    remove: jest.fn(),
    refreshTab: jest.fn(),
    focus: jest.fn(() => jest.fn()),
    ready: true,
    showTimeout: false,
    setShowTimeout: jest.fn(),
    mouseMove: jest.fn(),
    validateWorkspaceReady: true,
    closeAllTiles: jest.fn(() => []),
  }),
}));

jest.mock('./common/useOpenfin', () => ({
  __esModule: true,
  default: () => ({
    channelMessage: '',
    clearMessage: jest.fn(),
  }),
}));

jest.mock('./common/useParameters', () => ({
  __esModule: true,
  default: () => ({
    openTile: jest.fn(),
  }),
}));

jest.mock('../../fdc3/useFDC3WorkspaceHelper', () => ({
  useFDC3WorkspaceHelper: () => ({
    workspaceOpenTile: jest.fn(async ({ tile }: { tile: string }) => ({
      tile,
      workspaceId: 'workspace-1',
    })),
  }),
}));

jest.mock('../../components/AppBar', () => () => <div>AppBar</div>);
jest.mock('../../components/Empty', () => () => <div>Empty</div>);
jest.mock('../../components/Snackbar', () => () => null);
jest.mock('../../components/Timeout', () => () => null);
jest.mock('../../components/TabItem', () => () => <span>Tab Item</span>);
jest.mock('./common/Container', () => () => <div>Container</div>);
jest.mock('../../components/ChatbotSidebarV2/exports', () => ({
  ChatbotSidebarV2: ({
    toolRegistryConfig,
  }: {
    toolRegistryConfig: Record<string, unknown>;
  }) => {
    capturedConfigs.push(toolRegistryConfig);
    return <div>Chatbot Sidebar</div>;
  },
}));
jest.mock('../../components/TabPanel', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  a11yProps: (id: string) => ({ id }),
}));
jest.mock('./common/style', () => {
  const MockRoot = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  return {
    __esModule: true,
    default: MockRoot,
    classes: {
      main: 'main',
      tabs: 'tabs',
      firsttab: 'firsttab',
      tab: 'tab',
      add: 'add',
    },
    PREFIX: 'home-root',
  };
});

describe('Home workspace context wiring', () => {
  beforeEach(() => {
    capturedConfigs.length = 0;
    window.history.pushState({}, '', '/');
  });

  it('includes active tile and app identifiers in the chatbot workspace snapshot', () => {
    render(<Home />);

    expect(capturedConfigs).toHaveLength(1);

    const toolRegistryConfig = capturedConfigs[0] as {
      getWorkspaceSnapshot: () => {
        activeTileId: string | null;
        activeAppId: string | null;
        activeTileTitle: string | null;
      };
    };

    expect(toolRegistryConfig.getWorkspaceSnapshot()).toMatchObject({
      activeTileTitle: 'FDC3 Tile 2',
      activeTileId: 'tile-instance-1',
      activeAppId: 'template_tile_fdc3_2',
    });
  });

  it('keeps workspace tabs outside the App Bar header without the new layout flag', () => {
    render(<Home />);

    const header = screen.getByText('AppBar').closest('header');
    const workspaceTabs = screen.getByTestId('home-root_workspaces');

    expect(header).not.toContainElement(workspaceTabs);
  });

  it('composes the App Bar and workspace tabs in one header for the new layout', () => {
    window.history.pushState({}, '', '/?new-layout=true');
    render(<Home />);

    const header = screen.getByText('AppBar').closest('header');
    const workspaceTabs = screen.getByTestId('home-root_workspaces');

    expect(header).toContainElement(workspaceTabs);
  });
});
