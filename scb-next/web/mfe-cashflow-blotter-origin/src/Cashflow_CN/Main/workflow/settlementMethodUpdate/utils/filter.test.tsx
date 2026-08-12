import { hasPermission } from "Import/ratanutils";

import { ResultStatus } from "../type";
import {
  assignResultToCashflowDisplay,
  canBeSettlementMethodUpdate,
  cashflowEligibleFilter,
  hasSettlementMethodUpdatePermission,
  insufficientCashflowStates,
  isAvaliableTaxonomy,
  isAvaliableUtilCashflowStates,
  queryGraqlFilter,
  settlementMethodUpdateRightmenuConsistencyValidation,
  transformCashflowToDisplay,
} from "./filter";

vi.mock("Import/ratanutils", () => ({
  hasPermission: vi.fn(),
}));

afterAll(() => {
  vi.clearAllMocks();
});

const buildCashflow = (overrides: Partial<CNCashflow> = {}): CNCashflow =>
  ({
    Trade_Id: "7150113553",
    Settlement_Method: "GROSS",
    Cashflow: {
      Cashflow_Id: "007372111189",
      Cashflow_State: "READY",
      Cashflow_Sub_State: "NA",
      Cashflow_Sub_State_Type: "NA",
      Payment_Amount: "98000.0",
      Payment_Currency: "USD",
      Payment_Date: "2026-04-13",
      Pay_Receive_Indicator: "Receive",
    },
    Entity: {
      Booking_Entity_SCI_FMCODE: "SCB SAUDI*RYD",
      Counterparty_SCI_FMCODE: "SCB DUBAI DFC*DUB",
    },
    Instrument_Common: {
      ISDA_Taxonomy: "ForeignExchange:Forward",
    },
    Data_Flow: {
      Data_Source_System: "Stella",
    },
    ...overrides,
  } as CNCashflow);

describe("settlementMethodUpdateRightmenuConsistencyValidation", () => {
  it("should return valid when all cashflows have same Settlement_Method", () => {
    const cashflows = [
      buildCashflow({ Settlement_Method: "GROSS" }),
      buildCashflow({ Settlement_Method: "GROSS" }),
    ];
    const result =
      settlementMethodUpdateRightmenuConsistencyValidation(cashflows);
    expect(result.valid).toBe(true);
    expect(result.message).toBe("");
  });

  it("should return invalid when cashflows have different Settlement_Method", () => {
    const cashflows = [
      buildCashflow({ Settlement_Method: "GROSS" }),
      buildCashflow({ Settlement_Method: "UTIL" }),
    ];
    const result =
      settlementMethodUpdateRightmenuConsistencyValidation(cashflows);
    expect(result.valid).toBe(false);
    expect(result.message).toBe(
      "Settlement Method of selected cashflows are not the same"
    );
  });

  it("should return invalid when cashflows length > 100", () => {
    const cashflows = Array.from({ length: 101 }, () =>
      buildCashflow({ Settlement_Method: "GROSS" })
    );
    const result =
      settlementMethodUpdateRightmenuConsistencyValidation(cashflows);
    expect(result.valid).toBe(false);
    expect(result.message).toBe(
      "Limitation for bulk update is 100 cashflow records, please select no more than 100 records"
    );
  });

  it("should return valid when cashflows length is exactly 100", () => {
    const cashflows = Array.from({ length: 100 }, () =>
      buildCashflow({ Settlement_Method: "GROSS" })
    );
    const result =
      settlementMethodUpdateRightmenuConsistencyValidation(cashflows);
    expect(result.valid).toBe(true);
  });
});

describe("hasSettlementMethodUpdatePermission", () => {
  it("should return true when hasPermission returns true", () => {
    (hasPermission as vi.Mock).mockReturnValue(true);
    expect(hasSettlementMethodUpdatePermission()).toBe(true);
  });

  it("should return false when hasPermission returns false", () => {
    (hasPermission as vi.Mock).mockReturnValue(false);
    expect(hasSettlementMethodUpdatePermission()).toBe(false);
  });
});

describe("isAvaliableUtilCashflowStates", () => {
  it("should contain WAITING, READY, PASTDUE", () => {
    expect(isAvaliableUtilCashflowStates).toContain("WAITING");
    expect(isAvaliableUtilCashflowStates).toContain("READY");
    expect(isAvaliableUtilCashflowStates).toContain("PASTDUE");
  });
});

describe("isAvaliableTaxonomy", () => {
  it("should contain FORWARD, SPOT, SWAP taxonomy", () => {
    expect(isAvaliableTaxonomy).toContain("ForeignExchange:Forward");
    expect(isAvaliableTaxonomy).toContain("ForeignExchange:Spot");
    expect(isAvaliableTaxonomy).toContain("ForeignExchange:Swap");
  });
});

