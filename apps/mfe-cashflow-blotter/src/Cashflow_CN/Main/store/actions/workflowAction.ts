import { Dispatch } from "@reduxjs/toolkit";
import { GridReadyEvent } from "ag-grid-community";

import * as types from "../actionTypes";
import { RootState } from "../interface";

export const netCashflowAction = (data: RootState["netWorkflow"]) => {
  return {
    type: types.NET_WORKFLOW,
    data,
  };
};

export const splitingCashflowAction = (
  data: RootState["splittingWorkflow"]
) => {
  return {
    type: types.SPLITTING_WORKFLOW,
    data,
  };
};

export const updateSplitCashflowWorkflowStatus = (
  data: RootState["splittingWorkflow"]
) => {
  return {
    type: types.SPLITTING_CASHFLOW_FINISHED,
    data,
  };
};

export const splittingValidateCashflowAction = (
  data: RootState["splittingValidation"]
) => {
  return {
    type: types.SPLITTING_VALIDATION,
    data,
  };
};

export const updateNetCashflowDataGridDefs = (data: {
  previewGridReadyEvent?: GridReadyEvent;
  sourceGridReadyEvent?: GridReadyEvent;
}) => {
  return {
    type: types.UPDATE_NET_DATAGRID_DEF,
    data,
  };
};

export const updateNetCashflowWorkflowStatus = (data: any) => {
  return {
    type: types.NET_CASHFLOW_FINISHED,
    data,
  };
};

export const unNetCashflowAction = (data: any) => {
  return {
    type: types.UN_NET_WORKFLOW,
    data,
  };
};

export const viewCashflowDetailsAction = (data: any) => {
  return {
    type: types.VIEW_CASHFLOW_DETAILS,
    data,
  };
};

export const viewTradeDetailsAction = (data: any) => {
  return {
    type: types.VIEW_TRADE_DETAILS,
    data,
  };
};

export const openSettlementMethodUpdateDialogAction = (
  data: RootState["settlementMethodUpdateWorkflow"]
) => {
  return {
    type: types.OPEN_SETTLEMENT_METHOD_UPDATE_DIALOG,
    data,
  };
};

export const openWithCurrentStateSettlementMethodUpdateDialogAction = () => {
  return (dispatch: Dispatch, getState: () => RootState) => {
    const { settlementMethodUpdateWorkflow } = getState();
    const data: RootState["settlementMethodUpdateWorkflow"] = {
      ...settlementMethodUpdateWorkflow,
      isOpenDialog: true,
    };
    dispatch({
      type: types.CLOSE_SETTLEMENT_METHOD_UPDATE_DIALOG,
      data,
    });
  };
};

export const closeSettlementMethodUpdateDialogAction = () => {
  return (dispatch: Dispatch, getState: () => RootState) => {
    const { settlementMethodUpdateWorkflow } = getState();
    const data: RootState["settlementMethodUpdateWorkflow"] = {
      ...settlementMethodUpdateWorkflow,
      isOpenDialog: false,
    };
    dispatch({
      type: types.CLOSE_SETTLEMENT_METHOD_UPDATE_DIALOG,
      data,
    });
  };
};
