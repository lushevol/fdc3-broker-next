import * as types from "../actionTypes";
import { RootState } from "../interface";
import preloadState from "../state";

export const bulkFixExceptions = (
  state: RootState["bulkFixExceptions"] = preloadState.bulkFixExceptions,
  action: ActionType
) => {
  if (action.type === types.OPEN_BULK_FIX_EXCEPTION_DIALOG) {
    return action.data;
  } else if (action.type === types.CLOSE_BULK_FIX_EXCEPTION_DIALOG) {
    return action.data;
  } else {
    return state;
  }
};
