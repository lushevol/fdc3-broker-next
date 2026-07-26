import type { Tile } from '../../../hooks/model/root';
import {
  buildSingleViewUrl,
  createSingleViewContainer,
  findSingleViewTile,
  getSingleViewTileId,
  launchSingleView,
  removeSingleViewSourceWorkspace,
  SingleViewLaunchError,
} from './singleView';

const tile: Tile = {
  container: '@fm/tile',
  module: '/module',
  tile: '/tile',
  title: 'Tile',
  emailSupport: 'support@example.com',
  panelId: 'panel-1',
};

describe('single view launch', () => {
  it('opens a browser tab using only the target tile ID', async () => {
    const openWindow = jest.fn(() => ({ focus: jest.fn() })) as unknown as Window['open'];

    await expect(
      launchSingleView('tile', { createWindowId: () => 'window-1', openWindow }),
    ).resolves.toBe('window-1');

    expect(openWindow).toHaveBeenCalledWith(buildSingleViewUrl('tile'), '_blank');
    expect(window.localStorage.length).toBe(0);
  });

  it('uses an OpenFin platform window when available', async () => {
    const createWindow = jest.fn().mockResolvedValue({});

    await launchSingleView('tile', {
      createWindowId: () => 'window-1',
      getPlatform: () => ({ createWindow }),
    });

    expect(createWindow).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'mfe-base-single-view-window-1',
        url: buildSingleViewUrl('tile'),
        defaultWidth: 1200,
        defaultHeight: 800,
      }),
    );
  });

  it('reports a blocked browser tab without writing a handoff record', async () => {
    await expect(
      launchSingleView('tile', { createWindowId: () => 'blocked', openWindow: () => null }),
    ).rejects.toBeInstanceOf(SingleViewLaunchError);

    expect(window.localStorage.length).toBe(0);
  });

  it('resolves a tile from the accessible tile catalogue, not a workspace instance', () => {
    expect(getSingleViewTileId(tile)).toBe('tile');
    expect(findSingleViewTile('tile', [tile])).toEqual(tile);
    expect(findSingleViewTile('unknown', [tile])).toBeUndefined();
    expect(createSingleViewContainer(tile)).toMatchObject({
      id: 'tile',
      container: '@fm/tile',
      module: '/module',
      tile: '/tile',
    });
  });

  it('removes the source workspace after its tile moves to single view', () => {
    const sourceWorkspace = {
      id: 'workspace-1',
      label: 'Workspace 1',
      isActive: true,
      containers: [createSingleViewContainer(tile)],
    };
    const remainingWorkspace = {
      id: 'workspace-2',
      label: 'Workspace 2',
      isActive: false,
      containers: [],
    };

    expect(
      removeSingleViewSourceWorkspace([sourceWorkspace, remainingWorkspace], sourceWorkspace.id),
    ).toEqual([remainingWorkspace]);
  });
});
