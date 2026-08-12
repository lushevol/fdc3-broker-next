import { debug } from "console";
import { renderWithProviders } from "src/test/test-utils";

import ThemeProvider from "../../../../Root/common/component/MfeThemeProvider";
import { mockCashflow1 } from "../../../test/mockData/cashflow";
import preloadState from "../../store/state";
import { CashflowDetailsWrap } from "./CashflowDetailsWrap";

afterAll(() => {
  vi.clearAllMocks();
});

vi.mock("src/Cashflow_CN/services/graphql", () => {
  return {
    queryCounterPartyDetails_CN: vi.fn(async () => ({
      graphCashFlowDetails: {
        results: [],
      },
    })),
    queryCashFlowDetails: vi.fn(async () => ({
      graphCashFlowDetails: {
        results: [],
      },
    })),
  };
});

describe("Cashflow Details Dialog", () => {
  it("should be in the document", async () => {
    renderWithProviders(
      <ThemeProvider>
        <CashflowDetailsWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          viewCashflowDetailsWorkflow: {
            isOpenCashflowDetails: true,
            defaultTabKey: "1",
            data: mockCashflow1,
            refreshCashflow: async () => {},
          },
        },
      }
    );
    debug();
  });
});
