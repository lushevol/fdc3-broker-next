import React from 'react';
import useParameters from '../pages/Home/common/useParameters';
import type { Tile } from '../hooks/model/root';
import { useContext } from '../hooks/provider';
import { useWorkspace } from '../hooks/provider/workspace';

export const useFDC3WorkspaceHelper = () => {
  const [store] = useContext();
  const { openTile } = useParameters();
  const { findWorkspaceById, setCurrentWorkspace } = useWorkspace();
  const workspaceOpenTile = React.useCallback(
    async (
      {
        tile,
      }: {
        tile: string;
      },
      {
        workspaceId,
      }: {
        workspaceId?: string;
      } = {},
    ) => {
      if (workspaceId) {
        const workspace = findWorkspaceById(workspaceId);
        if (workspace) {
          console.log('[FMPTP FDC3] Found target tile in workspace:', workspace.id);
          setCurrentWorkspace(workspace);

          return {
            workspaceId: workspace.id,
            newTile: false,
            opened: true,
            failedReason: '',
          };
        } else {
          console.log(
            `[FMPTP FDC3] Target workspace not found: ${workspaceId}, open a new one instead`,
          );
        }
      }
      const {
        container,
        module,
        tile: tileId,
      } = store.drawers
        ?.flatMap((drawer) => drawer.tiles)
        .find((t: Tile) => t.tile.replace(/\//, '') === tile) ?? {};

      if (container && module && tileId) {
        const id = openTile(
          container.replace(/@fm\//, ''),
          module.replace(/\//, ''),
          tileId.replace(/\//, ''),
        );
        const opening = id ? true : false;
        console.log(opening ? '[FMPTP FDC3] Tile is opening' : '[FMPTP FDC3] Tile not opened');
        // pop a event to platform broker so that it can pass the context to FMPTP

        return {
          workspaceId: id,
          newTile: true,
          opened: opening,
          failedReason: '',
        };
      }

      return {
        workspaceId: '',
        newTile: false,
        opened: false,
        failedReason: 'no tile found in drawers',
      };
    },
    [store, findWorkspaceById, setCurrentWorkspace, openTile],
  );

  const allAccessibleTiles = store.drawers?.flatMap((drawer) => drawer.tiles) ?? [];

  return {
    workspaceOpenTile,
    allAccessibleTiles,
  };
};
