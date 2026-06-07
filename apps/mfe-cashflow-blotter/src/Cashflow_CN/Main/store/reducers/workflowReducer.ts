import {
  RoundingType,
  SplitActionType,
} from "../../workflow/splitting/common/interface";
import * as types from "../actionTypes";
import { RootState } from "../interface";

export const netWorkflow = (state: any = {}, action: ActionType) => {
  switch (action.type) {
    case types.UPDATE_NET_DATAGRID_DEF:
      return { ...state, ...action.data };
    case types.NET_CASHFLOW_FINISHED:
      return { ...state, ...action.data };
    case types.NET_WORKFLOW:
      return { ...state, ...action.data };
    default:
      return state;
  }
};

export const unNetWorkflow = (state: any = {}, action: ActionType) => {
  if (action.type === types.UN_NET_WORKFLOW) {
    return action.data;
  } else {
    return state;
  }
};

const initialSplittingWorkflow: RootState["splittingWorkflow"] = {
  splitStatus: "INIT",
  isOpenSplittingDialog: false,
  isOpenLookUpSSIDialog: false,
  targetRowIndex: null,
  isChildCashflowDialogVisible: false,
  sourceCashflow: {},
  targetCashflows: [],
  initialTargetCashflows: [],
  amountSetting: {
    precision: 2,
    type: RoundingType.ROUNDING_OFF,
  },
  splitAction: SplitActionType.COMPONENT_SPLIT,
};

export const splittingWorkflow = (
  state: RootState["splittingWorkflow"] = initialSplittingWorkflow,
  action: ActionType
) => {
  if (action.type === types.SPLITTING_WORKFLOW) {
    return action.data;
  } else {
    return state;
  }
};

const initialSplittingValidation: RootState["splittingValidation"] = {
  isValid: true,
  message: null,
  validationArr: [],
};

export const splittingValidation = (
  state: RootState["splittingValidation"] = initialSplittingValidation,
  action: ActionType
) => {
  if (action.type === types.SPLITTING_VALIDATION) {
    return action.data;
  } else {
    return state;
  }
};

export const viewCashflowDetailsWorkflow = (
  state: any = {},
  action: ActionType
) => {
  if (action.type === types.VIEW_CASHFLOW_DETAILS) {
    return { ...state, ...action.data };
  } else {
    return state;
  }
};

export const viewTradeDetailsWorkflow = (
  state: any = {},
  action: ActionType
) => {
  if (action.type === types.VIEW_TRADE_DETAILS) {
    return { ...state, ...action.data };
  } else {
    return state;
  }
};

const initialSettlementMethodUpdateWorkflow: RootState["settlementMethodUpdateWorkflow"] =
  {
    isOpenDialog: false,
    cashflowData: [],
    cashflowDataByTrade: [],
  };

export const settlementMethodUpdateWorkflow = (
  state: RootState["settlementMethodUpdateWorkflow"] = initialSettlementMethodUpdateWorkflow,
  action: ActionType
) => {
  if (action.type === types.OPEN_SETTLEMENT_METHOD_UPDATE_DIALOG) {
    return action.data;
  } else if (action.type === types.CLOSE_SETTLEMENT_METHOD_UPDATE_DIALOG) {
    return action.data;
  } else {
    return state;
  }
};
