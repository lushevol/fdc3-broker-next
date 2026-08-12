import defaultPreloadedState from "src/Cashflow_CN/Main/store/state";
import { renderWithProviders } from "src/test/test-utils";

import CashflowDetailsDialog from "./index";
const rowDetails = require("../CashflowDetails/data/cashflows.json");

afterAll(() => {
  jest.clearAllMocks();
});

jest.mock("../../services", () => ({
  getCountryInfo: jest.fn(async () => ({})),
  getSwiftMessageByCashflowId: jest.fn(async () => ["swift test"]),
  getEBBSAcountingDetail: jest.fn(async () => [{}]),
  checkAuthLimit: jest.fn(async () => ({ success: false })),
}));

jest.mock("../../services/graphql", () => ({
  queryCashFlowDetails: jest.fn(async () => ({
    graphCashFlowDetails: {},
  })),
  queryCounterPartyDetails_CN: jest.fn(async () => ({
    fmEntity: {},
  })),
}));

describe("DetailsDialog component", () => {
  it("should be in the document", async () => {
    const details = JSON.parse(
      JSON.stringify(rowDetails.data.cashflows.results[0])
    );
    const onClose = jest.fn();
    const onQueryCashflow = jest.fn();
    const onOpenTradeDetails = jest.fn(() => Promise.resolve());
    const refreshCashflow = async () =>
      Promise.resolve({
        cashflows: { results: [...rowDetails.data.cashflows.results] },
        cashflowsNew: { results: [...rowDetails.data.cashflows.results] },
      });
    const { queryAllByTestId } = renderWithProviders(
        <CashflowDetailsDialog
          details={details}
          onClose={onClose}
          defaultActiveKey="1"
          isOpen={true}
          refreshCashflow={refreshCashflow}
          onQueryCashflow={onQueryCashflow}
          onOpenTradeDetails={onOpenTradeDetails}
        />,
        {
          preloadedState:{
            defaultPreloadedState
          }
        }
    );

    const close = queryAllByTestId("MuiDialog-close-btn");
    expect(close[0]).toBeInTheDocument();
    close[0].click();
  });
});
