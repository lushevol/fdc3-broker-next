import { RootModel } from "../model/root";
import { ActionType, IAction } from "./actions/ActionType";

const apiStatus = (store: RootModel, action: IAction): RootModel => {
  if (action.type === ActionType.SET_API_STATUS) {
    const status = { ...store.apiStatus, ...action.data.apiStatus };
    store.apiStatus = status;
  }
  if (action.type === ActionType.SET_API_STATUS_LIST) {
    const status = { ...store.apiStatus, ...action.data.apiStatus };
    store.apiStatus = status;
  }
  return store;
};

export default apiStatus;
