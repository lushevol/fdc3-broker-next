import React from "react";
import {
  Tile,
  RatanFilterItem,
  Tiles,
} from "../../components/Drawer/common/interface";
import { storeData, uuidv4 } from "../../utils/common";
import { Container, Workspace } from "../model/workspaces";
import { useContext } from "../provider";
import { ActionType } from "../reducer/util/ActionType";
import { Entity } from "../model/root";

const useDispatcher = () => {
  const [store, dispacth] = useContext();

  const dispacthEntities = (entities: Entity[]) => {
    dispacth({
      type: ActionType.SET_ENTITIES,
      data: { entities },
    });
  };
  const dispacthLoading = (isLoading: boolean) => {
    dispacth({
      type: ActionType.SET_IS_LOADING,
      data: { isLoading },
    });
  };
  const dispacthTheme = (theme) => {
    dispacth({
      type: ActionType.SET_THEME,
      data: { theme },
    });
    storeData(ActionType.SET_THEME, theme);
  };

  const dispacthToken = (token) => {
    dispacth({
      type: ActionType.SET_TOKEN,
      data: { token },
    });
  };

  const dispacthUser = (user) => {
    dispacth({
      type: ActionType.SET_USER,
      data: { user },
    });
  };

  const dispacthClientBus = (clientBus) => {
    dispacth({
      type: ActionType.SET_CLIENT_BUS,
      data: { clientBus },
    });
  };

  const dispacthIsOpenFin = (isOpenFin) => {
    dispacth({
      type: ActionType.SET_IS_OPENFIN,
      data: { isOpenFin },
    });
  };

  const dispacthErrorMessage = (errorMsg) => {
    dispacth({
      type: ActionType.SET_ERRORMSG,
      data: { errorMsg },
    });
  };

  const dispacthWorkspaces = (workspaces) => {
    dispacth({
      type: ActionType.SET_WORKSPACES,
      data: { workspaces },
    });
  };
  const dispacthCurrentWorkspace = (currentWorkspace) => {
    dispacth({
      type: ActionType.SET_CURRENT_WORKSPACES,
      data: { currentWorkspace },
    });
  };
  const dispacthError = (errorMsg: string) => {
    dispacth({ type: ActionType.SET_ERRORMSG, data: { errorMsg } });
  };
  const dispacthDrawer = (drawer: boolean) => {
    dispacth({ type: ActionType.SET_DRAWER, data: { drawer } });
  };
  const getNextNum = () => {
    if (store?.workspaces) {
      const last = store?.workspaces[store?.workspaces?.length - 1];
      const label = last.label.replace("Workspace", "");
      if (!isNaN(parseInt(label))) {
        return parseInt(label) + 1;
      }
    }
    return (store?.workspaces?.length ?? 0) + 1;
  };
  const addWorkspace = (container?: Container) => {
    const workspace: Workspace = {
      id: uuidv4(),
      label: container ? container.title : `Workspace ${getNextNum()}`,
      isActive: false,
      containers: container ? [container] : [],
    };
    dispacth({ type: ActionType.ADD_WORKSPACE, data: { workspace } });
  };
  const dispacthUserLoginTime = (payload) => {
    dispacth({
      type: ActionType.SET_EXPIRED_TOKEN,
      data: {
        expiredIn: payload.exp,
        iat: payload.iat,
        userLoginTime: new Date(),
      },
    });
  };
  const OpenCashflow = (drawers, querys: string | RatanFilterItem[], type) => {
    const index = drawers?.findIndex((drawer) => drawer.label === "Settlement");
    if (index >= 0) {
      const tile = drawers[index].tiles.filter((item: Tile) => {
        return item.tile === type;
      });
      let props = {};
      switch (typeof querys) {
        case "string":
          props = {
            cashflowId: querys,
          };
          break;
        case "object":
          if (Array.isArray(querys)) {
            props = {
              filters: querys,
            };
          }
          break;
        default:
          break;
      }
      const container: any = {
        ...tile[0],
        id: uuidv4(),
        parameters: props,
      };
      if (container.subtitle && container.subtitle != "") {
        container.title = `${container.title} ${container.subtitle}`;
      }
      addWorkspace(container);
    }
  };
  const dispatchOpenTile = (parameters: unknown, tile: string) => {
    const drawers = [...(store.drawers as Tiles[])];
    const tiles = drawers
      .map((category) => {
        const ts = category.tiles.filter((item: Tile) => {
          return item.tile === `/${tile}`;
        });
        return ts;
      })
      .filter((ts) => ts.length > 0)
      .flatMap((ts) => ts);
    if (tiles.length === 0) {
      dispacthError(`Tile ${tile} is unauthorized or does not exist`);
      return;
    }
    const container: any = {
      ...tiles[0],
      id: uuidv4(),
      parameters,
    };
    if (container.subtitle && container.subtitle != "") {
      container.title = `${container.title} ${container.subtitle}`;
    }
    addWorkspace(container);
  };
  /**
   * Check if a tile is accessible
   * @param tile The tile name to check
   * @returns boolean indicating whether the tile is accessible
   */
  const checkTileAccessible = (tile: string) => {
    const drawers = [...(store.drawers as Tiles[])];
    const tiles = drawers
      .map((category) => {
        const ts = category.tiles.filter((item: Tile) => {
          return item.tile === `/${tile}`;
        });
        return ts;
      })
      .filter((ts) => ts.length > 0)
      .flatMap((ts) => ts);
    return tiles.length !== 0;
  };
  const checkCDUPSOutboundBlotterAccessible = () => {
    return checkTileAccessible("confirmations-outbound");
  };
  const checkRatanTradeBlotterAccessible = () => {
    return checkTileAccessible("trade");
  };
  const dispatchOpenCDUPSOutboundBlotter = (
    parameters: Record<string, string | number | boolean>
  ) => {
    return dispatchOpenTile(parameters, "confirmations-outbound");
  };
  const dispatchOpenTradeBlotter = (
    parameters: Record<string, string | number | boolean>
  ) => {
    return dispatchOpenTile(parameters, "trade");
  };
  const dispacthOpenCashflow = (querys: string | RatanFilterItem[], type) => {
    const drawers = [...(store.drawers as Tile[])];
    OpenCashflow(drawers, querys, type);
  };
  const dispacthTimeType = (timeType) => {
    dispacth({
      type: ActionType.SET_TIME_TYPE,
      data: { timeType },
    });
    storeData(ActionType.SET_TIME_TYPE, timeType);
  };

  const registerRefreshTab = (tabId: string, refreshTab: () => void) => {
    dispacth({
      type: ActionType.SET_REFRESH_TAB,
      data: { refreshTab: { [tabId]: refreshTab } },
    });
  };

  const dispacthEntitlementsToken = (entitlementsToken: string) => {
    dispacth({
      type: ActionType.SET_ENTITLEMENTS_TOKEN,
      data: { entitlementsToken },
    });
  };
  const dispacthIsOnLogout = (isOnLogout: boolean) => {
    dispacth({
      type: ActionType.SET_IS_ON_LOGOUT,
      data: { isOnLogout },
    });
  };

  const dispacthDrawers = (drawers) => {
    dispacth({
      type: ActionType.SET_DRAWERS,
      data: { drawers },
    });
  };
  const subscribe = (_tabId: string, _callback: () => void) => {
    console.info("subscribe", _tabId, _callback);
  };
  const dispacthSsePayload = (_payload) => {
    console.info("dispacthSsePayload", _payload);
  };
  return {
    dispacthLoading,
    dispacthTheme,
    dispacthToken,
    dispacthUser,
    dispacthClientBus,
    dispacthErrorMessage,
    dispacthWorkspaces,
    dispacthCurrentWorkspace,
    dispacthError,
    dispacthDrawer,
    addWorkspace,
    dispacthUserLoginTime,
    dispacthOpenCashflow,
    OpenCashflow,
    dispacthIsOpenFin,
    dispacthTimeType,
    dispacthEntities,
    dispacth,
    registerRefreshTab,
    dispacthEntitlementsToken,
    dispacthIsOnLogout,
    dispacthDrawers,
    subscribe,
    dispacthSsePayload,
    dispatchOpenCDUPSOutboundBlotter,
    dispatchOpenTradeBlotter,
    checkCDUPSOutboundBlotterAccessible,
    checkRatanTradeBlotterAccessible,
    dispatchOpenTile,
  };
};

export default useDispatcher;
