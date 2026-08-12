import { ExceptionBundleActionResult } from "src/Cashflow_CN/services/type";

import { CashflowDisplay } from "../type";

export const exceptionStatistic = (
  exceptions: RatanException[]
): Map<string, number> => {
  return exceptions.reduce<Map<string, number>>((res, cur) => {
    if (!res.has(cur.Exception_Code + "")) res.set(cur.Exception_Code + "", 0);
    res.set(cur.Exception_Code + "", res.get(cur.Exception_Code + "")! + 1);
    return res;
  }, new Map());
};

export const exceptionStatisticByDisplayCashflows = (
  cashflows: CashflowDisplay[]
): Map<string, number> => {
  return exceptionStatistic(cashflows.flatMap((c) => c.exceptions));
};

export const submitResultStatistic = (
  results: ExceptionBundleActionResult[]
) => {
  const state: {
    success: string[];
    failed: string[];
  } = {
    success: [],
    failed: [],
  };
  results.forEach((r) => {
    if (r.status === 200) {
      state.success.push(r.cashflowId);
    } else {
      state.failed.push(r.cashflowId);
    }
  });
  return state;
};
