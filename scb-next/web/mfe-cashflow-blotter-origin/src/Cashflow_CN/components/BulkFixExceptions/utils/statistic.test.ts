import { mockMultipleGraphqlDetails1 } from "src/Cashflow_CN/test/mockData/cashflowDetails";

import { mockCashflowDisplay } from "../test/mockData/cashflows";
import { exceptionStatistic, exceptionStatisticByDisplayCashflows, submitResultStatistic } from "./statistic";

describe('statistic', () => {
  it("exceptionStatistic", () => {
    const res = exceptionStatistic(mockMultipleGraphqlDetails1[0].ratanException!);
    expect(res.get("GSAM Client")).toBe(1);
  });
  it("exceptionStatisticByDisplayCashflows", () => {
    const res = exceptionStatisticByDisplayCashflows([
        mockCashflowDisplay
    ]);
    expect(res.size).toBe(2);
  });
  it("submitResultStatistic", () => {
    const res = submitResultStatistic([
        {
            cashflowId: "test_cashflow_id",
            status: 200,
            errorCode: "",
            errorMessage: "SUCCESS",
        },
    ]);
    expect(res.success.length).toBe(1);
  });
});