import { RootModel } from "../../model/root";

export interface IAction {
  type: ActionType;
  data: RootModel;
}

export enum ActionType {
  SET_API_STATUS = "SET_API_STATUS_DATA",
  SET_API_STATUS_LIST = "SET_API_STATUS_LIST",
  SET_VERSION_STATE = "SET_VERSION_STATE",
  SET_REFRESH_STATE = "SET_REFRESH_STATE",
}
