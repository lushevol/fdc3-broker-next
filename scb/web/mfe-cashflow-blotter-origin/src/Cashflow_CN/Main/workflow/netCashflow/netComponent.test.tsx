import defaultPreloadedState from "src/Cashflow_CN/Main/store/state";
import { renderWithProviders } from "src/test/test-utils";

import ThemeProvider from "../../../../Root/common/component/MfeThemeProvider";
import { mockCashflow1 } from "../../../test/mockData/cashflow";
import { NetComponent } from "./netComponent";

describe("Net Component", () => {
  it("should be in the document", async () => {
    const { container } = renderWithProviders(
      <ThemeProvider>
        <NetComponent />
      </ThemeProvider>,
      {
        preloadedState: {
          ...defaultPreloadedState,
          netWorkflow: {
            isNetCashflowDialogVisible: true,
            data: mockCashflow1,
          },
        },
      }
    );
    expect(container.firstChild).not.toBeEmptyDOMElement();
  });
});