describe("insufficientCashflowStates", () => {
  it("should contain ERROR, SPOT, SWAP taxonomy", () => {
    expect(insufficientCashflowStates).toContain("ERROR");
    expect(insufficientCashflowStates).toContain("UTILIZED");
    expect(insufficientCashflowStates).toContain("PARTIALLY_UTILIZED");
  });
});

describe("canBeSettlementMethodUpdate", () => {
  beforeEach(() => {
    (hasPermission as vi.Mock).mockReturnValue(true);
  });

  it("should return true for valid GROSS cashflow (READY+NA+NA)", () => {
    const cashflow = buildCashflow();
    expect(canBeSettlementMethodUpdate(cashflow)).toBe(true);
  });

  it("should return true for valid GROSS cashflow (WAITING)", () => {
    const cashflow = buildCashflow({
      Cashflow: {
        ...buildCashflow().Cashflow!,
        Cashflow_State: "WAITING",
      },
    });
    expect(canBeSettlementMethodUpdate(cashflow)).toBe(true);
  });

  it("should return false for GROSS cashflow with non-NA Sub_State", () => {
    const cashflow = buildCashflow({
      Cashflow: {
        ...buildCashflow().Cashflow!,
        Cashflow_State: "READY",
        Cashflow_Sub_State: "SOME_STATE",
        Cashflow_Sub_State_Type: "NA",
      },
    });
    expect(canBeSettlementMethodUpdate(cashflow)).toBe(false);
  });

  it("should return true for valid UTIL cashflow (READY)", () => {
    const cashflow = buildCashflow({ Settlement_Method: "UTIL" });
    expect(canBeSettlementMethodUpdate(cashflow)).toBe(true);
  });

  it("should return true for valid UTIL cashflow (WAITING)", () => {
    const cashflow = buildCashflow({
      Settlement_Method: "UTIL",
      Cashflow: {
        ...buildCashflow().Cashflow!,
        Cashflow_State: "WAITING",
      },
    });
    expect(canBeSettlementMethodUpdate(cashflow)).toBe(true);
  });

  it("should return true for valid UTIL cashflow (PASTDUE)", () => {
    const cashflow = buildCashflow({
      Settlement_Method: "UTIL",
      Cashflow: {
        ...buildCashflow().Cashflow!,
        Cashflow_State: "PASTDUE",
      },
    });
    expect(canBeSettlementMethodUpdate(cashflow)).toBe(true);
  });

  it("should return false when taxonomy is not in allowed list", () => {
    const cashflow = buildCashflow({
      Instrument_Common: { ISDA_Taxonomy: "InterestRate:IRSwap:FixedFloat" },
    });
    expect(canBeSettlementMethodUpdate(cashflow)).toBe(false);
  });

  it("should return false when Data_Source_System is Ratan", () => {
    const cashflow = buildCashflow({
      Data_Flow: { Data_Source_System: "Ratan" },
    });
    expect(canBeSettlementMethodUpdate(cashflow)).toBe(false);
  });

  it("should return false when no permission", () => {
    (hasPermission as vi.Mock).mockReturnValue(false);
    const cashflow = buildCashflow();
    expect(canBeSettlementMethodUpdate(cashflow)).toBe(false);
  });

  it("should return true for GROSS cashflow with empty string Settlement_Method", () => {
    const cashflow = buildCashflow({ Settlement_Method: "" });
    expect(canBeSettlementMethodUpdate(cashflow)).toBe(true);
  });
});

describe("queryGraqlFilter", () => {
  it("should return filter with correct Trade_Id IN values", () => {
    const cashflows = [
      buildCashflow({ Trade_Id: "7150113553" }),
      buildCashflow({ Trade_Id: "7150113556" }),
    ];
    const result = queryGraqlFilter(cashflows);
    expect(result[0].field).toBe("Trade_Id");
    expect(result[0].operator).toBe("IN");
    expect(result[0].values).toContain("7150113553");
    expect(result[0].values).toContain("7150113556");
  });

  it("should filter out null/undefined Trade_Id", () => {
    const cashflows = [
      buildCashflow({ Trade_Id: "7150113553" }),
      buildCashflow({ Trade_Id: undefined }),
    ];
    const result = queryGraqlFilter(cashflows);
    expect(result[0].values).not.toContain(undefined);
    expect(result[0].values).toHaveLength(1);
  });

  it("should return empty values when all Trade_Id are null", () => {
    const cashflows = [buildCashflow({ Trade_Id: undefined })];
    const result = queryGraqlFilter(cashflows);
    expect(result[0].values).toHaveLength(0);
  });
});

