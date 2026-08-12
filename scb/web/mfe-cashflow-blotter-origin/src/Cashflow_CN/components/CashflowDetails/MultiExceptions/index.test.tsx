import { fireEvent, render } from "@testing-library/react";
import { MULTI_EXCEPTION_APPROVE_BTN } from "src/Root/analysis/const";

import { IsPendingRequestContext } from "../detailsBody";
import MultiException, { getFormConfig } from "./index";

const cashflowDetailsData = require("./data/cashflowDetails.json");
const counterpartyDetailsV2 = require("./data/counterpartyDetailsV2.json");

describe("MultiExceptions component", () => {
  it("should render MultiExceptions correctly", async () => {
    const refreshCashflow = jest.fn(async () => JSON.parse(JSON.stringify(cashflowDetailsData)));
    const mockCounterPartyDetails = counterpartyDetailsV2;
    const { getByTestId } = render(
      <IsPendingRequestContext.Provider value={false}>
        <MultiException
          cashflowDetails={cashflowDetailsData}
          refreshCashflow={refreshCashflow}
          counterPartyDetails={mockCounterPartyDetails.fmEntity}
        />
      </IsPendingRequestContext.Provider>
    );
    expect(getByTestId(MULTI_EXCEPTION_APPROVE_BTN)).toBeInTheDocument();
    fireEvent.click(getByTestId(MULTI_EXCEPTION_APPROVE_BTN));
  });
});

describe("getFormConfig", () => {
  it("updates group titles when swiftType is MT202", () => {
    const config = getFormConfig({ swiftType: "MT202" } as any);

    const orderingGroup = config.find((g) => g.title?.startsWith("52a:"));
    const beneficiaryGroup = config.find((g) => g.title?.startsWith("58a:"));

    expect(orderingGroup?.title).toBe("52a: Ordering Institution");
    expect(beneficiaryGroup?.title).toBe(
      "58a: Beneficiary Customer"
    );
  });

  it("returns base config when swiftType is missing", () => {
    const config = getFormConfig();
    const beneficiaryGroup = config.find((g) => g.title?.startsWith("58a:"));
    expect(beneficiaryGroup?.title).toBe("58a: Beneficiary Customer");
  });
});
