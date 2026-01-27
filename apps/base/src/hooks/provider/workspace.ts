import { useCallback } from 'react';
import useDispatcher from '../dispathcer';
import type { Container, Workspace } from '../model/workspaces';
import { useContext } from './index';

export const useWorkspace = () => {
  const [store] = useContext();
  const { dispacthCurrentWorkspace, addWorkspace } = useDispatcher();

  const findWorkspaceById = useCallback(
    (id: string) => {
      return store.workspaces?.find((w: Workspace) => w.id === id);
    },
    [store.workspaces],
  );

  const findWorkspaceByTile = useCallback(
    (tilePath: string, modulePath: string, containerPath: string) => {
      const workspace = store.workspaces?.find((i: Workspace) => {
        if (i.containers.length === 0) return false;
        return i.containers.some(
          (w: Container) =>
            w.container.endsWith(containerPath) &&
            w.module.endsWith(modulePath) &&
            w.tile.endsWith(tilePath),
        );
      });

      return workspace;
    },
    [store.workspaces],
  );

  const setCurrentWorkspace = (workspace: Workspace) => dispacthCurrentWorkspace(workspace);

  return {
    findWorkspaceById,
    findWorkspaceByTile,
    addWorkspace,
    setCurrentWorkspace,
  };
};
