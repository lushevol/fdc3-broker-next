import * as types from "../actionTypes";

export const handleCashflowSearchBar = (
  state: boolean = true,
  action: ActionType
) => {
  if (action.type === types.SHOW_HIDE_CASHFLOW_SEARCH_BAR) {
    return action.data;
  } else {
    return state;
  }
};
