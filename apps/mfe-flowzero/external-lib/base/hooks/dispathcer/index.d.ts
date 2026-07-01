import React from "react";

import { RatanFilterItem } from "../../components/Drawer/common/interface";
import { Entity } from "../model/root";
import { Container } from "../model/workspaces";
declare const useDispatcher: () => {
  dispacthLoading: (isLoading: boolean) => void;
  dispacthTheme: (theme: any) => void;
  dispacthToken: (token: any) => void;
  dispacthUser: (user: any) => void;
  dispacthClientBus: (clientBus: any) => void;
  dispacthErrorMessage: (errorMsg: any) => void;
  dispacthWorkspaces: (workspaces: any) => void;
  dispacthCurrentWorkspace: (currentWorkspace: any) => void;
  dispacthError: (errorMsg: string) => void;
  dispacthDrawer: (drawer: boolean) => void;
  addWorkspace: (container?: Container) => void;
  dispacthUserLoginTime: (payload: any) => void;
  dispacthOpenCashflow: (querys: string | RatanFilterItem[], type: any) => void;
  OpenCashflow: (
    drawers: any,
    querys: string | RatanFilterItem[],
    type: any
  ) => void;
  dispacthIsOpenFin: (isOpenFin: any) => void;
  dispacthTimeType: (timeType: any) => void;
  dispacthEntities: (entities: Entity[]) => void;
  dispacth: React.Dispatch<import("../reducer/util/ActionType").IAction>;
  registerRefreshTab: (tabId: string, refreshTab: () => void) => void;
  dispacthEntitlementsToken: (entitlementsToken: string) => void;
  dispacthIsOnLogout: (isOnLogout: boolean) => void;
  dispacthDrawers: (drawers: any) => void;
  subscribe: (_tabId: string, _callback: () => void) => void;
  dispacthSsePayload: (_payload: any) => void;
};
export default useDispatcher;
