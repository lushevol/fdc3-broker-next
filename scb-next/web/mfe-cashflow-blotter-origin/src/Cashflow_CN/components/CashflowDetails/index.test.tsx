import defaultPreloadedState from "src/Cashflow_CN/Main/store/state";
import { renderWithProviders } from "src/test/test-utils";

import CashflowDetailsDialog from "./index";
import rowDetails from "../CashflowDetails/data/cashflows.json";

afterAll(() => {
  vi.clearAllMocks();
});

vi.mock("../../services", () => ({
  getCountryInfo: vi.fn(async () => ({})),
  getSwiftMessageByCashflowId: vi.fn(async () => ["swift test"]),
  getEBBSAcountingDetail: vi.fn(async () => [{}]),
  checkAuthLimit: vi.fn(async () => ({ success: false })),
}));

vi.mock("../../services/graphql", () => ({
  queryCashFlowDetails: vi.fn(async () => ({
    graphCashFlowDetails: {},
  })),
  queryCounterPartyDetails_CN: vi.fn(async () => ({
    fmEntity: {},
  })),
}));

describe("DetailsDialog component", () => {
  it("should be in the document", async () => {
    const details = JSON.parse(
      JSON.stringify(rowDetails.data.cashflows.results[0])
    );
    const onClose = vi.fn();
    const onQueryCashflow = vi.fn();
    const onOpenTradeDetails = vi.fn(() => Promise.resolve());
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
