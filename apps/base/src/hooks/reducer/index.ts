import { getHooks } from '..';
import { getHooksBase } from '../HooksBase';
import type { RootModel } from '../model/root';
import rootReducer from './root.reducers';
import rootReducer0 from './root0.reducers';
import type { IAction } from './util/ActionType';
import workspacesReducer from './workspaces.reducers';

export const reducers = (state: RootModel, action: IAction): RootModel => {
  Object.freeze(state);
  let store: RootModel = { ...state };
  store = rootReducer0(store, action);
  store = rootReducer(store, action);
  store = workspacesReducer(store, action);
  const hooksBase = getHooksBase();
  hooksBase.setStore({ ...store });
  const hooks = getHooks();
  hooks.setStore({ ...hooks.store, ...store });
  return store;
};
