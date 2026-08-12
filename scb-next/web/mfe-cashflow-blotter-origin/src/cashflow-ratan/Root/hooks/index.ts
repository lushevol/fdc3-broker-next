import React from "react";
import { RootModel, initialData } from "./model/root";
import { IAction } from "./reducer/actions/ActionType";

export interface Hooks {
  store: RootModel;
  setStore: (store: RootModel) => void;
  ratanDispatch: React.Dispatch<IAction>;
  setRatanDispatch: (dispacth: React.Dispatch<IAction>) => void;
}

export const hooks: Hooks = {
  store: initialData,
  setStore(store: RootModel) {
    this.store = store;
  },
  ratanDispatch: () => {
    console.info("ratanDispatch");
  },
  setRatanDispatch(dispatch: React.Dispatch<IAction>) {
    this.ratanDispatch = dispatch;
  },
};
export const getHooks = () => hooks;
