import { storeData } from '../../utils/common';
import type { RootModel, Tiles } from '../model/root';
import type { Workspace } from '../model/workspaces';
import { ActionType, type IAction } from './util/ActionType';

const workspaces = (store: RootModel, action: IAction): RootModel => {
  switch (action.type) {
    case ActionType.ADD_WORKSPACE:
      store.workspaces = [...(store?.workspaces ?? []), action.data.workspace as Workspace];
      store.currentWorkspace = action.data.workspace as Workspace;
      storeData(ActionType.SET_WORKSPACES, JSON.stringify(store.workspaces));
      break;
    case ActionType.SET_WORKSPACES:
      store.workspaces = action.data.workspaces;
      storeData(ActionType.SET_WORKSPACES, JSON.stringify(store.workspaces));
      break;
    case ActionType.SET_CURRENT_WORKSPACES:
      store.currentWorkspace = action.data.currentWorkspace;
      break;
    case ActionType.SET_REFRESH_TAB:
      store.refreshTab = { ...store.refreshTab, ...action.data.refreshTab };
      break;
    case ActionType.SET_DRAWERS:
      store.drawers = [...(action.data.drawers as Tiles[])];
      break;
    default:
      break;
  }
  return store;
};

export default workspaces;
