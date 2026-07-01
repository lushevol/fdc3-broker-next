import { ButtonProps } from "antd";
import { StaticRuleRow } from "src/Cashflow_Splitting_Static/services/api.type";
import { getUserRole } from "src/Cashflow_Splitting_Static/state/permission";
import { StateMap } from "src/Cashflow_Splitting_Static/state/statemachine";
import { getUser } from "src/Root/import/ratanutils";

import { ActionType, RoleType } from "../../state/types";

export type ActionButtonProps = {
  action: ActionType;
  disabled: boolean;
};

export const getActionButtonProps = (
  action: ActionType
): Pick<ButtonProps, "danger" | "type"> => {
  return {
    type: /^Approve.+$|^Update$|^Create$/.test(action) ? "primary" : undefined,
    danger: /^Reject.+$|^Delete.+$/.test(action),
  };
};

export const getRightMenuActionsFromRules = (
  rules: StaticRuleRow[]
): (ActionButtonProps & {
  rows: StaticRuleRow[];
})[] => {
  const { id: userId } = getUser();
  const userRole = getUserRole();
  const actions = rules.map((r) => ({
    actionProps: generateActionsList(r, userId, userRole),
    row: r,
  }));
  const uniqueActions: (ActionButtonProps & { rows: StaticRuleRow[] })[] = [];
  actions.forEach(({ actionProps, row }) => {
    actionProps.forEach(({ action, disabled }) => {
      const targetAction = uniqueActions.find((i) => i.action === action);
      if (targetAction) {
        targetAction.disabled ||= disabled;
        targetAction.rows.push(row);
      } else {
        uniqueActions.push({
          action,
          disabled,
          rows: [row],
        });
      }
    });
  });
  // update can only update single row
  return uniqueActions.filter(
    (a) => !(a.action === ActionType.Update && a.rows.length > 1)
  );
};

export const getDetailsActionsRule = (
  rule: StaticRuleRow
): (ActionButtonProps & Pick<ButtonProps, "danger" | "type">)[] => {
  const { id: userId } = getUser();
  const userRole = getUserRole();
  const actions = generateActionsList(rule, userId, userRole);
  return actions.map((a) => ({ ...a, ...getActionButtonProps(a.action) }));
};

export const generateActionsList = (
  rule: StaticRuleRow,
  userId: string,
  userRole: RoleType
): ActionButtonProps[] => {
  if (rule && !rule.dataStatus) return [];
  const { dataStatus, makerId } = rule ?? {
    status: "NONE",
    makerId: "",
  };
  const context = { userId, userRole, makerId: makerId ?? "" };
  return Object.entries(StateMap[dataStatus]?.on ?? {})
    .map(([action, { guard }]) => {
      return {
        action: action as ActionType,
        disabled: !guard({ context }),
      };
    })
    .sort((a, b) => {
      if (a?.action && b?.action) {
        return a.action.localeCompare(b.action);
      }
      return 0;
    });
};
