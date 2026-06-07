/// <reference types="react" />
import { Hooks } from ".";
import { IAction } from "./reducer/util/ActionType";
export interface HooksBase extends Hooks {
  baseDispatch: React.Dispatch<IAction>;
  setBaseDispatch: (dispacth: React.Dispatch<IAction>) => void;
}
export declare const hooksBase: HooksBase;
export declare const getHooksBase: () => HooksBase;
