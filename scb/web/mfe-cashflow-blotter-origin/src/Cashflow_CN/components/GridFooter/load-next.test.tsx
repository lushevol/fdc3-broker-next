import { configureStore, createAction,createReducer } from "@reduxjs/toolkit";
import { fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { queryNextPageCashflowList } from "src/Cashflow_CN/Main/store/actions";
import { CASHFLOW_BLOTTER_AUTO_LOAD_NEXT_BTN } from "src/Root/analysis/const";
import { render } from "src/test/test-utils";

import GridFooter from ".";

jest.mock("src/Cashflow_CN/Main/store/actions", () => {
  return {
    queryNextPageCashflowList: jest.fn(() => jest.fn(() => Promise.resolve())),
    setCashflowListQueryPageSize: jest.fn(),
  };
});

it("click event", () => {
    jest.mocked(queryNextPageCashflowList);
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
    const loadBtn = getByTestId(CASHFLOW_BLOTTER_AUTO_LOAD_NEXT_BTN);
    expect(loadBtn).toBeInTheDocument();
    fireEvent.click(loadBtn);
    expect(queryNextPageCashflowList).toHaveBeenCalled();
});