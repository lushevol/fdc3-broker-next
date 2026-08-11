import { Tile, Tiles } from "../components/Drawer/common/interface";
import { getHooksBase } from "../hooks/HooksBase";
import { Entity, Subject } from "../hooks/model/root";
import { Workspace } from "../hooks/model/workspaces";
import type { Dispatch, SetStateAction } from "react";

export const findTile = (
  drawers: Tiles[] | undefined,
  workspace: Workspace
): Tile | undefined => {
  const container = workspace.containers[0];
  if (!container) return undefined;
  return findTileConfig(
    drawers,
    container.container,
    container.module,
    container.tile
  );
};

export const findTileConfig = (
  drawers: Tiles[] | undefined,
  _container: string,
  _module: string,
  _tile: string
): Tile | undefined => {
  let aggr: Tile | undefined;
  drawers?.every((category) => {
    category.tiles?.every((tile: Tile) => {
      if (
        tile.container === _container &&
        tile.module === _module &&
        tile.tile === _tile
      ) {
        aggr = tile;
      }
      return !aggr;
    });
    return !aggr;
  });
  return aggr;
};

export const getSubject = (
  entities: Entity[],
  tile: Tile
): Subject | undefined => {
  let aggr: Subject | undefined;
  entities.every((entity) => {
    if (tile.entity?.includes(entity.name)) {
      entity.subjects.every((subject) => {
        if (subject.name === tile.subject) {
          aggr = subject;
        }
        return !aggr;
      });
    }
    return !aggr;
  });
  return aggr;
};

export const setTabPanel = (
  value: number,
  index: number,
  setIsHidden: Dispatch<SetStateAction<boolean>>,
  setIsHidden2: Dispatch<SetStateAction<boolean>>,
  isTabPanelLoaded: boolean,
  setIsTabPanelLoaded: Dispatch<SetStateAction<boolean>>
) => {
  if (value === index) {
    setIsHidden(false);
    const to = setTimeout(() => {
      if (!isTabPanelLoaded) {
        setIsTabPanelLoaded(true);
      }
      setIsHidden2(false);
      clearTimeout(to);
    }, 600);
  } else {
    setIsHidden(true);
    setIsHidden2(true);
  }
};

export const getTile = (workspaces: Workspace[], tabId: string) => {
  const { store } = getHooksBase();
  const index = workspaces.findIndex((workspace) => workspace.id === tabId);
  if (index < 0) return undefined;
  const workspace = workspaces[index];
  return findTile(store.drawers, workspace);
};
