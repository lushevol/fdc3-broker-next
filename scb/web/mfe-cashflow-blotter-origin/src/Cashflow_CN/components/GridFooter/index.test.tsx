import { configureStore, createAction,createReducer } from "@reduxjs/toolkit";
import {
  fireEvent,
  render,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { CASHFLOW_BLOTTER_RESIZE_BTN } from "src/Root/analysis/const";

import GridFooter from "./index";
jest.mock("Import/ratancomponents", () => {
  const FilterTags = () => <></>;
  const MuiDialog = (props) => <section>{props.children}</section>;
  const MuiPortalDialog = (props) => <section>{props.children}</section>;
  const useViewName = () => {
    return { viewName: "view name" };
  };
  return {
    FilterTags,
    MuiDialog,
    MuiPortalDialog,
    useViewName,
  };
});

jest.mock("src/Root/common/utils/featureFlagController", () => ({
  featureScopedEnabled: () => true,
}));

jest.mock("src/Cashflow_CN/Main/store/actions", () => {
  return {
    queryNextPageCashflowList: jest.fn(() => jest.fn(() => Promise.resolve())),
    setLoadNextPage: jest.fn(() => ({
      type: "test",
      data: false,
    })),
  };
});

describe("GirdFooter component", () => {
  it("default render", () => {
    process.env.MFE_APP_PREFIX_STYLE = "cashflow";
    const cashflowGridEvent = {
      api: {
        autoSizeAllColumns: jest.fn(),
        setGridOption: jest.fn(),
        getDisplayedRowCount: jest.fn(),
      },
    };
    const store = configureStore({
      reducer: {
        cashflowGridEvent: createReducer(cashflowGridEvent, (builder) => {
          builder.addCase(createAction("INIT"), (state) => state);
        }),
        cashflowListPagination: createReducer(
          { totalHits: 10, lastPage: false },
          (builder) => {
            builder.addCase(createAction("INIT"), (state) => state);
          }
        ),
      },
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <GridFooter />
      </Provider>
    );
    expect(getByTestId("gird-footer-total-hits")).toHaveTextContent("10");

    const resizeBtn = getByTestId(CASHFLOW_BLOTTER_RESIZE_BTN);
    expect(resizeBtn).toBeInTheDocument();
    fireEvent.click(resizeBtn);
    expect(cashflowGridEvent.api.autoSizeAllColumns).toHaveBeenCalled();

  });
});
