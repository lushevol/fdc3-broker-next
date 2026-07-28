import { mockMultipleGraphqlDetails1 } from "src/Cashflow_CN/test/mockData/cashflowDetails";

import { BulkResultStatus, CashflowDisplay } from "../../type";

export const mockCashflowDisplay: CashflowDisplay = {
  cashflowId: "test_cashflow_id",
  exceptions: [...(mockMultipleGraphqlDetails1[0].ratanException ?? [])],
  hasInsufficientException: false,
  isSubmitByYou: false,
  bulkActionResult: {
    status: BulkResultStatus.None,
    message: "",
  },
  rawCashflow: mockMultipleGraphqlDetails1[0],
};
