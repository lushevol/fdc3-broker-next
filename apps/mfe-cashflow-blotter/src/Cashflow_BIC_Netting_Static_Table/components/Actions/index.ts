import { GetContextMenuItemsParams, MenuItemDef } from "ag-grid-community";
import { HookAPI } from "antd/es/modal/useModal";
import {
  BicNettingRuleRow,
  RuleMutationResponse,
} from "src/Cashflow_BIC_Netting_Static_Table/services/api.type";
import { actionConfirmation } from "src/Cashflow_BIC_Netting_Static_Table/utils";

import { ActionType } from "../../state/types";
import { getRightMenuActionsFromRules } from "./utils";

export const actionRightMenu = (
  param: GetContextMenuItemsParams,
  onClick: (
    action: ActionType,
    rows: BicNettingRuleRow[]
  ) => Promise<RuleMutationResponse[] | undefined>,
  modal: HookAPI
): MenuItemDef[] => {
  const hoverRow: BicNettingRuleRow = param.node?.data;
  let selectedRows = (param.api?.getSelectedRows() ??
    []) as BicNettingRuleRow[];

  if (selectedRows.length === 0) selectedRows = [hoverRow];
  if (
    !selectedRows.every((row) => row.dataStatus === selectedRows[0].dataStatus)
  )
    return [];

  const actions = getRightMenuActionsFromRules(selectedRows);

  return actions.map((a) => ({
    name: a.action,
    disabled: a.disabled,
    action() {
      (async () => {
        let confirmed = true;
        if (a.action !== ActionType.Update)
          confirmed = await actionConfirmation(modal, a.action);
        if (confirmed) onClick(a.action, a.rows);
      })();
    },
  }));
};
