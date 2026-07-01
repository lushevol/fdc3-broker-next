import { RootModel } from "../model/root";
import { IAction } from "./util/ActionType";
declare const workspaces: (store: RootModel, action: IAction) => RootModel;
export default workspaces;
