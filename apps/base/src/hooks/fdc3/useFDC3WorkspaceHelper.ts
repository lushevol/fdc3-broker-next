import React from 'react';
import useParameters from '../../pages/Home/common/useParameters';
import { useWorkspace } from '../provider/workspace';

export const useFDC3WorkspaceHelper = () => {
  const { openTile } = useParameters();
  const { findWorkspaceById, setCurrentWorkspace } = useWorkspace();
  const workspaceOpenTile = React.useCallback(
    async (
      {
        container,
        module,
        tile,
      }: {
        container: string;
        module: string;
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
      const id = openTile(container, module, tile);
      const opening = id ? true : false;
      console.log(opening ? '[FMPTP FDC3] Tile is opening' : '[FMPTP FDC3] Tile not opened');
      // pop a event to platform broker so that it can pass the context to FMPTP

      return {
        workspaceId: id,
        newTile: true,
        opened: opening,
        failedReason: '',
      };
    },
    [findWorkspaceById, setCurrentWorkspace, openTile],
  );

  return {
    workspaceOpenTile,
  };
};
