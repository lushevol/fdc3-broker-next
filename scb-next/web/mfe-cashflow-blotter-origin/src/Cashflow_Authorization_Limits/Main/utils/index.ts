import { getUser, hasPermission } from "src/Root/import/ratanutils";

import { LimitationRecord, UserRole } from "../common/interface";

export const hasViewPermission = () => {
  return hasPermission("RATAN_PROFILE_LIMITS:ACCESS_FMO_POST_TRADE_PORTAL");
};

export const getUserRole = (): UserRole => {
  if (hasPermission("RATAN_PROFILE_LIMITS:F_Input_Delete_Modify_Verify")) {
    return "Checker";
  } else if (
    hasPermission("RATAN_PROFILE_LIMITS:F_Input_Delete_Modify_Initiate")
  ) {
    return "Maker";
  } else return "Visitor";
};

export const parseIsUpdateByYou = (record: LimitationRecord): boolean => {
  const { id } = getUser();
  return record.updatedBy === id;
};

export const isSameLimitationRecord = (
  r1: LimitationRecord,
  r2: LimitationRecord
) => {
  return r1.profile === r2.profile && r1.currency === r2.currency;
};
