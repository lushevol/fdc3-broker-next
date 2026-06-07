import { GetContextMenuItemsParams, MenuItemDef } from "ag-grid-community";
import { WorkflowActionExtraOptions } from "src/Cashflow_CN/Main/common/interface";
import { openBulkFixExceptionDialog } from "src/Cashflow_CN/Main/store/actions";

import { getUserProfile } from "../../CashflowDetails/MultiExceptions/common/utils";
import { BulkUserType } from "../type";
import { cashflowStageFilter, cashflowStateFilter } from "./filter";

export const bulkRightmenuAction = (
  cashflows: CNCashflow[],
  callback: (userType: BulkUserType) => void
): MenuItemDef<CNCashflow> | null => {
  if (cashflows.length <= 1) return null;
  if (!cashflows.every((c) => cashflowStateFilter(c))) return null;
  if (
    !cashflows.every(
      (c) =>
        c.Cashflow?.Cashflow_Sub_State ===
        cashflows[0].Cashflow?.Cashflow_Sub_State
    )
  ) {
    return null;
  }
  const userType = getUserType(cashflows[0]);
  const name = getBulkActionName(userType);
  return {
    name,
    disabled: !userType,
    action() {
      callback(userType as BulkUserType);
    },
  };
};

export const bulkRightmenuConsistencyValidation = (
  cashflows: CNCashflow[]
): {
  valid: boolean;
  message: string;
} => {
  if (
    !cashflows.every(
      (c) =>
        c.Entity?.Counterparty_SCI_FMCODE ===
        cashflows[0].Entity?.Counterparty_SCI_FMCODE
    )
  ) {
    return {
      valid: false,
      message: "Counterparty of selected cashflows are not the same",
    };
  } else if (
    !cashflows.every(
      (c) =>
        c.Entity?.Booking_Entity_SCI_FMCODE ===
        cashflows[0].Entity?.Booking_Entity_SCI_FMCODE
    )
  ) {
    return {
      valid: false,
      message: "Entity of selected cashflows are not the same",
    };
  } else if (
    !cashflows.every(
      (c) => c.Cashflow?.Payment_Date === cashflows[0].Cashflow?.Payment_Date
    )
  ) {
    return {
      valid: false,
      message: "Value Date of selected cashflows are not the same",
    };
  }
  return {
    valid: true,
    message: "",
  };
};

export const getBulkActionName = (userType: BulkUserType | "") => {
  switch (userType) {
    case BulkUserType.Checker:
      return "Bulk Approve";
    case BulkUserType.Maker:
      return "Bulk Submit";
    default:
      return "Bulk Submit/Approve";
  }
};

export const getUserType = (cashflow: CNCashflow) => {
  const userProfile = getUserProfile();
  return cashflowStageFilter(cashflow, userProfile);
};

export const bulkRightMenu = (
  param: GetContextMenuItemsParams<CNCashflow>,
  options: WorkflowActionExtraOptions
): MenuItemDef<CNCashflow> | null => {
  const { messageApi, dispatch } = options;
  const selectedData: CNCashflow[] = param.api?.getSelectedRows() ?? [];
  const { valid, message } = bulkRightmenuConsistencyValidation(selectedData);
  return bulkRightmenuAction(selectedData, (userType) => {
    if (!valid && message) {
      messageApi.error(message);
      return;
    }
    dispatch(openBulkFixExceptionDialog(selectedData, userType));
  });
};
