import {
  CashflowSubState_ExceptionStatus,
  CashflowSubStateType,
} from "../common/interface";

export const filterExceptionsByCurrentCashflowSubState = (
  exceptions: RatanException[],
  cashflowSubState: CashflowSubStateType
) => {
  return exceptions.filter(
    (exp) => exp.Status === CashflowSubState_ExceptionStatus[cashflowSubState]
  );
};
