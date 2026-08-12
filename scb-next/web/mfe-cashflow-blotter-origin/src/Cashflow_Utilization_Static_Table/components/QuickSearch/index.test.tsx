import { fireEvent, render } from "@testing-library/react";
import {
  UTILIZATION_STATIC_BLOTTER_QUICK_SEARCH_CLEAR_BTN,
  UTILIZATION_STATIC_BLOTTER_QUICK_SEARCH_SEARCH_BTN,
} from "src/Root/analysis/const";

import { QuickSearch } from "./index";

const mockDispatch = vi.fn();
vi.mock("../../store", async () => ({
  ...(await vi.importActual("../../store")),
  useAppDispatch: () => mockDispatch,
}));

vi.mock("Import/ratancomponents", async () => ({
  ItemsComponent: ({ onChange }: any) => (
    <input
      data-testid="quick-search-input"
      onChange={(e) => onChange("testKey", e.target.value)}
    />
  ),
  MuiDialog: ({ children }) => <>{children}</>,
}));

vi.mock("./config", async () => ({
  default: [],
  quickSearchItems: [{ label: "Test", key: "testKey" }],
  quickSearchLabelWidth: 100,
  quickSearchFormWidth: 200,
}));

vi.mock("@mui/material", async () => ({
  ...(await vi.importActual("@mui/material")),
  useMediaQuery: vi.fn(),
}));

describe("QuickSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call dispatch when clearSearchCriterias is triggered", () => {
    const { getByTestId } = render(<QuickSearch />);
    fireEvent.change(getByTestId("quick-search-input"), {
      target: { value: "abc" },
    });
    fireEvent.click(
      getByTestId(UTILIZATION_STATIC_BLOTTER_QUICK_SEARCH_CLEAR_BTN)
    );
    expect(mockDispatch).toBeCalled();
  });

  it("should call dispatch when onQuery is triggered", () => {
    const useMediaQueryMock = require("@mui/material").useMediaQuery;
    useMediaQueryMock.mockReturnValue(true);

    const { getByTestId } = render(<QuickSearch />);
    fireEvent.change(getByTestId("quick-search-input"), {
      target: { value: "abc" },
    });
    fireEvent.click(
      getByTestId(UTILIZATION_STATIC_BLOTTER_QUICK_SEARCH_SEARCH_BTN)
    );
    expect(mockDispatch).toBeCalled();
  });

  it("should handle useMediaQuery returning false", () => {
    const useMediaQueryMock = require("@mui/material").useMediaQuery;
    useMediaQueryMock.mockReturnValue(false);

    const { getByTestId } = render(<QuickSearch />);
    fireEvent.change(getByTestId("quick-search-input"), {
      target: { value: "abc" },
    });
    fireEvent.click(
      getByTestId(UTILIZATION_STATIC_BLOTTER_QUICK_SEARCH_SEARCH_BTN)
    );
    expect(mockDispatch).toBeCalled();
  });
});
