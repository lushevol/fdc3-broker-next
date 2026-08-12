import { GetContextMenuItemsParams, MenuItemDef } from "ag-grid-community";
import { HookAPI } from "antd/es/modal/useModal";
import {
  RuleMutationResponse,
  StaticRuleRow,
} from "src/Cashflow_Splitting_Static/services/api.type";
import { actionConfirmation } from "src/Cashflow_Splitting_Static/utils";

import { ActionType } from "../../state/types";
import { getRightMenuActionsFromRules } from "./utils";

export const actionRightMenu = (
  param: GetContextMenuItemsParams,
  onClick: (
    action: ActionType,
    rows: StaticRuleRow[]
  ) => Promise<RuleMutationResponse[] | undefined>,
  modal: HookAPI
): MenuItemDef[] => {
  const hoverRow: StaticRuleRow = param.node?.data;
  let selectedRows = (param.api?.getSelectedRows() ?? []) as StaticRuleRow[];

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
