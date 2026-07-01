import { RootModel } from "./model/root";
export interface Hooks {
  store: RootModel;
  setStore: (store: RootModel) => void;
}
export declare const hooks: Hooks;
export declare const getHooks: () => Hooks;
