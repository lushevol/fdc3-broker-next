import { getHooks } from "..";
import { RootModel } from "../model/root";
import { IAction } from "./actions/ActionType";
import apiStatusReducer from "./apiStatus.reducer";
import versionStateReducer from "./versionState.reducer";
import refreshStateReducer from "./refreshState.reducer";

export const reducers = (state: RootModel, action: IAction): RootModel => {
  Object.freeze(state);
  const hooks = getHooks();
  let store: RootModel = { ...hooks.store, ...state };
  store = apiStatusReducer(store, action);
  store = versionStateReducer(store, action);
  store = refreshStateReducer(store, action);
  hooks.setStore({ ...hooks.store, ...store });
  return store;
};