describe("transformCashflowToDisplay", () => {
  it("should transform CNCashflow to CashflowDisplay correctly", () => {
    const cashflow = buildCashflow();
    const result = transformCashflowToDisplay(cashflow);
    expect(result.cashflowId).toBe("007372111189");
    expect(result.tradeId).toBe("7150113553");
    expect(result.settlementMethod).toBe("GROSS");
    expect(result.paymentAmount).toBe("98000.0");
    expect(result.cashflowStatus).toBe("READY");
    expect(result.entityCode).toBe("SCB SAUDI*RYD");
    expect(result.counterpartyCode).toBe("SCB DUBAI DFC*DUB");
    expect(result.currency).toBe("USD");
    expect(result.payRec).toBe("Receive");
    expect(result.valueDate).toBe("2026-04-13");
    expect(result.actionResult.status).toBe(ResultStatus.None);
    expect(result.actionResult.message).toBe("");
  });

  it("should handle undefined nested fields gracefully", () => {
    const cashflow = buildCashflow({
      Cashflow: undefined,
      Entity: undefined,
      Instrument_Common: undefined,
      Data_Flow: undefined,
    });
    const result = transformCashflowToDisplay(cashflow);
    expect(result.cashflowId).toBeUndefined();
    expect(result.currency).toBeUndefined();
    expect(result.entityCode).toBeUndefined();
  });
});

describe("assignResultToCashflowDisplay", () => {
  it("should assign SubmitSuccess when result success is true", () => {
    const cashflow = transformCashflowToDisplay(buildCashflow());
    const results = [
      {
        cashflowIds: ["007372111189"],
        success: true,
        errorMessage: "",
        tradeId: "7150113553",
      },
    ];
    const updated = assignResultToCashflowDisplay([cashflow], results);
    expect(updated[0].actionResult.status).toBe(ResultStatus.SubmitSuccess);
    expect(updated[0].actionResult.message).toBe("");
  });

  it("should assign SubmitFailed when result success is false", () => {
    const cashflow = transformCashflowToDisplay(buildCashflow());
    const results = [
      {
        cashflowIds: ["007372111189"],
        success: false,
        errorMessage: "Action not allowed.",
        tradeId: "7150113553",
      },
    ];
    const updated = assignResultToCashflowDisplay([cashflow], results);
    expect(updated[0].actionResult.status).toBe(ResultStatus.SubmitFailed);
    expect(updated[0].actionResult.message).toBe("Action not allowed.");
  });

  it("should not change cashflow when no matching result found", () => {
    const cashflow = transformCashflowToDisplay(buildCashflow());
    const results = [
      {
        cashflowIds: ["999999999999"],
        success: true,
        errorMessage: "",
        tradeId: "9999",
      },
    ];
    const updated = assignResultToCashflowDisplay([cashflow], results);
    expect(updated[0].actionResult.status).toBe(ResultStatus.None);
  });

  it("should skip when cashflowId is undefined", () => {
    const cashflow = transformCashflowToDisplay(
      buildCashflow({
        Cashflow: { ...buildCashflow().Cashflow!, Cashflow_Id: undefined },
      })
    );
    const results = [
      {
        cashflowIds: ["007372111189"],
        success: true,
        errorMessage: "",
        tradeId: "7150113553",
      },
    ];
    const updated = assignResultToCashflowDisplay([cashflow], results);
    expect(updated[0].actionResult.status).toBe(ResultStatus.None);
  });
});

describe("cashflowEligibleFilter", () => {
  beforeEach(() => {
    (hasPermission as vi.Mock).mockReturnValue(true);
  });

  it("should put eligible cashflow into eligibleForUpdate", () => {
    const cashflows = [buildCashflow()];
    const result = cashflowEligibleFilter(cashflows);
    expect(result.eligibleForUpdate.cashflows).toHaveLength(1);
    expect(result.insufficientForUpdate.cashflows).toHaveLength(0);
  });

  it("should move all eligibleForUpdate cashflows to insufficientForUpdate when uniqueSettlementMethods.length > 1", () => {
    const cashflows = [
      buildCashflow({
        Trade_Id: "7150113553",
        Settlement_Method: "GROSS",
      }),
      buildCashflow({
        Trade_Id: "7150113556",
        Settlement_Method: "UTIL",
        Cashflow: {
          ...buildCashflow().Cashflow!,
          Cashflow_State: "READY",
        },
      }),
    ];

    const result = cashflowEligibleFilter(cashflows);

    expect(result.eligibleForUpdate.cashflows).toHaveLength(0);

    expect(result.insufficientForUpdate.cashflows).toHaveLength(2);

    result.insufficientForUpdate.cashflows.forEach((c) => {
      expect(c.insufficientReason).toBe(
        "Settlement Method values are not consistent across cashflows in the same trade"
      );
    });
  });

  it("should NOT move cashflows when uniqueSettlementMethods.length === 1", () => {
    const cashflows = [
      buildCashflow({ Trade_Id: "7150113553", Settlement_Method: "GROSS" }),
      buildCashflow({ Trade_Id: "7150113556", Settlement_Method: "GROSS" }),
    ];

    const result = cashflowEligibleFilter(cashflows);

    expect(result.eligibleForUpdate.cashflows).toHaveLength(2);
    expect(result.insufficientForUpdate.cashflows).toHaveLength(0);
  });
});
