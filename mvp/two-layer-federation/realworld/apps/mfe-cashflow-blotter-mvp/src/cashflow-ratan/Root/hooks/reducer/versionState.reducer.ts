import { RootModel } from "../model/root";
import { ActionType, IAction } from "./actions/ActionType";

const versionState = (store: RootModel, action: IAction): RootModel => {
  if (action.type === ActionType.SET_VERSION_STATE) {
    store.versionState = action.data.versionState;
  }
  return store;
};

export default versionState;
