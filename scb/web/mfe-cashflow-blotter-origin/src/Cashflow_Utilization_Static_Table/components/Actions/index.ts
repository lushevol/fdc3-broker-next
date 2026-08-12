import { GetContextMenuItemsParams, MenuItemDef } from "ag-grid-community";
import { HookAPI } from "antd/es/modal/useModal";

import {
  RuleMutationResponse,
  UtilizationRuleRow,
} from "../../services/api.type";
import { ActionType } from "../../state/types";
import { actionConfirmation } from "../../utils";
import { getRightMenuActionsFromRules } from "./utils";

export const actionRightMenu = (
  param: GetContextMenuItemsParams,
  onClick: (
    action: ActionType,
    rows: UtilizationRuleRow[]
  ) => Promise<RuleMutationResponse[] | undefined>,
  modal: HookAPI
): MenuItemDef[] => {
  const hoverRow: UtilizationRuleRow = param.node?.data;
  let selectedRows = (param.api?.getSelectedRows() ??
    []) as UtilizationRuleRow[];

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
      return (async () => {
        let confirmed = true;
        if (a.action !== ActionType.Update)
          confirmed = await actionConfirmation(modal, a.action);
        if (confirmed) onClick(a.action, a.rows);
      })();
    },
  }));
};
