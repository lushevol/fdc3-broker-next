import { initialData, RootModel } from "./model/root";

export interface Hooks {
  store: RootModel;
  setStore: (store: RootModel) => void;
}

export const hooks: Hooks = {
  store: initialData,
  setStore(store: RootModel) {
    this.store = store;
  },
};
export const getHooks = () => hooks;
