import React from "react";

import { ProviderPropsDefault, RootModel } from "../model/root";
import { IAction } from "../reducer/util/ActionType";
export declare const emptyFunction: () => void;
export declare const AppContext: React.Context<
  [RootModel, React.Dispatch<IAction>]
>;
export declare const useContext: () => [RootModel, React.Dispatch<IAction>];
declare const Provider: React.FC<ProviderPropsDefault>;
export default Provider;
