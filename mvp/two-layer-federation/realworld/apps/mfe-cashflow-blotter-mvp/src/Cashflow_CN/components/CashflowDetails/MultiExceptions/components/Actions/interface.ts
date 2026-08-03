import { ExceptionItem, UserType } from "../../common/interface";

export interface ExceptionActionsProps {
  userRole: UserType;
  isSubmitByYou: boolean;
  onSubmit: (t: boolean, payload?: any) => Promise<boolean>;
  disableAllActions: boolean;
  exceptionsWithRejectAction: ExceptionItem[];
  hasHighRiskExceptionsButNoPermission: boolean;
  hasAuthLimitNotSufficient: boolean;
}
