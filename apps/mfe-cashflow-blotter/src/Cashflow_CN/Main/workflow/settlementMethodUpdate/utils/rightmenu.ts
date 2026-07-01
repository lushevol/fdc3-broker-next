import { GetContextMenuItemsParams, MenuItemDef } from "ag-grid-community";
import { WorkflowActionExtraOptions } from "src/Cashflow_CN/Main/common/interface";

import { openSettlementMethodUpdateDialogAction } from "../../../store/actions";
import {
  canBeSettlementMethodUpdate,
  settlementMethodUpdateRightmenuConsistencyValidation,
} from "./filter";

export const settlementMethodUpdateAction = (
  cashflows: CNCashflow[],
  callback: () => void
): MenuItemDef<CNCashflow> | null => {
  if (cashflows.length === 0) return null;
  if (!cashflows.every((c) => canBeSettlementMethodUpdate(c))) return null;
  return {
    name: "Settlement Method Update",
    action() {
      callback();
    },
  };
};

export const settlementMethodUpdateRightMenu = (
  param: GetContextMenuItemsParams<CNCashflow>,
  options: WorkflowActionExtraOptions
): MenuItemDef<CNCashflow> | null => {
  const { messageApi, dispatch } = options;
  const hoverRow: CNCashflow = param.node?.data ?? {};
  let selectedData: CNCashflow[] = param.api?.getSelectedRows() ?? [];
  if (selectedData.length === 0) selectedData = [hoverRow];

  return settlementMethodUpdateAction(selectedData, () => {
    const { valid, message } =
      settlementMethodUpdateRightmenuConsistencyValidation(selectedData);
    if (!valid && message) {
      messageApi.error(message);
      return null;
    }
    dispatch(
      openSettlementMethodUpdateDialogAction({
        isOpenDialog: true,
        cashflowData: selectedData,
        cashflowDataByTrade: selectedData,
      })
    );
  });
};
