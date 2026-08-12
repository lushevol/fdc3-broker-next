import { render } from "@testing-library/react";
import { CASHFLOW_DETAILS_TAB } from "src/Cashflow_CN/components/CashflowDetails/detailsBody";
import defaultPreloadedState from "src/Cashflow_CN/Main/store/state";
import { renderWithProviders } from "src/test/test-utils";

import DetailsBody from "./DetailsBodyWithTheme";
import DetailsHeader from "./DetailsHeaderWithTheme";

vi.mock("src/Cashflow_CN/services/graphql", () => {
  return {
    queryCashFlowDetails: vi.fn(async () => ({
      graphCashFlowDetails: {
        results: [],
      },
    })),
  };
});

describe("Cashflow Details component", () => {
  it("should render Cashflow Details Body", async () => {
    const details = {
      Cashflow: {
        Cashflow_Id: "10000",
      },
    };
    const props = {
      cnTrade: false,
      isOpen: true,
      details: details,
      onClose: vi.fn(),
      onQueryCashflow: vi.fn(),
      onOpenTradeDetails: vi.fn(),
      activeKey: "0",
      onSwiftTabsVisibleChange: vi.fn(),
    };
    const { container } = renderWithProviders(<DetailsBody {...props} />, {
      preloadedState: { defaultPreloadedState }
    });
    expect(container).toBeInTheDocument();
    expect(container.textContent).toContain("10000");
  });
  it("should render Cashflow Details Header", async () => {
    const props = {
      activeKey: CASHFLOW_DETAILS_TAB,
      hiddenTabs: new Set<string>(),
      onTabClick: vi.fn(),
    };
    const { container } = renderWithProviders(<DetailsHeader {...props} />, {
      preloadedState: { defaultPreloadedState }
    });
    expect(container).toBeInTheDocument();
    expect(container.textContent).toContain("Cashflow Detail");
  });
})