import { fireEvent, render } from "@testing-library/react";
import {
  UTILIZATION_STATIC_BLOTTER_QUICK_SEARCH_CLEAR_BTN,
  UTILIZATION_STATIC_BLOTTER_QUICK_SEARCH_SEARCH_BTN,
} from "src/Root/analysis/const";

import { QuickSearch } from "./index";

const mockDispatch = jest.fn();
jest.mock("../../store", () => ({
  ...jest.requireActual("../../store"),
  useAppDispatch: () => mockDispatch,
}));

jest.mock("Import/ratancomponents", () => ({
  ItemsComponent: ({ onChange }: any) => (
    <input
      data-testid="quick-search-input"
      onChange={(e) => onChange("testKey", e.target.value)}
    />
  ),
  MuiDialog: ({ children }) => <>{children}</>,
}));

jest.mock("./config", () => ({
  quickSearchItems: [{ label: "Test", key: "testKey" }],
  quickSearchLabelWidth: 100,
  quickSearchFormWidth: 200,
}));

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn(),
}));

describe("QuickSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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