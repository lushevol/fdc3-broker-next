import { GetContextMenuItemsParams, MenuItemDef } from "ag-grid-community";
import { hasPermission } from "Import/ratanutils";

import { WorkflowActionExtraOptions } from "../../common/interface";
import { splitingCashflowAction } from "../../store/actions";
import { SplitActionType, SplitCashflowState } from "./common/interface";

export const hasSplittingPermission = () =>
  hasPermission(
    "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Perform_Ad_Hoc_Netting"
  ) as boolean;

export const hasUnSplittingPermission = () =>
  hasPermission(
    "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Perform_Un_Net_Initiate"
  ) as boolean;

export const isAvaliableSplitting = [
  SplitCashflowState.WAITING,
  SplitCashflowState.READY,
];
export const canAmendSplittingState = [SplitCashflowState.WAITING];

export const canBeSplitting = (cashflow: CNCashflow) => {
  return (
    hasSplittingPermission() &&
    isAvaliableSplitting.includes(
      cashflow.Cashflow?.Cashflow_State as SplitCashflowState
    ) &&
    cashflow.Cashflow?.Cashflow_Event_Type === "New" &&
    (cashflow.Trade_Original_Source_System_Name?.toUpperCase() ?? "") !==
      "LOANIQ" &&
    !cashflow.Cashflow?.Splitting_Id &&
    !cashflow.Cashflow?.Netting_Id
  );
};

export const blackListUnSplittingSatte = [
  SplitCashflowState.RELEASED,
  SplitCashflowState.SETTLED,
];

export const canBeUnSplitting = (cashflow: CNCashflow) => {
  return !!(
    hasUnSplittingPermission() &&
    cashflow.Cashflow?.Splitting_Id &&
    !blackListUnSplittingSatte.includes(
      cashflow.Cashflow?.Cashflow_State as SplitCashflowState
    ) &&
    cashflow.Cashflow?.Cashflow_Event_Type === "New"
  );
};

export const canBeAmendSplitting = (cashflow: CNCashflow) => {
  return !!(
    hasSplittingPermission() &&
    canAmendSplittingState.includes(
      cashflow.Cashflow?.Cashflow_State as SplitCashflowState
    ) &&
    cashflow.Cashflow?.Splitting_Id &&
    cashflow.Cashflow?.Cashflow_Event_Type === "New"
  );
};

export const isSplitStartCashflow = (data: CNCashflow) => {
  return data.Cashflow?.Cashflow_Id?.startsWith("S");
};

export const splittingCashflow = async (
  data: CNCashflow,
  options: WorkflowActionExtraOptions,
  splitAction: SplitActionType
) => {
  const { dispatch } = options;
  dispatch(
    splitingCashflowAction({
      splitStatus: "INIT",
      isOpenSplittingDialog: true,
      isOpenLookUpSSIDialog: false,
      targetRowIndex: null,
      sourceCashflow: data,
      targetCashflows: null,
      initialTargetCashflows: null,
      amountSetting: null,
      splitAction,
    })
  );
};

export const splittingCashflowRightMenu = (
  param: GetContextMenuItemsParams,
  options: WorkflowActionExtraOptions
): MenuItemDef<CNCashflow>[] | [] => {
  if (!param) return [];
  let selectedRows: CNCashflow[] = param.api?.getSelectedRows() ?? [];
  const data = param.node?.data as CNCashflow;
  if (selectedRows.length === 0) selectedRows = [data];

  if (selectedRows.length === 1) {
    const menu: any[] = [];
    if (canBeSplitting(selectedRows[0])) {
      menu.push({
        name: "Split Cashflow",
        action: () => {
          splittingCashflow(
            selectedRows[0],
            options,
            SplitActionType.MANUAL_SPLIT
          );
        },
      });
    }
    if (canBeAmendSplitting(selectedRows[0])) {
      menu.push({
        name: "Amend Split Amount",
        action: () => {
          splittingCashflow(
            selectedRows[0],
            options,
            SplitActionType.AMEND_SPLIT
          );
        },
      });
    }
    if (canBeUnSplitting(selectedRows[0])) {
      menu.push({
        name: "Un-Split Cashflow",
        action: () => {
          splittingCashflow(selectedRows[0], options, SplitActionType.UN_SPLIT);
        },
      });
    }
    return menu;
  }
  return [];
};
