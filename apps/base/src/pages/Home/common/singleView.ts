import type { Tile } from '../../../hooks/model/root';
import type { Container, Workspace } from '../../../hooks/model/workspaces';

export const SINGLE_VIEW_QUERY_PARAM = 'singleView';
const SINGLE_VIEW_WIDTH = 1200;
const SINGLE_VIEW_HEIGHT = 800;

type OpenFinPlatform = {
  createWindow: (options: {
    name: string;
    url: string;
    defaultWidth: number;
    defaultHeight: number;
    autoShow: boolean;
  }) => Promise<unknown>;
};

export class SingleViewLaunchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SingleViewLaunchError';
  }
}

export const isSingleViewRequest = (search = window.location.search): boolean =>
  Boolean(new URLSearchParams(search).get(SINGLE_VIEW_QUERY_PARAM));

export const buildSingleViewUrl = (id: string, location = window.location): string => {
  const url = new URL(location.href);
  url.searchParams.set(SINGLE_VIEW_QUERY_PARAM, id);
  return url.toString();
};

export const getSingleViewTileId = (tile: Pick<Tile, 'tile'>): string =>
  tile.tile.replace(/^\//, '');

export const findSingleViewTile = (
  targetTileId: string | null,
  tiles: Tile[] | undefined,
): Tile | undefined => tiles?.find((tile) => getSingleViewTileId(tile) === targetTileId);

export const createSingleViewContainer = (tile: Tile): Container => {
  const tileId = getSingleViewTileId(tile);
  return {
    ...tile,
    id: tileId,
    panelId: `single-view-${tileId}`,
    tabId: `single-view-${tileId}`,
  };
};

export const removeSingleViewSourceWorkspace = (
  workspaces: Workspace[],
  sourceWorkspaceId: string,
): Workspace[] => workspaces.filter((workspace) => workspace.id !== sourceWorkspaceId);

const getOpenFinPlatform = (): OpenFinPlatform | null => {
  if (typeof window.fin === 'undefined') return null;
  try {
    const platform = window.fin.Platform?.getCurrentSync?.();
    return platform && typeof platform.createWindow === 'function'
      ? (platform as unknown as OpenFinPlatform)
      : null;
  } catch {
    return null;
  }
};

export const launchSingleView = async (
  targetTileId: string,
  dependencies: {
    createWindowId?: () => string;
    openWindow?: Window['open'];
    getPlatform?: () => OpenFinPlatform | null;
  } = {},
): Promise<string> => {
  const createWindowId = dependencies.createWindowId ?? (() => crypto.randomUUID());
  const windowId = createWindowId();
  const url = buildSingleViewUrl(targetTileId);

  try {
    const platform = (dependencies.getPlatform ?? getOpenFinPlatform)();
    if (platform) {
      await platform.createWindow({
        name: `mfe-base-single-view-${windowId}`,
        url,
        defaultWidth: SINGLE_VIEW_WIDTH,
        defaultHeight: SINGLE_VIEW_HEIGHT,
        autoShow: true,
      });
    } else {
      const tab = (dependencies.openWindow ?? window.open)(url, '_blank');
      if (!tab) throw new SingleViewLaunchError('Your browser blocked the single-view tab.');
      tab.focus();
    }
    return windowId;
  } catch (error) {
    if (error instanceof SingleViewLaunchError) throw error;
    throw new SingleViewLaunchError('Unable to open the tile in a single-view window.');
  }
};
