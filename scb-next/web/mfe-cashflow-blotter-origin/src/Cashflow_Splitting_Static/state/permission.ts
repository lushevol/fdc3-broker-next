import { hasPermission } from "src/Root/import/ratanutils";

import { RoleType } from "./types";

/**
 * keep splitting static rule same permission as netting rule blotter
 */
export const getUserRole = (): RoleType => {
  return checkUserRole(
    hasPermission(INITIATE_ENTITLEMENT_CODE),
    hasPermission(VERIRY_ENTITLEMENT_CODE)
  );
};

export const checkUserRole = (
  hasMakePermission: boolean,
  hasCheckPermission: boolean
): RoleType => {
  if (hasMakePermission) {
    if (hasCheckPermission) {
      return "Maker_Checker";
    } else return "Maker";
  } else if (hasCheckPermission) return "Checker";
  return "Visitor";
};

export const INITIATE_ENTITLEMENT_CODE =
  "RATAN_NETTING_RULE:F_Input_Delete_Modify_Initiate";

export const VERIRY_ENTITLEMENT_CODE =
  "RATAN_NETTING_RULE:F_Input_Delete_Modify_Verify";
