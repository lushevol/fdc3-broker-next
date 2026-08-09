import React from "react";
import { useContext } from "../../../hooks/provider";
import { findTileConfig } from "../../../utils/drawer";
import { uuidv4, validateTile } from "../../../utils/common";
import { Container } from "../../../hooks/model/workspaces";
import useDispatcher from "../../../hooks/dispathcer";
import useAnalytics from "../../../analytics";
import { getHooksBase } from "../../../hooks/HooksBase";
import { openTileUtil } from "./util";
const Module_PREFIX = `@${process.env.orgName}`;

const useParameters = () => {
  const [store] = useContext();
  const { TileEvent } = useAnalytics();
  const { dispacthWorkspaces, dispacthCurrentWorkspace, addWorkspace } =
    useDispatcher();
  const addTile = React.useCallback(
    (inputContainer: Container) => {
      if (store?.workspaces) {
        const workspaces = [...store.workspaces];
        let index = 0;
        if (store?.currentWorkspace?.id) {
          index = workspaces.findIndex(
            (w) => w.id === store?.currentWorkspace?.id
          );
        } else {
          dispacthCurrentWorkspace(store?.workspaces[0]);
        }
        const container: Container = {
          ...inputContainer,
          id: uuidv4(),
        };
        const workspace = workspaces[index];
        let containerLabel = inputContainer.module.replace("/", "");
        let tile = inputContainer.tile.replace("/", "");
        let title = inputContainer.title;
        if (workspace.containers && workspace.containers.length === 0) {
          workspaces[index].containers = [container];
          workspaces[index].label = container.title;
          dispacthWorkspaces(workspaces);
        } else {
          addWorkspace(container);
        }
        TileEvent("open", { name: title, container: containerLabel, tile });
      }
    },
    [store?.workspaces, store?.currentWorkspace]
  );
  const setParamsAndAddTile = React.useCallback(
    (tile, parameters_?: string) => {
      try {
        tile.parameters = JSON.parse(parameters_ ?? "{}");
      } catch (e) {
        console.error(e);
      }
      addTile(tile);
      setTimeout(() => {
        const { store: _store } = getHooksBase();
        dispacthCurrentWorkspace(
          (_store?.workspaces as [])[(_store?.workspaces as [])?.length - 1]
        );
      }, 1000);
    },
    [store?.workspaces, store.entities, addTile]
  );
  const openTile = React.useCallback(
    (
      container_: string,
      module_: string,
      tile_: string,
      parameters_?: string
    ) => {
      const tile = findTileConfig(
        store.drawers,
        `${Module_PREFIX}/${container_}`,
        `/${module_}`,
        `/${tile_}`
      );
      openTileUtil(
        tile?.isTemplate,
        validateTile(store.entities, tile?.entity, tile?.subject),
        setParamsAndAddTile,
        tile,
        parameters_
      );
    },
    [store?.workspaces, store.entities, addTile, store.drawers]
  );
  React.useEffect(() => {
    const params: any = new URLSearchParams(window.location.search);
    if (
      params?.get("container") &&
      params?.get("module") &&
      params?.get("tile")
    ) {
      openTile(
        params?.get("container"),
        params?.get("module"),
        params?.get("tile"),
        params?.get("parameters")
      );
      const { history } = window;
      history.replaceState(null, "", "/");
    }
  }, []);

  return {
    addTile,
    openTile,
    setParamsAndAddTile,
  };
};

export default useParameters;
