import { debug } from "console";
import { renderWithProviders } from "src/test/test-utils";

import ThemeProvider from "../../../../Root/common/component/MfeThemeProvider";
import { mockCashflow1 } from "../../../test/mockData/cashflow";
import preloadState from "../../store/state";
import { UnNetComponent } from "./unNetComponent";

afterAll(() => {
  jest.clearAllMocks();
});

describe("Un-Net Component", () => {
  it("should be in the document", async () => {
    renderWithProviders(
      <ThemeProvider>
        <UnNetComponent />
      </ThemeProvider>,
      {
        preloadedState: {
          ...preloadState,
          unNetWorkflow: {
            isOpenComponentCashflow: true,
            isVerify: true,
            data: mockCashflow1,
          },
        },
      }
    );
    debug();
  });
});
