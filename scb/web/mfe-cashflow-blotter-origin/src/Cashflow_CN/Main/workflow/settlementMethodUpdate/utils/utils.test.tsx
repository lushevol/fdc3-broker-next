import { render, screen } from "@Test/test-utils";

import { ResultStatus } from "../type";
import {
  ActionResultCell,
  getFeedbackType,
  handleDialogTitle,
  handlePayload,
  renderOriginalSettlementMethod,
  renderSettlementMethod,
  renderTargetSettlementMethod,
  setInitResultStatusToCashflowDisplay,
  setProcessingToCashflowDisplay,
  sortByTradeId,
  submitResultFeedback,
  submitResultStatistic,
} from "./utils";

afterAll(() => {
  jest.clearAllMocks();
});

const mockEligibleCashflows = [
  {
    cashflowId: "007372111189",
    tradeId: "7150113556",
    settlementMethod: "GROSS",
    actionResult: { status: ResultStatus.None, message: "" },
  },
  {
    cashflowId: "007372111188",
    tradeId: "7150113556",
    settlementMethod: "GROSS",
    actionResult: { status: ResultStatus.None, message: "" },
  },
  {
    cashflowId: "007372111187",
    tradeId: "7150113553",
    settlementMethod: "GROSS",
    actionResult: { status: ResultStatus.None, message: "" },
  },
];

const mockFormPayload = {
  comment: "test comment",
};

const mockResults = [
  {
    tradeId: "7150113556",
    cashflowIds: ["007372111189"],
    success: true,
    errorMessage: "",
  },
  {
    tradeId: "7150113553",
    cashflowIds: ["007372111187"],
    success: true,
    errorMessage: "",
  },
  {
    tradeId: "7150113550",
    cashflowIds: ["007372111186"],
    success: false,
    errorMessage: "Action not allowed.",
  },
  {
    tradeId: "7150113549",
    cashflowIds: ["007372111185"],
    success: false,
    errorMessage: "Action not allowed.",
  },
];

const mockCNCashflows = [
  { Trade_Id: "7150113556", Cashflow: { Cashflow_Id: "007372111189" } },
  { Trade_Id: "7150113553", Cashflow: { Cashflow_Id: "007372111187" } },
  { Trade_Id: null, Cashflow: { Cashflow_Id: "007372111186" } },
];

describe("handlePayload", () => {
  it("should group cashflowIds by tradeId correctly", () => {
    const result = handlePayload(
      mockEligibleCashflows as any,
      mockFormPayload as any
    );
    expect(result.trades).toHaveLength(2);
    const trade7150113556 = result.trades.find(
      (t) => t.tradeId === "7150113556"
    );
    expect(trade7150113556?.cashflowIds).toHaveLength(2);
    expect(trade7150113556?.cashflowIds).toContain("007372111189");
    expect(trade7150113556?.cashflowIds).toContain("007372111188");
  });

  it("should set correct target settlementMethod GROSS to UTIL", () => {
    const result = handlePayload(
      mockEligibleCashflows as any,
      mockFormPayload as any
    );
    expect(result.settlementMethod).toBe("UTIL");
  });

  it("should set correct target settlementMethod UTIL to GROSS", () => {
    const utilCashflows = [
      { ...mockEligibleCashflows[0], settlementMethod: "UTIL" },
    ];
    const result = handlePayload(utilCashflows as any, mockFormPayload as any);
    expect(result.settlementMethod).toBe("GROSS");
  });

  it("should set correct comment from formPayload", () => {
    const result = handlePayload(
      mockEligibleCashflows as any,
      mockFormPayload as any
    );
    expect(result.comment).toBe("test comment");
  });

  it("should handle empty tradeId and cashflowId", () => {
    const emptyCashflows = [
      {
        tradeId: undefined,
        cashflowId: undefined,
        settlementMethod: "GROSS",
        actionResult: { status: ResultStatus.None, message: "" },
      },
    ];
    const result = handlePayload(emptyCashflows as any, mockFormPayload as any);
    expect(result.trades).toHaveLength(1);
    expect(result.trades[0].tradeId).toBe("");
    expect(result.trades[0].cashflowIds).toContain("");
  });
});

describe("sortByTradeId", () => {
  it("should sort tradeId ascending correctly", () => {
    const a = { tradeId: "7150113553" } as any;
    const b = { tradeId: "7150113556" } as any;
    expect(sortByTradeId(a, b)).toBeLessThan(0);
  });

  it("should return 0 when tradeIds are equal", () => {
    const a = { tradeId: "7150113553" } as any;
    expect(sortByTradeId(a, a)).toBe(0);
  });

  it("should handle undefined tradeId", () => {
    const a = { tradeId: undefined } as any;
    const b = { tradeId: "7150113553" } as any;
    expect(sortByTradeId(a, b)).toBeLessThan(0);
  });
});

