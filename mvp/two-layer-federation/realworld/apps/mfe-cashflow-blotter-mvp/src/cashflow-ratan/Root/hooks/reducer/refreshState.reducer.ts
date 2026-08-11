import { RootModel } from "../model/root";
import { ActionType, IAction } from "./actions/ActionType";

const refreshState = (store: RootModel, action: IAction): RootModel => {
  if (action.type === ActionType.SET_REFRESH_STATE) {
    store.refreshState = action.data.refreshState;
  }
  return store;
};
export default refreshState;
