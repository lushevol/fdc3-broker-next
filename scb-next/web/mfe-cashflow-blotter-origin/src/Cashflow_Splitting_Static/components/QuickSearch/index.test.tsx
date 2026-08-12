import { fireEvent, render } from "@testing-library/react";
import { AUTO_SPLIT_STATIC_BLOTTER_QUICK_SEARCH_CLEAR_BTN, AUTO_SPLIT_STATIC_BLOTTER_QUICK_SEARCH_SEARCH_BTN } from "src/Root/analysis/const";

import { QuickSearch } from "./index";

// mock dispatch
const mockDispatch = vi.fn();
vi.mock("src/Cashflow_Splitting_Static/store", async () => ({
  ...(await vi.importActual("src/Cashflow_Splitting_Static/store")),
  useAppDispatch: () => mockDispatch,
}));

// mock ItemsComponent
vi.mock("Import/ratancomponents", async () => ({
  ItemsComponent: ({ onChange }: any) => (
    <input
      data-testid="quick-search-input"
      onChange={e => onChange("testKey", e.target.value)}
    />
  ),
  MuiDialog: ({ children }) => <>{children}</>,
}));

// mock config
vi.mock("src/Cashflow_Splitting_Static/Main/config/ratanConfig", async () => ({
  cashflow: {
    quickSearchItemsSplitting: [
      { disabled: false, label: "Test", key: "testKey" }
    ],
    quickSearchLabelWidth: 100,
    quickSearchFormWidth: 200,
  }
}));

describe("QuickSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call dispatch when clearSearchCriterias is triggered", () => {
    const { getByTestId } = render(<QuickSearch />);
    fireEvent.change(getByTestId("quick-search-input"), { target: { value: "abc" } });
    fireEvent.click(getByTestId(AUTO_SPLIT_STATIC_BLOTTER_QUICK_SEARCH_SEARCH_BTN));
    expect(mockDispatch).toBeCalled();
    fireEvent.click(getByTestId(AUTO_SPLIT_STATIC_BLOTTER_QUICK_SEARCH_CLEAR_BTN));
    expect(mockDispatch).toBeCalled();
  });

  it("should call dispatch when onQuery is triggered", () => {
    const { getByTestId } = render(<QuickSearch />);
    fireEvent.change(getByTestId("quick-search-input"), { target: { value: "abc" } });
    fireEvent.click(getByTestId(AUTO_SPLIT_STATIC_BLOTTER_QUICK_SEARCH_SEARCH_BTN));
    expect(mockDispatch).toBeCalled();
  });
});