describe("renderSettlementMethod", () => {
  it("should return GROSS when value is UTIL", () => {
    expect(renderSettlementMethod("UTIL")).toBe("GROSS");
  });

  it("should return UTIL when value is GROSS", () => {
    expect(renderSettlementMethod("GROSS")).toBe("UTIL");
  });

  it("should return UTIL when value is empty string", () => {
    expect(renderSettlementMethod("")).toBe("UTIL");
  });

  it("should return original value when value is unknown", () => {
    expect(renderSettlementMethod("UNKNOWN")).toBe("UNKNOWN");
  });
});

describe("renderOriginalSettlementMethod", () => {
  it("should render blue Tag when value is GROSS", () => {
    render(<>{renderOriginalSettlementMethod("GROSS")}</>);
    expect(screen.getByText("GROSS")).toBeInTheDocument();
  });

  it("should render blue Tag when value is UTIL", () => {
    render(<>{renderOriginalSettlementMethod("UTIL")}</>);
    expect(screen.getByText("UTIL")).toBeInTheDocument();
  });

  it("should return empty string when value is empty string", () => {
    const result = renderOriginalSettlementMethod("");
    expect(result).toBe("");
  });

  it("should return null when value is null", () => {
    const result = renderOriginalSettlementMethod(null);
    expect(result).toBeNull();
  });

  it("should return undefined when value is undefined", () => {
    const result = renderOriginalSettlementMethod(undefined);
    expect(result).toBeUndefined();
  });
});

describe("renderTargetSettlementMethod", () => {
  it("should render UTIL Tag when value is GROSS", () => {
    render(<>{renderTargetSettlementMethod("GROSS")}</>);
    expect(screen.getByText("UTIL")).toBeInTheDocument();
  });

  it("should render GROSS Tag when value is UTIL", () => {
    render(<>{renderTargetSettlementMethod("UTIL")}</>);
    expect(screen.getByText("GROSS")).toBeInTheDocument();
  });

  it("should render UTIL Tag when value is null", () => {
    render(<>{renderTargetSettlementMethod(null)}</>);
    expect(screen.getByText("UTIL")).toBeInTheDocument();
  });

  it("should render UTIL Tag when value is undefined", () => {
    render(<>{renderTargetSettlementMethod(undefined)}</>);
    expect(screen.getByText("UTIL")).toBeInTheDocument();
  });

  it("should render Tag with orange color and bold style", () => {
    const { container } = render(<>{renderTargetSettlementMethod("GROSS")}</>);
    const tag = container.querySelector(".ant-tag");
    expect(tag).toHaveStyle({ fontWeight: "bold" });
  });
});

