import { Dispatch } from "@reduxjs/toolkit";

import * as types from "../actionTypes";
import { RootState } from "../interface";

export const openBulkFixExceptionDialog = (
  cashflows: CNCashflow[],
  userType: "Maker" | "Checker"
) => {
  return {
    type: types.OPEN_BULK_FIX_EXCEPTION_DIALOG,
    data: {
      isOpenDialog: true,
      cashflowsReadyToFix: cashflows,
      userType,
    } as RootState["bulkFixExceptions"],
  };
};

export const openWithCurrentStateBulkFixExceptionDialog = () => {
  return (dispatch: Dispatch, getState: () => RootState) => {
    const { bulkFixExceptions } = getState();

    dispatch({
      type: types.CLOSE_BULK_FIX_EXCEPTION_DIALOG,
      data: {
        ...bulkFixExceptions,
        isOpenDialog: true,
      } as RootState["bulkFixExceptions"],
    });
  };
};

export const closeBulkFixExceptionDialog = () => {
  return (dispatch: Dispatch, getState: () => RootState) => {
    const { bulkFixExceptions } = getState();

    dispatch({
      type: types.CLOSE_BULK_FIX_EXCEPTION_DIALOG,
      data: {
        ...bulkFixExceptions,
        isOpenDialog: false,
      } as RootState["bulkFixExceptions"],
    });
  };
};
