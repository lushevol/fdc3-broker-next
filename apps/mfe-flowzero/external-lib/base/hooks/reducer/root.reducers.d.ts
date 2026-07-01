import { RootModel } from "../model/root";
import { IAction } from "./util/ActionType";
declare const root: (store: RootModel, action: IAction) => RootModel;
export default root;
