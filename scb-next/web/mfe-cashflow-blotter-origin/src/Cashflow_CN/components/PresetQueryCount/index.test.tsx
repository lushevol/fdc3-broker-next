import { fireEvent } from "@testing-library/react";
import defaultPreloadedState from "src/Cashflow_CN/Main/store/state";
import { PRESET_QUERY_COUNT_VD_TMR_PO, PRESET_QUERY_COUNT_VD_TODAY_PO } from "src/Root/analysis/const";
import { renderWithProviders } from "src/test/test-utils";

import PresetQueryCount from "./index";

afterAll(() => {
  vi.clearAllMocks();
});

vi.mock("src/Cashflow_CN/services/graphql", () => {
  return {
    queryCashflow: vi.fn(async () => ({
      cashflowUltraQuery: {
        results: [],
      },
    })),
  };
});

describe("Preset Query Count", () => {
  it("should be in the document", async () => {
    const { queryByTestId } = renderWithProviders(
      <PresetQueryCount />,
      {
        preloadedState: defaultPreloadedState,
      }
    );
    const vd_tmr_po = queryByTestId(PRESET_QUERY_COUNT_VD_TMR_PO);
    expect(vd_tmr_po).toBeInTheDocument();
    fireEvent.click(vd_tmr_po!);

    const vd_today_po = queryByTestId(PRESET_QUERY_COUNT_VD_TODAY_PO);
    expect(vd_today_po).toBeInTheDocument();
    fireEvent.click(vd_today_po!);
  });
});
