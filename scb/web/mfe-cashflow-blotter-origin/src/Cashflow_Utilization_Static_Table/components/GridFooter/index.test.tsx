import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";

import GridFooter from "./index";

describe("GirdFooter component", () => {
  afterEach(() => {
    jest.useRealTimers();
  });
  it("default render", () => {
    jest.useFakeTimers();
    process.env.MFE_APP_PREFIX_STYLE = "cashflow";
    const pagination = {
      totalHits: 0,
      rowData: [],
    };
    const aggrid = {
      aggridEvent: {
        api: {
          exportDataAsCsv: jest.fn(),
          exportDataAsExcel: jest.fn(),
        },
      },
    };
    const store = configureStore({
      reducer: {
        pagination: createReducer(pagination, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
        }),
        aggrid: createReducer(aggrid, (builder) => {
          builder.addCase(createAction("INIT"), (state, action) => state);
        }),
      },
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <GridFooter />
      </Provider>
    );
    expect(getByTestId("utilization-gridFooter")).toHaveTextContent("0/0");
  });
});
