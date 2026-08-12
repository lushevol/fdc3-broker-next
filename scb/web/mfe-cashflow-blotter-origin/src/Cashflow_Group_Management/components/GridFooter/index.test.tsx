import { configureStore, createAction,createReducer } from "@reduxjs/toolkit";
import { fireEvent,render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BLOTTER_PAGE_SIZE } from "src/Cashflow_Group_Management/Main/store/state";
import { GROUP_BLOTTER_RESIZE_BTN } from "src/Root/analysis/const";

import GridFooter from "./index";

jest.mock("Import/ratancomponents", () => {
  const FilterTags = () => <></>;
  const MuiDialog = (props) => <section>{props.children}</section>;
  const useViewName = () => {
    return { viewName: "view name" };
  };
  return {
    FilterTags,
    MuiDialog,
    useViewName,
  };
});

describe("GirdFooter component", () => {
  it("default render", () => {
    process.env.MFE_APP_PREFIX_STYLE = "cashflow";
    const groupBlotter = {
      blotterGridEvent: {
        api: {
          autoSizeAllColumns: jest.fn(),
          getDisplayedRowCount: jest.fn().mockReturnValue(0),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        },
      },
      blotterPagination: {
        lastPage: false,
        totalHits: 0,
        pageNo: 1,
        pageSize: BLOTTER_PAGE_SIZE,
      },
      blotterDatas: [],
    };
    const store = configureStore({
      reducer: {
        groupBlotter: createReducer(groupBlotter, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
        }),
      },
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <GridFooter />
      </Provider>
    );
    expect(getByTestId("gird-footer-total-hits")).toHaveTextContent("0/0");

    const resizeBtn = getByTestId(GROUP_BLOTTER_RESIZE_BTN);
    expect(resizeBtn).toBeInTheDocument();
    fireEvent.click(resizeBtn);
  });
});
