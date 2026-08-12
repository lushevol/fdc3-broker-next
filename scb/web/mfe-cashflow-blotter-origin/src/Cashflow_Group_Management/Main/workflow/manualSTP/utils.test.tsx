import { render } from "@testing-library/react";
import React from "react";

import { BlotterDataType } from "../../store/interface";
import {
  getManualSTPWarningContent,
  isBlotterRowsContainsInvalidTradeStatus,
  isNewCashflowWithPendingStatus,
} from "./utils";

const buildRow = (overrides: Partial<BlotterDataType> = {}): BlotterDataType =>
  ({
    Is_Trade_Validated: true,
    Status: "PENDING",
    Business_Event: "New",
    ...overrides,
  } as BlotterDataType);

describe("isBlotterRowsContainsInvalidTradeStatus", () => {
  it("should return false when all rows have Is_Trade_Validated=true", () => {
    const datas = [buildRow(), buildRow()];
    expect(isBlotterRowsContainsInvalidTradeStatus(datas)).toBe(false);
  });

  it("should return true when at least one row has Is_Trade_Validated=false", () => {
    const datas = [buildRow(), buildRow({ Is_Trade_Validated: false })];
    expect(isBlotterRowsContainsInvalidTradeStatus(datas)).toBe(true);
  });

  it("should return true when all rows have Is_Trade_Validated=false", () => {
    const datas = [
      buildRow({ Is_Trade_Validated: false }),
      buildRow({ Is_Trade_Validated: false }),
    ];
    expect(isBlotterRowsContainsInvalidTradeStatus(datas)).toBe(true);
  });

  it("should return false when array is empty", () => {
    expect(isBlotterRowsContainsInvalidTradeStatus([])).toBe(false);
  });
});

describe("isNewCashflowWithPendingStatus", () => {
  it("should return true when all rows are PENDING and at least one is New", () => {
    const datas = [
      buildRow({ Status: "PENDING", Business_Event: "New" }),
      buildRow({ Status: "PENDING", Business_Event: "Amend" }),
    ];
    expect(isNewCashflowWithPendingStatus(datas)).toBe(true);
  });

  it("should return false when not all rows are PENDING", () => {
    const datas = [
      buildRow({ Status: "PENDING", Business_Event: "New" }),
      buildRow({ Status: "PROCESSED", Business_Event: "New" }),
    ];
    expect(isNewCashflowWithPendingStatus(datas)).toBe(false);
  });

  it("should return false when all rows are PENDING but none is New", () => {
    const datas = [
      buildRow({ Status: "PENDING", Business_Event: "Amend" }),
      buildRow({ Status: "PENDING", Business_Event: "Cancel" }),
    ];
    expect(isNewCashflowWithPendingStatus(datas)).toBe(false);
  });
});

describe("getManualSTPWarningContent", () => {
  it("should always render first two paragraphs", () => {
    const datas = [buildRow({ Is_Trade_Validated: true, Business_Event: "Amend" })];
    const { getByText } = render(getManualSTPWarningContent(datas));

    expect(
      getByText(
        "Please only perform bulk manual STP when informed by support team."
      )
    ).toBeInTheDocument();
    expect(
      getByText(/Total 1 cashflow\(s\) selected/)
    ).toBeInTheDocument();
    expect(
      getByText("1. The siblings cashflows are not recieved by Ratan yet.")
    ).toBeInTheDocument();
  });

  it("should render invalid trade status warning (p2) when hasInvalidTradeStatus=true", () => {
    const datas = [buildRow({ Is_Trade_Validated: false })];
    const { getByText } = render(getManualSTPWarningContent(datas));

    expect(
      getByText(
        "2. The parent trade of these cashflows are not validated yet."
      )
    ).toBeInTheDocument();
  });

  it("should NOT render invalid trade status warning when hasInvalidTradeStatus=false", () => {
    const datas = [buildRow({ Is_Trade_Validated: true, Business_Event: "Amend" })];
    const { queryByText } = render(getManualSTPWarningContent(datas));

    expect(
      queryByText(
        "2. The parent trade of these cashflows are not validated yet."
      )
    ).not.toBeInTheDocument();
  });

  it("should render pending new cashflow warning as p2 when only hasPendingNewCashflow=true", () => {
    const datas = [
      buildRow({ Is_Trade_Validated: true, Status: "PENDING", Business_Event: "New" }),
    ];
    const { getByText } = render(getManualSTPWarningContent(datas));

    expect(
      getByText(/2\. Withdrawal cashflows need to be delivered/)
    ).toBeInTheDocument();
  });

  it("should render pending new cashflow warning as p3 when both conditions are true", () => {
    const datas = [
      buildRow({ Is_Trade_Validated: false, Status: "PENDING", Business_Event: "New" }),
    ];
    const { getByText } = render(getManualSTPWarningContent(datas));

    expect(
      getByText(
        "2. The parent trade of these cashflows are not validated yet."
      )
    ).toBeInTheDocument();
    expect(
      getByText(/3\. Withdrawal cashflows need to be delivered/)
    ).toBeInTheDocument();
  });

  it("should NOT render pending new cashflow warning when hasPendingNewCashflow=false", () => {
    const datas = [buildRow({ Is_Trade_Validated: true, Business_Event: "Amend" })];
    const { queryByText } = render(getManualSTPWarningContent(datas));

    expect(
      queryByText(/Withdrawal cashflows need to be delivered/)
    ).not.toBeInTheDocument();
  });

  it("should show correct datas.length in content", () => {
    const datas = [buildRow(), buildRow(), buildRow()];
    const { getByText } = render(getManualSTPWarningContent(datas));

    expect(getByText(/Total 3 cashflow\(s\) selected/)).toBeInTheDocument();
  });

  it("should return JSX.Element", () => {
    const result = getManualSTPWarningContent([buildRow()]);
    expect(React.isValidElement(result)).toBe(true);
  });
});