import React from "react";
import { useContext } from "../../../hooks/provider";
import { findTileConfig } from "../../../utils/drawer";
import { uuidv4, validateTile } from "../../../utils/common";
import { Container } from "../../../hooks/model/workspaces";
import useDispatcher from "../../../hooks/dispathcer";
import useAnalytics from "../../../analytics";
import { getHooksBase } from "../../../hooks/HooksBase";
import { openTileUtil } from "./util";
import { Tile } from "../../../components/Drawer/common/interface";
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
    (tile: Tile, parameters_?: string) => {
      const id = uuidv4();
      const container: Container = {
        ...tile,
        id,
        panelId: id,
        tabId: id,
      };
      try {
        container.parameters = JSON.parse(parameters_ ?? "{}") as Record<
          string,
          unknown
        >;
      } catch (e) {
        console.error(e);
      }
      addTile(container);
      setTimeout(() => {
        const { store: _store } = getHooksBase();
        const workspaces = _store?.workspaces ?? [];
        dispacthCurrentWorkspace(workspaces[workspaces.length - 1]);
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
    const params = new URLSearchParams(window.location.search);
    const container = params.get("container");
    const module = params.get("module");
    const tile = params.get("tile");
    if (container && module && tile) {
      openTile(container, module, tile, params.get("parameters") ?? undefined);
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
