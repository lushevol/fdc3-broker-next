import { renderWithProviders } from "src/test/test-utils";

import ThemeProvider from "../../../../Root/common/component/MfeThemeProvider";
import { mockCashflow1 } from "../../../test/mockData/cashflow";
import preloadState from "../../store/state";
import { ViewTradeDetailsWrap } from "./ViewTradeDetailsWrap";

afterAll(() => {
  jest.clearAllMocks();
});

describe("Cashflow Details Dialog", () => {
  it("should be in the document", async () => {
    const { debug } = renderWithProviders(
      <ThemeProvider>
        <ViewTradeDetailsWrap />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          viewTradeDetailsWorkflow: {
            isOpenTradeDetails: true,
            data: mockCashflow1,
          },
        },
      }
    );
    debug();
  });
});