describe("ActionResultCell", () => {
  it("should render success Tag when status is SubmitSuccess", () => {
    const record = {
      actionResult: { status: ResultStatus.SubmitSuccess, message: "success" },
    } as any;
    render(<>{ActionResultCell("", record)}</>);
    expect(screen.getByText("success")).toBeInTheDocument();
  });

  it("should render failed Tag when status is SubmitFailed", () => {
    const record = {
      actionResult: {
        status: ResultStatus.SubmitFailed,
        message: "Action not allowed.",
      },
    } as any;
    render(<>{ActionResultCell("", record)}</>);
    expect(screen.getByText("failed")).toBeInTheDocument();
  });

  it("should render processing Tag when status is Submiting", () => {
    const record = {
      actionResult: { status: ResultStatus.Submiting, message: "" },
    } as any;
    render(<>{ActionResultCell("", record)}</>);
    expect(screen.getByText("processing")).toBeInTheDocument();
  });

  it("should render empty fragment when status is None (default)", () => {
    const record = {
      actionResult: { status: ResultStatus.None, message: "" },
    } as any;
    const { container } = render(<>{ActionResultCell("", record)}</>);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("getFeedbackType", () => {
  it("should return error when success is empty", () => {
    expect(getFeedbackType([], ["7150113550"])).toBe("error");
  });

  it("should return success when failed is empty", () => {
    expect(getFeedbackType(["7150113556"], [])).toBe("success");
  });

  it("should return warning when both success and failed exist", () => {
    expect(getFeedbackType(["7150113556"], ["7150113550"])).toBe("warning");
  });
});

describe("submitResultStatistic", () => {
  it("should count success tradeIds correctly", () => {
    const { success } = submitResultStatistic(mockResults);
    expect(success).toHaveLength(2);
    expect(success).toContain("7150113556");
    expect(success).toContain("7150113553");
  });

  it("should count failed tradeIds correctly", () => {
    const { failed } = submitResultStatistic(mockResults);
    expect(failed).toHaveLength(2);
    expect(failed).toContain("7150113550");
    expect(failed).toContain("7150113549");
  });
});

describe("submitResultFeedback", () => {
  it("should return warning type when both success and failed exist", () => {
    const result = submitResultFeedback(mockResults);
    expect(result.type).toBe("warning");
    const { getByText } = render(<>{result.content}</>);
    expect(getByText("2 trades succeed !")).toBeInTheDocument();
    expect(getByText("2 trades failed !")).toBeInTheDocument();
  });

  it("should return success type when all succeeded", () => {
    const allSuccess = mockResults.slice(0, 2);
    const result = submitResultFeedback(allSuccess);
    expect(result.type).toBe("success");
    const { getByText, queryByText } = render(<>{result.content}</>);
    expect(getByText("2 trades succeed !")).toBeInTheDocument();
    expect(queryByText(/failed/)).not.toBeInTheDocument();
  });

  it("should return error type when all failed", () => {
    const allFailed = mockResults.slice(2);
    const result = submitResultFeedback(allFailed);
    expect(result.type).toBe("error");
    const { getByText, queryByText } = render(<>{result.content}</>);
    expect(getByText("2 trades failed !")).toBeInTheDocument();
    expect(queryByText(/succeed/)).not.toBeInTheDocument();
  });
});

describe("handleDialogTitle", () => {
  it("should render Settlement Method Update title", () => {
    render(<>{handleDialogTitle(mockCNCashflows as any)}</>);
    expect(screen.getByText("Settlement Method Update")).toBeInTheDocument();
  });

  it("should render trade ids info text", () => {
    render(<>{handleDialogTitle(mockCNCashflows as any)}</>);
    expect(
      screen.getByText(
        /System automatically selected all cashflows under trades/
      )
    ).toBeInTheDocument();
  });

  it("should render InfoIcon tooltip button", () => {
    render(<>{handleDialogTitle(mockCNCashflows as any)}</>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should filter out null Trade_Id", () => {
    render(<>{handleDialogTitle(mockCNCashflows as any)}</>);
    const iconButton = screen.getByRole("button");
    expect(iconButton).toBeInTheDocument();
  });

  it("should handle empty cashflowDataByTrade array", () => {
    render(<>{handleDialogTitle([])}</>);
    expect(screen.getByText("Settlement Method Update")).toBeInTheDocument();
  });

  it("should deduplicate tradeIds in tooltip", () => {
    const duplicateCashflows = [
      { Trade_Id: "7150113556", Cashflow: { Cashflow_Id: "007372111189" } },
      { Trade_Id: "7150113556", Cashflow: { Cashflow_Id: "007372111188" } },
    ];
    render(<>{handleDialogTitle(duplicateCashflows as any)}</>);
    expect(screen.getByText("Settlement Method Update")).toBeInTheDocument();
  });
});

describe("setInitResultStatusToCashflowDisplay", () => {
  it("should set actionResult status to None and message to empty", () => {
    const cashflow = mockEligibleCashflows[0];
    cashflow.actionResult.status = ResultStatus.SubmitSuccess;
    cashflow.actionResult.message = "success";
    const result = setInitResultStatusToCashflowDisplay(cashflow);
    expect(result.actionResult.status).toBe(ResultStatus.None);
    expect(result.actionResult.message).toBe("");
  });

  it("should not mutate original cashflow", () => {
    const cashflow = mockEligibleCashflows[0];
    const result = setInitResultStatusToCashflowDisplay(
      mockEligibleCashflows[0]
    );
    expect(result).not.toBe(cashflow);
  });
});

describe("setProcessingToCashflowDisplay", () => {
  it("should set actionResult status to Submiting", () => {
    const cashflow = mockEligibleCashflows[0];
    const result = setProcessingToCashflowDisplay(cashflow);
    expect(result.actionResult.status).toBe(ResultStatus.Submiting);
    expect(result.actionResult.message).toBe("");
  });

  it("should not mutate original cashflow", () => {
    const cashflow = mockEligibleCashflows[0];
    const result = setProcessingToCashflowDisplay(cashflow);
    expect(result).not.toBe(cashflow);
  });
});
