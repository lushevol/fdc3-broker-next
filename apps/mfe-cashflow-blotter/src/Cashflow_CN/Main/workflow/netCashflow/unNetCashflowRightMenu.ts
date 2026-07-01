import { MenuItemDef } from "ag-grid-community";
import { hasPermission } from "Import/ratanutils";

import { isNettedCashflow } from "../../../components/CashflowDetails/detailsBody";
import { WorkflowActionExtraOptions } from "../../common/interface";
import { unNetCashflowAction } from "../../store/actions";
import { SplitCashflowState } from "../splitting/common/interface";

const unNetCashflow = (
  data: any,
  isVerify: boolean,
  options: WorkflowActionExtraOptions
) => {
  const { dispatch } = options;
  dispatch(
    unNetCashflowAction({ isOpenComponentCashflow: true, isVerify, data })
  );
};

export const canShowUnNetCashflowRightMenu = (data: any) => {
  return (
    isNettedCashflow(data) &&
    data.Cashflow?.Cashflow_State !== SplitCashflowState.SPLIT &&
    hasPermission("RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Perform_Un_Net_Initiate")
  );
};
export const unNetCashflowRightMenu = (
  param: any,
  options: WorkflowActionExtraOptions
): MenuItemDef<CNCashflow> | null => {
  const data = param?.node?.data;
  if (canShowUnNetCashflowRightMenu(data)) {
    return {
      name: "Un-Net Cashflow",
      action: () => {
        unNetCashflow(param.node.data, false, options);
      },
    };
  }
  return null;
};
