import * as types from "../actionTypes";

export const showOrHideCashflowSearchBar = (showOrHide: boolean) => {
  return {
    type: types.SHOW_HIDE_CASHFLOW_SEARCH_BAR,
    data: showOrHide,
  };
};
